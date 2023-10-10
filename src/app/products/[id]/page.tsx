import Image from "next/image";
import { executeGraphQL } from "@/lib";
import { ProductDocument, ProductListDocument } from "@/generated/graphql";
import { notFound } from "next/navigation";
import VariantSelector from "./VariantSelector";

export const generateMetadata = () => {
	return {
		title: "Single Product | Saleor Storefront ",
	};
};

export async function generateStaticParams() {
	const { products } = await executeGraphQL({
		query: ProductListDocument,
		variables: {
			channel: "default-channel",
			first: 12,
		},
	});
	const paths = products?.edges.map(({ node: { id } }) => ({ id }));

	return paths;
}

export default async function Page({
	params,
}: {
	params: { id: string };
	searchParams?: { variant?: string };
}) {
	const { product } = await executeGraphQL({
		query: ProductDocument,
		variables: {
			channel: "default-channel",
			id: decodeURIComponent(params.id),
		},
	});

	if (!product) {
		notFound();
	}

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
					</div>
					{product?.variants?.length && <VariantSelector variants={product?.variants} />}
				</div>
			</div>
		</div>
	);
}
