# bolder-ralph

A local interactive CLI tool that turns an unstructured brain dump into a structured PRD by asking adaptive follow-up questions using an LLM.

## Prerequisites

- Node.js >= 16
- An OpenAI API key

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the project:

```bash
npm run build
```

3. Configure environment:

```bash
cp .env.example .env
# Edit .env with your OpenAI API key
```

## Usage

Run the CLI:

```bash
node dist/source/cli.js
```

Or with a custom output file:

```bash
node dist/source/cli.js --output=my-product-prd.md
```

### How It Works

1. **Brain Dump** - Describe your product idea freely (press Enter for new lines, Ctrl+Enter when done)
2. **Review Assumptions** - The LLM generates assumptions about your product. Confirm (Y), reject (N), or skip (Enter) each one
3. **Answer Questions** - Answer adaptive follow-up questions to clarify requirements. You can skip any question and the LLM will fill in reasonable defaults
4. **Get Your PRD** - A complete PRD matching the template in `docs/prd_template.md` is generated and saved

### CLI Options

```
Usage
  $ bolder-ralph

Options
  --output, -o  Output file path (default: prd-output.md)

Examples
  $ bolder-ralph
  $ bolder-ralph --output=my-product-prd.md
```

## Development

```bash
# Watch mode (recompile on changes)
npm run dev

# Run tests
npm run test

# Build
npm run build
```

## License

MIT
