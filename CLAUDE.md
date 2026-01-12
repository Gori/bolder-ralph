# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Build**: `npm run build` - Compiles TypeScript to JavaScript in `dist/`
- **Dev**: `npm run dev` - Watches and recompiles on changes
- **Test**: `npm run test` - Runs Prettier check, XO linting, and AVA tests
- **Run single test**: `npx ava test.tsx -m "test name pattern"`
- **Run CLI locally**: `node dist/cli.js --name=World`

## Architecture

This is an [Ink](https://github.com/vadimdemedes/ink) CLI application - a React-based framework for building terminal UIs.

- `source/cli.tsx` - Entry point, parses CLI flags with [meow](https://github.com/sindresorhus/meow), renders the App
- `source/app.tsx` - Main React component rendered to the terminal
- `test.tsx` - AVA tests using ink-testing-library

TypeScript source lives in `source/`, compiled output goes to `dist/`. The CLI entry point is `dist/cli.js`.

## Code Style

- Uses tabs for indentation
- XO for linting with xo-react config
- Prettier for formatting (@vdemedes/prettier-config)
- `react/prop-types` rule is disabled (uses TypeScript types instead)
