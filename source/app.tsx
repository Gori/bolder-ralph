import React, {useState, useEffect} from 'react';
import {Box, Text, useApp, useStdout} from 'ink';
import fs from 'fs-extra';
import Header from './components/header.js';
import Stepper from './components/stepper.js';
import MainQuestionInput from './components/main-question-input.js';
import BrainDumpInput from './components/brain-dump-input.js';
import CoreDefinitionsEditor from './components/core-definitions-editor.js';
import FeaturesList from './components/features-list.js';
import PrdSummary from './components/prd-summary.js';
import {
	type AppPhase,
	type CoreDefinitions,
	type CoreDefinitionOptions,
	type Feature,
	type PrdContent,
	type OutputFormat,
} from './lib/types.js';
import {
	generateCoreDefinitionOptions,
	generateFeatures,
	regenerateFeature,
	generateNewFeature,
	generatePrd,
} from './lib/llm.js';
import {formatPrd} from './lib/prd-formatter.js';

const steps = [
	{name: 'Idea'},
	{name: 'Details'},
	{name: 'Define'},
	{name: 'Features'},
	{name: 'Save'},
] as const;

type Props = {
	readonly outputPath?: string;
	readonly format?: OutputFormat;
};

function getStepIndex(phase: AppPhase): number {
	switch (phase) {
		case 'main-question': {
			return 0;
		}

		case 'brain-dump': {
			return 1;
		}

		case 'core-definitions': {
			return 2;
		}

		case 'features': {
			return 3;
		}

		case 'summary':
		case 'complete': {
			return 4;
		}

		default: {
			return 0;
		}
	}
}

const emptyDefinitions: CoreDefinitions = {
	ideaName: '',
	overallIdea: '',
	purpose: '',
	audience: '',
	productType: '',
};

export default function App({outputPath = 'prd-output.md', format = 'markdown'}: Props) {
	const {exit} = useApp();
	const {stdout} = useStdout();

	// App state
	const [phase, setPhase] = useState<AppPhase>('main-question');
	const [mainQuestion, setMainQuestion] = useState('');
	const [brainDump, setBrainDump] = useState('');
	const [definitions, setDefinitions] =
		useState<CoreDefinitions>(emptyDefinitions);
	const [definitionOptions, setDefinitionOptions] = useState<
		CoreDefinitionOptions | undefined
	>();
	const [features, setFeatures] = useState<Feature[]>([]);
	const [prd, setPrd] = useState<PrdContent | undefined>();

	// Loading states
	const [isLoadingOptions, setIsLoadingOptions] = useState(false);
	const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);
	const [isLoadingPrd, setIsLoadingPrd] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// Error state
	const [error, setError] = useState<string | undefined>();

	// Step 1: Handle main question submission
	const handleMainQuestion = (value: string) => {
		setMainQuestion(value);
		setPhase('brain-dump');
	};

	// Step 2: Handle brain dump submission
	const handleBrainDump = (value: string) => {
		setBrainDump(value);
		setPhase('core-definitions');
		// Trigger options generation
		setIsLoadingOptions(true);
	};

	// Generate options when entering core-definitions phase
	useEffect(() => {
		if (phase !== 'core-definitions' || !isLoadingOptions) return;

		const fetchOptions = async () => {
			try {
				const options = await generateCoreDefinitionOptions(
					mainQuestion,
					brainDump,
				);
				setDefinitionOptions(options);
			} catch (error_: unknown) {
				setError(
					error_ instanceof Error
						? error_.message
						: 'Failed to generate options',
				);
			} finally {
				setIsLoadingOptions(false);
			}
		};

		void fetchOptions();
	}, [phase, isLoadingOptions, mainQuestion, brainDump]);

	// Step 3: Handle core definition update
	const handleDefinitionUpdate = (
		field: keyof CoreDefinitions,
		value: string,
	) => {
		setDefinitions(previous => ({...previous, [field]: value}));
	};

	// Step 3: Handle core definitions complete
	const handleDefinitionsComplete = () => {
		setPhase('features');
		setIsLoadingFeatures(true);
	};

	// Generate features when entering features phase
	useEffect(() => {
		if (phase !== 'features' || !isLoadingFeatures) return;

		const fetchFeatures = async () => {
			try {
				const generatedFeatures = await generateFeatures(
					mainQuestion,
					brainDump,
					definitions,
				);
				setFeatures(generatedFeatures);
			} catch (error_: unknown) {
				setError(
					error_ instanceof Error
						? error_.message
						: 'Failed to generate features',
				);
			} finally {
				setIsLoadingFeatures(false);
			}
		};

		void fetchFeatures();
	}, [phase, isLoadingFeatures, mainQuestion, brainDump, definitions]);

	// Step 4: Handle feature regeneration
	const handleRegenerateFeature = async (feature: Feature) => {
		setIsLoadingFeatures(true);
		try {
			const newFeature = await regenerateFeature(
				feature,
				mainQuestion,
				brainDump,
				definitions,
			);
			setFeatures(previous =>
				previous.map(f => (f.id === feature.id ? newFeature : f)),
			);
		} catch (error_: unknown) {
			setError(
				error_ instanceof Error
					? error_.message
					: 'Failed to regenerate feature',
			);
		} finally {
			setIsLoadingFeatures(false);
		}
	};

	// Step 4: Handle new feature generation
	const handleGenerateNewFeature = async () => {
		setIsLoadingFeatures(true);
		try {
			const newFeature = await generateNewFeature(
				'New Feature',
				mainQuestion,
				brainDump,
				definitions,
			);
			setFeatures(previous => [...previous, newFeature]);
		} catch (error_: unknown) {
			setError(
				error_ instanceof Error
					? error_.message
					: 'Failed to generate new feature',
			);
		} finally {
			setIsLoadingFeatures(false);
		}
	};

	// Step 4: Handle features complete
	const handleFeaturesComplete = () => {
		setPhase('summary');
		setIsLoadingPrd(true);
	};

	// Generate PRD when entering summary phase
	useEffect(() => {
		if (phase !== 'summary' || !isLoadingPrd) return;

		const fetchPrd = async () => {
			try {
				const generatedPrd = await generatePrd(
					mainQuestion,
					brainDump,
					definitions,
					features,
				);
				setPrd(generatedPrd);
			} catch (error_: unknown) {
				setError(
					error_ instanceof Error ? error_.message : 'Failed to generate PRD',
				);
			} finally {
				setIsLoadingPrd(false);
			}
		};

		void fetchPrd();
	}, [phase, isLoadingPrd, mainQuestion, brainDump, definitions, features]);

	// Step 5: Handle save
	const handleSave = async () => {
		if (!prd) return;

		setIsSaving(true);
		try {
			const content = formatPrd(prd, format);
			await fs.writeFile(outputPath, content, 'utf8');
			setPhase('complete');
		} catch (error_: unknown) {
			setError(error_ instanceof Error ? error_.message : 'Failed to save PRD');
		} finally {
			setIsSaving(false);
		}
	};

	// Exit when complete
	useEffect(() => {
		if (phase === 'complete') {
			setTimeout(() => {
				exit();
			}, 2000);
		}
	}, [phase, exit]);

	// Navigation handlers
	const goBack = () => {
		switch (phase) {
			case 'brain-dump': {
				setPhase('main-question');
				break;
			}

			case 'core-definitions': {
				setPhase('brain-dump');
				break;
			}

			case 'features': {
				setPhase('core-definitions');
				break;
			}

			case 'summary': {
				setPhase('features');
				break;
			}

			default: {
				// No-op for main-question and complete phases
				break;
			}
		}
	};

	const terminalHeight = stdout?.rows ?? 24;

	// Render current input based on phase
	const renderInput = () => {
		if (error) {
			return (
				<Box paddingX={1}>
					<Text color="red">Error: {error}</Text>
				</Box>
			);
		}

		switch (phase) {
			case 'main-question': {
				return <MainQuestionInput onSubmit={handleMainQuestion} />;
			}

			case 'brain-dump': {
				return <BrainDumpInput onSubmit={handleBrainDump} onBack={goBack} />;
			}

			case 'core-definitions': {
				return (
					<CoreDefinitionsEditor
						definitions={definitions}
						options={definitionOptions}
						isLoading={isLoadingOptions}
						onUpdate={handleDefinitionUpdate}
						onComplete={handleDefinitionsComplete}
						onBack={goBack}
					/>
				);
			}

			case 'features': {
				return (
					<FeaturesList
						features={features}
						isLoading={isLoadingFeatures}
						onUpdate={setFeatures}
						onRegenerate={handleRegenerateFeature}
						onGenerateNew={handleGenerateNewFeature}
						onComplete={handleFeaturesComplete}
						onBack={goBack}
					/>
				);
			}

			case 'summary': {
				return (
					<PrdSummary
						prd={prd}
						isLoading={isLoadingPrd}
						isSaving={isSaving}
						outputPath={outputPath}
						format={format}
						onSave={handleSave}
						onBack={goBack}
					/>
				);
			}

			case 'complete': {
				return (
					<Box paddingX={1} flexDirection="column">
						<Text bold color="green">
							Happy happy joy joy!
						</Text>
						<Text>
							Your PRD has been saved to <Text color="cyan">{outputPath}</Text>
						</Text>
						<Text dimColor color="gray">
							Now go build something amazing.
						</Text>
					</Box>
				);
			}

			default: {
				return <Text color="gray">Loading...</Text>;
			}
		}
	};

	return (
		<Box flexDirection="column" height={terminalHeight}>
			{/* History area - scrolls up like chat */}
			<Box flexDirection="column" flexGrow={1} overflow="hidden">
				<Header />
				{/* Show completed context */}
				<Box marginTop={1} flexDirection="column" paddingX={1}>
					{mainQuestion && (
						<Text>
							<Text color="gray">Idea: </Text>
							<Text color="white">{mainQuestion}</Text>
						</Text>
					)}
					{brainDump && (
						<Text>
							<Text color="gray">Details: </Text>
							<Text color="white">
								{brainDump.length > 60
									? brainDump.slice(0, 60) + '...'
									: brainDump}
							</Text>
						</Text>
					)}
					{definitions.ideaName && (
						<Text>
							<Text color="gray">Name: </Text>
							<Text bold color="yellow">
								{definitions.ideaName}
							</Text>
						</Text>
					)}
					{definitions.overallIdea && (
						<Text>
							<Text color="gray">What: </Text>
							<Text color="white">{definitions.overallIdea}</Text>
						</Text>
					)}
					{definitions.purpose && (
						<Text>
							<Text color="gray">Why: </Text>
							<Text color="white">{definitions.purpose}</Text>
						</Text>
					)}
					{definitions.audience && (
						<Text>
							<Text color="gray">For: </Text>
							<Text color="white">{definitions.audience}</Text>
						</Text>
					)}
					{definitions.productType && (
						<Text>
							<Text color="gray">Type: </Text>
							<Text color="white">{definitions.productType}</Text>
						</Text>
					)}
					{features.length > 0 && phase !== 'features' && (
						<Text>
							<Text color="gray">Features: </Text>
							<Text color="green">{features.length} defined</Text>
							<Text color="gray">
								{' '}
								({features.map(f => f.shortName).join(', ')})
							</Text>
						</Text>
					)}
				</Box>
			</Box>

			{/* Divider */}
			<Box>
				<Text dimColor>{'─'.repeat(stdout?.columns ?? 80)}</Text>
			</Box>

			{/* Bottom area - stepper and input */}
			<Box flexDirection="column">
				<Box marginBottom={1}>
					<Stepper currentStep={getStepIndex(phase)} steps={[...steps]} />
				</Box>
				{renderInput()}
			</Box>
		</Box>
	);
}
