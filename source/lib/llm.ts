import process from 'node:process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {generateObject} from 'ai';
import {openai} from '@ai-sdk/openai';
import {z} from 'zod';
import {
	type CoreDefinitions,
	type CoreDefinitionOptions,
	type Feature,
	type PrdContent,
} from './types.js';

const model = openai(process.env['OPENAI_MODEL'] ?? 'gpt-5.2-2025-12-11');

// Load system prompt from docs/prompt.md
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptPath = path.resolve(__dirname, '../../../docs/prompt.md');
const systemPrompt = readFileSync(promptPath, 'utf8');

/**
 * Generate options for all core definitions based on user input
 */
export async function generateCoreDefinitionOptions(
	mainQuestion: string,
	brainDump: string,
): Promise<CoreDefinitionOptions> {
	const context = `
Main idea (one sentence):
${mainQuestion}

Additional details:
${brainDump || 'No additional details provided.'}
`;

	const {object} = await generateObject({
		model,
		system: systemPrompt,
		prompt: `${context}

IMPORTANT: Always respond in English, regardless of the input language.

Generate 3 options for each core definition. Be CONCISE - no fluff, no filler words.

1. Idea Name - 1-3 words, catchy and memorable
2. Overall Idea - ONE short sentence, what is it?
3. Purpose - ONE short sentence, why build it?
4. Audience - 3-6 words describing who it's for
5. Product Type - e.g., "web app", "CLI tool", "mobile app", "API service"

First option = best recommendation. Keep it punchy and clear.`,
		schema: z.object({
			ideaName: z.array(z.string()).length(3),
			overallIdea: z.array(z.string()).length(3),
			purpose: z.array(z.string()).length(3),
			audience: z.array(z.string()).length(3),
			productType: z.array(z.string()).length(3),
		}),
	});

	return object;
}

/**
 * Generate features list based on all gathered information
 */
export async function generateFeatures(
	mainQuestion: string,
	brainDump: string,
	definitions: CoreDefinitions,
): Promise<Feature[]> {
	const context = `
Product Name: ${definitions.ideaName}
What it is: ${definitions.overallIdea}
Purpose: ${definitions.purpose}
Audience: ${definitions.audience}
Type: ${definitions.productType}

Original idea:
${mainQuestion}

Additional details:
${brainDump || 'None'}
`;

	const {object} = await generateObject({
		model,
		system: systemPrompt,
		prompt: `${context}

IMPORTANT: Always respond in English, regardless of the input language.

Generate features for this product. Write like the best PM ever - one who trusts their developer.

Rules:
- Focus on WHAT and WHY, never HOW
- No implementation details (no "using X", "via Y", "with Z")
- Describe user outcomes, not technical mechanisms

For each feature:
- shortName: 2-4 words (e.g., "User Auth", "Data Export", "Search")
- description: ONE sentence - what can the user do?
- purpose: ONE sentence - why does this matter?
- userStories: 1-2 user goals (e.g., "Find items quickly", "Resume later")

Order by build priority. Be concise.`,
		schema: z.object({
			features: z.array(
				z.object({
					shortName: z.string(),
					description: z.string(),
					purpose: z.string(),
					userStories: z.array(z.string()),
				}),
			),
		}),
	});

	return object.features.map((f, index) => ({
		id: `feature-${index}-${Date.now()}`,
		...f,
	}));
}

/**
 * Regenerate a single feature based on context
 */
export async function regenerateFeature(
	feature: Feature,
	mainQuestion: string,
	brainDump: string,
	definitions: CoreDefinitions,
): Promise<Feature> {
	const context = `
Product Name: ${definitions.ideaName}
What it is: ${definitions.overallIdea}
Purpose: ${definitions.purpose}
Audience: ${definitions.audience}
Type: ${definitions.productType}

Original idea:
${mainQuestion}

Additional details:
${brainDump || 'None'}

Current feature to regenerate:
- Short Name: ${feature.shortName}
- Description: ${feature.description}
`;

	const {object} = await generateObject({
		model,
		system: systemPrompt,
		prompt: `${context}

IMPORTANT: Always respond in English, regardless of the input language.

Regenerate this feature. Write like a PM who trusts their developer.

- Focus on WHAT and WHY, never HOW
- No implementation details
- shortName: 2-4 words
- description: ONE sentence - what can the user do?
- purpose: ONE sentence - why does this matter?
- userStories: 1-2 user goals`,
		schema: z.object({
			shortName: z.string(),
			description: z.string(),
			purpose: z.string(),
			userStories: z.array(z.string()),
		}),
	});

	return {
		id: feature.id,
		...object,
	};
}

/**
 * Generate a new feature based on a short name
 */
export async function generateNewFeature(
	shortName: string,
	mainQuestion: string,
	brainDump: string,
	definitions: CoreDefinitions,
): Promise<Feature> {
	const context = `
Product Name: ${definitions.ideaName}
What it is: ${definitions.overallIdea}
Purpose: ${definitions.purpose}
Audience: ${definitions.audience}
Type: ${definitions.productType}

Original idea:
${mainQuestion}

Additional details:
${brainDump || 'None'}

New feature name provided by user: ${shortName}
`;

	const {object} = await generateObject({
		model,
		system: systemPrompt,
		prompt: `${context}

IMPORTANT: Always respond in English, regardless of the input language.

Generate this feature. Write like a PM who trusts their developer.

- Focus on WHAT and WHY, never HOW
- No implementation details
- shortName: 2-4 words
- description: ONE sentence - what can the user do?
- purpose: ONE sentence - why does this matter?
- userStories: 1-2 user goals`,
		schema: z.object({
			shortName: z.string(),
			description: z.string(),
			purpose: z.string(),
			userStories: z.array(z.string()),
		}),
	});

	return {
		id: `feature-${Date.now()}`,
		...object,
	};
}

/**
 * Generate the complete PRD
 */
export async function generatePrd(
	mainQuestion: string,
	brainDump: string,
	definitions: CoreDefinitions,
	features: Feature[],
): Promise<PrdContent> {
	const context = `
Product Name: ${definitions.ideaName}
What it is: ${definitions.overallIdea}
Purpose: ${definitions.purpose}
Audience: ${definitions.audience}
Type: ${definitions.productType}

Original idea:
${mainQuestion}

Additional details:
${brainDump || 'None'}

Features:
${features
	.map((f, i) => `${i + 1}. ${f.shortName}: ${f.description}`)
	.join('\n')}
`;

	const {object} = await generateObject({
		model,
		system: systemPrompt,
		prompt: `${context}

IMPORTANT: Always respond in English, regardless of the input language.

Generate PRD details. Be CONCISE - no fluff.

1. Tech Stack - list specific technologies (e.g., "React", "PostgreSQL", "Node.js")
2. Non-Features - 3-5 short statements of what this WON'T do
3. Constraints - 3-5 hard limits/rules, one sentence each
4. Definition of Done - 2-3 sentences, minimum viable outcome for v1`,
		schema: z.object({
			techStack: z.array(
				z.object({
					category: z.string(),
					technology: z.string(),
				}),
			),
			nonFeatures: z.array(z.string()),
			constraints: z.array(z.string()),
			definitionOfDone: z.string(),
		}),
	});

	return {
		ideaName: definitions.ideaName,
		overallIdea: definitions.overallIdea,
		purpose: definitions.purpose,
		audience: definitions.audience,
		productType: definitions.productType,
		features,
		techStack: object.techStack,
		nonFeatures: object.nonFeatures,
		constraints: object.constraints,
		definitionOfDone: object.definitionOfDone,
	};
}
