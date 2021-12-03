import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
	return (
		<header className="fixed z-10 flex w-full p-4 py-4">
			<nav className="z-50 flex items-center justify-between w-full py-4 px-44">
				<Link href="/">
					<div className="">test</div>
					<div className="flex flex-col items-center font-normal cursor-pointer">
						<h1 className="text-xl">pao pao</h1>
						<p className="text-base">modern tea</p>
					</div>
				</Link>

				<div className="flex flex-row items-center justify-between max-w-full px-16 py-4 space-x-16 cursor-pointer">
					<Link href="/">
						<h1>contact</h1>
					</Link>
					<Link href="/">
						<h1>menu</h1>
					</Link>
					<Link href="/">
						<h1>test</h1>
					</Link>
				</div>
			</nav>
		</header>
	);
}
