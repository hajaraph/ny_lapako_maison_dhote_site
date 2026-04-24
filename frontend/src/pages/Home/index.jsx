import { useEffect, useState } from 'preact/hooks';
import { api } from '../../api';
import { Reveal } from '../../components/Reveal.jsx';
import debutImage from '../../assets/images_archi.jpeg';
import heroImage from '../../assets/debut.png';
import gardenImage from '../../assets/debut_images.jpeg';
import './style.css';

const suites = [
	{
		name: 'Suite Solaire',
		detail: '45 m² · lumière du matin',
		description: "Un cocon ouvert sur la clarté, avec une palette douce et des matières naturelles.",
		image: 'AB6AXuCBUc_VMgb-h3oXpWG8ANG4DDlg7f5Fpyyv5wAhgTBUxOkfLRXUg9OmJ2O3drfbZrOV2TmnuPfqQuk1205yi4RGxF_D6I8oLkrorAvKSWLXxa5v9EbgODTFIVtKsKHTb-XWTB5GKZ1iJ0Z-Re04lz19kAlaVXXnNtBzUSha06BeG-nqsmINpDEBsT1yi6Yf6c5p5vRruFClMq8GTZLuUUURj7hEcYunbmgdxcJ8AbrWNBzSQPjKhWTyX0c_CkkvVLxuaFT3utgI7p8',
		tag: 'Best seller',
	},
	{
		name: 'Suite Canopée',
		detail: '60 m² · face aux pins',
		description: "Une suite plus enveloppante, idéale pour ralentir et se reconnecter au jardin.",
		image: 'AB6AXuBJEy5mzEF09TPhPTrjZdxQ6JehpqRtDdAEj5NPRaE4ZCSQQCkcd4mlFW5FrGKcDYBYM6huSyykiOv-arV4bBb1Q07_prma2K4diG8HuPa9BiHNIL47MJsNewOG24XBYj3Z8iTbEeu_n-KlSyGV5QJ_GZSw3I01SBqzl4hJj67vUOpA83wUKdEoTY6b61i6mETS1-YjI5pPNKZzhsdUapGauefPozXk1ph5iDchvLFhE66I4387qjnan6c7fkH1X60ZTrDXEWjmWTc',
		tag: 'Vue jardin',
	},
	{
		name: 'Suite Éclat',
		detail: '50 m² · design or et calme',
		description: "La plus graphique de nos suites, entre confort contemporain et chaleur solaire.",
		image: 'AB6AXuCWYkFc45A9M8apLV9JE5XM_BLybjOls-oZP9m2tmZso-MJB44IaCIiyqQvkpYb8tIBuEiBSdE7Q6X-VfghxIZgeD0ss8bQ5hydyPDF8vQ3aIP2Zg-Z3eTrHbcHKeAzKP4JH3D0dsvvado_Ps_Cn3VqLYWIs6K0TRtUyTi-QcnWQS69CyoH4aASp-jCVG_8Cw5hpBjlg0QkgKCEcBwlmek5QRgT7I5_GYCMJ4qe7XnOXhp5hhjBU4vUeSGlvZG64IdyT4YPQavXElU',
		tag: 'Signature',
	},
];

const moments = [
	{
		title: 'Réveil artisanal',
		description: 'Pain au levain, miel du domaine et fruits de saison pour commencer la journée avec douceur.',
		image: debutImage,
	},
	{
		title: 'Le jardin serein',
		description: 'Quatre hectares de respiration végétale, de coins d’ombre et de lecture au soleil.',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBavB7GK02ugR5SK01TxhPLzIgvONQqvNCyIMVNKo7EMF_RSZqaoNrJDUh08g1PPgTbq8DEx7wDxReKGdDKpQ1BiLrUmB4ZtsrJ87FurzjwJV-UNxjX-fB0D3UGEQYXHyHndS_MLGzQ5Z13XtOrWzBMrTUjxv2c5B8x3jv44Xj15E2EEUyWDgkk3CAmw9AEuLxDaOLj9RZdtBiGJ4Be4p2Q0pFNzAiaGbwZ44obQVlDmYogr2xqAwdENmYdVJDnYJw6IUJ1KMtuq4g',
	},
	{
		title: 'Bains de forêt',
		description: 'Des promenades lentes sous les pins pour retrouver le calme et le souffle.',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHqvu8uRU2f8Lp5ZjdyyK3-1GtBIxi6cpf8IMtcXlYsJIptBqW2q22juxlzjznqpqBvMF933Q_ckars2CQzD3DktX90LWyidcXpXPQeXXagY3Uv-O0WzmIfcRWOWX-eyS20fEvS6Txcg2avkuj6bbVsX7lrOkEA_hpIrW17q7l7PeLJHLxFVN6oZ2fUu8BPAhLb1GhIZ2PpHqxk2Z0TI00iI-EKFFBVL-aLfv2BfqkDqJmqEFW7b3iXz4H0Xncb65Jxa-GKhfBVg0',
	},
];

const heroPills = ['Petit-déjeuner local', 'Jardin privé', 'Suites lumineuses'];

export function Home() {
	const [actualites, setActualites] = useState([]);
	const [evenements, setEvenements] = useState([]);
	const [avis, setAvis] = useState([]);
	const [nouvelAvis, setNouvelAvis] = useState({
		nom_client: '',
		commentaire: '',
		note: 5,
		date_sejour: '',
	});
	const [envoiEnCours, setEnvoiEnCours] = useState(false);
	const [formMessage, setFormMessage] = useState(null);

	useEffect(() => {
		api.actualites
			.lister()
			.then((data) => setActualites(Array.isArray(data) ? data : []))
			.catch((err) => {
				console.error('Erreur actualités:', err);
				setActualites([]);
			});

		api.evenements
			.lister()
			.then((data) => setEvenements(Array.isArray(data) ? data : []))
			.catch((err) => {
				console.error('Erreur événements:', err);
				setEvenements([]);
			});

		api.avis
			.lister()
			.then((data) => {
				if (!Array.isArray(data)) {
					setAvis([]);
					return;
				}

				setAvis(data.filter((item) => item && (item.statut === 'approuve' || item.statut === 'Approuvé')));
			})
			.catch((err) => {
				console.error('Erreur avis:', err);
				setAvis([]);
			});
	}, []);

	const soumettreAvis = async (e) => {
		e.preventDefault();
		setEnvoiEnCours(true);
		setFormMessage(null);

		try {
			await api.avis.soumettre(nouvelAvis);
			setFormMessage({
				type: 'success',
				text: 'Merci. Votre avis est bien reçu et attend maintenant sa modération.',
			});
			setNouvelAvis({ nom_client: '', commentaire: '', note: 5, date_sejour: '' });
		} catch (err) {
			console.error('Erreur envoi avis:', err);
			setFormMessage({
				type: 'error',
				text: "L'envoi a échoué. Merci de réessayer dans quelques instants.",
			});
		} finally {
			setEnvoiEnCours(false);
		}
	};

	return (
		<div class="relative overflow-hidden">
			<section id="esprit" class="relative isolate overflow-hidden pb-20 pt-32 lg:pb-28 lg:pt-36">
				<div class="absolute inset-0">
					<img class="hero-zoom h-full w-full object-cover" alt="Patio de la maison d'hôtes" src={heroImage} loading="eager" />
					<div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,27,18,0.7)_0%,rgba(28,27,18,0.42)_48%,rgba(253,250,241,0.98)_100%)]"></div>
					<div class="hero-orb orb-drift left-[-6rem] top-28 h-72 w-72 bg-primary/30"></div>
					<div class="hero-orb orb-drift right-[-3rem] top-24 h-80 w-80 bg-tertiary/25"></div>
				</div>

				<div class="section-shell relative grid items-end gap-12 lg:grid-cols-[1.08fr_0.92fr]">
					<Reveal class="max-w-3xl pb-10 text-white" delay={90}>
						<span class="section-kicker border-white/15 bg-white/10 text-white/70">
							L'expérience de l'or végétal
						</span>
						<h1 class="mt-8 max-w-2xl font-serif text-5xl leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-display-xl">
							La lumière
							<span class="text-sheen block bg-[linear-gradient(90deg,#d0af2f_0%,#fff4c5_25%,#d0af2f_50%,#ffe179_75%,#d0af2f_100%)] bg-clip-text text-transparent">
								prend son temps.
							</span>
						</h1>
						<p class="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
							Un refuge contemporain à Lanirano, Fort-Dauphin, où le jardin, les suites et le petit-déjeuner s'accordent dans une ambiance plus douce.
						</p>

						<div class="mt-10 flex flex-wrap gap-4">
							<a href="/#chambres" class="inline-flex items-center justify-center rounded-full bg-white px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-on-surface transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-on-primary">
								Découvrir les suites
							</a>
							<a href="/#jardin" class="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15">
								Explorer le jardin
							</a>
						</div>

						<div class="mt-10 flex flex-wrap gap-3">
							{heroPills.map((pill) => (
								<span key={pill} class="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/75">
									{pill}
								</span>
							))}
						</div>
					</Reveal>

					<Reveal class="relative" delay={220}>
						<div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/20 blur-3xl page-glow"></div>
						<div class="surface-card-strong p-4">
							<div class="relative overflow-hidden rounded-[1.75rem]">
								<img class="hero-zoom h-[28rem] w-full object-cover" alt="Petit-déjeuner artisanal" src={moments[0].image} loading="eager" />
								<div class="absolute inset-0 bg-gradient-to-t from-[#1c1b12]/55 via-transparent to-transparent"></div>
							</div>

							<div class="mt-4 grid gap-3 sm:grid-cols-2">
								<div class="rounded-[1.5rem] bg-surface-container-lowest p-4">
									<div class="text-[10px] font-black uppercase tracking-[0.3em] text-outline">Adresse</div>
									<div class="mt-2 text-sm font-semibold text-on-surface">Lanirano, Fort-Dauphin</div>
								</div>
								<div class="rounded-[1.5rem] bg-surface-container-lowest p-4">
									<div class="text-[10px] font-black uppercase tracking-[0.3em] text-outline">Ambiance</div>
									<div class="mt-2 text-sm font-semibold text-on-surface">Lumière douce et calme absolu</div>
								</div>
								<div class="rounded-[1.5rem] bg-surface-container-lowest p-4 sm:col-span-2">
									<div class="text-[10px] font-black uppercase tracking-[0.3em] text-outline">Expérience</div>
									<div class="mt-2 text-sm leading-7 text-on-surface/70">
										Une arrivée fluide, un service discret et des espaces pensés pour se poser vraiment.
									</div>
								</div>
							</div>
						</div>
					</Reveal>
				</div>
			</section>

			<section id="jardin" class="section-shell py-24 lg:py-28">
				<div class="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
					<Reveal class="order-2 lg:order-1" delay={80}>
						<span class="section-kicker">Le jardin</span>
						<h2 class="section-title mt-6">
							Un décor solaire, silencieux et habité.
						</h2>
						<p class="section-copy mt-6">
							La terrasse ocre de la maison s'ouvre entre un ciel lumineux et un jardin luxuriant. Le bois brut, la verdure et les matières naturelles composent une scène plus apaisée, idéale pour les petits-déjeuners et les pauses longues.
						</p>

						<div class="mt-8 grid gap-4 sm:grid-cols-2">
							<Reveal class="surface-card p-5" delay={80}>
							<div class="text-[10px] font-black uppercase tracking-[0.3em] text-outline">Matin</div>
							<div class="mt-3 font-serif text-2xl italic text-on-surface">Petit-déjeuner au soleil</div>
							<p class="mt-3 text-sm leading-7 text-on-surface/70">
								Une table simple, locale et généreuse pour démarrer sans précipitation.
							</p>
						</Reveal>
						<Reveal class="surface-card p-5" delay={160}>
							<div class="text-[10px] font-black uppercase tracking-[0.3em] text-outline">Atmosphère</div>
							<div class="mt-3 font-serif text-2xl italic text-on-surface">Verdure et intimité</div>
							<p class="mt-3 text-sm leading-7 text-on-surface/70">
								Des coins d'ombre, de la profondeur et le sentiment d'être un peu à l'écart.
							</p>
							</Reveal>
						</div>
					</Reveal>

					<Reveal class="order-1 lg:order-2" delay={160}>
						<div class="relative">
							<div class="absolute -inset-6 rounded-[2.5rem] bg-primary/10 blur-2xl"></div>
							<div class="surface-card-strong overflow-hidden">
								<img class="h-[24rem] w-full object-cover sm:h-[32rem]" alt="Terrasse et jardin" src={gardenImage} loading="lazy" />
								<div class="border-t border-primary/10 bg-white/92 p-6">
									<div class="text-[10px] font-black uppercase tracking-[0.3em] text-outline">Terrasse principale</div>
									<p class="mt-2 text-sm leading-7 text-on-surface/70">
										Une scène suspendue entre ciel, végétation et lumière dorée.
									</p>
								</div>
							</div>
						</div>
					</Reveal>
				</div>
			</section>

			<section id="chambres" class="bg-surface-container-lowest/70 py-24 lg:py-28">
				<div class="section-shell">
					<SectionHeading
						kicker="Nos suites"
						title="Des chambres pensées comme des refuges."
						description="Lignes douces, matières naturelles et lumière filtrée composent trois signatures différentes, mais toujours calmes et élégantes."
						delay={60}
					/>

					<div class="mt-12 grid gap-8 md:grid-cols-3">
						{suites.map((suite, index) => (
							<SuiteCard key={suite.name} suite={suite} delay={index * 120} />
						))}
					</div>
				</div>
			</section>

			{actualites.length > 0 && (
				<section class="section-shell py-24 lg:py-28">
					<SectionHeading
						kicker="Actualités"
						title="Murmures du refuge."
						description="Quelques instants, quelques nouvelles et des images du quotidien pour garder le lien avec la maison."
						delay={80}
					/>

					<div class="mt-12 grid gap-8 md:grid-cols-3">
						{actualites.slice(0, 3).map((actu, index) => (
							<ArticleCard key={actu.id ?? actu.titre} item={actu} delay={index * 120} />
						))}
					</div>
				</section>
			)}

			<section class="section-shell py-24 lg:py-28">
					<SectionHeading
						kicker="Moments choisis"
						title="L'or du détail au service du calme."
						description="Trois instants pour illustrer ce que l'on vient chercher ici: une table simple, un jardin vivant et des promenades lentes."
						align="center"
						delay={70}
					/>

				<div class="mt-12 grid gap-8 md:grid-cols-3">
					{moments.map((moment, index) => (
						<MomentCard key={moment.title} moment={moment} delay={index * 120} />
					))}
				</div>
			</section>

			{evenements.length > 0 && (
				<section class="border-y border-primary/10 bg-white/55 py-24 lg:py-28">
					<div class="section-shell">
						<SectionHeading
							kicker="Événements"
							title="Instants présents."
							description="Des rendez-vous plus ponctuels, mais toujours ancrés dans la même idée d'hospitalité calme et généreuse."
							delay={80}
						/>

						<div class="mt-12 grid gap-6 md:grid-cols-3">
							{evenements.map((event, index) => (
								<EventCard key={event.id ?? `${event.date_evenement}-${event.titre}`} event={event} delay={index * 120} />
							))}
						</div>
					</div>
				</section>
			)}

			<section id="avis" class="section-shell py-24 lg:py-28">
					<SectionHeading
						kicker="Livre d'or"
						title="Les séjours laissent une trace."
						description="Quand les voyageurs repartent avec plus de calme que d'habitude, les mots se déposent naturellement ici."
						delay={90}
					/>

				<div class="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
					<div class="grid gap-6">
						{avis.length > 0 ? (
							avis.map((review, index) => (
								<ReviewCard key={review.id ?? `${review.nom_client}-${index}`} review={review} featured={index === 1} delay={index * 120} />
							))
						) : (
							<div class="surface-card p-8 text-sm leading-7 text-on-surface/70">
								Les avis approuvés apparaîtront ici dès qu'ils seront publiés.
							</div>
						)}
					</div>

					<div class="surface-card-strong p-8 lg:p-10">
						<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<div class="text-[10px] font-black uppercase tracking-[0.32em] text-outline">Contribution</div>
								<h3 class="mt-4 font-serif text-3xl leading-tight text-on-surface sm:text-4xl">
									Laissez une trace de votre passage.
								</h3>
							</div>
							<div class="rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
								Modération avant publication
							</div>
						</div>

						{formMessage && (
							<div
								class={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
									formMessage.type === 'success'
										? 'border-tertiary/15 bg-tertiary/10 text-tertiary'
										: 'border-rose-200 bg-rose-50 text-rose-700'
								}`}
							>
								{formMessage.text}
							</div>
						)}

						<form onSubmit={soumettreAvis} class="mt-8 space-y-6">
							<div class="grid gap-6 sm:grid-cols-2">
								<div class="space-y-3">
									<label class="field-label">Votre nom</label>
									<input
										type="text"
										required
										value={nouvelAvis.nom_client}
										onInput={(e) => setNouvelAvis({ ...nouvelAvis, nom_client: e.target.value })}
										class="field-input"
										placeholder="Prénom et nom"
									/>
								</div>

								<div class="space-y-3">
									<label class="field-label">Date du séjour</label>
									<input
										type="text"
										value={nouvelAvis.date_sejour}
										onInput={(e) => setNouvelAvis({ ...nouvelAvis, date_sejour: e.target.value })}
										class="field-input"
										placeholder="Mai 2026"
									/>
								</div>
							</div>

							<div class="space-y-3">
								<label class="field-label">Votre note</label>
								<div class="flex flex-wrap gap-2">
									{[5, 4, 3, 2, 1].map((value) => (
										<button
											key={value}
											type="button"
											onClick={() => setNouvelAvis({ ...nouvelAvis, note: value })}
											class={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-[10px] font-black uppercase tracking-[0.28em] transition-colors duration-300 ${
												Number(nouvelAvis.note) >= value
													? 'border-primary/30 bg-primary/10 text-primary'
													: 'border-primary/10 bg-white/70 text-outline hover:border-primary/30 hover:text-on-surface'
											}`}
										>
											<span class="material-symbols-outlined text-sm">grade</span>
											{value}/5
										</button>
									))}
								</div>
							</div>

							<div class="space-y-3">
								<label class="field-label">Votre message</label>
								<textarea
									required
									rows={5}
									value={nouvelAvis.commentaire}
									onInput={(e) => setNouvelAvis({ ...nouvelAvis, commentaire: e.target.value })}
									class="field-textarea"
									placeholder="Racontez-nous votre séjour..."
								></textarea>
							</div>

							<button
								type="submit"
								disabled={envoiEnCours}
								class="inline-flex w-full items-center justify-center rounded-full bg-on-surface px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
							>
								{envoiEnCours ? 'Envoi en cours...' : "Soumettre au livre d'or"}
							</button>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
}

function SectionHeading({ kicker, title, description, align = 'left', delay = 0 }) {
	return (
		<Reveal class={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`} delay={delay}>
			<span class="section-kicker">{kicker}</span>
			<h2 class="section-title mt-6">{title}</h2>
			{description && <p class="section-copy mt-6">{description}</p>}
		</Reveal>
	);
}

function SuiteCard({ suite, delay = 0 }) {
	return (
		<Reveal as="article" class="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-soft transition-transform duration-300 hover:-translate-y-1" delay={delay}>
			<div class="relative overflow-hidden">
				<img
					class="h-[22rem] w-full object-cover transition-transform duration-700 group-hover:scale-105"
					src={`https://lh3.googleusercontent.com/aida-public/${suite.image}`}
					alt={suite.name}
					loading="lazy"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-[#1c1b12]/55 via-transparent to-transparent"></div>
				<div class="absolute left-5 top-5 rounded-full bg-white/85 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface backdrop-blur">
					{suite.tag}
				</div>
			</div>

			<div class="p-6">
				<div class="text-[10px] font-black uppercase tracking-[0.3em] text-outline">{suite.detail}</div>
				<h3 class="mt-4 font-serif text-2xl italic text-on-surface">{suite.name}</h3>
				<p class="mt-3 text-sm leading-7 text-on-surface/70">{suite.description}</p>
			</div>
		</Reveal>
	);
}

function ArticleCard({ item, delay = 0 }) {
	const image = item.image_url || `https://picsum.photos/seed/${item.id}/900/700`;

	return (
		<Reveal as="article" class="surface-card overflow-hidden transition-transform duration-300 hover:-translate-y-1" delay={delay}>
			<div class="overflow-hidden">
				<img class="h-64 w-full object-cover transition-transform duration-700 hover:scale-105" src={image} alt={item.titre} loading="lazy" />
			</div>
			<div class="p-6">
				<div class="text-[10px] font-black uppercase tracking-[0.3em] text-outline">{item.date_publication}</div>
				<h3 class="mt-4 font-serif text-2xl italic text-on-surface">{item.titre}</h3>
				<p class="mt-4 line-clamp-3 text-sm leading-7 text-on-surface/70">{item.contenu}</p>
			</div>
		</Reveal>
	);
}

function MomentCard({ moment, delay = 0 }) {
	return (
		<Reveal as="article" class="surface-card-strong overflow-hidden transition-transform duration-300 hover:-translate-y-1" delay={delay}>
			<div class="overflow-hidden">
				<img class="h-72 w-full object-cover transition-transform duration-700 hover:scale-105" src={moment.image} alt={moment.title} loading="lazy" />
			</div>
			<div class="p-6">
				<div class="text-[10px] font-black uppercase tracking-[0.3em] text-outline">Instant</div>
				<h3 class="mt-4 font-serif text-2xl italic text-on-surface">{moment.title}</h3>
				<p class="mt-4 text-sm leading-7 text-on-surface/70">{moment.description}</p>
			</div>
		</Reveal>
	);
}

function EventCard({ event, delay = 0 }) {
	return (
		<Reveal as="article" class="surface-card p-6 transition-transform duration-300 hover:-translate-y-1" delay={delay}>
			<div class="inline-flex rounded-full bg-tertiary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-tertiary">
				{event.date_evenement}
			</div>
			<h3 class="mt-6 font-serif text-2xl italic text-on-surface">{event.titre}</h3>
			<p class="mt-4 text-sm leading-7 text-on-surface/70">{event.description}</p>
		</Reveal>
	);
}

function ReviewCard({ review, featured = false, delay = 0 }) {
	const note = Math.max(0, Math.min(5, Number.parseInt(review.note, 10) || 0));

	return (
		<Reveal as="article" class={`surface-card p-6 ${featured ? 'border-primary/20 bg-white shadow-lift' : ''}`} delay={delay}>
			<div class="flex items-center gap-1 text-primary">
				{Array.from({ length: 5 }, (_, index) => (
					<span key={index} class={`material-symbols-outlined text-lg ${index < note ? 'opacity-100' : 'opacity-25'}`}>
						grade
					</span>
				))}
			</div>
			<p class="mt-5 font-serif text-lg italic leading-8 text-on-surface/85">
				"{review.commentaire || 'Sans commentaire'}"
			</p>
			<div class="mt-6 flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary font-serif text-lg font-bold">
					{((review.nom_client || '?')[0] || '?').toUpperCase()}
				</div>
				<div>
					<div class="font-serif text-lg italic text-on-surface">{review.nom_client || 'Client anonyme'}</div>
					<div class="text-[10px] font-black uppercase tracking-[0.3em] text-outline">{review.date_sejour || 'Date inconnue'}</div>
				</div>
			</div>
		</Reveal>
	);
}
