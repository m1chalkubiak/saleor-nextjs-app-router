import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";

import { executeGraphQL } from "@/lib";
import { CheckoutDocument } from "@/generated/graphql";
import Placeholder from "@/ui/atoms/Placeholder";
import CartIcon from "./CartIcon";

const styles = {
	background: "bg-white shadow-sm",
	container: "max-w-7xl mx-auto px-8",
	menu: "flex justify-between h-16",
	menuSection: "flex space-x-8 h-full",
	menuLink: "font-bold text-gray-700 hover:text-blue-400 z-10 flex items-center text-sm",
};

export default async function Navbar() {
	const cookieStore = cookies();
	const checkoutId = cookieStore.get("checkoutId");

	const checkoutData = await executeGraphQL({
		query: CheckoutDocument,
		variables: {
			checkoutId: checkoutId?.value ?? "",
		},
		skip: !checkoutId?.value,
	});

	const products = checkoutData?.checkout?.lines ?? [];

	return (
		<div className={styles.background}>
			<div className={styles.container}>
				<div className={styles.menu}>
					<div className={styles.menuSection}>
						<Link href="/" className={styles.menuLink} aria-expanded="false">
							All Products
						</Link>
					</div>

					<div className={styles.menuSection}></div>
					<Suspense fallback={<Placeholder />}>
						<CartIcon productsAmount={products.length} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
