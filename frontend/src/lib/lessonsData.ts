/**
 * Learn 2.0 — Hand-authored pilot lesson content (SAT Math: Algebra).
 * Deterministic and versioned — the AI Tutor never invents this content, it only
 * helps explain it differently (see TutorDrawer / ai_assistant_service context).
 */
import { TopicLesson } from '@/types/curriculum';

const LESSON_LINEAR_EQUATIONS: TopicLesson = {
  id: 'lesson-linear-equations',
  topicId: 'algebra',
  examId: 'sat',
  version: 1,
  estimatedMinutes: 8,
  objectiveIds: ['obj-linear-equations-solve', 'obj-linear-equations-systems'],
  steps: [
    {
      stepNumber: 1,
      title: 'What a linear equation represents',
      contentMarkdown:
        "A linear equation says two expressions are equal, where the variable is only raised to the first power. On the SAT, you'll mostly solve for one variable, or find where two lines intersect.\n\nThe goal is always the same: **isolate the variable** by doing the same operation to both sides.",
      workedExample: {
        problem: 'Solve for $x$: $3x + 5 = 20$',
        stepByStepSolution: [
          'Subtract 5 from both sides: $3x = 15$',
          'Divide both sides by 3: $x = 5$',
        ],
        takeaway: 'Undo operations in reverse order: addition/subtraction first, then multiplication/division.',
      },
      checkQuestion: {
        id: 'mq-linear-1',
        question: 'Solve for $x$: $2x - 4 = 10$',
        options: ['$x = 3$', '$x = 5$', '$x = 7$', '$x = 14$'],
        correctIndex: 2,
        explanation: 'Add 4 to both sides: $2x = 14$. Divide by 2: $x = 7$.',
        conceptTrap: 'Divided by 2 before adding 4, or forgot to add 4 at all.',
      },
    },
    {
      stepNumber: 2,
      title: 'Systems of linear equations',
      contentMarkdown:
        'When two linear equations share the same variables, their solution is the point where both are true at once — graphically, where the two lines cross.\n\nThe SAT usually wants **substitution** (solve one equation for a variable, plug into the other) or **elimination** (add/subtract equations to cancel a variable).',
      workedExample: {
        problem: 'Solve the system: $y = 2x + 1$ and $3x + y = 11$',
        stepByStepSolution: [
          'Substitute $y = 2x + 1$ into the second equation: $3x + (2x + 1) = 11$',
          'Combine like terms: $5x + 1 = 11$',
          'Solve: $5x = 10$, so $x = 2$',
          'Back-substitute: $y = 2(2) + 1 = 5$',
        ],
        takeaway: 'Substitution works best when one equation is already solved for a variable.',
      },
      checkQuestion: {
        id: 'mq-linear-2',
        question: 'Using substitution, what is $x$ if $y = x + 3$ and $2x + y = 12$?',
        options: ['$x = 3$', '$x = 4.5$', '$x = 5$', '$x = 6$'],
        correctIndex: 0,
        explanation: '$2x + (x+3) = 12 \\Rightarrow 3x + 3 = 12 \\Rightarrow 3x = 9 \\Rightarrow x = 3$.',
        conceptTrap: 'Forgot to combine $2x$ and the substituted $x$ term before solving.',
      },
    },
  ],
  remediationPrompts: {
    1: 'The student got a linear equation wrong. Walk through isolating the variable one operation at a time, and ask them what operation should be undone first.',
    2: 'The student struggled with substitution in a system of equations. Ask them which equation is already solved for a variable, and guide them to substitute it into the other equation.',
  },
};

const LESSON_QUADRATIC_FUNCTIONS: TopicLesson = {
  id: 'lesson-quadratic-functions',
  topicId: 'algebra',
  examId: 'sat',
  version: 1,
  estimatedMinutes: 10,
  objectiveIds: ['obj-quadratics-factor', 'obj-quadratics-formula'],
  steps: [
    {
      stepNumber: 1,
      title: 'Factoring quadratics',
      contentMarkdown:
        'A quadratic is any equation of the form $ax^2 + bx + c = 0$. Factoring finds two numbers that multiply to $c$ and add to $b$ (when $a=1$), turning the equation into two simple linear equations.',
      workedExample: {
        problem: 'Solve: $x^2 + 5x + 6 = 0$',
        stepByStepSolution: [
          'Find two numbers that multiply to 6 and add to 5: 2 and 3',
          'Factor: $(x + 2)(x + 3) = 0$',
          'Set each factor to zero: $x = -2$ or $x = -3$',
        ],
        takeaway: 'Factoring turns one quadratic into two easy linear equations.',
      },
      checkQuestion: {
        id: 'mq-quad-1',
        question: 'What are the solutions to $x^2 - 7x + 12 = 0$?',
        options: ['$x = 3, 4$', '$x = -3, -4$', '$x = 2, 6$', '$x = 1, 12$'],
        correctIndex: 0,
        explanation: 'Need two numbers multiplying to 12, adding to -7: -3 and -4. So $(x-3)(x-4)=0 \\Rightarrow x = 3, 4$.',
        conceptTrap: 'Mixed up the sign of the roots relative to the factors.',
      },
    },
    {
      stepNumber: 2,
      title: 'The quadratic formula',
      contentMarkdown:
        "When a quadratic doesn't factor nicely, the quadratic formula always works:\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\nPlug in $a$, $b$, and $c$ directly from $ax^2+bx+c=0$.",
      workedExample: {
        problem: 'Solve: $2x^2 + 3x - 2 = 0$',
        stepByStepSolution: [
          'Identify $a=2$, $b=3$, $c=-2$',
          'Discriminant: $b^2-4ac = 9 - 4(2)(-2) = 9+16=25$',
          '$x = \\frac{-3 \\pm \\sqrt{25}}{4} = \\frac{-3 \\pm 5}{4}$',
          'So $x = 0.5$ or $x = -2$',
        ],
        takeaway: 'The discriminant ($b^2-4ac$) tells you how many real solutions exist before you even finish solving.',
      },
      checkQuestion: {
        id: 'mq-quad-2',
        question: 'For $x^2 + 4x + 4 = 0$, what does the discriminant tell you?',
        options: [
          'Two distinct real solutions',
          'Exactly one real solution (a repeated root)',
          'No real solutions',
          'Cannot be determined',
        ],
        correctIndex: 1,
        explanation: '$b^2-4ac = 16 - 16 = 0$. A discriminant of 0 means exactly one repeated real root.',
        conceptTrap: 'Assumed a positive-looking equation always has two distinct roots.',
      },
    },
  ],
  remediationPrompts: {
    1: 'The student got a factoring question wrong. Ask them what two numbers multiply to c and add to b, and check their sign work.',
    2: 'The student misapplied the quadratic formula or discriminant. Walk through identifying a, b, c and recomputing the discriminant with them step by step.',
  },
};

const LESSON_EXPONENTS: TopicLesson = {
  id: 'lesson-exponents',
  topicId: 'algebra',
  examId: 'sat',
  version: 1,
  estimatedMinutes: 7,
  objectiveIds: ['obj-exponents-rules'],
  steps: [
    {
      stepNumber: 1,
      title: 'Core exponent rules',
      contentMarkdown:
        'Three rules cover almost every SAT exponent question:\n\n- **Product rule**: $x^a \\cdot x^b = x^{a+b}$\n- **Quotient rule**: $\\frac{x^a}{x^b} = x^{a-b}$\n- **Power rule**: $(x^a)^b = x^{ab}$\n\nAny negative exponent means "reciprocal": $x^{-a} = \\frac{1}{x^a}$.',
      workedExample: {
        problem: 'Simplify: $\\frac{x^5 \\cdot x^2}{x^3}$',
        stepByStepSolution: [
          'Apply the product rule to the numerator: $x^5 \\cdot x^2 = x^7$',
          'Apply the quotient rule: $\\frac{x^7}{x^3} = x^{7-3} = x^4$',
        ],
        takeaway: 'Combine the numerator first, then divide — never subtract exponents across a plus sign.',
      },
      checkQuestion: {
        id: 'mq-exp-1',
        question: 'Simplify: $(x^3)^2 \\cdot x^{-1}$',
        options: ['$x^5$', '$x^6$', '$x^7$', '$x^{-6}$'],
        correctIndex: 0,
        explanation: '$(x^3)^2 = x^6$. Then $x^6 \\cdot x^{-1} = x^{6-1} = x^5$.',
        conceptTrap: 'Forgot that multiplying by a negative exponent subtracts, not adds.',
      },
    },
  ],
  remediationPrompts: {
    1: 'The student misapplied an exponent rule. Ask them to identify whether the operation is a product, quotient, or power, and apply that single rule at a time before combining.',
  },
};

export const SAT_MATH_LESSONS: TopicLesson[] = [
  LESSON_LINEAR_EQUATIONS,
  LESSON_QUADRATIC_FUNCTIONS,
  LESSON_EXPONENTS,
];

const ALL_LESSONS: Record<string, TopicLesson> = Object.fromEntries(
  SAT_MATH_LESSONS.map((lesson) => [lesson.id, lesson])
);

export function getLessonById(lessonId: string): TopicLesson | undefined {
  return ALL_LESSONS[lessonId];
}

export function getLessonsForTopic(examId: string, topicId: string): TopicLesson[] {
  return SAT_MATH_LESSONS.filter((l) => l.examId === examId && l.topicId === topicId);
}
