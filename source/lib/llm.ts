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

const model = openai(process.env['OPENAI_MODEL'] ?? 'gpt-4o');

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

Based on the user's input, generate 3 options for each of these core product definitions.
Each option should be 1-2 sentences maximum. Make them distinct but all reasonable.
The first option should be the best/recommended one.

1. Idea Name - A short, memorable name for the product
2. Overall Idea - What is this product? (noun-based definition)
3. Purpose - Why does this product need to exist?
4. Audience - Who is this for?
5. Product Type - What kind of digital product is this? (e.g., web app, mobile app, CLI tool, backend service, browser extension, etc.)`,
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

Based on all the information above, generate a comprehensive list of features for this product.
Include both features explicitly mentioned by the user AND features needed to complete the user's intent.
Order them by build priority (most important/foundational first).

For each feature provide:
- shortName: A brief, descriptive name (2-5 words)
- description: What this feature does (1-2 sentences)
- purpose: Why this feature exists / what problem it solves
- userStories: 1-3 user stories or goals this feature addresses`,
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

Regenerate this feature with a fresh perspective. Keep the general concept but improve the description, purpose, and user stories.`,
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

Based on the feature name provided, generate the full feature details that fit the product context.`,
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

Generate a complete PRD based on all the information above.
Use the exact features provided - do not add or remove features.

Include:
1. Tech Stack - Appropriate technologies for the product type
2. Non-Features - What this product will NOT do (important boundaries)
3. Constraints - Hard limits and rules
4. Definition of Done - Minimum acceptable outcome for v1`,
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
