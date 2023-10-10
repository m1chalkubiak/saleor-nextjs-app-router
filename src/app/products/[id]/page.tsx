import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { executeGraphQL } from "@/lib";
import { ProductDocument, ProductListDocument } from "@/generated/graphql";
import Placeholder from "@/ui/atoms/Placeholder";
import AddToCartButton from "./AddToCartButton";
import VariantSelector from "./VariantSelector";

export const generateMetadata = () => {
	return {
		title: "Single Product | Saleor Storefront ",
	};
};

export async function generateStaticParams() {
	const productsData = await executeGraphQL({
		query: ProductListDocument,
		variables: {
			channel: "default-channel",
			first: 12,
		},
	});

	const products = productsData?.products;

	const paths = products?.edges.map(({ node: { id } }) => ({ id }));

	return paths;
}

export default async function Page({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams?: { variant?: string };
}) {
	const productData = await executeGraphQL({
		query: ProductDocument,
		variables: {
			channel: "default-channel",
			id: decodeURIComponent(params.id),
		},
		tags: [params.id],
	});

	const product = productData?.product;

	if (!product) {
		notFound();
	}

	const variant = searchParams?.variant ?? "";
	const productVariants = product?.variants;
	const currentVariant = productVariants?.find(({ id }) => variant === id);
	const variantPrice = currentVariant?.pricing?.price?.gross;

	return (
		<div className="flex">
			<div className="w-1/3 flex-none">
				<div className="rounded-md border bg-slate-50">
					{product.thumbnail && (
						<Image
							alt={product.thumbnail.alt ?? ""}
							src={product.thumbnail.url}
							width={256}
							height={256}
							className="h-full w-full object-cover"
						/>
					)}
				</div>
			</div>
			<div className="flex-auto px-6">
				<div className="flex flex-wrap">
					<div className="flex w-full flex-auto justify-between">
						<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
						{variantPrice && (
							<span className="text-3xl tracking-tight text-gray-900">
								{variantPrice.amount}
								{variantPrice.currency}
							</span>
						)}
					</div>
					{product?.variants?.length && (
						<Suspense fallback={<Placeholder />}>
							<VariantSelector variants={product?.variants} />
						</Suspense>
					)}

					<AddToCartButton />
				</div>
			</div>
		</div>
	);
}
