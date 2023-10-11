"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

import Button from "@/ui/atoms/Button";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
};

export default function SubmitButton({ children, ...props }: SubmitButtonProps) {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" pending={pending} {...props}>
			{children}
		</Button>
	);
}
