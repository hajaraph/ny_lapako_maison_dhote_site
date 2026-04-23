import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

	return (
		<header class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-primary/10 shadow-xl shadow-primary/5">
			<nav class="flex justify-between items-center px-8 md:px-16 py-6 max-w-[1440px] mx-auto">
				{/* Logo : On garde le doré mais en plus gras pour la netteté */}
				<div class="text-2xl font-serif text-primary tracking-tighter font-black italic">Verdant Refuge</div>
				
				{/* Liens : On passe au noir ébène pour un contraste maximal et une netteté parfaite */}
				<div class="hidden md:flex items-center gap-10">
					<a class={`font-sans text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${url === '/' ? 'text-[#231b00] border-b-2 border-primary pb-1' : 'text-[#231b00]/50 hover:text-primary'}`} href="/">Accueil</a>
					<a class="font-sans text-[11px] font-black uppercase tracking-[0.2em] text-[#231b00]/50 hover:text-primary transition-all duration-500" href="/chambres">Nos Chambres</a>
					<a class="font-sans text-[11px] font-black uppercase tracking-[0.2em] text-[#231b00]/50 hover:text-primary transition-all duration-500" href="/tarifs">Tarifs</a>
					<a class="font-sans text-[11px] font-black uppercase tracking-[0.2em] text-[#231b00]/50 hover:text-primary transition-all duration-500" href="/contact">Contact</a>
				</div>
				
				<button class="bg-[#231b00] text-primary-container px-6 md:px-8 py-3 rounded-full font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-[#231b00] transition-all duration-500 shadow-xl text-[10px]">
					Réserver
				</button>
			</nav>
		</header>
	);
}
