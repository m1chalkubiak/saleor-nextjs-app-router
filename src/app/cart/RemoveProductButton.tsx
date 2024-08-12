"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";

import { removeProduct } from "./actions";
import Placeholder from "@/ui/atoms/Placeholder";

const RemoveButton = () => {
	const { pending } = useFormStatus();

	return (
		<>
			{pending ? (
				<Placeholder />
			) : (
				<button
					type="submit"
					className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:ml-0 sm:mt-3"
				>
					<span>Remove</span>
				</button>
			)}
		</>
	);
};

export default function RemoveProductButton({ lineId }: { lineId: string }) {
	const handleRemoveProduct = async () => {
		await removeProduct(lineId);
	};

	return (
		<form action={() => void handleRemoveProduct()}>
			<RemoveButton />
		</form>
	);
}
