import { Reveal } from '../components/Reveal.jsx';

export function NotFound() {
	return (
		<section class="section-shell flex min-h-[70vh] items-center justify-center py-24 text-center">
			<Reveal variant="mask" class="surface-card-strong max-w-2xl p-10 sm:p-14" delay={120}>
				<div class="mx-auto inline-flex rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
					404
				</div>
				<h1 class="mt-6 font-serif text-5xl leading-[0.94] text-on-surface sm:text-6xl lg:text-display-xl">
					Page introuvable
				</h1>
				<p class="mt-6 text-base leading-8 text-on-surface/70 sm:text-lg">
					La page que vous cherchez a peut-être changé de place. Revenez à l'accueil pour reprendre le fil.
				</p>
				<div class="mt-8 flex flex-wrap justify-center gap-4">
					<a href="/" class="pill-button">
						Retour à l'accueil
					</a>
					<button
						type="button"
						onClick={() => {
							window.location.href = '/#contact';
						}}
						class="pill-button-ghost"
					>
						Nous contacter
					</button>
				</div>
			</Reveal>
		</section>
	);
}
