import { Controller, Control } from "react-hook-form";
import React from "react";
import { Input } from "./input";

interface NumberInputWithSeparatorProps {
	control: Control<any>; // Use generic type for more specific form values
	name: string;
	className?: string;
}

const formatNumberWithThousandSeparator = (value: number) => {
	const numericValue = Number(value.toString().replace(/,/g, ""));
	return isNaN(numericValue) ? "" : numericValue.toLocaleString();
};

const NumberInput: React.FC<NumberInputWithSeparatorProps> = React.forwardRef(
	({ control, name, className }, ref) => {
		return (
			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, onBlur, value, name, ref } }) => (
					<Input
						name={name}
						className={className}
						ref={ref}
						value={formatNumberWithThousandSeparator(value)}
						onBlur={onBlur}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							const cleanValue = e.target.value.replace(/,/g, "");
							onChange(parseInt(cleanValue)); // Send the numeric value to the form
						}}
						// Additional properties for the Input component can be added here
					/>
				)}
			/>
		);
	}
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
