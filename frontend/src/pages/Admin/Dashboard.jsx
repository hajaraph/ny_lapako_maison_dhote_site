import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { api } from '../../api';
import { Reveal } from '../../components/Reveal.jsx';

const navItems = [
	{ tab: 'stats', icon: 'dashboard', label: 'Vue globale' },
	{ tab: 'news', icon: 'auto_awesome', label: 'Actualités' },
	{ tab: 'events', icon: 'event', label: 'Événements' },
	{ tab: 'reviews', icon: 'forum', label: 'Avis clients' },
	{ tab: 'profile', icon: 'settings', label: 'Mon compte' },
];

const tabTitles = {
	stats: 'Tableau de bord',
	news: 'Actualités',
	events: 'Événements',
	reviews: 'Avis clients',
	profile: 'Paramètres',
};

export function AdminDashboard() {
	const { url, route } = useLocation();
	const currentTab = url.split('/')[2] || 'stats';
	const [donnees, setDonnees] = useState([]);
	const [profil, setProfil] = useState(null);
	const [chargement, setChargement] = useState(true);

	const navigate = (tab) => route(`/admin/${tab}`);

	useEffect(() => {
		let alive = true;

		const load = async () => {
			setChargement(true);

			try {
				if (currentTab === 'news') {
					const items = await api.actualites.lister();
					if (alive) setDonnees(Array.isArray(items) ? items : []);
				} else if (currentTab === 'events') {
					const items = await api.evenements.lister();
					if (alive) setDonnees(Array.isArray(items) ? items : []);
				} else if (currentTab === 'reviews') {
					const items = await api.avis.lister();
					if (alive) setDonnees(Array.isArray(items) ? items : []);
				} else if (currentTab === 'profile') {
					const data = await api.admin.getProfil();
					if (alive) setProfil(data);
				} else if (alive) {
					setDonnees([]);
				}
			} catch (error) {
				console.error('Erreur chargement admin:', error);
				if (alive) {
					setDonnees([]);
				}
			} finally {
				if (alive) setChargement(false);
			}
		};

		load();

		return () => {
			alive = false;
		};
	}, [currentTab]);

	const supprimerElement = async (id) => {
		if (!confirm('Supprimer cet élément ?')) return;

		try {
			if (currentTab === 'news') {
				await api.actualites.supprimer(id);
			}
			setDonnees(donnees.filter((item) => item.id !== id));
		} catch (error) {
			console.error('Erreur suppression:', error);
			alert('Erreur suppression');
		}
	};

	const modererAvis = async (id, statut) => {
		try {
			await api.avis.moderer(id, statut);
			setDonnees(donnees.map((item) => (item.id === id ? { ...item, statut } : item)));
		} catch (error) {
			console.error('Erreur modération:', error);
			alert('Erreur modération');
		}
	};

	return (
		<div class="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(208,175,47,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(0,109,54,0.08),transparent_28%),linear-gradient(180deg,#f8f3e7_0%,#fdfaf1_100%)] text-on-surface">
			<div class="section-shell-wide flex min-h-screen flex-col gap-6 py-6 lg:flex-row">
				<aside class="load-rise hidden lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-3rem)] lg:w-80 lg:flex-col lg:justify-between rounded-[2.75rem] border border-white/70 bg-[#17150f] p-6 text-white shadow-lift">
					<div>
						<div class="flex items-center gap-4">
							<button
								type="button"
								onClick={() => route('/')}
								class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-soft transition-transform duration-300 hover:-translate-y-0.5"
							>
								<span class="material-symbols-outlined text-[22px]">spa</span>
							</button>
							<div>
								<h1 class="font-serif text-2xl text-white">Ny Lapako</h1>
								<p class="mt-1 text-[9px] font-black uppercase tracking-[0.34em] text-white/40">Management</p>
							</div>
						</div>

						<nav class="mt-10 space-y-2">
							{navItems.map((item) => (
								<SidebarLink
									key={item.tab}
									active={currentTab === item.tab}
									icon={item.icon}
									label={item.label}
									onClick={() => navigate(item.tab)}
								/>
							))}
						</nav>
					</div>

					<div class="space-y-4">
						<div class="rounded-[2rem] border border-white/10 bg-white/5 p-4">
							<p class="text-[10px] font-black uppercase tracking-[0.32em] text-white/35">Raccourci</p>
							<p class="mt-2 text-sm leading-7 text-white/70">
								Retour rapide à la page d'accueil ou passage sur la section publique.
							</p>
						</div>
						<button
							type="button"
							onClick={() => route('/')}
							class="flex w-full items-center gap-4 rounded-[1.75rem] bg-white/10 px-5 py-4 text-white transition-colors duration-300 hover:bg-white/15"
						>
							<span class="material-symbols-outlined">logout</span>
							<span class="text-[10px] font-black uppercase tracking-[0.3em]">Quitter</span>
						</button>
					</div>
				</aside>

				<main class="load-rise flex-1 rounded-[2.75rem] border border-white/70 bg-white/72 p-5 shadow-soft backdrop-blur-2xl md:p-8 lg:p-10">
					<header class="flex flex-col gap-4 border-b border-primary/10 pb-6 md:flex-row md:items-center md:justify-between">
						<div>
							<div class="text-[10px] font-black uppercase tracking-[0.34em] text-outline">Espace administrateur</div>
							<h2 class="mt-3 font-serif text-4xl text-on-surface italic sm:text-5xl">
								{tabTitles[currentTab] || currentTab}
							</h2>
						</div>

						{profil && (
							<div class="flex items-center gap-3 rounded-full border border-primary/10 bg-white px-3 py-2 shadow-soft">
								<img
									src={`https://ui-avatars.com/api/?name=${profil.nom}&background=d0af2f&color=231b00`}
									alt={profil.nom}
									class="h-11 w-11 rounded-full"
								/>
								<div class="pr-2">
									<div class="text-xs font-black uppercase tracking-[0.28em] text-on-surface">{profil.nom}</div>
									<div class="text-[10px] uppercase tracking-[0.28em] text-outline">{profil.email}</div>
								</div>
							</div>
						)}
					</header>

					<div class="pt-8">
						{chargement ? (
							<div class="flex justify-center py-24">
								<span class="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></span>
							</div>
						) : (
							<>
								{currentTab === 'stats' && <StatsOverview />}
								{currentTab === 'news' && <NewsManager data={donnees} onSupprimer={supprimerElement} />}
								{currentTab === 'events' && <EventsManager data={donnees} />}
								{currentTab === 'reviews' && <ReviewsManager data={donnees} onModerer={modererAvis} />}
								{currentTab === 'profile' && profil && <ProfileManager profil={profil} setProfil={setProfil} />}
							</>
						)}
					</div>
				</main>
			</div>

			<nav class="load-rise lg:hidden fixed bottom-4 inset-x-4 z-50 flex h-20 items-center justify-around rounded-full border border-white/70 bg-[#17150f] px-4 shadow-lift backdrop-blur-2xl">
				{navItems.filter((item) => item.tab !== 'reviews').map((item) => (
					<MobileNavLink key={item.tab} active={currentTab === item.tab} icon={item.tab === 'stats' ? 'grid_view' : item.icon} onClick={() => navigate(item.tab)} />
				))}
				<button
					type="button"
					onClick={() => route('/')}
					class="flex h-14 w-14 -translate-y-6 items-center justify-center rounded-full border-4 border-[#fdfaf1] bg-primary text-on-primary shadow-lift"
				>
					<span class="material-symbols-outlined text-[20px]">home</span>
				</button>
			</nav>
		</div>
	);
}

function SidebarLink({ icon, label, active, onClick }) {
	return (
		<button
			type="button"
			onClick={onClick}
			class={`flex w-full items-center gap-4 rounded-[1.5rem] px-5 py-4 text-left transition-all duration-300 ${
				active ? 'bg-primary text-on-primary shadow-soft' : 'text-white/55 hover:bg-white/8 hover:text-white'
			}`}
		>
			<span class="material-symbols-outlined text-[20px]">{icon}</span>
			<span class="text-[10px] font-black uppercase tracking-[0.28em]">{label}</span>
		</button>
	);
}

function MobileNavLink({ icon, active, onClick }) {
	return (
		<button type="button" onClick={onClick} class={`rounded-2xl p-3 ${active ? 'text-white' : 'text-white/35'}`}>
			<span class="material-symbols-outlined text-[22px] font-bold">{icon}</span>
		</button>
	);
}

function StatsOverview() {
	return (
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<StatCard label="Occupation" value="89%" icon="bed" hint="Moyenne du mois" delay={80} />
			<StatCard label="Avis à modérer" value="5" icon="forum" hint="Attente de validation" delay={140} />
			<StatCard label="Événements" value="3" icon="event" hint="Programmés ce trimestre" delay={200} />
		</div>
	);
}

function StatCard({ label, value, icon, hint, delay = 0 }) {
	return (
		<Reveal class="surface-card-strong p-8" delay={delay}>
			<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
				<span class="material-symbols-outlined text-[24px]">{icon}</span>
			</div>
			<p class="mt-6 text-[10px] font-black uppercase tracking-[0.32em] text-outline">{label}</p>
			<h3 class="mt-3 font-serif text-4xl text-on-surface">{value}</h3>
			<p class="mt-3 text-sm leading-7 text-on-surface/65">{hint}</p>
		</Reveal>
	);
}

function NewsManager({ data, onSupprimer }) {
	return (
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{data.map((actu, index) => (
				<Reveal key={actu.id} as="article" class="surface-card overflow-hidden transition-transform duration-300 hover:-translate-y-1" delay={index * 120}>
					<img src={actu.image_url || 'https://picsum.photos/seed/1/800/600'} alt={actu.titre} class="h-64 w-full object-cover" loading="lazy" />
					<div class="p-6">
						<div class="text-[10px] font-black uppercase tracking-[0.32em] text-outline">{actu.date_publication}</div>
						<h4 class="mt-4 font-serif text-2xl italic text-on-surface">{actu.titre}</h4>
						<p class="mt-4 line-clamp-3 text-sm leading-7 text-on-surface/70">{actu.contenu}</p>
						<div class="mt-6 flex items-center justify-between gap-4">
							<button
								type="button"
								onClick={() => onSupprimer(actu.id)}
								class="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 transition-colors hover:text-rose-700"
							>
								Supprimer
							</button>
							<span class="rounded-full bg-primary/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
								Publier
							</span>
						</div>
					</div>
				</Reveal>
			))}

			<Reveal class="surface-card flex min-h-[26rem] flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-white/55 p-8 text-primary transition-colors duration-300 hover:border-primary/50 hover:bg-white/70" delay={data.length * 120}>
				<span class="material-symbols-outlined text-4xl">add</span>
				<span class="mt-4 text-[10px] font-black uppercase tracking-[0.32em]">Nouvelle actualité</span>
			</Reveal>
		</div>
	);
}

function EventsManager({ data }) {
	return (
		<div class="space-y-4">
			{data.map((event, index) => (
				<Reveal key={event.id} class="surface-card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between" delay={index * 120}>
					<div>
						<div class="text-[10px] font-black uppercase tracking-[0.32em] text-primary">{event.date_evenement}</div>
						<h4 class="mt-3 font-serif text-2xl italic text-on-surface">{event.titre}</h4>
						<p class="mt-4 max-w-2xl text-sm leading-7 text-on-surface/70">{event.description}</p>
					</div>
					<div class="rounded-full bg-tertiary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.32em] text-tertiary">
						{event.statut || 'Planifié'}
					</div>
				</Reveal>
			))}
		</div>
	);
}

function ReviewsManager({ data, onModerer }) {
	return (
		<Reveal class="surface-card-strong p-8" delay={100}>
			<h3 class="font-serif text-4xl italic text-on-surface">Livre d'or</h3>
			<div class="mt-10 space-y-8">
				{data.map((review, index) => (
					<Reveal key={review.id ?? `${review.nom_client}-${index}`} class="flex gap-5 rounded-[2rem] border border-primary/10 bg-white/80 p-6" delay={index * 110}>
						<div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary font-serif text-xl font-bold">
							{(review.nom_client || '?')[0].toUpperCase()}
						</div>
						<div class="min-w-0 flex-1 space-y-4">
							<div class="flex flex-wrap items-center gap-3">
								<span class="font-black uppercase tracking-[0.26em] text-on-surface">{review.nom_client || 'Client anonyme'}</span>
								<span
									class={`rounded-full px-3 py-2 text-[9px] font-black uppercase tracking-[0.32em] ${
										review.statut === 'approuve' || review.statut === 'Approuvé'
											? 'bg-tertiary/10 text-tertiary'
											: 'bg-amber-100 text-amber-700'
									}`}
								>
									{review.statut}
								</span>
							</div>

							<p class="text-base italic leading-8 text-on-surface/75">"{review.commentaire || 'Sans commentaire'}"</p>

							<div class="flex flex-wrap gap-3 pt-2">
								{review.statut !== 'approuve' && review.statut !== 'Approuvé' && (
									<button
										type="button"
										onClick={() => onModerer(review.id, 'approuve')}
										class="text-[10px] font-black uppercase tracking-[0.3em] text-tertiary transition-colors hover:text-tertiary/80"
									>
										Approuver
									</button>
								)}
								<button
									type="button"
									onClick={() => onModerer(review.id, 'en_attente')}
									class="text-[10px] font-black uppercase tracking-[0.3em] text-outline transition-colors hover:text-on-surface"
								>
									Mettre en attente
								</button>
							</div>
						</div>
					</Reveal>
				))}
			</div>
		</Reveal>
	);
}

function ProfileManager({ profil, setProfil }) {
	const enregistrer = async () => {
		try {
			await api.admin.updateProfil(profil);
			alert('Profil sauvegardé !');
		} catch (error) {
			console.error('Erreur sauvegarde profil:', error);
			alert('Erreur sauvegarde');
		}
	};

	return (
		<Reveal class="surface-card-strong p-8 lg:p-10" delay={100}>
			<div class="flex flex-col gap-10 lg:flex-row lg:items-start">
				<img
					src={`https://ui-avatars.com/api/?name=${profil.nom}&background=d0af2f&color=231b00&size=300`}
					alt={profil.nom}
					class="h-36 w-36 rounded-[2rem] shadow-lift"
				/>

				<div class="flex-1 space-y-8">
					<div class="grid gap-6 md:grid-cols-2">
						<div class="space-y-3">
							<label class="field-label">Nom</label>
							<input
								value={profil.nom}
								onInput={(e) => setProfil({ ...profil, nom: e.target.value })}
								class="field-input"
							/>
						</div>

						<div class="space-y-3">
							<label class="field-label">Email</label>
							<input
								value={profil.email}
								onInput={(e) => setProfil({ ...profil, email: e.target.value })}
								class="field-input"
							/>
						</div>

						<div class="space-y-3 md:col-span-2">
							<label class="field-label">Nouveau mot de passe</label>
							<input
								type="password"
								value={profil.mot_de_passe || ''}
								onInput={(e) => setProfil({ ...profil, mot_de_passe: e.target.value })}
								class="field-input"
								placeholder="••••••••"
							/>
						</div>
					</div>

					<button
						type="button"
						onClick={enregistrer}
						class="inline-flex items-center justify-center rounded-full bg-on-surface px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-on-primary"
					>
						Sauvegarder
					</button>
				</div>
			</div>
		</Reveal>
	);
}
