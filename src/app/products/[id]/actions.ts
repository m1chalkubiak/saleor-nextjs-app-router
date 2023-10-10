"use server";

import { revalidateTag } from "next/cache";

export const updateProductVariantData = (productId: string) => {
	revalidateTag(productId);
};
