#!/usr/bin/env node
// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config.js';
import process from 'node:process';
import React from 'react';
import {render} from 'ink';
import App from './app.js';
import {type OutputFormat} from './lib/types.js';

type ParsedArgs = {
	output: string;
	format: OutputFormat;
};

function getDefaultExtension(format: OutputFormat): string {
	switch (format) {
		case 'json':
			return '.json';
		case 'toon':
			return '.toon';
		default:
			return '.md';
	}
}

// Simple argument parsing
function parseArgs(): ParsedArgs {
	const args = process.argv.slice(2);
	let output: string | undefined;
	let format: OutputFormat = 'markdown';

	for (const arg of args) {
		if (arg.startsWith('--output=')) {
			output = arg.slice('--output='.length);
		} else if (arg.startsWith('-o=')) {
			output = arg.slice('-o='.length);
		} else if (arg.startsWith('--format=')) {
			const fmt = arg.slice('--format='.length);
			if (fmt === 'json' || fmt === 'toon' || fmt === 'markdown' || fmt === 'md') {
				format = fmt === 'md' ? 'markdown' : fmt;
			}
		} else if (arg.startsWith('-f=')) {
			const fmt = arg.slice('-f='.length);
			if (fmt === 'json' || fmt === 'toon' || fmt === 'markdown' || fmt === 'md') {
				format = fmt === 'md' ? 'markdown' : fmt;
			}
		} else if (arg === '--help' || arg === '-h') {
			console.log(`
Ralph - Turn your brain dump into a PRD

Usage
  $ ralph [options]

Options
  --output, -o  Output file path (default: prd-output.md)
  --format, -f  Output format: markdown, json, toon (default: markdown)
  --help, -h    Show this help

Examples
  $ ralph
  $ ralph --format=json
  $ ralph --format=toon --output=my-product.toon
`);
			process.exit(0);
		}
	}

	// Default output filename based on format if not specified
	if (!output) {
		output = `prd-output${getDefaultExtension(format)}`;
	}

	return {output, format};
}

const flags = parseArgs();
render(<App outputPath={flags.output} format={flags.format} />);
