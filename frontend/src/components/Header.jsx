import { useEffect, useState } from 'preact/hooks';

export function Header() {
	const links = [
		{ href: '#esprit', label: "L'esprit" },
		{ href: '#jardin', label: 'Le jardin' },
		{ href: '#suites', label: 'Suites' },
		{ href: '#avis', label: 'Avis' },
		{ href: '#contact', label: 'Contact' },
	];
	const [activeSection, setActiveSection] = useState('esprit');
	const [compact, setCompact] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return undefined;

		const sectionIds = links.map((link) => link.href.replace('#', ''));
		const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
		const syncCompact = () => setCompact(window.scrollY > 18);
		const syncFromHash = () => {
			const hash = window.location.hash.replace('#', '');
			if (hash) setActiveSection(hash);
		};

		syncCompact();
		syncFromHash();
		window.addEventListener('scroll', syncCompact, { passive: true });
		window.addEventListener('hashchange', syncFromHash);

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

				if (visible?.target?.id) {
					setActiveSection(visible.target.id);
				}
			},
			{
				rootMargin: '-34% 0px -48% 0px',
				threshold: [0.12, 0.24, 0.4, 0.58],
			},
		);

		sections.forEach((section) => observer.observe(section));

		return () => {
			window.removeEventListener('scroll', syncCompact);
			window.removeEventListener('hashchange', syncFromHash);
			observer.disconnect();
		};
	}, []);

	const isActive = (href) => activeSection === href.replace('#', '');

	return (
		<header class={`fixed inset-x-0 top-0 z-50 px-4 ${compact ? 'pt-2 sm:pt-3' : 'pt-4'} sm:px-6 lg:px-8`}>
			<div class="section-shell">
				<div class={`load-rise flex items-center justify-between gap-4 rounded-full border border-white/70 bg-white/80 backdrop-blur-2xl transition-all duration-500 ${compact ? 'px-3 py-2.5 shadow-lift lg:px-4' : 'px-4 py-3 shadow-soft lg:px-5'}`}>
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
								aria-current={isActive(link.href) ? 'page' : undefined}
								class={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] transition-all duration-500 ${
									isActive(link.href)
										? 'bg-primary text-on-primary shadow-soft -translate-y-0.5'
										: 'text-outline hover:bg-primary/10 hover:text-on-surface'
								}`}
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
