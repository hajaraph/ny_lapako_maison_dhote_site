export function Footer() {
	return (
		<footer class="bg-[#1c1b12] w-full py-20 px-8 md:px-16 border-t border-primary/20">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1440px] mx-auto">
				<div class="col-span-1 md:col-span-1">
					<div class="text-xl font-serif text-primary mb-6 italic font-bold">Verdant Refuge</div>
					<p class="font-serif text-sm text-primary/40 leading-relaxed mb-8">
						Un sanctuaire de sérénité dédié à l'architecture du silence et au luxe de la lumière dorée.
					</p>
					<div class="flex gap-4">
						<span class="material-symbols-outlined text-primary cursor-pointer hover:text-tertiary transition-colors">language</span>
						<span class="material-symbols-outlined text-primary cursor-pointer hover:text-tertiary transition-colors">camera</span>
						<span class="material-symbols-outlined text-primary cursor-pointer hover:text-tertiary transition-colors">alternate_email</span>
					</div>
				</div>
				<div>
					<h4 class="font-serif text-sm text-white font-bold mb-6 uppercase tracking-widest text-primary/60">Adresse</h4>
					<p class="font-serif text-sm text-primary/40 leading-loose">
						124 Avenue des Pins<br />
						64200 Biarritz<br />
						France
					</p>
				</div>
				<div>
					<h4 class="font-serif text-sm text-white font-bold mb-6 uppercase tracking-widest text-primary/60">Nous contacter</h4>
					<p class="font-serif text-sm text-primary/40 leading-loose">
						bonjour@verdantrefuge.fr<br />
						+33 (0) 5 59 00 00 00
					</p>
				</div>
				<div>
					<h4 class="font-serif text-sm text-white font-bold mb-6 uppercase tracking-widest text-primary/60">Lettre d'information</h4>
					<p class="font-serif text-sm text-primary/40 mb-4">Des nouvelles douces pour vies intenses.</p>
					<div class="flex border-b border-primary/20 py-2">
						<input class="bg-transparent border-none text-white focus:ring-0 w-full placeholder:text-primary/20 font-serif text-sm" placeholder="Votre email" type="email" />
						<button class="text-primary material-symbols-outlined hover:text-tertiary">arrow_forward</button>
					</div>
				</div>
			</div>
			<div class="max-w-[1440px] mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
				<div class="font-serif text-[10px] uppercase tracking-widest text-primary/20">
					© 2024 Verdant Refuge Luxury Guest House.
				</div>
				<div class="flex gap-8">
					<a class="font-serif text-[10px] uppercase tracking-widest text-primary/30 hover:text-primary transition-colors" href="#">Confidentialité</a>
					<a class="font-serif text-[10px] uppercase tracking-widest text-primary/30 hover:text-primary transition-colors" href="#">Conditions</a>
				</div>
			</div>
		</footer>
	);
}
