"use server";

import { cookies } from "next/headers";

import { executeGraphQL } from "@/lib";
import { CheckoutCreateDocument } from "@/generated/graphql";

export async function createCart() {
	const cookieStore = cookies();
	const checkoutId = cookieStore.get("checkoutId");

	if (!checkoutId?.value) {
		const checkoutCreateData = await executeGraphQL({
			query: CheckoutCreateDocument,
			variables: {
				email: "customer@example.com",
			},
		});

		const checkoutCreate = checkoutCreateData?.checkoutCreate;

		const checkoutId = checkoutCreate?.checkout?.id;

		if (typeof checkoutId === "string") {
			cookieStore.set({
				name: "checkoutId",
				value: checkoutId,
				httpOnly: true,
				path: "/",
			});
		}

		if (checkoutCreate?.errors.length) {
			// @TODO Error handling
		}
	}
}
