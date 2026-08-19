# Askesis — Multi-Exam Curriculum System

## Comprehensive UI/UX Design Document

**Document Version:** 1.0  
**Last Updated:** 2026-08-04  
**Status:** Design Specification (Ready for Implementation)

---

## Table of Contents

1. [Design System Foundation](#design-system-foundation)
2. [Exam-Specific Color Palette](#exam-specific-color-palette)
3. [Page 1: Exam Selection Page](#page-1-exam-selection-page)
4. [Page 2: Exam Dashboard](#page-2-exam-dashboard)
5. [Page 3: Curriculum Structure](#page-3-curriculum-structure)
6. [Page 4: Topic Learning Page](#page-4-topic-learning-page)
7. [Page 5: Practice Interface](#page-5-practice-interface)
8. [Page 6: Exam-Level Analytics](#page-6-exam-level-analytics)
9. [Page 7: Exam-Level Study Plan](#page-7-exam-level-study-plan)
10. [Navigation & Information Architecture](#navigation--information-architecture)
11. [Responsive Design Specifications](#responsive-design-specifications)

---

# Design System Foundation

## Typography

- **Primary Font:** Inter (existing in globals.css)
- **Heading 1:** 40px, weight 700, line-height 1.2
- **Heading 2:** 32px, weight 700, line-height 1.3
- **Heading 3:** 24px, weight 600, line-height 1.4
- **Body:** 16px, weight 400, line-height 1.6
- **Caption:** 12px, weight 400, line-height 1.4
- **Button Text:** 14px, weight 600

## Spacing System (8px base)

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

## Color Palette (Enhanced)

### Primary Colors

- **Primary Blue:** #3A6EA5 (existing)
- **Accent Yellow:** #F9C74F (existing)
- **White:** #FFFFFF
- **Dark Gray:** #1F2937
- **Light Gray:** #F3F4F6

### Status Colors

- **Success:** #10B981
- **Warning:** #F97316
- **Error:** #EF4444
- **Info:** #3B82F6

### Neutral Gradients

- **Background Gradient:** Linear from #F9FAFB to #F3F4F6

## Shadows

- **sm:** 0 1px 2px 0 rgba(0,0,0,0.05)
- **md:** 0 4px 6px -1px rgba(0,0,0,0.1)
- **lg:** 0 10px 15px -3px rgba(0,0,0,0.1)
- **xl:** 0 20px 25px -5px rgba(0,0,0,0.1)

## Border Radius

- **sm:** 4px
- **md:** 8px
- **lg:** 12px
- **full:** 9999px

---

# Exam-Specific Color Palette

Each exam gets a distinct visual identity to help users quickly orient themselves. Implement a primary color per exam while maintaining the overall design system.

| Exam    | Primary Color     | Accent           | Icon Style      | Use Case        |
| ------- | ----------------- | ---------------- | --------------- | --------------- |
| SAT     | #4F46E5 (Indigo)  | #F59E0B (Amber)  | Gradient circle | College prep    |
| ACT     | #06B6D4 (Cyan)    | #EC4899 (Pink)   | Rounded square  | College prep    |
| GRE     | #8B5CF6 (Violet)  | #14B8A6 (Teal)   | Pentagon badge  | Graduate prep   |
| GMAT    | #10B981 (Emerald) | #6366F1 (Indigo) | Hexagon badge   | Business school |
| SHSAT   | #F97316 (Orange)  | #3B82F6 (Blue)   | Diamond badge   | NYC schools     |
| Regents | #DC2626 (Red)     | #FBBF24 (Gold)   | Shield badge    | High school     |

---

# Page 1: Exam Selection Page

## Purpose

Allow users to browse and select an exam to begin their study journey.

## Component: Exam Selection Hero Section

```
┌─────────────────────────────────────────────────────┐
│                  EXAM PREP AI                       │
│  Choose Your Standardized Exam & Master It          │
│  [Search box with exam filter]                      │
└─────────────────────────────────────────────────────┘
```

### UI Specifications

**Layout Grid:**

- **Desktop (1200px+):** 3 columns, gap: 24px
- **Tablet (768-1199px):** 2 columns, gap: 20px
- **Mobile (< 768px):** 1 column, gap: 16px

**Exam Card Design:**

```
┌──────────────────────────────┐
│  [EXAM ICON] SAT             │ (64x64px icon, top-left)
│                              │
│  College Admissions Exam     │ (Heading 3, color: primary)
│                              │
│  Prepare for the SAT with    │ (Body text, 2 lines max)
│  personalized curriculum     │
│                              │
│  📊 2,400 Questions          │ (Caption, gray)
│  ⏱️ 180 Hours Estimated     │ (Caption, gray)
│                              │
│  ████████░░ 32% Completed    │ (Progress bar, primary color)
│                              │
│  [Enter SAT Exam] →          │ (Button: primary blue)
└──────────────────────────────┘
```

**Exam Card Specifications:**

- Width: 100% (responsive)
- Height: 320px (fixed)
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border-radius: 12px
- Padding: 24px
- Shadow: md
- Hover State:
  - Box-shadow: lg
  - Transform: translateY(-2px)
  - Transition: all 300ms ease
  - Cursor: pointer

**Icon Zone:**

- 64x64px centered icon or logo
- Exam-specific primary color
- Margin-bottom: 16px

**Progress Bar:**

- Height: 8px
- Background: #E5E7EB
- Filled portion: exam-specific primary color
- Border-radius: full
- Margin-top: 16px

**Enter Button:**

- Class: `btn-primary` (existing design system)
- Width: 100%
- Height: 44px
- Font-size: 14px
- Font-weight: 600
- Margin-top: 16px
- Hover: Darker blue + scale 1.02

---

## Additional Components

### Search & Filter Bar

```
┌────────────────────────────────┐
│  🔍 Search exams...     [All ▼] │
└────────────────────────────────┘
```

- Filter dropdown: All, Available, In Progress, Completed
- Search by exam name (client-side)
- Sticky on scroll (mobile only)

### Featured Exam Section (optional)

```
┌──────────────────────────────────────────┐
│  POPULAR TODAY: SAT                      │
│  [Large hero card - 2x width on desktop] │
│  "Most students preparing for college"   │
│  [Enter Exam]                           │
└──────────────────────────────────────────┘
```

### Stats Section (Footer)

```
┌──────────────────────────────────────────┐
│  ✓ 50,000+ Students      📚 180+ Topics │
│  ⭐ 4.9/5 Rating         🎯 AI Adaptive │
└──────────────────────────────────────────┘
```

---

# Page 2: Exam Dashboard

## Purpose

Provide the central hub for a specific exam with overview, curriculum, and quick actions.

## Layout Structure

```
┌─────────────────────────────────────────────┐
│ ← Back    SAT Dashboard              [User] │ (Navbar)
├─────────────────────────────────────────────┤
│                                             │
│  SAT - College Admissions Exam              │ (Heading 1)
│  Last studied: 2 days ago                   │ (Caption)
│                                             │
├─────────────────────────────────────────────┤
│  GRID LAYOUT (Desktop):                     │
│  ┌──────────────────┐  ┌─────────────────┐  │
│  │   Left (60%)     │  │  Right (40%)    │  │
│  │  Curriculum      │  │  Progress &     │  │
│  │  Topics          │  │  Quick Actions  │  │
│  │                  │  │                 │  │
│  └──────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────┘
```

### LEFT COLUMN: Curriculum Overview

#### Component: Section Accordion

```
┌─────────────────────────┐
│ ▼ READING & WRITING     │ (Heading 3, expandable)
│   └─ Vocabulary         │ (Topic card)
│   └─ Grammar            │ (Topic card)
│   └─ Passage Reading    │ (Topic card)
├─────────────────────────┤
│ ▶ MATH                  │ (Collapsed section)
├─────────────────────────┤
│ ▶ ESSAY (Optional)      │ (Collapsed section)
└─────────────────────────┘
```

#### Topic Card Design (within curriculum)

```
┌──────────────────────────────┐
│ Vocabulary                   │ (Body, bold)
│ Beginner                     │ (Badge: light gray bg)
│                              │
│ Learn word patterns and      │ (Caption, 2 lines)
│ context clues                │
│                              │
│ 45 questions  ⏱️ 3 hours     │ (Caption, gray)
│                              │
│ ████████░░░ 42%              │ (Progress bar)
│ [Start Practice] →           │ (Compact button)
└──────────────────────────────┘
```

**Topic Card Specifications:**

- Width: 100% (fits column width)
- Height: auto (min 180px)
- Padding: 16px
- Background: #F9FAFB
- Border: 1px solid #E5E7EB
- Border-radius: md
- Margin-bottom: 12px
- Cursor: pointer
- Hover: Background #F3F4F6, border color: primary blue

#### Difficulty Badge

- Background: varies by difficulty
  - Beginner: #D1FAE5 (light green), text #065F46
  - Intermediate: #FEF3C7 (light yellow), text #92400E
  - Advanced: #FEE2E2 (light red), text #7F1D1D
- Padding: 4px 12px
- Border-radius: full
- Font-size: 12px
- Font-weight: 600

---

### RIGHT COLUMN: Progress Summary & Quick Actions

#### Exam Progress Card

```
┌────────────────────────┐
│ YOUR PROGRESS          │ (Caption, uppercase)
│                        │
│ Overall: 28%           │ (Heading 3)
│ ██████░░░░░░░░░░░░░░ │
│                        │
│ Reading & Writing: 42% │ (Body)
│ ████████████░░░░░░░░  │
│                        │
│ Math: 18%              │ (Body)
│ ███░░░░░░░░░░░░░░░░░  │
│                        │
│ Essay: 5%              │ (Body)
│ █░░░░░░░░░░░░░░░░░░░  │
└────────────────────────┘
```

**Specifications:**

- Width: 100% (right column)
- Background: gradient (light blue, subtle)
- Border: 1px solid #BFDBFE
- Border-radius: lg
- Padding: 20px
- Shadow: sm

#### Primary CTA Section

```
┌────────────────────────┐
│ [Continue Where You    │
│  Left Off] →           │ (btn-primary, full width)
│                        │
│  Last: Vocabulary      │ (Caption)
│  3 days ago            │ (Caption)
└────────────────────────┘
```

If no progress exists:

```
┌────────────────────────┐
│ [Start Learning] →     │ (btn-primary, full width)
│                        │
│  Begin with Reading &  │ (Caption)
│  Writing fundamentals  │ (Caption)
└────────────────────────┘
```

#### Quick Actions Grid

```
┌──────────────┬──────────────┐
│ 🎯 PRACTICE  │ ⏱️  TIMED    │
│ MODE         │  EXAM       │
│ [Start] →    │ [Launch] →  │
└──────────────┴──────────────┘
┌──────────────┬──────────────┐
│ 📋 MOCK      │ 📊 VIEW      │
│  EXAM        │  ANALYTICS  │
│ [Launch] →   │ [View] →    │
└──────────────┴──────────────┘
┌──────────────┬──────────────┐
│ 📅 STUDY     │ ⚙️  EXAM     │
│  PLAN        │  SETTINGS   │
│ [Open] →     │ [Open] →    │
└──────────────┴──────────────┘
```

**Quick Action Card:**

- Width: calc(50% - 6px) on desktop (2 columns)
- Width: 100% on tablet/mobile
- Height: 100px
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border-radius: md
- Padding: 16px
- Display: flex, flex-direction: column, justify-content: center
- Font: Body (bold emoji icon)
- Hover: Border color changes to primary blue

---

# Page 3: Curriculum Structure

## Purpose

Show the complete curriculum map for an exam as a visual hierarchy.

## Page Layout

```
┌─────────────────────────────────────────────┐
│ ← Back    SAT Curriculum              [User] │
├─────────────────────────────────────────────┤
│                                             │
│ SAT Curriculum Map                          │ (Heading 2)
│ 3 sections • 24 topics • 2,400 questions    │ (Caption)
│                                             │
│ [Search topics...]                          │ (Search bar)
│                                             │
├─────────────────────────────────────────────┤
│ 📚 READING & WRITING (Section 1)            │ (Heading 3)
│ 8 topics • 42% completed                    │ (Caption)
│                                             │
│ ┌─────────────┐  ┌─────────────┐ ...       │
│ │ Vocabulary  │  │  Grammar    │           │ (Topic cards)
│ │ Beginner    │  │ Intermediate│           │
│ │ 42%         │  │ 38%         │           │
│ │ [View] →    │  │ [View] →    │           │
│ └─────────────┘  └─────────────┘           │
│                                             │
├─────────────────────────────────────────────┤
│ 🔢 MATH (Section 2)                        │
│ 12 topics • 18% completed                  │
│                                             │
│ ┌─────────────┐  ┌─────────────┐ ...       │
│ │  Algebra    │  │ Geometry    │           │
│ │ Intermediate│  │ Advanced    │           │
│ │ 12%         │  │ 5%          │           │
│ │ [View] →    │  │ [View] →    │           │
│ └─────────────┘  └─────────────┘           │
│                                             │
├─────────────────────────────────────────────┤
│ ✏️  ESSAY (Section 3)                      │
│ 4 topics • 0% completed                    │
│                                             │
│ (Topic cards...)                            │
│                                             │
└─────────────────────────────────────────────┘
```

### Section Header

```
┌──────────────────────────────┐
│ 📚 READING & WRITING         │ (Icon + heading)
│ 8 topics • 42% completed     │ (Stats)
│ ████████░░░░░░░░░░░░ 42%    │ (Section progress bar)
└──────────────────────────────┘
```

**Specifications:**

- Padding: 16px
- Border-bottom: 2px solid primary exam color
- Margin-bottom: 20px
- Margin-top: 32px (except first)

### Topic Card Grid (for Curriculum Page)

```
┌─────────────────────────┐
│ 📖 Vocabulary           │ (Icon + title)
│                         │
│ Master word patterns    │ (Short description)
│ and context clues       │
│                         │
│ Beginner               │ (Difficulty badge)
│                         │
│ 45 questions • 3 hrs   │ (Stats)
│                         │
│ ████████░░░ 42%        │ (Progress)
│                         │
│ [View Topic] →         │ (CTA button)
└─────────────────────────┘
```

**Grid Layout:**

- Desktop (1200px+): 4 columns, gap: 16px
- Tablet (768-1199px): 3 columns, gap: 16px
- Mobile (< 768px): 2 columns, gap: 12px

**Card Specifications:**

- Height: 280px (fixed)
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border-radius: lg
- Padding: 16px
- Shadow: md
- Hover: Transform translateY(-4px), shadow: lg
- Transition: all 300ms ease

**Topic Icon:**

- 32x32px, positioned top-right
- Emoji or SVG icon specific to topic
- Opacity: 0.8

---

# Page 4: Topic Learning Page

## Purpose

Deliver comprehensive learning materials for a specific topic with structure and progression.

## Page Layout

```
┌─────────────────────────────────────────────────────┐
│ ← Back    SAT > Vocabulary              [User]      │ (Navbar)
├─────────────────────────────────────────────────────┤
│                                                     │
│ TOPIC HEADER                                        │
│ ┌───────────────────────────────────────────────┐   │
│ │ Vocabulary                                    │   │
│ │ Beginner • 42% Complete                       │   │
│ │ ███████░░░░░░░░░░░░ 42%                      │   │
│ │ [Start Practice] →   [Skip to Practice] →    │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ LEARNING MATERIALS SECTION                          │
│ ┌───────────────────────────────────────────────┐   │
│ │ 📚 Concept Overview                           │   │
│ │ In SAT vocabulary questions, you need to...   │   │
│ │ [Long-form explanation text, ~400 words]     │   │
│ │ [Optional: embedded video thumbnail]         │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
│ ┌───────────────────────────────────────────────┐   │
│ │ 💡 Key Strategies                             │   │
│ │ • Strategy 1: Context Clues                   │   │
│ │ • Strategy 2: Word Etymology                 │   │
│ │ • Strategy 3: Process of Elimination          │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
│ ┌───────────────────────────────────────────────┐   │
│ │ 📋 Important Formulas / Concepts              │   │
│ │ ┌─────────────────────────────────────────┐   │   │
│ │ │ Context Clue Types:                     │   │   │
│ │ │ 1. Definition → word means X            │   │   │
│ │ │ 2. Contrast → word is opposite of Y     │   │   │
│ │ │ 3. Example → word is like Z             │   │   │
│ │ └─────────────────────────────────────────┘   │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
│ ┌───────────────────────────────────────────────┐   │
│ │ ✓ Worked Example                             │   │
│ │ Question: "The politician's _____ speech" │   │   │
│ │ A) mellifluous  B) cacophonous  C) tepid │   │   │
│ │                                             │   │   │
│ │ Answer: A) mellifluous                      │   │   │
│ │ Explanation: "mellifluous" means sweet or   │   │   │
│ │ pleasing to the ear, matching the tone...   │   │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
│ [Continue to Practice] →                            │ (btn-primary)
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ PRACTICE SECTION                                    │
│ ┌───────────────────────────────────────────────┐   │
│ │ 📝 Start Practicing                           │   │
│ │                                               │   │
│ │ 45 questions available  |  Adaptive mode      │   │
│ │                                               │   │
│ │ [Start Quiz] →                                │   │
│ │ This will present questions progressively.   │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Topic Header Card

```
┌─────────────────────────────────────┐
│ Vocabulary                          │ (Heading 2)
│ Beginner • 42% Complete             │ (Caption + badge)
│                                     │
│ ███████░░░░░░░░░░░░ 42%            │ (Large progress bar)
│                                     │
│ [Start Practice] →  [Skip] →        │ (Two button row)
└─────────────────────────────────────┘
```

**Specifications:**

- Width: 100%
- Background: Linear gradient (exam-specific primary to lighter shade)
- Padding: 32px
- Border-radius: lg
- Shadow: md
- Text color: White
- Margin-bottom: 32px

### Learning Materials Card

```
┌─────────────────────────────────────┐
│ 📚 Concept Overview                 │ (Icon + subheading)
│                                     │
│ [Long-form text, 400-600 words]     │
│                                     │
│ • Bullet point explanation          │
│ • Another key detail                │
│ • Final takeaway                    │
│                                     │
│ [Optional: YouTube/video embed]     │
│                                     │
│ [Learn more] →                      │ (Optional link)
└─────────────────────────────────────┘
```

**Specifications:**

- Width: 100%
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border-radius: lg
- Padding: 24px
- Margin-bottom: 20px
- Line-height: 1.8 (for readability)

### Key Strategies/Formulas Callout

```
┌─────────────────────────────────────┐
│ 💡 KEY STRATEGIES                   │ (Bold icon + heading)
│                                     │
│ ✓ Strategy 1: Context Clues         │ (Checkmark list)
│   Look for words like "however" to  │
│   signal contrast clues.            │
│                                     │
│ ✓ Strategy 2: Word Etymology        │
│   Understanding prefixes and        │
│   suffixes helps decode meaning.    │
│                                     │
│ ✓ Strategy 3: Process of Elimination│
│   Rules out 2-3 wrong answers       │
│   to increase odds.                 │
└─────────────────────────────────────┘
```

### Worked Example Box

```
┌─────────────────────────────────────┐
│ ✓ WORKED EXAMPLE                    │ (Heading 3, green accent)
│                                     │
│ Question:                           │
│ "The politician's _____ speech      │
│ won over the audience."             │
│                                     │
│ A) Cacophonous (harsh sounding)     │ (Option A)
│ B) Mellifluous (sweet sounding)     │ (Option B - CORRECT)
│ C) Tepid (lukewarm, unenthusiastic) │ (Option C)
│                                     │
│ ✓ Correct Answer: B                 │ (Green checkmark)
│                                     │
│ Explanation:                        │
│ "Won over" indicates the speech     │
│ had a positive effect. "Mellifluous"│
│ means pleasant to the ear, which    │
│ matches this tone. "Cacophonous"    │
│ would be harsh (negative), and      │
│ "tepid" implies the speech was      │
│ boring — neither fits the context.  │
│                                     │
│ Key Takeaway:                       │
│ Always consider the emotional tone  │
│ implied by surrounding words.       │
└─────────────────────────────────────┘
```

**Specifications:**

- Border-left: 4px solid #10B981 (success green)
- Background: #F0FDF4 (very light green)
- Padding: 20px
- Border-radius: md
- Margin-bottom: 20px

---

# Page 5: Practice Interface

## Purpose

Deliver AI-generated exam questions with adaptive difficulty and comprehensive feedback.

## Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ SAT > Vocabulary  Q3/45              [Timer: 3:45]   │ (Navbar + progress)
├─────────────────────────────────────────────────────┤
│                                                     │
│ PROGRESS INDICATOR                                  │
│ Question 3 of 45  |  Difficulty: Intermediate      │
│ ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  6%    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ QUESTION SECTION                                    │
│ ┌─────────────────────────────────────────────┐     │
│ │ The scientist's _____ approach led to       │     │
│ │ groundbreaking discoveries.                 │     │
│ │                                             │     │
│ │ A) Meticulous     B) Haphazard              │     │
│ │ C) Careless       D) Indifferent           │     │
│ │                                             │     │
│ │ Time Remaining: 3:45                        │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ ANSWER SELECTION SECTION                            │
│ ┌────────────────────────────────────────────┐      │
│ │ [A] Meticulous       [B] Haphazard         │      │
│ │                                            │      │
│ │ [C] Careless         [D] Indifferent       │      │
│ └────────────────────────────────────────────┘      │
│                                                     │
│ [Submit Answer] →                                  │ (btn-primary)
│                                                     │
│ [Skip Question]     [Review Later]                 │ (Secondary buttons)
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Progress Indicator

```
Question 3 of 45  |  Difficulty: Intermediate

███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  6%
```

**Specifications:**

- Display: flex, justify-content: space-between
- Progress bar: height 4px, border-radius: full
- Color: exam-specific primary color
- Margin-bottom: 24px

### Question Card

```
┌─────────────────────────────────────────────┐
│ The scientist's _____ approach led to       │
│ groundbreaking discoveries.                 │
│                                             │
│ A) Meticulous     B) Haphazard              │
│ C) Careless       D) Indifferent            │
│                                             │
│ Time Remaining: 3:45                        │
└─────────────────────────────────────────────┘
```

**Specifications:**

- Width: 100%
- Background: #FFFFFF
- Border: 2px solid #E5E7EB
- Border-radius: lg
- Padding: 32px
- Font-size: 18px (larger for readability)
- Line-height: 1.8
- Margin-bottom: 32px
- Shadow: md

### Answer Option Cards

```
┌──────────────────────┬──────────────────────┐
│ □  A) Meticulous     │ □  B) Haphazard      │
└──────────────────────┴──────────────────────┘

┌──────────────────────┬──────────────────────┐
│ □  C) Careless       │ □  D) Indifferent    │
└──────────────────────┴──────────────────────┘
```

**Option Card Design:**

- Layout: 2x2 grid on desktop, 1 column on mobile
- Width: calc(50% - 6px) on desktop
- Height: 80px
- Background: #F9FAFB
- Border: 2px solid #E5E7EB
- Border-radius: md
- Padding: 16px
- Display: flex, align-items: center, gap: 12px
- Font-weight: 500
- Cursor: pointer
- Transition: all 200ms ease

**Option Card States:**

- **Default:** Border #E5E7EB, background #F9FAFB
- **Hover:** Border primary-color, background lighter shade
- **Selected (before submit):** Border primary-color, checkbox checked
- **Submitted - Correct:** Border #10B981, background #F0FDF4
- **Submitted - Wrong:** Border #EF4444, background #FEF2F2

### Checkbox

- Size: 20x20px
- Default: unchecked (empty square)
- Selected: checkmark icon
- Color: primary exam color

### Submit Button

```
[Submit Answer] →
```

**Specifications:**

- Class: `btn-primary`
- Width: 100%
- Height: 48px
- Font-size: 16px
- Font-weight: 600
- Margin-bottom: 16px
- Disabled state: opacity 0.5 if no answer selected

### Secondary Actions

```
[Skip Question]     [Review Later]
```

**Button Specifications:**

- Class: `btn-secondary`
- Width: calc(50% - 6px) each
- Height: 44px
- Background: transparent or light gray
- Border: 1px solid #D1D5DB
- Margin-top: 12px

---

## Page 5B: After Answer Submission

```
┌─────────────────────────────────────────────────────┐
│ SAT > Vocabulary  Q3/45              [Timer: 3:40]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ✓ CORRECT!                                          │ (Green heading)
│                                                     │
│ Question: The scientist's _____ approach led to    │
│ groundbreaking discoveries.                         │
│                                                     │
│ Your Answer: A) Meticulous                          │ (Correct option highlighted)
│                                                     │
│ EXPLANATION                                         │
│ ┌─────────────────────────────────────────────┐     │
│ │ "Meticulous" means showing great attention  │     │
│ │ to detail and careful work. In this context,│     │
│ │ a scientist's careful approach would lead   │     │
│ │ to discoveries. The other options are all   │     │
│ │ negative or neutral: "haphazard" means      │     │
│ │ disorganized, "careless" means lacking      │     │
│ │ attention, and "indifferent" means lacking  │     │
│ │ interest. None fit the positive outcome.    │     │
│ │                                             │     │
│ │ Key Takeaway: Always match tone with        │     │
│ │ surrounding context.                        │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ [Next Question] →                                   │ (btn-primary)
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Correct Answer State

```
┌─────────────────────────────────────────────┐
│ ✓ CORRECT!                                  │ (Green heading, Heading 3)
│                                             │
│ [Question text repeated]                    │
│                                             │
│ Your Answer: A) Meticulous                  │ (Bold, green checkmark)
└─────────────────────────────────────────────┘
```

**Specifications:**

- Background: #F0FDF4 (very light green)
- Border-left: 4px solid #10B981
- Heading color: #10B981
- Padding: 16px
- Border-radius: md
- Margin-bottom: 20px

### Incorrect Answer State

```
┌─────────────────────────────────────────────┐
│ ✗ INCORRECT                                 │ (Red heading, Heading 3)
│                                             │
│ [Question text repeated]                    │
│                                             │
│ Your Answer: C) Careless   ✗                │ (Red, X mark)
│ Correct Answer: A) Meticulous  ✓            │ (Green, checkmark)
└─────────────────────────────────────────────┘
```

**Specifications:**

- Background: #FEF2F2 (very light red)
- Border-left: 4px solid #EF4444
- Heading color: #EF4444
- Padding: 16px
- Border-radius: md
- Margin-bottom: 20px

### Explanation Box

```
┌─────────────────────────────────────────────┐
│ 💡 EXPLANATION                              │
│                                             │
│ [Detailed explanation text, 3-5 sentences] │
│                                             │
│ Key Takeaway:                               │
│ [One-sentence summary]                      │
└─────────────────────────────────────────────┘
```

**Specifications:**

- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border-radius: md
- Padding: 16px
- Margin-bottom: 24px
- Font-size: 14px

### Next Question Button

- Width: 100%
- Height: 48px
- Class: `btn-primary`
- Label: "Next Question →"
- Disabled if quiz complete (shows "View Results" instead)

---

## Quiz Completion View

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│ 🎉 QUIZ COMPLETE!                                  │
│                                                     │
│ Your Score: 38/45 (84%)                            │
│ ███████████████░░░ 84%                             │
│                                                     │
│ Difficulty Faced: Intermediate → Advanced          │
│ (Adaptive engine suggesting harder questions)      │
│                                                     │
│ ┌─────────────────────────────────────────────┐    │
│ │ Category Breakdown:                         │    │
│ │ • Context Clues: 85% (9/10)  ✓              │    │
│ │ • Word Etymology: 80% (8/10) ✓              │    │
│ │ • Synonyms & Antonyms: 70% (7/9) ~          │    │
│ │ • Advanced Vocabulary: 66% (6/9) ~          │    │
│ └─────────────────────────────────────────────┘    │
│                                                     │
│ 💡 Recommendation:                                 │
│ You're strong on context clues! Focus more on     │
│ advanced vocabulary to improve your score.        │
│                                                     │
│ [Review Answers]  [Try Again]  [Back to Topic] → │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

# Page 6: Exam-Level Analytics

## Purpose

Provide comprehensive progress tracking and performance insights specific to an exam.

## Page Layout

```
┌─────────────────────────────────────────────────────┐
│ ← Back    SAT Analytics               [User]        │ (Navbar)
├─────────────────────────────────────────────────────┤
│                                                     │
│ SAT — Your Performance Dashboard                    │ (Heading 1)
│ Last updated: 2 hours ago                           │ (Caption)
│                                                     │
│ [Time Range: Last 7 Days ▼]                         │ (Filter)
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ KEY METRICS (Card Grid)                             │
│ ┌──────────────────┬──────────────────┐             │
│ │ Overall Score    │ Questions Done   │             │
│ │ 782/800          │ 457/2400         │             │
│ │ (Estimated)      │ (19% Completion) │             │
│ └──────────────────┴──────────────────┘             │
│                                                     │
│ ┌──────────────────┬──────────────────┐             │
│ │ Average Time     │ Accuracy Rate    │             │
│ │ 1min 23sec       │ 84%              │             │
│ │ per question     │ (based on tests) │             │
│ └──────────────────┴──────────────────┘             │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ TOPIC MASTERY CHART (Section)                       │
│ ┌──────────────────────────────────────────────┐    │
│ │ Reading & Writing                   █ 68%    │    │
│ │ Math                                 █ 42%    │    │
│ │ Essay                                █ 8%     │    │
│ │                                      0%    100%│    │
│ └──────────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ DIFFICULTY PROGRESSION                              │
│ ┌──────────────────────────────────────────────┐    │
│ │ You are: Intermediate                        │    │
│ │ Started: Beginner (2 weeks ago)               │    │
│ │ Trajectory: ↗ Improving (on pace for Average)│    │
│ └──────────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ TIME-PER-QUESTION ANALYSIS                          │
│ ┌──────────────────────────────────────────────┐    │
│ │ Line Chart: Time vs. Question #                 │    │
│ │ [Average trendline showing performance]        │    │
│ │ You're getting faster over time! ⚡             │    │
│ └──────────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ESTIMATED SCORE RANGE                               │
│ ┌──────────────────────────────────────────────┐    │
│ │ Based on current performance:                 │    │
│ │ Estimated SAT Score: 750 - 800                │    │
│ │ ██████████████░░░░░░░░░░░░░░░░ 750-800       │    │
│ │                                              │    │
│ │ (Updated after every 10 questions)           │    │
│ │ [What does this mean?]                       │    │
│ └──────────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ WEAK TOPICS (To Focus On)                           │
│ ┌────────────┬────────────┬────────────┐            │
│ │ Essay      │ Algebra    │ Geometry   │            │
│ │ 8%         │ 28%        │ 32%        │            │
│ │ [Practice] │ [Practice] │ [Practice] │            │
│ └────────────┴────────────┴────────────┘            │
│                                                     │
│ STRONG TOPICS                                       │
│ ┌────────────┬────────────┬────────────┐            │
│ │ Vocabulary │ Grammar    │ Statistics │            │
│ │ 92%        │ 88%        │ 85%        │            │
│ │ [Maintain] │ [Maintain] │ [Maintain] │            │
│ └────────────┴────────────┴────────────┘            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Key Metrics Card Grid

```
┌──────────────────┬──────────────────┐
│ Overall Score    │ Questions Done   │
│ 782/800          │ 457/2400         │
│ (Estimated)      │ (19% Completion) │
└──────────────────┴──────────────────┘
```

**Metric Card Specifications:**

- Width: calc(25% - 12px) on desktop (4 columns)
- Width: calc(50% - 8px) on tablet (2 columns)
- Width: 100% on mobile
- Height: 120px
- Background: gradient (light to light, exam-specific shade)
- Border: 1px solid exam-specific color
- Border-radius: lg
- Padding: 16px
- Shadow: sm
- Text alignment: center

### Topic Mastery Chart

```
Reading & Writing    ████████████████░░░░ 68%
Math                 ████████░░░░░░░░░░░░ 42%
Essay                █░░░░░░░░░░░░░░░░░░░ 8%
                     0%                   100%
```

**Chart Specifications:**

- Type: Horizontal bar chart
- Width: 100%
- Height: auto
- Each bar:
  - Filled portion: exam-specific primary color
  - Empty portion: #E5E7EB
  - Height: 24px per bar
  - Gap: 12px between rows
- Label: topic name, percent value at end
- Interactive: Hover to show exact percentage
- Click to drill down into topic details

### Difficulty Progression Card

```
┌──────────────────────────────────────┐
│ You are: Intermediate                │
│ Started: Beginner (2 weeks ago)      │
│ Trajectory: ↗ Improving              │
│ Pace: On track for Average score     │
└──────────────────────────────────────┘
```

**Specifications:**

- Background: #F0F9FF (very light blue)
- Border: 1px solid #BFDBFE
- Border-radius: md
- Padding: 16px
- Icon: Upward arrow (↗) for positive trajectory

### Time-per-Question Line Chart

```
┌──────────────────────────────────────────────┐
│ Time per Question Trend                      │
│ 5:00 |                                       │
│      |     .                                 │
│ 3:00 |    / \                                │
│      |   /   \___                            │
│ 1:00 |__/         \___                       │
│      |________________                       │
│      Q1   Q50  Q100 Q150 Q200                │
│                                              │
│ You're getting faster! ⚡                    │
│ Average: 1min 23sec                          │
└──────────────────────────────────────────────┘
```

**Chart Specifications:**

- Width: 100%
- Height: 300px
- X-axis: Question number (0 to max)
- Y-axis: Time in seconds
- Line color: exam-specific primary
- Average line: dashed, gray
- Hover: Tooltip showing exact time + question
- Animation: Smooth line drawing on load

### Estimated Score Card

```
┌──────────────────────────────────────────┐
│ Based on current performance:            │
│ Estimated SAT Score: 750 - 800           │
│ ████████████████░░░░░░░░░░░░░░░░ 750-800 │
│                                          │
│ This estimate updates after every 10     │
│ questions and improves over time.        │
└──────────────────────────────────────────┘
```

**Specifications:**

- Background: #FFFBEB (very light yellow)
- Border: 1px solid #FCD34D
- Border-radius: lg
- Padding: 20px
- Heading: "Predicted Score" (bold)
- Score range: Large, bold text
- Progress bar: Full width, exam color
- Footer text: Small, italic explanation

### Weak & Strong Topics Section

```
WEAK TOPICS
┌────────────┬────────────┬────────────┐
│ Essay      │ Algebra    │ Geometry   │
│ 8%         │ 28%        │ 32%        │
│ [Practice] │ [Practice] │ [Practice] │
└────────────┴────────────┴────────────┘

STRONG TOPICS
┌────────────┬────────────┬────────────┐
│ Vocabulary │ Grammar    │ Statistics │
│ 92%        │ 88%        │ 85%        │
│ [Maintain] │ [Maintain] │ [Maintain] │
└────────────┴────────────┴────────────┘
```

**Topic Pill Card:**

- Width: calc(33.33% - 11px) on desktop
- Width: calc(50% - 8px) on tablet
- Width: 100% on mobile
- Height: 100px
- Background: varies by section
  - Weak: #FEF2F2 (light red)
  - Strong: #F0FDF4 (light green)
- Border: 1px solid appropriate color
- Border-radius: md
- Padding: 12px
- Button: Smaller btn-primary or btn-secondary
- Hover: Border color brightens

---

## Time Range Filter

```
[Time Range: Last 7 Days ▼]
Options: Today | Last 7 Days | Last 30 Days | All Time
```

---

# Page 7: Exam-Level Study Plan

## Purpose

Provide a personalized, adaptive weekly study schedule specific to the exam.

## Page Layout

```
┌─────────────────────────────────────────────────────┐
│ ← Back    SAT Study Plan               [User]       │ (Navbar)
├─────────────────────────────────────────────────────┤
│                                                     │
│ Your SAT Study Plan                                 │ (Heading 1)
│ 12-week personalized curriculum                    │ (Caption)
│                                                     │
│ [Generate New Plan]  [Adjust Intensity ▼]          │ (Actions)
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ STUDY INTENSITY LEVEL                               │
│ Current: Moderate (10 hours/week)                   │
│ [Light ○] [Moderate ●] [Intensive ○]               │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ WEEK 1: Foundation (Sept 2 - Sept 8)                │ (Week header)
│ Goal: Complete 6 lessons, 150 practice questions   │
│                                                     │
│ ┌─────────────────────────────────────────────┐     │
│ │ MONDAY, SEPT 2                              │     │ (Day header)
│ │ ☀️ Morning Task (30 min)                    │     │
│ │ • Vocabulary: Context Clues [Start] →       │ ☐   │ (With checkbox)
│ │                                             │     │
│ │ 🌙 Evening Task (60 min)                    │     │
│ │ • Grammar: Subject-Verb Agreement [Start] → │ ☐   │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ ┌─────────────────────────────────────────────┐     │
│ │ TUESDAY, SEPT 3                             │     │
│ │ ☀️ Morning Task (45 min)                    │     │
│ │ • Reading: Passage Analysis [Start] →       │ ☑ ✓ │ (Completed)
│ │                                             │     │
│ │ 🌙 Evening Task (60 min)                    │     │
│ │ • Practice: 30 vocab questions [Start] →    │ ☐   │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ ┌─────────────────────────────────────────────┐     │
│ │ ... (Wed - Sun tasks)                       │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ WEEK 1 PROGRESS: 1/12 tasks completed (8%)          │
│ ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 8%          │
│                                                     │
├─────────────────────────────────────────────────────┤
│ (Repeat for Week 2-12)                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│ [Save This Plan]  [Download as PDF]  [Email Plan]  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Study Intensity Selector

```
STUDY INTENSITY LEVEL
Current: Moderate (10 hours/week)

[Light ○]        [Moderate ●]        [Intensive ○]
5 hrs/week       10 hrs/week         15+ hrs/week
```

**Intensity Option Buttons:**

- Background: varies by selection
  - Selected: exam-specific color + white text
  - Unselected: #F3F4F6
- Border: 1px solid #E5E7EB
- Border-radius: md
- Padding: 12px 20px
- Width: calc(33.33% - 8px)
- Cursor: pointer
- Font-weight: 500

### Week Container

```
┌─────────────────────────────────────────────┐
│ WEEK 1: Foundation (Sept 2 - Sept 8)        │
│ Goal: Complete 6 lessons, 150 practice Q's  │
│                                             │
│ (Daily task cards below)                    │
│                                             │
│ WEEK PROGRESS: 1/12 tasks (8%)              │
│ ████░░░░░░░░░░░░░░░░░░░░░░░░░░ 8%          │
└─────────────────────────────────────────────┘
```

**Specifications:**

- Width: 100%
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border-radius: lg
- Padding: 24px
- Margin-bottom: 24px
- Shadow: md

### Day Task Card

```
┌─────────────────────────────────────────┐
│ MONDAY, SEPT 2                          │ (Bold)
│ ☀️ Morning Task (30 min)                │ (Emoji + icon)
│ • Vocabulary: Context Clues [Start] →   │ (Link with arrow)
│                                         │ ☐ (Checkbox)
│ 🌙 Evening Task (60 min)                │ (Emoji + icon)
│ • Grammar: Subject-Verb [Start] →       │ (Link with arrow)
│                                         │ ☐ (Checkbox)
└─────────────────────────────────────────┘
```

**Day Card Specifications:**

- Width: 100%
- Background: #F9FAFB
- Border: 1px solid #E5E7EB
- Border-radius: md
- Padding: 16px
- Margin-bottom: 12px
- Flex: display row with space-between

**Task Item:**

- Font: Body (14px)
- Task link: Blue, underline on hover
- Time estimate: Caption (italic)
- Checkbox: 20x20px, on right side
- Completed state: Checkbox filled ✓, link gray, strikethrough

### Week Progress Summary

```
WEEK 1 PROGRESS: 1/12 tasks completed (8%)
████░░░░░░░░░░░░░░░░░░░░░░░░░░ 8%
```

**Specifications:**

- Progress bar height: 8px
- Color: exam-specific primary
- Border-radius: full
- Margin-top: 16px
- Display below all day cards

### Drag & Drop Rearranging (Desktop)

Tasks can be dragged between time slots:

- Cursor changes to grab (grab icon)
- Hover shows drop zones
- Animation: smooth drop with bounce
- Constraint: Cannot move to completed weeks

### Action Buttons (Bottom)

```
[Save This Plan]  [Download as PDF]  [Email Plan]
```

**Button Specifications:**

- Class: btn-primary or btn-secondary
- Width: auto or flex equal
- Margin-top: 32px
- Sticky footer on mobile

---

# Navigation & Information Architecture

## Global Navigation Structure

```
┌─────────────────────────────────────────────┐
│ Askesis                      🔍 🔔 👤       │ (Navbar - Sticky)
├─────────────────────────────────────────────┤
│ Home                                         │ (Left section)
│ Exams                                        │
│ Dashboard (Today's focus)                    │
│ Analytics                                    │
│ Study Plans                                  │
│ Profile & Settings                           │
└─────────────────────────────────────────────┘
```

### Navbar Design

**Desktop Layout:**

- Logo: Left (clickable → home)
- Navigation links: Center (Home, Exams, Dashboard, Analytics, Study Plans)
- Right icons: Search, Notifications, Profile dropdown
- Active link: Underline + exam-specific color

**Mobile Layout:**

- Logo: Left
- Hamburger menu: Right
- Search & notifications: Hidden (accessible via hamburger)
- Profile: Quick access via icon

### Breadcrumb Navigation (Inside Exam)

```
Home > Exams > SAT > Curriculum > Vocabulary > Practice
```

**Specifications:**

- Font-size: 12px (caption)
- Color: Gray (#6B7280)
- Separator: " > "
- Last item: Bold (current page)
- All except last: Clickable links
- Responsive: Collapse on mobile to show "... > Vocabulary"

### Information Architecture

```
Home Page
├── Exam Selection Page
│   └── Exam Dashboard
│       ├── Curriculum Map
│       │   └── Topic Learning Page
│       │       └── Practice Interface
│       ├── Analytics (Exam-level)
│       ├── Study Plan (Exam-level)
│       └── Mock Exam
├── Global Analytics (Dashboard)
├── Global Study Plans (Overview)
├── Profile & Settings
└── Subscription / Pricing
```

### Inside-Exam Navigation Bar

When user is inside an exam, add an "Exam Context" indicator:

```
SAT Dashboard
[Overview] [Curriculum] [Practice] [Analytics] [Study Plan] [Settings]

Active: highlighted with underline + exam color
```

**Specifications:**

- Position: Sticky below main navbar (or integrated)
- Background: Exam-specific light color
- Text color: Exam-specific primary
- Pills: Optional styling (rounded bg behind each link)

---

# Responsive Design Specifications

## Breakpoints

```
Mobile:    < 768px   (xs, sm)
Tablet:    768-1199px (md, lg)
Desktop:   1200px+   (xl, 2xl)
```

## Page-Specific Responsive Rules

### Exam Selection Page

**Desktop (1200px+):**

- 3-column grid
- Exam card height: 320px fixed
- Hero section: Full width, centered

**Tablet (768-1199px):**

- 2-column grid
- Exam card height: 300px
- Hero section: Full width, centered

**Mobile (< 768px):**

- 1-column stack
- Exam card height: auto (min 280px)
- Hero section: Reduced padding, adjusted font sizes
- Heading 1: 28px (from 40px)
- Heading 2: 22px (from 32px)

### Exam Dashboard

**Desktop:**

- 2-column layout: 60% / 40%
- Sidebar sticky on scroll

**Tablet:**

- 2-column layout: 55% / 45%
- Right sidebar becomes scrollable

**Mobile:**

- 1-column stack (Full width)
- Left column → Top
- Right column → Bottom
- Quick action cards: 2x3 grid → 2x2 grid → 1x6 stack
- Height: min 100px → auto

### Curriculum Page

**Desktop:**

- 4-column grid (topic cards)

**Tablet:**

- 3-column grid

**Mobile:**

- 2-column grid
- Section headers: Sticky on scroll (optional)

### Topic Learning Page

**All Sizes:**

- Single column (content flows vertically)
- Learning materials width: 100% max-width 800px (centered if wider)

**Mobile specifics:**

- Heading 2: 28px (from 32px)
- Body text: 16px
- Padding: 16px (from 24px)
- Card padding: 16px (from 24px)

### Practice Interface

**All Sizes:**

- Question card: Full width, centered
- Answer options: 2 columns desktop, 1 column mobile
- Max-width: 700px (centered if wider screen)

**Mobile:**

- Question font: 16px (from 18px)
- Answer option height: 70px (from 80px)
- Padding: 16px (from 32px)

### Analytics Page

**Desktop:**

- 4-column metric grid
- Charts: 100% width
- Weak/Strong topics: 3 columns

**Tablet:**

- 2-column metric grid
- Charts: 100% width
- Weak/Strong topics: 2 columns

**Mobile:**

- 1-column metric grid
- Charts: Full width (scrollable if needed)
- Weak/Strong topics: 1 column
- Hide some metrics (show summary instead)

### Study Plan Page

**All Sizes:**

- Full width (single column)
- Week container: 100%
- Day card: 100%

**Mobile:**

- Intensity selector: Stack vertically or 2x2
- Hide week number badge (show inline)
- Drag-drop disabled (use checkboxes only)
- Time estimates: Collapse into abbr. (30m → 30m)

## Touch Targets (Mobile)

- Minimum button height: 44px
- Minimum touch target: 44x44px
- Padding between targets: 8px minimum
- Link underline: 4px padding

## Font Scaling (Mobile)

```
Base: 16px body text
Mobile: Reduce by 2-4px where needed
Headlines: Never smaller than 24px
Captions: Never smaller than 12px
```

## Image & Asset Scaling

- Exam icons: 64x64px (desktop) → 48x48px (mobile)
- Hero background: Full width, scale to fit
- Charts: Responsive via D3/Recharts (scale axes, reduce margins on mobile)

---

# Design System Component Library

## Color Theme Generator (Per Exam)

Create CSS variables for each exam:

```css
:root {
  /* SAT Theme */
  --exam-sat-primary: #4f46e5; /* Indigo */
  --exam-sat-accent: #f59e0b; /* Amber */
  --exam-sat-light: #eef2ff;
  --exam-sat-border: #c7d2fe;

  /* ACT Theme */
  --exam-act-primary: #06b6d4; /* Cyan */
  --exam-act-accent: #ec4899; /* Pink */
  --exam-act-light: #ecfdfd;
  --exam-act-border: #a5f3fc;

  /* GRE Theme */
  --exam-gre-primary: #8b5cf6; /* Violet */
  --exam-gre-accent: #14b8a6; /* Teal */
  --exam-gre-light: #f5f3ff;
  --exam-gre-border: #ddd6fe;

  /* GMAT Theme */
  --exam-gmat-primary: #10b981; /* Emerald */
  --exam-gmat-accent: #6366f1; /* Indigo */
  --exam-gmat-light: #ecfdf5;
  --exam-gmat-border: #a7f3d0;

  /* SHSAT Theme */
  --exam-shsat-primary: #f97316; /* Orange */
  --exam-shsat-accent: #3b82f6; /* Blue */
  --exam-shsat-light: #ffedd5;
  --exam-shsat-border: #fdba74;

  /* Regents Theme */
  --exam-regents-primary: #dc2626; /* Red */
  --exam-regents-accent: #fbbf24; /* Gold */
  --exam-regents-light: #fef2f2;
  --exam-regents-border: #fecaca;
}

/* Usage */
[data-exam="sat"] .exam-card {
  border-color: var(--exam-sat-border);
  background: var(--exam-sat-light);
}

[data-exam="sat"] .btn-primary {
  background: var(--exam-sat-primary);
}
```

---

## Deliverable Checklist

### ✅ Mockup Pages

- [x] Exam Selection Page (responsive)
- [x] Exam Dashboard (responsive)
- [x] Curriculum Structure (responsive)
- [x] Topic Learning Page (responsive)
- [x] Practice Interface (responsive)
- [x] Exam-Level Analytics (responsive)
- [x] Exam-Level Study Plan (responsive)

### ✅ Design System

- [x] Color palette (primary + exam-specific)
- [x] Typography hierarchy
- [x] Spacing system (8px base)
- [x] Component library (cards, buttons, badges)
- [x] Shadows & borders
- [x] Interactive states (hover, active, disabled)

### ✅ Responsive Design

- [x] Mobile (< 768px)
- [x] Tablet (768-1199px)
- [x] Desktop (1200px+)
- [x] Touch targets (44px minimum)
- [x] Font scaling rules

### ✅ Navigation

- [x] Global navbar
- [x] Exam context navigation
- [x] Breadcrumb trails
- [x] Information architecture

### ✅ Interactive Features

- [x] Adaptive difficulty feedback (Practice page)
- [x] Exam selection persistence
- [x] Progress tracking (all pages)
- [x] Study plan drag & drop (desktop)
- [x] Analytics time-range filtering

---

## Next Steps for Implementation

1. **Create Figma/Sketch prototype** based on this spec
2. **Implement frontend pages** starting with Exam Selection → Dashboard
3. **Set up CSS variables** for exam-specific theming
4. **Build reusable components** (ExamCard, TopicCard, ProgressBar)
5. **Add state management** for selected exam across pages
6. **Implement responsive layouts** using Tailwind/CSS Grid
7. **Connect to backend** for data binding
8. **Add animations** (page transitions, card reveals)
9. **Test accessibility** (WCAG 2.1 AA compliance)
10. **Collect user feedback** and iterate

---

**Document Complete — Ready for Development**
