import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import TextInput from 'ink-text-input';

type Props = {
	readonly onSubmit: (value: string) => void;
	readonly onBack: () => void;
};

export default function BrainDumpInput({onSubmit, onBack}: Props) {
	const [lines, setLines] = useState<string[]>([]);
	const [currentLine, setCurrentLine] = useState('');

	useInput((_input, key) => {
		if (key.escape) {
			// Submit all lines
			const fullText = [...lines, currentLine].filter(l => l.trim()).join('\n');
			onSubmit(fullText);
		} else if (
			key.backspace &&
			currentLine === '' &&
			lines.length > 0 &&
			(key.meta || key.ctrl)
		) {
			// Allow going back if at start
			onBack();
		}
	});

	const handleLineSubmit = (value: string) => {
		if (value.trim()) {
			setLines([...lines, value.trim()]);
		}

		setCurrentLine('');
	};

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text bold color="cyan">
				Do you have anything more to add?
			</Text>
			<Text dimColor color="gray">
				Add details about how it should work, tech preferences, audience,
				constraints...
			</Text>
			<Text dimColor color="gray">
				Press Enter after each thought. Press Esc when done (or leave empty to
				skip).
			</Text>
			<Box marginTop={1} flexDirection="column">
				{lines.map((line, index) => (
					<Text key={`line-${index}`} color="white">
						<Text color="gray">• </Text>
						{line}
					</Text>
				))}
				<Box>
					<Text color="green">&gt; </Text>
					<TextInput
						value={currentLine}
						placeholder={
							lines.length === 0
								? 'Type here or press Esc to skip...'
								: 'Add more or press Esc to continue...'
						}
						onChange={setCurrentLine}
						onSubmit={handleLineSubmit}
					/>
				</Box>
			</Box>
			<Box marginTop={1}>
				<Text dimColor color="gray">
					Enter = save line | Esc = continue | Ctrl+Backspace = go back
				</Text>
			</Box>
		</Box>
	);
}
