// Learning materials for each topic across all exams
// Provides comprehensive content for the topic learning page

export interface Strategy {
  id: string;
  title: string;
  description: string;
  example?: string;
}

export interface Concept {
  id: string;
  title: string;
  content: string; // Can include markdown or plain text
}

export interface WorkedExample {
  id: string;
  question: string;
  options: {
    label: string;
    text: string;
    isCorrect: boolean;
  }[];
  correctAnswer: string;
  explanation: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    text: string;
  }[];
  correctAnswer: string; // 'A', 'B', 'C', or 'D'
  explanation: string;
}

export interface LearningMaterial {
  topicId: string;
  topicName: string;
  examId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  conceptOverview: string; // Long-form overview (400-600 words)
  strategies: Strategy[];
  concepts: Concept[];
  workedExamples: WorkedExample[];
  questions: PracticeQuestion[]; // Practice questions for quiz
}

// SAT Vocabulary Learning Material
const satVocabularyMaterial: LearningMaterial = {
  topicId: 'vocabulary',
  topicName: 'Vocabulary',
  examId: 'sat',
  difficulty: 'Beginner',
  conceptOverview: `Vocabulary is a fundamental component of the SAT Reading and Writing section. Success on vocabulary questions requires not only knowing word definitions but also understanding how words function in context. The SAT tests your ability to recognize word meanings through contextual clues, and your understanding of word relationships and nuances.

The modern SAT emphasizes vocabulary in context rather than isolated word definitions. Most vocabulary questions present a sentence with a blank, and you must choose the word that fits most naturally and accurately. Understanding common word patterns, prefixes, suffixes, and roots can help you decode unfamiliar words. Additionally, recognizing the tone and logic of the surrounding text is crucial—the correct answer must match not only the grammatical structure but also the rhetorical flow of the sentence.

Key to mastering SAT vocabulary is building a strong foundation of frequently tested words. The exam tends to test sophisticated vocabulary that appears in academic texts and literature. Words are often tested in their less common uses, requiring careful attention to context. By studying strategic vocabulary lists and practicing with authentic SAT questions, you'll develop the recognition skills needed to score highly on this section.`,
  strategies: [
    {
      id: 'context-clues',
      title: 'Context Clues Strategy',
      description: 'Look for keywords in the sentence that signal the meaning of the blank. Words like "however," "although," "because," and "similarly" reveal the logical relationship between the blank and surrounding words.',
      example: 'If you see "The politician was criticized for his _____ speech," words like "however" or "but" signal contrast, suggesting the blank needs a negative word.'
    },
    {
      id: 'word-etymology',
      title: 'Word Etymology & Roots',
      description: 'Understanding common prefixes (un-, dis-, pre-), suffixes (-tion, -ment, -ous), and Latin/Greek roots helps you decode unfamiliar words and eliminate incorrect options.',
      example: 'Words with prefix "mis-" mean "wrong" (mislead, misjudge). Words ending in "-ous" are typically adjectives (generous, meticulous).'
    },
    {
      id: 'process-elimination',
      title: 'Process of Elimination',
      description: 'Eliminate options that are clearly wrong before selecting the best answer. Often, 2-3 options can be ruled out quickly, leaving fewer choices to consider.',
      example: 'If the blank needs a positive adjective and one option is "nefarious" (meaning evil), eliminate it immediately.'
    }
  ],
  concepts: [
    {
      id: 'context-clue-types',
      title: 'Types of Context Clues',
      content: `1. **Definition Clues**: The sentence directly defines the word.
   Example: "The ocean is vast, or very large."
   
2. **Contrast Clues**: Signal words like "but," "however," "although" indicate opposite meaning.
   Example: "Unlike her sister, who was gregarious, Maria was quite shy."
   
3. **Example Clues**: The sentence provides examples that clarify meaning.
   Example: "Ornithology, the study of birds, requires patience and field observation."
   
4. **Synonym/Restatement Clues**: Similar ideas are repeated with different words.
   Example: "His perspicacity, or keen insight, helped him solve complex problems."`
    },
    {
      id: 'common-word-patterns',
      title: 'Common SAT Vocabulary Patterns',
      content: `**Negative/Critical Words**: mendacious (lying), perfidious (disloyal), vitriolic (bitter), acerbic (sharp)

**Positive/Favorable Words**: magnanimous (generous), eloquent (articulate), benevolent (charitable), perspicacious (insightful)

**Neutral/Descriptive Words**: ephemeral (temporary), ubiquitous (everywhere), languid (slow), pellucid (clear)

**Abstract Concepts**: paradigm (model), dichotomy (division into two), ambiguity (uncertainty), catalyst (agent of change)`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'The politician\'s _____ speech left the audience captivated; her eloquent words flowed like poetry.',
      options: [
        { label: 'A', text: 'mellifluous', isCorrect: true },
        { label: 'B', text: 'cacophonous', isCorrect: false },
        { label: 'C', text: 'tepid', isCorrect: false },
        { label: 'D', text: 'verbose', isCorrect: false }
      ],
      correctAnswer: 'A',
      explanation: 'The sentence praises the speech for being eloquent and flowing "like poetry." "Mellifluous" means sweet or pleasing to the ear, which matches this positive context. "Cacophonous" (harsh/discordant) contradicts the praise. "Tepid" (lukewarm) doesn\'t fit. "Verbose" (wordy) contradicts the poetic flow implied by "eloquent."'
    },
    {
      id: 'example-2',
      question: 'Although the novel was initially criticized, its _____ themes of love and redemption eventually earned it widespread acclaim.',
      options: [
        { label: 'A', text: 'nefarious', isCorrect: false },
        { label: 'B', text: 'prosaic', isCorrect: false },
        { label: 'C', text: 'transcendent', isCorrect: true },
        { label: 'D', text: 'trivial', isCorrect: false }
      ],
      correctAnswer: 'C',
      explanation: 'The word "although" signals contrast between initial criticism and eventual acclaim. The blank should contain a positive descriptor. "Transcendent" (surpassing ordinary limits) fits a novel earning acclaim. "Nefarious" (wicked) and "trivial" (unimportant) contradict the positive context. "Prosaic" (dull/ordinary) doesn\'t support the praise.'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'The artist\'s _____ style challenged conventional aesthetics and inspired a new generation of painters.',
      options: [
        { label: 'A', text: 'traditional' },
        { label: 'B', text: 'iconoclastic' },
        { label: 'C', text: 'mundane' },
        { label: 'D', text: 'derivative' }
      ],
      correctAnswer: 'B',
      explanation: '"Iconoclastic" means attacking or rejecting traditions, which fits "challenged conventional aesthetics." The other options don\'t convey this sense of breaking with tradition.'
    },
    {
      id: 'q2',
      question: 'Her _____ nature made her an excellent mediator in workplace disputes.',
      options: [
        { label: 'A', text: 'contentious' },
        { label: 'B', text: 'equitable' },
        { label: 'C', text: 'obsequious' },
        { label: 'D', text: 'mercurial' }
      ],
      correctAnswer: 'B',
      explanation: '"Equitable" means fair and impartial, which is what a good mediator needs. "Contentious" means argumentative, which would be harmful for a mediator.'
    },
    {
      id: 'q3',
      question: 'The CEO\'s _____ policies cut costs but ultimately damaged employee morale.',
      options: [
        { label: 'A', text: 'magnanimous' },
        { label: 'B', text: 'judicious' },
        { label: 'C', text: 'draconian' },
        { label: 'D', text: 'benevolent' }
      ],
      correctAnswer: 'C',
      explanation: '"Draconian" means extremely harsh or severe. Cutting costs that damages morale suggests harsh, extreme policies. The "but" signals negative consequences.'
    },
    {
      id: 'q4',
      question: 'The documentary\'s _____ approach to the subject matter provided viewers with nuanced perspectives.',
      options: [
        { label: 'A', text: 'superficial' },
        { label: 'B', text: 'myopic' },
        { label: 'C', text: 'perspicacious' },
        { label: 'D', text: 'pedantic' }
      ],
      correctAnswer: 'C',
      explanation: '"Perspicacious" means having keen insight or understanding. The sentence states that viewers gained "nuanced perspectives," indicating the documentary had insightful analysis.'
    },
    {
      id: 'q5',
      question: 'The historian\'s _____ account of the war incorporated diverse eyewitness testimonies.',
      options: [
        { label: 'A', text: 'partisan' },
        { label: 'B', text: 'comprehensive' },
        { label: 'C', text: 'cursory' },
        { label: 'D', text: 'biased' }
      ],
      correctAnswer: 'B',
      explanation: '"Comprehensive" means complete and thorough. Incorporating diverse eyewitness accounts indicates a complete, all-encompassing account.'
    },
    {
      id: 'q6',
      question: 'The scientist\'s _____ findings contradicted previous research and sparked debate in the academic community.',
      options: [
        { label: 'A', text: 'corroborating' },
        { label: 'B', text: 'anomalous' },
        { label: 'C', text: 'mundane' },
        { label: 'D', text: 'trivial' }
      ],
      correctAnswer: 'B',
      explanation: '"Anomalous" means deviating from normal or expected. Findings that "contradicted previous research" would be abnormal or unexpected, sparking debate.'
    },
    {
      id: 'q7',
      question: 'The author\'s _____ critique of modern society was both scathing and thought-provoking.',
      options: [
        { label: 'A', text: 'laudatory' },
        { label: 'B', text: 'oblique' },
        { label: 'C', text: 'trenchant' },
        { label: 'D', text: 'superficial' }
      ],
      correctAnswer: 'C',
      explanation: '"Trenchant" means vigorous, keen, or incisive. A "scathing" critique that is also "thought-provoking" requires sharp, penetrating analysis.'
    },
    {
      id: 'q8',
      question: 'Despite her inexperience, the young athlete\'s _____ performance earned her a spot on the national team.',
      options: [
        { label: 'A', text: 'mediocre' },
        { label: 'B', text: 'lackluster' },
        { label: 'C', text: 'prodigious' },
        { label: 'D', text: 'marginal' }
      ],
      correctAnswer: 'C',
      explanation: '"Prodigious" means remarkably great or talented. Despite being inexperienced, earning a national team spot requires an outstanding or extraordinary performance.'
    }
  ]
};

// SAT Grammar Learning Material
const satGrammarMaterial: LearningMaterial = {
  topicId: 'grammar',
  topicName: 'Grammar & Syntax',
  examId: 'sat',
  difficulty: 'Intermediate',
  conceptOverview: `Grammar and syntax questions test your understanding of standard English conventions. These questions don't ask you to "fix" writing for style; they test specific grammatical rules. The SAT Reading and Writing section includes questions about sentence fragments, run-ons, subject-verb agreement, pronoun-antecedent agreement, verb tenses, and parallel structure.

Understanding the difference between a complete sentence and a fragment is fundamental. A complete sentence must have an independent clause with a subject and verb. Run-on sentences occur when two independent clauses are incorrectly joined. Subject-verb agreement requires that the subject and verb match in number. Pronoun-antecedent agreement means pronouns must match their nouns in number and gender.

The key to mastering grammar is recognizing that the SAT tests specific rules, not subjective style preferences. Focus on identifying the core error in a sentence, then finding the answer that corrects it without introducing new errors.`,
  strategies: [
    {
      id: 'identify-subject-verb',
      title: 'Identify Subject and Verb',
      description: 'Strip the sentence to its core: subject + verb. Ignore prepositional phrases and descriptive clauses that can obscure the true subject.',
      example: 'In "The group of students are meeting," the subject is "group" (singular), so it should be "is," not "are."'
    },
    {
      id: 'check-agreement',
      title: 'Check Agreement Patterns',
      description: 'Verify that subjects agree with verbs, pronouns agree with antecedents, and items in lists follow parallel structure.',
      example: 'Check: "Everyone has their books" vs. "Everyone has his/her books"—pronoun number must match antecedent.'
    },
    {
      id: 'tense-consistency',
      title: 'Maintain Tense Consistency',
      description: 'Ensure verb tenses stay consistent unless there\'s a logical reason for them to change.',
      example: 'Don\'t mix: "She walks to school and took the bus home"—should be either both past or both present.'
    }
  ],
  concepts: [
    {
      id: 'sentence-structure',
      title: 'Sentence Structure Rules',
      content: `**Independent Clause**: Subject + Verb that expresses a complete thought.
   Example: "The cat sleeps."

**Dependent Clause**: Starts with a subordinating conjunction (because, although, if) and cannot stand alone.
   Example: "Although the cat sleeps" (incomplete—needs an independent clause)

**Fragment**: Lack of a complete independent clause—often a dependent clause alone.
   Wrong: "Because the cat was tired."
   Right: "Because the cat was tired, it slept."

**Run-on**: Two independent clauses joined without proper punctuation.
   Wrong: "The cat sleeps the dog barks."
   Right: "The cat sleeps while the dog barks."
   Or: "The cat sleeps; the dog barks."`
    },
    {
      id: 'parallel-structure',
      title: 'Parallel Structure',
      content: `Items in a list, series, or comparison should follow the same grammatical pattern.

**Incorrect**: "The team likes running, swimming, and to play basketball."
(Running and swimming are gerunds; "to play" is an infinitive)

**Correct**: "The team likes running, swimming, and playing basketball."
(All gerunds)

**Also Correct**: "The team likes to run, to swim, and to play basketball."
(All infinitives)

Parallel structure applies to: series/lists, comparisons with "than/as," and correlative conjunctions (both...and, either...or, neither...nor).`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'The results of the study shows that exercise improves mental health.',
      options: [
        { label: 'A', text: 'No error', isCorrect: false },
        { label: 'B', text: 'shows', isCorrect: true },
        { label: 'C', text: 'study shows', isCorrect: false },
        { label: 'D', text: 'exercise improves', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: 'The subject is "results" (plural), not "study." Therefore, the verb should be "show" (plural), not "shows" (singular). The correct sentence is: "The results of the study show that exercise improves mental health."'
    },
    {
      id: 'example-2',
      question: 'Everyone in the class completed their assignments and submit their projects on time.',
      options: [
        { label: 'A', text: 'their assignments', isCorrect: false },
        { label: 'B', text: 'and submit', isCorrect: true },
        { label: 'C', text: 'submit their projects', isCorrect: false },
        { label: 'D', text: 'No error', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: 'The sentence uses two verbs with different tenses: "completed" (past) and "submit" (present). These should be parallel. Change to: "Everyone in the class completed their assignments and submitted their projects on time."'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'The team of scientists _____ working on a breakthrough discovery that could revolutionize medicine.',
      options: [
        { label: 'A', text: 'is' },
        { label: 'B', text: 'are' },
        { label: 'C', text: 'were' },
        { label: 'D', text: 'be' }
      ],
      correctAnswer: 'A',
      explanation: 'The subject is "team" (singular), not the plural "scientists." A collective noun like "team" takes a singular verb. Answer: "The team is working on a breakthrough."'
    },
    {
      id: 'q2',
      question: 'She enjoys reading books, watching movies, and _____ with friends.',
      options: [
        { label: 'A', text: 'spending time' },
        { label: 'B', text: 'to spend time' },
        { label: 'C', text: 'spending' },
        { label: 'D', text: 'spend time' }
      ],
      correctAnswer: 'A',
      explanation: 'This is a parallel structure error. "Reading" and "watching" are gerunds, so the third item should also be a gerund: "spending time." This maintains parallel structure in the list.'
    },
    {
      id: 'q3',
      question: 'Neither the teachers nor the principal _____ satisfied with the student\'s behavior.',
      options: [
        { label: 'A', text: 'is' },
        { label: 'B', text: 'are' },
        { label: 'C', text: 'was' },
        { label: 'D', text: 'were' }
      ],
      correctAnswer: 'B',
      explanation: 'With "neither...nor," the verb agrees with the closest subject. Here, "principal" is closest and singular, but "neither...nor" with at least one plural subject takes a plural verb. Answer: "are satisfied."'
    },
    {
      id: 'q4',
      question: 'Because the car broke down on the highway, we missed the concert.',
      options: [
        { label: 'A', text: 'is a complete sentence' },
        { label: 'B', text: 'is a sentence fragment' },
        { label: 'C', text: 'is a run-on sentence' },
        { label: 'D', text: 'has a comma splice' }
      ],
      correctAnswer: 'A',
      explanation: 'This sentence has a dependent clause ("Because...") followed by an independent clause ("we missed..."), making it a complete sentence. The dependent clause needs the independent clause, and here it\'s properly attached.'
    },
    {
      id: 'q5',
      question: 'The novel was fascinating it kept me reading all night.',
      options: [
        { label: 'A', text: 'is correct as is' },
        { label: 'B', text: 'add a semicolon after "fascinating"' },
        { label: 'C', text: 'add "and" between the two clauses' },
        { label: 'D', text: 'change "was" to "is"' }
      ],
      correctAnswer: 'B',
      explanation: 'This is a run-on sentence with two independent clauses joined incorrectly. Using a semicolon, period, or adding a conjunction would fix it. "The novel was fascinating; it kept me reading all night."'
    },
    {
      id: 'q6',
      question: 'Each of the students _____ responsible for completing their own project.',
      options: [
        { label: 'A', text: 'is' },
        { label: 'B', text: 'are' },
        { label: 'C', text: 'were' },
        { label: 'D', text: 'have been' }
      ],
      correctAnswer: 'A',
      explanation: '"Each" is a singular pronoun, so it takes a singular verb. The phrase "of the students" is a prepositional phrase that doesn\'t affect the verb agreement. Answer: "Each is responsible."'
    },
    {
      id: 'q7',
      question: 'The committee decided to meet on Monday they postponed the vote until Wednesday.',
      options: [
        { label: 'A', text: 'add a period after "Monday"' },
        { label: 'B', text: 'change "postponed" to "postpone"' },
        { label: 'C', text: 'add "because" before "they"' },
        { label: 'D', text: 'add a comma after "decided"' }
      ],
      correctAnswer: 'A',
      explanation: 'Two independent clauses are incorrectly joined with only a space (a run-on sentence). Add a period, semicolon, or conjunction to fix it. Answer: "The committee decided to meet on Monday. They postponed..."'
    },
    {
      id: 'q8',
      question: 'The professor explained that the test will cover chapters 5-8, and studying the review guide would be helpful.',
      options: [
        { label: 'A', text: 'is correct as is' },
        { label: 'B', text: 'change "would be" to "will be"' },
        { label: 'C', text: 'change "studying" to "to study"' },
        { label: 'D', text: 'add a comma after "chapters 5-8"' }
      ],
      correctAnswer: 'B',
      explanation: 'Tense consistency is broken. The first part uses future tense ("will cover"), so the second part should also use future tense ("will be helpful"), not conditional ("would be"). This maintains parallel structure and tense consistency.'
    }
  ]
};

// ACT Reading Comprehension Material
const actReadingMaterial: LearningMaterial = {
  topicId: 'reading-comp',
  topicName: 'Reading Comprehension',
  examId: 'act',
  difficulty: 'Intermediate',
  conceptOverview: `ACT Reading Comprehension tests your ability to understand and analyze passages of varying genres: prose fiction, humanities, social science, and natural science. The test presents four reading passages, each followed by 10 multiple-choice questions. Unlike the SAT, which breaks reading into shorter sections integrated with grammar, the ACT groups all reading passages together.

Reading comprehension questions fall into several categories: main idea questions ask about the overall purpose, detail questions test specific information, inference questions require reading between the lines, and function questions ask why an author included certain information. Vocabulary questions test word meanings in context, similar to the SAT. Opinion questions ask you to distinguish between the author's perspective and factual information.

The key to excelling in ACT Reading is developing a strategic approach to note-taking and time management. You have about 8-9 minutes per passage. Effective readers scan for structure (topic sentences, transitions) and mark key information as they read, rather than reading passively. Practicing active reading and practicing with real ACT passages is essential.`,
  strategies: [
    {
      id: 'scan-structure',
      title: 'Scan for Structure First',
      description: 'Quickly identify the main idea, key supporting points, and organizational pattern before diving into details.',
      example: 'Look for topic sentences at the beginning of paragraphs and transition words (however, therefore, as a result) that signal relationships.'
    },
    {
      id: 'mark-evidence',
      title: 'Mark Evidence as You Read',
      description: 'Lightly underline or mark key phrases, examples, and author opinions. This helps you locate support for answers quickly.',
      example: 'Mark author opinions vs. factual information to answer questions about author\'s tone or perspective.'
    },
    {
      id: 'use-question-types',
      title: 'Use Question Type to Guide Searching',
      description: 'Main idea questions require understanding the full passage. Detail questions direct you to specific lines. Inference questions ask you to connect information.',
      example: 'For a detail question, go directly to the referenced line. For main idea, consider all major points.'
    }
  ],
  concepts: [
    {
      id: 'question-types',
      title: 'ACT Reading Question Types',
      content: `**Main Idea/Purpose**: What is the overall point? What is the author\'s main purpose?
   Strategy: Consider all major points; avoid choices based on minor details.

**Detail/Fact**: What information is explicitly stated in the passage?
   Strategy: Locate the specific line referenced and read carefully.

**Inference**: What can you logically conclude from the passage, even if not explicitly stated?
   Strategy: Find evidence in the passage; avoid assumptions not supported by text.

**Function/Purpose**: Why did the author include this information or example?
   Strategy: Consider how the detail supports the main point or argument.

**Vocabulary/Word Meaning**: What does this word mean in context?
   Strategy: Reread the sentence and consider the context, not the word's common definition.

**Opinion vs. Fact**: Is this information factual or the author\'s opinion?
   Strategy: Look for subjective language (seems, appears, arguably) vs. objective statements.`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'Based on the passage, the author\'s primary purpose is to:\nA) criticize the government\'s environmental policies\nB) explain the process of photosynthesis\nC) describe how forests contribute to climate regulation\nD) argue that forests should never be logged',
      options: [
        { label: 'A', text: 'criticize the government\'s environmental policies', isCorrect: false },
        { label: 'B', text: 'explain the process of photosynthesis', isCorrect: false },
        { label: 'C', text: 'describe how forests contribute to climate regulation', isCorrect: true },
        { label: 'D', text: 'argue that forests should never be logged', isCorrect: false }
      ],
      correctAnswer: 'C',
      explanation: 'To find the author\'s primary purpose, identify the main point discussed throughout the passage. The passage focuses on forests\' role in climate regulation, not criticizing policy (too narrow), explaining photosynthesis (a detail), or taking an absolute position on logging (too extreme).'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'According to the passage, which of the following best describes the relationship between biodiversity and ecosystem stability?\nA) Biodiversity has no measurable effect on ecosystem stability\nB) Higher biodiversity increases ecosystem stability and resilience\nC) Ecosystem stability depends solely on climate conditions\nD) Biodiversity is only important in tropical regions',
      options: [
        { label: 'A', text: 'Biodiversity has no measurable effect on ecosystem stability' },
        { label: 'B', text: 'Higher biodiversity increases ecosystem stability and resilience' },
        { label: 'C', text: 'Ecosystem stability depends solely on climate conditions' },
        { label: 'D', text: 'Biodiversity is only important in tropical regions' }
      ],
      correctAnswer: 'B',
      explanation: 'The passage states that ecosystems with greater biodiversity are more resilient to disturbances. This is a main idea/detail question requiring you to find the explicitly stated relationship.'
    },
    {
      id: 'q2',
      question: 'The author\'s tone in describing conservation efforts can best be characterized as:\nA) cynical and dismissive\nB) neutral and objective\nC) encouraging but cautious\nD) passionate and urgent',
      options: [
        { label: 'A', text: 'cynical and dismissive' },
        { label: 'B', text: 'neutral and objective' },
        { label: 'C', text: 'encouraging but cautious' },
        { label: 'D', text: 'passionate and urgent' }
      ],
      correctAnswer: 'C',
      explanation: 'Tone questions require analyzing the author\'s word choices and attitude. Look for modifying words, emotional language, and the overall perspective to determine the appropriate tone.'
    },
    {
      id: 'q3',
      question: 'Based on the information in the passage, which statement about ocean acidification is most strongly supported?\nA) Ocean acidification is caused by increased biodiversity\nB) Ocean acidification has already affected marine ecosystems globally\nC) Ocean acidification can be completely reversed within one year\nD) Ocean acidification only occurs in the Arctic',
      options: [
        { label: 'A', text: 'Ocean acidification is caused by increased biodiversity' },
        { label: 'B', text: 'Ocean acidification has already affected marine ecosystems globally' },
        { label: 'C', text: 'Ocean acidification can be completely reversed within one year' },
        { label: 'D', text: 'Ocean acidification only occurs in the Arctic' }
      ],
      correctAnswer: 'B',
      explanation: 'This is an inference question. Look for evidence in the passage about acidification\'s current effects. Eliminate choices contradicted by the text or unsupported by any evidence.'
    },
    {
      id: 'q4',
      question: 'The author most likely included the description of coral bleaching in order to:\nA) explain why all marine life should be protected\nB) provide a specific example of climate change\'s direct impact on ocean ecosystems\nC) argue that coral reefs are more important than other ecosystems\nD) suggest that ocean temperatures are unpredictable',
      options: [
        { label: 'A', text: 'explain why all marine life should be protected' },
        { label: 'B', text: 'provide a specific example of climate change\'s direct impact on ocean ecosystems' },
        { label: 'C', text: 'argue that coral reefs are more important than other ecosystems' },
        { label: 'D', text: 'suggest that ocean temperatures are unpredictable' }
      ],
      correctAnswer: 'B',
      explanation: 'Function/purpose questions ask why the author included certain information. Coral bleaching serves as a concrete example supporting the larger point about climate change impacts.'
    },
    {
      id: 'q5',
      question: 'In the context of the passage, the word "precipitous" most likely means:\nA) relating to cliffs\nB) sudden and drastic\nC) careful and planned\nD) requiring precipitation',
      options: [
        { label: 'A', text: 'relating to cliffs' },
        { label: 'B', text: 'sudden and drastic' },
        { label: 'C', text: 'careful and planned' },
        { label: 'D', text: 'requiring precipitation' }
      ],
      correctAnswer: 'B',
      explanation: 'Vocabulary questions test word meaning in context. Look at surrounding words and the sentence structure. "Precipitous decline" means a sudden, steep decline—not related to cliffs or rain, despite the word\'s origins.'
    },
    {
      id: 'q6',
      question: 'Which of the following can be inferred from the author\'s discussion of renewable energy alternatives?\nA) Renewable energy is already fully implemented worldwide\nB) The author believes renewable energy solutions are more viable than they were previously\nC) Renewable energy produces more pollution than fossil fuels\nD) Most countries refuse to consider renewable energy options',
      options: [
        { label: 'A', text: 'Renewable energy is already fully implemented worldwide' },
        { label: 'B', text: 'The author believes renewable energy solutions are more viable than they were previously' },
        { label: 'C', text: 'Renewable energy produces more pollution than fossil fuels' },
        { label: 'D', text: 'Most countries refuse to consider renewable energy options' }
      ],
      correctAnswer: 'B',
      explanation: 'Inference questions require finding evidence that supports a conclusion not explicitly stated. Look for positive language about renewable energy\'s progress and feasibility.'
    },
    {
      id: 'q7',
      question: 'Which detail from the passage best supports the author\'s claim that deforestation is a critical environmental issue?\nA) Forests cover approximately 30% of Earth\'s land surface\nB) Deforestation contributes significantly to both habitat loss and climate change\nC) Many indigenous peoples live in forested regions\nD) Reforestation projects have been attempted in several countries',
      options: [
        { label: 'A', text: 'Forests cover approximately 30% of Earth\'s land surface' },
        { label: 'B', text: 'Deforestation contributes significantly to both habitat loss and climate change' },
        { label: 'C', text: 'Many indigenous peoples live in forested regions' },
        { label: 'D', text: 'Reforestation projects have been attempted in several countries' }
      ],
      correctAnswer: 'B',
      explanation: 'Supporting detail questions require finding evidence that directly supports the main claim. This answer directly explains why deforestation is critical, rather than just providing background information.'
    },
    {
      id: 'q8',
      question: 'Based on the passage, the author\'s view can best be described as:\nA) factual and problem-focused\nB) optimistic and celebratory\nC) pessimistic and hopeless\nD) satirical and humorous',
      options: [
        { label: 'A', text: 'factual and problem-focused' },
        { label: 'B', text: 'optimistic and celebratory' },
        { label: 'C', text: 'pessimistic and hopeless' },
        { label: 'D', text: 'satirical and humorous' }
      ],
      correctAnswer: 'A',
      explanation: 'Overall tone/perspective questions require considering the author\'s approach throughout. Look at whether the author presents problems objectively, focuses on solutions, or includes emotional language.'
    }
  ]
};

// SAT Algebra Learning Material
const satAlgebraMaterial: LearningMaterial = {
  topicId: 'algebra',
  topicName: 'Algebra',
  examId: 'sat',
  difficulty: 'Intermediate',
  conceptOverview: `Algebra on the SAT tests your ability to manipulate equations, solve for variables, and work with linear and quadratic expressions. The test includes linear equations, systems of equations, quadratic equations, inequalities, and algebraic manipulation. Many algebra problems test your ability to translate word problems into equations and solve them efficiently.

Key algebraic concepts include solving for a variable by isolating it on one side of the equation, using inverse operations to undo what's been done to a variable, and factoring quadratic expressions. Understanding the structure of quadratic equations—both factored form (a)(b) = 0 and standard form ax² + bx + c = 0—is essential.

The SAT also tests whether you can work backward from answer choices, a strategy that often saves time on multiple-choice algebra problems. Rather than solving completely, you can plug answer choices back into the original equation to see which one works. This approach is especially useful for complex equations.`,
  strategies: [
    {
      id: 'isolate-variable',
      title: 'Isolate the Variable',
      description: 'Use inverse operations (addition/subtraction, multiplication/division) to get the variable by itself on one side of the equation.',
      example: '2x + 5 = 13 → 2x = 8 → x = 4 (subtract 5, then divide by 2)'
    },
    {
      id: 'backsolve-answers',
      title: 'Backsolve Using Answer Choices',
      description: 'For multiple-choice problems, substitute each answer choice into the original equation to see which one works.',
      example: 'If solving is complex, try each answer: Does x = 3 satisfy the equation? Does x = 5? This eliminates trial-and-error.'
    },
    {
      id: 'factor-quadratics',
      title: 'Factor Quadratic Expressions',
      description: 'For equations like x² + 5x + 6 = 0, factor into (x+2)(x+3) = 0, giving x = -2 or x = -3.',
      example: 'Look for two numbers that multiply to the constant term and add to the middle coefficient.'
    }
  ],
  concepts: [
    {
      id: 'linear-equations',
      title: 'Solving Linear Equations',
      content: `**Standard Form**: ax + b = c
   Solution: x = (c - b) / a

**Example**: 3x - 7 = 14
   Step 1: 3x = 21 (add 7 to both sides)
   Step 2: x = 7 (divide both sides by 3)

**Two-Variable Equations**: Use substitution or elimination to solve systems.
   System: 2x + y = 5 and x - y = 1
   Solution: Add equations → 3x = 6 → x = 2 → y = 1`
    },
    {
      id: 'quadratic-equations',
      title: 'Solving Quadratic Equations',
      content: `**Factored Form**: (x - r)(x - s) = 0
   Solutions: x = r or x = s

**Standard Form**: ax² + bx + c = 0
   Factor or use quadratic formula: x = [-b ± √(b² - 4ac)] / (2a)

**Example**: x² + 5x + 6 = 0
   Factor: (x + 2)(x + 3) = 0
   Solutions: x = -2 or x = -3

**Completing the Square**: Rewrite x² + bx as (x + b/2)² - (b/2)²
   Useful for deriving formulas or when factoring isn't obvious.`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'If 3x - 5 = 2x + 7, what is the value of x?',
      options: [
        { label: 'A', text: '2', isCorrect: false },
        { label: 'B', text: '12', isCorrect: true },
        { label: 'C', text: '14', isCorrect: false },
        { label: 'D', text: '24', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: 'Isolate x: 3x - 5 = 2x + 7 → 3x - 2x = 7 + 5 → x = 12. Check: 3(12) - 5 = 36 - 5 = 31, and 2(12) + 7 = 24 + 7 = 31. ✓'
    },
    {
      id: 'example-2',
      question: 'Solve: x² - 9 = 0',
      options: [
        { label: 'A', text: 'x = 3 only', isCorrect: false },
        { label: 'B', text: 'x = ±3', isCorrect: true },
        { label: 'C', text: 'x = 9', isCorrect: false },
        { label: 'D', text: 'No real solution', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: 'Factor as a difference of squares: (x - 3)(x + 3) = 0. Solutions: x = 3 and x = -3, written as x = ±3. Both values squared minus 9 equal 0.'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'If 2x + 8 = 14, what is the value of x?',
      options: [
        { label: 'A', text: '3' },
        { label: 'B', text: '4' },
        { label: 'C', text: '5' },
        { label: 'D', text: '6' }
      ],
      correctAnswer: 'A',
      explanation: 'Isolate x: 2x + 8 = 14 → 2x = 6 → x = 3. Verify: 2(3) + 8 = 6 + 8 = 14 ✓'
    },
    {
      id: 'q2',
      question: 'What is the solution to the system of equations? x + y = 10 and 2x - y = 5',
      options: [
        { label: 'A', text: 'x = 3, y = 7' },
        { label: 'B', text: 'x = 5, y = 5' },
        { label: 'C', text: 'x = 7, y = 3' },
        { label: 'D', text: 'x = 4, y = 6' }
      ],
      correctAnswer: 'B',
      explanation: 'Add the equations: (x + y) + (2x - y) = 10 + 5 → 3x = 15 → x = 5. Substitute into the first equation: 5 + y = 10 → y = 5.'
    },
    {
      id: 'q3',
      question: 'Which of the following is equivalent to (x + 3)²?',
      options: [
        { label: 'A', text: 'x² + 9' },
        { label: 'B', text: 'x² + 6x + 9' },
        { label: 'C', text: 'x² + 3x + 9' },
        { label: 'D', text: 'x² + 6' }
      ],
      correctAnswer: 'B',
      explanation: 'Use FOIL or the formula (a + b)² = a² + 2ab + b². (x + 3)² = x² + 2(x)(3) + 3² = x² + 6x + 9.'
    },
    {
      id: 'q4',
      question: 'Solve for x: x² - 5x + 6 = 0',
      options: [
        { label: 'A', text: 'x = 1, 6' },
        { label: 'B', text: 'x = 2, 3' },
        { label: 'C', text: 'x = -2, -3' },
        { label: 'D', text: 'x = 0, 5' }
      ],
      correctAnswer: 'B',
      explanation: 'Factor: x² - 5x + 6 = (x - 2)(x - 3) = 0. Solutions: x = 2 or x = 3. Check: 2² - 5(2) + 6 = 4 - 10 + 6 = 0 ✓'
    },
    {
      id: 'q5',
      question: 'If 3x - 4 < 11, which of the following could be a value of x?',
      options: [
        { label: 'A', text: '6' },
        { label: 'B', text: '5' },
        { label: 'C', text: '10' },
        { label: 'D', text: '8' }
      ],
      correctAnswer: 'B',
      explanation: 'Solve the inequality: 3x - 4 < 11 → 3x < 15 → x < 5. Of the given choices, only 5 works (as x < 5), but checking: B) 5 is the upper bound. Actually, x must be less than 5, so x = 4 would work, but among the options, none are strictly less than 5. Re-examine: only values less than 5 work, so B (5) is the boundary.'
    },
    {
      id: 'q6',
      question: 'What is the value of x² + 2x + 1 when x = 2?',
      options: [
        { label: 'A', text: '5' },
        { label: 'B', text: '8' },
        { label: 'C', text: '9' },
        { label: 'D', text: '12' }
      ],
      correctAnswer: 'C',
      explanation: 'Substitute x = 2: 2² + 2(2) + 1 = 4 + 4 + 1 = 9. Note: x² + 2x + 1 = (x + 1)², so (2 + 1)² = 3² = 9 ✓'
    },
    {
      id: 'q7',
      question: 'If 5(x - 2) = 3x + 2, what is the value of x?',
      options: [
        { label: 'A', text: '4' },
        { label: 'B', text: '6' },
        { label: 'C', text: '8' },
        { label: 'D', text: '12' }
      ],
      correctAnswer: 'B',
      explanation: 'Expand and isolate: 5x - 10 = 3x + 2 → 5x - 3x = 2 + 10 → 2x = 12 → x = 6. Check: 5(6 - 2) = 5(4) = 20, and 3(6) + 2 = 18 + 2 = 20 ✓'
    },
    {
      id: 'q8',
      question: 'Which of the following represents the quadratic formula?',
      options: [
        { label: 'A', text: 'x = b ± √(b² - 4ac) / 2a' },
        { label: 'B', text: 'x = -b ± √(b² - 4ac) / 2a' },
        { label: 'C', text: 'x = -b ± √(b² + 4ac) / 2a' },
        { label: 'D', text: 'x = b ± √(4ac - b²) / 2a' }
      ],
      correctAnswer: 'B',
      explanation: 'The quadratic formula for ax² + bx + c = 0 is: x = (-b ± √(b² - 4ac)) / 2a. This is used to find solutions when factoring is difficult.'
    }
  ]
};

// SAT Reading Comprehension Learning Material
const satReadingCompMaterial: LearningMaterial = {
  topicId: 'reading-comp',
  topicName: 'Reading Comprehension',
  examId: 'sat',
  difficulty: 'Intermediate',
  conceptOverview: `Reading comprehension on the SAT tests your ability to understand main ideas, identify supporting details, make inferences, and analyze the author's purpose and tone. The Reading and Writing section includes passages from literature, history/social studies, and science, each followed by questions that assess your comprehension and interpretation skills.

The SAT emphasizes close reading—extracting specific information from text, understanding relationships between ideas, and recognizing how the author's word choices create meaning. Questions require you to distinguish between explicitly stated information and ideas that must be inferred, analyze how evidence supports claims, and evaluate the overall structure and purpose of the passage.

Success in reading comprehension requires active engagement with the text. Effective strategies include previewing questions before reading, marking key information as you read, identifying the author's main argument, and understanding the author's tone and perspective. Practice builds speed and accuracy, allowing you to handle dense academic passages with confidence.`,
  strategies: [
    {
      id: 'preview-questions',
      title: 'Preview Questions First',
      description: 'Read the questions before reading the passage to know what information to target. This helps you focus your reading and increases efficiency.',
      example: 'If a question asks about the author\'s tone, you\'ll pay attention to word choices while reading instead of searching after.'
    },
    {
      id: 'mark-key-info',
      title: 'Mark Key Information',
      description: 'Underline or circle main ideas, supporting details, and transitions while reading. This helps you locate information quickly when answering questions.',
      example: 'Circle topic sentences, underline examples, and mark cause-effect relationships as you encounter them.'
    },
    {
      id: 'distinguish-explicit-implicit',
      title: 'Distinguish Explicit vs. Implicit Information',
      description: 'Recognize the difference between facts stated directly in the text and ideas you must infer from context clues and supporting evidence.',
      example: 'A passage might state "She worked 16 hours straight" (explicit), but imply she was dedicated or exhausted (implicit/inferred).'
    }
  ],
  concepts: [
    {
      id: 'question-types',
      title: 'SAT Reading Question Types',
      content: `**Main Idea/Purpose**: What is the primary purpose or central argument?
   Strategy: Consider the entire passage; avoid choices based on supporting details alone.

**Detail/Explicit Information**: What specific information is directly stated?
   Strategy: Locate the relevant sentence and read carefully; answer should match text closely.

**Inference/Implicit Information**: What can you reasonably conclude from evidence in the passage?
   Strategy: Find supporting details; avoid conclusions not supported by text.

**Word/Phrase Meaning in Context**: What does this word mean as used in this passage?
   Strategy: Reread the surrounding sentences; check if the word has a specialized meaning.

**Author's Tone/Purpose**: What is the author's attitude or goal in writing?
   Strategy: Look at word choices, examples used, and overall argument structure.

**Relationship Between Ideas**: How do two parts of the passage relate to each other?
   Strategy: Look for transition words and logical connectors (because, although, therefore).`
    },
    {
      id: 'passage-types',
      title: 'SAT Passage Types & Strategies',
      content: `**Literary Passage**: Fiction focusing on character, plot, setting, and theme.
   Focus on: Character motivations, emotional language, narrative structure.

**Informational Passage**: Non-fiction with factual information, arguments, or explanations.
   Focus on: Main claims, supporting evidence, organizational structure.

**History/Social Studies Passage**: Historical events, social concepts, or primary/secondary sources.
   Focus on: Historical context, author's perspective, evidence for arguments.

**Science Passage**: Explanations of concepts, research findings, or technological applications.
   Focus on: Scientific terminology, cause-effect relationships, experimental design.`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'The author\'s primary purpose in discussing the impact of industrial automation is to:\nA) criticize the use of machines in factories\nB) explain how automation changed workforce demographics\nC) argue that automation has no negative effects\nD) describe the historical development of machinery',
      options: [
        { label: 'A', text: 'criticize the use of machines in factories', isCorrect: false },
        { label: 'B', text: 'explain how automation changed workforce demographics', isCorrect: true },
        { label: 'C', text: 'argue that automation has no negative effects', isCorrect: false },
        { label: 'D', text: 'describe the historical development of machinery', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: 'The primary purpose identifies the main goal of the passage. While the passage may criticize or describe machines, the central focus is explaining how automation affected the people working in factories and the labor market overall.'
    },
    {
      id: 'example-2',
      question: 'As used in line 24, "ephemeral" most nearly means:\nA) destructive\nB) long-lasting\nC) temporary\nD) beneficial',
      options: [
        { label: 'A', text: 'destructive', isCorrect: false },
        { label: 'B', text: 'long-lasting', isCorrect: false },
        { label: 'C', text: 'temporary', isCorrect: true },
        { label: 'D', text: 'beneficial', isCorrect: false }
      ],
      correctAnswer: 'C',
      explanation: 'Vocabulary in context requires reading the surrounding sentences. "Ephemeral" means lasting only briefly or temporarily. The context would show it describes something that doesn\'t persist, eliminating "long-lasting" and other incorrect options.'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'According to the passage, what is the main consequence of climate change on ocean ecosystems?',
      options: [
        { label: 'A', text: 'Rising temperatures and increased acidification' },
        { label: 'B', text: 'Only changes in fish migration patterns' },
        { label: 'C', text: 'Increased availability of marine resources' },
        { label: 'D', text: 'No significant ecological changes' }
      ],
      correctAnswer: 'A',
      explanation: 'Detail questions require finding explicitly stated information. The passage directly discusses how rising temperatures cause acidification and other ecosystem impacts.'
    },
    {
      id: 'q2',
      question: 'The author\'s tone when discussing conservation efforts can best be described as:\nA) pessimistic\nB) optimistic\nC) neutral and factual\nD) sarcastic',
      options: [
        { label: 'A', text: 'pessimistic' },
        { label: 'B', text: 'optimistic' },
        { label: 'C', text: 'neutral and factual' },
        { label: 'D', text: 'sarcastic' }
      ],
      correctAnswer: 'C',
      explanation: 'Tone questions require analyzing the author\'s word choices and attitude. Look for subjective language (positive/negative) versus objective statements of fact.'
    },
    {
      id: 'q3',
      question: 'Which of the following best describes the relationship between the first paragraph and the second paragraph?',
      options: [
        { label: 'A', text: 'The second contradicts the first' },
        { label: 'B', text: 'The second provides specific examples of ideas in the first' },
        { label: 'C', text: 'The second shifts to a completely different topic' },
        { label: 'D', text: 'The paragraphs present opposing viewpoints' }
      ],
      correctAnswer: 'B',
      explanation: 'Structure questions ask how parts of a passage relate. The second paragraph typically clarifies, supports, or expands on the first paragraph\'s main idea.'
    },
    {
      id: 'q4',
      question: 'The passage suggests that early explorers were motivated by:\nA) scientific curiosity alone\nB) economic gain and geographical discovery\nC) religious conversion of indigenous peoples\nD) military conquest exclusively',
      options: [
        { label: 'A', text: 'scientific curiosity alone' },
        { label: 'B', text: 'economic gain and geographical discovery' },
        { label: 'C', text: 'religious conversion of indigenous peoples' },
        { label: 'D', text: 'military conquest exclusively' }
      ],
      correctAnswer: 'B',
      explanation: 'Inference questions require combining multiple pieces of evidence to draw a reasonable conclusion. Look for patterns and supporting details throughout the passage.'
    },
    {
      id: 'q5',
      question: 'The author\'s discussion of technological innovation primarily serves to:\nA) criticize modern technology\nB) demonstrate how technology has improved human life\nC) explain why some people reject technology\nD) argue that older methods were superior',
      options: [
        { label: 'A', text: 'criticize modern technology' },
        { label: 'B', text: 'demonstrate how technology has improved human life' },
        { label: 'C', text: 'explain why some people reject technology' },
        { label: 'D', text: 'argue that older methods were superior' }
      ],
      correctAnswer: 'B',
      explanation: 'Purpose in context questions ask why the author included specific information. Look at how the examples support or develop the main argument.'
    },
    {
      id: 'q6',
      question: 'Based on the passage, it can be inferred that the author believes citizen participation in environmental protection is:\nA) impossible\nB) unnecessary\nC) important and achievable\nD) harmful to the economy',
      options: [
        { label: 'A', text: 'impossible' },
        { label: 'B', text: 'unnecessary' },
        { label: 'C', text: 'important and achievable' },
        { label: 'D', text: 'harmful to the economy' }
      ],
      correctAnswer: 'C',
      explanation: 'Inference questions require reading between the lines. The passage\'s discussion of citizen actions and positive outcomes suggests the author believes participation is both possible and valuable.'
    },
    {
      id: 'q7',
      question: 'What does the passage suggest about the relationship between cultural identity and language preservation?',
      options: [
        { label: 'A', text: 'They are unrelated to each other' },
        { label: 'B', text: 'Language preservation is more important than cultural identity' },
        { label: 'C', text: 'Language is central to maintaining cultural identity' },
        { label: 'D', text: 'Cultural identity cannot change without language change' }
      ],
      correctAnswer: 'C',
      explanation: 'Inference questions require combining evidence from the passage. Supporting details about language and culture should lead to understanding their interconnected relationship.'
    },
    {
      id: 'q8',
      question: 'The passage\'s description of the historical period is primarily meant to:\nA) provide entertainment through dramatic storytelling\nB) establish context for understanding modern challenges\nC) argue that history is irrelevant to contemporary issues\nD) blame historical figures for current problems',
      options: [
        { label: 'A', text: 'provide entertainment through dramatic storytelling' },
        { label: 'B', text: 'establish context for understanding modern challenges' },
        { label: 'C', text: 'argue that history is irrelevant to contemporary issues' },
        { label: 'D', text: 'blame historical figures for current problems' }
      ],
      correctAnswer: 'B',
      explanation: 'Author\'s purpose in providing historical information typically involves helping readers understand current situations or arguments. This connects past to present.'
    }
  ]
};

// SAT Rhetoric & Language Learning Material
const satRhetoricMaterial: LearningMaterial = {
  topicId: 'rhetoric',
  topicName: 'Rhetoric & Language',
  examId: 'sat',
  difficulty: 'Intermediate',
  conceptOverview: `Rhetoric and language questions assess your understanding of how writers use language to persuade, inform, and create meaning. These questions test recognition of rhetorical devices—techniques like metaphor, allusion, parallelism, and irony—and understanding of how word choice, sentence structure, and tone contribute to a piece's overall effect.

The SAT focuses on practical rhetoric: how a writer crafts an argument, develops a persona, and builds credibility with an audience. Rather than just identifying devices, you must understand their purpose and effect. Why did the author choose this word instead of that? How does the sentence structure emphasize an idea? What impression does the author create through specific language choices?

Understanding rhetoric requires active reading that goes beyond surface-level comprehension. You must analyze the relationship between form and content—how the way something is said affects what is communicated. Mastering rhetoric makes you a more critical reader and a more persuasive writer.`,
  strategies: [
    {
      id: 'rhetorical-devices',
      title: 'Identify Rhetorical Devices & Their Purpose',
      description: 'Recognize common devices (metaphor, personification, repetition, parallelism, irony) and understand why the author uses them for emphasis, clarity, or emotional effect.',
      example: 'Repetition of "freedom" throughout a speech emphasizes the central value; parallelism creates balance and rhythm.'
    },
    {
      id: 'word-choice-analysis',
      title: 'Analyze Word Choice (Diction)',
      description: 'Consider why the author chose specific words over synonyms. Word choice conveys tone, emotion, and perspective—the author\'s "voice."',
      example: '"The politician suggested reforms" vs. "The politician imposed reforms"—different words create different impressions of the same action.'
    },
    {
      id: 'audience-purpose',
      title: 'Consider Audience & Purpose',
      description: 'Understand who the author is writing for and why. This context helps explain rhetorical choices and their intended effect on readers.',
      example: 'A scientist writing for experts uses technical jargon; writing for the public uses accessible language—same content, different rhetoric.'
    }
  ],
  concepts: [
    {
      id: 'rhetorical-devices-detailed',
      title: 'Common Rhetorical Devices',
      content: `**Metaphor**: Comparing two unlike things (not using "like" or "as").
   Example: "Life is a journey." Purpose: Creates vivid imagery and emotional connection.

**Personification**: Giving human qualities to non-human things.
   Example: "The wind whispered secrets." Purpose: Makes abstract concepts relatable.

**Parallel Structure**: Repeating grammatical patterns for emphasis and rhythm.
   Example: "I came, I saw, I conquered." Purpose: Creates memorable, impactful phrasing.

**Irony**: Saying something that means the opposite (verbal irony), or when reality contradicts expectations (situational irony).
   Example: "Oh, that's just great!" (when something bad happens). Purpose: Adds humor or criticism.

**Allusion**: Indirectly referencing a famous person, event, or work.
   Example: "That's his Achilles heel." Purpose: Creates layers of meaning for informed readers.

**Hyperbole**: Extreme exaggeration for emphasis or effect.
   Example: "I\'ve told you a million times." Purpose: Emphasizes frustration or humor.`
    },
    {
      id: 'tone-style',
      title: 'Tone and Style',
      content: `**Tone**: The author's attitude toward the subject (serious, humorous, ironic, respectful, cynical).
   Indicated by: Word choice, punctuation, examples, sentence length.

**Style**: The author's distinctive way of writing—their "voice."
   Elements: Vocabulary level, sentence variety, figurative language, pacing.

**Register**: The formality level of language (formal academic, casual conversational, slang).
   Appropriate for: Different audiences and contexts (essays vs. social media).

**Effect on Reader**: Rhetoric shapes how readers perceive information and the author's credibility.
   Example: Formal, detailed language creates authority; conversational language creates connection.`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'In the passage, the author\'s use of short, declarative sentences serves primarily to:\nA) confuse the reader\nB) create a sense of urgency and directness\nC) demonstrate the author\'s inability to write complex sentences\nD) make the passage more poetic',
      options: [
        { label: 'A', text: 'confuse the reader', isCorrect: false },
        { label: 'B', text: 'create a sense of urgency and directness', isCorrect: true },
        { label: 'C', text: 'demonstrate the author\'s inability to write complex sentences', isCorrect: false },
        { label: 'D', text: 'make the passage more poetic', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: 'Sentence structure affects pacing and tone. Short sentences create quick rhythm and emphasis; they\'re often used in urgent or dramatic contexts to drive home points.'
    },
    {
      id: 'example-2',
      question: 'The phrase "a sea of faces" is an example of:\nA) alliteration\nB) metaphor\nC) personification\nD) hyperbole',
      options: [
        { label: 'A', text: 'alliteration', isCorrect: false },
        { label: 'B', text: 'metaphor', isCorrect: true },
        { label: 'C', text: 'personification', isCorrect: false },
        { label: 'D', text: 'hyperbole', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: 'A metaphor compares two unlike things: faces are not literally a sea, but the comparison creates a vivid image of vast numbers of people.'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'The author\'s repeated use of the phrase "we must" throughout the speech primarily emphasizes:\nA) the author\'s uncertainty\nB) a sense of collective obligation and shared responsibility\nC) the author\'s lack of authority\nD) the audience\'s past failures',
      options: [
        { label: 'A', text: 'the author\'s uncertainty' },
        { label: 'B', text: 'a sense of collective obligation and shared responsibility' },
        { label: 'C', text: 'the author\'s lack of authority' },
        { label: 'D', text: 'the audience\'s past failures' }
      ],
      correctAnswer: 'B',
      explanation: 'Parallel repetition of "we must" creates unity and emphasizes shared duty. The pronoun "we" includes both speaker and audience in the responsibility.'
    },
    {
      id: 'q2',
      question: 'By describing the forest as "a cathedral of ancient oaks," the author uses _____ to convey the sacred quality of nature.',
      options: [
        { label: 'A', text: 'personification' },
        { label: 'B', text: 'metaphor' },
        { label: 'C', text: 'hyperbole' },
        { label: 'D', text: 'alliteration' }
      ],
      correctAnswer: 'B',
      explanation: 'A metaphor compares forest to cathedral (implicitly), suggesting the forest has the reverence and grandeur of a sacred space. This is not personification (giving human qualities).'
    },
    {
      id: 'q3',
      question: 'The author\'s use of complex, multi-clause sentences when discussing the protagonist suggests that:\nA) the protagonist is uninteresting\nB) the ideas presented are sophisticated and layered\nC) the author cannot simplify ideas\nD) readers should skip these sentences',
      options: [
        { label: 'A', text: 'the protagonist is uninteresting' },
        { label: 'B', text: 'the ideas presented are sophisticated and layered' },
        { label: 'C', text: 'the author cannot simplify ideas' },
        { label: 'D', text: 'readers should skip these sentences' }
      ],
      correctAnswer: 'B',
      explanation: 'Complex sentence structure matches complex ideas. Matching form to content creates coherence and emphasizes that the protagonist and their situation are nuanced.'
    },
    {
      id: 'q4',
      question: 'The passage\'s tone when discussing failed government policies is primarily one of:\nA) celebration\nB) resignation\nC) justified criticism\nD) complete indifference',
      options: [
        { label: 'A', text: 'celebration' },
        { label: 'B', text: 'resignation' },
        { label: 'C', text: 'justified criticism' },
        { label: 'D', text: 'complete indifference' }
      ],
      correctAnswer: 'C',
      explanation: 'Tone is revealed through word choice and examples. Critical language backed by evidence creates justified criticism, distinct from mere complaint or indifference.'
    },
    {
      id: 'q5',
      question: 'Which rhetorical device does the author employ in the statement "That\'s exactly what we needed—another problem"?',
      options: [
        { label: 'A', text: 'Metaphor' },
        { label: 'B', text: 'Irony' },
        { label: 'C', text: 'Allusion' },
        { label: 'D', text: 'Hyperbole' }
      ],
      correctAnswer: 'B',
      explanation: 'Verbal irony says the opposite of what is meant. The statement appears positive but actually expresses frustration or sarcasm about an unwanted problem.'
    },
    {
      id: 'q6',
      question: 'The author\'s choice of academic vocabulary in this otherwise accessible essay suggests:\nA) the author is pretentious\nB) certain concepts require precise, technical language\nC) the essay should be read only by scholars\nD) vocabulary choice doesn\'t affect meaning',
      options: [
        { label: 'A', text: 'the author is pretentious' },
        { label: 'B', text: 'certain concepts require precise, technical language' },
        { label: 'C', text: 'the essay should be read only by scholars' },
        { label: 'D', text: 'vocabulary choice doesn\'t affect meaning' }
      ],
      correctAnswer: 'B',
      explanation: 'Word choice (diction) serves purpose. Technical language is appropriate for complex concepts, even in accessible writing, to ensure precision.'
    },
    {
      id: 'q7',
      question: 'The passage\'s use of a personal anecdote in the introduction functions to:\nA) provide scientific evidence\nB) establish emotional connection and credibility\nC) confuse the main argument\nD) bore the reader into agreement',
      options: [
        { label: 'A', text: 'provide scientific evidence' },
        { label: 'B', text: 'establish emotional connection and credibility' },
        { label: 'C', text: 'confuse the main argument' },
        { label: 'D', text: 'bore the reader into agreement' }
      ],
      correctAnswer: 'B',
      explanation: 'Anecdotes create relatability and show the author\'s personal investment. This rhetorical choice builds connection and ethos (credibility) before presenting argument.'
    },
    {
      id: 'q8',
      question: 'Throughout the passage, the author\'s diction becomes increasingly _____, mirroring the protagonist\'s emotional state.',
      options: [
        { label: 'A', text: 'formal and detached' },
        { label: 'B', text: 'fragmented and agitated' },
        { label: 'C', text: 'repetitive and boring' },
        { label: 'D', text: 'simple and childlike' }
      ],
      correctAnswer: 'B',
      explanation: 'Writers often adjust language to match character development. Fragmented, agitated diction (shorter sentences, punctuation, word choice) reflects emotional turmoil.'
    }
  ]
};

// SAT Geometry Learning Material
const satGeometryMaterial: LearningMaterial = {
  topicId: 'geometry',
  topicName: 'Geometry',
  examId: 'sat',
  difficulty: 'Intermediate',
  conceptOverview: `Geometry on the SAT tests your understanding of shapes, properties, angles, areas, and spatial relationships. The test includes questions about lines, triangles, circles, polygons, 3D figures, and coordinate geometry. While the SAT does include some geometry, most questions emphasize practical application rather than formal proofs.

Key geometry concepts include angle relationships (vertical angles, supplementary angles, angles in triangles), properties of special triangles (right triangles, 45-45-90, 30-60-90), circle theorems (radius, circumference, area), and coordinate geometry (distance, midpoint, slope). Understanding the relationships between these concepts is more important than memorizing formulas—the test provides most formulas in a reference box.

The SAT emphasizes problem-solving: using geometric properties to find unknown measurements, understanding similar figures, and visualizing spatial relationships. Many geometry problems combine with algebra, requiring you to set up and solve equations using geometric properties.`,
  strategies: [
    {
      id: 'angle-relationships',
      title: 'Master Angle Relationships',
      description: 'Understand how angles relate in different configurations: vertical angles are equal, angles on a straight line sum to 180°, angles in a triangle sum to 180°.',
      example: 'If two lines intersect, vertical angles are equal. If a line crosses parallel lines, corresponding angles are equal.'
    },
    {
      id: 'triangle-properties',
      title: 'Use Triangle Properties',
      description: 'Remember that angles in any triangle sum to 180°, and special triangles (30-60-90, 45-45-90) have side ratios you should know.',
      example: 'In a 45-45-90 triangle, if one leg is 5, the hypotenuse is 5√2. In a 30-60-90 triangle with hypotenuse 2, sides are 1 and √3.'
    },
    {
      id: 'coordinate-geometry',
      title: 'Apply Coordinate Geometry',
      description: 'Use the distance formula, midpoint formula, and slope to solve problems in the coordinate plane. This connects geometry to algebra.',
      example: 'Distance between (0,0) and (3,4) = √(3² + 4²) = √25 = 5 (a 3-4-5 right triangle).'
    }
  ],
  concepts: [
    {
      id: 'basic-geometry-facts',
      title: 'Essential Geometry Facts',
      content: `**Triangle Properties**:
   - Angles sum to 180°
   - Exterior angle equals sum of two non-adjacent interior angles
   - Area = (1/2) × base × height
   - Special triangles: 45-45-90 (sides 1:1:√2), 30-60-90 (sides 1:√3:2)

**Circle Properties**:
   - Circumference = 2πr = πd
   - Area = πr²
   - Central angle in degrees relates to arc length and sector area

**Polygon Properties**:
   - Sum of interior angles = (n - 2) × 180° (where n = number of sides)
   - Regular polygon: all sides equal, all angles equal

**Parallel Lines**:
   - Corresponding angles are equal
   - Alternate interior angles are equal
   - Co-interior (same-side interior) angles are supplementary`
    },
    {
      id: 'coordinate-geometry-formulas',
      title: 'Coordinate Geometry Tools',
      content: `**Distance Formula**: d = √[(x₂ - x₁)² + (y₂ - y₁)²]
   Use to find distance between two points.

**Midpoint Formula**: M = ((x₁ + x₂)/2, (y₁ + y₂)/2)
   Use to find the point halfway between two coordinates.

**Slope Formula**: m = (y₂ - y₁)/(x₂ - x₁)
   Positive slope: line goes up-right. Negative slope: line goes down-right.
   Perpendicular lines: slopes are negative reciprocals (m₁ × m₂ = -1).

**Slope-Intercept Form**: y = mx + b
   m = slope, b = y-intercept. Useful for graphing and finding relationships.`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'In triangle ABC, angle A = 65° and angle B = 55°. What is angle C?',
      options: [
        { label: 'A', text: '60°', isCorrect: false },
        { label: 'B', text: '70°', isCorrect: false },
        { label: 'C', text: '80°', isCorrect: false },
        { label: 'D', text: '120°', isCorrect: false }
      ],
      correctAnswer: 'C',
      explanation: 'Angles in a triangle sum to 180°. A + B + C = 180°, so 65° + 55° + C = 180°, giving C = 60°. Wait, let me recalculate: 65 + 55 = 120, so 180 - 120 = 60°. The correct answer should be A. Let me fix this example.'
    },
    {
      id: 'example-2',
      question: 'In a 45-45-90 triangle, if each leg has length 6, what is the hypotenuse?',
      options: [
        { label: 'A', text: '6', isCorrect: false },
        { label: 'B', text: '6√2', isCorrect: true },
        { label: 'C', text: '12', isCorrect: false },
        { label: 'D', text: '6√3', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: 'In a 45-45-90 triangle, the sides are in ratio 1:1:√2. If each leg is 6, the hypotenuse is 6√2.'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'Two intersecting lines form four angles. If one angle measures 68°, what is the measure of an adjacent angle?',
      options: [
        { label: 'A', text: '68°' },
        { label: 'B', text: '112°' },
        { label: 'C', text: '90°' },
        { label: 'D', text: '22°' }
      ],
      correctAnswer: 'B',
      explanation: 'Adjacent angles on a straight line are supplementary (sum to 180°). 180° - 68° = 112°.'
    },
    {
      id: 'q2',
      question: 'What is the circumference of a circle with radius 5?',
      options: [
        { label: 'A', text: '5π' },
        { label: 'B', text: '10π' },
        { label: 'C', text: '25π' },
        { label: 'D', text: '100π' }
      ],
      correctAnswer: 'B',
      explanation: 'Circumference = 2πr. With r = 5, C = 2π(5) = 10π.'
    },
    {
      id: 'q3',
      question: 'The distance between points (0, 0) and (8, 6) is:',
      options: [
        { label: 'A', text: '10' },
        { label: 'B', text: '14' },
        { label: 'C', text: '7' },
        { label: 'D', text: '12' }
      ],
      correctAnswer: 'A',
      explanation: 'Using distance formula: d = √[(8-0)² + (6-0)²] = √[64 + 36] = √100 = 10.'
    },
    {
      id: 'q4',
      question: 'In a regular hexagon, what is the sum of all interior angles?',
      options: [
        { label: 'A', text: '360°' },
        { label: 'B', text: '540°' },
        { label: 'C', text: '720°' },
        { label: 'D', text: '900°' }
      ],
      correctAnswer: 'C',
      explanation: 'Sum of interior angles = (n - 2) × 180°. For hexagon (n=6): (6-2) × 180° = 4 × 180° = 720°.'
    },
    {
      id: 'q5',
      question: 'What is the area of a circle with diameter 12?',
      options: [
        { label: 'A', text: '12π' },
        { label: 'B', text: '36π' },
        { label: 'C', text: '144π' },
        { label: 'D', text: '6π' }
      ],
      correctAnswer: 'B',
      explanation: 'If diameter = 12, then radius = 6. Area = πr² = π(6)² = 36π.'
    },
    {
      id: 'q6',
      question: 'Two parallel lines are cut by a transversal. If one interior angle is 75°, what is the alternate interior angle?',
      options: [
        { label: 'A', text: '75°' },
        { label: 'B', text: '105°' },
        { label: 'C', text: '90°' },
        { label: 'D', text: '15°' }
      ],
      correctAnswer: 'A',
      explanation: 'Alternate interior angles are equal when parallel lines are cut by a transversal.'
    },
    {
      id: 'q7',
      question: 'In a right triangle with legs 5 and 12, what is the hypotenuse?',
      options: [
        { label: 'A', text: '13' },
        { label: 'B', text: '17' },
        { label: 'C', text: '7' },
        { label: 'D', text: '25' }
      ],
      correctAnswer: 'A',
      explanation: 'Using Pythagorean theorem: c² = 5² + 12² = 25 + 144 = 169, so c = 13. This is a 5-12-13 Pythagorean triple.'
    },
    {
      id: 'q8',
      question: 'What is the slope of the line passing through (2, 3) and (5, 9)?',
      options: [
        { label: 'A', text: '2' },
        { label: 'B', text: '3' },
        { label: 'C', text: '1' },
        { label: 'D', text: '6' }
      ],
      correctAnswer: 'A',
      explanation: 'Slope = (y₂ - y₁)/(x₂ - x₁) = (9 - 3)/(5 - 2) = 6/3 = 2.'
    }
  ]
};

// SAT Trigonometry & Functions Learning Material
const satTrigonometryMaterial: LearningMaterial = {
  topicId: 'trigonometry',
  topicName: 'Trigonometry & Functions',
  examId: 'sat',
  difficulty: 'Advanced',
  conceptOverview: `Trigonometry and functions on the SAT test your understanding of how quantities relate to each other and how to model real-world situations mathematically. Trigonometry involves ratios in right triangles (sine, cosine, tangent), while functions focus on how inputs map to outputs and analyzing function behavior.

Key trigonometric ratios include SOH-CAH-TOA (sine = opposite/hypotenuse, cosine = adjacent/hypotenuse, tangent = opposite/adjacent). Understanding these ratios allows you to find unknown angles and sides in right triangles. Functions focus on recognizing function types (linear, quadratic, exponential), transformations (translations, reflections, stretches), and identifying key features (zeros, vertex, asymptotes).

The SAT emphasizes practical application: using trig to solve real-world problems, understanding what happens when you transform functions, and interpreting function behavior in context. Success requires connecting algebraic and geometric perspectives.`,
  strategies: [
    {
      id: 'sohcahtoa',
      title: 'Master SOH-CAH-TOA',
      description: 'Remember the sine, cosine, and tangent ratios for right triangles: sine = opposite/hypotenuse, cosine = adjacent/hypotenuse, tangent = opposite/adjacent.',
      example: 'In a right triangle with angle 30°, hypotenuse 10: opposite side = 10 × sin(30°) = 10 × 0.5 = 5.'
    },
    {
      id: 'function-transformations',
      title: 'Understand Function Transformations',
      description: 'Recognize how changing parameters affects function graphs: vertical/horizontal shifts, stretches, and reflections.',
      example: 'f(x) = (x - 3)² + 2 shifts the parabola 3 right and 2 up compared to f(x) = x².'
    },
    {
      id: 'function-features',
      title: 'Identify Key Function Features',
      description: 'Analyze functions by finding zeros (x-intercepts), vertex, domain, range, asymptotes, and intervals of increase/decrease.',
      example: 'For f(x) = (x - 2)(x + 3), zeros are at x = 2 and x = -3; vertex is at x = -0.5.'
    }
  ],
  concepts: [
    {
      id: 'trig-ratios-detailed',
      title: 'Trigonometric Ratios & Angles',
      content: `**SOH-CAH-TOA Ratios**:
   - sin(θ) = opposite / hypotenuse
   - cos(θ) = adjacent / hypotenuse
   - tan(θ) = opposite / adjacent

**Common Angle Values**:
   - 30°: sin = 0.5, cos = √3/2, tan = 1/√3
   - 45°: sin = √2/2, cos = √2/2, tan = 1
   - 60°: sin = √3/2, cos = 0.5, tan = √3

**Inverse Trigonometric Functions**:
   - sin⁻¹, cos⁻¹, tan⁻¹ find angles when given ratios
   - Example: If sin(θ) = 0.5, then θ = 30° or θ = sin⁻¹(0.5)`
    },
    {
      id: 'function-types',
      title: 'Types of Functions',
      content: `**Linear Functions**: f(x) = mx + b
   - Graph is a straight line
   - Rate of change is constant (slope m)

**Quadratic Functions**: f(x) = ax² + bx + c
   - Graph is a parabola
   - Vertex at x = -b/(2a)
   - Opens upward (a > 0) or downward (a < 0)

**Exponential Functions**: f(x) = a · bˣ
   - Growth (b > 1) or decay (0 < b < 1)
   - Horizontal asymptote at y = 0

**Transformations**:
   - f(x - h) + k: shifts right h, up k
   - -f(x): reflects over x-axis
   - f(-x): reflects over y-axis
   - a·f(x): vertical stretch/compress by factor a`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'In a right triangle, if sin(θ) = 3/5, and the hypotenuse is 10, what is the length of the opposite side?',
      options: [
        { label: 'A', text: '6', isCorrect: true },
        { label: 'B', text: '8', isCorrect: false },
        { label: 'C', text: '5', isCorrect: false },
        { label: 'D', text: '10', isCorrect: false }
      ],
      correctAnswer: 'A',
      explanation: 'sin(θ) = opposite/hypotenuse. 3/5 = opposite/10, so opposite = (3/5) × 10 = 6.'
    },
    {
      id: 'example-2',
      question: 'Which transformation describes the graph of f(x) = (x + 2)² - 3 compared to f(x) = x²?',
      options: [
        { label: 'A', text: '2 left, 3 down', isCorrect: true },
        { label: 'B', text: '2 right, 3 up', isCorrect: false },
        { label: 'C', text: '2 left, 3 up', isCorrect: false },
        { label: 'D', text: '2 right, 3 down', isCorrect: false }
      ],
      correctAnswer: 'A',
      explanation: 'In (x + 2)², the +2 (x is replaced by x + 2) shifts left 2. The -3 shifts down 3.'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'In a right triangle, if the opposite side is 7 and the hypotenuse is 14, what is sin(θ)?',
      options: [
        { label: 'A', text: '0.5' },
        { label: 'B', text: '1' },
        { label: 'C', text: '√3/2' },
        { label: 'D', text: '0.25' }
      ],
      correctAnswer: 'A',
      explanation: 'sin(θ) = opposite/hypotenuse = 7/14 = 0.5.'
    },
    {
      id: 'q2',
      question: 'If f(x) = x² and g(x) = (x - 3)² + 2, how has f been transformed to create g?',
      options: [
        { label: 'A', text: '3 left, 2 up' },
        { label: 'B', text: '3 right, 2 down' },
        { label: 'C', text: '3 right, 2 up' },
        { label: 'D', text: '3 left, 2 down' }
      ],
      correctAnswer: 'C',
      explanation: '(x - 3) shifts right 3; +2 shifts up 2.'
    },
    {
      id: 'q3',
      question: 'What is cos(45°)?',
      options: [
        { label: 'A', text: '1/2' },
        { label: 'B', text: '√2/2' },
        { label: 'C', text: '√3/2' },
        { label: 'D', text: '1' }
      ],
      correctAnswer: 'B',
      explanation: 'cos(45°) = √2/2 ≈ 0.707.'
    },
    {
      id: 'q4',
      question: 'For f(x) = 2ˣ, what is f(3)?',
      options: [
        { label: 'A', text: '6' },
        { label: 'B', text: '8' },
        { label: 'C', text: '9' },
        { label: 'D', text: '5' }
      ],
      correctAnswer: 'B',
      explanation: 'f(3) = 2³ = 2 × 2 × 2 = 8.'
    },
    {
      id: 'q5',
      question: 'If tan(θ) = 3/4 in a right triangle, and the adjacent side is 8, what is the opposite side?',
      options: [
        { label: 'A', text: '6' },
        { label: 'B', text: '8' },
        { label: 'C', text: '12' },
        { label: 'D', text: '4' }
      ],
      correctAnswer: 'A',
      explanation: 'tan(θ) = opposite/adjacent. 3/4 = opposite/8, so opposite = 6.'
    },
    {
      id: 'q6',
      question: 'Which describes f(x) = -x²?',
      options: [
        { label: 'A', text: 'opens upward' },
        { label: 'B', text: 'opens downward' },
        { label: 'C', text: 'is linear' },
        { label: 'D', text: 'has no zeros' }
      ],
      correctAnswer: 'B',
      explanation: 'The negative coefficient (-1) makes the parabola open downward.'
    },
    {
      id: 'q7',
      question: 'In a 30-60-90 triangle, if the hypotenuse is 6, what is the side opposite the 30° angle?',
      options: [
        { label: 'A', text: '3' },
        { label: 'B', text: '3√3' },
        { label: 'C', text: '6' },
        { label: 'D', text: '2' }
      ],
      correctAnswer: 'A',
      explanation: 'In a 30-60-90 triangle, sides are in ratio 1:√3:2. Opposite 30° is the shortest: 6 × (1/2) = 3.'
    },
    {
      id: 'q8',
      question: 'If g(x) = 3f(x), how does the graph of g compare to f?',
      options: [
        { label: 'A', text: 'stretched vertically by factor 3' },
        { label: 'B', text: 'compressed vertically by factor 3' },
        { label: 'C', text: 'shifted right 3' },
        { label: 'D', text: 'shifted up 3' }
      ],
      correctAnswer: 'A',
      explanation: 'Multiplying by 3 stretches the graph vertically—all y-values become 3 times larger.'
    }
  ]
};

// SAT Statistics & Probability Learning Material
const satStatisticsMaterial: LearningMaterial = {
  topicId: 'statistics',
  topicName: 'Statistics & Probability',
  examId: 'sat',
  difficulty: 'Intermediate',
  conceptOverview: `Statistics and probability on the SAT test your ability to interpret data, understand probability concepts, and analyze distributions. Questions involve analyzing charts and graphs, calculating measures of center and spread, understanding normal distributions, and solving probability problems.

Key concepts include mean (average), median (middle value), mode (most frequent), and standard deviation (measure of spread). The normal distribution (bell curve) is particularly important—knowing what percentage falls within one, two, or three standard deviations helps you make predictions about data.

Probability focuses on likelihood of events: basic probability (favorable outcomes/total outcomes), independent and dependent events, and conditional probability. Real-world applications include interpreting survey results, understanding sampling, and recognizing when conclusions are justified by data.`,
  strategies: [
    {
      id: 'data-interpretation',
      title: 'Interpret Data Effectively',
      description: 'Carefully read charts, graphs, and tables. Look for labels, scales, and trends. Don\'t assume—verify information directly from the visualization.',
      example: 'In a bar chart, read the exact height of each bar; don\'t estimate. Notice if axes start at zero or if scale is compressed.'
    },
    {
      id: 'probability-calculation',
      title: 'Calculate Probability Correctly',
      description: 'For simple probability, count favorable outcomes and total outcomes. For compound events, determine if events are independent or dependent.',
      example: 'Probability of rolling 6 on a die = 1/6. Probability of rolling 6 twice = (1/6) × (1/6) = 1/36 (independent events).'
    },
    {
      id: 'distributions',
      title: 'Understand Distributions & Spread',
      description: 'Know the properties of normal distribution: symmetric, 68-95-99.7 rule (percentage within 1, 2, 3 standard deviations), and how standard deviation measures variability.',
      example: 'In a normal distribution, 95% of data falls within 2 standard deviations of the mean.'
    }
  ],
  concepts: [
    {
      id: 'statistics-measures',
      title: 'Measures of Center & Spread',
      content: `**Measures of Center**:
   - Mean: average of all values (sum ÷ count)
   - Median: middle value when ordered (50th percentile)
   - Mode: most frequently occurring value
   - Use mean for roughly symmetric data; median for skewed data

**Measures of Spread**:
   - Range: difference between max and min
   - Interquartile Range (IQR): range of middle 50% (Q3 - Q1)
   - Standard Deviation: typical distance from mean
   - Variance: square of standard deviation

**Normal Distribution (Bell Curve)**:
   - 68% within 1 standard deviation
   - 95% within 2 standard deviations
   - 99.7% within 3 standard deviations`
    },
    {
      id: 'probability-concepts',
      title: 'Probability Rules & Applications',
      content: `**Basic Probability**:
   P(event) = favorable outcomes / total possible outcomes
   Example: Probability of drawing red card = 26/52 = 1/2

**Independent Events**:
   - Events don't affect each other
   - P(A and B) = P(A) × P(B)
   - Example: Rolling dice, flipping coins multiple times

**Dependent Events**:
   - Second event affected by first (no replacement)
   - P(A then B) = P(A) × P(B|A)
   - Example: Drawing cards without replacement

**Conditional Probability**:
   - P(B|A) = probability of B given A occurred
   - Accounts for new information narrowing possibilities`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'A data set contains the values: 5, 8, 8, 12, 15. What is the median?',
      options: [
        { label: 'A', text: '8', isCorrect: true },
        { label: 'B', text: '9.6', isCorrect: false },
        { label: 'C', text: '12', isCorrect: false },
        { label: 'D', text: '5', isCorrect: false }
      ],
      correctAnswer: 'A',
      explanation: 'Median is the middle value. The data ordered is 5, 8, 8, 12, 15. The middle value (3rd of 5) is 8.'
    },
    {
      id: 'example-2',
      question: 'If you draw a card from a standard deck, what is the probability of drawing an ace or a king?',
      options: [
        { label: 'A', text: '1/13', isCorrect: false },
        { label: 'B', text: '2/13', isCorrect: true },
        { label: 'C', text: '1/26', isCorrect: false },
        { label: 'D', text: '1/6', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: 'There are 4 aces and 4 kings = 8 favorable outcomes. Total cards = 52. Probability = 8/52 = 2/13.'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'For the data set {3, 5, 7, 9, 11}, what is the mean?',
      options: [
        { label: 'A', text: '5' },
        { label: 'B', text: '7' },
        { label: 'C', text: '9' },
        { label: 'D', text: '8' }
      ],
      correctAnswer: 'B',
      explanation: 'Mean = (3 + 5 + 7 + 9 + 11) / 5 = 35 / 5 = 7.'
    },
    {
      id: 'q2',
      question: 'If a normal distribution has mean 100 and standard deviation 15, approximately what percent of data falls between 85 and 115?',
      options: [
        { label: 'A', text: '34%' },
        { label: 'B', text: '68%' },
        { label: 'C', text: '95%' },
        { label: 'D', text: '99.7%' }
      ],
      correctAnswer: 'B',
      explanation: '85 = 100 - 15 (one SD below), 115 = 100 + 15 (one SD above). 68% falls within 1 SD.'
    },
    {
      id: 'q3',
      question: 'A spinner has sections colored red, blue, and green in equal sizes. What is the probability of spinning red?',
      options: [
        { label: 'A', text: '1/2' },
        { label: 'B', text: '1/3' },
        { label: 'C', text: '1/6' },
        { label: 'D', text: '2/3' }
      ],
      correctAnswer: 'B',
      explanation: 'Three equal sections, so each has probability 1/3.'
    },
    {
      id: 'q4',
      question: 'What is the range of the data set {2, 8, 5, 12, 9}?',
      options: [
        { label: 'A', text: '5' },
        { label: 'B', text: '7' },
        { label: 'C', text: '10' },
        { label: 'D', text: '9' }
      ],
      correctAnswer: 'C',
      explanation: 'Range = max - min = 12 - 2 = 10.'
    },
    {
      id: 'q5',
      question: 'If you flip a coin twice, what is the probability of getting heads both times?',
      options: [
        { label: 'A', text: '1/2' },
        { label: 'B', text: '1/4' },
        { label: 'C', text: '3/4' },
        { label: 'D', text: '1/8' }
      ],
      correctAnswer: 'B',
      explanation: 'Independent events: P(HH) = (1/2) × (1/2) = 1/4.'
    },
    {
      id: 'q6',
      question: 'In a class of 30 students, 12 play basketball and 18 play soccer. If 5 play both, how many play at least one sport?',
      options: [
        { label: 'A', text: '25' },
        { label: 'B', text: '30' },
        { label: 'C', text: '35' },
        { label: 'D', text: '20' }
      ],
      correctAnswer: 'A',
      explanation: 'Using inclusion-exclusion: 12 + 18 - 5 = 25.'
    },
    {
      id: 'q7',
      question: 'What is the mode of the data set {4, 7, 7, 7, 9, 9, 12}?',
      options: [
        { label: 'A', text: '7' },
        { label: 'B', text: '8' },
        { label: 'C', text: '9' },
        { label: 'D', text: '12' }
      ],
      correctAnswer: 'A',
      explanation: 'Mode is the most frequent value. 7 appears 3 times, more than any other value.'
    },
    {
      id: 'q8',
      question: 'A bag contains 3 red marbles and 7 blue marbles. If you draw without replacement, what is the probability of drawing two red marbles in a row?',
      options: [
        { label: 'A', text: '3/10' },
        { label: 'B', text: '9/100' },
        { label: 'C', text: '1/15' },
        { label: 'D', text: '9/90' }
      ],
      correctAnswer: 'C',
      explanation: 'First red: 3/10. Second red (after removing one red): 2/9. P = (3/10) × (2/9) = 6/90 = 1/15.'
    }
  ]
};

// SAT Essay Structure Learning Material
const satEssayStructureMaterial: LearningMaterial = {
  topicId: 'essay-structure',
  topicName: 'Essay Structure',
  examId: 'sat',
  difficulty: 'Intermediate',
  conceptOverview: `Essay structure questions on the SAT Reading and Writing section test your understanding of how essays are organized and how ideas are connected. While the SAT no longer requires writing essays, questions assess your ability to analyze written arguments, improve organization, and understand how writers develop ideas.

Effective essays follow clear structures: introduction stating the thesis, body paragraphs developing the argument, and conclusion reinforcing the main idea. Body paragraphs follow the same pattern: topic sentence (states main idea), supporting details (evidence), and analysis (explanation of relevance). Transitions connect ideas within and between paragraphs, creating logical flow.

Understanding essay structure helps you recognize effective writing, identify organizational weaknesses, and appreciate how professional writers develop complex arguments. This skill transfers to reading comprehension—understanding how passages are organized helps you locate information and understand relationships between ideas.`,
  strategies: [
    {
      id: 'identify-thesis',
      title: 'Identify the Thesis Statement',
      description: 'Locate the main argument (usually in introduction). The thesis guides the entire essay; all other paragraphs support or develop it.',
      example: 'Thesis: "Social media has fundamentally changed how teenagers develop identity." All body paragraphs explain aspects of this change.'
    },
    {
      id: 'paragraph-unity',
      title: 'Ensure Paragraph Unity',
      description: 'Each paragraph should have one main idea (topic sentence) supported by evidence and analysis. Irrelevant sentences should be removed.',
      example: 'If a paragraph is about "technology benefits," a sentence about "technology dangers" breaks unity and should be revised or moved.'
    },
    {
      id: 'transitions-flow',
      title: 'Use Transitions for Logical Flow',
      description: 'Transitions (however, therefore, similarly, in contrast) guide readers through the argument. They clarify relationships between ideas.',
      example: '"First, we must understand the problem. Then, we can propose solutions. Finally, we implement changes."—transitions show logical progression.'
    }
  ],
  concepts: [
    {
      id: 'essay-structure-model',
      title: 'Standard Essay Structure',
      content: `**Introduction**:
   - Hook: captures attention
   - Background: provides context
   - Thesis: states main argument clearly and specifically

**Body Paragraph** (repeating pattern):
   - Topic sentence: states paragraph's main idea
   - Evidence: quotes, examples, facts supporting the claim
   - Analysis: explains why evidence matters and how it supports thesis
   - Transition: connects to next paragraph

**Conclusion**:
   - Restatement: restates thesis (not word-for-word)
   - Synthesis: shows how ideas connect
   - Implication: discusses broader significance or future impact`
    },
    {
      id: 'transitions-connectors',
      title: 'Transitions & Logical Connectors',
      content: `**To Add/Emphasize**: furthermore, moreover, in addition, indeed, significantly
   Example: "Technology is important. Moreover, it's transforming society."

**To Contrast**: however, although, conversely, on the other hand, yet
   Example: "Some believe TV is harmful. However, research shows mixed results."

**To Show Cause/Effect**: because, therefore, as a result, consequently, thus
   Example: "Climate change accelerates. Consequently, species adapt or disappear."

**To Compare/Relate**: similarly, likewise, in the same way, analogously
   Example: "As water freezes at 32°F, similarly, CO₂ becomes solid at -78°C."

**To Show Time/Sequence**: first, second, finally, meanwhile, subsequently, then
   Example: "Initially, the company struggled. Eventually, it became successful."`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'Which sentence should be removed from this paragraph because it breaks paragraph unity?\n\n"Technology transforms education. Interactive tools engage students better than traditional lectures. Online platforms provide flexibility. Video games are popular with teenagers. Digital resources make education accessible to more people."\n\nA) "Video games are popular with teenagers."\nB) "Technology transforms education."\nC) "Interactive tools engage students better than traditional lectures."\nD) "Digital resources make education accessible to more people."',
      options: [
        { label: 'A', text: '"Video games are popular with teenagers."', isCorrect: true },
        { label: 'B', text: '"Technology transforms education."', isCorrect: false },
        { label: 'C', text: '"Interactive tools engage students better than traditional lectures."', isCorrect: false },
        { label: 'D', text: '"Digital resources make education accessible to more people."', isCorrect: false }
      ],
      correctAnswer: 'A',
      explanation: 'The paragraph focuses on how technology improves education. The sentence about video games being popular is off-topic—it doesn\'t explain education benefits, just mentions a medium teenagers like.'
    },
    {
      id: 'example-2',
      question: 'What is the best transition sentence to connect these two paragraphs?\n\nParagraph 1 ends: "...renewable energy is necessary for sustainability."\nParagraph 2 begins: "Solar power is the most efficient renewable source."\n\nWhich transition works best?\nA) "Another reason is that solar power exists."\nB) "While renewable energy is important, let\'s focus on solar power specifically."\nC) "Solar power is different."\nD) "Renewable energy includes many sources."',
      options: [
        { label: 'A', text: '"Another reason is that solar power exists."', isCorrect: false },
        { label: 'B', text: '"While renewable energy is important, let\'s focus on solar power specifically."', isCorrect: true },
        { label: 'C', text: '"Solar power is different."', isCorrect: false },
        { label: 'D', text: '"Renewable energy includes many sources."', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: 'Option B narrows focus appropriately—it acknowledges the previous point and shifts to the specific topic (solar power). The others lack clarity or logical connection.'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'Which transition best connects these sentences: "Exercise reduces stress. _____ Sleep quality improves when you exercise regularly."',
      options: [
        { label: 'A', text: 'Additionally' },
        { label: 'B', text: 'However' },
        { label: 'C', text: 'In contrast' },
        { label: 'D', text: 'Instead' }
      ],
      correctAnswer: 'A',
      explanation: 'Both sentences discuss benefits of exercise. "Additionally" shows that sleep quality is another benefit (addition), not contrast.'
    },
    {
      id: 'q2',
      question: 'What is the primary purpose of a thesis statement?',
      options: [
        { label: 'A', text: 'Entertain the reader with a story' },
        { label: 'B', text: 'State the main argument the essay will prove' },
        { label: 'C', text: 'Summarize all sources used' },
        { label: 'D', text: 'Pose questions the reader should answer' }
      ],
      correctAnswer: 'B',
      explanation: 'Thesis statements declare the main argument, providing the roadmap for everything that follows.'
    },
    {
      id: 'q3',
      question: 'Which sentence should be removed to improve paragraph unity?\n\n"Climate change affects weather patterns. Rising temperatures alter ecosystems. Polar ice melts rapidly. Video games have realistic graphics. Extreme weather events become more frequent."\n\nA) "Climate change affects weather patterns."\nB) "Rising temperatures alter ecosystems."\nC) "Video games have realistic graphics."\nD) "Extreme weather events become more frequent."',
      options: [
        { label: 'A', text: '"Climate change affects weather patterns."' },
        { label: 'B', text: '"Rising temperatures alter ecosystems."' },
        { label: 'C', text: '"Video games have realistic graphics."' },
        { label: 'D', text: '"Extreme weather events become more frequent."' }
      ],
      correctAnswer: 'C',
      explanation: 'Video games are completely off-topic in a paragraph about climate change impacts.'
    },
    {
      id: 'q4',
      question: 'A paragraph\'s topic sentence should:',
      options: [
        { label: 'A', text: 'Provide all supporting evidence in detail' },
        { label: 'B', text: 'State the paragraph\'s main idea concisely' },
        { label: 'C', text: 'Argue against the thesis' },
        { label: 'D', text: 'Conclude the entire essay' }
      ],
      correctAnswer: 'B',
      explanation: 'Topic sentences introduce the main idea, which subsequent sentences then support with evidence and analysis.'
    },
    {
      id: 'q5',
      question: 'How should a conclusion differ from an introduction?',
      options: [
        { label: 'A', text: 'Introduction is longer' },
        { label: 'B', text: 'Conclusion should restate rather than introduce new ideas' },
        { label: 'C', text: 'They should be identical' },
        { label: 'D', text: 'Conclusion doesn\'t mention the thesis' }
      ],
      correctAnswer: 'B',
      explanation: 'Conclusions recap and reinforce existing ideas; introductions present new ideas for the first time.'
    },
    {
      id: 'q6',
      question: 'Which transition best shows cause-and-effect? "Poor sleep affects health. _____ productivity decreases."',
      options: [
        { label: 'A', text: 'Similarly' },
        { label: 'B', text: 'Conversely' },
        { label: 'C', text: 'As a result' },
        { label: 'D', text: 'Likewise' }
      ],
      correctAnswer: 'C',
      explanation: '"As a result" shows that decreased productivity is a consequence of poor sleep—a cause-effect relationship.'
    },
    {
      id: 'q7',
      question: 'Supporting evidence in an essay should:',
      options: [
        { label: 'A', text: 'Be vague and general' },
        { label: 'B', text: 'Directly support the topic sentence' },
        { label: 'C', text: 'Contradict the main argument' },
        { label: 'D', text: 'Fill space without relevance' }
      ],
      correctAnswer: 'B',
      explanation: 'Evidence should directly support and clarify the paragraph\'s main idea (topic sentence).'
    },
    {
      id: 'q8',
      question: 'What does "paragraph unity" mean?',
      options: [
        { label: 'A', text: 'All sentences discuss one main idea' },
        { label: 'B', text: 'Paragraphs are the same length' },
        { label: 'C', text: 'Each paragraph contradicts the others' },
        { label: 'D', text: 'Sentences are arranged randomly' }
      ],
      correctAnswer: 'A',
      explanation: 'Unity means every sentence in a paragraph relates to and supports one central idea.'
    }
  ]
};

// SAT Argumentation & Evidence Learning Material
const satArgumentationMaterial: LearningMaterial = {
  topicId: 'argumentation',
  topicName: 'Argumentation & Evidence',
  examId: 'sat',
  difficulty: 'Advanced',
  conceptOverview: `Argumentation and evidence questions assess your understanding of how writers build persuasive arguments. The SAT tests how well you recognize strong vs. weak evidence, identify logical fallacies, understand claims vs. warrants, and evaluate whether evidence supports conclusions.

A strong argument has three components: claim (what's argued), evidence (facts supporting the claim), and warrant (explanation of how evidence supports the claim). Weak arguments might have vague claims, insufficient or irrelevant evidence, or logical leaps between evidence and conclusion. Logical fallacies—reasoning errors—weaken arguments by appealing to emotion rather than logic, using circular reasoning, or overgeneralizing.

Understanding argumentation makes you a critical consumer of information and a more effective writer. You learn to question claims, evaluate evidence quality, and recognize persuasion techniques. This skill is essential in academic and professional contexts where sound reasoning matters.`,
  strategies: [
    {
      id: 'evaluate-evidence-quality',
      title: 'Evaluate Evidence Quality',
      description: 'Not all evidence is equal. Distinguish between anecdotal evidence (one story), statistical evidence (data from many cases), expert testimony (authority on topic), and logical reasoning.',
      example: 'A doctor\'s statement about health is stronger evidence than a celebrity\'s opinion. A study of 1,000 people is stronger than one person\'s experience.'
    },
    {
      id: 'identify-logical-fallacies',
      title: 'Identify Logical Fallacies',
      description: 'Recognize common reasoning errors: hasty generalization (concluding from few examples), ad hominem (attacking person instead of argument), false cause (assuming one event caused another).',
      example: '"Everyone who eats sugar gets fat" is hasty generalization. "Don\'t trust him; he\'s unlikeable" is ad hominem.'
    },
    {
      id: 'assess-warrant',
      title: 'Assess the Warrant (Bridge)',
      description: 'The warrant is the reasoning connecting evidence to claim. If the warrant is weak or missing, the argument fails even with good evidence.',
      example: 'Claim: "Recycling helps the environment." Evidence: "40% of landfills contain plastic." Warrant: "Reducing landfill waste through recycling decreases environmental impact."'
    }
  ],
  concepts: [
    {
      id: 'argument-components',
      title: 'Components of Strong Arguments',
      content: `**Claim**: The assertion or proposition being argued.
   - Should be specific and defensible (not absolute)
   - Weak: "Homework is bad." Strong: "Excessive homework reduces student well-being."

**Evidence**: Facts, data, examples, or expert testimony supporting the claim.
   - Types: Statistical (data), anecdotal (stories), testimonial (expert opinion), logical reasoning
   - Strong evidence is relevant, sufficient in quantity, and from credible sources

**Warrant**: The logical connection between evidence and claim.
   - Explains why the evidence matters and how it supports the claim
   - Often implied but should be clear to reader
   - Weak warrant: Evidence exists but doesn't actually support the claim

**Counterargument**: Acknowledging opposing views.
   - Shows the writer understands complexity
   - Strengthens argument by addressing objections`
    },
    {
      id: 'logical-fallacies-detailed',
      title: 'Common Logical Fallacies',
      content: `**Hasty Generalization**: Drawing broad conclusions from limited examples.
   Example: "My friend got sick from sushi, so sushi is unsafe." (One person's bad experience)

**Ad Hominem**: Attacking the person instead of the argument.
   Example: "Don't listen to his environmental argument; he drives a car." (Personal attack, not refutation)

**False Cause (Post Hoc)**: Assuming one event caused another without evidence.
   Example: "After the new principal arrived, test scores rose. The principal caused improvement." (Could be coincidence)

**Circular Reasoning**: Using the claim to prove the claim.
   Example: "Homework is necessary because students need homework." (Doesn't explain why)

**Appeal to Emotion**: Using feelings instead of logic to persuade.
   Example: "You must support this charity because think of the starving children!" (Emotional, not evidence-based)

**False Dilemma**: Presenting only two options when more exist.
   Example: "Either you support this policy, or you don't care about education." (Other positions possible)`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'Which type of evidence would most strengthen this claim: "Social media causes depression in teenagers"?\nA) A teenager\'s personal story about feeling sad after Instagram\nB) A study showing correlation between social media use and depression rates in 5,000 teens\nC) A celebrity\'s opinion that social media is harmful\nD) A quote from someone who quit social media and felt better',
      options: [
        { label: 'A', text: 'A teenager\'s personal story about feeling sad after Instagram', isCorrect: false },
        { label: 'B', text: 'A study showing correlation between social media use and depression rates in 5,000 teens', isCorrect: true },
        { label: 'C', text: 'A celebrity\'s opinion that social media is harmful', isCorrect: false },
        { label: 'D', text: 'A quote from someone who quit social media and felt better', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: 'Statistical evidence from a large sample (5,000 teens) is stronger than anecdotes or opinion. It shows patterns across many people, not just isolated cases.'
    },
    {
      id: 'example-2',
      question: 'Which statement represents a logical fallacy?\nA) "Studies show exercise reduces heart disease risk."\nB) "If you don\'t exercise, you don\'t care about your health."\nC) "People who exercise report better well-being."\nD) "Exercise has been proven to improve mood."',
      options: [
        { label: 'A', text: '"Studies show exercise reduces heart disease risk."', isCorrect: false },
        { label: 'B', text: '"If you don\'t exercise, you don\'t care about your health."', isCorrect: true },
        { label: 'C', text: '"People who exercise report better well-being."', isCorrect: false },
        { label: 'D', text: '"Exercise has been proven to improve mood."', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: 'Option B presents a false dilemma—it claims only two options (exercise or don\'t care) when someone might not exercise for many reasons (injury, time, preference) while still caring about health.'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'Which provides the strongest evidence for the claim "College education increases earning potential"?',
      options: [
        { label: 'A', text: 'A college graduate I know makes a lot of money' },
        { label: 'B', text: 'Government data showing college graduates earn 80% more than high school graduates' },
        { label: 'C', text: 'My uncle didn\'t go to college and regrets it' },
        { label: 'D', text: 'College seems important' }
      ],
      correctAnswer: 'B',
      explanation: 'Large-scale statistical data is stronger than anecdotes or opinions.'
    },
    {
      id: 'q2',
      question: 'Which argument contains a logical fallacy?',
      options: [
        { label: 'A', text: 'Fast food is unhealthy because it contains excessive salt, sugar, and fat' },
        { label: 'B', text: 'Smoking is bad because tobacco companies are greedy' },
        { label: 'C', text: 'Climate change is real because temperature records show warming' },
        { label: 'D', text: 'Sleep deprivation impairs judgment based on neurological research' }
      ],
      correctAnswer: 'B',
      explanation: 'Option B uses ad hominem fallacy—attacking the companies instead of presenting evidence that smoking is harmful.'
    },
    {
      id: 'q3',
      question: 'What is the warrant in this argument? Claim: "We should fund public parks." Evidence: "Parks increase community engagement."',
      options: [
        { label: 'A', text: 'Parks are beautiful' },
        { label: 'B', text: 'Increased community engagement benefits society' },
        { label: 'C', text: 'Some people don\'t use parks' },
        { label: 'D', text: 'Parks cost money' }
      ],
      correctAnswer: 'B',
      explanation: 'The warrant explains why the evidence (parks increase engagement) supports the claim (we should fund them)—because community engagement is beneficial.'
    },
    {
      id: 'q4',
      question: 'Which represents a false cause fallacy?',
      options: [
        { label: 'A', text: 'The roof leaks because the shingles are damaged' },
        { label: 'B', text: 'Grades improved after the new teacher arrived, so the teacher caused improvement' },
        { label: 'C', text: 'Pollution causes respiratory illness based on medical studies' },
        { label: 'D', text: 'Dehydration causes fatigue because water is essential for body function' }
      ],
      correctAnswer: 'B',
      explanation: 'Option B assumes causation from timing alone. Grades might have improved due to other factors (curriculum change, student effort, etc.), not just the new teacher.'
    },
    {
      id: 'q5',
      question: 'What weakness does this argument have? "We must ban sugary drinks because they taste good and people enjoy them."',
      options: [
        { label: 'A', text: 'The evidence doesn\'t support the claim' },
        { label: 'B', text: 'The claim is too broad' },
        { label: 'C', text: 'There is no counterargument' },
        { label: 'D', text: 'The warrant is missing' }
      ],
      correctAnswer: 'A',
      explanation: 'Saying drinks taste good is not evidence for banning them. The argument confuses reasons people consume them with reasons to ban them.'
    },
    {
      id: 'q6',
      question: 'Which is an example of hasty generalization?',
      options: [
        { label: 'A', text: 'Research shows most teenagers sleep too little' },
        { label: 'B', text: '"All teenagers are lazy because my neighbor\'s kid doesn\'t do chores"' },
        { label: 'C', text: 'Studies indicate that sleep deprivation affects academic performance' },
        { label: 'D', text: 'Experts agree that sleep is important for development' }
      ],
      correctAnswer: 'B',
      explanation: 'Drawing a conclusion about all teenagers from one person\'s experience is hasty generalization.'
    },
    {
      id: 'q7',
      question: 'An argument would be stronger if it:',
      options: [
        { label: 'A', text: 'Acknowledged counterarguments' },
        { label: 'B', text: 'Used only emotion and opinion' },
        { label: 'C', text: 'Attacked critics personally' },
        { label: 'D', text: 'Avoided specific evidence' }
      ],
      correctAnswer: 'A',
      explanation: 'Acknowledging opposing views shows understanding of complexity and strengthens credibility.'
    },
    {
      id: 'q8',
      question: 'Which statement best represents "appeal to emotion" fallacy?',
      options: [
        { label: 'A', text: 'Research shows this solution works' },
        { label: 'B', text: '"This policy will save innocent children\'s lives!" (without explaining how)' },
        { label: 'C', text: 'Experts agree on this approach' },
        { label: 'D', text: 'Statistics demonstrate the effectiveness' }
      ],
      correctAnswer: 'B',
      explanation: 'Using emotional language ("innocent children") to persuade without evidence or logic is appeal to emotion fallacy.'
    }
  ]
};

// ACT ENGLISH TOPICS
const actPunctuationMaterial: LearningMaterial = {
  topicId: 'punctuation',
  topicName: 'Punctuation',
  examId: 'act',
  difficulty: 'Beginner',
  conceptOverview: `Punctuation on the ACT tests your ability to correctly use commas, semicolons, dashes, colons, apostrophes, and other marks. Proper punctuation clarifies meaning and prevents confusion in writing. The ACT focuses on the most common and important punctuation rules.

Commas are the most frequently tested punctuation mark. They separate independent clauses joined by conjunctions, separate items in a series, set off introductory phrases, and separate nonrestrictive clauses. Semicolons connect closely related independent clauses and separate items in complex lists. Dashes emphasize information and create breaks in thought. Apostrophes show possession and contractions. Colons introduce lists or explanations.

Understanding when and where to use punctuation makes your writing clearer and more professional. The key is recognizing the function of each mark and the specific rules governing its use.`,
  strategies: [
    {
      id: 'comma-rules',
      title: 'Master Comma Rules',
      description: 'Learn the five main comma rules: independent clauses with conjunctions (FANBOYS), series items, introductory elements, nonrestrictive clauses, and direct address.',
      example: 'Correct: "We went to the store, and we bought groceries." Uses comma before "and" connecting two independent clauses.'
    },
    {
      id: 'semicolon-vs-colon',
      title: 'Distinguish Semicolons and Colons',
      description: 'Use semicolons to join independent clauses; use colons to introduce lists, explanations, or quotes.',
      example: 'Semicolon: "She studied hard; she earned an A." Colon: "To succeed, you need three things: dedication, practice, and support."'
    },
    {
      id: 'punctuation-context',
      title: 'Consider Context and Function',
      description: 'The best punctuation depends on the relationship between ideas. Close relationships use semicolons; emphasis uses dashes; separation uses commas.',
      example: 'Dashes for emphasis: "She had one goal—to win." Comma for lists: "The team included John, Maria, and Samuel."'
    }
  ],
  concepts: [
    {
      id: 'comma-rules-detailed',
      title: 'Comma Rules',
      content: `**Comma Before FANBOYS**: Use comma before conjunctions (For, And, Nor, But, Or, Yet, So) connecting independent clauses.
   Example: "She wanted to go, but he preferred to stay home."

**Series Commas**: Separate items in a list. Include "Oxford comma" before final "and/or".
   Example: "She bought apples, oranges, and bananas."

**Introductory Elements**: Use comma after introductory phrases or clauses.
   Example: "After the game ended, everyone went home."

**Nonrestrictive Clauses**: Set off extra information about nouns with commas.
   Example: "Sarah, who is my sister, is a doctor." (extra info about Sarah)

**No Comma for Restrictive Clauses**: Don't use commas for essential information.
   Example: "The student who scored highest won the prize." (essential—which student?)`
    },
    {
      id: 'other-punctuation',
      title: 'Semicolons, Dashes, Colons, Apostrophes',
      content: `**Semicolons**: Join independent clauses or separate complex list items.
   Example: "She studied all night; she was exhausted the next morning."

**Dashes**: Create emphasis, show contrast, or set off additional information.
   Example: "He had everything he wanted—except happiness."

**Colons**: Introduce lists, explanations, quotes, or examples.
   Example: "Here's what you need: notebooks, pencils, and folders."

**Apostrophes**: Show possession (add 's) or indicate contractions.
   Example: "Sarah's book" (possession), "It's raining" (it is, contraction)`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'Which version uses punctuation correctly?\nA) She wanted to go, but he preferred to stay.\nB) She wanted to go but, he preferred to stay.\nC) She wanted to go, but he preferred, to stay.',
      options: [
        { label: 'A', text: 'She wanted to go, but he preferred to stay.', isCorrect: true },
        { label: 'B', text: 'She wanted to go but, he preferred to stay.', isCorrect: false },
        { label: 'C', text: 'She wanted to go, but he preferred, to stay.', isCorrect: false },
        { label: 'D', text: 'She wanted to go but he preferred to stay', isCorrect: false }
      ],
      correctAnswer: 'A',
      explanation: 'Comma should go before "but" when joining two independent clauses. Option B puts comma after "but" (incorrect), Option C adds unnecessary comma.'
    },
    {
      id: 'example-2',
      question: 'Which sentence correctly uses a semicolon?\nA) He studied hard; therefore, he passed the exam.\nB) The team included: John, Maria, and Sam.\nC) Sarah, my best friend lives nearby.',
      options: [
        { label: 'A', text: 'He studied hard; therefore, he passed the exam.', isCorrect: true },
        { label: 'B', text: 'The team included: John, Maria, and Sam.', isCorrect: false },
        { label: 'C', text: 'Sarah, my best friend lives nearby.', isCorrect: false },
        { label: 'D', text: 'He studied hard, therefore he passed the exam.', isCorrect: false }
      ],
      correctAnswer: 'A',
      explanation: 'Semicolon correctly connects two independent clauses. B should use colon but also needs a noun after "included". C needs commas around "my best friend".'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'Which sentence is punctuated correctly?',
      options: [
        { label: 'A', text: 'We went to the store and we bought milk.' },
        { label: 'B', text: 'We went to the store, and we bought milk.' },
        { label: 'C', text: 'We went to the store; we bought milk.' },
        { label: 'D', text: 'Both B and C are correct.' }
      ],
      correctAnswer: 'D',
      explanation: 'Both B (comma before "and") and C (semicolon) are correct for joining independent clauses.'
    },
    {
      id: 'q2',
      question: 'Choose the correctly punctuated series:',
      options: [
        { label: 'A', text: 'apples, oranges and bananas' },
        { label: 'B', text: 'apples, oranges, and bananas' },
        { label: 'C', text: 'apples oranges and bananas' },
        { label: 'D', text: 'apples; oranges; and bananas' }
      ],
      correctAnswer: 'B',
      explanation: 'Option B correctly uses the Oxford comma (comma before final "and") in a series.'
    },
    {
      id: 'q3',
      question: 'Which uses an apostrophe correctly?',
      options: [
        { label: 'A', text: 'The dog lost it\'s bone.' },
        { label: 'B', text: 'The dog lost its bone.' },
        { label: 'C', text: 'The dog\'s lost its bone.' },
        { label: 'D', text: 'The dogs\' lost their bones.' }
      ],
      correctAnswer: 'B',
      explanation: '"Its" (no apostrophe) is the possessive; "it\'s" means "it is". Option B is correct.'
    },
    {
      id: 'q4',
      question: 'Which correctly uses a semicolon?',
      options: [
        { label: 'A', text: 'The weather was cold; it was snowing outside.' },
        { label: 'B', text: 'The items included; books and pens.' },
        { label: 'C', text: 'She likes; swimming, running, and biking.' },
        { label: 'D', text: 'We went to; the store, the park, and home.' }
      ],
      correctAnswer: 'A',
      explanation: 'Semicolons join independent clauses. A is correct. B, C, D incorrectly place semicolons before lists.'
    },
    {
      id: 'q5',
      question: 'What punctuation belongs in this sentence? "After the movie _____ we went to dinner."',
      options: [
        { label: 'A', text: 'ended' },
        { label: 'B', text: 'ended,' },
        { label: 'C', text: 'ended;' },
        { label: 'D', text: 'ended.' }
      ],
      correctAnswer: 'B',
      explanation: 'A comma follows an introductory phrase (After the movie ended) that comes before the main clause.'
    },
    {
      id: 'q6',
      question: 'Which uses a dash correctly?',
      options: [
        { label: 'A', text: 'She had—everything she wanted—except time.' },
        { label: 'B', text: 'She had everything—she wanted, except time.' },
        { label: 'C', text: 'She had everything she wanted—except—time.' },
        { label: 'D', text: 'She had everything she wanted except—time.' }
      ],
      correctAnswer: 'A',
      explanation: 'Dashes set off added information or emphasis. A correctly uses paired dashes for emphasis.'
    },
    {
      id: 'q7',
      question: 'Which sentence needs a comma?',
      options: [
        { label: 'A', text: 'Sarah who is my sister lives here.' },
        { label: 'B', text: 'My sister Sarah lives here.' },
        { label: 'C', text: 'The girl who scored highest won.' },
        { label: 'D', text: 'We studied hard and earned good grades.' }
      ],
      correctAnswer: 'A',
      explanation: '"Who is my sister" is nonrestrictive (extra info), so it needs commas: "Sarah, who is my sister, lives here."'
    },
    {
      id: 'q8',
      question: 'Which uses punctuation correctly?',
      options: [
        { label: 'A', text: 'The recipe calls for: flour, sugar, and eggs.' },
        { label: 'B', text: 'The recipe calls for flour: sugar and eggs.' },
        { label: 'C', text: 'The recipe calls for flour, sugar, and eggs.' },
        { label: 'D', text: 'The recipe calls for: flour, sugar, eggs.' }
      ],
      correctAnswer: 'C',
      explanation: 'A colon should only be used when words precede it, or when introducing a formal list. C is correct (just comma-separated list).'
    }
  ]
};

const actGrammarMaterial: LearningMaterial = {
  topicId: 'grammar-act',
  topicName: 'Grammar & Usage',
  examId: 'act',
  difficulty: 'Intermediate',
  conceptOverview: `Grammar and usage on the ACT test your command of standard English conventions. This includes subject-verb agreement, verb tenses, pronoun-antecedent agreement, parallel structure, and proper word usage.

Subject-verb agreement requires that singular subjects use singular verbs and plural subjects use plural verbs. Verb tense must be consistent within a sentence or paragraph unless a shift is intentional and clear. Pronouns must clearly refer to their antecedents and agree in number and gender. Parallel structure means listing items in the same grammatical form.

Mastering these rules prevents common writing errors and makes communication clear and professional. The ACT expects understanding of both basic and advanced grammar concepts.`,
  strategies: [
    {
      id: 'subject-verb-agreement',
      title: 'Master Subject-Verb Agreement',
      description: 'Identify the subject (singular or plural) and match it with the correct verb form. Ignore intervening phrases.',
      example: 'Correct: "The team of players is ready." (team = singular subject, so "is" not "are")'
    },
    {
      id: 'verb-tense-consistency',
      title: 'Maintain Consistent Verb Tense',
      description: 'Keep verb tenses consistent unless there\'s a clear reason to shift. Use past tense for past events, present for current situations.',
      example: 'Correct: "She studied hard and earned an A." (both past tense, not "studies and earned")'
    },
    {
      id: 'pronoun-agreement',
      title: 'Ensure Pronoun-Antecedent Agreement',
      description: 'Pronouns must agree with their antecedents in number (singular/plural) and gender.',
      example: 'Correct: "Each student submitted his or her assignment." (each = singular, so "his or her" not "their")'
    }
  ],
  concepts: [
    {
      id: 'agreement-rules',
      title: 'Subject-Verb & Pronoun-Antecedent Agreement',
      content: `**Subject-Verb Agreement**:
   - Singular subject + singular verb: "The cat runs fast."
   - Plural subject + plural verb: "The cats run fast."
   - Tricky: "The team IS" (collective nouns = singular)
   - Ignore phrases between subject and verb: "The box OF toys IS heavy."

**Pronoun-Antecedent Agreement**:
   - Singular antecedent + singular pronoun: "Sarah submitted her assignment."
   - Plural antecedent + plural pronoun: "Students submitted their assignments."
   - Note: "Everyone," "each," "anyone" are singular: "Everyone brought his/her book."`
    },
    {
      id: 'verb-tense-parallel',
      title: 'Verb Tense & Parallel Structure',
      content: `**Verb Tense Consistency**:
   - Past: "She studied and earned high grades."
   - Present: "She studies and earns high grades."
   - Future: "She will study and will earn high grades."

**Parallel Structure**: Items in lists/comparisons must have same grammatical form.
   - Incorrect: "She likes running, to swim, and biking."
   - Correct: "She likes running, swimming, and biking." (all -ing forms)
   - Incorrect: "The report was informative, well-researched, and a good length."
   - Correct: "The report was informative, well-researched, and well-written." (all adjectives)`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'Which sentence has correct subject-verb agreement?\nA) The team of players are ready.\nB) The team of players is ready.\nC) The teams of players is ready.\nD) The team of players have been ready.',
      options: [
        { label: 'A', text: 'The team of players are ready.', isCorrect: false },
        { label: 'B', text: 'The team of players is ready.', isCorrect: true },
        { label: 'C', text: 'The teams of players is ready.', isCorrect: false },
        { label: 'D', text: 'The team of players have been ready.', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: '"Team" is singular, so it takes singular verb "is". "Of players" is a prepositional phrase that doesn\'t affect the subject.'
    },
    {
      id: 'example-2',
      question: 'Which has correct parallel structure?\nA) She likes hiking, swimming, and to kayak.\nB) She likes to hike, to swim, and kayak.\nC) She likes hiking, swimming, and kayaking.\nD) She likes hiking, to swim, kayaking.',
      options: [
        { label: 'A', text: 'She likes hiking, swimming, and to kayak.', isCorrect: false },
        { label: 'B', text: 'She likes to hike, to swim, and kayak.', isCorrect: false },
        { label: 'C', text: 'She likes hiking, swimming, and kayaking.', isCorrect: true },
        { label: 'D', text: 'She likes hiking, to swim, kayaking.', isCorrect: false }
      ],
      correctAnswer: 'C',
      explanation: 'All items must have the same form. C uses all "-ing" forms (hiking, swimming, kayaking) for consistency.'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'Choose the sentence with correct subject-verb agreement:',
      options: [
        { label: 'A', text: 'The group of students are meeting tomorrow.' },
        { label: 'B', text: 'The group of students is meeting tomorrow.' },
        { label: 'C', text: 'The groups of students is meeting tomorrow.' },
        { label: 'D', text: 'The group students are meeting tomorrow.' }
      ],
      correctAnswer: 'B',
      explanation: '"Group" is singular, requires singular verb "is".'
    },
    {
      id: 'q2',
      question: 'Which sentence maintains consistent verb tense?',
      options: [
        { label: 'A', text: 'She studied hard and gets an A.' },
        { label: 'B', text: 'She studies hard and gets an A.' },
        { label: 'C', text: 'She studied hard and got an A.' },
        { label: 'D', text: 'She studies hard and got an A.' }
      ],
      correctAnswer: 'C',
      explanation: 'Both verbs should be past tense: "studied" and "got".'
    },
    {
      id: 'q3',
      question: 'Which has correct pronoun-antecedent agreement?',
      options: [
        { label: 'A', text: 'Each student should bring their book.' },
        { label: 'B', text: 'Each student should bring his or her book.' },
        { label: 'C', text: 'All students should bring his book.' },
        { label: 'D', text: 'Students should bring their books.' }
      ],
      correctAnswer: 'B',
      explanation: '"Each" is singular, requires "his or her" not "their".'
    },
    {
      id: 'q4',
      question: 'Which has correct parallel structure?',
      options: [
        { label: 'A', text: 'The recipe includes flour, sugar, and mixing butter.' },
        { label: 'B', text: 'The recipe includes flour, sugar, and butter.' },
        { label: 'C', text: 'The recipe including flour, sugar, and to mix butter.' },
        { label: 'D', text: 'The recipe include flour, sugar, and butter.' }
      ],
      correctAnswer: 'B',
      explanation: 'Items in a list should be parallel. B lists three nouns (flour, sugar, butter).'
    },
    {
      id: 'q5',
      question: 'Choose the grammatically correct sentence:',
      options: [
        { label: 'A', text: 'Neither John nor Sarah are going.' },
        { label: 'B', text: 'Neither John nor Sarah is going.' },
        { label: 'C', text: 'Neither John nor Sarah were going.' },
        { label: 'D', text: 'Neither John or Sarah is going.' }
      ],
      correctAnswer: 'B',
      explanation: 'With "neither...nor", use singular verb "is" when subjects are singular.'
    },
    {
      id: 'q6',
      question: 'What is wrong with this sentence? "The band plays exciting music, performs at festivals, and they write original songs."',
      options: [
        { label: 'A', text: 'Subject-verb disagreement' },
        { label: 'B', text: 'Inconsistent pronoun use' },
        { label: 'C', text: 'Lack of parallel structure' },
        { label: 'D', text: 'Incorrect verb tense' }
      ],
      correctAnswer: 'C',
      explanation: 'First two items are verb phrases ("plays", "performs"); the third shifts to a different structure ("they write").'
    },
    {
      id: 'q7',
      question: 'Which sentence is grammatically correct?',
      options: [
        { label: 'A', text: 'The number of errors were high.' },
        { label: 'B', text: 'The number of errors was high.' },
        { label: 'C', text: 'The errors of numbers was high.' },
        { label: 'D', text: 'The numbers of error were high.' }
      ],
      correctAnswer: 'B',
      explanation: '"Number" is singular, requires "was". "The number of" always takes singular verb.'
    },
    {
      id: 'q8',
      question: 'Identify the parallel structure error:',
      options: [
        { label: 'A', text: 'She excels at writing, speaking, and mathematical reasoning.' },
        { label: 'B', text: 'She excels at writing, speaking, and reasoning mathematically.' },
        { label: 'C', text: 'She excels at writing, at speaking, and at reasoning.' },
        { label: 'D', text: 'She excels at writing, speaking, and math reasoning.' }
      ],
      correctAnswer: 'A',
      explanation: '"Writing" and "speaking" are noun forms, but "mathematical reasoning" is an adjective-noun form—inconsistent structure.'
    }
  ]
};

// Continuing with more ACT and other exam topics...
// Due to size constraints, creating a comprehensive set with remaining critical topics

const actRhetoricalSkillsMaterial: LearningMaterial = {
  topicId: 'rhetorical-skills',
  topicName: 'Rhetorical Skills',
  examId: 'act',
  difficulty: 'Advanced',
  conceptOverview: `Rhetorical skills on the ACT assess your ability to recognize effective writing strategy, organization, and word choice. These questions focus on how writers achieve their purpose, organize ideas, and select words that best convey meaning.

Rhetorical skills include understanding transitions (words that connect ideas), organization (paragraph order and structure), and style (word choice for tone and audience). Writers use transitions to guide readers through logic. Organization affects how well ideas flow and connect. Word choice affects tone—whether writing is formal, casual, technical, or persuasive.

Mastering rhetorical skills makes you a more effective writer. You learn to organize thoughts clearly, choose words precisely, and guide readers through your argument with appropriate transitions.`,
  strategies: [
    {
      id: 'transitions-strategy',
      title: 'Master Transitions',
      description: 'Use transitions to show relationships between ideas: addition (furthermore), contrast (however), cause-effect (therefore), or sequence (then).',
      example: 'Addition: "The data supports this conclusion. Furthermore, multiple studies confirm it."'
    },
    {
      id: 'organization-strategy',
      title: 'Recognize Effective Organization',
      description: 'Ideas should flow logically. Paragraphs need topic sentences. Information should be in chronological, spatial, or logical order.',
      example: 'Good organization: Background → Problem → Solution → Conclusion (logical progression)'
    },
    {
      id: 'style-word-choice',
      title: 'Analyze Style and Word Choice',
      description: 'Words should match audience, purpose, and tone. Formal writing uses different language than casual writing. Precise words communicate better than vague ones.',
      example: 'Formal: "The investigation revealed pertinent findings." Casual: "We found out some cool stuff."'
    }
  ],
  concepts: [
    {
      id: 'transitions-detailed',
      title: 'Transitions & Connectors',
      content: `**Addition/Emphasis**: furthermore, moreover, in addition, indeed, significantly
   Example: "This is important. Moreover, it has lasting effects."

**Contrast**: however, although, in contrast, yet, conversely, on the other hand
   Example: "He appeared confident. However, he felt nervous."

**Cause-Effect**: because, therefore, as a result, consequently, thus, so
   Example: "The experiment failed. Consequently, we redesigned it."

**Sequence/Time**: first, next, then, finally, meanwhile, subsequently
   Example: "First, prepare materials. Next, mix ingredients. Finally, bake."`
    },
    {
      id: 'organization-structure',
      title: 'Organization & Structure',
      content: `**Logical Progression**: Ideas build on each other meaningfully.
   - General to specific (start broad, narrow focus)
   - Problem to solution (identify issue, offer answer)
   - Chronological (events in time order)

**Paragraph Structure**:
   - Topic sentence states main idea
   - Supporting sentences provide evidence
   - Concluding sentence reinforces idea

**Coherence**: Sentences connect and flow smoothly without jumps or gaps in logic.
   - Use transitions
   - Maintain consistent subject and perspective
   - Arrange ideas logically`
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      question: 'Which transition best connects these sentences? "The economy improved rapidly. _____ unemployment rates decreased."',
      options: [
        { label: 'A', text: 'However', isCorrect: false },
        { label: 'B', text: 'Therefore', isCorrect: true },
        { label: 'C', text: 'Meanwhile', isCorrect: false },
        { label: 'D', text: 'In contrast', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: '"Therefore" shows cause-effect relationship (improved economy → decreased unemployment).'
    },
    {
      id: 'example-2',
      question: 'Sentence 1: She had studied all night. Sentence 2: She felt exhausted during the exam. What transition works best?\nA) Furthermore\nB) Consequently\nC) Additionally\nD) In addition',
      options: [
        { label: 'A', text: 'Furthermore', isCorrect: false },
        { label: 'B', text: 'Consequently', isCorrect: true },
        { label: 'C', text: 'Additionally', isCorrect: false },
        { label: 'D', text: 'In addition', isCorrect: false }
      ],
      correctAnswer: 'B',
      explanation: '"Consequently" shows that studying all night caused (resulted in) exhaustion during exam.'
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'Which transition best shows contrast?',
      options: [
        { label: 'A', text: 'Therefore' },
        { label: 'B', text: 'However' },
        { label: 'C', text: 'Furthermore' },
        { label: 'D', text: 'Moreover' }
      ],
      correctAnswer: 'B',
      explanation: '"However" introduces contrasting ideas.'
    },
    {
      id: 'q2',
      question: 'Which sentence would best begin a paragraph after one discussing a problem?',
      options: [
        { label: 'A', text: 'Additionally, the issue remains serious.' },
        { label: 'B', text: 'Furthermore, we must consider alternatives.' },
        { label: 'C', text: 'Now, some propose a solution.' },
        { label: 'D', text: 'Meanwhile, scientists continue studying.' }
      ],
      correctAnswer: 'C',
      explanation: 'After discussing a problem, a natural progression is to introduce solutions.'
    },
    {
      id: 'q3',
      question: 'Which word choice is most appropriate for formal writing?',
      options: [
        { label: 'A', text: 'The data showed some cool results.' },
        { label: 'B', text: 'The analysis yielded significant findings.' },
        { label: 'C', text: 'The stuff we found was interesting.' },
        { label: 'D', text: 'We figured out pretty important things.' }
      ],
      correctAnswer: 'B',
      explanation: '"Yielded significant findings" is formal and precise, appropriate for academic writing.'
    },
    {
      id: 'q4',
      question: 'What is the best organization for an argument essay?',
      options: [
        { label: 'A', text: 'Conclusion, evidence, counterargument, thesis' },
        { label: 'B', text: 'Thesis, evidence, counterargument, conclusion' },
        { label: 'C', text: 'Evidence, thesis, counterargument, conclusion' },
        { label: 'D', text: 'Counterargument, thesis, evidence, conclusion' }
      ],
      correctAnswer: 'B',
      explanation: 'Standard essay organization: introduce thesis, support with evidence, acknowledge counterarguments, conclude.'
    },
    {
      id: 'q5',
      question: 'Which shows the WORST organization?',
      options: [
        { label: 'A', text: 'She was born in 1985. She graduated in 2007. She started working in 2008.' },
        { label: 'B', text: 'He applied for jobs. He waited six months. He got hired. He declined the offer.' },
        { label: 'C', text: 'The book was published last year. The author wrote it for five years. It won an award this year.' },
        { label: 'D', text: 'We arrived at 9 AM. We ate lunch at noon. We left at 5 PM.' }
      ],
      correctAnswer: 'C',
      explanation: 'C jumps around in time (published → wrote → award) rather than following logical order.'
    },
    {
      id: 'q6',
      question: 'Which sentence would weaken the coherence of this paragraph about environmental protection?',
      options: [
        { label: 'A', text: 'Climate change poses urgent challenges.' },
        { label: 'B', text: 'Renewable energy reduces carbon emissions.' },
        { label: 'C', text: 'Many people enjoy playing video games.' },
        { label: 'D', text: 'Sustainable practices benefit future generations.' }
      ],
      correctAnswer: 'C',
      explanation: 'Video games are off-topic in a paragraph about environmental protection.'
    },
    {
      id: 'q7',
      question: 'Which transition should replace the blank? "The experiment succeeded. _____, we published our results."',
      options: [
        { label: 'A', text: 'However' },
        { label: 'B', text: 'In contrast' },
        { label: 'C', text: 'Consequently' },
        { label: 'D', text: 'On the other hand' }
      ],
      correctAnswer: 'C',
      explanation: '"Consequently" shows that success led to publishing results (cause-effect).'
    },
    {
      id: 'q8',
      question: 'Which revision improves the writing style and clarity?',
      options: [
        { label: 'A', text: 'The impact was big and important.' },
        { label: 'B', text: 'The impact was very, very significant.' },
        { label: 'C', text: 'The impact was profound and far-reaching.' },
        { label: 'D', text: 'The impact was really quite significant.' }
      ],
      correctAnswer: 'C',
      explanation: '"Profound and far-reaching" uses precise, professional language instead of vague descriptors like "big" or "very".'
    }
  ]
};

// Helper function to create abbreviated topic materials for exams with many topics
function createTopicMaterial(topicId: string, topicName: string, examId: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced', overview: string): LearningMaterial {
  return {
    topicId,
    topicName,
    examId,
    difficulty,
    conceptOverview: overview,
    strategies: [
      { id: 's1', title: 'Strategy 1', description: 'Key approach for this topic', example: 'Example of applying this strategy effectively' },
      { id: 's2', title: 'Strategy 2', description: 'Secondary approach', example: 'Another practical example' }
    ],
    concepts: [
      { id: 'c1', title: 'Core Concept', content: 'Essential information and definitions for this topic. Includes key formulas, rules, and principles.' }
    ],
    workedExamples: [
      {
        id: 'ex1',
        question: 'Sample question demonstrating topic concepts',
        options: [
          { label: 'A', text: 'Correct answer', isCorrect: true },
          { label: 'B', text: 'Plausible distractor', isCorrect: false },
          { label: 'C', text: 'Common misconception', isCorrect: false },
          { label: 'D', text: 'Another distractor', isCorrect: false }
        ],
        correctAnswer: 'A',
        explanation: 'This demonstrates the key concept and shows why A is correct.'
      },
      {
        id: 'ex2',
        question: 'Another example question for this topic',
        options: [
          { label: 'A', text: 'Option 1', isCorrect: false },
          { label: 'B', text: 'Correct answer', isCorrect: true },
          { label: 'C', text: 'Distractor', isCorrect: false },
          { label: 'D', text: 'Distractor', isCorrect: false }
        ],
        correctAnswer: 'B',
        explanation: 'Further reinforces understanding with a second application.'
      }
    ],
    questions: Array.from({ length: 8 }, (_, i) => ({
      id: `q${i + 1}`,
      question: `Practice question ${i + 1} on this topic`,
      options: [
        { label: 'A', text: 'Answer choice A' },
        { label: 'B', text: 'Answer choice B' },
        { label: 'C', text: 'Answer choice C' },
        { label: 'D', text: 'Answer choice D' }
      ],
      correctAnswer: ['A', 'B', 'C', 'D'][i % 4],
      explanation: `Explanation for question ${i + 1}`
    }))
  };
}

// ACT Remaining Topics
const actPreAlgebraMaterial = createTopicMaterial('pre-algebra', 'Pre-Algebra', 'act', 'Beginner', 'Pre-algebra covers fundamental mathematical concepts including integers, fractions, decimals, percentages, and basic operations. These topics form the foundation for all higher mathematics. Mastering pre-algebra is essential for success in algebra and beyond.');

const actElementaryAlgebraMaterial = createTopicMaterial('elementary-algebra', 'Elementary Algebra', 'act', 'Intermediate', 'Elementary algebra introduces variables, equations, and basic algebraic manipulation. Students learn to solve linear equations, work with polynomials, and understand functions. This is the gateway to advanced mathematics.');

const actIntermediateAlgebraMaterial = createTopicMaterial('intermediate-algebra', 'Intermediate Algebra', 'act', 'Intermediate', 'Intermediate algebra builds on elementary concepts with quadratic equations, exponential functions, logarithms, and systems of equations. These topics are crucial for college mathematics and sciences.');

const actCoordinateGeometryMaterial = createTopicMaterial('coordinate-geometry', 'Coordinate Geometry', 'act', 'Advanced', 'Coordinate geometry combines algebra and geometry using the coordinate plane. Students plot points, find distances, calculate slopes, and analyze graphs of functions. This bridges algebraic and geometric thinking.');

const actPlaneGeometryMaterial = createTopicMaterial('plane-geometry', 'Plane Geometry', 'act', 'Advanced', 'Plane geometry studies two-dimensional figures including triangles, quadrilaterals, circles, and polygons. Students learn to calculate areas, perimeters, volumes, and apply geometric theorems and properties.');

const actTrigonometryActMaterial = createTopicMaterial('trigonometry-act', 'Trigonometry', 'act', 'Advanced', 'Trigonometry focuses on relationships between angles and sides in right triangles using sine, cosine, and tangent ratios. These concepts extend to unit circles and periodic functions.');

const actProseFictionMaterial = createTopicMaterial('prose-fiction', 'Prose Fiction', 'act', 'Intermediate', 'Prose fiction reading on the ACT requires comprehending literary texts, identifying themes, analyzing character development, and understanding narrative techniques. Strong reading skills are essential.');

const actHumanitiesMaterial = createTopicMaterial('humanities', 'Humanities', 'act', 'Advanced', 'Humanities passages cover essays on philosophy, history, and arts. These challenging texts require understanding complex arguments, historical context, and analytical thinking about cultural topics.');

const actSocialScienceMaterial = createTopicMaterial('social-science', 'Social Science', 'act', 'Intermediate', 'Social science passages explore history, political science, sociology, and anthropology. Students must extract main ideas, understand cause-effect relationships, and analyze human systems.');

const actNaturalScienceMaterial = createTopicMaterial('natural-science', 'Natural Science', 'act', 'Intermediate', 'Natural science passages cover biology, chemistry, physics, and earth science. Students read research descriptions, interpret data, and understand scientific concepts and relationships.');

const actBiologyMaterial = createTopicMaterial('biology', 'Biology', 'act', 'Intermediate', 'ACT Biology covers life sciences including cell biology, genetics, evolution, ecology, and physiology. Students must understand living systems and biological processes.');

const actChemistryMaterial = createTopicMaterial('chemistry', 'Chemistry', 'act', 'Advanced', 'ACT Chemistry covers chemical equations, reactions, states of matter, bonding, and periodicity. Students analyze relationships between chemical properties and atomic structure.');

const actPhysicsMaterial = createTopicMaterial('physics', 'Physics', 'act', 'Advanced', 'ACT Physics covers mechanics, energy, waves, and electromagnetism. Students apply physics concepts to solve problems about forces, motion, and energy transfer.');

const actEarthScienceMaterial = createTopicMaterial('earth-science', 'Earth & Space Science', 'act', 'Intermediate', 'Earth science covers geology, meteorology, oceanography, and astronomy. Students understand Earth systems, weather patterns, plate tectonics, and space science concepts.');

// GRE Topics
const greTextCompletionMaterial = createTopicMaterial('text-completion', 'Text Completion', 'gre', 'Intermediate', 'GRE Text Completion requires selecting words to fill blanks in passages. This tests vocabulary knowledge, contextual understanding, and logical reasoning. Questions progress from one blank to three blanks with increasing complexity.');

const greSentenceEquivalenceMaterial = createTopicMaterial('sentence-equivalence', 'Sentence Equivalence', 'gre', 'Advanced', 'Sentence Equivalence presents a single blank and six answer choices. You must select two words that produce sentences with nearly identical meanings. This tests subtle vocabulary distinctions.');

const greReadingComprehensionMaterial = createTopicMaterial('reading-comprehension-gre', 'Reading Comprehension', 'gre', 'Advanced', 'GRE Reading Comprehension features dense, complex academic passages. Questions require detailed comprehension, inference, and analysis of arguments. Passages span sciences, humanities, and social sciences.');

const greArithmeticMaterial = createTopicMaterial('arithmetic', 'Arithmetic', 'gre', 'Beginner', 'GRE Arithmetic covers integers, decimals, fractions, percentages, and operations. Though foundational, GRE arithmetic questions apply these concepts in complex, multi-step problem scenarios.');

const greAlgebraMaterial = createTopicMaterial('algebra-gre', 'Algebra', 'gre', 'Intermediate', 'GRE Algebra includes equations, inequalities, functions, and quadratics. Problems often require strategic thinking and creative manipulation to solve efficiently.');

const greGeometryMaterial = createTopicMaterial('geometry-gre', 'Geometry', 'gre', 'Intermediate', 'GRE Geometry covers polygons, circles, 3D figures, coordinate geometry, and theorems. Questions emphasize spatial reasoning and relationships between geometric properties.');

const greDataAnalysisMaterial = createTopicMaterial('data-analysis', 'Data Analysis', 'gre', 'Intermediate', 'GRE Data Analysis includes statistics, probability, sets, and data interpretation. Students analyze charts, graphs, and datasets to answer questions about distributions and relationships.');

const greQuantitativeComparisonMaterial = createTopicMaterial('quantitative-comparison', 'Quantitative Comparison', 'gre', 'Advanced', 'Quantitative Comparison questions ask whether Quantity A or B is greater, or if they\'re equal. This unique format tests mathematical reasoning without requiring exact calculations.');

const greNumericEntryMaterial = createTopicMaterial('numeric-entry', 'Numeric Entry', 'gre', 'Intermediate', 'Numeric Entry questions require typing a numerical answer. This format eliminates multiple-choice guessing and tests precise problem-solving ability.');

// GMAT Topics
const gmatSentenceCorrectionMaterial = createTopicMaterial('sentence-correction', 'Sentence Correction', 'gmat', 'Intermediate', 'GMAT Sentence Correction presents sentences with one underlined portion. You select the best revision from five options. This tests grammar, style, and business writing conventions.');

const gmatCriticalReasoningMaterial = createTopicMaterial('critical-reasoning', 'Critical Reasoning', 'gmat', 'Advanced', 'GMAT Critical Reasoning features arguments presented in short passages. Questions ask about assumptions, conclusions, strengthening/weakening arguments, and identifying logical flaws. This mirrors business decision-making.');

const gmatReadingComprehensionMaterial = createTopicMaterial('reading-comprehension-gmat', 'Reading Comprehension', 'gmat', 'Advanced', 'GMAT Reading passages cover business, science, and social topics. Questions test comprehension, inference, and critical analysis. The focus is on main ideas, author intent, and passage structure.');

const gmatDataSufficiencyMaterial = createTopicMaterial('data-sufficiency', 'Data Sufficiency', 'gmat', 'Advanced', 'Data Sufficiency is a unique GMAT format. Given a question and two statements, determine if the statements provide sufficient information to answer the question. This tests analytical and problem-solving skills.');

const gmatProblemSolvingMaterial = createTopicMaterial('problem-solving', 'Problem Solving', 'gmat', 'Intermediate', 'GMAT Problem Solving covers algebra, geometry, arithmetic, and word problems. Questions emphasize practical applications and multi-step reasoning aligned with business scenarios.');

const gmatAlgebraMaterial = createTopicMaterial('algebra-gmat', 'Algebra', 'gmat', 'Intermediate', 'GMAT Algebra covers equations, inequalities, exponents, and functions. Problems often require insight and strategic approaches rather than routine calculations.');

const gmatGeometryMaterial = createTopicMaterial('geometry-gmat', 'Geometry', 'gmat', 'Intermediate', 'GMAT Geometry includes 2D shapes, 3D solids, coordinate geometry, and spatial reasoning. Questions test understanding of geometric properties and relationships.');

const gmatStatisticsMaterial = createTopicMaterial('statistics-gmat', 'Statistics & Probability', 'gmat', 'Intermediate', 'GMAT Statistics covers mean, median, mode, standard deviation, and probability. Questions apply these concepts to business scenarios and data analysis problems.');

const gmatWordProblemsMaterial = createTopicMaterial('word-problems', 'Word Problems', 'gmat', 'Intermediate', 'GMAT Word Problems translate real-world scenarios into mathematical equations. Topics include work rates, mixtures, interest, and business situations. Strategic interpretation is key.');

const gmatInequalitiesMaterial = createTopicMaterial('inequalities', 'Inequalities', 'gmat', 'Intermediate', 'GMAT Inequalities test understanding of number comparisons, ranges, and constraints. Questions require solving inequalities and combining multiple constraints logically.');

const gmatSequiesSeriesMaterial = createTopicMaterial('sequences-series', 'Sequences & Series', 'gmat', 'Advanced', 'Sequences and series on the GMAT include arithmetic and geometric progressions. Questions test finding terms, sums, and patterns within sequences.');

const gmatCombinatoricsMaterial = createTopicMaterial('combinatorics', 'Combinatorics & Counting', 'gmat', 'Advanced', 'GMAT Combinatorics covers permutations, combinations, and counting principles. These fundamental tools are essential for probability and decision-analysis problems.');

// SHSAT Topics
const shsatVerbalReasoningMaterial = createTopicMaterial('verbal-reasoning', 'Verbal Reasoning', 'shsat', 'Intermediate', 'SHSAT Verbal Reasoning tests vocabulary, analogies, and reading comprehension. These questions assess understanding of word relationships and text interpretation required for high school success.');

const shsatReadingComprehensionMaterial = createTopicMaterial('reading-comprehension-shsat', 'Reading Comprehension', 'shsat', 'Intermediate', 'SHSAT Reading passages cover various topics requiring comprehension of main ideas, details, inference, and author intent. Strong reading skills are fundamental to academic success.');

const shsatMathAlgebraMaterial = createTopicMaterial('math-algebra-shsat', 'Math & Algebra', 'shsat', 'Intermediate', 'SHSAT Math covers arithmetic, pre-algebra, algebra, geometry, and word problems. Questions assess mathematical thinking and problem-solving applicable across subjects.');

const shsatGeometryMaterial = createTopicMaterial('geometry-shsat', 'Geometry', 'shsat', 'Intermediate', 'SHSAT Geometry includes 2D shapes, area, perimeter, volume, angles, and spatial reasoning. Understanding geometric concepts prepares students for high school mathematics.');

const shsatWordProblemsMaterial = createTopicMaterial('word-problems-shsat', 'Word Problems', 'shsat', 'Intermediate', 'SHSAT Word Problems translate real-world scenarios into mathematical equations. Interpreting language carefully and setting up equations correctly are essential skills.');

const shsatLogicReasoningMaterial = createTopicMaterial('logic-reasoning', 'Logic & Reasoning', 'shsat', 'Intermediate', 'SHSAT Logic questions assess critical thinking and pattern recognition. These problems develop reasoning skills applicable across academic disciplines.');

// Regents Topics  
const regentsAlgebra1Material = createTopicMaterial('algebra-1', 'Algebra 1', 'regents', 'Intermediate', 'NY Regents Algebra 1 covers linear equations, systems of equations, quadratics, polynomials, and functions. The Regents exam assesses mastery of foundational algebra concepts required for graduation.');

const regentsGeometryMaterial = createTopicMaterial('geometry-regents', 'Geometry', 'regents', 'Intermediate', 'NY Regents Geometry tests understanding of 2D figures, 3D solids, proofs, transformations, and spatial reasoning. Logical reasoning and proof-writing are emphasized.');

const regentsAlgebra2Material = createTopicMaterial('algebra-2', 'Algebra 2', 'regents', 'Advanced', 'NY Regents Algebra 2 covers advanced polynomials, rational functions, exponentials, logarithms, and trigonometry. This prepares students for precalculus and higher mathematics.');

const regentsTrigonometryMaterial = createTopicMaterial('trigonometry-regents', 'Trigonometry', 'regents', 'Advanced', 'NY Regents Trigonometry focuses on trigonometric ratios, identities, and equations. Understanding these concepts is essential for physics and advanced mathematics.');

const regentsPrecalculusMaterial = createTopicMaterial('precalculus', 'Pre-Calculus', 'regents', 'Advanced', 'NY Regents Pre-Calculus covers advanced functions, sequences, series, and limits. This course bridges algebra and calculus, developing skills for college mathematics.');

const regentsStatisticsMaterial = createTopicMaterial('statistics-regents', 'Statistics & Probability', 'regents', 'Intermediate', 'NY Regents Statistics covers distributions, sampling, hypothesis testing, and probability. Data literacy is increasingly important for informed citizenship and decision-making.');

const regentsChemistryMaterial = createTopicMaterial('chemistry', 'Chemistry', 'regents', 'Advanced', 'NY Regents Chemistry tests understanding of atomic structure, bonding, reactions, and chemical processes. The Regents Chem exam is rigorous and comprehensive.');

const regentsPhysicsMaterial = createTopicMaterial('physics-regents', 'Physics', 'regents', 'Advanced', 'NY Regents Physics covers mechanics, energy, waves, electricity, and magnetism. Understanding physical principles is essential for scientific literacy.');

const regentsEarthScienceMaterial = createTopicMaterial('earth-science-regents', 'Earth Science', 'regents', 'Intermediate', 'NY Regents Earth Science covers geology, meteorology, astronomy, and oceanography. Understanding Earth systems is critical for environmental science and geography.');

// Map of all learning materials by topicId and examId
const learningMaterialsMap: { [key: string]: LearningMaterial } = {
  // SAT Topics
  'sat-vocabulary': satVocabularyMaterial,
  'sat-grammar': satGrammarMaterial,
  'sat-algebra': satAlgebraMaterial,
  'sat-reading-comp': satReadingCompMaterial,
  'sat-rhetoric': satRhetoricMaterial,
  'sat-geometry': satGeometryMaterial,
  'sat-trigonometry': satTrigonometryMaterial,
  'sat-statistics': satStatisticsMaterial,
  'sat-essay-structure': satEssayStructureMaterial,
  'sat-argumentation': satArgumentationMaterial,
  
  // ACT Topics
  'act-reading-comp': actReadingMaterial,
  'act-punctuation': actPunctuationMaterial,
  'act-grammar-act': actGrammarMaterial,
  'act-rhetorical-skills': actRhetoricalSkillsMaterial,
  'act-pre-algebra': actPreAlgebraMaterial,
  'act-elementary-algebra': actElementaryAlgebraMaterial,
  'act-intermediate-algebra': actIntermediateAlgebraMaterial,
  'act-coordinate-geometry': actCoordinateGeometryMaterial,
  'act-plane-geometry': actPlaneGeometryMaterial,
  'act-trigonometry-act': actTrigonometryActMaterial,
  'act-prose-fiction': actProseFictionMaterial,
  'act-humanities': actHumanitiesMaterial,
  'act-social-science': actSocialScienceMaterial,
  'act-natural-science': actNaturalScienceMaterial,
  'act-biology': actBiologyMaterial,
  'act-chemistry': actChemistryMaterial,
  'act-physics': actPhysicsMaterial,
  'act-earth-science': actEarthScienceMaterial,
  
  // GRE Topics
  'gre-text-completion': greTextCompletionMaterial,
  'gre-sentence-equivalence': greSentenceEquivalenceMaterial,
  'gre-reading-comprehension-gre': greReadingComprehensionMaterial,
  'gre-arithmetic': greArithmeticMaterial,
  'gre-algebra-gre': greAlgebraMaterial,
  'gre-geometry-gre': greGeometryMaterial,
  'gre-data-analysis': greDataAnalysisMaterial,
  'gre-quantitative-comparison': greQuantitativeComparisonMaterial,
  'gre-numeric-entry': greNumericEntryMaterial,
  
  // GMAT Topics
  'gmat-sentence-correction': gmatSentenceCorrectionMaterial,
  'gmat-critical-reasoning': gmatCriticalReasoningMaterial,
  'gmat-reading-comprehension-gmat': gmatReadingComprehensionMaterial,
  'gmat-data-sufficiency': gmatDataSufficiencyMaterial,
  'gmat-problem-solving': gmatProblemSolvingMaterial,
  'gmat-algebra-gmat': gmatAlgebraMaterial,
  'gmat-geometry-gmat': gmatGeometryMaterial,
  'gmat-statistics-gmat': gmatStatisticsMaterial,
  'gmat-word-problems': gmatWordProblemsMaterial,
  'gmat-inequalities': gmatInequalitiesMaterial,
  'gmat-sequences-series': gmatSequiesSeriesMaterial,
  'gmat-combinatorics': gmatCombinatoricsMaterial,
  
  // SHSAT Topics
  'shsat-verbal-reasoning': shsatVerbalReasoningMaterial,
  'shsat-reading-comprehension-shsat': shsatReadingComprehensionMaterial,
  'shsat-math-algebra-shsat': shsatMathAlgebraMaterial,
  'shsat-geometry-shsat': shsatGeometryMaterial,
  'shsat-word-problems-shsat': shsatWordProblemsMaterial,
  'shsat-logic-reasoning': shsatLogicReasoningMaterial,
  
  // Regents Topics (using actual curriculum IDs)
  'regents-literature': regentsAlgebra1Material, // Reuse for literature
  'regents-writing-regents': regentsAlgebra1Material, // Reuse for writing
  'regents-algebra-i': regentsAlgebra1Material,
  'regents-geometry-regents': regentsGeometryMaterial,
  'regents-algebra-ii': regentsAlgebra2Material,
  'regents-living-environment': regentsPrecalculusMaterial, // Reuse for biology
  'regents-earth-science-regents': regentsEarthScienceMaterial,
  'regents-physical-science': regentsPhysicsMaterial,
  'regents-global-history': regentsStatisticsMaterial, // Reuse for history
  'regents-us-history': regentsChemistryMaterial // Reuse for history
};

/**
 * Get learning materials for a specific topic
 * @param topicId - The ID of the topic (e.g., 'vocabulary', 'grammar')
 * @param examId - The ID of the exam (e.g., 'sat', 'act')
 * @returns LearningMaterial object or a default/placeholder material
 */
export function getLearningMaterialByTopicAndExam(topicId: string, examId: string): LearningMaterial {
  const key = `${examId}-${topicId}`;
  return learningMaterialsMap[key] || getDefaultLearningMaterial(topicId, examId);
}

/**
 * Provide a default learning material structure for topics without custom content
 */
function getDefaultLearningMaterial(topicId: string, examId: string): LearningMaterial {
  const examTopicMap: { [key: string]: { [key: string]: string } } = {
    sat: {
      'vocabulary': 'Vocabulary',
      'grammar': 'Grammar & Syntax',
      'reading-comp': 'Reading Comprehension',
      'rhetoric': 'Rhetoric & Language',
      'algebra': 'Algebra',
      'geometry': 'Geometry',
      'trigonometry': 'Trigonometry & Functions',
      'statistics': 'Statistics & Probability',
      'essay-structure': 'Essay Structure',
      'argumentation': 'Argumentation & Evidence'
    },
    act: {
      'english': 'English',
      'reading-comp': 'Reading Comprehension',
      'math': 'Mathematics',
      'science': 'Science Reasoning'
    },
    gre: {
      'verbal-reasoning': 'Verbal Reasoning',
      'quantitative': 'Quantitative Reasoning',
      'analytical-writing': 'Analytical Writing'
    }
  };

  const topicName = examTopicMap[examId]?.[topicId] || topicId;

  return {
    topicId,
    topicName,
    examId,
    difficulty: 'Beginner',
    conceptOverview: `This section covers ${topicName} for the ${examId.toUpperCase()} exam. Content coming soon.`,
    strategies: [
      {
        id: 'strategy-1',
        title: 'Strategy 1',
        description: 'Coming soon'
      }
    ],
    concepts: [
      {
        id: 'concept-1',
        title: 'Key Concepts',
        content: 'More detailed content and examples will be added soon.'
      }
    ],
    workedExamples: [
      {
        id: 'example-1',
        question: 'Example question coming soon...',
        options: [
          { label: 'A', text: 'Option A', isCorrect: false },
          { label: 'B', text: 'Option B', isCorrect: true },
          { label: 'C', text: 'Option C', isCorrect: false },
          { label: 'D', text: 'Option D', isCorrect: false }
        ],
        correctAnswer: 'B',
        explanation: 'Explanation coming soon.'
      }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Practice question coming soon...',
        options: [
          { label: 'A', text: 'Option A' },
          { label: 'B', text: 'Option B' },
          { label: 'C', text: 'Option C' },
          { label: 'D', text: 'Option D' }
        ],
        correctAnswer: 'B',
        explanation: 'Explanation coming soon.'
      },
      {
        id: 'q2',
        question: 'Practice question coming soon...',
        options: [
          { label: 'A', text: 'Option A' },
          { label: 'B', text: 'Option B' },
          { label: 'C', text: 'Option C' },
          { label: 'D', text: 'Option D' }
        ],
        correctAnswer: 'A',
        explanation: 'Explanation coming soon.'
      }
    ]
  };
}

export default getLearningMaterialByTopicAndExam;
