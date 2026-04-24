import { useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Reveal } from '../../components/Reveal.jsx';

export function Login() {
	const { route } = useLocation();
	const [loading, setLoading] = useState(false);

	const handleLogin = (e) => {
		e.preventDefault();
		setLoading(true);

		setTimeout(() => {
			setLoading(false);
			route('/admin/stats');
		}, 1200);
	};

	return (
		<div class="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(208,175,47,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(0,109,54,0.08),transparent_28%),linear-gradient(180deg,#f8f3e7_0%,#fdfaf1_100%)] text-on-surface">
			<div class="orb-drift absolute left-[-4rem] top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl"></div>
			<div class="orb-drift absolute right-[-4rem] bottom-16 h-80 w-80 rounded-full bg-tertiary/12 blur-3xl"></div>

			<div class="section-shell flex min-h-screen items-center py-12 lg:py-20">
				<div class="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
					<Reveal class="surface-card-strong flex flex-col justify-between p-8 lg:p-10" delay={120}>
						<div class="space-y-8">
							<div class="inline-flex rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.32em] text-primary">
								Espace administrateur
							</div>
							<div class="max-w-xl space-y-6">
								<h1 class="font-serif text-5xl leading-[0.94] text-on-surface sm:text-6xl lg:text-display-xl">
									Ny Lapako.
									<span class="block text-primary">Connexion sécurisée.</span>
								</h1>
								<p class="text-base leading-8 text-on-surface/70 sm:text-lg">
									Accédez au tableau de bord pour suivre les actualités, les événements, les avis et les réglages de la maison.
								</p>
							</div>
						</div>

						<div class="mt-10 grid gap-4 sm:grid-cols-3">
							<LoginStat label="Actualités" value="Pilotage" delay={80} />
							<LoginStat label="Avis" value="Modération" delay={140} />
							<LoginStat label="Profil" value="Paramètres" delay={200} />
						</div>
					</Reveal>

					<Reveal class="surface-card-strong p-8 lg:p-10" delay={220}>
						<h2 class="font-serif text-4xl italic text-on-surface">Se connecter</h2>
						<p class="mt-4 text-sm leading-7 text-on-surface/70">
							Utilisez vos identifiants administrateur pour ouvrir la session.
						</p>

						<form onSubmit={handleLogin} class="mt-8 space-y-6">
							<div class="space-y-3">
								<label class="field-label">Identifiant</label>
								<div class="relative">
									<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-base">
										alternate_email
									</span>
									<input
										type="email"
										required
										placeholder="admin@nylapako.fr"
										class="field-input pl-12"
									/>
								</div>
							</div>

							<div class="space-y-3">
								<label class="field-label">Mot de passe</label>
								<div class="relative">
									<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-base">
										lock
									</span>
									<input
										type="password"
										required
										placeholder="••••••••"
										class="field-input pl-12"
									/>
								</div>
							</div>

							<div class="flex items-center justify-between gap-4">
								<label class="flex items-center gap-2 text-sm text-outline">
									<input type="checkbox" class="h-4 w-4 rounded border-primary/20 text-primary focus:ring-0" />
									<span>Se souvenir de moi</span>
								</label>
								<a href="#" class="text-[10px] font-black uppercase tracking-[0.3em] text-primary transition-colors hover:text-tertiary">
									Mot de passe oublié ?
								</a>
							</div>

							<button
								type="submit"
								disabled={loading}
								class="inline-flex w-full items-center justify-center gap-3 rounded-full bg-on-surface px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
							>
								{loading ? (
									<span class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
								) : (
									<>
										<span>Se connecter</span>
										<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
									</>
								)}
							</button>
						</form>
					</Reveal>
				</div>
			</div>
		</div>
	);
}

function LoginStat({ label, value, delay = 0 }) {
	return (
		<Reveal class="rounded-[1.5rem] border border-primary/10 bg-white/80 p-5 shadow-soft" delay={delay}>
			<div class="text-[10px] font-black uppercase tracking-[0.32em] text-outline">{label}</div>
			<div class="mt-3 font-serif text-2xl italic text-on-surface">{value}</div>
		</Reveal>
	);
}
