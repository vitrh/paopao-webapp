import { Navbar } from '../components/layout/Navbar';
import Head from 'next/head';
import { Hero } from '../components/layout/Hero';

export default function Index() {
	return (
		<>
			<Head>
				<title>PaoPao - Bubble Tea</title>
			</Head>
			<Navbar></Navbar>
			<Hero></Hero>
		</>
	);
}
