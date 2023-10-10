"use client";

import { useSearchParams } from "next/navigation";

import Button from "@/ui/atoms/Button";
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
		<Button type="button" onClick={handleOnClick}>
			Add to cart
		</Button>
	);
}
