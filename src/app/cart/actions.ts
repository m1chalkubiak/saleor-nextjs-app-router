"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { executeGraphQL } from "@/lib";
import {
	CheckoutUpdateProductQuantityDocument,
	CheckoutUpdateProductQuantityMutationVariables,
	CheckoutRemoveProductDocument,
} from "@/generated/graphql";

export const changeProductQuantity = async (
	lines: CheckoutUpdateProductQuantityMutationVariables["lines"],
) => {
	const cookieStore = cookies();
	const checkoutId = cookieStore.get("checkoutId");

	if (checkoutId) {
		const data = await executeGraphQL({
			query: CheckoutUpdateProductQuantityDocument,
			variables: {
				checkoutId: checkoutId?.value,
				lines,
			},
			skip: !checkoutId?.value,
		});

		if (data?.checkoutLinesUpdate?.errors.length) {
			// @TODO Error handling
		}

		revalidatePath("/cart");
	}
};

export async function removeProduct(lineId: string) {
	const cookieStore = cookies();
	const checkoutId = cookieStore.get("checkoutId");

	const data = await executeGraphQL({
		query: CheckoutRemoveProductDocument,
		variables: {
			checkoutId: checkoutId?.value ?? "",
			lineId,
		},
		skip: !checkoutId?.value,
	});

	if (data?.checkoutLinesDelete?.errors.length) {
		// @TODO Error handling
	}

	revalidatePath("/cart");
}
