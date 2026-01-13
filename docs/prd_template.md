# PRD TEMPLATE (STRICT)

---

## Mandatory vs Optional Sections (Global)

### Mandatory Sections
These **must exist** in every PRD:
- 0. What This Is
- 1. Product Purpose
- 2. Basic Tech Stack
- 3. Product Shape
- 4. Feature List
- 5. Feature Details
- 6. Feature Build Order
- 7. Non-Features
- 8. Constraints
- 9. Definition of Works
- 10. Stop Rules

### Optional Sections
These **may exist** but are not required:
- External Libraries (inside #2)
- Feature-specific notes
- Known limitations
- Future ideas

If a mandatory section is missing, the PRD is incomplete.

---

## 0. What This Is (MANDATORY)

**Purpose**  
Define the concrete artifact being built.

**Instructions**  
One sentence. Noun-based.

**Example**
> A local CLI tool that generates PRD files via interactive prompts.

---

## 1. Product Purpose (MANDATORY)

**Purpose**  
Explain why this product exists.

**Instructions**  
One or two sentences.

**Example**
> This tool exists to make it fast and consistent to create feature-focused PRDs.

---

## 2. Basic Tech Stack (MANDATORY)

**Purpose**  
Set implementation expectations and boundaries.

**Instructions**  
List core stack items.  
External libraries are optional.

**Example**
- Language: TypeScript
- Runtime: Node.js
- Interface: CLI
- Output Format: Markdown
- External Services: OpenAI-compatible LLM API

### External Libraries (OPTIONAL)
List only if there is a strong preference.

**Example**
- Commander.js (CLI parsing)
- Zod (input validation)

If omitted, the developer may choose alternatives.

---

## 3. Product Shape (MANDATORY)

**Purpose**  
Clarify how users interact with the product.

**Instructions**  
Bullets only.

**Example**
- Invoked from terminal
- Interactive question flow
- Single output file per run
- No background processes

---

## 4. Feature List (MANDATORY)

**Purpose**  
Define the full behavioral scope.

**Instructions**  
List feature names only.

**Example**
- Question flow
- Answer storage
- PRD generation
- File output

---

## 5. Feature Details (MANDATORY)

Repeat for **every feature listed above**.

---

### Feature: <Feature Name>

**Purpose**  
Why this feature exists.

**Example**
> Collect all information needed to generate a PRD.

---

**What It Does**  
Observable behavior.

**Example**
> Prompts the user with questions and records answers.

---

**How It Works**  
Concrete steps.

**Example**
1. Display question  
2. Read user input  
3. Validate input  
4. Store result  

---

**Inputs**
- <Input description>

**Outputs**
- <Output description>

**Failure Modes**
- <Failure case> → <Behavior>

---

## 6. Feature Build Order (MANDATORY)

**Purpose**  
Define the exact order features must be implemented.

**Instructions**  
List features in build order.  
Order must reference names from **Feature List**.

**Example**
1. Question flow  
2. Answer storage  
3. PRD generation  
4. File output  

Features should not be implemented out of order unless explicitly stated.

---

## 7. Non-Features (MANDATORY)

**Purpose**  
Define what the product will not do.

**Instructions**  
Short, direct bullets.

**Example**
- No GUI
- No user accounts
- No cloud syncing

---

## 8. Constraints (MANDATORY)

**Purpose**  
Define hard limits.

**Instructions**  
Rules, not preferences.

**Example**
- Must run on macOS and Linux
- Must not write outside current directory
- Must not invent PRD sections

---

## 9. Definition of Works (MANDATORY)

**Purpose**  
Define the minimum acceptable outcome.

**Instructions**  
Observable and verifiable.

**Example**
> Running the tool produces a Markdown PRD that matches this template exactly.

---

## 10. Stop Rules (MANDATORY)

**Purpose**  
Prevent overbuilding.

**Instructions**  
Explicit stopping conditions.

**Ex**
