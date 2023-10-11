import SubmitButton from "@/ui/components/SubmitButton";
import { checkoutSubmit } from "./actions";

export default function CheckoutSubmitButton() {
	return (
		<form action={checkoutSubmit} className="flex w-full">
			<SubmitButton type="submit">Checkout</SubmitButton>
		</form>
	);
}
