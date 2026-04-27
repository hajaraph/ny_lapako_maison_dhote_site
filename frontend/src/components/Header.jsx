export function Header() {
	const links = [
		{ href: '#esprit', label: "L'esprit" },
		{ href: '#jardin', label: 'Le jardin' },
		{ href: '#suites', label: 'Suites' },
		{ href: '#avis', label: 'Avis' },
		{ href: '#contact', label: 'Contact' },
	];

	return (
		<header class="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
			<div class="section-shell">
				<div class="load-rise flex items-center justify-between gap-4 rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-soft backdrop-blur-2xl lg:px-5">
					<a href="/" class="flex items-center gap-3">
						<span class="page-glow flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-soft">
							<span class="material-symbols-outlined text-[22px]">spa</span>
						</span>
						<span class="flex flex-col">
							<span class="font-serif text-xl leading-none text-on-surface">Ny Lapako</span>
							<span class="mt-1 text-[9px] font-black uppercase tracking-[0.34em] text-outline">Maison d'hôtes</span>
						</span>
					</a>

					<nav class="hidden items-center gap-1 rounded-full border border-primary/10 bg-background/75 p-1.5 lg:flex">
						{links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								class="rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-outline transition-colors duration-300 hover:bg-primary/10 hover:text-on-surface"
							>
								{link.label}
							</a>
						))}
					</nav>

					<div class="flex items-center gap-3">
						<a href="#contact" class="hidden sm:inline-flex pill-button-ghost">
							Nous contacter
						</a>
						<a href="#contact" class="pill-button">
							Réserver
						</a>
					</div>
				</div>
			</div>
		</header>
	);
}
