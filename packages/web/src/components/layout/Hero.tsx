import Image from 'next/image';

export function Hero() {
	return (
		<>
			<div className="relative flex-col w-full h-screen z-1000">
				<Image
					src="/../public/paopao_shop.jpeg"
					alt="Paopao-Shop background pic"
					layout="fill"
					priority={true}
					className="relative"
				/>
			</div>
		</>
	);
}
