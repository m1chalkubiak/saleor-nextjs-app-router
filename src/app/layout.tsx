import Banner from "@/ui/components/Banner";
import Navbar from "@/ui/components/Navbar";
import "./global.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Banner />
				<Navbar />
				<section className="mx-auto max-w-2xl px-8 py-12 lg:max-w-7xl">{children}</section>
			</body>
		</html>
	);
}
