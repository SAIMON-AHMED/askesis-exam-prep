/**
 * Exports the curated question bank to JSON for the backend to seed into the database,
 * so mock tests can be assembled instantly without calling an AI model.
 *
 * Run: npx tsx scripts/exportQuestionBank.ts
 * Output: backend/app/data/question_bank.json
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { EXAMS } from "../src/lib/examConstants";
import { getCurriculumByExamId } from "../src/lib/curriculumData";
import { getQuestionsByTopic, getQuestionsByExamId } from "../src/lib/practiceQuestionsData";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

/** The exam service spreads difficulty 2-4, so map the bank's labels onto that range. */
const DIFFICULTY: Record<string, number> = { Easy: 2, Medium: 3, Hard: 4 };

interface BankQuestion {
  exam_type: string;
  topic: string;
  difficulty: number;
  question_text: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation: string;
  source_id: string;
}

const out: BankQuestion[] = [];
const skipped = { essay: 0, noOptions: 0, badAnswer: 0 };

for (const exam of Object.values(EXAMS)) {
  const curriculum = getCurriculumByExamId(exam.id);
  const bank = getQuestionsByExamId(exam.id);

  for (const section of curriculum.sections) {
    for (const topic of section.topics) {
      // Mock tests post curriculum topic NAMES, so store the name the backend will query by.
      if (!bank[topic.id]) continue;

      for (const q of getQuestionsByTopic(exam.id, topic.id)) {
        if (q.isEssay) {
          skipped.essay++;
          continue;
        }
        if (!q.options || q.options.length < 2) {
          skipped.noOptions++;
          continue;
        }
        const answerIndex = q.correctAnswer ?? -1;
        if (answerIndex < 0 || answerIndex >= q.options.length) {
          skipped.badAnswer++;
          continue;
        }

        const options: Record<string, string> = {};
        q.options.forEach((opt, i) => {
          options[OPTION_LETTERS[i]] = opt;
        });

        // The exam schema has no passage field, so keep it with the question text.
        const questionText = q.passage ? `${q.passage}\n\n${q.question}` : q.question;

        out.push({
          exam_type: exam.displayName,
          topic: topic.name,
          difficulty: DIFFICULTY[q.difficulty] ?? 3,
          question_text: questionText,
          options,
          correct_answer: OPTION_LETTERS[answerIndex],
          explanation: q.explanation,
          source_id: q.id,
        });
      }
    }
  }
}

const outDir = join("..", "backend", "app", "data");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "question_bank.json"), JSON.stringify(out, null, 1));

const byExam = out.reduce<Record<string, number>>((acc, q) => {
  acc[q.exam_type] = (acc[q.exam_type] ?? 0) + 1;
  return acc;
}, {});

console.log("exported question_bank.json");
for (const [exam, n] of Object.entries(byExam)) console.log(`  ${exam.padEnd(8)} ${n}`);
console.log(`  TOTAL    ${out.length}`);
console.log(
  `skipped: ${skipped.essay} essay, ${skipped.noOptions} without options, ${skipped.badAnswer} bad answer index`
);
