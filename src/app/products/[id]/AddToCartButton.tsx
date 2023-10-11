"use client";

import { useSearchParams } from "next/navigation";

import SubmitButton from "@/ui/components/SubmitButton";
import { addToCart } from "./actions";

export default function AddToCartButton() {
	const searchParams = useSearchParams();
	const variant = searchParams.get("variant");

	if (!variant) {
		return null;
	}

	const handleOnClick = () => {
		void addToCart(variant);
	};

	return (
		<form action={handleOnClick} className="flex w-full">
			<SubmitButton type="submit">Add to cart</SubmitButton>
		</form>
	);
}
