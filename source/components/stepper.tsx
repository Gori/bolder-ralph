import React from 'react';
import {Box, Text} from 'ink';

type Step = {
	readonly name: string;
};

type Props = {
	readonly steps: readonly Step[];
	readonly currentStep: number;
};

export default function Stepper({steps, currentStep}: Props) {
	return (
		<Box flexDirection="row" marginBottom={1}>
			{steps.map((step, index) => {
				const isCompleted = index < currentStep;
				const isCurrent = index === currentStep;
				const isLast = index === steps.length - 1;

				let color: string;
				let symbol: string;

				if (isCompleted) {
					color = 'green';
					symbol = '\u2714'; // Checkmark
				} else if (isCurrent) {
					color = 'cyan';
					symbol = '\u25CF'; // Filled circle
				} else {
					color = 'gray';
					symbol = '\u25CB'; // Empty circle
				}

				return (
					<Box key={index}>
						<Text color={color}>
							{symbol} {step.name}
						</Text>
						{!isLast && <Text color="gray"> {'\u2500\u2500'} </Text>}
					</Box>
				);
			})}
		</Box>
	);
}
