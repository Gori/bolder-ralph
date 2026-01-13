import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import Spinner from 'ink-spinner';
import {type Feature} from '../lib/types.js';
import FeatureEditor from './feature-editor.js';

type Mode = 'list' | 'edit' | 'add' | 'delete-confirm';

type Props = {
	readonly features: Feature[];
	readonly isLoading: boolean;
	readonly onUpdate: (features: Feature[]) => void;
	readonly onRegenerate: (feature: Feature) => void;
	readonly onGenerateNew: () => void;
	readonly onComplete: () => void;
	readonly onBack: () => void;
};

export default function FeaturesList({
	features,
	isLoading,
	onUpdate,
	onRegenerate,
	onGenerateNew,
	onComplete,
	onBack,
}: Props) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [mode, setMode] = useState<Mode>('list');
	const [editingFeature, setEditingFeature] = useState<Feature | undefined>();

	// List items: features + "Add new" + "Continue"
	const totalItems = features.length + 2;

	useInput((input, key) => {
		if (mode !== 'list' || isLoading) return;

		const inputLower = input.toLowerCase();

		if (key.upArrow) {
			setSelectedIndex(Math.max(0, selectedIndex - 1));
		} else if (key.downArrow) {
			setSelectedIndex(Math.min(totalItems - 1, selectedIndex + 1));
		} else if (key.return) {
			if (selectedIndex < features.length) {
				// Edit feature
				setEditingFeature(features[selectedIndex]);
				setMode('edit');
			} else if (selectedIndex === features.length) {
				// Add new
				onGenerateNew();
			} else {
				// Continue
				onComplete();
			}
		} else if (key.leftArrow && selectedIndex < features.length) {
			// Delete confirmation
			setMode('delete-confirm');
		} else if (key.rightArrow && selectedIndex < features.length) {
			// Regenerate
			const feature = features[selectedIndex];
			if (feature) {
				onRegenerate(feature);
			}
		} else if (key.escape) {
			onBack();
		} else if (inputLower === 'd' && selectedIndex < features.length) {
			// Delete shortcut
			setMode('delete-confirm');
		}
	});

	useInput((input, key) => {
		if (mode !== 'delete-confirm') return;

		const inputLower = input.toLowerCase();

		if (inputLower === 'y') {
			const newFeatures = features.filter((_, i) => i !== selectedIndex);
			onUpdate(newFeatures);
			setSelectedIndex(Math.min(selectedIndex, newFeatures.length - 1));
			setMode('list');
		} else if (inputLower === 'n' || key.escape) {
			setMode('list');
		}
	});

	const handleFeatureSave = (feature: Feature) => {
		if (mode === 'add') {
			onUpdate([...features, feature]);
		} else {
			const newFeatures = features.map((f, i) =>
				i === selectedIndex ? feature : f,
			);
			onUpdate(newFeatures);
		}

		setMode('list');
		setEditingFeature(undefined);
	};

	const handleFeatureCancel = () => {
		setMode('list');
		setEditingFeature(undefined);
	};

	if (isLoading) {
		return (
			<Box flexDirection="column" paddingX={1}>
				<Box>
					<Text color="cyan">
						<Spinner type="dots" />
					</Text>
					<Text color="gray"> Generating features...</Text>
				</Box>
			</Box>
		);
	}

	if (mode === 'edit' && editingFeature) {
		return (
			<FeatureEditor
				feature={editingFeature}
				onSave={handleFeatureSave}
				onCancel={handleFeatureCancel}
			/>
		);
	}

	if (mode === 'delete-confirm') {
		const feature = features[selectedIndex];
		return (
			<Box flexDirection="column" paddingX={1}>
				<Text bold color="red">
					Delete Feature?
				</Text>
				<Box marginTop={1}>
					<Text>
						Are you sure you want to delete &quot;{feature?.shortName}&quot;?
					</Text>
				</Box>
				<Box marginTop={1}>
					<Text color="yellow">[Y]es</Text>
					<Text> / </Text>
					<Text color="gray">[N]o</Text>
				</Box>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text bold color="cyan">
				Features
			</Text>
			<Text dimColor color="gray">
				Review and edit the features for your product
			</Text>

			<Box marginTop={1} flexDirection="column">
				{features.map((feature, index) => {
					const isSelected = index === selectedIndex;
					return (
						<Box key={feature.id} flexDirection="column" marginBottom={1}>
							<Box>
								<Text color={isSelected ? 'cyan' : 'gray'}>
									{isSelected ? '❯ ' : '  '}
								</Text>
								<Text color={isSelected ? 'white' : 'gray'} bold={isSelected}>
									{feature.shortName}
								</Text>
							</Box>
							<Box marginLeft={4}>
								<Text dimColor color="gray">
									{feature.description}
								</Text>
							</Box>
						</Box>
					);
				})}

				{/* Add new feature */}
				<Box marginTop={1}>
					<Text
						color={selectedIndex === features.length ? 'magenta' : 'gray'}
						bold={selectedIndex === features.length}
					>
						{selectedIndex === features.length ? '❯ ' : '  '}
						[+ Add new feature]
					</Text>
				</Box>

				{/* Continue */}
				<Box marginTop={1}>
					<Text
						color={selectedIndex === features.length + 1 ? 'green' : 'gray'}
						bold={selectedIndex === features.length + 1}
					>
						{selectedIndex === features.length + 1 ? '❯ ' : '  '}
						[Continue →]
					</Text>
				</Box>
			</Box>

			<Box marginTop={1}>
				<Text dimColor color="gray">
					↑↓ Navigate | Enter = edit | ← Delete | → Regenerate | Esc = back
				</Text>
			</Box>
		</Box>
	);
}
