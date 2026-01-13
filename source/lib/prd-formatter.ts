import {type PrdContent, type OutputFormat} from './types.js';

function escapeCsv(value: string): string {
	if (value.includes(',') || value.includes('"') || value.includes('\n')) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

export function formatPrdAsJson(prd: PrdContent): string {
	return JSON.stringify(prd, null, 2);
}

export function formatPrdAsToon(prd: PrdContent): string {
	const lines: string[] = [
		`ideaName: ${prd.ideaName}`,
		`overallIdea: ${prd.overallIdea}`,
		`purpose: ${prd.purpose}`,
		`audience: ${prd.audience}`,
		`productType: ${prd.productType}`,
		`definitionOfDone: ${prd.definitionOfDone}`,
		'',
		`techStack[${prd.techStack.length}]{category,technology}:`,
	];

	for (const item of prd.techStack) {
		lines.push(`  ${escapeCsv(item.category)},${escapeCsv(item.technology)}`);
	}

	lines.push('', `features[${prd.features.length}]{shortName,description,purpose,userStories}:`);

	for (const feature of prd.features) {
		const stories = feature.userStories.join('|');
		lines.push(
			`  ${escapeCsv(feature.shortName)},${escapeCsv(feature.description)},${escapeCsv(feature.purpose)},${escapeCsv(stories)}`,
		);
	}

	lines.push('', `nonFeatures[${prd.nonFeatures.length}]:`);
	for (const item of prd.nonFeatures) {
		lines.push(`  ${escapeCsv(item)}`);
	}

	lines.push('', `constraints[${prd.constraints.length}]:`);
	for (const item of prd.constraints) {
		lines.push(`  ${escapeCsv(item)}`);
	}

	return lines.join('\n');
}

export function formatPrd(prd: PrdContent, format: OutputFormat = 'markdown'): string {
	if (format === 'json') {
		return formatPrdAsJson(prd);
	}
	if (format === 'toon') {
		return formatPrdAsToon(prd);
	}
	return formatPrdAsMarkdown(prd);
}

export function formatPrdAsMarkdown(prd: PrdContent): string {
	const lines: string[] = [
		`# ${prd.ideaName}`,
		'',
		'---',
		'',
		'## 0. What This Is',
		'',
		prd.overallIdea,
		'',
		'---',
		'',
		'## 1. Purpose',
		'',
		prd.purpose,
		'',
		'---',
		'',
		'## 2. Audience',
		'',
		prd.audience,
		'',
		'---',
		'',
		'## 3. Product Type',
		'',
		prd.productType,
		'',
		'---',
		'',
		'## 4. Tech Stack',
		'',
	];

	for (const item of prd.techStack) {
		lines.push(`- **${item.category}**: ${item.technology}`);
	}

	lines.push('', '---', '', '## 5. Features', '');

	for (const feature of prd.features) {
		lines.push(
			`### ${feature.shortName}`,
			'',
			feature.description,
			'',
			`**Purpose:** ${feature.purpose}`,
			'',
			'**User Stories:**',
		);

		for (const story of feature.userStories) {
			lines.push(`- ${story}`);
		}

		lines.push('');
	}

	lines.push('---', '', '## 6. Non-Features', '');

	for (const item of prd.nonFeatures) {
		lines.push(`- ${item}`);
	}

	lines.push('', '---', '', '## 7. Constraints', '');

	for (const constraint of prd.constraints) {
		lines.push(`- ${constraint}`);
	}

	lines.push(
		'',
		'---',
		'',
		'## 8. Definition of Done',
		'',
		prd.definitionOfDone,
		'',
	);

	return lines.join('\n');
}
