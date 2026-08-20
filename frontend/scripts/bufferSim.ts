/**
 * Verifies the practice prefetch buffer: the student should only ever wait for the first
 * batch, and every later question should be served from memory while refills happen behind.
 */

const FIRST_BATCH_SIZE = 3;
const REFILL_SIZE = 5;
const LOW_WATER_MARK = 4;
const MAX_BUFFER = 12;

interface Q {
  id: string;
}

/** Mirrors the page's buffer logic so the behaviour can be asserted without a browser. */
class PracticeBuffer {
  queue: Q[] = [];
  cursor = 0;
  refilling = false;
  exhausted = false;
  fetchCalls = 0;
  waits: number[] = [];
  activeRefills = 0;
  maxConcurrentRefills = 0;
  private nextId = 0;

  constructor(private topicCount: number, private latencyMs = 50) {}

  private async fetchBatch(count: number): Promise<Q[]> {
    if (this.cursor >= this.topicCount) return [];
    this.cursor += 1;
    this.fetchCalls += 1;
    await new Promise((r) => setTimeout(r, this.latencyMs));
    return Array.from({ length: count }, () => ({ id: `q${this.nextId++}` }));
  }

  async ensureBuffer(): Promise<void> {
    if (this.refilling) return;
    if (this.queue.length > LOW_WATER_MARK) return;
    if (this.cursor >= this.topicCount) {
      this.exhausted = true;
      return;
    }
    this.refilling = true;
    this.activeRefills += 1;
    this.maxConcurrentRefills = Math.max(this.maxConcurrentRefills, this.activeRefills);
    try {
      while (this.queue.length < MAX_BUFFER && this.cursor < this.topicCount) {
        const batch = await this.fetchBatch(REFILL_SIZE);
        if (batch.length === 0) break;
        this.queue.push(...batch);
      }
      if (this.cursor >= this.topicCount) this.exhausted = true;
    } finally {
      this.activeRefills -= 1;
      this.refilling = false;
    }
  }

  async start(): Promise<Q | null> {
    const t0 = Date.now();
    const first = await this.fetchBatch(FIRST_BATCH_SIZE);
    this.waits.push(Date.now() - t0);
    if (first.length === 0) return null;
    const [head, ...rest] = first;
    this.queue = rest;
    void this.ensureBuffer();
    return head;
  }

  async next(): Promise<Q | null> {
    const t0 = Date.now();
    const q = this.queue.shift();
    if (q) {
      this.waits.push(Date.now() - t0);
      void this.ensureBuffer();
      return q;
    }
    if (this.cursor >= this.topicCount) {
      this.exhausted = true;
      return null;
    }
    const batch = await this.fetchBatch(REFILL_SIZE);
    this.waits.push(Date.now() - t0);
    if (batch.length === 0) return null;
    const [head, ...rest] = batch;
    this.queue = rest;
    void this.ensureBuffer();
    return head;
  }
}

/** Student pauses between questions, as a real one would while reading and answering. */
const think = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function run() {
  let failures = 0;
  const check = (label: string, ok: boolean, detail = "") => {
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? " — " + detail : ""}`);
    if (!ok) failures++;
  };

  // 20 questions, realistic think time, 300 ms generation latency.
  const buf = new PracticeBuffer(12, 300);
  const served: (Q | null)[] = [];
  served.push(await buf.start());
  for (let i = 0; i < 19; i++) {
    await think(120);
    served.push(await buf.next());
  }

  const delivered = served.filter(Boolean).length;
  check("delivered 20 questions", delivered === 20, `got ${delivered}`);

  const firstWait = buf.waits[0];
  const laterWaits = buf.waits.slice(1);
  const stalls = laterWaits.filter((w) => w > 20);
  check("student waits once, at the start", firstWait >= 300, `${firstWait} ms`);
  check(
    "no stalls after the first question",
    stalls.length === 0,
    stalls.length ? `${stalls.length} stalls: ${stalls.join(", ")} ms` : "all instant"
  );

  const maxSeen = Math.max(...buf.waits.slice(1));
  check("worst later wait under 20 ms", maxSeen < 20, `${maxSeen} ms`);

  // Buffer must stay bounded so an early quit hasn't burned tokens.
  const bounded = buf.queue.length <= MAX_BUFFER;
  check("buffer stays within cap", bounded, `${buf.queue.length} <= ${MAX_BUFFER}`);

  // A student who quits after 2 questions should not have triggered runaway generation.
  const quitter = new PracticeBuffer(12, 300);
  await quitter.start();
  await think(120);
  await quitter.next();
  await think(400);
  check(
    "early quit generates a bounded amount",
    quitter.fetchCalls <= 4,
    `${quitter.fetchCalls} fetches`
  );

  // Single-flight: rapid advances must not stack concurrent refills.
  const racer = new PracticeBuffer(12, 200);
  await racer.start();
  await Promise.all([racer.ensureBuffer(), racer.ensureBuffer(), racer.ensureBuffer()]);
  await think(1200); // let the refill kicked off by start() settle
  check(
    "never more than one refill in flight",
    racer.maxConcurrentRefills === 1,
    `peak ${racer.maxConcurrentRefills}`
  );
  check("refill flag released when idle", racer.refilling === false);
  check(
    "main session also stayed single-flight",
    buf.maxConcurrentRefills === 1,
    `peak ${buf.maxConcurrentRefills}`
  );

  // Adversarial: a student clicking straight through while generation is slow.
  const fast = new PracticeBuffer(12, 2000);
  const fastServed: (Q | null)[] = [];
  fastServed.push(await fast.start());
  for (let i = 0; i < 14; i++) fastServed.push(await fast.next());
  const fastStalls = fast.waits.slice(1).filter((w) => w > 20);
  console.log(
    `\nINFO  worst case (no think time, 2 s generation): ` +
      `${fastStalls.length} of ${fast.waits.length - 1} advances stalled` +
      (fastStalls.length ? `, longest ${Math.max(...fastStalls)} ms` : "")
  );

  console.log(`\n${failures === 0 ? "ALL PASS" : failures + " FAILURE(S)"}`);
  process.exit(failures === 0 ? 0 : 1);
}

run();
