"use client";

import { useEffect } from "react";
import type { ChangeEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { updateProductVariantData } from "./actions";

export default function VariantSelector({ variants }: { variants: { id: string; name: string }[] }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
	const currentVariant = currentParams.get("variant");
	const defaultVariant = variants[0].id;

	const updateVariantParam = (variant: string, type?: "replace" | "push") => {
		currentParams.set("variant", variant);

		const search = currentParams.toString();
		const query = search ? `?${search}` : "";

		if (type === "replace") {
			return router.replace(`${pathname}${query}`);
		}

		return router.push(`${pathname}${query}`);
	};

	const handleOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
		updateVariantParam(event.target.value);
	};

	useEffect(() => {
		if (!currentVariant) {
			updateVariantParam(defaultVariant, "replace");
		}
	}, []);

	useEffect(() => {
		if (currentVariant) {
			updateProductVariantData(currentVariant);
		}
	}, [currentVariant]);

	return (
		<div>
			<label htmlFor="product-variant" className="mb-2 block text-sm font-medium text-gray-900">
				Select product variant
			</label>
			<select
				id="product-variant"
				className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				name="product-variant"
				defaultValue={currentVariant ?? variants[0].id}
				onChange={handleOnChange}
			>
				{variants.map(({ name, id }) => (
					<option key={id} value={id}>
						{name}
					</option>
				))}
			</select>
		</div>
	);
}
