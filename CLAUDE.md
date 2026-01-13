# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Build**: `npm run build` - Compiles TypeScript to JavaScript in `dist/`
- **Dev**: `npm run dev` - Watches and recompiles on changes
- **Test**: `npm run test` - Runs Prettier check, XO linting, and AVA tests
- **Run single test**: `npx ava test.ts -m "test name pattern"`
- **Run CLI locally**: `node dist/source/cli.js --output=my-prd.md`

## Architecture

This is an interactive CLI tool that generates PRDs from unstructured brain dumps using an LLM. Built with [Ink](https://github.com/vadimdemedes/ink) (React for terminals) and [Vercel AI SDK](https://github.com/vercel/ai).

### Source Structure

- `source/cli.tsx` - Entry point, parses CLI flags with meow, renders App
- `source/app.tsx` - Main orchestration component, manages phases (brain-dump → assumptions → questioning → synthesizing → complete)
- `source/components/` - UI components:
  - `brain-dump-input.tsx` - Multiline text input for initial idea capture
  - `assumption-review.tsx` - Y/N/Skip review of generated assumptions
  - `question-renderer.tsx` - Renders text/single-choice/multi-choice/confirm questions
- `source/lib/` - Core logic:
  - `types.ts` - Zod schemas and TypeScript types for questions, answers, PRD content
  - `llm.ts` - LLM integration: generates assumptions, questions, assumed answers, and final PRD
  - `prd-formatter.ts` - Converts PrdContent to markdown matching docs/prd_template.md

### Data Flow

1. User enters brain dump (free-form text)
2. LLM generates assumptions → user reviews
3. Adaptive questioning loop: LLM decides what to ask based on collected info
4. User can skip questions → LLM fills in assumed answers
5. LLM synthesizes final PRD when enough info gathered
6. PRD written to markdown file

### Key Files

- `docs/prd.md` - PRD for this project
- `docs/prd_template.md` - Template the output must conform to
- `docs/prompt.md` - System prompt instructions for the LLM

## Code Style

- Uses tabs for indentation
- XO for linting with xo-react config
- Prettier for formatting (@vdemedes/prettier-config)
- Props must be readonly
- Use kebab-case for file names
- Use camelCase for function/variable names

## Environment

Copy `.env.example` to `.env` and configure:

- `OPENAI_API_KEY` - Required for LLM integration
- `OPENAI_MODEL` - Model to use (defaults to gpt-5.2-2025-12-11)

The system prompt is loaded from `docs/prompt.md` at runtime.
