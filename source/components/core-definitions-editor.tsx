import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import Spinner from 'ink-spinner';
import {
	type CoreDefinitions,
	type CoreDefinitionOptions,
} from '../lib/types.js';
import CoreDefinitionSelector from './core-definition-selector.js';

type DefinitionField =
	| 'ideaName'
	| 'overallIdea'
	| 'purpose'
	| 'audience'
	| 'productType';

const fieldOrder: DefinitionField[] = [
	'ideaName',
	'overallIdea',
	'purpose',
	'audience',
	'productType',
];

const fieldLabels: Record<
	DefinitionField,
	{label: string; description: string}
> = {
	ideaName: {
		label: 'Idea Name',
		description: 'A short, memorable name for your product',
	},
	overallIdea: {
		label: 'Overall Idea',
		description: 'What is this product? (1-2 sentences)',
	},
	purpose: {
		label: 'Purpose',
		description: 'Why does this product need to exist?',
	},
	audience: {
		label: 'Audience',
		description: 'Who is this for?',
	},
	productType: {
		label: 'Product Type',
		description: 'What kind of digital product is this?',
	},
};

type Props = {
	readonly definitions: CoreDefinitions;
	readonly options: CoreDefinitionOptions | undefined;
	readonly isLoading: boolean;
	readonly onUpdate: (field: DefinitionField, value: string) => void;
	readonly onComplete: () => void;
	readonly onBack: () => void;
};

export default function CoreDefinitionsEditor({
	definitions,
	options,
	isLoading,
	onUpdate,
	onComplete,
	onBack,
}: Props) {
	const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
	const [isEditing, setIsEditing] = useState(false);

	const currentField = fieldOrder[currentFieldIndex];

	// Auto-advance to first empty field, or to Continue if all filled
	useEffect(() => {
		if (!isLoading && options && !isEditing) {
			const firstEmptyIndex = fieldOrder.findIndex(
				field => !definitions[field],
			);
			if (firstEmptyIndex >= 0) {
				setCurrentFieldIndex(firstEmptyIndex);
				setIsEditing(true);
			} else {
				// All fields filled, cursor to Continue
				setCurrentFieldIndex(fieldOrder.length);
			}
		}
	}, [isLoading, options, definitions, isEditing]);

	useInput((_input, key) => {
		if (isEditing || isLoading) return;

		if (key.upArrow) {
			setCurrentFieldIndex(Math.max(0, currentFieldIndex - 1));
		} else if (key.downArrow) {
			setCurrentFieldIndex(Math.min(fieldOrder.length, currentFieldIndex + 1));
		} else if (key.return) {
			if (currentFieldIndex === fieldOrder.length) {
				// "Continue" selected
				onComplete();
			} else {
				setIsEditing(true);
			}
		} else if (key.escape || key.leftArrow) {
			onBack();
		}
	});

	const handleFieldSelect = (value: string) => {
		if (currentField) {
			onUpdate(currentField, value);
		}

		setIsEditing(false);
		// Move to next field
		if (currentFieldIndex < fieldOrder.length - 1) {
			setCurrentFieldIndex(currentFieldIndex + 1);
			setIsEditing(true);
		}
	};

	const handleFieldBack = () => {
		setIsEditing(false);
		if (currentFieldIndex > 0) {
			setCurrentFieldIndex(currentFieldIndex - 1);
		} else {
			onBack();
		}
	};

	if (isLoading) {
		return (
			<Box flexDirection="column" paddingX={1}>
				<Box>
					<Text color="cyan">
						<Spinner type="dots" />
					</Text>
					<Text color="gray"> Generating options based on your input...</Text>
				</Box>
			</Box>
		);
	}

	if (isEditing && currentField && options) {
		const fieldInfo = fieldLabels[currentField];
		return (
			<CoreDefinitionSelector
				key={currentField}
				label={fieldInfo.label}
				description={fieldInfo.description}
				options={options[currentField]}
				currentValue={definitions[currentField]}
				onSelect={handleFieldSelect}
				onBack={handleFieldBack}
			/>
		);
	}

	// Show overview of all fields
	const allFieldsFilled = fieldOrder.every(field => definitions[field]);

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text bold color="cyan">
				Core Definitions
			</Text>
			<Text dimColor color="gray">
				Define the fundamentals of your product
			</Text>
			<Box marginTop={1} flexDirection="column">
				{fieldOrder.map((field, index) => {
					const isSelected = index === currentFieldIndex && !isEditing;
					const fieldInfo = fieldLabels[field];
					const value = definitions[field];
					return (
						<Box key={field} flexDirection="column" marginBottom={1}>
							<Box>
								<Text color={isSelected ? 'cyan' : 'gray'}>
									{isSelected ? '❯ ' : '  '}
								</Text>
								<Text color={isSelected ? 'cyan' : 'white'} bold={isSelected}>
									{fieldInfo.label}:
								</Text>
							</Box>
							<Box marginLeft={4}>
								{value ? (
									<Text color="green">{value}</Text>
								) : (
									<Text dimColor color="gray">
										Not set
									</Text>
								)}
							</Box>
						</Box>
					);
				})}
				<Box marginTop={1}>
					<Text
						color={currentFieldIndex === fieldOrder.length ? 'green' : 'gray'}
						bold={currentFieldIndex === fieldOrder.length}
					>
						{currentFieldIndex === fieldOrder.length ? '❯ ' : '  '}
						{allFieldsFilled ? '[Continue →]' : '[Fill all fields to continue]'}
					</Text>
				</Box>
			</Box>
			<Box marginTop={1}>
				<Text dimColor color="gray">
					↑↓ Navigate | Enter = edit/continue | ← = back
				</Text>
			</Box>
		</Box>
	);
}
