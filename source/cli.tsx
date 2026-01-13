#!/usr/bin/env node
// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config.js';
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ bolder-ralph

	Options
		--output, -o  Output file path (default: prd-output.md)

	Examples
	  $ bolder-ralph
	  $ bolder-ralph --output=my-product-prd.md
`,
	{
		importMeta: import.meta,
		flags: {
			output: {
				type: 'string',
				shortFlag: 'o',
				default: 'prd-output.md',
			},
		},
	},
);

render(<App outputPath={cli.flags.output} />);
