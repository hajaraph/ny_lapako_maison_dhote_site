export function NotFound() {
	return (
		<section class="py-xl px-16 max-w-[1440px] mx-auto text-center min-h-[60vh] flex flex-col justify-center items-center">
			<h1 class="font-display-xl text-display-xl text-primary mb-8">404: Not Found</h1>
			<p class="font-body-lg text-body-lg text-on-surface-variant mb-12">
				It seems you've wandered into an uncharted corner of our sanctuary.
			</p>
			<a href="/" class="bg-tertiary-fixed text-on-tertiary-fixed px-10 py-5 rounded-full font-label-sm uppercase tracking-widest hover:scale-105 transition-transform duration-500">
				Return Home
			</a>
		</section>
	);
}
