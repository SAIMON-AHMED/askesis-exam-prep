/**
 * Reports, per exam, which curriculum topics actually have questions in the exported bank.
 * A topic with no bank questions falls back to slow AI generation at runtime.
 *
 * Run: npx tsx scripts/bankCoverage.ts
 */
import { EXAMS } from "../src/lib/examConstants";
import { getCurriculumByExamId } from "../src/lib/curriculumData";
import { getQuestionsByExamId, getQuestionsByTopic } from "../src/lib/practiceQuestionsData";

let totalTopics = 0;
let emptyTopics = 0;

for (const exam of Object.values(EXAMS)) {
  const curriculum = getCurriculumByExamId(exam.id);
  const bank = getQuestionsByExamId(exam.id);
  const bankKeys = new Set(Object.keys(bank));

  const rows: string[] = [];
  let examCovered = 0;
  let examTopics = 0;

  for (const section of curriculum.sections) {
    for (const topic of section.topics) {
      examTopics++;
      totalTopics++;
      const usable = bankKeys.has(topic.id)
        ? getQuestionsByTopic(exam.id, topic.id).filter(
            (q) => !q.isEssay && q.options && q.options.length >= 2
          ).length
        : 0;

      if (usable > 0) examCovered++;
      else {
        emptyTopics++;
        const reason = bankKeys.has(topic.id) ? "essay-only" : "NO BANK KEY";
        rows.push(`      ${topic.id.padEnd(30)} ${String(usable).padStart(3)}  <- ${reason}`);
      }
    }
  }

  const flag = examCovered === examTopics ? "OK " : "GAP";
  console.log(
    `${flag} ${exam.displayName.padEnd(8)} ${examCovered}/${examTopics} topics have questions`
  );
  for (const r of rows) console.log(r);
  if (rows.length) {
    console.log(`      bank keys present: ${[...bankKeys].join(", ")}`);
  }
}

console.log(`\ntopics with no usable questions: ${emptyTopics} of ${totalTopics}`);
