"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { executeGraphQL } from "@/lib";
import {
	CheckoutUpdateProductQuantityDocument,
	CheckoutUpdateProductQuantityMutationVariables,
	CheckoutRemoveProductDocument,
	CheckoutCompleteDocument,
	CheckoutUpdateShippingAddressDocument,
	CheckoutUpdateDeliveryMethodDocument,
	CheckoutUpdateBillingAddressDocument,
	CheckoutPaymentCreateDocument,
} from "@/generated/graphql";
import { createCart } from "@/app/actions";

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

export async function checkoutSubmit() {
	const cookieStore = cookies();
	const checkoutId = cookieStore.get("checkoutId");

	await executeGraphQL({
		query: CheckoutUpdateShippingAddressDocument,
		variables: {
			checkoutId: checkoutId?.value ?? "",
		},
		skip: !checkoutId?.value,
	});

	await executeGraphQL({
		query: CheckoutUpdateDeliveryMethodDocument,
		variables: {
			checkoutId: checkoutId?.value ?? "",
		},
		skip: !checkoutId?.value,
	});

	const updateBillingAddressData = await executeGraphQL({
		query: CheckoutUpdateBillingAddressDocument,
		variables: {
			checkoutId: checkoutId?.value ?? "",
		},
		skip: !checkoutId?.value,
	});

	const amout =
		updateBillingAddressData?.checkoutBillingAddressUpdate?.checkout?.totalPrice.gross.amount ?? 0;

	// @TODO Mock above data in create checkout mutation

	const paymentCreateData = await executeGraphQL({
		query: CheckoutPaymentCreateDocument,
		variables: {
			checkoutId: checkoutId?.value ?? "",
			amout,
		},
		skip: !checkoutId?.value,
	});

	if (paymentCreateData?.checkoutPaymentCreate?.errors.length) {
		// @TODO Error handling
	}

	const data = await executeGraphQL({
		query: CheckoutCompleteDocument,
		variables: {
			checkoutId: checkoutId?.value ?? "",
		},
		skip: !checkoutId?.value,
	});

	if (data?.checkoutComplete?.errors.length) {
		// @TODO Error handling
	} else {
		cookies().delete("checkoutId");
		await createCart();
		revalidatePath("/cart");
		redirect("/");
	}
}
