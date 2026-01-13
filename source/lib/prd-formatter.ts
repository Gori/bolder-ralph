import {type PrdContent} from './types.js';

export function formatPrd(prd: PrdContent): string {
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
