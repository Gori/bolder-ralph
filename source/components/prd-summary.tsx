import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import Spinner from 'ink-spinner';
import {type PrdContent} from '../lib/types.js';

type Props = {
	readonly prd: PrdContent | undefined;
	readonly isLoading: boolean;
	readonly isSaving: boolean;
	readonly outputPath: string;
	readonly onSave: () => void;
	readonly onBack: () => void;
};

export default function PrdSummary({
	prd,
	isLoading,
	isSaving,
	outputPath,
	onSave,
	onBack,
}: Props) {
	const [selectedIndex, setSelectedIndex] = useState(0);

	// Options: "Go Back" and "Save PRD"
	const options = ['Go Back', 'Save PRD'];

	useInput((_input, key) => {
		if (isLoading || isSaving) return;

		if (key.upArrow) {
			setSelectedIndex(Math.max(0, selectedIndex - 1));
		} else if (key.downArrow) {
			setSelectedIndex(Math.min(options.length - 1, selectedIndex + 1));
		} else if (key.return) {
			if (selectedIndex === 0) {
				onBack();
			} else {
				onSave();
			}
		} else if (key.escape || key.leftArrow) {
			onBack();
		}
	});

	if (isLoading) {
		return (
			<Box flexDirection="column" paddingX={1}>
				<Box>
					<Text color="cyan">
						<Spinner type="dots" />
					</Text>
					<Text color="gray"> Generating your PRD...</Text>
				</Box>
			</Box>
		);
	}

	if (isSaving) {
		return (
			<Box flexDirection="column" paddingX={1}>
				<Box>
					<Text color="cyan">
						<Spinner type="dots" />
					</Text>
					<Text color="gray"> Saving to {outputPath}...</Text>
				</Box>
			</Box>
		);
	}

	if (!prd) {
		return (
			<Box flexDirection="column" paddingX={1}>
				<Text color="red">Error: PRD not generated</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text bold color="cyan">
				PRD Summary
			</Text>
			<Text dimColor color="gray">
				Review your product requirements document
			</Text>

			<Box marginTop={1} flexDirection="column">
				{/* Idea Name */}
				<Box marginBottom={1}>
					<Text bold color="yellow">
						{prd.ideaName}
					</Text>
				</Box>

				{/* Overall Idea */}
				<Box flexDirection="column" marginBottom={1}>
					<Text color="gray">What it is:</Text>
					<Text>{prd.overallIdea}</Text>
				</Box>

				{/* Purpose */}
				<Box flexDirection="column" marginBottom={1}>
					<Text color="gray">Purpose:</Text>
					<Text>{prd.purpose}</Text>
				</Box>

				{/* Audience */}
				<Box flexDirection="column" marginBottom={1}>
					<Text color="gray">Audience:</Text>
					<Text>{prd.audience}</Text>
				</Box>

				{/* Product Type */}
				<Box flexDirection="column" marginBottom={1}>
					<Text color="gray">Type:</Text>
					<Text>{prd.productType}</Text>
				</Box>

				{/* Features count */}
				<Box flexDirection="column" marginBottom={1}>
					<Text color="gray">Features:</Text>
					<Text color="green">{prd.features.length} features defined</Text>
				</Box>
			</Box>

			{/* Actions */}
			<Box marginTop={1} flexDirection="column">
				{options.map((option, index) => {
					const isSelected = index === selectedIndex;
					const isSaveOption = index === 1;
					return (
						<Box key={option}>
							<Text
								color={isSelected ? (isSaveOption ? 'green' : 'cyan') : 'gray'}
							>
								{isSelected ? '❯ ' : '  '}
							</Text>
							<Text
								color={isSelected ? (isSaveOption ? 'green' : 'white') : 'gray'}
								bold={isSelected}
							>
								{option}
							</Text>
						</Box>
					);
				})}
			</Box>

			<Box marginTop={1}>
				<Text dimColor color="gray">
					↑↓ Navigate | Enter = select | ← = back
				</Text>
			</Box>
		</Box>
	);
}
