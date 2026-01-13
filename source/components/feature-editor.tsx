import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import TextInput from 'ink-text-input';
import {type Feature} from '../lib/types.js';

type EditField = 'shortName' | 'description' | 'purpose' | 'userStories';

type Props = {
	readonly feature: Feature;
	readonly onSave: (feature: Feature) => void;
	readonly onCancel: () => void;
};

export default function FeatureEditor({feature, onSave, onCancel}: Props) {
	const [editedFeature, setEditedFeature] = useState<Feature>({...feature});
	const [currentField, setCurrentField] = useState<EditField>('shortName');
	const [userStoryInput, setUserStoryInput] = useState('');

	const fields: EditField[] = [
		'shortName',
		'description',
		'purpose',
		'userStories',
	];
	const fieldIndex = fields.indexOf(currentField);

	useInput((_input, key) => {
		if (key.escape) {
			onCancel();
		} else if (key.tab) {
			// Move to next field
			const nextIndex = (fieldIndex + 1) % fields.length;
			setCurrentField(fields[nextIndex] ?? 'shortName');
		}
	});

	const handleFieldChange = (field: EditField, value: string) => {
		if (field === 'userStories') {
			setUserStoryInput(value);
		} else {
			setEditedFeature({...editedFeature, [field]: value});
		}
	};

	const handleFieldSubmit = (field: EditField) => {
		if (field === 'userStories' && userStoryInput.trim()) {
			setEditedFeature({
				...editedFeature,
				userStories: [...editedFeature.userStories, userStoryInput.trim()],
			});
			setUserStoryInput('');
		} else if (field === 'userStories') {
			// Empty submit on user stories = save feature
			onSave(editedFeature);
		} else {
			// Move to next field
			const nextIndex = fieldIndex + 1;
			if (nextIndex < fields.length) {
				setCurrentField(fields[nextIndex] ?? 'shortName');
			} else {
				onSave(editedFeature);
			}
		}
	};

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text bold color="cyan">
				Edit Feature
			</Text>

			<Box marginTop={1} flexDirection="column">
				{/* Short Name */}
				<Box flexDirection="column" marginBottom={1}>
					<Text color={currentField === 'shortName' ? 'cyan' : 'gray'}>
						Short Name:
					</Text>
					{currentField === 'shortName' ? (
						<Box>
							<Text color="green">&gt; </Text>
							<TextInput
								value={editedFeature.shortName}
								onChange={v => {
									handleFieldChange('shortName', v);
								}}
								onSubmit={() => {
									handleFieldSubmit('shortName');
								}}
							/>
						</Box>
					) : (
						<Text color="white">{editedFeature.shortName || '(empty)'}</Text>
					)}
				</Box>

				{/* Description */}
				<Box flexDirection="column" marginBottom={1}>
					<Text color={currentField === 'description' ? 'cyan' : 'gray'}>
						Description:
					</Text>
					{currentField === 'description' ? (
						<Box>
							<Text color="green">&gt; </Text>
							<TextInput
								value={editedFeature.description}
								onChange={v => {
									handleFieldChange('description', v);
								}}
								onSubmit={() => {
									handleFieldSubmit('description');
								}}
							/>
						</Box>
					) : (
						<Text color="white">{editedFeature.description || '(empty)'}</Text>
					)}
				</Box>

				{/* Purpose */}
				<Box flexDirection="column" marginBottom={1}>
					<Text color={currentField === 'purpose' ? 'cyan' : 'gray'}>
						Purpose:
					</Text>
					{currentField === 'purpose' ? (
						<Box>
							<Text color="green">&gt; </Text>
							<TextInput
								value={editedFeature.purpose}
								onChange={v => {
									handleFieldChange('purpose', v);
								}}
								onSubmit={() => {
									handleFieldSubmit('purpose');
								}}
							/>
						</Box>
					) : (
						<Text color="white">{editedFeature.purpose || '(empty)'}</Text>
					)}
				</Box>

				{/* User Stories */}
				<Box flexDirection="column" marginBottom={1}>
					<Text color={currentField === 'userStories' ? 'cyan' : 'gray'}>
						User Stories / Goals:
					</Text>
					{editedFeature.userStories.map((story, index) => (
						<Box key={`story-${index}`}>
							<Text color="gray">• </Text>
							<Text color="white">{story}</Text>
							{currentField === 'userStories' && (
								<Text dimColor color="red">
									{' '}
									(d to delete)
								</Text>
							)}
						</Box>
					))}
					{currentField === 'userStories' && (
						<Box>
							<Text color="green">&gt; </Text>
							<TextInput
								value={userStoryInput}
								placeholder="Add user story or press Enter to save..."
								onChange={v => {
									handleFieldChange('userStories', v);
								}}
								onSubmit={() => {
									handleFieldSubmit('userStories');
								}}
							/>
						</Box>
					)}
				</Box>
			</Box>

			<Box marginTop={1}>
				<Text dimColor color="gray">
					Tab = next field | Enter = save field | Esc = cancel
				</Text>
			</Box>
		</Box>
	);
}
