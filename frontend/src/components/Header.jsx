import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

	return (
		<header class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-primary/10 shadow-xl shadow-primary/5">
			<nav class="flex justify-between items-center px-8 md:px-16 py-6 max-w-[1440px] mx-auto">
				{/* Logo : Plus minimaliste et élégant */}
				<div class="text-3xl font-serif text-primary tracking-tighter font-light italic">Ny Lapako</div>
				
				{/* Liens : Typographie ultra-fine et espacement accru */}
				<div class="hidden md:flex items-center gap-12">
					<a class="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#231b00]/60 hover:text-primary transition-all duration-700" href="/#esprit">L'Esprit</a>
					<a class="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#231b00]/60 hover:text-primary transition-all duration-700" href="/#chambres">Votre Chambre</a>
					<a class="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#231b00]/60 hover:text-primary transition-all duration-700" href="/#jardin">Le Jardin</a>
					<a class="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#231b00]/60 hover:text-primary transition-all duration-700" href="/#avis">Ils en parlent</a>
					<a class="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#231b00]/60 hover:text-primary transition-all duration-700" href="/#contact">Nous trouver</a>
				</div>
				
				<button class="group relative px-8 py-3 overflow-hidden rounded-full border border-primary/20 transition-all duration-500 hover:border-primary">
					<span class="relative z-10 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#231b00] group-hover:text-white transition-colors duration-500">Réserver</span>
					<div class="absolute inset-0 bg-[#231b00] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
				</button>
			</nav>
		</header>
	);
}
