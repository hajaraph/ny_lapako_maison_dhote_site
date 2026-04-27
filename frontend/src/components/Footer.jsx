import { Reveal } from './Reveal.jsx';
import {
	DEFAULT_SITE_INFO,
	formatTelHref,
	formatWhatsappHref,
	normalizeSiteInfo,
} from '../lib/siteSettings.js';

export function Footer({ siteInfo }) {
	const site = normalizeSiteInfo(siteInfo || DEFAULT_SITE_INFO);
	const highlights = [
		{ label: 'Suites', value: 'Espaces lumineux' },
		{ label: 'Jardin', value: 'Apaisés' },
		{ label: 'Petit-déjeuner', value: 'Local et fait maison' },
	];

	const contactCards = [
		{
			title: 'Adresse',
			items: site.address_lines.map((line) => ({ text: line })),
		},
		{
			title: 'Nous contacter',
			items: [
				{ label: 'Téléphone', value: site.contact_phone, href: formatTelHref(site.contact_phone) },
				{ label: 'WhatsApp', value: site.contact_whatsapp, href: formatWhatsappHref(site.contact_whatsapp) },
				{ label: 'Mail', value: site.contact_email, href: `mailto:${site.contact_email}` },
			],
		},
		{
			title: 'Horaires',
			items: [
				{ text: site.opening_hours },
				{ text: site.check_in },
			],
		},
	];

	return (
		<footer id="contact" class="relative overflow-hidden scroll-mt-28 border-t border-primary/10 bg-[#121611] text-white">
			<div class="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl orb-drift"></div>
			<div class="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-tertiary/15 blur-3xl orb-drift"></div>

			<div class="section-shell-wide relative py-20 lg:py-24">
				<Reveal variant="right" class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]" delay={120}>
					<div class="surface-card-strong border-white/10 bg-white/5 p-8 text-white lg:p-10">
						<div class="flex flex-col gap-8">
							<div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
								<div>
									<div class="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.32em] text-white/70">
										Ny Lapako
									</div>
									<h2 class="mt-6 max-w-xl font-serif text-4xl leading-[1] text-white sm:text-5xl">
										Une adresse pensée comme une respiration.
									</h2>
									<p class="mt-5 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
										Entre jardin, lumière dorée et hospitalité discrète, Ny Lapako propose une expérience plus calme, plus fluide et plus contemporaine.
									</p>
								</div>

								<a href="#suites" class="inline-flex items-center justify-center rounded-full bg-primary px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-on-primary transition-transform duration-500 hover:-translate-y-0.5 hover:bg-white hover:text-on-surface">
									Voir les suites
								</a>
							</div>

							<div class="grid gap-4 sm:grid-cols-3">
								{highlights.map((item) => (
									<div key={item.label} class="rounded-[1.5rem] border border-white/10 bg-white/8 px-4 py-4">
										<div class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{item.label}</div>
										<div class="mt-2 text-sm font-semibold text-white">{item.value}</div>
									</div>
								))}
							</div>

							<div class="flex flex-wrap gap-4 text-white/45">
								<a href={formatTelHref(site.contact_phone)} class="inline-flex items-center gap-2 transition-colors hover:text-white">
									<span class="material-symbols-outlined text-sm">call</span>
									<span class="text-[10px] font-black uppercase tracking-[0.3em]">Contact</span>
								</a>
								<a href={formatWhatsappHref(site.contact_whatsapp)} target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 transition-colors hover:text-white">
									<span class="material-symbols-outlined text-sm">chat</span>
									<span class="text-[10px] font-black uppercase tracking-[0.3em]">WhatsApp</span>
								</a>
								<a href={`mailto:${site.contact_email}`} class="inline-flex items-center gap-2 transition-colors hover:text-white">
									<span class="material-symbols-outlined text-sm">mail</span>
									<span class="text-[10px] font-black uppercase tracking-[0.3em]">Mail</span>
								</a>
							</div>
						</div>
					</div>

					<div class="grid gap-6 sm:grid-cols-2">
						{contactCards.map((card) => (
							<FooterInfoCard key={card.title} title={card.title} items={card.items} />
						))}

						<div class="surface-card-strong border-white/10 bg-white/5 p-6 sm:col-span-2">
							<div class="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">Lettre d'information</div>
							<p class="mt-4 max-w-md text-sm leading-7 text-white/72">
								Des nouvelles douces, des disponibilités et quelques inspirations saisonnières.
							</p>
							<form class="mt-6 flex flex-col gap-3 sm:flex-row">
								<input
									class="w-full rounded-full border border-white/10 bg-white/8 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
									placeholder="Votre email"
									type="email"
								/>
								<button
									type="submit"
									class="inline-flex items-center justify-center rounded-full bg-white px-5 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-on-surface transition-transform duration-500 hover:-translate-y-0.5 hover:bg-primary hover:text-on-primary"
								>
									S'inscrire
								</button>
							</form>
						</div>
					</div>
				</Reveal>

				<Reveal variant="fade" class="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between" delay={220}>
					<div class="text-[10px] font-black uppercase tracking-[0.32em] text-white/35">
						© 2026 Copyright{' '}
						<a
							href={site.copyright_url}
							target="_blank"
							rel="noreferrer"
							class="transition-colors hover:text-white"
						>
							Demondra
						</a>
					</div>
					<div class="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
						<a class="transition-colors hover:text-white" href="#">
							Confidentialité
						</a>
						<a class="transition-colors hover:text-white" href="#">
							Conditions
						</a>
					</div>
				</Reveal>
			</div>
		</footer>
	);
}

function FooterInfoCard({ title, items }) {
	return (
		<div class="surface-card-strong border-white/10 bg-white/5 p-6 text-white">
			<div class="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">{title}</div>
			<div class="mt-4 space-y-2 text-sm leading-7 text-white/72">
				{items.map((item) => {
					if (typeof item === 'string') {
						return <div key={item}>{item}</div>;
					}

					if (item.href) {
						return (
							<a
								key={`${item.label}-${item.value}`}
								href={item.href}
								target={item.href.startsWith('mailto:') || item.href.startsWith('tel:') ? undefined : '_blank'}
								rel={item.href.startsWith('mailto:') || item.href.startsWith('tel:') ? undefined : 'noreferrer'}
								class="block transition-colors hover:text-white"
							>
								<span class="text-white/45">{item.label}</span>
								{' '}
								{item.value}
							</a>
						);
					}

					return <div key={item.text}>{item.text}</div>;
				})}
			</div>
		</div>
	);
}
