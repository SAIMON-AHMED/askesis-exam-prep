# Askesis — Multi-Exam Implementation Guide

## Frontend Architecture & Component Structure

**Document Version:** 1.0  
**Status:** Implementation Specification

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Component Hierarchy](#component-hierarchy)
3. [State Management](#state-management)
4. [Styling Architecture](#styling-architecture)
5. [API Integration Points](#api-integration-points)
6. [Implementation Roadmap](#implementation-roadmap)

---

# Project Structure

## New Frontend Directory Layout

```
frontend/src/
├── app/
│   ├── globals.css (update with exam themes)
│   ├── layout.tsx (add exam context provider)
│   ├── page.tsx (update to show exam selection)
│   ├── exams/
│   │   ├── layout.tsx (exam context wrapper)
│   │   ├── page.tsx (exam selection page)
│   │   └── [examId]/
│   │       ├── layout.tsx (exam dashboard layout)
│   │       ├── page.tsx (exam dashboard)
│   │       ├── curriculum/
│   │       │   └── page.tsx (curriculum map)
│   │       ├── topic/
│   │       │   └── [topicId]/
│   │       │       └── page.tsx (topic learning page)
│   │       ├── practice/
│   │       │   └── page.tsx (practice interface)
│   │       ├── analytics/
│   │       │   └── page.tsx (exam analytics)
│   │       ├── study-plan/
│   │       │   └── page.tsx (exam study plan)
│   │       └── mock-exam/
│   │           └── page.tsx (full-length mock)
│   └── (existing pages migrate here with updates)
│
├── components/
│   ├── Navbar.tsx (update with exam context)
│   ├── exams/
│   │   ├── ExamSelectionCard.tsx
│   │   ├── ExamDashboard.tsx
│   │   ├── CurriculumSection.tsx
│   │   ├── TopicCard.tsx
│   │   └── ExamContextNav.tsx (new: exam-level navigation)
│   ├── learning/
│   │   ├── TopicHeader.tsx
│   │   ├── LearningMaterial.tsx
│   │   ├── WorkedExample.tsx
│   │   └── KeyStrategies.tsx
│   ├── practice/
│   │   ├── QuestionCard.tsx
│   │   ├── AnswerOptions.tsx
│   │   ├── SubmitFeedback.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── QuizCompletion.tsx
│   ├── analytics/
│   │   ├── MetricCard.tsx
│   │   ├── TopicMasteryChart.tsx
│   │   ├── TimePerQuestionChart.tsx
│   │   ├── DifficultyProgressionCard.tsx
│   │   ├── EstimatedScoreCard.tsx
│   │   └── TopicPillCard.tsx
│   ├── study-plan/
│   │   ├── IntensitySelector.tsx
│   │   ├── WeekContainer.tsx
│   │   ├── DayTaskCard.tsx
│   │   └── WeekProgressBar.tsx
│   └── common/
│       ├── DifficultyBadge.tsx
│       ├── ProgressBar.tsx
│       ├── Button.tsx (enhance existing)
│       └── SearchBar.tsx
│
├── lib/
│   ├── api.ts (update with exam endpoints)
│   ├── examThemes.ts (new: exam color configs)
│   ├── hooks.ts (new custom hooks)
│   └── constants.ts (new: exam definitions)
│
├── context/
│   └── ExamContext.tsx (new: selected exam state)
│
└── styles/
    ├── examThemes.css (new: CSS variables for each exam)
    ├── components.css (component-specific styles)
    └── responsive.css (mobile/tablet/desktop)
```

---

# Component Hierarchy

## 1. Exam Selection Page Component Tree

```
ExamSelectionPage
├── SearchBar
├── ExamGrid
│   ├── ExamSelectionCard (x6+)
│   │   ├── ExamIcon
│   │   ├── ExamTitle
│   │   ├── ExamDescription
│   │   ├── ProgressBar
│   │   └── Button (Enter Exam)
│   └── FeaturedExam (Optional)
└── StatsSection
```

### ExamSelectionCard Component

```typescript
interface ExamSelectionCardProps {
  examId: string;
  examName: string;
  description: string;
  icon: string;
  totalQuestions: number;
  estimatedHours: number;
  progressPercent: number;
  lastStudiedDaysAgo?: number;
  onEnterExam: (examId: string) => void;
}

export const ExamSelectionCard: React.FC<ExamSelectionCardProps> = ({
  examId,
  examName,
  description,
  icon,
  totalQuestions,
  estimatedHours,
  progressPercent,
  lastStudiedDaysAgo,
  onEnterExam,
}) => {
  return (
    <div
      className="exam-card card"
      data-exam={examId}
      onClick={() => onEnterExam(examId)}
    >
      <div className="exam-card__icon">{icon}</div>
      <h3 className="exam-card__title">{examName}</h3>
      <p className="exam-card__description">{description}</p>

      <div className="exam-card__stats">
        <span>📊 {totalQuestions.toLocaleString()} Questions</span>
        <span>⏱️ {estimatedHours} Hours Estimated</span>
      </div>

      <div className="exam-card__progress">
        <ProgressBar percent={progressPercent} />
        <span className="progress-text">{progressPercent}% Completed</span>
      </div>

      <button className="btn-primary exam-card__button">
        Enter {examName} →
      </button>
    </div>
  );
};
```

---

## 2. Exam Dashboard Component Tree

```
ExamDashboard
├── ExamDashboardHeader
│   ├── BackButton
│   ├── ExamTitle
│   └── LastStudiedInfo
├── DashboardGrid (2-col desktop, 1-col mobile)
│   ├── LeftColumn
│   │   ├── CurriculumOverview
│   │   │   └── SectionAccordion (x3)
│   │   │       └── TopicCard (x8+)
│   │   └── SearchBar
│   └── RightColumn
│       ├── ExamProgressCard
│       ├── PrimaryCTA
│       ├── QuickActionsGrid
│       │   ├── ActionCard (Practice Mode)
│       │   ├── ActionCard (Timed Exam)
│       │   ├── ActionCard (Mock Exam)
│       │   └── ActionCard (View Analytics)
│       └── SecondaryActions
```

### ExamDashboard Component

```typescript
interface ExamDashboardProps {
  examId: string;
  userProgress?: {
    overallPercent: number;
    sectionProgress: { [key: string]: number };
    lastTopic?: string;
    lastStudiedDate?: Date;
  };
}

export const ExamDashboard: React.FC<ExamDashboardProps> = ({
  examId,
  userProgress,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumData | null>(null);

  useEffect(() => {
    fetchExamCurriculum(examId).then(setCurriculum);
  }, [examId]);

  return (
    <div className="exam-dashboard" data-exam={examId}>
      <header className="exam-dashboard__header">
        <h1>{examId.toUpperCase()} Dashboard</h1>
        <p className="caption">
          Last studied: {userProgress?.lastStudiedDate
            ? getRelativeDate(userProgress.lastStudiedDate)
            : 'Never'}
        </p>
      </header>

      <div className="dashboard-grid">
        <section className="dashboard-grid__left">
          <h2>Curriculum Overview</h2>
          {curriculum?.sections.map((section) => (
            <SectionAccordion
              key={section.id}
              section={section}
              isExpanded={expandedSection === section.id}
              onToggle={() => setExpandedSection(
                expandedSection === section.id ? null : section.id
              )}
            />
          ))}
        </section>

        <section className="dashboard-grid__right">
          <ExamProgressCard
            progress={userProgress?.sectionProgress}
          />
          <PrimaryCTA
            lastTopic={userProgress?.lastTopic}
            onContinue={handleContinue}
          />
          <QuickActionsGrid examId={examId} />
        </section>
      </div>
    </div>
  );
};
```

---

## 3. Practice Interface Component Tree

```
PracticeInterface
├── ProgressIndicator
│   ├── QuestionCounter
│   ├── DifficultyBadge
│   └── ProgressBar
├── QuestionCard
│   └── QuestionText
├── AnswerOptions
│   └── OptionCard (x4)
├── ControlButtons
│   ├── Submit Button
│   ├── Skip Button
│   └── Review Later Button
├── SubmitFeedback (conditional)
│   ├── Correctness Indicator
│   ├── ExplanationBox
│   └── NextButton
└── QuizCompletion (conditional)
    ├── FinalScore
    ├── CategoryBreakdown
    ├── Recommendation
    └── ActionButtons
```

### PracticeInterface Component

```typescript
interface PracticeInterfaceProps {
  topicId: string;
  totalQuestions: number;
  adaptiveMode?: boolean;
}

export const PracticeInterface: React.FC<PracticeInterfaceProps> = ({
  topicId,
  totalQuestions,
  adaptiveMode = true,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [difficulty, setDifficulty] = useState('Beginner');

  useEffect(() => {
    loadQuestions(topicId, { adaptiveMode, difficulty, count: totalQuestions });
  }, [topicId, difficulty]);

  const handleSubmitAnswer = async () => {
    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correctAnswer;

    setAnswers([...answers, {
      questionId: question.id,
      selectedAnswer,
      isCorrect,
      timestamp: Date.now(),
    }]);

    // Adaptive difficulty adjustment
    if (adaptiveMode) {
      if (isCorrect && difficulty !== 'Advanced') {
        setDifficulty((prev) => increaseDifficulty(prev));
      } else if (!isCorrect && difficulty !== 'Beginner') {
        setDifficulty((prev) => decreaseDifficulty(prev));
      }
    }

    setShowFeedback(true);
  };

  if (!questions.length) return <LoadingSpinner />;

  const question = questions[currentQuestion];
  const isLast = currentQuestion === questions.length - 1;

  if (showFeedback && currentQuestion === questions.length - 1) {
    return <QuizCompletion answers={answers} />;
  }

  return (
    <div className="practice-interface">
      <ProgressIndicator
        current={currentQuestion + 1}
        total={totalQuestions}
        difficulty={difficulty}
      />

      <QuestionCard question={question} />

      {!showFeedback ? (
        <>
          <AnswerOptions
            options={question.options}
            selected={selectedAnswer}
            onSelect={setSelectedAnswer}
          />
          <div className="practice-controls">
            <button
              className="btn-primary"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
            >
              Submit Answer
            </button>
            <button className="btn-secondary">Skip Question</button>
          </div>
        </>
      ) : (
        <SubmitFeedback
          question={question}
          selectedAnswer={selectedAnswer}
          isCorrect={selectedAnswer === question.correctAnswer}
          onNext={() => {
            if (isLast) {
              // Show completion
            } else {
              setCurrentQuestion(currentQuestion + 1);
              setSelectedAnswer(null);
              setShowFeedback(false);
            }
          }}
        />
      )}
    </div>
  );
};
```

---

# State Management

## ExamContext (React Context API)

```typescript
interface SelectedExam {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  icon: string;
}

interface ExamContextType {
  selectedExam: SelectedExam | null;
  setSelectedExam: (exam: SelectedExam) => void;
  userProgress: { [examId: string]: ExamProgress };
  updateProgress: (examId: string, progress: Partial<ExamProgress>) => void;
}

export const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedExam, setSelectedExam] = useState<SelectedExam | null>(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem('selectedExam');
    return stored ? JSON.parse(stored) : null;
  });

  const [userProgress, setUserProgress] = useState<{ [key: string]: ExamProgress }>({});

  useEffect(() => {
    // Persist selected exam to localStorage
    if (selectedExam) {
      localStorage.setItem('selectedExam', JSON.stringify(selectedExam));
    }
  }, [selectedExam]);

  const updateProgress = (examId: string, progress: Partial<ExamProgress>) => {
    setUserProgress((prev) => ({
      ...prev,
      [examId]: { ...prev[examId], ...progress },
    }));
  };

  return (
    <ExamContext.Provider value={{
      selectedExam,
      setSelectedExam,
      userProgress,
      updateProgress,
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within ExamProvider');
  }
  return context;
};
```

---

# Styling Architecture

## CSS Variables for Exam Themes

### globals.css (Update)

```css
:root {
  /* Existing colors remain */
  --primary-blue: #3a6ea5;
  --accent-yellow: #f9c74f;

  /* New exam theme system */
  --exam-sat-primary: #4f46e5;
  --exam-sat-accent: #f59e0b;
  --exam-sat-light: #eef2ff;
  --exam-sat-border: #c7d2fe;

  --exam-act-primary: #06b6d4;
  --exam-act-accent: #ec4899;
  --exam-act-light: #ecfdfd;
  --exam-act-border: #a5f3fc;

  --exam-gre-primary: #8b5cf6;
  --exam-gre-accent: #14b8a6;
  --exam-gre-light: #f5f3ff;
  --exam-gre-border: #ddd6fe;

  --exam-gmat-primary: #10b981;
  --exam-gmat-accent: #6366f1;
  --exam-gmat-light: #ecfdf5;
  --exam-gmat-border: #a7f3d0;

  --exam-shsat-primary: #f97316;
  --exam-shsat-accent: #3b82f6;
  --exam-shsat-light: #ffedd5;
  --exam-shsat-border: #fdba74;

  --exam-regents-primary: #dc2626;
  --exam-regents-accent: #fbbf24;
  --exam-regents-light: #fef2f2;
  --exam-regents-border: #fecaca;

  /* Current exam theme (default to SAT) */
  --current-exam-primary: var(--exam-sat-primary);
  --current-exam-accent: var(--exam-sat-accent);
  --current-exam-light: var(--exam-sat-light);
  --current-exam-border: var(--exam-sat-border);
}

/* Exam-specific overrides */
[data-exam="sat"] {
  --current-exam-primary: var(--exam-sat-primary);
  --current-exam-accent: var(--exam-sat-accent);
  --current-exam-light: var(--exam-sat-light);
  --current-exam-border: var(--exam-sat-border);
}

[data-exam="act"] {
  --current-exam-primary: var(--exam-act-primary);
  --current-exam-accent: var(--exam-act-accent);
  --current-exam-light: var(--exam-act-light);
  --current-exam-border: var(--exam-act-border);
}

/* ... repeat for all exams ... */

/* Apply exam colors to components */
.exam-card {
  border-color: var(--current-exam-border);
  background-color: var(--current-exam-light);
}

.btn-primary {
  background-color: var(--current-exam-primary);
  border-color: var(--current-exam-primary);
}

.btn-primary:hover {
  background-color: color-mix(in srgb, var(--current-exam-primary) 85%, black);
}

.progress-bar {
  background: linear-gradient(
    90deg,
    var(--current-exam-primary),
    var(--current-exam-accent)
  );
}

.difficulty-badge.beginner {
  background-color: #d1fae5;
  color: #065f46;
}

.difficulty-badge.intermediate {
  background-color: #fef3c7;
  color: #92400e;
}

.difficulty-badge.advanced {
  background-color: #fee2e2;
  color: #7f1d1d;
}
```

## Component-Specific Styles

### ExamSelectionCard.css

```css
.exam-card {
  width: 100%;
  height: 320px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 300ms ease;
  display: flex;
  flex-direction: column;
}

.exam-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: var(--current-exam-primary);
}

.exam-card__icon {
  font-size: 48px;
  margin-bottom: 16px;
  text-align: left;
}

.exam-card__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--current-exam-primary);
  margin: 0 0 8px 0;
}

.exam-card__description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.exam-card__stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
  margin: 12px 0;
  flex-grow: 1;
}

.exam-card__progress {
  margin-top: auto;
  margin-bottom: 16px;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar::after {
  content: "";
  display: block;
  height: 100%;
  width: var(--progress);
  background: var(--current-exam-primary);
  transition: width 300ms ease;
}

.progress-text {
  font-size: 12px;
  color: var(--current-exam-primary);
  font-weight: 600;
}

.exam-card__button {
  width: 100%;
  height: 44px;
  margin-top: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .exam-card {
    height: auto;
    min-height: 280px;
    padding: 16px;
  }

  .exam-card__icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  .exam-card__title {
    font-size: 18px;
  }

  .exam-card__button {
    height: 40px;
    font-size: 14px;
  }
}
```

---

# API Integration Points

## New Backend Endpoints Required

### Exam Management

```
GET /api/exams
Response: { exams: ExamDefinition[] }

GET /api/exams/:examId
Response: { exam: ExamDetail }

GET /api/exams/:examId/curriculum
Response: { sections: CurriculumSection[] }

GET /api/exams/:examId/progress
Response: { progress: ExamProgress }
```

### Curriculum & Topics

```
GET /api/exams/:examId/topics
Response: { topics: TopicDefinition[] }

GET /api/exams/:examId/topics/:topicId
Response: { topic: TopicDetail, materials: LearningMaterial[] }

GET /api/exams/:examId/topics/:topicId/progress
Response: { progress: TopicProgress }
```

### Questions & Practice

```
GET /api/exams/:examId/topics/:topicId/questions
Query: { difficulty?, adaptive?, count? }
Response: { questions: Question[] }

POST /api/exams/:examId/questions/:questionId/submit
Body: { selectedAnswer: string }
Response: { isCorrect: boolean, explanation: string }
```

### Analytics

```
GET /api/exams/:examId/analytics
Query: { timeRange?: 'week'|'month'|'all' }
Response: { analytics: ExamAnalytics }

GET /api/exams/:examId/analytics/score-prediction
Response: { predictedScore: number, range: [min, max] }
```

### Study Plans

```
GET /api/exams/:examId/study-plan
Response: { plan: StudyPlan[] }

POST /api/exams/:examId/study-plan/generate
Body: { intensity: 'light'|'moderate'|'intensive', startDate: Date }
Response: { plan: StudyPlan[] }

PATCH /api/exams/:examId/study-plan/:taskId/complete
Body: { completed: boolean }
Response: { taskProgress: TaskProgress }
```

## Frontend API Client (lib/api.ts)

```typescript
// Update existing api.ts with exam-specific methods

export const examAPI = {
  // Exam Management
  listExams: () => get<Exam[]>("/exams"),
  getExam: (examId: string) => get<ExamDetail>(`/exams/${examId}`),
  getExamProgress: (examId: string) =>
    get<ExamProgress>(`/exams/${examId}/progress`),

  // Curriculum
  getCurriculum: (examId: string) =>
    get<CurriculumSection[]>(`/exams/${examId}/curriculum`),
  getTopic: (examId: string, topicId: string) =>
    get<TopicDetail>(`/exams/${examId}/topics/${topicId}`),
  getTopicProgress: (examId: string, topicId: string) =>
    get<TopicProgress>(`/exams/${examId}/topics/${topicId}/progress`),

  // Questions
  getQuestions: (examId: string, topicId: string, options?: QuestionOptions) =>
    get<Question[]>(`/exams/${examId}/topics/${topicId}/questions`, options),
  submitAnswer: (examId: string, questionId: string, selectedAnswer: string) =>
    post(`/exams/${examId}/questions/${questionId}/submit`, { selectedAnswer }),

  // Analytics
  getAnalytics: (examId: string, timeRange?: string) =>
    get<ExamAnalytics>(`/exams/${examId}/analytics`, { timeRange }),
  getScorePrediction: (examId: string) =>
    get<ScorePrediction>(`/exams/${examId}/analytics/score-prediction`),

  // Study Plans
  getStudyPlan: (examId: string) =>
    get<StudyPlan>(`/exams/${examId}/study-plan`),
  generateStudyPlan: (examId: string, config: StudyPlanConfig) =>
    post(`/exams/${examId}/study-plan/generate`, config),
  completeTask: (examId: string, taskId: string, completed: boolean) =>
    patch(`/exams/${examId}/study-plan/${taskId}/complete`, { completed }),
};
```

---

# Implementation Roadmap

## Phase 1: Foundation (Weeks 1-2)

- [ ] Update ExamContext and global state management
- [ ] Set up CSS variable system for exam themes
- [ ] Create reusable component library (Button, Badge, ProgressBar, etc.)
- [ ] Implement Exam Selection Page
- [ ] Create navigation infrastructure

## Phase 2: Core Dashboard (Weeks 2-3)

- [ ] Build Exam Dashboard layout (2-column responsive)
- [ ] Implement Curriculum Overview with sections
- [ ] Create TopicCard component
- [ ] Add exam-specific styling throughout
- [ ] Connect to backend for curriculum data

## Phase 3: Learning Flow (Weeks 3-4)

- [ ] Implement Topic Learning Page
- [ ] Create LearningMaterial component
- [ ] Build WorkedExample component
- [ ] Add KeyStrategies section
- [ ] Connect to backend for learning materials

## Phase 4: Practice & Adaptive (Weeks 4-5)

- [ ] Build Practice Interface
- [ ] Implement QuestionCard & AnswerOptions
- [ ] Add submit feedback flow
- [ ] Implement adaptive difficulty logic
- [ ] Create QuizCompletion page
- [ ] Connect to backend for questions

## Phase 5: Analytics & Insights (Weeks 5-6)

- [ ] Create Analytics Dashboard
- [ ] Build chart components (Recharts or D3)
- [ ] Implement metric cards
- [ ] Add time-range filtering
- [ ] Create score prediction display
- [ ] Connect to analytics backend

## Phase 6: Study Planning (Weeks 6-7)

- [ ] Build Study Plan interface
- [ ] Implement intensity selector
- [ ] Create week/day task cards
- [ ] Add drag-and-drop for desktop
- [ ] Implement task completion tracking
- [ ] Connect to backend for study plans

## Phase 7: Polish & Testing (Weeks 7-8)

- [ ] Responsive design refinement
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Performance optimization
- [ ] Component testing
- [ ] E2E testing
- [ ] User feedback & iteration

---

## Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "recharts": "^2.10.0",
    "@headlessui/react": "^1.7.0",
    "dnd-kit": "^6.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "@testing-library/react": "^14.0.0",
    "jest": "^29.0.0"
  }
}
```

**Note:** Update package.json with Recharts and dnd-kit for charts and drag-and-drop.

---

## Success Metrics

1. **Usability:** Users can navigate between exams within 2 clicks
2. **Performance:** Page load time < 2 seconds
3. **Accessibility:** WCAG 2.1 AA compliance
4. **Engagement:** 85%+ users complete at least one topic per exam
5. **Retention:** 60%+ users return to same exam within 7 days

---

**Implementation Guide Complete — Ready for Development**
