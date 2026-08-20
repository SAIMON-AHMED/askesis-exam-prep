/**
 * Verifies every passage-dependent question ends up with its passage attached.
 *
 * Run: npx tsx scripts/passageCoverage.ts
 */
import {
  getQuestionsByTopic,
  getQuestionsByExamId,
  questionCarriesPassage,
} from "../src/lib/practiceQuestionsData";

const EXAMS = ["sat", "act", "gre", "gmat", "shsat", "regents"];

const REFERS_TO_PASSAGE = /\b(the|this) (passage|argument)\b|\baccording to the (passage|author)\b/i;

let total = 0;
let dependent = 0;
let resolved = 0;
let orphaned = 0;
const orphanSamples: string[] = [];

for (const examId of EXAMS) {
  for (const topicId of Object.keys(getQuestionsByExamId(examId))) {
    for (const q of getQuestionsByTopic(examId, topicId)) {
      if (q.isEssay) continue;
      total++;

      const selfContained = questionCarriesPassage(q.question);
      if (selfContained) continue;

      // Depends on external context if it talks about a passage but doesn't include one.
      if (!REFERS_TO_PASSAGE.test(q.question) && !q.passage) continue;

      dependent++;
      if (q.passage) {
        resolved++;
      } else {
        orphaned++;
        if (orphanSamples.length < 12) {
          orphanSamples.push(`${examId}/${topicId}/${q.id}: ${q.question.slice(0, 80)}`);
        }
      }
    }
  }
}

if (orphanSamples.length) {
  console.log("UNRESOLVED (question references a passage but none attached):");
  for (const s of orphanSamples) console.log("  " + s);
  console.log("");
}

console.log("--- PASSAGE ATTACHMENT ---");
console.log(`total non-essay questions:      ${total}`);
console.log(`passage-dependent questions:    ${dependent}`);
console.log(`  passage attached:             ${resolved}`);
console.log(`  still orphaned:               ${orphaned}`);
console.log(
  `attachment rate: ${dependent === 0 ? "n/a" : ((resolved / dependent) * 100).toFixed(1) + "%"}`
);

process.exit(orphaned > 0 ? 1 : 0);
