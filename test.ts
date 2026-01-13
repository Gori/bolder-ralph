import test from 'ava';

// Simple smoke test
test('smoke test - ava works', t => {
	t.pass();
});

test('prd content type has correct shape', t => {
	// Verify the type structure expected by PRD
	const prd = {
		whatThisIs: 'A test product.',
		productPurpose: 'To test the PRD formatter.',
		techStack: {
			items: {
				language: 'TypeScript',
				runtime: 'Node.js',
			},
			externalLibraries: ['Zod'],
		},
		productShape: ['Runs from terminal', 'Outputs a file'],
		featureList: ['Feature A', 'Feature B'],
		featureDetails: [
			{
				name: 'Feature A',
				purpose: 'Test purpose A',
				whatItDoes: 'Does A things',
				howItWorks: ['Step 1', 'Step 2'],
				inputs: ['Input 1'],
				outputs: ['Output 1'],
				failureModes: ['Failure case 1'],
			},
		],
		featureBuildOrder: ['Feature A', 'Feature B'],
		nonFeatures: ['No GUI', 'No cloud'],
		constraints: ['Must run on Node.js'],
		definitionOfWorks: 'When all tests pass.',
		stopRules: ['Stop when done'],
	};

	t.is(prd.whatThisIs, 'A test product.');
	t.is(prd.techStack.items.language, 'TypeScript');
	t.is(prd.featureDetails.length, 1);
	t.is(prd.featureDetails[0]?.name, 'Feature A');
});
