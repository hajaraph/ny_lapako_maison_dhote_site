import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

	return (
		<header class="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-primary/10 shadow-xl shadow-primary/5">
			<nav class="flex justify-between items-center px-8 md:px-16 py-6 max-w-[1440px] mx-auto">
				<div class="text-2xl font-serif text-primary dark:text-primary tracking-tight font-bold italic">Verdant Refuge</div>
				<div class="hidden md:flex items-center gap-10">
					<a class={`font-serif tracking-tight transition-all duration-500 ${url === '/' ? 'text-primary border-b-2 border-tertiary pb-1' : 'text-primary/70 hover:text-primary'}`} href="/">Accueil</a>
					<a class="font-serif tracking-tight text-primary/70 hover:text-primary transition-all duration-500" href="/chambres">Nos Chambres</a>
					<a class="font-serif tracking-tight text-primary/70 hover:text-primary transition-all duration-500" href="/tarifs">Tarifs</a>
					<a class="font-serif tracking-tight text-primary/70 hover:text-primary transition-all duration-500" href="/contact">Contact</a>
				</div>
				<button class="bg-primary text-on-primary px-6 md:px-8 py-3 rounded-full font-label-sm uppercase tracking-widest hover:bg-tertiary hover:text-white transition-all duration-500 shadow-lg shadow-primary/20 text-xs md:text-sm font-black">
					Réserver
				</button>
			</nav>
		</header>
	);
}
