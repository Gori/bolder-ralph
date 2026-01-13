# Ralph

---

## 0. What This Is

A local interactive CLI tool that turns an unstructured brain dump into a structured PRD through a guided, colorful conversation that makes product definition feel effortless.

---

## 1. Purpose

Allow users to create high-quality PRDs without thinking in advance about structure, order, or completeness. Make the process feel like a friendly conversation, not paperwork.

---

## 2. Audience

Developers, designers, and product people who want to build things but hate writing formal documents. People who think in brain dumps, not bullet points.

---

## 3. Product Type

Interactive CLI tool built with Ink (React for terminals).

---

## 4. Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Interface**: Interactive CLI
- **UI Framework**: Ink
- **Output Format**: Markdown
- **LLM Integration**: Vercel AI SDK (OpenAI)

### External Libraries
- Ink + ink-gradient + ink-big-text + ink-spinner
- Zod
- fs-extra
- Vercel AI SDK

---

## 5. Features

### Main Question Input

Captures the core idea in one sentence.

**Purpose:** Get the essential concept without overwhelming the user.

**User Stories:**
- As a user, I want to describe my idea quickly so I can start defining it
- As a user, I want a simple prompt so I don't feel intimidated

---

### Brain Dump Input

Captures additional unstructured details about the product.

**Purpose:** Let users add anything useful without forcing structure.

**User Stories:**
- As a user, I want to add technical preferences, audience info, constraints
- As a user, I want to add as much or as little as I want
- As a user, I want each thought saved as I type it

---

### Core Definitions Editor

Defines the five fundamental aspects of the product with AI-generated options.

**Purpose:** Establish clear product identity through guided selection.

**User Stories:**
- As a user, I want AI to suggest good names for my product
- As a user, I want to choose from options rather than write everything
- As a user, I want to write my own if the suggestions don't fit

The five core definitions:
1. Idea Name - A short, memorable name
2. Overall Idea - What this product is (noun-based)
3. Purpose - Why this needs to exist
4. Audience - Who this is for
5. Product Type - What kind of digital product (web, mobile, CLI, etc.)

---

### Features List Editor

Manages the list of product features with full CRUD operations.

**Purpose:** Define exactly what the product will do.

**User Stories:**
- As a user, I want AI to generate features based on my input
- As a user, I want to edit any feature's details
- As a user, I want to delete features that don't fit
- As a user, I want to regenerate a feature with AI
- As a user, I want to add new features

Each feature includes:
- Short name
- Description
- Purpose
- User stories / goals

---

### PRD Summary & Save

Shows the complete PRD and allows saving to file.

**Purpose:** Review the final output and create the artifact.

**User Stories:**
- As a user, I want to see a summary before saving
- As a user, I want to go back and make changes
- As a user, I want to save as a markdown file

---

## 6. Non-Features

- No section-by-section prompting
- No fixed question order
- No GUI outside the terminal
- No cloud storage
- No real-time collaboration
- No monetization or business model sections
- No startup jargon

---

## 7. Constraints

- Must allow going back at any step
- Must generate AI options for every core definition
- Must let user write their own if AI options don't fit
- Must use Ink for all interactive UI
- Must always communicate in English regardless of input language
- Must be colorful and visually pleasing
- Must show loading indicators during AI operations

---

## 8. Definition of Done

A user can:
1. Enter their idea in one sentence
2. Optionally add brain dump details
3. Select or write core definitions from AI-generated options
4. Review and edit a generated features list
5. Save a complete PRD markdown file

The experience should feel like a helpful conversation, not form-filling.
