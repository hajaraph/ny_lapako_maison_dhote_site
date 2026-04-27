import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { api, clearAuthToken, getAuthToken, resolveBackendAssetUrl } from '../../api';
import { Reveal } from '../../components/Reveal.jsx';
import { createSiteInfoForm } from '../../lib/siteSettings.js';

const navItems = [
	{ tab: 'stats', icon: 'dashboard', label: 'Vue globale' },
	{ tab: 'site', icon: 'public', label: 'Infos site' },
	{ tab: 'news', icon: 'auto_awesome', label: 'Actualités' },
	{ tab: 'events', icon: 'event', label: 'Événements' },
	{ tab: 'reviews', icon: 'forum', label: 'Avis clients' },
	{ tab: 'accounts', icon: 'manage_accounts', label: 'Comptes admin' },
	{ tab: 'profile', icon: 'settings', label: 'Mon compte' },
];

const tabTitles = {
	stats: 'Tableau de bord',
	site: 'Informations du site',
	news: 'Actualités',
	events: 'Événements',
	reviews: 'Avis clients',
	accounts: 'Comptes administrateurs',
	profile: 'Paramètres',
};

export function AdminDashboard() {
	const { url, route } = useLocation();
	const currentTab = url.split('/')[2] || 'stats';
	const [donnees, setDonnees] = useState([]);
	const [profil, setProfil] = useState(null);
	const [statistiques, setStatistiques] = useState(null);
	const [siteSettings, setSiteSettings] = useState(createSiteInfoForm());
	const [chargement, setChargement] = useState(true);
	const [rafraichissement, setRafraichissement] = useState(0);

	const navigate = (tab) => route(`/admin/${tab}`);
	const deconnexion = () => {
		clearAuthToken();
		route('/login');
	};
	const rafraichir = () => {
		setRafraichissement((value) => value + 1);
	};

	useEffect(() => {
		let alive = true;

		const load = async () => {
			if (!getAuthToken()) {
				clearAuthToken();
				route('/login');
				return;
			}

			setChargement(true);
			setStatistiques(null);

			try {
				const dataProfil = await api.admin.getProfil();
				if (!alive) {
					return;
				}

				setProfil(dataProfil);

				if (currentTab === 'stats') {
					const dataStats = await api.admin.stats();
					if (alive) {
						setStatistiques(dataStats);
						setDonnees([]);
					}
				} else if (currentTab === 'site') {
					const dataSite = await api.admin.siteInfo.lire();
					if (alive) {
						setSiteSettings(createSiteInfoForm(dataSite));
						setDonnees([]);
					}
				} else if (currentTab === 'news') {
					const items = await api.admin.actualites.lister();
					if (alive) setDonnees(Array.isArray(items) ? items : []);
				} else if (currentTab === 'events') {
					const items = await api.admin.evenements.lister();
					if (alive) setDonnees(Array.isArray(items) ? items : []);
				} else if (currentTab === 'reviews') {
					const items = await api.admin.avis.lister();
					if (alive) setDonnees(Array.isArray(items) ? items : []);
				} else if (currentTab === 'accounts') {
					const items = await api.admin.comptes.lister();
					if (alive) setDonnees(Array.isArray(items) ? items : []);
				} else if (alive) {
					setDonnees([]);
				}
			} catch (error) {
				console.error('Erreur chargement admin:', error);
				if (error?.status === 401) {
					clearAuthToken();
					route('/login');
					return;
				}

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
	}, [currentTab, rafraichissement, route]);

	const supprimerElement = async (id) => {
		if (!confirm('Supprimer cet élément ?')) return;

		try {
			if (currentTab === 'news') {
				await api.admin.actualites.supprimer(id);
			}
			setDonnees(donnees.filter((item) => item.id !== id));
			rafraichir();
		} catch (error) {
			console.error('Erreur suppression:', error);
			if (error?.status === 401) {
				clearAuthToken();
				route('/login');
				return;
			}
			alert('Erreur suppression');
		}
	};

	const modererAvis = async (id, statut) => {
		try {
			await api.admin.avis.moderer(id, statut);
			setDonnees(donnees.map((item) => (item.id === id ? { ...item, statut } : item)));
			rafraichir();
		} catch (error) {
			console.error('Erreur modération:', error);
			if (error?.status === 401) {
				clearAuthToken();
				route('/login');
				return;
			}
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
								Déconnexion sécurisée ou retour rapide vers la page d'accueil.
							</p>
						</div>
						<button
							type="button"
							onClick={deconnexion}
							class="flex w-full items-center gap-4 rounded-[1.75rem] bg-white/10 px-5 py-4 text-white transition-colors duration-300 hover:bg-white/15"
						>
							<span class="material-symbols-outlined">logout</span>
							<span class="text-[10px] font-black uppercase tracking-[0.3em]">Déconnexion</span>
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
							<div class="flex flex-wrap items-center gap-3">
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
								<button
									type="button"
									onClick={deconnexion}
									class="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-outline transition-colors hover:border-primary/30 hover:text-on-surface"
								>
									<span class="material-symbols-outlined text-[18px]">logout</span>
									<span>Déconnexion</span>
								</button>
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
								{currentTab === 'stats' && <StatsOverview stats={statistiques} />}
								{currentTab === 'site' && (
									<SiteSettingsManager
										data={siteSettings}
										setData={setSiteSettings}
									/>
								)}
								{currentTab === 'news' && (
									<NewsManager
										data={donnees}
										onSupprimer={supprimerElement}
										onRefresh={rafraichir}
									/>
								)}
								{currentTab === 'events' && <EventsManager data={donnees} onRefresh={rafraichir} />}
								{currentTab === 'reviews' && <ReviewsManager data={donnees} onModerer={modererAvis} />}
								{currentTab === 'accounts' && (
									<AccountsManager
										data={donnees}
										profil={profil}
										setProfil={setProfil}
										onRefresh={rafraichir}
									/>
								)}
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

function StatsOverview({ stats }) {
	const totalActualites = Number(stats?.actualitesTotal || 0);
	const totalEvenements = Number(stats?.evenementsTotal || 0);
	const avisEnAttente = Number(stats?.avisEnAttente || 0);
	const moyenneNote = Number(stats?.moyenneNote || 0).toFixed(1);
	const avisApprouves = Number(stats?.avisApprouves || 0);

	return (
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
			<StatCard label="Actualités" value={String(totalActualites)} icon="newspaper" hint="Contenus gérés par l'équipe" delay={80} />
			<StatCard label="Événements" value={String(totalEvenements)} icon="event" hint="Programmés ou archivés" delay={140} />
			<StatCard label="Avis à modérer" value={String(avisEnAttente)} icon="forum" hint={`${avisApprouves} avis déjà approuvés`} delay={200} />
			<StatCard label="Note moyenne" value={`${moyenneNote}/5`} icon="star" hint="Calculée sur les avis déposés" delay={260} />
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

const actualiteFormInitial = {
	titre: '',
	contenu: '',
	image_url: '',
	date_publication: '',
	statut: 'brouillon',
};

function NewsManager({ data, onRefresh }) {
	const { route } = useLocation();
	const [form, setForm] = useState(actualiteFormInitial);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState('');
	const [imageInputKey, setImageInputKey] = useState(0);
	const [editionId, setEditionId] = useState(null);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState(null);

	useEffect(() => {
		if (!imageFile) {
			setImagePreview('');
			return undefined;
		}

		const objectUrl = URL.createObjectURL(imageFile);
		setImagePreview(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [imageFile]);

	const resetForm = () => {
		setForm(actualiteFormInitial);
		setImageFile(null);
		setImageInputKey((value) => value + 1);
		setEditionId(null);
		setMessage(null);
	};

	const lancerEdition = (actu) => {
		setEditionId(actu.id);
		setForm({
			titre: actu.titre || '',
			contenu: actu.contenu || '',
			image_url: actu.image_url || '',
			date_publication: actu.date_publication || '',
			statut: actu.statut || 'brouillon',
		});
		setImageFile(null);
		setImageInputKey((value) => value + 1);
		setMessage(null);
	};

	const lireErreur = (error, fallback) => {
		if (error?.data && typeof error.data === 'object' && (error.data.error || error.data.message)) {
			return error.data.error || error.data.message;
		}

		return error?.message || fallback;
	};

	const enregistrer = async (e) => {
		e.preventDefault();
		const titre = form.titre.trim();

		if (!titre) {
			setMessage({ type: 'error', text: 'Le titre est obligatoire.' });
			return;
		}

		setSaving(true);
		setMessage(null);

		try {
			const payload = new FormData();
			payload.append('titre', titre);
			payload.append('contenu', form.contenu.trim());
			payload.append('date_publication', form.date_publication.trim());
			payload.append('statut', form.statut.trim() || 'brouillon');

			if (imageFile) {
				payload.append('image', imageFile);
			}

			if (editionId) {
				await api.admin.actualites.mettreAJour(editionId, payload);
				resetForm();
				setMessage({ type: 'success', text: 'Actualité mise à jour.' });
			} else {
				await api.admin.actualites.creer(payload);
				resetForm();
				setMessage({ type: 'success', text: 'Actualité créée.' });
			}

			onRefresh();
		} catch (error) {
			console.error('Erreur actualité:', error);
			if (error?.status === 401) {
				clearAuthToken();
				route('/login');
				return;
			}

			setMessage({
				type: 'error',
				text: lireErreur(error, editionId ? "La mise à jour a échoué." : "La création a échoué."),
			});
		} finally {
			setSaving(false);
		}
	};

	const supprimer = async (actu) => {
		if (!confirm(`Supprimer l'actualité "${actu.titre}" ?`)) {
			return;
		}

		try {
			await api.admin.actualites.supprimer(actu.id);
			if (editionId === actu.id) {
				resetForm();
			}
			setMessage({ type: 'success', text: 'Actualité supprimée.' });
			onRefresh();
		} catch (error) {
			console.error('Erreur suppression actualité:', error);
			if (error?.status === 401) {
				clearAuthToken();
				route('/login');
				return;
			}

			setMessage({ type: 'error', text: lireErreur(error, 'La suppression a échoué.') });
		}
	};

	return (
		<div class="space-y-8">
			<Reveal class="surface-card-strong p-8 lg:p-10" delay={80}>
				<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<div class="text-[10px] font-black uppercase tracking-[0.32em] text-outline">
							{editionId ? 'Modifier une actualité' : 'Créer une actualité'}
						</div>
						<h3 class="mt-4 font-serif text-4xl italic text-on-surface">
							{editionId ? 'Mise à jour du contenu' : 'Publier une nouvelle note'}
						</h3>
						<p class="mt-4 max-w-2xl text-sm leading-7 text-on-surface/70">
							Le formulaire ci-dessous alimente le site public et le tableau de bord. Le bouton de création est désormais actif.
						</p>
					</div>

					<button
						type="button"
						onClick={resetForm}
						class="inline-flex items-center justify-center rounded-full border border-primary/10 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-outline transition-colors hover:border-primary/30 hover:text-on-surface"
					>
						Nouvelle actualité
					</button>
				</div>

				{message && (
					<div
						class={`mt-6 rounded-[1.5rem] px-4 py-3 text-sm ${
							message.type === 'success' ? 'bg-tertiary/10 text-tertiary' : 'bg-rose-50 text-rose-700'
						}`}
					>
						{message.text}
					</div>
				)}

				<form class="mt-8 space-y-6" onSubmit={enregistrer}>
					<div class="grid gap-6 md:grid-cols-2">
						<div class="space-y-3 md:col-span-2">
							<label class="field-label">Titre</label>
							<input
								type="text"
								required
								value={form.titre}
								onInput={(e) => setForm({ ...form, titre: e.target.value })}
								class="field-input"
								placeholder="Titre de l'actualité"
							/>
						</div>

						<div class="space-y-3">
							<label class="field-label">Date de publication</label>
							<input
								type="date"
								value={form.date_publication}
								onInput={(e) => setForm({ ...form, date_publication: e.target.value })}
								class="field-input"
							/>
						</div>

						<div class="space-y-3">
							<label class="field-label">Statut</label>
							<select
								value={form.statut}
								onChange={(e) => setForm({ ...form, statut: e.currentTarget.value })}
								class="field-input"
							>
								<option value="brouillon">Brouillon</option>
								<option value="publie">Publié</option>
								<option value="archive">Archivé</option>
							</select>
						</div>

						<div class="space-y-3 md:col-span-2">
							<label class="field-label">Contenu</label>
							<textarea
								rows="5"
								value={form.contenu}
								onInput={(e) => setForm({ ...form, contenu: e.target.value })}
								class="field-textarea"
								placeholder="Rédigez le contenu de l'actualité..."
							/>
						</div>

						<div class="space-y-3 md:col-span-2">
							<label class="field-label">Image</label>
							<input
								key={imageInputKey}
								type="file"
								accept="image/*"
								onChange={(e) => setImageFile(e.currentTarget.files?.[0] || null)}
								class="field-input cursor-pointer py-3"
							/>
							<p class="text-[10px] font-black uppercase tracking-[0.28em] text-outline">
								Image stockée sur notre serveur
							</p>
							{(imagePreview || resolveBackendAssetUrl(form.image_url)) && (
								<div class="overflow-hidden rounded-[1.5rem] border border-primary/10 bg-white shadow-soft">
									<img
										src={imagePreview || resolveBackendAssetUrl(form.image_url)}
										alt={form.titre || "Aperçu de l'actualité"}
										class="h-44 w-full object-cover"
									/>
								</div>
							)}
							{imageFile ? (
								<div class="text-xs font-semibold text-on-surface/65">
									Fichier sélectionné : {imageFile.name}
								</div>
							) : form.image_url ? (
								<div class="text-xs font-semibold text-on-surface/65">
									L'image actuelle sera conservée si tu n'en ajoutes pas une nouvelle.
								</div>
							) : null}
						</div>
					</div>

					<div class="flex flex-col gap-3 sm:flex-row">
						<button
							type="submit"
							disabled={saving}
							class="inline-flex items-center justify-center rounded-full bg-on-surface px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
						>
							{saving ? 'Enregistrement...' : editionId ? 'Mettre à jour' : "Créer l'actualité"}
						</button>
						{editionId && (
							<button
								type="button"
								onClick={resetForm}
								class="inline-flex items-center justify-center rounded-full border border-primary/10 bg-white px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-outline transition-colors hover:border-primary/30 hover:text-on-surface"
							>
								Annuler l'édition
							</button>
						)}
					</div>
				</form>
			</Reveal>

			<div class="space-y-4">
				{data.length === 0 ? (
					<div class="surface-card p-6 text-sm leading-7 text-on-surface/70">
						Aucune actualité pour le moment. Créez-en une avec le formulaire ci-dessus.
					</div>
				) : (
					data.map((actu, index) => (
						<Reveal
							key={actu.id}
							as="article"
							class="surface-card overflow-hidden transition-transform duration-300 hover:-translate-y-1"
							delay={index * 120}
						>
							<img
								src={resolveBackendAssetUrl(actu.image_url) || 'https://picsum.photos/seed/1/800/600'}
								alt={actu.titre}
								class="h-64 w-full object-cover"
								loading="lazy"
							/>
							<div class="p-6">
								<div class="text-[10px] font-black uppercase tracking-[0.32em] text-outline">
									{actu.date_publication || 'Date non définie'}
								</div>
								<h4 class="mt-4 font-serif text-2xl italic text-on-surface">{actu.titre}</h4>
								<p class="mt-4 line-clamp-3 text-sm leading-7 text-on-surface/70">{actu.contenu}</p>
								<div class="mt-6 flex flex-wrap items-center justify-between gap-4">
									<div class="rounded-full bg-primary/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
										{actu.statut || 'brouillon'}
									</div>
									<div class="flex flex-wrap gap-3">
										<button
											type="button"
											onClick={() => lancerEdition(actu)}
											class="text-[10px] font-black uppercase tracking-[0.3em] text-outline transition-colors hover:text-on-surface"
										>
											Modifier
										</button>
										<button
											type="button"
											onClick={() => supprimer(actu)}
											class="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 transition-colors hover:text-rose-700"
										>
											Supprimer
										</button>
									</div>
								</div>
							</div>
						</Reveal>
					))
				)}
			</div>
		</div>
	);
}

const eventFormInitial = {
	titre: '',
	description: '',
	date_evenement: '',
	image_url: '',
	statut: 'planifie',
};

function EventsManager({ data, onRefresh }) {
	const { route } = useLocation();
	const [form, setForm] = useState(eventFormInitial);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState('');
	const [imageInputKey, setImageInputKey] = useState(0);
	const [editionId, setEditionId] = useState(null);
	const [message, setMessage] = useState(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!imageFile) {
			setImagePreview('');
			return undefined;
		}

		const objectUrl = URL.createObjectURL(imageFile);
		setImagePreview(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [imageFile]);

	const resetForm = () => {
		setForm(eventFormInitial);
		setImageFile(null);
		setImageInputKey((value) => value + 1);
		setEditionId(null);
	};

	const lancerEdition = (event) => {
		setEditionId(event.id);
		setForm({
			titre: event.titre || '',
			description: event.description || '',
			date_evenement: event.date_evenement || '',
			image_url: event.image_url || '',
			statut: event.statut || 'planifie',
		});
		setImageFile(null);
		setImageInputKey((value) => value + 1);
		setMessage(null);
	};

	const enregistrer = async (e) => {
		e.preventDefault();
		setSaving(true);
		setMessage(null);

		try {
			const payload = new FormData();
			payload.append('titre', form.titre);
			payload.append('description', form.description);
			payload.append('date_evenement', form.date_evenement);
			payload.append('image_url', form.image_url || '');
			payload.append('statut', form.statut);

			if (imageFile) {
				payload.append('image', imageFile);
			}

			if (editionId) {
				await api.admin.evenements.mettreAJour(editionId, payload);
				setMessage({ type: 'success', text: 'Événement mis à jour.' });
			} else {
				await api.admin.evenements.creer(payload);
				setMessage({ type: 'success', text: 'Événement créé.' });
			}

			resetForm();
			onRefresh();
		} catch (error) {
			console.error('Erreur événement:', error);
			if (error?.status === 401) {
				clearAuthToken();
				route('/login');
				return;
			}

			setMessage({
				type: 'error',
				text: editionId ? "La mise à jour a échoué." : "La création a échoué.",
			});
		} finally {
			setSaving(false);
		}
	};

	const supprimer = async (id) => {
		if (!confirm('Supprimer cet événement ?')) {
			return;
		}

		try {
			await api.admin.evenements.supprimer(id);
			if (editionId === id) {
				resetForm();
			}
			setMessage({ type: 'success', text: 'Événement supprimé.' });
			onRefresh();
		} catch (error) {
			console.error('Erreur suppression événement:', error);
			if (error?.status === 401) {
				clearAuthToken();
				route('/login');
				return;
			}

			setMessage({ type: 'error', text: 'La suppression a échoué.' });
		}
	};

	return (
		<div class="space-y-8">
			<Reveal class="surface-card-strong p-8 lg:p-10" delay={80}>
				<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<div class="text-[10px] font-black uppercase tracking-[0.32em] text-outline">
							{editionId ? 'Modifier un événement' : 'Créer un événement'}
						</div>
						<h3 class="mt-4 font-serif text-4xl italic text-on-surface">
							{editionId ? 'Réglages de l’événement' : 'Ajouter une date au calendrier'}
						</h3>
						<p class="mt-4 max-w-2xl text-sm leading-7 text-on-surface/70">
							Le formulaire ci-dessous alimente directement les événements publics et la vue admin.
						</p>
					</div>

					{editionId && (
						<button
							type="button"
							onClick={resetForm}
							class="inline-flex items-center justify-center rounded-full border border-primary/10 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-outline transition-colors hover:border-primary/30 hover:text-on-surface"
						>
							Annuler l'édition
						</button>
					)}
				</div>

				{message && (
					<div
						class={`mt-6 rounded-[1.5rem] px-4 py-3 text-sm ${
							message.type === 'success' ? 'bg-tertiary/10 text-tertiary' : 'bg-rose-50 text-rose-700'
						}`}
					>
						{message.text}
					</div>
				)}

				<form class="mt-8 space-y-6" onSubmit={enregistrer}>
					<div class="grid gap-6 md:grid-cols-2">
						<div class="space-y-3">
							<label class="field-label">Titre</label>
							<input
								type="text"
								required
								value={form.titre}
								onInput={(e) => setForm({ ...form, titre: e.target.value })}
								class="field-input"
								placeholder="Soirée musique live"
							/>
						</div>

						<div class="space-y-3">
							<label class="field-label">Date</label>
							<input
								type="date"
								value={form.date_evenement}
								onInput={(e) => setForm({ ...form, date_evenement: e.target.value })}
								class="field-input"
							/>
						</div>

						<div class="space-y-3 md:col-span-2">
							<label class="field-label">Description</label>
							<textarea
								rows="4"
								value={form.description}
								onInput={(e) => setForm({ ...form, description: e.target.value })}
								class="field-textarea"
								placeholder="Décrivez le déroulé de l'événement..."
							/>
						</div>

						<div class="space-y-3">
							<label class="field-label">Image</label>
							<input
								key={imageInputKey}
								type="file"
								accept="image/*"
								onChange={(e) => setImageFile(e.currentTarget.files?.[0] || null)}
								class="field-input cursor-pointer py-3"
							/>
							<p class="text-[10px] font-black uppercase tracking-[0.28em] text-outline">
								Image stockée sur notre serveur
							</p>
							{(imagePreview || resolveBackendAssetUrl(form.image_url)) && (
								<div class="overflow-hidden rounded-[1.5rem] border border-primary/10 bg-white shadow-soft">
									<img
										src={imagePreview || resolveBackendAssetUrl(form.image_url)}
										alt="Aperçu de l'événement"
										class="h-44 w-full object-cover"
									/>
								</div>
							)}
							{imageFile ? (
								<div class="text-xs font-semibold text-on-surface/65">
									Fichier sélectionné : {imageFile.name}
								</div>
							) : form.image_url ? (
								<div class="text-xs font-semibold text-on-surface/65">
									L'image actuelle sera conservée si tu n'en ajoutes pas une nouvelle.
								</div>
							) : null}
						</div>

						<div class="space-y-3">
							<label class="field-label">Statut</label>
							<select
								value={form.statut}
								onChange={(e) => setForm({ ...form, statut: e.currentTarget.value })}
								class="field-input"
							>
								<option value="planifie">Planifié</option>
								<option value="actif">Actif</option>
								<option value="termine">Terminé</option>
								<option value="annule">Annulé</option>
							</select>
						</div>
					</div>

					<div class="flex flex-col gap-3 sm:flex-row">
						<button
							type="submit"
							disabled={saving}
							class="inline-flex items-center justify-center rounded-full bg-on-surface px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
						>
							{saving ? 'Enregistrement...' : editionId ? 'Mettre à jour' : 'Créer'}
						</button>
						{editionId && (
							<button
								type="button"
								onClick={resetForm}
								class="inline-flex items-center justify-center rounded-full border border-primary/10 bg-white px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-outline transition-colors hover:border-primary/30 hover:text-on-surface"
							>
								Réinitialiser
							</button>
						)}
					</div>
				</form>
			</Reveal>

			<div class="space-y-4">
				{data.length === 0 ? (
					<div class="surface-card p-6 text-sm leading-7 text-on-surface/70">
						Aucun événement pour le moment. Ajoutez-en un avec le formulaire ci-dessus.
					</div>
				) : (
					data.map((event, index) => (
						<Reveal key={event.id} class="surface-card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between" delay={index * 120}>
							<div class="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row">
								{resolveBackendAssetUrl(event.image_url) && (
									<div class="overflow-hidden rounded-[1.5rem] border border-primary/10 bg-white shadow-soft">
										<img
											src={resolveBackendAssetUrl(event.image_url)}
											alt={event.titre}
											class="h-44 w-full object-cover sm:h-28 sm:w-28"
											loading="lazy"
										/>
									</div>
								)}
								<div class="min-w-0">
									<div class="text-[10px] font-black uppercase tracking-[0.32em] text-primary">
										{formatEventDate(event.date_evenement)}
									</div>
									<h4 class="mt-3 font-serif text-2xl italic text-on-surface">{event.titre}</h4>
									<p class="mt-4 max-w-2xl text-sm leading-7 text-on-surface/70">{event.description}</p>
									<div class="mt-4 flex flex-wrap items-center gap-2">
										<span class="rounded-full bg-tertiary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.32em] text-tertiary">
											{formatEventStatus(event.statut)}
										</span>
										{event.image_url && (
											<span class="truncate rounded-full bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.32em] text-outline">
												Image liée
											</span>
										)}
									</div>
								</div>
							</div>

							<div class="flex flex-wrap gap-3">
								<button
									type="button"
									onClick={() => lancerEdition(event)}
									class="inline-flex items-center justify-center rounded-full border border-primary/10 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-outline transition-colors hover:border-primary/30 hover:text-on-surface"
								>
									Modifier
								</button>
								<button
									type="button"
									onClick={() => supprimer(event.id)}
									class="inline-flex items-center justify-center rounded-full bg-rose-50 px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-rose-700 transition-colors hover:bg-rose-100"
								>
									Supprimer
								</button>
							</div>
						</Reveal>
					))
				)}
			</div>
		</div>
	);
}

function formatEventDate(value) {
	if (!value) {
		return 'Date à définir';
	}

	let parsedDate;

	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		const [year, month, day] = value.split('-').map(Number);
		parsedDate = new Date(year, month - 1, day);
	} else {
		parsedDate = new Date(value);
	}

	if (Number.isNaN(parsedDate.getTime())) {
		return value;
	}

	return parsedDate.toLocaleDateString('fr-FR', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});
}

function formatEventStatus(statut) {
	const normalized = String(statut || 'planifie').toLowerCase();

	switch (normalized) {
		case 'actif':
			return 'Actif';
		case 'termine':
		case 'terminé':
			return 'Terminé';
		case 'annule':
		case 'annulé':
			return 'Annulé';
		default:
			return 'Planifié';
	}
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

const accountFormInitial = {
	nom: '',
	email: '',
	mot_de_passe: '',
};

function AccountsManager({ data, profil, setProfil, onRefresh }) {
	const { route } = useLocation();
	const [form, setForm] = useState(accountFormInitial);
	const [editionId, setEditionId] = useState(null);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState(null);

	const resetForm = () => {
		setForm(accountFormInitial);
		setEditionId(null);
	};

	const lancerEdition = (compte) => {
		setEditionId(compte.id);
		setForm({
			nom: compte.nom || '',
			email: compte.email || '',
			mot_de_passe: '',
		});
		setMessage(null);
	};

	const lireErreur = (error, fallback) => {
		if (error?.data && typeof error.data === 'object' && (error.data.error || error.data.message)) {
			return error.data.error || error.data.message;
		}
		return error?.message || fallback;
	};

	const enregistrer = async (e) => {
		e.preventDefault();

		const payload = {
			nom: form.nom.trim(),
			email: form.email.trim().toLowerCase(),
		};
		const motDePasse = form.mot_de_passe.trim();

		if (!payload.nom || !payload.email) {
			setMessage({ type: 'error', text: 'Le nom et l’email sont obligatoires.' });
			return;
		}

		if (!editionId && !motDePasse) {
			setMessage({ type: 'error', text: 'Le mot de passe est obligatoire pour créer un compte.' });
			return;
		}

		if (motDePasse) {
			payload.mot_de_passe = motDePasse;
		}

		setSaving(true);
		setMessage(null);

		try {
			if (editionId) {
				await api.admin.comptes.mettreAJour(editionId, payload);
				setMessage({ type: 'success', text: 'Compte administrateur mis à jour.' });

				if (profil?.id === editionId) {
					setProfil({ ...profil, nom: payload.nom, email: payload.email });
				}
			} else {
				await api.admin.comptes.creer(payload);
				setMessage({ type: 'success', text: 'Compte administrateur créé.' });
			}

			resetForm();
			onRefresh();
		} catch (error) {
			console.error('Erreur gestion comptes:', error);
			if (error?.status === 401) {
				clearAuthToken();
				route('/login');
				return;
			}
			setMessage({ type: 'error', text: lireErreur(error, "L'opération a échoué.") });
		} finally {
			setSaving(false);
		}
	};

	const supprimer = async (compte) => {
		if (!confirm(`Supprimer le compte ${compte.email} ?`)) {
			return;
		}

		try {
			await api.admin.comptes.supprimer(compte.id);
			setMessage({ type: 'success', text: 'Compte administrateur supprimé.' });
			onRefresh();
		} catch (error) {
			console.error('Erreur suppression compte:', error);
			if (error?.status === 401) {
				clearAuthToken();
				route('/login');
				return;
			}
			setMessage({ type: 'error', text: lireErreur(error, 'La suppression a échoué.') });
		}
	};

	return (
		<div class="space-y-8">
			<Reveal class="surface-card-strong p-8 lg:p-10" delay={90}>
				<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<div class="text-[10px] font-black uppercase tracking-[0.32em] text-outline">
							{editionId ? 'Modifier un compte admin' : 'Créer un compte admin'}
						</div>
						<h3 class="mt-4 font-serif text-4xl italic text-on-surface">
							{editionId ? 'Mise à jour du compte' : 'Ajouter un administrateur'}
						</h3>
					</div>

					{editionId && (
						<button
							type="button"
							onClick={resetForm}
							class="inline-flex items-center justify-center rounded-full border border-primary/10 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-outline transition-colors hover:border-primary/30 hover:text-on-surface"
						>
							Annuler l'édition
						</button>
					)}
				</div>

				{message && (
					<div
						class={`mt-6 rounded-[1.5rem] px-4 py-3 text-sm ${
							message.type === 'success' ? 'bg-tertiary/10 text-tertiary' : 'bg-rose-50 text-rose-700'
						}`}
					>
						{message.text}
					</div>
				)}

				<form class="mt-8 space-y-6" onSubmit={enregistrer}>
					<div class="grid gap-6 md:grid-cols-2">
						<div class="space-y-3">
							<label class="field-label">Nom</label>
							<input
								type="text"
								required
								value={form.nom}
								onInput={(e) => setForm({ ...form, nom: e.target.value })}
								class="field-input"
								placeholder="Nom complet"
							/>
						</div>
						<div class="space-y-3">
							<label class="field-label">Email</label>
							<input
								type="email"
								required
								value={form.email}
								onInput={(e) => setForm({ ...form, email: e.target.value })}
								class="field-input"
								placeholder="admin@nylapako.fr"
							/>
						</div>
						<div class="space-y-3 md:col-span-2">
							<label class="field-label">
								{editionId ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
							</label>
							<input
								type="password"
								required={!editionId}
								value={form.mot_de_passe}
								onInput={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
								class="field-input"
								placeholder={editionId ? 'Laisser vide pour conserver' : 'Minimum 8 caractères'}
							/>
						</div>
					</div>
					<div class="flex flex-col gap-3 sm:flex-row">
						<button
							type="submit"
							disabled={saving}
							class="inline-flex items-center justify-center rounded-full bg-on-surface px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
						>
							{saving ? 'Enregistrement...' : editionId ? 'Mettre à jour' : 'Créer le compte'}
						</button>
					</div>
				</form>
			</Reveal>

			<div class="space-y-4">
				{data.length === 0 ? (
					<div class="surface-card p-6 text-sm leading-7 text-on-surface/70">
						Aucun compte administrateur trouvé.
					</div>
				) : (
					data.map((compte, index) => {
						const estCompteCourant = profil?.id === compte.id;

						return (
							<Reveal key={compte.id} class="surface-card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between" delay={index * 110}>
								<div>
									<div class="text-[10px] font-black uppercase tracking-[0.32em] text-outline">
										Administrateur
									</div>
									<h4 class="mt-3 font-serif text-2xl italic text-on-surface">{compte.nom}</h4>
									<p class="mt-2 text-sm leading-7 text-on-surface/70">{compte.email}</p>
								</div>

								<div class="flex flex-wrap items-center gap-3">
									{estCompteCourant && (
										<span class="rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.32em] text-primary">
											Compte actif
										</span>
									)}
									<button
										type="button"
										onClick={() => lancerEdition(compte)}
										class="inline-flex items-center justify-center rounded-full border border-primary/10 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-outline transition-colors hover:border-primary/30 hover:text-on-surface"
									>
										Modifier
									</button>
									<button
										type="button"
										onClick={() => supprimer(compte)}
										disabled={estCompteCourant}
										class="inline-flex items-center justify-center rounded-full bg-rose-50 px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-55"
									>
										Supprimer
									</button>
								</div>
							</Reveal>
						);
					})
				)}
			</div>
		</div>
	);
}

function SiteSettingsManager({ data, setData }) {
	const { route } = useLocation();
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState(null);

	const lireErreur = (error, fallback) => {
		if (error?.data && typeof error.data === 'object' && (error.data.error || error.data.message)) {
			return error.data.error || error.data.message;
		}

		return error?.message || fallback;
	};

	const enregistrer = async (e) => {
		e.preventDefault();
		setSaving(true);
		setMessage(null);

		try {
			const payload = createSiteInfoForm(data);
			const response = await api.admin.siteInfo.mettreAJour(payload);
			const siteInfo = createSiteInfoForm(response?.siteInfo || response);

			setData(siteInfo);
			setMessage({ type: 'success', text: 'Informations du site mises à jour.' });
		} catch (error) {
			console.error('Erreur paramètres site:', error);
			if (error?.status === 401) {
				clearAuthToken();
				route('/login');
				return;
			}

			setMessage({ type: 'error', text: lireErreur(error, 'La mise à jour a échoué.') });
		} finally {
			setSaving(false);
		}
	};

	return (
		<Reveal class="surface-card-strong p-8 lg:p-10" delay={100}>
			<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<div class="text-[10px] font-black uppercase tracking-[0.32em] text-outline">Paramètres publics</div>
					<h3 class="mt-4 font-serif text-4xl italic text-on-surface">Coordonnées et crédit du site</h3>
					<p class="mt-4 max-w-2xl text-sm leading-7 text-on-surface/70">
						Ces champs alimentent le footer, l'adresse affichée et les liens de contact du site public.
					</p>
				</div>
			</div>

			{message && (
				<div
					class={`mt-6 rounded-[1.5rem] px-4 py-3 text-sm ${
						message.type === 'success' ? 'bg-tertiary/10 text-tertiary' : 'bg-rose-50 text-rose-700'
					}`}
				>
					{message.text}
				</div>
			)}

			<form class="mt-8 space-y-6" onSubmit={enregistrer}>
				<div class="grid gap-6 md:grid-cols-2">
					<div class="space-y-3 md:col-span-2">
						<label class="field-label">Adresse</label>
						<textarea
							rows="4"
							value={data.address}
							onInput={(e) => setData({ ...data, address: e.target.value })}
							class="field-textarea"
							placeholder={'Lanirano\nFort-Dauphin\nMadagascar'}
						/>
					</div>

					<div class="space-y-3">
						<label class="field-label">Téléphone</label>
						<input
							type="text"
							value={data.contact_phone}
							onInput={(e) => setData({ ...data, contact_phone: e.target.value })}
							class="field-input"
							placeholder="0340721499"
						/>
					</div>

					<div class="space-y-3">
						<label class="field-label">WhatsApp</label>
						<input
							type="text"
							value={data.contact_whatsapp}
							onInput={(e) => setData({ ...data, contact_whatsapp: e.target.value })}
							class="field-input"
							placeholder="0340721499"
						/>
					</div>

					<div class="space-y-3">
						<label class="field-label">Email de contact</label>
						<input
							type="email"
							value={data.contact_email}
							onInput={(e) => setData({ ...data, contact_email: e.target.value })}
							class="field-input"
							placeholder="contact@nylapako.fr"
						/>
					</div>

					<div class="space-y-3">
						<label class="field-label">Horaires</label>
						<input
							type="text"
							value={data.opening_hours}
							onInput={(e) => setData({ ...data, opening_hours: e.target.value })}
							class="field-input"
							placeholder="Accueil 7j/7"
						/>
					</div>

					<div class="space-y-3">
						<label class="field-label">Check-in</label>
						<input
							type="text"
							value={data.check_in}
							onInput={(e) => setData({ ...data, check_in: e.target.value })}
							class="field-input"
							placeholder="Check-in dès 15h"
						/>
					</div>

					<div class="space-y-3">
						<label class="field-label">Copyright</label>
						<input
							type="text"
							value={data.copyright_owner}
							onInput={(e) => setData({ ...data, copyright_owner: e.target.value })}
							class="field-input"
							placeholder="Demondra"
						/>
					</div>

					<div class="space-y-3">
						<label class="field-label">Lien du copyright</label>
						<input
							type="url"
							value={data.copyright_url}
							onInput={(e) => setData({ ...data, copyright_url: e.target.value })}
							class="field-input"
							placeholder="https://github.com/hajaraph"
						/>
					</div>
				</div>

				<div class="flex flex-col gap-3 sm:flex-row">
					<button
						type="submit"
						disabled={saving}
						class="inline-flex items-center justify-center rounded-full bg-on-surface px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
					>
						{saving ? 'Enregistrement...' : 'Mettre à jour'}
					</button>
				</div>
			</form>
		</Reveal>
	);
}

function ProfileManager({ profil, setProfil }) {
	const { route } = useLocation();

	const enregistrer = async () => {
		try {
			await api.admin.updateProfil(profil);
			alert('Profil sauvegardé !');
		} catch (error) {
			console.error('Erreur sauvegarde profil:', error);
			if (error?.status === 401) {
				clearAuthToken();
				route('/login');
				return;
			}
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
