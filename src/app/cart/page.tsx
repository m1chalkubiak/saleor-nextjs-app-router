import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

import { CheckoutDocument } from "@/generated/graphql";
import { executeGraphQL } from "@/lib";

import RemoveProductButton from "./RemoveProductButton";
import UpdateProductQuantity from "./UpdateProductQuantity";
import CheckoutSubmitButton from "./CheckoutSubmitButton";

export const metadata = {
	title: "Shopping Cart | Saleor Storefront",
};

export default async function Page() {
	const cookieStore = cookies();
	const checkoutId = cookieStore.get("checkoutId");

	const data = await executeGraphQL({
		query: CheckoutDocument,
		variables: {
			checkoutId: checkoutId?.value ?? "",
		},
		skip: !checkoutId?.value,
		tags: ["checkout"],
	});

	const products = data?.checkout?.lines ?? [];
	const lines = products.map(({ id, quantity }) => ({ lineId: id, quantity }));

	const totalPrice = data?.checkout?.totalPrice;
	const subtotalPrice = data?.checkout?.subtotalPrice;

	const styles = {
		product: {
			image: "flex-shrink-0 bg-white w-48 h-48 border object-center object-cover",
			container: "mx-2 lg:mx-8 flex-1 flex flex-col justify-center",
			name: "text-xl font-bold",
		},
	};

	return (
		<div className="h-screen">
			<div className="container mx-auto px-4">
				<h1 className="mb-4 text-2xl font-semibold">Shopping Cart</h1>
				<div className="flex flex-col gap-4 lg:flex-row">
					<div className="lg:w-3/4">
						<ul role="list" className="divide-y divide-gray-200">
							{products.map(({ id: lineId, variant, quantity, ...line }) => {
								const product = variant.product;
								const price = line?.totalPrice?.gross;
								const productID = product?.id;

								return (
									<li key={lineId} className="flex py-6">
										<div className={styles.product.image}>
											{product.thumbnail && (
												<Image
													alt={product.thumbnail.alt ?? ""}
													src={product.thumbnail.url}
													width={256}
													height={256}
													className="h-full w-full object-cover"
													priority={true}
												/>
											)}
										</div>

										<div className={styles.product.container}>
											<div className="flex justify-between">
												<div className="grow pr-6">
													<h3 className={styles.product.name}>
														<Link href={`/product/${productID}`}>{product?.name}</Link>
													</h3>
													<h4>{variant?.name}</h4>
													<RemoveProductButton lineId={lineId} />
												</div>

												<div className="flex items-center pr-6">
													<UpdateProductQuantity lineId={lineId} quantity={quantity} lines={lines} />
												</div>

												<p className="text-right text-xl text-gray-900">
													{price?.amount} {price?.currency}
												</p>
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
					<div className="lg:w-1/4">
						{totalPrice && subtotalPrice && (
							<div className="mb-4 rounded-md border bg-slate-50 p-6">
								<h2 className="mb-4 text-lg font-semibold">Summary</h2>
								<div className="mb-2 flex justify-between">
									<span>Subtotal</span>
									<span>
										{subtotalPrice.net?.amount} {subtotalPrice?.net?.currency}
									</span>
								</div>
								<div className="mb-2 flex justify-between">
									<span>Taxes</span>
									<span>
										{subtotalPrice.tax?.amount} {subtotalPrice?.tax?.currency}
									</span>
								</div>
								{/* // @TODO add shipping cost */}
								<hr className="my-2" />
								{totalPrice && (
									<div className="mb-2 flex justify-between">
										<span className="font-semibold">Total</span>
										<span className="font-semibold">
											{totalPrice.gross?.amount} {totalPrice.gross?.currency}
										</span>
									</div>
								)}
								<CheckoutSubmitButton />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
