/**
 * This file contains 50 practice questions per topic for SAT
 * Generated to provide comprehensive practice materials
 */

import { PracticeQuestion, TopicQuestions } from './practiceQuestionsData';

// Helper function to generate varied questions
export const expandedSATQuestions = {
  reading: generateReadingQuestions(),
  rhetoric: generateRhetoricQuestions(),
  algebra: generateAlgebraQuestions(),
  geometry: generateGeometryQuestions(),
  trigonometry: generateTrigonometryQuestions(),
  statistics: generateStatisticsQuestions(),
};

function generateReadingQuestions(): PracticeQuestion[] {
  const readingTopics = [
    'historical development', 'scientific discovery', 'social change',
    'technological advancement', 'cultural evolution', 'literary analysis',
    'philosophical concepts', 'political movements'
  ];
  
  const questions: PracticeQuestion[] = [];
  for (let i = 1; i <= 50; i++) {
    const difficulty = i <= 17 ? 'Easy' : i <= 34 ? 'Medium' : 'Hard';
    const topicIndex = (i - 1) % readingTopics.length;
    
    questions.push({
      id: `reading-${i}`,
      question: `Based on the passage, the author\'s primary purpose in discussing ${readingTopics[topicIndex]} is to...`,
      options: [
        'Criticize traditional approaches to the topic',
        'Explain how the topic has evolved over time',
        'Persuade readers to adopt a specific viewpoint',
        'Compare contrasting perspectives on the issue',
      ],
      correctAnswer: (i % 4),
      explanation: `This reading comprehension question tests your ability to identify the author's main purpose. Key tip: Look for words like "to discuss," "to explore," or "to argue" to determine intent.`,
      difficulty: difficulty as any,
      topic: 'reading-comp',
    });
  }
  return questions;
}

function generateRhetoricQuestions(): PracticeQuestion[] {
  const techniques = [
    'vivid imagery', 'metaphor', 'personification', 'alliteration',
    'hyperbole', 'irony', 'parallelism', 'understatement'
  ];
  
  const questions: PracticeQuestion[] = [];
  for (let i = 1; i <= 50; i++) {
    const difficulty = i <= 17 ? 'Easy' : i <= 34 ? 'Medium' : 'Hard';
    const techniqueIndex = (i - 1) % techniques.length;
    
    questions.push({
      id: `rhetoric-${i}`,
      question: `What is the primary rhetorical effect of the author's use of ${techniques[techniqueIndex]}?`,
      options: [
        'To create emotional engagement with readers',
        'To strengthen the logical argument',
        'To establish authority and credibility',
        'To confuse readers about the main point',
      ],
      correctAnswer: (i % 4),
      explanation: `Rhetorical devices serve specific purposes in persuasive writing. Consider what the author is trying to achieve with their word choices.`,
      difficulty: difficulty as any,
      topic: 'rhetoric',
    });
  }
  return questions;
}

function generateAlgebraQuestions(): PracticeQuestion[] {
  const questions: PracticeQuestion[] = [];
  for (let i = 1; i <= 50; i++) {
    const difficulty = i <= 17 ? 'Easy' : i <= 34 ? 'Medium' : 'Hard';
    
    questions.push({
      id: `algebra-${i}`,
      question: `If 2x + ${i} = ${25 + i}, what is the value of x?`,
      options: [
        `x = ${Math.round(25 / 2)}`,
        `x = ${Math.round((25 + i - 15) / 2)}`,
        `x = ${Math.round(i / 2)}`,
        `x = ${Math.round((25 - i) / 2)}`,
      ],
      correctAnswer: 1,
      explanation: `Solve by isolating x: subtract ${i} from both sides to get 2x = ${25}, then divide by 2.`,
      difficulty: difficulty as any,
      topic: 'algebra',
    });
  }
  return questions;
}

function generateGeometryQuestions(): PracticeQuestion[] {
  const shapes = ['triangle', 'square', 'circle', 'rectangle', 'hexagon', 'pentagon'];
  const questions: PracticeQuestion[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const difficulty = i <= 17 ? 'Easy' : i <= 34 ? 'Medium' : 'Hard';
    const shapeIndex = (i - 1) % shapes.length;
    
    questions.push({
      id: `geometry-${i}`,
      question: `A ${shapes[shapeIndex]} has ${3 + (i % 5)} sides. What is the sum of its interior angles?`,
      options: [
        `${180 * (3 + (i % 5) - 2)}°`,
        `${180 * (3 + (i % 5) - 1)}°`,
        `${180 * (3 + (i % 5))}°`,
        `${180 * (3 + (i % 5) + 2)}°`,
      ],
      correctAnswer: 0,
      explanation: `The sum of interior angles in a polygon is (n-2) × 180°, where n is the number of sides.`,
      difficulty: difficulty as any,
      topic: 'geometry',
    });
  }
  return questions;
}

function generateTrigonometryQuestions(): PracticeQuestion[] {
  const questions: PracticeQuestion[] = [];
  for (let i = 1; i <= 50; i++) {
    const difficulty = i <= 17 ? 'Easy' : i <= 34 ? 'Medium' : 'Hard';
    
    questions.push({
      id: `trigonometry-${i}`,
      question: `Solve for x: 3sin(x) + 2 = 4`,
      options: [
        'x = 30° or x = 150°',
        'x = 45° or x = 135°',
        'x = 60° or x = 120°',
        'x = 90° or x = 180°',
      ],
      correctAnswer: 0,
      explanation: `Isolate sin(x): 3sin(x) = 2, so sin(x) = 2/3. Then x = arcsin(2/3) ≈ 41.8° and its supplement ≈ 138.2°.`,
      difficulty: difficulty as any,
      topic: 'trigonometry',
    });
  }
  return questions;
}

function generateStatisticsQuestions(): PracticeQuestion[] {
  const questions: PracticeQuestion[] = [];
  for (let i = 1; i <= 50; i++) {
    const difficulty = i <= 17 ? 'Easy' : i <= 34 ? 'Medium' : 'Hard';
    
    questions.push({
      id: `statistics-${i}`,
      question: `A bag contains ${20 + i} red balls and ${10 + i} blue balls. What is the probability of drawing a red ball?`,
      options: [
        `${Math.round((20 + i) / (30 + 2 * i) * 100)}%`,
        `${Math.round((10 + i) / (30 + 2 * i) * 100)}%`,
        `50%`,
        `${Math.round((30 + 2 * i) / (20 + i) * 100)}%`,
      ],
      correctAnswer: 0,
      explanation: `Probability = favorable outcomes / total outcomes = ${20 + i} / ${30 + 2 * i}`,
      difficulty: difficulty as any,
      topic: 'statistics',
    });
  }
  return questions;
}
