import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import TextInput from 'ink-text-input';

type Props = {
	readonly label: string;
	readonly description: string;
	readonly options: string[];
	readonly currentValue: string;
	readonly onSelect: (value: string) => void;
	readonly onBack: () => void;
};

export default function CoreDefinitionSelector({
	label,
	description,
	options,
	currentValue,
	onSelect,
	onBack,
}: Props) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isCustom, setIsCustom] = useState(false);
	const [customValue, setCustomValue] = useState('');

	// Options + "Write your own"
	const allOptions = [...options, 'Write your own'];

	useInput((_input, key) => {
		if (isCustom) {
			if (key.escape) {
				setIsCustom(false);
				setCustomValue('');
			}

			return;
		}

		if (key.upArrow) {
			setSelectedIndex(Math.max(0, selectedIndex - 1));
		} else if (key.downArrow) {
			setSelectedIndex(Math.min(allOptions.length - 1, selectedIndex + 1));
		} else if (key.return) {
			if (selectedIndex === options.length) {
				// "Write your own" selected
				setIsCustom(true);
			} else {
				onSelect(options[selectedIndex] ?? '');
			}
		} else if (key.escape || key.leftArrow) {
			onBack();
		}
	});

	const handleCustomSubmit = (value: string) => {
		if (value.trim()) {
			onSelect(value.trim());
		} else {
			setIsCustom(false);
		}
	};

	if (isCustom) {
		return (
			<Box flexDirection="column" paddingX={1}>
				<Text bold color="cyan">
					{label}
				</Text>
				<Text dimColor color="gray">
					Write your own (max 2 sentences):
				</Text>
				<Box marginTop={1}>
					<Text color="green">&gt; </Text>
					<TextInput
						value={customValue}
						onChange={setCustomValue}
						onSubmit={handleCustomSubmit}
					/>
				</Box>
				<Box marginTop={1}>
					<Text dimColor color="gray">
						Enter = save | Esc = cancel
					</Text>
				</Box>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text bold color="cyan">
				{label}
			</Text>
			<Text dimColor color="gray">
				{description}
			</Text>
			{currentValue && (
				<Box marginTop={1}>
					<Text color="gray">Current: </Text>
					<Text color="yellow">{currentValue}</Text>
				</Box>
			)}
			<Box marginTop={1} flexDirection="column">
				{allOptions.map((option, index) => {
					const isSelected = index === selectedIndex;
					const isWriteOwn = index === options.length;
					return (
						<Box key={`option-${index}`}>
							<Text color={isSelected ? 'cyan' : undefined}>
								{isSelected ? '❯ ' : '  '}
							</Text>
							<Text
								color={isWriteOwn ? 'magenta' : isSelected ? 'white' : 'gray'}
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
