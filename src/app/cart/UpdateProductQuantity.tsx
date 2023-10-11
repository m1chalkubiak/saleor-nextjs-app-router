"use client";

import { experimental_useOptimistic as useOptimistic } from "react";

import { changeProductQuantity } from "./actions";

export default function UpdateProductQuantity({
	lineId,
	quantity,
	lines,
}: {
	lineId: string;
	quantity: number;
	lines: { lineId: string; quantity: number }[];
}) {
	const [optimisticQuantity, setOptimisticQuantity] = useOptimistic(quantity);

	const updateQuantity = async (newQuantity: number) => {
		setOptimisticQuantity(newQuantity);

		const lineIndex = lines.findIndex((line) => line.lineId === lineId);

		lines[lineIndex].quantity = newQuantity;

		await changeProductQuantity(lines);
	};

	const handleIncrementAction = async () => {
		await updateQuantity(optimisticQuantity + 1);
	};

	const handleDecrementAction = async () => {
		await updateQuantity(optimisticQuantity - 1);
	};

	return (
		<form>
			<button
				className="mr-2 rounded-md border px-4 py-2 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={optimisticQuantity <= 1}
				formAction={() => void handleDecrementAction()}
			>
				-
			</button>
			<span className="w-8 text-center">{optimisticQuantity}</span>
			<button
				className="ml-2 rounded-md border px-4 py-2 hover:bg-slate-100"
				formAction={() => void handleIncrementAction()}
			>
				+
			</button>
		</form>
	);
}
