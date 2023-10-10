"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { executeGraphQL } from "@/lib";
import { ProductAddVariantToCartDocument } from "@/generated/graphql";

export const updateProductVariantData = (productId: string) => {
	revalidateTag(productId);
};

export async function addToCart(productVariantId: string) {
	const cookieStore = cookies();
	const checkoutId = cookieStore.get("checkoutId");

	const data = await executeGraphQL({
		query: ProductAddVariantToCartDocument,
		variables: {
			checkoutId: checkoutId?.value ?? "",
			variantId: productVariantId,
		},
		skip: !checkoutId?.value,
	});

	const checkoutLinesAdd = data?.checkoutLinesAdd;

	if (checkoutLinesAdd?.errors.length) {
		// @TODO Error handling
	} else {
		revalidateTag("checkout");
	}
}
