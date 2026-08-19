/**
 * Learning Materials Content for All Exams
 * Official curriculum-aligned reading materials for each topic
 */

export interface ReadingMaterial {
  topicId: string;
  title: string;
  sections: ContentSection[];
  keyPoints: string[];
  estimatedReadTime: number; // in minutes
}

export interface ContentSection {
  heading: string;
  content: string;
  examples?: string[];
}

// ==================== SAT READING MATERIALS ====================

export const SAT_MATERIALS: Record<string, ReadingMaterial> = {
  vocabulary: {
    topicId: 'vocabulary',
    title: 'Vocabulary & Word Patterns',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Introduction to SAT Vocabulary',
        content: `The SAT vocabulary section tests your understanding of word meanings and how words function in context. Unlike traditional vocabulary tests, the SAT doesn't ask you to memorize lists of obscure words. Instead, it focuses on:

1. **Context Clues**: Using surrounding text to determine word meaning
2. **Word Roots & Prefixes**: Understanding Latin and Greek foundations
3. **Common SAT Vocabulary**: Words that appear frequently on the test
4. **Synonyms & Relationships**: Understanding similar words and their nuances

The modern SAT emphasizes reading comprehension over memorization. Most vocabulary questions appear within reading passages, requiring you to understand not just what a word means, but how it's used in context.`,
      },
      {
        heading: 'Context Clues Strategy',
        content: `Context clues are hints within the text that help you determine the meaning of unfamiliar words.

**Types of Context Clues:**

1. **Definition Clues**: The text directly defines the word
   - Example: "The ubiquitous, or everywhere-present, technology changed society."

2. **Synonym Clues**: Similar words nearby provide meaning
   - Example: "The acrimonious debate was bitter and harsh throughout."

3. **Contrast Clues**: Opposite meanings show what a word is NOT
   - Example: "Unlike his verbose colleague, the quiet engineer spoke sparingly."

4. **Example Clues**: Specific examples illustrate the word's meaning
   - Example: "Nocturnal animals like bats and owls are active at night."

**Practice Strategy**: When you encounter an unfamiliar word, read the entire sentence and paragraph before attempting to determine meaning. Look for signal words like "however," "because," "such as," and "in contrast."`,
        examples: [
          'The scientist\'s esoteric research was so specialized that few colleagues understood it.',
          'Despite his usually effusive manner, he was uncharacteristically reserved at the funeral.',
          'The politician\'s mendacious campaign promises deceived voters throughout the election.',
        ],
      },
      {
        heading: 'Word Roots & Etymology',
        content: `Many SAT vocabulary words derive from Latin and Greek roots. Understanding common roots helps you decode unfamiliar words.

**Common Latin Roots:**
- **voc/vox** (voice, call): vocal, invoke, equivocal
- **dict** (speak, say): dictate, predict, contradict
- **ject** (throw, cast): eject, project, trajectory
- **port** (carry): transport, portable, deport
- **scrib/script** (write): describe, manuscript, prescription

**Common Greek Roots:**
- **phon** (sound): telephone, symphony, microphone
- **phil** (love): philosophy, philanthropy, bibliophile
- **psych** (mind, soul): psychology, psyche, psychopath
- **graph** (write, draw): biography, paragraph, photograph
- **chron** (time): chronological, anachronism, chronic

**Common Prefixes:**
- **un-** (not): unclear, unfit, unfair
- **re-** (again): return, rebuild, rewrite
- **pre-** (before): preview, predict, premature
- **dis-** (not, opposite): disagree, disadvantage, disorder
- **non-** (not): nonsense, nonfiction, nonstop

By recognizing these patterns, you can make educated guesses about unfamiliar words, even if you've never seen them before.`,
        examples: [
          'The philanthropist\'s munificent donation established a new wing.',
          'His obfuscate writing style made simple concepts seem complex.',
          'The malevolent character opposed every good intention.',
        ],
      },
      {
        heading: 'Common SAT Vocabulary Patterns',
        content: `The SAT repeatedly tests certain categories of words:

**Positive/Negative Tone Words:**
Recognizing whether a word has positive or negative connotations is crucial.
- Positive: exemplary, magnanimous, meticulous, sagacious
- Negative: capricious, deleterious, insidious, nefarious

**Academic/Formal Words:**
Words used in academic writing that differ from everyday speech:
- ambiguous (unclear), benign (harmless), nascent (beginning)
- pragmatic (practical), speculative (theoretical)

**Intensity/Degree Words:**
Words that describe levels or degrees:
- tepid (lukewarm) vs. ardent (passionate)
- meager (scanty) vs. copious (abundant)

**Change/Movement Words:**
Words describing transformation or movement:
- ameliorate (improve), exacerbate (worsen)
- trajectory (path), trajectory (path)

**Strategy**: Create groups of similar words. Notice patterns in how the test uses words together. Words with similar meanings often appear as choices, so understanding the subtle differences is key.`,
      },
    ],
    keyPoints: [
      'Context clues are more important than memorization on the modern SAT',
      'Understanding word roots helps decode unfamiliar vocabulary',
      'The SAT tests words in context, not isolation',
      'Recognize common prefixes and suffixes to unlock meaning',
      'Practice with official SAT materials to learn frequently tested words',
    ],
  },

  grammar: {
    topicId: 'grammar',
    title: 'Grammar & Syntax',
    estimatedReadTime: 30,
    sections: [
      {
        heading: 'SAT Grammar Overview',
        content: `The Grammar & Syntax section tests your understanding of how English works. The SAT doesn't ask you to explain grammatical rules—instead, you identify correct sentences and fix errors.

**What the SAT Tests:**
1. **Agreement**: Subject-verb, pronoun-antecedent, noun-verb agreement
2. **Tense Consistency**: Proper use of past, present, future tenses
3. **Modifier Placement**: Ensuring modifiers clearly describe their subjects
4. **Parallel Structure**: Similar grammatical forms in lists and comparisons
5. **Sentence Structure**: Fragments, run-ons, and comma splices
6. **Diction**: Using the right word in the right context

The key is recognizing patterns of errors and understanding why they're wrong, not memorizing every grammar rule.`,
      },
      {
        heading: 'Subject-Verb Agreement',
        content: `The subject and verb must agree in number (singular or plural).

**Basic Rule**: A singular subject takes a singular verb; a plural subject takes a plural verb.
- Correct: The student studies hard. (singular)
- Correct: The students study hard. (plural)
- Incorrect: The student study hard.
- Incorrect: The students studies hard.

**Common Tricky Situations:**

1. **Collective Nouns**: Treat as singular when the group acts as one unit
   - The team is winning. (acts as one unit)
   - The team are arguing among themselves. (individuals acting separately)

2. **Intervening Phrases**: The prepositional phrase doesn't affect agreement
   - The professor, along with two students, is attending the conference.
   - NOT: "The professor, along with two students, are attending..."

3. **Compound Subjects**:
   - With "and": Plural verb required
     - Tom and Jerry are friends.
   - With "or/nor": Verb agrees with the nearest subject
     - Either John or the girls are going.
     - Either the girls or John is going.

4. **Indefinite Pronouns**:
   - Singular: each, every, everyone, somebody, anyone, either, neither
   - Plural: both, few, many, several
   - Variable: some, all, most, none
     - Example: Most of the pizza is gone. / Most of the students are here.`,
        examples: [
          'The data suggests that multiple factors influence the outcome.',
          'Neither the students nor the teacher was prepared for the quiz.',
          'The number of applicants has increased significantly.',
        ],
      },
      {
        heading: 'Verb Tense & Consistency',
        content: `Verb tenses must be consistent unless there's a logical reason for a change.

**The Four Main Tenses:**
1. **Present**: Describes current actions or general truths
   - I study daily. / Water boils at 100°C.
2. **Past**: Describes completed actions
   - I studied yesterday. / She finished her project.
3. **Future**: Describes actions that will happen
   - I will study tomorrow. / They will arrive soon.
4. **Perfect Tenses**: Show completion relative to another time
   - Present Perfect: I have studied (recently completed)
   - Past Perfect: I had studied (completed before another past event)

**Sequence of Tenses**:
When describing multiple actions, their tenses should logically reflect their timing.
- Correct: Before she arrived, he had cleaned the house. (Past perfect then past)
- Incorrect: Before she arrives, he cleaned the house. (Logical contradiction)

**Common Errors**:
- Shifting tenses unnecessarily: "I go to the store and bought milk." (Should be "buy")
- Mixing present and past in narrative: "She walked to the door and opens it slowly."`,
        examples: [
          'The scientist discovered the phenomenon in 2010 and has continued to study it.',
          'By the time we arrived, they had already left.',
          'The company was founded in 1995 and remains successful today.',
        ],
      },
      {
        heading: 'Parallelism & List Structure',
        content: `When listing items or making comparisons, maintain the same grammatical structure for all items.

**Basic Parallelism**:
All items in a list should follow the same pattern.
- Incorrect: "She likes swimming, hiking, and to play tennis."
- Correct: "She likes swimming, hiking, and playing tennis." (All gerunds)

**Parallelism in Comparisons**:
Use similar structures when comparing two things.
- Incorrect: "Running is healthier than to sit all day."
- Correct: "Running is healthier than sitting all day." (Both gerunds)

**Parallelism in Pairs**:
Use matching structures with coordinating conjunctions (and, or, but).
- Incorrect: "The report was detailed and had accuracy."
- Correct: "The report was detailed and accurate." (Parallel adjectives)

**Correlative Conjunctions**:
Pairs like "both...and," "either...or," "not only...but also" require parallel structure.
- Incorrect: "She is not only intelligent but also she is creative."
- Correct: "She is not only intelligent but also creative."`,
        examples: [
          'The job requires strong writing skills and to work independently.',
          'He enjoys both reading classic literature and exploring contemporary fiction.',
          'The experiment was rigorous, systematic, and produced reliable results.',
        ],
      },
    ],
    keyPoints: [
      'Subject and verb must agree in number',
      'Maintain consistent verb tenses unless there\'s a logical reason to change',
      'Use parallel structure for lists and comparisons',
      'Modifiers must clearly refer to the word they describe',
      'Pronouns must clearly refer to their antecedents',
    ],
  },

  'reading-comp': {
    topicId: 'reading-comp',
    title: 'Reading Comprehension',
    estimatedReadTime: 35,
    sections: [
      {
        heading: 'Understanding Reading Passages',
        content: `Reading comprehension questions test your ability to understand, analyze, and interpret written passages. The SAT presents four types of passages:

1. **Literature**: Excerpts from novels or short stories
2. **History/Social Studies**: Non-fiction about historical or social topics
3. **Science**: Articles about scientific research or natural phenomena
4. **Paired Passages**: Two related passages on the same topic

Your goal isn't to memorize content but to:
- Identify the main idea
- Understand the author's purpose
- Follow the passage's logic and organization
- Recognize supporting evidence
- Make inferences based on evidence`,
      },
      {
        heading: 'Question Types & Strategies',
        content: `**Main Idea Questions**: Ask about the passage's central theme
- Strategy: Look at the title and first/last paragraphs
- Wrong answers often have partial truths or minor details

**Detail Questions**: Ask about specific information in the passage
- Strategy: Use keywords from the question to locate the relevant section
- Read carefully—small details matter

**Inference Questions**: Ask what the passage implies without stating
- Strategy: Base your answer on clear evidence in the text
- Avoid making leaps beyond what the passage supports

**Word-in-Context Questions**: Ask what a word means in passage context
- Strategy: Try replacing the word with answer choices
- Context often changes word meaning from the dictionary definition

**Author's Purpose/Tone**: Ask why the author wrote something or their attitude
- Strategy: Look for descriptive language and perspective
- Consider whether the tone is positive, negative, skeptical, etc.

**Comparison Questions** (Paired Passages): Ask how two passages relate
- Strategy: Identify the main idea of each passage first
- Then consider how they agree, disagree, or complement each other`,
        examples: [
          'The author would most likely agree with which statement?',
          'What does the passage suggest about the relationship between temperature and enzyme activity?',
          'How would the author of Passage 2 most likely respond to the claim in Passage 1?',
        ],
      },
      {
        heading: 'Active Reading Techniques',
        content: `Effective reading comprehension requires active engagement with the text:

**Previewing**: Before reading, scan for:
- Title and headings
- First and last sentences
- Any graphics or emphasized text

**Chunking**: Break the passage into meaningful sections
- Read one paragraph, pause, and summarize the main point
- Connect each section to the overall passage theme

**Annotating** (if permitted):
- Underline key ideas and topic sentences
- Circle unfamiliar words
- Mark transitions that show logical connections
- Note the author's tone shifts

**Questioning**: Ask yourself:
- What is this paragraph about?
- How does this connect to what I just read?
- What is the author's point?
- What evidence supports this claim?

**Making Connections**:
- Link ideas within the passage
- Notice cause-and-effect relationships
- Identify how evidence supports claims
- Recognize patterns in the author's reasoning`,
      },
      {
        heading: 'Common Reading Comprehension Traps',
        content: `**Trap 1: Choosing the Right Answer for the Wrong Reason**
- A statement may be true but doesn't answer the question
- Always check: Does this answer the specific question asked?

**Trap 2: Extreme Language**
- Answers with "always," "never," "all," "none" are rarely correct
- Look for qualified language: "usually," "often," "some," "may"

**Trap 3: Out-of-Context Information**
- Your general knowledge might contradict the passage
- Always choose answers based on passage content, not outside knowledge

**Trap 4: Partially Correct Answers**
- Some answers have part of the right answer mixed with wrong information
- The entire answer must be correct and relevant

**Trap 5: Author's Tone Misinterpretation**
- Distinguish between the author's tone and the subject matter
- A serious tone doesn't mean the author is upset
- A light tone doesn't mean the topic isn't important

**Strategy**: Go back to the passage for every question. Don't rely on memory. The answer is always supported by textual evidence.`,
      },
    ],
    keyPoints: [
      'Main idea questions require understanding the overall passage theme',
      'Detail questions demand careful reading and precise location of information',
      'Inference questions must be supported by evidence in the text',
      'Active reading (previewing, chunking, annotating) improves comprehension',
      'Always distinguish between the passage content and your outside knowledge',
    ],
  },

  rhetoric: {
    topicId: 'rhetoric',
    title: 'Rhetoric & Language Analysis',
    estimatedReadTime: 30,
    sections: [
      {
        heading: 'Rhetorical Devices & Techniques',
        content: `Rhetoric is the art of persuasion. The SAT tests your ability to recognize how authors use language to influence readers.

**Common Rhetorical Devices:**

1. **Metaphor**: Comparison between unlike things without using "like" or "as"
   - "Time is money" suggests time has the same value as currency

2. **Simile**: Comparison using "like" or "as"
   - "Her voice was like honey" suggests sweetness and smoothness

3. **Personification**: Giving human qualities to non-human things
   - "The wind whispered through the trees" gives the wind a human action

4. **Hyperbole**: Extreme exaggeration for effect
   - "I've told you a million times" emphasizes frequency beyond accuracy

5. **Alliteration**: Repetition of initial consonant sounds
   - "Peter Piper picked a peck of pickled peppers" creates rhythm and memorability

6. **Onomatopoeia**: Words that imitate the sounds they describe
   - "Buzz," "hiss," "crack" convey the actual sounds

7. **Irony**: When words mean the opposite of their literal meaning
   - "Oh great, another delay" when someone is frustrated about waiting

8. **Understatement (Litotes)**: Using less forceful language than circumstances warrant
   - "That's not bad" when something is actually excellent`,
      },
      {
        heading: 'Author\'s Purpose & Perspective',
        content: `Understanding why an author writes something is crucial for analyzing rhetoric.

**Common Purposes:**
1. **To Inform**: Present facts and information objectively
2. **To Persuade**: Convince readers to adopt a viewpoint or action
3. **To Entertain**: Provide enjoyment or engagement
4. **To Analyze**: Examine and explain complex topics
5. **To Critique**: Challenge or find fault with something

**How to Identify Purpose:**
- Look at word choice (formal vs. casual, positive vs. negative)
- Notice descriptive language and emotional appeals
- Consider the structure and organization
- Identify explicit statements of the author's position

**Author's Perspective/Bias:**
- What is the author's background and expertise?
- What opinions or values shape their writing?
- Do they present multiple viewpoints or primarily one?
- What evidence supports or contradicts their position?

**Tone vs. Mood:**
- **Tone**: Author's attitude (skeptical, enthusiastic, somber, sarcastic)
- **Mood**: Feeling created in the reader (hopeful, anxious, peaceful)
The same words can create different moods for different readers, but tone is determined by the author's word choice.`,
        examples: [
          'The author\'s use of vivid imagery suggests they intend to...',
          'Which word choice best reflects the author\'s skepticism?',
          'The passage can best be characterized as...',
        ],
      },
      {
        heading: 'Evidence & Persuasive Techniques',
        content: `Strong writing uses evidence to support claims. Recognizing types of evidence helps you evaluate arguments.

**Types of Evidence:**
1. **Factual/Statistical Evidence**: Data, research, numbers
   - "Studies show that 73% of students..."

2. **Expert Testimony**: Quotes from authorities
   - "According to Dr. Johnson, an environmental scientist..."

3. **Anecdotal Evidence**: Personal stories and examples
   - "I once knew someone who..." (Can be compelling but limited)

4. **Logical Reasoning**: Cause-and-effect, examples, analogies
   - "If students have better resources, they perform better..."

5. **Emotional Appeals**: Language designed to evoke feelings
   - "Think of the children without clean water..."

**Evaluating Strength of Evidence:**
- Is it relevant to the claim?
- Is it from a credible source?
- Is it sufficient (enough examples)?
- Could there be alternative explanations?

**Counterargument & Concession:**
Strong writing acknowledges opposing views:
- "While some argue that X, the evidence clearly shows Y"
- This credibility technique makes arguments more convincing`,
        examples: [
          'The author strengthens the argument by including statistical data because...',
          'Which piece of evidence most effectively supports the main claim?',
          'The author\'s use of a personal anecdote serves to...',
        ],
      },
    ],
    keyPoints: [
      'Rhetorical devices are language techniques used to persuade or create effects',
      'Author\'s purpose may be to inform, persuade, entertain, or analyze',
      'Tone is the author\'s attitude; mood is the feeling created in the reader',
      'Strong evidence includes facts, statistics, expert testimony, and logical reasoning',
      'Recognizing counterarguments strengthens your understanding of arguments',
    ],
  },

  // Math Topics
  algebra: {
    topicId: 'algebra',
    title: 'Algebra',
    estimatedReadTime: 30,
    sections: [
      {
        heading: 'Foundations of Algebra',
        content: `Algebra is the study of relationships between quantities using variables, expressions, and equations. On the SAT Math section, algebra questions comprise about 35% of the test.

**Key Concepts:**
1. **Variables & Expressions**: Representing unknown quantities
2. **Equations & Solutions**: Finding the value of variables
3. **Linear Equations**: Equations with variables to the first power
4. **Systems of Equations**: Multiple equations with multiple variables
5. **Inequalities**: Comparing quantities (greater than, less than, etc.)
6. **Quadratic Equations**: Equations with variables squared

The SAT emphasizes understanding what equations represent and solving them in context, not just algebraic manipulation.`,
      },
      {
        heading: 'Solving Equations & Inequalities',
        content: `**Linear Equations**: Form ax + b = c

Steps to solve:
1. Isolate the variable term (subtract b from both sides)
2. Divide by the coefficient (divide by a)

Example: 3x + 5 = 17
- Subtract 5: 3x = 12
- Divide by 3: x = 4

**Multi-step Equations**: Combine like terms, then solve
- 2x + 3x + 4 = 19
- 5x + 4 = 19
- 5x = 15
- x = 3

**Inequalities**: Follow same rules as equations, BUT flip the inequality sign when multiplying/dividing by negative numbers
- 3x < 12 → x < 4
- -3x < 12 → x > -4 (note: sign flips)

**Compound Inequalities**:
- "AND" means both conditions must be true: 2 < x < 8
- "OR" means at least one condition is true: x < 2 OR x > 8

**Systems of Linear Equations**:
Two common methods:

1. **Substitution**: Solve one equation for a variable, substitute into the other
2. **Elimination**: Multiply equations to eliminate a variable, then add them

Systems can have:
- One solution (lines intersect at one point)
- No solution (lines are parallel)
- Infinite solutions (lines are the same)`,
        examples: [
          '2x - 3 = x + 5',
          '3(x + 2) - 2x = 10',
          '2x + y = 8 and x - y = 2',
        ],
      },
      {
        heading: 'Quadratic Equations',
        content: `**Standard Form**: ax² + bx + c = 0

**Three Methods to Solve:**

1. **Factoring**:
   - x² + 5x + 6 = 0
   - (x + 2)(x + 3) = 0
   - x = -2 or x = -3

2. **Quadratic Formula**: x = (-b ± √(b² - 4ac)) / 2a
   - Use when factoring is difficult
   - Always works for any quadratic equation
   - The discriminant (b² - 4ac) tells you about solutions:
     * Positive: two real solutions
     * Zero: one real solution
     * Negative: no real solutions

3. **Completing the Square**:
   - Manipulate the equation to get a perfect square trinomial
   - Less common on SAT but useful for deriving forms

**Quadratic Functions**: Understanding the graph helps solve problems
- Vertex: (h, k) for f(x) = a(x - h)² + k is the minimum/maximum point
- Axis of symmetry: x = h (vertical line through vertex)
- Roots: Where the parabola crosses the x-axis (y = 0)
- Opens upward if a > 0, downward if a < 0
- Wider if |a| < 1, narrower if |a| > 1`,
      },
    ],
    keyPoints: [
      'Solve equations by isolating the variable',
      'Flip inequality signs when multiplying/dividing by negative numbers',
      'Systems of equations can be solved by substitution or elimination',
      'Quadratic equations can be solved by factoring or the quadratic formula',
      'Understanding quadratic graphs helps interpret solutions',
    ],
  },

  geometry: {
    topicId: 'geometry',
    title: 'Geometry',
    estimatedReadTime: 28,
    sections: [
      {
        heading: 'Foundations of Geometry',
        content: `Geometry on the SAT tests your understanding of shapes, angles, and spatial relationships. About 15% of SAT Math questions involve geometry.

**Fundamental Concepts:**
1. **Lines & Angles**: Straight lines, angle measurements, angle relationships
2. **Triangles**: Types, angle sums, special properties, congruence
3. **Circles**: Radius, diameter, circumference, area, angles
4. **Quadrilaterals**: Properties of squares, rectangles, parallelograms
5. **Area & Volume**: Calculating 2D and 3D measurements
6. **Coordinate Geometry**: Using coordinates to solve geometric problems

Key principle: The SAT rarely asks you to prove theorems. Instead, you apply geometric knowledge to solve problems.`,
      },
      {
        heading: 'Angles & Triangles',
        content: `**Angle Relationships:**
- Two angles on a straight line sum to 180° (supplementary)
- Vertical angles (opposite angles) are equal
- Angles in a triangle sum to 180°
- Exterior angle = sum of two non-adjacent interior angles

**Special Triangles:**

1. **Equilateral Triangle**: All sides equal, all angles 60°
   - Area = (√3/4)s² where s is side length

2. **Isosceles Triangle**: Two equal sides, two equal angles
   - Base angles (opposite equal sides) are equal

3. **Right Triangle**: One 90° angle
   - Pythagorean Theorem: a² + b² = c² (c is hypotenuse)
   - Area = (1/2)bh where b and h are legs

4. **Special Right Triangles**:
   - 45-45-90: Sides in ratio 1:1:√2
   - 30-60-90: Sides in ratio 1:√3:2

**Triangle Congruence** (SSS, SAS, ASA):
Two triangles with these matching parts are congruent (identical in shape and size)

**Triangle Similarity**:
Triangles with same angles but different sizes are similar (AA is the easiest to use)
If triangles are similar: corresponding sides are proportional`,
        examples: [
          'In a right triangle with legs 3 and 4, the hypotenuse is 5',
          'In a 30-60-90 triangle, if shortest side is 1, sides are 1, √3, and 2',
          'If two triangles have the same angle measures, they are similar',
        ],
      },
      {
        heading: 'Circles & Area',
        content: `**Circle Terminology:**
- **Radius (r)**: Distance from center to edge
- **Diameter (d)**: Distance across through center (d = 2r)
- **Circumference**: Distance around the circle (C = 2πr or C = πd)
- **Area**: Space inside the circle (A = πr²)

**Angles in Circles:**
- **Central Angle**: Vertex at the center
- **Inscribed Angle**: Vertex on the circle (equals half the central angle)
- **Arc**: Part of the circle's circumference
  - Arc length = (θ/360°) × 2πr
  - Sector area = (θ/360°) × πr²

**Common Area Formulas:**
- **Rectangle**: A = lw (length × width)
- **Triangle**: A = (1/2)bh (base × height ÷ 2)
- **Parallelogram**: A = bh (base × height)
- **Trapezoid**: A = (1/2)(b₁ + b₂)h (average of bases × height)
- **Circle**: A = πr²

**Volume Formulas** (3D shapes):
- **Rectangular Solid (Box)**: V = lwh
- **Cylinder**: V = πr²h
- **Sphere**: V = (4/3)πr³
- **Cone**: V = (1/3)πr²h
- **Pyramid**: V = (1/3)Bh (B is base area)`,
      },
    ],
    keyPoints: [
      'Angles on a line sum to 180°; angles in a triangle sum to 180°',
      'The Pythagorean Theorem applies to right triangles: a² + b² = c²',
      'Special right triangles (45-45-90 and 30-60-90) have specific ratios',
      'Circle circumference = 2πr and area = πr²',
      'Understand how to calculate area and volume of common shapes',
    ],
  },

  trigonometry: {
    topicId: 'trigonometry',
    title: 'Trigonometry & Functions',
    estimatedReadTime: 32,
    sections: [
      {
        heading: 'Trigonometric Basics',
        content: `Trigonometry (roughly 5-10% of SAT Math) studies relationships between angles and sides in triangles.

**SOHCAHTOA**: Memory device for trig ratios
- **SOH**: sin(θ) = Opposite/Hypotenuse
- **CAH**: cos(θ) = Adjacent/Hypotenuse
- **TOA**: tan(θ) = Opposite/Adjacent

**Example**: In a right triangle with angle θ:
- If opposite side = 3 and hypotenuse = 5
- Then sin(θ) = 3/5 = 0.6

**Important Values**:
- sin(0°) = 0, sin(90°) = 1
- cos(0°) = 1, cos(90°) = 0
- tan(45°) = 1
- sin(30°) = 1/2, sin(60°) = √3/2
- cos(30°) = √3/2, cos(60°) = 1/2

**Pythagorean Identity**: sin²(θ) + cos²(θ) = 1
This fundamental relationship connects sine and cosine.`,
      },
      {
        heading: 'Functions & Modeling',
        content: `Functions are central to advanced SAT Math questions.

**Function Notation**: f(x) means "the output when input is x"
- Example: f(x) = 2x + 3
- f(5) = 2(5) + 3 = 13

**Types of Functions:**

1. **Linear Functions**: f(x) = mx + b
   - Graph is a straight line
   - m = slope (rise/run)
   - b = y-intercept

2. **Quadratic Functions**: f(x) = ax² + bx + c
   - Graph is a parabola
   - Vertex at x = -b/(2a)

3. **Exponential Functions**: f(x) = ab^x
   - Growth (b > 1) or decay (0 < b < 1)
   - Used for population, radioactive decay, compound interest

4. **Radical Functions**: f(x) = √x or f(x) = ³√x
   - Square root function has domain x ≥ 0

**Function Properties:**
- **Domain**: Set of possible input values
- **Range**: Set of possible output values
- **Zeros**: x-values where f(x) = 0

**Transformations of Functions**:
- f(x) + k: Shift up by k
- f(x) - k: Shift down by k
- f(x + k): Shift left by k
- f(x - k): Shift right by k
- -f(x): Reflect over x-axis
- f(-x): Reflect over y-axis`,
      },
      {
        heading: 'Real-World Applications',
        content: `The SAT often presents scenarios requiring mathematical modeling.

**Growth and Decay**:
- Population: P(t) = P₀ × b^t (b > 1 for growth)
- Radioactive decay: A(t) = A₀ × (1/2)^(t/half-life)
- Compound interest: A = P(1 + r/n)^(nt)

**Linear Relationships**:
- Distance: d = rt (distance = rate × time)
- Cost: Total = fixed cost + (variable cost × quantity)
- Temperature: °F = (9/5)°C + 32

**Working with Rates**:
- When two entities work together: Combined rate = rate₁ + rate₂
- Time = Work ÷ Rate
- Work = Rate × Time

**Optimization Problems**:
Many real-world problems ask to maximize or minimize:
- Maximum profit (often quadratic)
- Minimum cost (often quadratic)
- Maximum area with fixed perimeter (geometric)

Strategy: Set up equations based on the scenario, then solve.`,
      },
    ],
    keyPoints: [
      'SOHCAHTOA helps remember trigonometric ratios',
      'sin²(θ) + cos²(θ) = 1 (Pythagorean identity)',
      'Functions map inputs to outputs: f(x)',
      'Linear functions create straight lines; quadratic creates parabolas',
      'Exponential functions model growth and decay',
    ],
  },

  statistics: {
    topicId: 'statistics',
    title: 'Statistics & Probability',
    estimatedReadTime: 28,
    sections: [
      {
        heading: 'Descriptive Statistics',
        content: `Statistics involves collecting, organizing, and analyzing data. About 8% of SAT Math covers statistics and probability.

**Measures of Central Tendency:**

1. **Mean (Average)**: Sum of all values ÷ Number of values
   - Most common measure
   - Affected by outliers

2. **Median**: Middle value when ordered
   - Unaffected by outliers
   - For even number of values: average the two middle

3. **Mode**: Most frequently occurring value
   - Can have multiple modes
   - May not exist if all values unique

**Measures of Spread:**

1. **Range**: Maximum - Minimum
   - Simple but affected by outliers

2. **Interquartile Range (IQR)**: Q3 - Q1
   - Middle 50% of data
   - Robust to outliers

3. **Standard Deviation**: Measure of how spread out data is
   - Higher standard deviation = more variation
   - Roughly 68% of data within 1 standard deviation of mean
   - Roughly 95% within 2 standard deviations

**Data Distributions:**
- **Normal (Bell) Distribution**: Symmetric, most values near mean
- **Skewed Left**: Tail extends left, median > mean
- **Skewed Right**: Tail extends right, mean > median
- **Uniform**: All values equally likely`,
      },
      {
        heading: 'Probability',
        content: `Probability measures the likelihood of an event (0 = impossible, 1 = certain).

**Basic Probability**: P(event) = (Favorable outcomes) ÷ (Total possible outcomes)

Example: P(rolling a 3 on die) = 1/6

**Compound Probability:**

1. **"AND" Problems** (Independent Events):
   - P(A and B) = P(A) × P(B)
   - Example: P(heads and rolling 4) = 1/2 × 1/6 = 1/12

2. **"OR" Problems**:
   - P(A or B) = P(A) + P(B) - P(A and B)
   - Example: P(heads or 4) = 1/2 + 1/6 - (1/2)(1/6) = 2/3

3. **"Without Replacement"** (Dependent Events):
   - Probabilities change after each selection
   - Example: Drawing cards from deck
   - P(first red) = 26/52, then P(second red) = 25/51

**Combinations & Permutations:**
- **Permutations**: Order matters (arrangements)
  - nPr = n! ÷ (n-r)!
- **Combinations**: Order doesn't matter (selections)
  - nCr = n! ÷ (r!(n-r)!)

Example: Ways to choose 2 people from 5:
- If order matters (President, VP): 5P2 = 20
- If order doesn't matter (committee): 5C2 = 10`,
      },
      {
        heading: 'Data Analysis & Inference',
        content: `The SAT increasingly tests your ability to interpret data and draw conclusions.

**Reading Graphs and Charts:**
- Bar graphs: Compare categories
- Line graphs: Show trends over time
- Scatter plots: Show relationship between two variables
- Box plots: Show distribution and quartiles

**Correlation vs. Causation:**
- Two variables can be correlated (move together) without one causing the other
- Example: Ice cream sales and drowning deaths both increase in summer (both caused by weather)

**Lines of Best Fit**:
- Linear regression models relationship between variables
- Used to make predictions
- Slope tells you rate of change
- y-intercept tells you starting value

**Sampling & Bias:**
- **Random Sample**: Each item equally likely to be chosen (good for inference)
- **Biased Sample**: Some items more likely than others
  - Convenience sampling (easiest to reach)
  - Voluntary response (self-selected)

**Confidence & Margin of Error:**
- Larger sample size → smaller margin of error
- Random sampling → more trustworthy results
- Confidence interval: Range where true value likely falls

**Two-Way Tables:**
Show frequency of two categorical variables
Used to calculate conditional probabilities: P(A|B) = (# with both A and B) ÷ (# with B)`,
      },
    ],
    keyPoints: [
      'Mean, median, mode measure center; range, IQR, standard deviation measure spread',
      'Probability of event = favorable outcomes ÷ total outcomes',
      'For independent events: P(A and B) = P(A) × P(B)',
      'Correlation doesn\'t imply causation',
      'Larger random samples give more trustworthy results',
    ],
  },
};

// ==================== ACT READING MATERIALS ====================

export const ACT_MATERIALS: Record<string, ReadingMaterial> = {
  punctuation: {
    topicId: 'punctuation',
    title: 'Punctuation',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Comma Rules',
        content: `The ACT English test heavily emphasizes correct comma usage. Key rules:

1. **Items in a series**: Use commas to separate three or more items ("apples, oranges, and bananas").
2. **Independent clauses**: Use a comma before a coordinating conjunction (FANBOYS) joining two independent clauses ("She studied hard, and she passed the exam.").
3. **Introductory elements**: Place a comma after introductory words, phrases, or clauses ("After the rain stopped, we went outside.").
4. **Nonessential information**: Use commas to set off nonessential clauses/phrases that can be removed without changing the core meaning ("My brother, who lives in Texas, is visiting.").
5. **Never separate a subject from its verb** with a single comma, and never use a comma to join two independent clauses without a conjunction (comma splice).`,
      },
      {
        heading: 'Semicolons, Colons, and Dashes',
        content: `**Semicolons** join two closely related independent clauses without a conjunction ("The exam was hard; she still passed.") or separate items in a complex list already containing commas.

**Colons** introduce a list, explanation, or emphatic statement, and must follow a complete independent clause ("She had one goal: success.").

**Dashes** can set off nonessential information (like parentheses) or create emphasis, and must be used in pairs unless at the end of a sentence.

**Apostrophes** show possession (the dog's leash) or contraction (it's = it is), and are never used to make a plural noun (dogs, not dog's).`,
      },
    ],
    keyPoints: [
      'Commas separate items in a series, join independent clauses with FANBOYS, and set off nonessential elements',
      'Never join two independent clauses with just a comma (comma splice)',
      'Semicolons join related independent clauses without a conjunction',
      'Colons must follow a complete independent clause',
      'Apostrophes show possession/contraction, never plurality',
    ],
  },

  'grammar-act': {
    topicId: 'grammar-act',
    title: 'Grammar & Usage',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Subject-Verb Agreement',
        content: `Subjects and verbs must agree in number. Watch for:

1. **Intervening phrases**: "The list of items (is/are) long." The subject is "list" (singular), so use "is," ignoring the prepositional phrase "of items."
2. **Compound subjects**: Joined by "and" take a plural verb ("The dog and cat are playing"). Joined by "or/nor," the verb agrees with the nearer subject.
3. **Collective nouns**: Treated as singular when acting as one unit ("The team is winning").
4. **Indefinite pronouns**: "Each," "everyone," "neither" are singular; "both," "few," "many" are plural.`,
      },
      {
        heading: 'Verb Tense and Pronoun Agreement',
        content: `Maintain consistent verb tense throughout a sentence/passage unless a time shift is explicitly indicated.

**Pronoun-antecedent agreement**: Pronouns must match their antecedent in number and gender ("Each student must bring his or her own book" or "their own book" in modern usage accepted by the ACT).

**Pronoun clarity**: Avoid ambiguous pronoun references where it's unclear which noun the pronoun refers to.

**Common tense errors**: Mixing past and present tense within the same clause, and incorrect use of perfect tenses (e.g., "had went" should be "had gone").`,
      },
    ],
    keyPoints: [
      'Match verbs to their true subject, ignoring intervening phrases',
      'Collective nouns are usually singular when acting as one unit',
      'Keep verb tense consistent unless a time shift is clearly indicated',
      'Pronouns must agree in number and have a clear antecedent',
      'Watch for irregular verb forms (had gone, not had went)',
    ],
  },

  'rhetorical-skills': {
    topicId: 'rhetorical-skills',
    title: 'Rhetorical Skills & Strategy',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Organization and Transitions',
        content: `ACT rhetorical skills questions test your ability to improve the strategy, organization, and style of a passage rather than just fixing grammar errors.

**Transitions** signal the relationship between ideas:
- Addition: furthermore, additionally, moreover
- Contrast: however, on the other hand, nevertheless
- Cause/effect: therefore, as a result, consequently
- Sequence: first, next, finally

**Paragraph organization**: Questions may ask you to reorder sentences/paragraphs for logical flow, or decide where a new sentence should be inserted based on context clues (what topic it introduces, what pronoun/reference it uses).`,
      },
      {
        heading: 'Style, Tone, and Conciseness',
        content: `**Conciseness**: The ACT rewards the most concise answer that maintains meaning. Eliminate redundancy ("completely finished" → "finished") and wordiness.

**Tone/style consistency**: The added text must match the passage's overall tone (formal vs. casual) and purpose.

**Relevance**: Some questions ask whether a sentence should be added/deleted based on whether it supports the paragraph's main focus — irrelevant details, even if factually correct, should usually be removed.

**Emphasis questions**: Determine which choice best achieves a stated goal, such as "emphasizing the character's excitement" — focus on the specific goal, not just grammatical correctness.`,
      },
    ],
    keyPoints: [
      'Transitions must accurately reflect the logical relationship between ideas',
      'The most concise, clear answer is usually correct if meaning is preserved',
      'New sentences must match the passage\'s tone and support the main idea',
      'Answer "goal" questions based on the stated purpose, not just grammar',
      'Irrelevant, off-topic sentences should typically be removed',
    ],
  },

  'pre-algebra': {
    topicId: 'pre-algebra',
    title: 'Pre-Algebra',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Fractions, Decimals, and Percentages',
        content: `Pre-algebra questions test foundational number sense.

**Fractions**: To add/subtract, find a common denominator. To multiply, multiply numerators and denominators. To divide, multiply by the reciprocal.

**Decimals**: Line up decimal points when adding/subtracting. Move decimal points equally when multiplying/dividing by powers of 10.

**Percentages**: "Percent of" means multiply by the decimal form (25% = 0.25). To find percent change: (new − old) / old × 100.

**Ratios and proportions**: A ratio compares two quantities. Cross-multiply to solve proportions: a/b = c/d means a×d = b×c.`,
      },
      {
        heading: 'Order of Operations and Number Properties',
        content: `**PEMDAS**: Parentheses, Exponents, Multiplication/Division (left to right), Addition/Subtraction (left to right).

**Factors and multiples**: A factor divides evenly into a number; a multiple is the product of a number and an integer. The GCF (greatest common factor) and LCM (least common multiple) are frequently tested.

**Absolute value**: |x| represents distance from zero, always non-negative.

**Mean, median, mode**: Mean = sum ÷ count. Median = middle value when sorted. Mode = most frequent value.`,
      },
    ],
    keyPoints: [
      'Find common denominators to add/subtract fractions',
      'Percent change = (new − old) / old × 100',
      'Cross-multiply to solve proportions',
      'PEMDAS determines the order of operations',
      'Mean = sum ÷ count; median = middle value; mode = most frequent',
    ],
  },

  'elementary-algebra': {
    topicId: 'elementary-algebra',
    title: 'Elementary Algebra',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Solving Linear Equations',
        content: `To solve for a variable, isolate it using inverse operations, performing the same operation on both sides.

**Example**: 3x + 5 = 20 → 3x = 15 → x = 5

**Distributing**: a(b + c) = ab + ac. Always distribute before combining like terms.

**Combining like terms**: Only terms with the same variable and exponent can be combined (3x + 2x = 5x, but 3x + 2x² cannot be combined).`,
      },
      {
        heading: 'Exponent Rules and Expressions',
        content: `**Exponent rules**:
- x^a × x^b = x^(a+b)
- x^a / x^b = x^(a-b)
- (x^a)^b = x^(ab)
- x^0 = 1 (for x ≠ 0)
- x^(-a) = 1/x^a

**Evaluating expressions**: Substitute given values for variables, then apply order of operations.

**Inequalities**: Solve like equations, but flip the inequality sign when multiplying or dividing by a negative number.`,
      },
    ],
    keyPoints: [
      'Isolate the variable using inverse operations on both sides',
      'Distribute before combining like terms',
      'Only combine terms with the same variable and exponent',
      'Flip the inequality sign when multiplying/dividing by a negative',
      'Substitute values carefully, following order of operations',
    ],
  },

  'intermediate-algebra': {
    topicId: 'intermediate-algebra',
    title: 'Intermediate Algebra',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Quadratic Equations',
        content: `A quadratic equation has the form $ax^2 + bx + c = 0$.

**Factoring**: Find two numbers that multiply to ac and add to b.

**Quadratic formula**: x = (-b ± √(b² - 4ac)) / 2a

**Discriminant** (b² - 4ac): positive → two real solutions; zero → one real solution; negative → no real solutions.`,
      },
      {
        heading: 'Systems of Equations and Radicals',
        content: `**Systems of equations** can be solved by substitution (solve one equation for a variable, substitute into the other) or elimination (add/subtract equations to cancel a variable).

**Radicals**: √a × √b = √(ab). Simplify by factoring out perfect squares.

**Rational expressions**: Factor numerator/denominator fully before canceling common factors.`,
      },
    ],
    keyPoints: [
      'Use the quadratic formula when factoring is difficult',
      'The discriminant tells you how many real solutions exist',
      'Solve systems using substitution or elimination',
      'Simplify radicals by factoring out perfect squares',
      'Factor fully before canceling in rational expressions',
    ],
  },

  'coordinate-geometry': {
    topicId: 'coordinate-geometry',
    title: 'Coordinate Geometry',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Slope, Distance, and Midpoint',
        content: `**Slope**: m = (y2 - y1) / (x2 - x1). Parallel lines have equal slopes; perpendicular lines have negative reciprocal slopes.

**Distance formula**: d = √[(x2-x1)² + (y2-y1)²]

**Midpoint formula**: ((x1+x2)/2, (y1+y2)/2)`,
      },
      {
        heading: 'Equations of Lines and Circles',
        content: `**Slope-intercept form**: y = mx + b, where m is slope and b is the y-intercept.

**Point-slope form**: y - y1 = m(x - x1)

**Circle equation**: (x-h)² + (y-k)² = r², where (h,k) is the center and r is the radius.`,
      },
    ],
    keyPoints: [
      'Slope = rise/run = (y2−y1)/(x2−x1)',
      'Parallel lines share slope; perpendicular slopes are negative reciprocals',
      'Distance formula comes from the Pythagorean theorem',
      'Slope-intercept form: y = mx + b',
      'Circle equation: (x−h)² + (y−k)² = r²',
    ],
  },

  'plane-geometry': {
    topicId: 'plane-geometry',
    title: 'Plane Geometry',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Triangles and the Pythagorean Theorem',
        content: `**Triangle angle sum**: The interior angles of any triangle sum to 180°.

**Pythagorean theorem**: $a^2 + b^2 = c^2$ for right triangles, where c is the hypotenuse.

**Area of a triangle**: (1/2) × base × height

**Similar triangles**: Corresponding angles are equal, and corresponding sides are proportional.`,
      },
      {
        heading: 'Circles and Polygons',
        content: `**Circle formulas**: Circumference = 2πr; Area = πr²

**Polygon angle sum**: (n-2) × 180° for an n-sided polygon.

**Volume/surface area**: Rectangular prism volume = l × w × h. Cylinder volume = πr²h.`,
      },
    ],
    keyPoints: [
      'Triangle angles always sum to 180°',
      'Pythagorean theorem: a² + b² = c² for right triangles',
      'Circle circumference = 2πr; area = πr²',
      'Polygon interior angle sum = (n−2) × 180°',
      'Similar triangles have proportional corresponding sides',
    ],
  },

  'trigonometry-act': {
    topicId: 'trigonometry-act',
    title: 'Trigonometry',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'SOH-CAH-TOA and Right Triangle Trig',
        content: `**SOH-CAH-TOA** for right triangles:
- sin(θ) = opposite / hypotenuse
- cos(θ) = adjacent / hypotenuse
- tan(θ) = opposite / adjacent

**Common angles**: 30-60-90 and 45-45-90 triangles have known side ratios worth memorizing.`,
      },
      {
        heading: 'Radians, Identities, and Graphs',
        content: `**Radians**: 180° = π radians, so to convert degrees to radians, multiply by π/180.

**Pythagorean identity**: sin²(θ) + cos²(θ) = 1

**Graphs**: Sine and cosine oscillate between -1 and 1 with a period of 2π (or 360°).`,
      },
    ],
    keyPoints: [
      'SOH-CAH-TOA defines sine, cosine, and tangent for right triangles',
      'Memorize 30-60-90 and 45-45-90 triangle side ratios',
      '180° = π radians',
      'sin²(θ) + cos²(θ) = 1',
      'Sine and cosine have a period of 360° (2π radians)',
    ],
  },

  'prose-fiction': {
    topicId: 'prose-fiction',
    title: 'Prose Fiction',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Reading Fiction Passages Actively',
        content: `ACT Prose Fiction passages are excerpts from novels or short stories, focusing on characters, relationships, and narrative events.

**What to focus on while reading**:
1. **Characters**: Who are they? What do they want? How do they change?
2. **Relationships**: How do characters interact and feel about each other?
3. **Setting**: Where and when does the story take place, and how does it affect the mood?
4. **Point of view**: Is the narrator first-person, third-person limited, or omniscient?
5. **Tone and mood**: What emotions does the passage evoke?`,
      },
      {
        heading: 'Common Question Types',
        content: `**Character motivation**: Why does a character act or feel a certain way? Look for direct statements and implied reasons.

**Inference questions**: What can be reasonably concluded from the text, even if not directly stated?

**Vocabulary-in-context**: What does a word mean based on how it's used in the passage (not just its dictionary definition)?

**Tone/mood questions**: What is the overall emotional atmosphere created by word choice and description?`,
      },
    ],
    keyPoints: [
      'Track character motivations, relationships, and changes over the passage',
      'Note point of view (first-person vs. third-person) and its effect on the story',
      'Inference questions require evidence-based reasoning, not just guessing',
      'Vocabulary-in-context questions depend on the surrounding sentence, not dictionary definitions',
      'Tone is conveyed through word choice, imagery, and descriptive details',
    ],
  },

  humanities: {
    topicId: 'humanities',
    title: 'Humanities',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Reading Humanities Passages',
        content: `ACT Humanities passages cover topics like art, music, philosophy, literature criticism, and cultural history — often more abstract and analytical than fiction passages.

**Strategies**:
1. Identify the main argument or thesis the author is making
2. Note how examples/evidence support that argument
3. Watch for author's tone — humanities passages often carry a clear point of view or opinion
4. Distinguish between the author's opinion and factual description`,
      },
      {
        heading: 'Analyzing Argument and Structure',
        content: `**Thesis identification**: The main idea is usually stated early, though it may be nuanced or require synthesis across paragraphs.

**Supporting evidence**: Look for examples, historical references, or expert opinions used to back up claims.

**Author's perspective**: Humanities passages often evaluate or critique a subject (a work of art, a philosophical idea, a cultural movement) — identify whether the author is favorable, critical, or neutral.`,
      },
    ],
    keyPoints: [
      'Identify the author\'s main argument or thesis early in the passage',
      'Track how examples and evidence support the central claim',
      'Determine the author\'s tone: favorable, critical, or neutral',
      'Separate factual descriptions from the author\'s opinions',
      'Humanities passages often require synthesizing ideas across paragraphs',
    ],
  },

  'social-science': {
    topicId: 'social-science',
    title: 'Social Science',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Reading Social Science Passages',
        content: `ACT Social Science passages cover history, political science, economics, sociology, and psychology — typically more fact-based and structured than humanities passages.

**Strategies**:
1. Identify the main topic and the author's purpose (informing, analyzing cause/effect, comparing viewpoints)
2. Track cause-and-effect relationships explicitly stated in the text
3. Note dates, statistics, and named studies/events, as these are often tested in detail questions`,
      },
      {
        heading: 'Cause, Effect, and Comparison',
        content: `**Cause-and-effect**: Social science passages often explain why something happened (economic policy leading to a recession, a social movement causing legal change).

**Comparing viewpoints**: Passages may present multiple perspectives on a historical event or social issue — track which view the author supports, if any.

**Data interpretation**: Some passages include statistics or research findings; make sure you understand what the numbers represent in context.`,
      },
    ],
    keyPoints: [
      'Identify the author\'s purpose: informing, analyzing, or comparing viewpoints',
      'Track cause-and-effect relationships explicitly described in the text',
      'Note specific dates, statistics, and named studies for detail questions',
      'When multiple viewpoints are presented, identify which one (if any) the author favors',
      'Understand what any given statistics or data represent in context',
    ],
  },

  'natural-science': {
    topicId: 'natural-science',
    title: 'Natural Science',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Reading Natural Science Passages',
        content: `ACT Natural Science passages cover biology, chemistry, physics, and other science topics — focusing on explaining processes, discoveries, and scientific reasoning.

**Strategies**:
1. Identify the main scientific process, discovery, or phenomenon being explained
2. Track sequential steps in a process (e.g., stages of a chemical reaction or biological cycle)
3. Note cause-and-effect relationships between scientific variables
4. Pay attention to how new terms are defined within the passage itself`,
      },
      {
        heading: 'Scientific Reasoning and Vocabulary',
        content: `**Defined terms**: Natural science passages usually define technical vocabulary directly in the text — use context to confirm meaning rather than relying on outside knowledge.

**Process/sequence questions**: Many questions ask you to identify the correct order of steps in a scientific process described in the passage.

**Hypothesis and evidence**: Passages may describe an experiment, a hypothesis, and the resulting evidence — track how the evidence supports or challenges the hypothesis.`,
      },
    ],
    keyPoints: [
      'Identify the central scientific process, discovery, or phenomenon',
      'Track the sequence of steps in any described process carefully',
      'Rely on the passage\'s own definitions of technical terms, not outside knowledge',
      'Note cause-and-effect relationships between scientific variables',
      'Understand how evidence supports or challenges any stated hypothesis',
    ],
  },

  biology: {
    topicId: 'biology',
    title: 'Biology',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Cell Biology and Genetics',
        content: `**Cell structure**: All cells contain a cell membrane, cytoplasm, and genetic material. Eukaryotic cells (plants, animals) also contain a nucleus and membrane-bound organelles like mitochondria (energy production) and ribosomes (protein synthesis).

**DNA and genetics**: DNA is organized into genes, which code for proteins. Traits are passed from parents to offspring through alleles — different versions of a gene. Dominant alleles mask recessive alleles when both are present (heterozygous).

**Cell division**: Mitosis produces two identical daughter cells for growth/repair. Meiosis produces four genetically distinct gametes (sperm/egg) for sexual reproduction.`,
      },
      {
        heading: 'Ecology and Evolution',
        content: `**Ecosystems**: Energy flows through ecosystems via food chains/webs, starting with producers (plants) that capture energy through photosynthesis, then to primary, secondary, and tertiary consumers.

**Natural selection**: Individuals with traits better suited to their environment are more likely to survive and reproduce, passing those traits to offspring — the basis of evolution by natural selection.

**Data interpretation**: ACT Science biology passages often present experimental data on population growth, enzyme activity, or genetic crosses — focus on identifying trends and relationships in tables/graphs.`,
      },
    ],
    keyPoints: [
      'Eukaryotic cells contain a nucleus and organelles like mitochondria and ribosomes',
      'Dominant alleles mask recessive alleles in heterozygous individuals',
      'Mitosis creates identical cells; meiosis creates genetically diverse gametes',
      'Energy flows from producers to consumers through food chains/webs',
      'Natural selection favors traits that improve survival and reproduction',
    ],
  },

  chemistry: {
    topicId: 'chemistry',
    title: 'Chemistry',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Atomic Structure and the Periodic Table',
        content: `**Atomic structure**: Atoms consist of protons (positive, in nucleus), neutrons (neutral, in nucleus), and electrons (negative, orbiting nucleus). The number of protons defines the element (atomic number).

**Periodic table trends**: Elements are organized by increasing atomic number. Elements in the same column (group) share similar chemical properties due to having the same number of valence (outer) electrons.

**Chemical bonding**: Ionic bonds form when electrons are transferred between atoms (metal + nonmetal). Covalent bonds form when electrons are shared between atoms (typically nonmetal + nonmetal).`,
      },
      {
        heading: 'Chemical Reactions and Equilibrium',
        content: `**Balancing equations**: The number of atoms of each element must be equal on both sides of a chemical equation, following the law of conservation of mass.

**Reaction rates**: Increased temperature, concentration, or surface area generally increase reaction rates by increasing the frequency of effective collisions between reactant particles.

**Equilibrium**: In a reversible reaction at equilibrium, the forward and reverse reaction rates are equal, though concentrations of reactants and products are not necessarily equal. Le Chatelier's principle predicts how equilibrium shifts in response to changes in conditions.`,
      },
    ],
    keyPoints: [
      'Atomic number (protons) determines an element\'s identity',
      'Elements in the same periodic table group share similar valence electron configurations',
      'Ionic bonds transfer electrons; covalent bonds share electrons',
      'Chemical equations must be balanced per conservation of mass',
      'Le Chatelier\'s principle predicts how equilibrium shifts under changing conditions',
    ],
  },

  physics: {
    topicId: 'physics',
    title: 'Physics',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Forces and Motion',
        content: `**Newton's laws**: An object remains at rest or in uniform motion unless acted on by a net force (1st law). Force = mass × acceleration (2nd law). Every action has an equal and opposite reaction (3rd law).

**Energy**: Kinetic energy (motion) = (1/2)mv². Potential energy (position, e.g. gravity) = mgh. Energy is conserved in a closed system — it changes form but is never created or destroyed.

**Graphs of motion**: Position-time graphs show slope = velocity. Velocity-time graphs show slope = acceleration, and area under the curve = displacement.`,
      },
      {
        heading: 'Waves, Electricity, and Data Interpretation',
        content: `**Waves**: Wave speed = frequency × wavelength. Higher frequency means shorter wavelength for a constant wave speed.

**Electric circuits**: Ohm's law states voltage = current × resistance. In series circuits, current is constant throughout; in parallel circuits, voltage is constant across each branch.

**ACT Science physics passages** often present experimental data tables/graphs testing relationships between variables (e.g., force vs. acceleration) — focus on identifying the trend, not memorizing formulas beyond the basics.`,
      },
    ],
    keyPoints: [
      'Newton\'s three laws describe the relationship between force and motion',
      'Energy is conserved; it changes form but isn\'t created or destroyed',
      'Position-time graph slope = velocity; velocity-time graph slope = acceleration',
      'Wave speed = frequency × wavelength',
      'Ohm\'s law: voltage = current × resistance',
    ],
  },

  'earth-science': {
    topicId: 'earth-science',
    title: 'Earth & Space Science',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Geology and Weather',
        content: `**Rock cycle**: Igneous rocks form from cooled magma/lava. Sedimentary rocks form from compacted/cemented sediment layers. Metamorphic rocks form when existing rocks are transformed by heat and pressure. All three types can transform into one another over geologic time.

**Weather vs. climate**: Weather refers to short-term atmospheric conditions (a single day's temperature/precipitation); climate refers to long-term average patterns over decades.

**Air masses and fronts**: A front is the boundary between two air masses of different temperature/humidity. Cold fronts often bring sudden, intense weather changes; warm fronts bring more gradual changes.`,
      },
      {
        heading: 'Astronomy and Earth Systems',
        content: `**Solar system**: Planets orbit the sun in elliptical paths, as described by Kepler's laws. Inner "rocky" planets (Mercury, Venus, Earth, Mars) differ significantly from outer "gas giant" planets (Jupiter, Saturn, Uranus, Neptune).

**Earth's layers**: The crust (thin, outer layer), mantle (thick, semi-fluid), outer core (liquid), and inner core (solid) each have distinct densities and compositions.

**Data interpretation**: ACT Science earth science passages often include topographic maps, weather data tables, or geologic timelines — focus on reading axes and identifying described trends carefully.`,
      },
    ],
    keyPoints: [
      'Rock cycle: igneous, sedimentary, and metamorphic rocks continuously transform',
      'Weather is short-term; climate is long-term average atmospheric patterns',
      'Cold fronts bring sudden changes; warm fronts bring gradual changes',
      'Earth has four layers: crust, mantle, outer core, and inner core',
      'Inner rocky planets differ significantly from outer gas giant planets',
    ],
  },
};

// ==================== GRE READING MATERIALS ====================

export const GRE_MATERIALS: Record<string, ReadingMaterial> = {
  'text-completion': {
    topicId: 'text-completion',
    title: 'Text Completion',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Approaching Text Completion Questions',
        content: `GRE Text Completion questions present a passage with one, two, or three blanks, each requiring you to select the best word or short phrase from a list of options.

**Strategy**:
1. Read the entire passage first, ignoring the blanks, to understand the overall meaning
2. Identify key transition words (however, therefore, although) that signal contrast or continuation
3. Come up with your own word for each blank before looking at the answer choices
4. For multi-blank questions, each blank must work independently — a partially correct combination is wrong`,
      },
      {
        heading: 'Common Traps and Vocabulary Strategy',
        content: `**Contrast signals**: Words like "although," "despite," "yet," and "however" indicate the blank should contain a word with an opposite meaning to a nearby clue.

**Continuation signals**: Words like "and," "moreover," "furthermore" indicate the blank should align with the same meaning/direction as a nearby clue.

**Vocabulary building**: GRE Text Completion relies heavily on sophisticated vocabulary. Learn words in context (using them in sentences) rather than memorizing isolated definitions for better retention.`,
      },
    ],
    keyPoints: [
      'Read the entire passage before considering answer choices',
      'Identify contrast signals (however, although) vs. continuation signals (and, moreover)',
      'Formulate your own word for each blank before reviewing options',
      'Multi-blank questions require every blank to be correct — no partial credit',
      'Build vocabulary by learning words in context, not isolation',
    ],
  },

  'sentence-equivalence': {
    topicId: 'sentence-equivalence',
    title: 'Sentence Equivalence',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Understanding Sentence Equivalence',
        content: `Sentence Equivalence questions present a single sentence with one blank and six answer choices. You must select TWO choices that both correctly complete the sentence AND produce sentences with equivalent meaning.

**Key strategy**: Look for pairs of synonyms among the six choices first — the correct answers are almost always synonyms or near-synonyms of each other, not just individually plausible words.`,
      },
      {
        heading: 'Avoiding Common Traps',
        content: `**Trap 1**: A word may correctly complete the sentence grammatically/logically, but if no synonym pair exists among the choices, it cannot be part of the correct answer.

**Trap 2**: Two choices may be synonyms of each other, but if they don't fit the sentence's logical context, they are still wrong.

**Both conditions must be met**: the pair must be synonymous AND both must correctly complete the sentence's meaning.`,
      },
    ],
    keyPoints: [
      'You must select exactly two answers that are synonyms of each other',
      'Both chosen words must independently make logical sense in the sentence',
      'Scan for synonym pairs among the six choices as a starting strategy',
      'A plausible single word without a synonym partner cannot be correct',
      'Two synonyms that don\'t fit the sentence\'s logic are still incorrect',
    ],
  },

  'reading-comprehension-gre': {
    topicId: 'reading-comprehension-gre',
    title: 'Reading Comprehension',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'GRE Reading Comprehension Strategy',
        content: `GRE passages are drawn from academic disciplines (humanities, social science, natural science) and are typically denser and more argumentative than ACT passages.

**Strategy**:
1. Identify the passage's main point and the author's purpose (to argue, describe, critique, compare)
2. Note the structure: does the author present one view, then a counterargument? Multiple examples supporting one thesis?
3. For detail questions, locate the exact line in the passage — don't rely on memory`,
      },
      {
        heading: 'Question Types',
        content: `**Main idea questions**: Ask for the primary purpose or overall argument of the passage.

**Inference questions**: Require reasoning beyond what's explicitly stated, but must be strongly supported by the text.

**Structure questions**: Ask how a paragraph or sentence functions within the passage's overall argument (e.g., "to provide a counterexample").

**Strengthen/weaken questions**: Ask which new piece of information would support or undermine the author's argument.`,
      },
    ],
    keyPoints: [
      'Identify the author\'s main point and purpose before answering detail questions',
      'GRE passages are often argumentative — track the author\'s stance and any counterarguments',
      'Inference answers must be strongly supported by the text, not just plausible',
      'Structure questions ask about the function of a sentence/paragraph, not just its content',
      'Always verify detail answers against the exact text, not memory',
    ],
  },

  arithmetic: {
    topicId: 'arithmetic',
    title: 'Arithmetic',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Number Properties and Operations',
        content: `**Integer properties**: Even × even = even; odd × odd = odd; even × odd = even. Even + even = even; odd + odd = even; even + odd = odd.

**Divisibility rules**: A number is divisible by 3 if its digits sum to a multiple of 3. A number is divisible by 9 if its digits sum to a multiple of 9.

**Percentages and ratios**: Percent change = (new − old)/old × 100. Ratios compare quantities; always simplify to lowest terms.`,
      },
      {
        heading: 'Fractions, Decimals, and Exponents',
        content: `**Order of operations**: PEMDAS applies consistently — parentheses, exponents, multiplication/division, addition/subtraction.

**Exponent rules**: x^a × x^b = x^(a+b). x^a / x^b = x^(a-b). (x^a)^b = x^(ab).

**GRE quantitative comparison tip**: When comparing two quantities, look for special cases (0, negative numbers, fractions) that might change which quantity is larger.`,
      },
    ],
    keyPoints: [
      'Master even/odd and divisibility rules for quick number property questions',
      'Percent change = (new − old)/old × 100',
      'Apply PEMDAS consistently for order of operations',
      'Exponent rules: multiply same base by adding exponents, divide by subtracting',
      'Test special cases (0, negatives, fractions) in quantitative comparison questions',
    ],
  },

  'algebra-gre': {
    topicId: 'algebra-gre',
    title: 'Algebra',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Equations, Inequalities, and Functions',
        content: `**Linear equations**: Isolate the variable using inverse operations on both sides.

**Systems of equations**: Solve using substitution or elimination.

**Inequalities**: Flip the inequality sign when multiplying or dividing by a negative number.

**Functions**: f(x) notation represents a rule applied to an input x; evaluate by substituting the given value.`,
      },
      {
        heading: 'Quadratics and Advanced Algebra',
        content: `**Quadratic formula**: x = (-b ± √(b² - 4ac)) / 2a for ax² + bx + c = 0.

**Factoring**: Look for two numbers that multiply to give "c" and add to give "b" in x² + bx + c.

**GRE-specific tip**: Quantitative comparison questions with variables often require testing multiple values (positive, negative, fractions, zero) rather than solving algebraically.`,
      },
    ],
    keyPoints: [
      'Isolate variables using inverse operations; flip inequality signs when multiplying/dividing by negatives',
      'Solve systems of equations via substitution or elimination',
      'Quadratic formula: x = (-b ± √(b²-4ac)) / 2a',
      'Factor by finding two numbers that multiply to c and add to b',
      'Test multiple value types in quantitative comparison questions with variables',
    ],
  },

  'geometry-gre': {
    topicId: 'geometry-gre',
    title: 'Geometry',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Shapes and Formulas',
        content: `**Triangles**: Angle sum = 180°. Pythagorean theorem: a² + b² = c² for right triangles. Area = (1/2) × base × height.

**Circles**: Circumference = 2πr. Area = πr².

**Quadrilaterals**: Rectangle area = length × width. Parallelogram area = base × height.`,
      },
      {
        heading: 'Coordinate Geometry and Volume',
        content: `**Coordinate geometry**: Slope = (y2-y1)/(x2-x1). Distance = √[(x2-x1)² + (y2-y1)²].

**Volume formulas**: Rectangular prism = l × w × h. Cylinder = πr²h. Sphere = (4/3)πr³.

**GRE tip**: Diagrams are NOT necessarily drawn to scale unless stated — rely on given measurements and geometric rules, not visual appearance.`,
      },
    ],
    keyPoints: [
      'Triangle angle sum is always 180°; use the Pythagorean theorem for right triangles',
      'Circle circumference = 2πr; area = πr²',
      'Slope = rise/run; distance formula derives from the Pythagorean theorem',
      'Common volume formulas: prism = lwh, cylinder = πr²h, sphere = (4/3)πr³',
      'GRE diagrams may not be drawn to scale — trust given values, not appearance',
    ],
  },

  'data-analysis': {
    topicId: 'data-analysis',
    title: 'Data Analysis',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Statistics Fundamentals',
        content: `**Measures of central tendency**: Mean = sum ÷ count. Median = middle value when sorted. Mode = most frequent value.

**Measures of spread**: Range = max − min. Standard deviation measures how spread out data is from the mean.

**Probability**: P(event) = favorable outcomes / total outcomes. For independent events, P(A and B) = P(A) × P(B).`,
      },
      {
        heading: 'Interpreting Graphs and Data Sets',
        content: `**Reading graphs**: Bar graphs compare categories; line graphs show trends over time; scatter plots show relationships between two variables.

**Data interpretation tip**: Pay close attention to axis labels, units, and scale — GRE questions often test whether you correctly read the graph's scale (e.g., increments of 5 vs. 10).

**Combinations and permutations**: Permutations count ordered arrangements; combinations count unordered selections. Use n! (factorial) notation for counting arrangements.`,
      },
    ],
    keyPoints: [
      'Mean, median, and mode measure central tendency differently',
      'Range and standard deviation measure how spread out data is',
      'Probability = favorable outcomes / total outcomes',
      'For independent events, multiply individual probabilities',
      'Carefully read graph axis labels and scale before interpreting data',
    ],
  },

  'issue-essay': {
    topicId: 'issue-essay',
    title: 'Analytical Writing: Issue Essay',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Approaching the Issue Essay',
        content: `The GRE Issue Essay asks you to develop a position on a general statement or claim, supporting your view with reasons and examples.

**Strategy**:
1. Take a clear position — you may agree, disagree, or qualify your agreement
2. Consider the strongest counterarguments and address them
3. Use specific, varied examples (historical, literary, personal, or hypothetical) to support your claims
4. Organize with a clear introduction (thesis), body paragraphs (each with one main point), and conclusion`,
      },
      {
        heading: 'Scoring Criteria',
        content: `Graders assess: clarity and sophistication of your position, quality and relevance of supporting examples, organization and logical flow, and control of standard written English (grammar, syntax, vocabulary).

Aim for a nuanced position — acknowledging complexity or exceptions often scores higher than an absolute, one-sided stance.`,
      },
    ],
    keyPoints: [
      'Take a clear, defensible position on the issue',
      'Address the strongest counterarguments to strengthen your position',
      'Use varied, specific examples to support each point',
      'Organize with clear thesis, body paragraphs, and conclusion',
      'Nuanced positions acknowledging complexity often score higher than absolutist stances',
    ],
  },

  'argument-essay': {
    topicId: 'argument-essay',
    title: 'Analytical Writing: Argument Essay',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Approaching the Argument Essay',
        content: `The GRE Argument Essay asks you to critique the LOGICAL SOUNDNESS of a given argument — NOT to state whether you agree with its conclusion.

**Strategy**:
1. Identify the argument's key claims, evidence, and unstated assumptions
2. Look for logical flaws: unwarranted assumptions, unrepresentative samples, correlation vs. causation errors, or missing alternative explanations
3. Explain specifically how each flaw weakens the argument's conclusion
4. Suggest what additional evidence would strengthen or help evaluate the argument`,
      },
      {
        heading: 'Common Logical Flaws to Identify',
        content: `**Correlation vs. causation**: The argument assumes one event caused another simply because they occurred together.

**Unrepresentative sample**: The argument generalizes from a small or biased sample to a broader population.

**False analogy**: The argument assumes two things are similar in all relevant respects when they may not be.

**Unstated assumptions**: The argument relies on an assumption that is never proven or justified within the argument itself.`,
      },
    ],
    keyPoints: [
      'Critique the argument\'s logic, not whether you agree with its conclusion',
      'Identify unstated assumptions the argument relies on',
      'Watch for correlation/causation errors and unrepresentative samples',
      'Explain specifically how each flaw weakens the conclusion',
      'Suggest additional evidence that would help evaluate the argument\'s validity',
    ],
  },
};

export const GMAT_MATERIALS: Record<string, ReadingMaterial> = {
  'argument-analysis': {
    topicId: 'argument-analysis',
    title: 'Analytical Writing: Argument Analysis',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Approaching the Argument Essay',
        content: `The GMAT Argument Analysis task asks you to critique the LOGICAL SOUNDNESS of a given business or general argument — not to state whether you personally agree with its conclusion.

**Strategy**:
1. Identify the argument's conclusion and the evidence used to support it
2. Look for unstated assumptions the argument depends on
3. Identify specific logical flaws (correlation vs. causation, unrepresentative samples, flawed analogies)
4. Explain how each flaw weakens the argument's conclusion, and suggest what evidence would help evaluate it`,
      },
      {
        heading: 'Common Business Argument Flaws',
        content: `**Correlation vs. causation**: Two business metrics moving together (e.g., sales and advertising spend) doesn't prove one caused the other.

**Unrepresentative samples**: A survey of a small or biased customer segment may not represent the whole customer base.

**False analogies**: Assuming a strategy that worked for one company will work identically for another ignores differences in market, scale, or context.

**Unstated assumptions**: Business arguments often assume market conditions will remain constant, or that past performance predicts future results.`,
      },
    ],
    keyPoints: [
      'Critique the argument\'s logic, not whether you agree with the conclusion',
      'Identify the conclusion and the evidence supporting it',
      'Watch for correlation/causation errors common in business data',
      'Question whether samples/surveys are representative of the whole',
      'Suggest what additional evidence would strengthen or clarify the argument',
    ],
  },

  'table-analysis': {
    topicId: 'table-analysis',
    title: 'Table Analysis',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Reading and Sorting Tables',
        content: `GMAT Table Analysis questions present a sortable data table and ask you to evaluate statements about the data.

**Strategy**:
1. Understand what each column represents and its units before evaluating any statement
2. Consider how sorting by a specific column would help verify a claim (e.g., sort by revenue to find the highest-earning region)
3. Watch for statements that require calculations (e.g., "the average of column X exceeds Y") rather than direct lookups`,
      },
      {
        heading: 'Common Question Types',
        content: `**Direct lookup**: Find a specific value at the intersection of a row and column.

**Comparison**: Determine which row has the highest/lowest value in a given column.

**Calculation**: Compute an average, sum, ratio, or percentage using multiple values in the table.

**Conditional statements**: Evaluate "if X, then Y" style statements against the actual data.`,
      },
    ],
    keyPoints: [
      'Understand column headers and units before analyzing data',
      'Consider sorting strategies to quickly verify comparative claims',
      'Some statements require calculations (averages, ratios), not just lookups',
      'Carefully evaluate conditional ("if...then") statements against the data',
      'Double-check units and scale (thousands vs. millions) before concluding',
    ],
  },

  'graphics-interpretation': {
    topicId: 'graphics-interpretation',
    title: 'Graphics Interpretation',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Interpreting Charts and Graphs',
        content: `GMAT Graphics Interpretation questions present a chart, graph, or diagram and ask you to complete statements using a dropdown of choices based on the visual data.

**Strategy**:
1. Identify the type of graph (bar, line, scatter, pie) and what each axis or segment represents
2. Note the scale carefully — graphs may use non-obvious increments (e.g., by 5s or 25s)
3. For trend questions, look at the overall direction (increasing, decreasing, cyclical) rather than getting distracted by minor fluctuations`,
      },
      {
        heading: 'Common Graph Types and Pitfalls',
        content: `**Line graphs**: Show trends over time; slope indicates rate of change.

**Bar graphs**: Compare discrete categories; height/length represents magnitude.

**Scatter plots**: Show relationships between two variables; look for correlation direction and strength.

**Pie charts**: Show proportions of a whole; percentages should sum to 100%.

**Pitfall**: Don't assume a graph starts at zero — truncated axes can visually exaggerate differences.`,
      },
    ],
    keyPoints: [
      'Identify graph type and what each axis/segment represents before answering',
      'Pay close attention to scale and units, which are often non-obvious',
      'Focus on overall trends rather than minor fluctuations',
      'Pie chart percentages must sum to 100%',
      'Watch for truncated axes that can visually exaggerate differences',
    ],
  },

  'two-part-analysis': {
    topicId: 'two-part-analysis',
    title: 'Two-Part Analysis',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Solving Two-Part Analysis Problems',
        content: `GMAT Two-Part Analysis questions present a scenario requiring you to determine two related values or make two related decisions from a single table of options.

**Strategy**:
1. Read the scenario carefully to understand what each of the two parts is asking for
2. Determine whether the two parts are independent or interdependent (does choosing one value affect the other?)
3. Test combinations systematically rather than guessing`,
      },
      {
        heading: 'Common Formats',
        content: `**Quantitative**: Solve two related equations or values simultaneously (e.g., find both a company's revenue and its cost given profit and margin data).

**Verbal/logical**: Identify two statements — one that supports and one that weakens an argument — from a shared list of options.

**Strategy tip**: Since both answers come from the same option list, ensure you're not selecting the same option for both parts unless the scenario explicitly allows it.`,
      },
    ],
    keyPoints: [
      'Clarify what each of the two parts is asking before attempting a solution',
      'Determine if the two values/decisions are interdependent',
      'Test combinations systematically for quantitative problems',
      'Both answers are chosen from the same shared option list',
      'Re-read the scenario to confirm you haven\'t misread which part needs which type of answer',
    ],
  },

  'multi-source-reasoning': {
    topicId: 'multi-source-reasoning',
    title: 'Multi-Source Reasoning',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Synthesizing Multiple Sources',
        content: `GMAT Multi-Source Reasoning questions present information across multiple tabs (e.g., an email, a memo, a data table) and require you to synthesize information from all sources to answer questions.

**Strategy**:
1. Skim all tabs/sources first to understand what type of information each contains
2. When answering a question, identify which source(s) are relevant — don't assume all questions require all sources
3. Watch for information that seems contradictory between sources; often the "correct" reconciliation requires careful reading of dates or conditions`,
      },
      {
        heading: 'Question Types',
        content: `**Single-source questions**: Can be answered by referring to just one tab/source.

**Cross-source questions**: Require combining information from two or more tabs to reach a conclusion.

**Inference questions**: Ask you to determine what must be true based on the combined information, not just what's explicitly stated in any one source.`,
      },
    ],
    keyPoints: [
      'Skim all sources first to know what type of information each contains',
      'Identify which specific source(s) are relevant to each question',
      'Watch for apparent contradictions that are resolved by dates or conditions',
      'Cross-source questions require synthesizing information from multiple tabs',
      'Inference questions require reasoning beyond any single source alone',
    ],
  },

  'arithmetic-gmat': {
    topicId: 'arithmetic-gmat',
    title: 'Arithmetic',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Number Properties for Business Contexts',
        content: `**Percentages**: Percent change = (new − old)/old × 100. Frequently tested in profit/loss and growth rate contexts.

**Ratios**: Compare quantities like price-to-earnings or debt-to-equity; always simplify to lowest terms.

**Divisibility and factors**: GCF and LCM appear in scheduling and batch-size problems.`,
      },
      {
        heading: 'Data Sufficiency Considerations',
        content: `GMAT Quantitative questions may appear as Data Sufficiency, testing whether given information is SUFFICIENT to answer a question, not the answer itself.

**Strategy**: Evaluate each statement independently first, then together. Don't assume a statement is true just because it seems reasonable — verify it directly answers the question with certainty.`,
      },
    ],
    keyPoints: [
      'Percent change = (new − old)/old × 100',
      'Simplify ratios (price-to-earnings, debt-to-equity) to lowest terms',
      'GCF/LCM concepts apply to scheduling and batch problems',
      'Data Sufficiency tests whether information suffices, not the final answer',
      'Evaluate each data sufficiency statement independently, then combined',
    ],
  },

  'algebra-gmat': {
    topicId: 'algebra-gmat',
    title: 'Algebra',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Equations and Business Applications',
        content: `**Linear equations**: Model relationships like cost = fixed cost + (variable cost × units).

**Systems of equations**: Solve for two unknowns, such as price and quantity, given two conditions.

**Inequalities**: Model constraints like budget limits or minimum production requirements.`,
      },
      {
        heading: 'Quadratics and Functions',
        content: `**Quadratic formula**: x = (-b ± √(b² - 4ac)) / 2a, used in problems modeling area, revenue optimization, or projectile-style scenarios.

**Functions**: f(x) notation models business relationships (e.g., profit as a function of units sold).

**GMAT tip**: Many algebra word problems can be solved faster by setting up an equation directly from the scenario rather than testing answer choices.`,
      },
    ],
    keyPoints: [
      'Linear equations often model cost = fixed + variable × units',
      'Systems of equations solve for two related unknowns',
      'Inequalities model business constraints like budgets',
      'Quadratic formula: x = (-b ± √(b²-4ac)) / 2a',
      'Set up equations directly from word problems rather than guessing answers',
    ],
  },

  'geometry-gmat': {
    topicId: 'geometry-gmat',
    title: 'Geometry',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Shapes and Formulas',
        content: `**Triangles**: Angle sum = 180°. Pythagorean theorem: a² + b² = c².

**Circles**: Circumference = 2πr. Area = πr².

**Rectangles/Quadrilaterals**: Area = length × width. Perimeter = 2(length + width).`,
      },
      {
        heading: 'Coordinate Geometry and 3D Figures',
        content: `**Coordinate geometry**: Slope = (y2-y1)/(x2-x1). Distance = √[(x2-x1)² + (y2-y1)²].

**3D figures**: Rectangular prism volume = l × w × h. Cylinder volume = πr²h.

**GMAT tip**: Diagrams are not necessarily drawn to scale — rely on given values and geometric principles, not visual estimation.`,
      },
    ],
    keyPoints: [
      'Triangle angle sum is 180°; use the Pythagorean theorem for right triangles',
      'Circle circumference = 2πr; area = πr²',
      'Slope = rise/run; distance formula derives from the Pythagorean theorem',
      'Common volume formulas: rectangular prism = lwh, cylinder = πr²h',
      'GMAT diagrams may not be drawn to scale — trust given values',
    ],
  },

  'word-problems': {
    topicId: 'word-problems',
    title: 'Word Problems',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Translating Words into Equations',
        content: `**Rate problems**: distance = rate × time. Work problems: combined rate = 1/time1 + 1/time2.

**Mixture problems**: Set up equations balancing concentrations or quantities from different sources.

**Business scenarios**: Profit = revenue − cost. Revenue = price × quantity sold.`,
      },
      {
        heading: 'Strategy for Complex Word Problems',
        content: `1. Identify what the question is actually asking for (the unknown variable)
2. Assign variables to unknowns and translate each sentence into an equation
3. Solve the system, then check that the answer makes sense in context (e.g., time/quantities should be positive)

**GMAT tip**: Business word problems often involve multiple steps (calculate cost, then profit, then percentage) — work through each step methodically.`,
      },
    ],
    keyPoints: [
      'Rate problems: distance = rate × time',
      'Work problems: combined rate = 1/time1 + 1/time2',
      'Profit = revenue − cost; revenue = price × quantity',
      'Assign variables and translate each sentence into an equation systematically',
      'Verify final answers make sense in context (positive values, reasonable magnitudes)',
    ],
  },

  'reading-comp-gmat': {
    topicId: 'reading-comp-gmat',
    title: 'Reading Comprehension',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'GMAT Reading Comprehension Strategy',
        content: `GMAT passages are drawn from business, economics, science, and social science, often presenting a claim and evaluating evidence for or against it.

**Strategy**:
1. Identify the passage's primary purpose and main idea after the first read
2. Note the passage's structure: does it present a problem then a solution? A claim then a critique?
3. For detail questions, always verify against the specific line in the passage`,
      },
      {
        heading: 'Question Types',
        content: `**Main idea questions**: Ask for the overall purpose or central argument.

**Inference questions**: Require reasoning beyond explicit statements, but must be strongly supported by the text.

**Structure/function questions**: Ask how a specific sentence or paragraph functions within the passage's argument.

**Strengthen/weaken questions**: Ask which new information would support or undermine a claim made in the passage.`,
      },
    ],
    keyPoints: [
      'Identify the passage\'s main idea and purpose before answering detail questions',
      'Track the passage\'s structure (problem/solution, claim/critique)',
      'Inference answers must be strongly supported by the text, not just plausible',
      'Structure questions ask about function, not just content',
      'Always verify detail answers against the specific line in the passage',
    ],
  },

  'critical-reasoning': {
    topicId: 'critical-reasoning',
    title: 'Critical Reasoning',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Analyzing Arguments',
        content: `GMAT Critical Reasoning questions present a short argument and ask you to strengthen, weaken, evaluate, or identify assumptions within it.

**Strategy**:
1. Identify the argument's conclusion and the premises (evidence) supporting it
2. Identify the assumption — the unstated link between premises and conclusion
3. For "strengthen" questions, look for an answer that supports the assumption
4. For "weaken" questions, look for an answer that attacks the assumption directly`,
      },
      {
        heading: 'Common Question Types',
        content: `**Assumption questions**: Ask what must be true for the argument's conclusion to logically follow.

**Strengthen/weaken questions**: Ask which new fact would make the conclusion more or less likely to be true.

**Flaw questions**: Ask you to identify the logical error in the argument's reasoning.

**Inference questions**: Ask what can be logically concluded from the given statements (different from strengthen/weaken, which involve new information).`,
      },
    ],
    keyPoints: [
      'Identify the argument\'s conclusion and its supporting premises',
      'Find the unstated assumption connecting premises to the conclusion',
      'Strengthen answers support the assumption; weaken answers attack it',
      'Flaw questions ask you to name the logical error in the reasoning',
      'Inference questions require what MUST be true, not just what\'s plausible',
    ],
  },

  'sentence-correction': {
    topicId: 'sentence-correction',
    title: 'Sentence Correction',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'GMAT Sentence Correction Strategy',
        content: `GMAT Sentence Correction presents a sentence with an underlined portion and five answer choices (the first repeats the original) to select the best version.

**Strategy**:
1. Read the full sentence first to understand its intended meaning
2. Check for grammar issues: subject-verb agreement, pronoun clarity, parallel structure, verb tense
3. Eliminate answers that introduce new errors, even if they fix the original one
4. The best answer is grammatically correct, clear, and concise — not necessarily the shortest`,
      },
      {
        heading: 'Common Tested Errors',
        content: `**Subject-verb agreement**: Verify the verb matches its true subject, especially with intervening phrases.

**Parallel structure**: Items in a list or comparison must share the same grammatical form.

**Modifier placement**: Modifying phrases must clearly and logically refer to the correct noun.

**Pronoun ambiguity**: Pronouns must have a single, clear antecedent.

**Comparison logic**: Ensure comparisons are between logically equivalent things (e.g., "the company's profits" vs. "its competitor," not vs. "the competitor's factory").`,
      },
    ],
    keyPoints: [
      'Read the full sentence to understand its intended meaning before choosing',
      'Check subject-verb agreement, especially with intervening phrases',
      'Verify parallel structure in lists and comparisons',
      'Ensure modifiers clearly refer to the correct noun',
      'Comparisons must be between logically equivalent things',
    ],
  },
};

// ==================== SHSAT READING MATERIALS ====================

export const SHSAT_MATERIALS: Record<string, ReadingMaterial> = {
  'reading-ela': {
    topicId: 'reading-ela',
    title: 'Reading Comprehension',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Approaching SHSAT Reading Passages',
        content: `SHSAT reading passages cover fiction, nonfiction, poetry, and paired passages, testing your ability to understand and analyze text.

**Strategy**:
1. Read the passage actively, noting the main idea and author's purpose
2. For detail questions, locate the exact line in the passage rather than relying on memory
3. For vocabulary-in-context questions, use the surrounding sentence to determine meaning, not just the dictionary definition`,
      },
      {
        heading: 'Common Question Types',
        content: `**Main idea questions**: Ask for the central theme or purpose of the passage.

**Inference questions**: Require reasoning beyond what's directly stated, but must be supported by evidence in the text.

**Vocabulary-in-context questions**: Ask what a word means based on how it's used in the passage.

**Author's purpose/tone questions**: Ask why the author wrote the passage or what attitude they convey.`,
      },
    ],
    keyPoints: [
      'Identify the main idea and author\'s purpose while reading actively',
      'Locate exact lines in the passage for detail questions',
      'Use context, not just dictionary definitions, for vocabulary questions',
      'Inference answers must be supported by evidence in the text',
      'Consider author\'s tone and purpose for interpretation questions',
    ],
  },

  'editing-ela': {
    topicId: 'editing-ela',
    title: 'Editing in Context',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Grammar and Sentence Structure',
        content: `SHSAT Editing questions test grammar, punctuation, and sentence structure within the context of a passage.

**Common issues tested**:
1. Subject-verb agreement: the verb must match its true subject
2. Run-on sentences and comma splices: two independent clauses need proper punctuation (period, semicolon, or comma + conjunction)
3. Sentence fragments: every sentence needs a subject and a complete verb
4. Pronoun-antecedent agreement: pronouns must match their noun in number`,
      },
      {
        heading: 'Revision Strategy',
        content: `**Combining sentences**: Some questions ask you to combine two short sentences into one clear, concise sentence.

**Improving clarity**: Look for wordy or awkward phrasing that could be simplified without losing meaning.

**Maintaining consistency**: Verb tense and point of view should remain consistent throughout a passage unless there's a clear reason to shift.`,
      },
    ],
    keyPoints: [
      'Match verbs to their true subject for subject-verb agreement',
      'Fix run-on sentences and comma splices with proper punctuation',
      'Ensure every sentence has a subject and complete verb (no fragments)',
      'Pronouns must agree in number with their antecedent',
      'Maintain consistent verb tense and point of view throughout',
    ],
  },

  'numbers-operations': {
    topicId: 'numbers-operations',
    title: 'Numbers & Operations',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Basic Arithmetic and Fractions',
        content: `**Order of operations (PEMDAS)**: Parentheses, Exponents, Multiplication/Division (left to right), Addition/Subtraction (left to right).

**Fractions**: Find common denominators to add/subtract. Multiply numerators and denominators directly to multiply. Multiply by the reciprocal to divide.

**Decimals and percentages**: Percent means "per hundred" — 25% = 0.25 = 25/100.`,
      },
      {
        heading: 'Number Properties',
        content: `**Factors and multiples**: A factor divides evenly into a number; a multiple is the product of a number and an integer.

**Prime numbers**: A number greater than 1 with exactly two factors: 1 and itself (2, 3, 5, 7, 11...).

**Absolute value**: |x| represents distance from zero, always non-negative.`,
      },
    ],
    keyPoints: [
      'PEMDAS determines the order of operations',
      'Find common denominators to add/subtract fractions',
      'Percent means "per hundred" (25% = 0.25)',
      'Prime numbers have exactly two factors: 1 and themselves',
      'Absolute value is always non-negative',
    ],
  },

  'algebra-shsat': {
    topicId: 'algebra-shsat',
    title: 'Algebra',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Solving Basic Equations',
        content: `To solve for a variable, isolate it using inverse operations, performing the same operation on both sides.

**Example**: 2x + 3 = 11 → 2x = 8 → x = 4

**Evaluating expressions**: Substitute given values for variables, then apply order of operations.`,
      },
      {
        heading: 'Expressions and Simple Inequalities',
        content: `**Combining like terms**: Only terms with the same variable and exponent can be combined (3x + 2x = 5x).

**Inequalities**: Solve like equations, but flip the inequality sign when multiplying or dividing by a negative number.

**Word problems**: Translate phrases like "5 more than a number" into x + 5, and "3 times a number" into 3x.`,
      },
    ],
    keyPoints: [
      'Isolate the variable using inverse operations on both sides',
      'Only combine terms with the same variable and exponent',
      'Flip the inequality sign when multiplying/dividing by a negative',
      'Translate word problems carefully into algebraic expressions',
      'Substitute values step-by-step, following order of operations',
    ],
  },

  'geometry-shsat': {
    topicId: 'geometry-shsat',
    title: 'Geometry',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Shapes, Angles, and Area',
        content: `**Triangle angle sum**: The interior angles of any triangle sum to 180°.

**Area formulas**: Rectangle = length × width. Triangle = (1/2) × base × height. Circle = πr².

**Perimeter/Circumference**: Rectangle perimeter = 2(length + width). Circle circumference = 2πr.`,
      },
      {
        heading: 'The Pythagorean Theorem and Volume',
        content: `**Pythagorean theorem**: a² + b² = c² for right triangles, where c is the hypotenuse (the longest side, opposite the right angle).

**Volume formulas**: Rectangular prism = length × width × height. Cube = side³.

**Coordinate geometry basics**: Points are graphed as (x, y); distance and midpoint can be found using their coordinates.`,
      },
    ],
    keyPoints: [
      'Triangle angles always sum to 180°',
      'Rectangle area = length × width; triangle area = (1/2) × base × height',
      'Circle area = πr²; circumference = 2πr',
      'Pythagorean theorem: a² + b² = c² for right triangles',
      'Rectangular prism volume = length × width × height',
    ],
  },

  'statistics-shsat': {
    topicId: 'statistics-shsat',
    title: 'Statistics & Probability',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'Measures of Central Tendency',
        content: `**Mean**: Sum of all values divided by the number of values.

**Median**: The middle value when data is sorted (average of two middle values if count is even).

**Mode**: The most frequently occurring value in a data set.

**Range**: The difference between the maximum and minimum values.`,
      },
      {
        heading: 'Basic Probability',
        content: `**Probability formula**: P(event) = number of favorable outcomes / total number of possible outcomes.

**Simple probability examples**: Rolling a die, flipping a coin, or picking a marble from a bag.

**Reading data displays**: Bar graphs, pictographs, and tables are common ways probability and statistics questions present data on the SHSAT.`,
      },
    ],
    keyPoints: [
      'Mean = sum of values ÷ number of values',
      'Median is the middle value when data is sorted',
      'Mode is the most frequently occurring value',
      'Probability = favorable outcomes ÷ total possible outcomes',
      'Practice reading bar graphs, pictographs, and tables carefully',
    ],
  },
};

// ==================== REGENTS READING MATERIALS ====================

export const REGENTS_MATERIALS: Record<string, ReadingMaterial> = {
  literature: {
    topicId: 'literature',
    title: 'Literature & Comprehension',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Approaching Regents Literature Passages',
        content: `The NY Regents ELA exam tests literary analysis through fiction, poetry, and nonfiction passages, often paired for comparison.

**Strategy**:
1. Identify the central theme, characters' motivations, and literary devices used
2. For paired passages, note similarities and differences in the authors' approaches or perspectives
3. Support all interpretations with specific textual evidence`,
      },
      {
        heading: 'Literary Devices and Analysis',
        content: `**Common devices**: Metaphor, simile, imagery, symbolism, foreshadowing, and irony all shape a text's meaning and tone.

**Theme vs. plot**: The theme is the underlying message or insight about life; the plot is simply the sequence of events.

**Author's craft questions**: Ask why an author made a specific stylistic choice (word choice, structure, point of view) and its effect on the reader.`,
      },
    ],
    keyPoints: [
      'Identify theme, character motivation, and literary devices while reading',
      'Compare and contrast paired passages for similarities and differences',
      'Support interpretations with specific textual evidence',
      'Distinguish theme (underlying message) from plot (sequence of events)',
      'Consider why an author made specific stylistic choices and their effects',
    ],
  },

  'writing-regents': {
    topicId: 'writing-regents',
    title: 'Writing & Composition',
    estimatedReadTime: 20,
    sections: [
      {
        heading: 'The Regents Argument Essay',
        content: `The NY Regents ELA exam requires a text-based argument essay, responding to given source texts on a debatable topic.

**Strategy**:
1. Read all source texts carefully, noting key claims and evidence
2. Develop a clear, defensible thesis responding to the prompt
3. Use specific evidence and quotations from the provided texts to support your argument
4. Address a counterclaim to strengthen your position`,
      },
      {
        heading: 'Organization and Style',
        content: `**Structure**: Introduction with thesis, body paragraphs each focused on one supporting point, and a conclusion that reinforces your argument.

**Citing sources**: Reference which text supports each point (e.g., "According to Source 2...").

**Style**: Maintain a formal, academic tone throughout, avoiding casual language or first-person opinions stated without support.`,
      },
    ],
    keyPoints: [
      'Read all source texts carefully before forming your thesis',
      'Develop a clear, defensible argument responding to the prompt',
      'Support claims with specific evidence and quotations from the texts',
      'Address a counterclaim to strengthen your argument',
      'Maintain a formal, academic tone throughout the essay',
    ],
  },

  'algebra-i': {
    topicId: 'algebra-i',
    title: 'Algebra I',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Equations, Functions, and Polynomials',
        content: `**Linear equations**: Isolate the variable using inverse operations. Systems of equations can be solved via substitution or elimination.

**Functions**: f(x) notation represents a rule applied to an input x. The domain is the set of valid inputs; the range is the set of possible outputs.

**Polynomials**: Combine like terms to simplify. Factor by finding common factors or using techniques like the "two numbers" method for trinomials.`,
      },
      {
        heading: 'Graphing and Interpreting Functions',
        content: `**Slope-intercept form**: y = mx + b, where m is the slope and b is the y-intercept.

**Quadratic functions**: Graph as parabolas; the vertex represents the maximum or minimum point.

**Regents tip**: Many questions ask you to interpret a real-world scenario modeled by a function — focus on what the variables represent in context.`,
      },
    ],
    keyPoints: [
      'Isolate variables using inverse operations to solve linear equations',
      'Functions have a domain (inputs) and range (outputs)',
      'Factor polynomials by finding common factors or trinomial patterns',
      'Slope-intercept form: y = mx + b',
      'Quadratic functions graph as parabolas with a vertex (max/min point)',
    ],
  },

  'geometry-regents': {
    topicId: 'geometry-regents',
    title: 'Geometry',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Proofs, Angles, and Triangles',
        content: `**Geometric proofs**: Use given information, definitions, postulates, and theorems to logically justify each statement about a figure.

**Angle relationships**: Vertical angles are equal. Complementary angles sum to 90°; supplementary angles sum to 180°.

**Triangle congruence**: Triangles can be proven congruent using SSS, SAS, ASA, AAS, or HL (for right triangles).`,
      },
      {
        heading: 'Coordinate Geometry and Circles',
        content: `**Coordinate geometry**: Use slope, distance, and midpoint formulas to prove properties of figures (e.g., proving a quadrilateral is a parallelogram).

**Circle theorems**: Central angles equal their intercepted arc; inscribed angles equal half their intercepted arc.

**Regents tip**: Two-column proofs require a statement and a justification (reason) for every step — never skip the reasoning.`,
      },
    ],
    keyPoints: [
      'Geometric proofs require logical justification for each statement',
      'Vertical angles are equal; complementary angles sum to 90°, supplementary to 180°',
      'Triangle congruence: SSS, SAS, ASA, AAS, or HL',
      'Inscribed angles equal half their intercepted arc',
      'Two-column proofs need both a statement and a reason for every step',
    ],
  },

  'algebra-ii': {
    topicId: 'algebra-ii',
    title: 'Algebra II',
    estimatedReadTime: 30,
    sections: [
      {
        heading: 'Advanced Functions',
        content: `**Quadratic functions**: Solve using factoring, completing the square, or the quadratic formula: x = (-b ± √(b²-4ac)) / 2a.

**Exponential functions**: Model growth/decay as y = a(b)^x, where b > 1 represents growth and 0 < b < 1 represents decay.

**Logarithms**: The inverse of exponential functions; log_b(x) = y means b^y = x.`,
      },
      {
        heading: 'Sequences and Series',
        content: `**Arithmetic sequences**: Each term increases by a constant difference (d). The nth term: a_n = a_1 + (n-1)d.

**Geometric sequences**: Each term is multiplied by a constant ratio (r). The nth term: a_n = a_1 × r^(n-1).

**Regents tip**: Word problems often model real situations (population growth, interest, depreciation) using these sequence/function types — identify which type applies before solving.`,
      },
    ],
    keyPoints: [
      'Quadratic formula: x = (-b ± √(b²-4ac)) / 2a',
      'Exponential functions: y = a(b)^x, where b>1 is growth, 0<b<1 is decay',
      'Logarithms are the inverse of exponential functions',
      'Arithmetic sequences add a constant difference; geometric sequences multiply by a constant ratio',
      'Identify which function/sequence type models a word problem before solving',
    ],
  },

  'living-environment': {
    topicId: 'living-environment',
    title: 'Living Environment',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Cell Biology and Genetics',
        content: `**Cell organelles**: Mitochondria produce energy (ATP); ribosomes synthesize proteins; the nucleus contains genetic material.

**DNA and heredity**: Genes code for traits via proteins. Dominant alleles mask recessive alleles in heterozygous individuals (Punnett squares model inheritance).

**Cell division**: Mitosis creates identical cells for growth/repair; meiosis creates genetically diverse gametes for reproduction.`,
      },
      {
        heading: 'Ecology and Homeostasis',
        content: `**Ecosystems**: Energy flows from producers to consumers through food chains/webs, with only about 10% transferred between levels.

**Homeostasis**: The maintenance of stable internal conditions (temperature, pH, water balance) despite external changes.

**Evolution**: Natural selection favors traits that improve survival/reproduction, driving change in populations over generations.`,
      },
    ],
    keyPoints: [
      'Mitochondria produce energy; ribosomes make proteins; the nucleus holds DNA',
      'Dominant alleles mask recessive alleles in heterozygous individuals',
      'Mitosis creates identical cells; meiosis creates diverse gametes',
      'Only about 10% of energy transfers between trophic levels',
      'Natural selection favors traits improving survival and reproduction',
    ],
  },

  'earth-science-regents': {
    topicId: 'earth-science-regents',
    title: 'Earth Science',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Geology and Plate Tectonics',
        content: `**Rock cycle**: Igneous (cooled magma/lava), sedimentary (compacted sediment), and metamorphic (heat/pressure transformed) rocks continuously convert into one another.

**Plate tectonics**: Earth's crust is divided into moving plates. Convergent boundaries can cause subduction/mountain building; divergent boundaries create new crust; transform boundaries cause earthquakes.`,
      },
      {
        heading: 'Weather, Climate, and Astronomy',
        content: `**Weather vs. climate**: Weather is short-term atmospheric conditions; climate is the long-term average pattern.

**Astronomy**: Earth's tilt causes seasons; the Moon's orbit causes phases and tides.

**Regents tip**: Many questions use reference tables (provided during the exam) for data like mineral properties, weather map symbols, and geologic time — practice reading these tables efficiently.`,
      },
    ],
    keyPoints: [
      'Rock cycle: igneous, sedimentary, and metamorphic rocks continuously convert',
      'Plate tectonics: convergent, divergent, and transform boundaries have different effects',
      'Weather is short-term; climate is long-term average patterns',
      'Earth\'s axial tilt causes seasons; the Moon\'s orbit causes phases and tides',
      'Practice reading Earth Science reference tables efficiently',
    ],
  },

  'physical-science': {
    topicId: 'physical-science',
    title: 'Physical Science',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Physics Fundamentals',
        content: `**Newton's laws**: An object at rest/motion stays that way unless acted on by force (1st law). F=ma (2nd law). Equal/opposite reactions (3rd law).

**Energy**: Kinetic energy = (1/2)mv². Potential energy = mgh. Energy is conserved in closed systems.

**Waves**: Wave speed = frequency × wavelength.`,
      },
      {
        heading: 'Chemistry Fundamentals',
        content: `**Atomic structure**: Protons (positive) and neutrons (neutral) are in the nucleus; electrons (negative) orbit it. Atomic number = number of protons.

**Chemical bonding**: Ionic bonds transfer electrons (metal + nonmetal); covalent bonds share electrons (nonmetal + nonmetal).

**Chemical reactions**: Balanced equations follow the law of conservation of mass — atoms are neither created nor destroyed.`,
      },
    ],
    keyPoints: [
      'Newton\'s three laws describe the relationship between force and motion',
      'Kinetic energy = (1/2)mv²; potential energy = mgh',
      'Atomic number is determined by the number of protons',
      'Ionic bonds transfer electrons; covalent bonds share electrons',
      'Chemical equations must be balanced per conservation of mass',
    ],
  },

  'global-history': {
    topicId: 'global-history',
    title: 'Global History & Geography',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Major Historical Themes',
        content: `**Ancient civilizations**: Mesopotamia, Egypt, China, and the Indus Valley developed early writing, agriculture, and governance systems along major rivers.

**Trade and cultural exchange**: The Silk Road connected East and West, spreading goods, religions, and ideas across Eurasia.

**Revolutions**: The French, American, Russian, and other revolutions reshaped political systems, often driven by Enlightenment ideas about rights and governance.`,
      },
      {
        heading: 'Document-Based Analysis',
        content: `**DBQ strategy**: Analyze each document for its main point, author's perspective, and historical context (who wrote it, when, and why).

**Point of view**: Consider potential bias based on the author's background, position, or purpose in creating the document.

**Regents tip**: Always connect specific document evidence to your broader historical argument rather than just summarizing each document.`,
      },
    ],
    keyPoints: [
      'Early civilizations developed along major rivers (Nile, Tigris-Euphrates, etc.)',
      'The Silk Road facilitated trade and cultural exchange across Eurasia',
      'Enlightenment ideas influenced major political revolutions',
      'Analyze documents for main point, perspective, and historical context',
      'Connect document evidence directly to your broader historical argument',
    ],
  },

  'us-history': {
    topicId: 'us-history',
    title: 'US History & Government',
    estimatedReadTime: 25,
    sections: [
      {
        heading: 'Foundations and Constitutional Government',
        content: `**Constitution**: Establishes three branches of government (legislative, executive, judicial) with checks and balances to prevent any one branch from gaining too much power.

**Bill of Rights**: The first ten amendments protect individual liberties, including freedom of speech, religion, and due process.

**Federalism**: Power is divided between the federal government and state governments.`,
      },
      {
        heading: 'Major Historical Eras',
        content: `**Civil War and Reconstruction**: The conflict over slavery and states' rights led to war (1861-1865) and subsequent amendments (13th, 14th, 15th) expanding rights.

**Progressive Era and New Deal**: Responses to industrialization's problems and the Great Depression expanded the federal government's role in regulating the economy.

**Civil Rights Movement**: Activism in the 1950s-60s led to landmark legislation ending legal segregation and protecting voting rights.`,
      },
    ],
    keyPoints: [
      'The Constitution establishes three branches with checks and balances',
      'The Bill of Rights protects individual liberties (speech, religion, due process)',
      'Federalism divides power between federal and state governments',
      'The Civil War led to the 13th, 14th, and 15th Amendments',
      'The Civil Rights Movement led to landmark legislation ending legal segregation',
    ],
  },
};

// Helper function to get materials for an exam
export function getMaterialsByExamId(examId: string): Record<string, ReadingMaterial> {
  const materialsMap: Record<string, Record<string, ReadingMaterial>> = {
    sat: SAT_MATERIALS,
    act: ACT_MATERIALS,
    gre: GRE_MATERIALS,
    gmat: GMAT_MATERIALS,
    shsat: SHSAT_MATERIALS,
    regents: REGENTS_MATERIALS,
  };

  return materialsMap[examId] || SAT_MATERIALS;
}

// Get a single material by exam and topic
export function getMaterialByExamAndTopic(examId: string, topicId: string): ReadingMaterial | null {
  const materials = getMaterialsByExamId(examId);
  return materials[topicId] || null;
}
