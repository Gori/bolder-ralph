import React, {useState} from 'react';
import {Box, Text} from 'ink';
import TextInput from 'ink-text-input';

type Props = {
	readonly onSubmit: (value: string) => void;
};

export default function MainQuestionInput({onSubmit}: Props) {
	const [value, setValue] = useState('');

	const handleSubmit = (input: string) => {
		if (input.trim()) {
			onSubmit(input.trim());
		}
	};

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text bold color="cyan">
				What do you want to build?
			</Text>
			<Text dimColor color="gray">
				In one sentence, describe what you&apos;re trying to do.
			</Text>
			<Box marginTop={1}>
				<Text color="green">&gt; </Text>
				<TextInput
					value={value}
					placeholder="A tool that..."
					onChange={setValue}
					onSubmit={handleSubmit}
				/>
			</Box>
		</Box>
	);
}
