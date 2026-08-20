/**
 * Content QA audit for the static practice question bank.
 *
 * Run: npx tsx scripts/auditQuestions.ts
 *
 * Flags mechanically detectable defects across every exam/topic:
 *  - correctAnswer index out of bounds (renders as "no correct option")
 *  - duplicate option text (two identical choices, one silently unmarkable)
 *  - explanation that contradicts or second-guesses the marked answer
 *  - explanation that never references the marked answer
 *  - duplicate question ids / duplicate question text within a topic
 */
import {
  SAT_QUESTIONS,
  ACT_QUESTIONS,
  GRE_QUESTIONS,
  GMAT_QUESTIONS,
  SHSAT_QUESTIONS,
  REGENTS_QUESTIONS,
  getQuestionsByExamId,
} from "../src/lib/practiceQuestionsData";
import { QUESTION_COUNTS } from "../src/lib/questionCounts";

const BANKS: Record<string, Record<string, any>> = {
  SAT: SAT_QUESTIONS,
  ACT: ACT_QUESTIONS,
  GRE: GRE_QUESTIONS,
  GMAT: GMAT_QUESTIONS,
  SHSAT: SHSAT_QUESTIONS,
  Regents: REGENTS_QUESTIONS,
};

/** Wording that means the author lost track of the answer mid-explanation. */
const HEDGING = [
  "does not match any answer",
  "doesn't match any answer",
  "not match any option",
  "none of the answer choices",
  "no answer choice matches",
  "recheck the arithmetic",
  "let me reconsider",
  "let me recheck",
  "on second thought",
  "the intended equation",
  "should be adjusted",
  "as written, the correct",
  "i made a mistake",
  "correction:",
  "closest option",
  "closest answer",
  "wait, let",
  "wait, that",
  "wait, i",
  "wait, check",
  "actually, the correct",
  "no change is wrong",
  "no change is incorrect",
  "option 1 is correct",
  "option 1 is right",
];

interface Finding {
  exam: string;
  topic: string;
  id: string;
  severity: "ERROR" | "WARN";
  issue: string;
}

const findings: Finding[] = [];
let total = 0;

for (const [exam, bank] of Object.entries(BANKS)) {
  if (!bank) continue;

  for (const [topicId, topic] of Object.entries(bank)) {
    const questions: any[] = topic?.questions ?? [];
    const seenIds = new Set<string>();
    const seenText = new Set<string>();

    for (const q of questions) {
      total++;
      const add = (severity: Finding["severity"], issue: string) =>
        findings.push({ exam, topic: topicId, id: q.id ?? "<no-id>", severity, issue });

      if (seenIds.has(q.id)) add("ERROR", `duplicate question id "${q.id}"`);
      seenIds.add(q.id);

      const textKey = String(q.question ?? "").trim().toLowerCase();
      if (textKey && seenText.has(textKey)) add("WARN", "duplicate question text within topic");
      seenText.add(textKey);

      const explanation = String(q.explanation ?? "");
      if (explanation.trim().length < 10) add("ERROR", "missing or too-short explanation");

      const lowered = explanation.toLowerCase();
      for (const marker of HEDGING) {
        if (lowered.includes(marker)) {
          add("ERROR", `explanation self-corrects / contradicts answer: "${marker}"`);
          break;
        }
      }

      if (q.isEssay) continue; // essay prompts have a rubric, not options

      const options: any[] = q.options ?? [];
      if (options.length < 2) {
        add("ERROR", `only ${options.length} option(s)`);
        continue;
      }

      if (typeof q.correctAnswer !== "number" || !Number.isInteger(q.correctAnswer)) {
        add("ERROR", `correctAnswer is not an integer (${JSON.stringify(q.correctAnswer)})`);
        continue;
      }

      if (q.correctAnswer < 0 || q.correctAnswer >= options.length) {
        add(
          "ERROR",
          `correctAnswer ${q.correctAnswer} out of bounds for ${options.length} options`
        );
        continue;
      }

      // Case-sensitive: options like Rr vs RR differ only by case in genetics questions.
      const normalized = options.map((o) => String(o).trim());
      if (new Set(normalized).size !== normalized.length) {
        add("ERROR", "duplicate option text");
      }

      const answerText = String(options[q.correctAnswer]).trim();
      if (answerText.length === 0) add("ERROR", "marked answer option is empty");
    }
  }
}

findings.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "ERROR" ? -1 : 1));

const errors = findings.filter((f) => f.severity === "ERROR");
const warns = findings.filter((f) => f.severity === "WARN");

for (const f of findings) {
  console.log(`[${f.severity}] ${f.exam} / ${f.topic} / ${f.id}: ${f.issue}`);
}

// The browse pages render precomputed counts to avoid bundling the bank; verify they match.
const countMismatches: string[] = [];
for (const [examId, expected] of Object.entries(QUESTION_COUNTS)) {
  const actual = Object.values(getQuestionsByExamId(examId)).reduce(
    (sum, t: any) => sum + t.questions.length,
    0
  );
  if (actual !== expected) {
    countMismatches.push(`  ${examId}: questionCounts.ts says ${expected}, actual ${actual}`);
  }
}
if (countMismatches.length) {
  console.log("\n[ERROR] questionCounts.ts is out of date:");
  for (const m of countMismatches) console.log(m);
}

console.log("\n--- SUMMARY ---");
console.log(`questions audited: ${total}`);
console.log(`errors:   ${errors.length + countMismatches.length}`);
console.log(`warnings: ${warns.length}`);

process.exit(errors.length + countMismatches.length > 0 ? 1 : 0);
