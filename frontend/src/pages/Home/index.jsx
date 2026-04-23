import './style.css';

export function Home() {
	return (
		<div class="home">
			{/* Hero Section */}
			<section class="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
				<div class="absolute inset-0 z-0">
					<img class="w-full h-full object-cover" alt="Patio d'hôtel de luxe" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWYkFc45A9M8apLV9JE5XM_BLybjOls-oZP9m2tmZso-MJB44IaCIiyqQvkpYb8tIBuEiBSdE7Q6X-VfghxIZgeD0ss8bQ5hydyPDF8vQ3aIP2Zg-Z3eTrHbcHKeAzKP4JH3D0dsvvado_Ps_Cn3VqLYWIs6K0TRtUyTi-QcnWQS69CyoH4aASp-jCVG_8Cw5hpBjlg0QkgKCEcBwlmek5QRgT7I5_GYCMJ4qe7XnOXhp5hhjBU4vUeSGlvZG64IdyT4YPQavXElU" />
					<div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background"></div>
				</div>
				<div class="relative z-10 text-center px-6 max-w-4xl">
					<span class="inline-block px-4 py-1 mb-6 rounded-full bg-primary-container/80 backdrop-blur-md text-on-primary-container font-label-sm uppercase tracking-[0.2em]">
						Retraite de Luxe Calme
					</span>
					<h1 class="font-display-xl text-5xl md:text-display-xl text-white mb-8 drop-shadow-lg leading-tight">
						L'Art de Vivre, au Rythme de la Nature
					</h1>
					<p class="font-body-lg text-lg md:text-body-lg text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
						Découvrez un sanctuaire de verre et de verdure. Une évasion moderne conçue pour ralentir votre rythme cardiaque et élever votre esprit.
					</p>
					<div class="flex flex-col md:flex-row gap-6 justify-center">
						<button class="bg-tertiary-fixed text-on-tertiary-fixed px-10 py-5 rounded-full font-label-sm uppercase tracking-widest hover:scale-105 transition-transform duration-500 shadow-xl">
							Découvrir nos Suites
						</button>
						<button class="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-5 rounded-full font-label-sm uppercase tracking-widest hover:bg-white/20 transition-all duration-500">
							Réserver un Séjour
						</button>
					</div>
				</div>
			</section>

			{/* Philosophie Section */}
			<section class="py-xl px-8 md:px-16 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
				<div class="space-y-8 order-2 md:order-1">
					<h2 class="font-headline-lg text-4xl md:text-headline-lg text-primary italic">L'Architecture du Silence</h2>
					<p class="font-body-lg text-on-surface-variant leading-relaxed">
						Chaque pierre, chaque baie vitrée et chaque jardin suspendu de Verdant Refuge a été pensé pour créer une symbiose parfaite entre le confort contemporain et la force brute des éléments naturels.
					</p>
					<div class="grid grid-cols-2 gap-8 border-t border-emerald-100 pt-8">
						<div>
							<span class="block text-3xl font-serif text-primary">12</span>
							<span class="text-sm font-label-sm uppercase text-outline tracking-wider">Suites Exclusives</span>
						</div>
						<div>
							<span class="block text-3xl font-serif text-primary">4ha</span>
							<span class="text-sm font-label-sm uppercase text-outline tracking-wider">De Jardins Privés</span>
						</div>
					</div>
				</div>
				<div class="relative order-1 md:order-2">
					<div class="organic-shape-2 overflow-hidden h-[350px] md:h-[500px] shadow-2xl">
						<img class="w-full h-full object-cover" alt="Intérieur moderne" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBUc_VMgb-h3oXpWG8ANG4DDlg7f5Fpyyv5wAhgTBUxOkfLRXUg9OmJ2O3drfbZrOV2TmnuPfqQuk1205yi4RGxF_D6I8oLkrorAvKSWLXxa5v9EbgODTFIVtKsKHTb-XWTB5GKZ1iJ0Z-Re04lz19kAlaVXXnNtBzUSha06BeG-nqsmINpDEBsT1yi6Yf6c5p5vRruFClMq8GTZLuUUURj7hEcYunbmgdxcJ8AbrWNBzSQPjKhWTyX0c_CkkvVLxuaFT3utgI7p8" />
					</div>
					{/* Responsive Glass Card - Refined spacing to prevent overflow */}
					<div class="md:absolute -bottom-10 -left-10 glass px-8 py-10 md:px-12 md:py-12 rounded-[2.5rem] mt-8 md:mt-0 w-full md:w-auto md:max-w-lg shadow-2xl z-20 transition-all hover:scale-105 duration-500 border-white/40">
						<p class="font-serif italic text-primary text-xl md:text-2xl leading-relaxed text-center md:text-left">
							"Un lieu où le temps semble s'arrêter pour laisser place à l'essentiel."
						</p>
					</div>
				</div>
			</section>

			{/* Nos Suites Section */}
			<section class="py-xl bg-surface-container-low overflow-hidden">
				<div class="max-w-[1440px] mx-auto px-8 md:px-16">
					<div class="flex justify-between items-end mb-12">
						<div>
							<h2 class="font-headline-lg text-4xl md:text-headline-lg text-primary leading-tight">Nos Suites de Verre</h2>
							<p class="font-body-md text-outline">Une immersion totale dans la canopée.</p>
						</div>
						<a href="/chambres" class="text-primary font-label-sm uppercase tracking-widest border-b border-primary pb-1 hidden md:block">Voir tout</a>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div class="group cursor-pointer">
							<div class="h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden mb-6 shadow-lg">
								<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Suite Emeraude" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBUc_VMgb-h3oXpWG8ANG4DDlg7f5Fpyyv5wAhgTBUxOkfLRXUg9OmJ2O3drfbZrOV2TmnuPfqQuk1205yi4RGxF_D6I8oLkrorAvKSWLXxa5v9EbgODTFIVtKsKHTb-XWTB5GKZ1iJ0Z-Re04lz19kAlaVXXnNtBzUSha06BeG-nqsmINpDEBsT1yi6Yf6c5p5vRruFClMq8GTZLuUUURj7hEcYunbmgdxcJ8AbrWNBzSQPjKhWTyX0c_CkkvVLxuaFT3utgI7p8" />
							</div>
							<h3 class="font-title-lg text-primary text-xl">Suite Emeraude</h3>
							<p class="text-sm font-label-sm text-outline uppercase mt-1 tracking-wider">Vue Canopée • 45m²</p>
						</div>
						<div class="group cursor-pointer">
							<div class="h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden mb-6 shadow-lg">
								<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Suite Horizon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJEy5mzEF09TPhPTrjZdxQ6JehpqRtDdAEj5NPRaE4ZCSQQCkcd4mlFW5FrGKcDYBYM6huSyykiOv-arV4bBb1Q07_prma2K4diG8HuPa9BiHNIL47MJsNewOG24XBYj3Z8iTbEeu_n-KlSyGV5QJ_GZSw3I01SBqzl4hJj67vUOpA83wUKdEoTY6b61i6mETS1-YjI5pPNKZzhsdUapGauefPozXk1ph5iDchvLFhE66I4387qjnan6c7fkH1X60ZTrDXEWjmWTc" />
							</div>
							<h3 class="font-title-lg text-primary text-xl">Suite Horizon</h3>
							<p class="text-sm font-label-sm text-outline uppercase mt-1 tracking-wider">Toit-Terrasse • 60m²</p>
						</div>
						<div class="group cursor-pointer">
							<div class="h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden mb-6 shadow-lg">
								<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Suite Céleste" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWYkFc45A9M8apLV9JE5XM_BLybjOls-oZP9m2tmZso-MJB44IaCIiyqQvkpYb8tIBuEiBSdE7Q6X-VfghxIZgeD0ss8bQ5hydyPDF8vQ3aIP2Zg-Z3eTrHbcHKeAzKP4JH3D0dsvvado_Ps_Cn3VqLYWIs6K0TRtUyTi-QcnWQS69CyoH4aASp-jCVG_8Cw5hpBjlg0QkgKCEcBwlmek5QRgT7I5_GYCMJ4qe7XnOXhp5hhjBU4vUeSGlvZG64IdyT4YPQavXElU" />
							</div>
							<h3 class="font-title-lg text-primary text-xl">Suite Céleste</h3>
							<p class="text-sm font-label-sm text-outline uppercase mt-1 tracking-wider">Bain Japonais • 50m²</p>
						</div>
					</div>
				</div>
			</section>

			{/* Art de Vivre (Bento) */}
			<section class="py-xl px-8 md:px-16 max-w-[1440px] mx-auto">
				<div class="mb-lg">
					<h2 class="font-headline-lg text-4xl md:text-headline-lg text-primary mb-4 italic leading-tight">Murmures du Refuge</h2>
					<p class="font-body-md text-outline">Actualités saisonnières de notre jardin et de notre cuisine.</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto">
					<div class="md:col-span-2 md:row-span-2 glass rounded-[2.5rem] overflow-hidden relative group cursor-pointer shadow-xl border-none h-[400px] md:h-auto">
						<img class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Ouverture Aile Forêt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBUc_VMgb-h3oXpWG8ANG4DDlg7f5Fpyyv5wAhgTBUxOkfLRXUg9OmJ2O3drfbZrOV2TmnuPfqQuk1205yi4RGxF_D6I8oLkrorAvKSWLXxa5v9EbgODTFIVtKsKHTb-XWTB5GKZ1iJ0Z-Re04lz19kAlaVXXnNtBzUSha06BeG-nqsmINpDEBsT1yi6Yf6c5p5vRruFClMq8GTZLuUUURj7hEcYunbmgdxcJ8AbrWNBzSQPjKhWTyX0c_CkkvVLxuaFT3utgI7p8" />
						<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
						<div class="absolute bottom-0 p-8 text-white">
							<span class="font-label-sm text-tertiary-fixed mb-2 block tracking-widest uppercase text-xs font-bold">Ouverture</span>
							<h3 class="font-headline-md text-2xl md:text-3xl mb-4">L'Aile de la Forêt est Ouverte</h3>
							<p class="font-body-md opacity-80 line-clamp-2">Six nouvelles suites de verre immergées au cœur de la chênaie millénaire.</p>
						</div>
					</div>
					<div class="md:col-span-2 glass rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl border-emerald-50 h-auto">
						<div>
							<span class="font-label-sm text-primary mb-2 block uppercase text-xs font-bold tracking-wider">Gastronomie</span>
							<h3 class="font-title-lg text-2xl text-on-surface mb-2">Du Potager à l'Assiette</h3>
							<p class="font-body-md text-on-surface-variant">Notre cuisine s'approvisionne désormais à 90% dans notre propre serre bio.</p>
						</div>
						<div class="mt-6 flex items-center gap-4">
							<img class="w-16 h-16 rounded-2xl object-cover shadow-md" alt="Gastronomie" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4y_V5-qdJ_W_0rdELm1tZE44hn86FiegK5a1Dh_BP2_Y3cB4IU1k4_SWtgwS_dtxTzDwheqDUO0OMPULEN5MDarhuUTkcFfckdswD16a4gci4gOqvPFzeMvfI_Wq2EAi9yqqaC8l2XeRp5-seXppJivX22GcN65cyQH8RHCzZQ9xFUODyVv1EtINYzs5nM0ysu8_36LJUZJ9UQtamstbngJ061Hb_qM6f59Vuh_de-8Kgm5H325HhonCPQaJGm3mvt7MCqtcu2k0" />
							<span class="text-primary font-label-sm cursor-pointer hover:underline uppercase text-xs font-bold tracking-widest">Découvrir l'histoire</span>
						</div>
					</div>
					<div class="glass rounded-[2.5rem] overflow-hidden relative group shadow-xl border-none h-[250px] md:h-auto">
						<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Spa" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJEy5mzEF09TPhPTrjZdxQ6JehpqRtDdAEj5NPRaE4ZCSQQCkcd4mlFW5FrGKcDYBYM6huSyykiOv-arV4bBb1Q07_prma2K4diG8HuPa9BiHNIL47MJsNewOG24XBYj3Z8iTbEeu_n-KlSyGV5QJ_GZSw3I01SBqzl4hJj67vUOpA83wUKdEoTY6b61i6mETS1-YjI5pPNKZzhsdUapGauefPozXk1ph5iDchvLFhE66I4387qjnan6c7fkH1X60ZTrDXEWjmWTc" />
						<div class="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors"></div>
						<div class="absolute inset-0 p-6 flex flex-col justify-end">
							<h4 class="text-white font-title-lg text-lg">Journée Spa Botanique</h4>
						</div>
					</div>
					<div class="bg-secondary-container rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-xl border-none">
						<span class="material-symbols-outlined text-4xl text-on-secondary-container mb-4">spa</span>
						<h4 class="font-title-lg text-on-secondary-container">Retraite Bien-être</h4>
						<p class="font-label-sm text-on-secondary-container/70 mt-2 tracking-widest uppercase text-xs">15-20 JUIN</p>
						<button class="mt-4 text-on-secondary-container font-label-sm underline underline-offset-4 tracking-widest uppercase text-xs">Nous rejoindre</button>
					</div>
				</div>
			</section>

			{/* Événements Section */}
			<section class="py-xl bg-surface-container-low border-y border-emerald-100/30">
				<div class="max-w-[1440px] mx-auto px-8 md:px-16">
					<div class="mb-lg text-center md:text-left">
						<h2 class="font-headline-lg text-4xl md:text-headline-lg text-primary mb-4 italic">Instants Présents</h2>
						<p class="font-body-md text-outline">Événements exclusifs pour nos hôtes privilégiés.</p>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div class="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-emerald-50 hover:-translate-y-2 flex flex-col">
							<div class="h-64 w-full overflow-hidden">
								<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Cuisine Sauvage" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2G6Ba3oKqPz72mXhsvjjtgqvyUbWU5y1q7KGNoceZDkbeZb3M-U-FkpB9XjymLNJtwhjxu_A6UbLu2PR1lBtjc9_xbbtC6vwI1E2w7iEq0PjiEOOI4e-fbmXUFWhU0aqzsMD1LmYi8vpz3ea1WHmO5B-1h0iM_F5d30McD_rdlmkx8PJi2mwnny2O7UpOuObnUpoLtYx48ym5fk7Ka-Q4nQWxlx-K8koQqaudgISiZleOwOA-w_Fh5mZcR3KACteWH1mSbiIBl7A" />
							</div>
							<div class="p-8 flex-grow flex flex-col">
								<span class="font-label-sm text-tertiary bg-tertiary-fixed/30 px-3 py-1 rounded-full inline-block mb-6 self-start text-xs font-bold uppercase tracking-widest">25 JUIN</span>
								<h3 class="font-headline-md text-2xl text-emerald-900 mb-4 group-hover:text-primary transition-colors italic">Atelier Cuisine Sauvage</h3>
								<p class="font-body-md text-on-surface-variant mb-8 leading-relaxed">Apprenez à cuisiner avec les herbes de notre jardin sous la direction de notre chef résident.</p>
								<div class="mt-auto flex items-center gap-2 text-primary font-label-sm uppercase tracking-wider group-hover:gap-4 transition-all text-xs font-bold">
									<span>Réserver sa place</span>
									<span class="material-symbols-outlined text-sm">arrow_forward</span>
								</div>
							</div>
						</div>
						<div class="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-emerald-50 hover:-translate-y-2 flex flex-col">
							<div class="h-64 w-full overflow-hidden">
								<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Yoga" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHqvu8uRU2f8Lp5ZjdyyK3-1GtBIxi6cpf8IMtcXlYsJIptBqW2q22juxlzjznqpqBvMF933Q_ckars2CQzD3DktX90LWyidcXpXPQeXXagY3Uv-O0WzmIfcRWOWX-eyS20fEvS6Txcg2avkuj6bbVsX7lrOkEA_hpIrW17q7l7PeLJHLxFVN6oZ2fUu8BPAhLb1GhIZ2PpHqxk2Z0TI00iI-EKFFBVL-aLfv2BfqkDqJmqEFW7b3iXz4H0Xncb65Jxa-GKhfBVg0" />
							</div>
							<div class="p-8 flex-grow flex flex-col">
								<span class="font-label-sm text-tertiary bg-tertiary-fixed/30 px-3 py-1 rounded-full inline-block mb-6 self-start text-xs font-bold uppercase tracking-widest">2-5 JUILLET</span>
								<h3 class="font-headline-md text-2xl text-emerald-900 mb-4 group-hover:text-primary transition-colors italic">Retraite Yoga & Sérénité</h3>
								<p class="font-body-md text-on-surface-variant mb-8 leading-relaxed">Un week-end de reconnexion profonde au cœur de la forêt, mêlant méditation et vinyasa.</p>
								<div class="mt-auto flex items-center gap-2 text-primary font-label-sm uppercase tracking-wider group-hover:gap-4 transition-all text-xs font-bold">
									<span>Voir le programme</span>
									<span class="material-symbols-outlined text-sm">arrow_forward</span>
								</div>
							</div>
						</div>
						<div class="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-emerald-50 hover:-translate-y-2 flex flex-col">
							<div class="h-64 w-full overflow-hidden">
								<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Diner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBavB7GK02ugR5SK01TxhPLzIgvONQqvNCyIMVNKo7EMF_RSZqaoNrJDUh08g1PPgTbq8DEx7wDxReKGdDKpQ1BiLrUmB4ZtsrJ87FurzjwJV-UNxjX-fB0D3UGEQYXHyHndS_MLGzQ5Z13XtOrWzBMrTUjxv2c5B8x3jv44Xj15E2EEUyWDgkk3CAmw9AEuLxDaOLj9RZdtBiGJ4Be4p2Q0pFNzAiaGbwZ44obQVlDmYogr2xqAwdENmYdVJDnYJw6IUJ1KMtuq4g" />
							</div>
							<div class="p-8 flex-grow flex flex-col">
								<span class="font-label-sm text-tertiary bg-tertiary-fixed/30 px-3 py-1 rounded-full inline-block mb-6 self-start text-xs font-bold uppercase tracking-widest">12 JUILLET</span>
								<h3 class="font-headline-md text-2xl text-emerald-900 mb-4 group-hover:text-primary transition-colors italic">Dîner sous les Étoiles</h3>
								<p class="font-body-md text-on-surface-variant mb-8 leading-relaxed">Une expérience gastronomique nocturne inoubliable servie dans notre clairière secrète.</p>
								<div class="mt-auto flex items-center gap-2 text-primary font-label-sm uppercase tracking-wider group-hover:gap-4 transition-all text-xs font-bold">
									<span>S'inscrire</span>
									<span class="material-symbols-outlined text-sm">arrow_forward</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section class="py-xl bg-surface-container-lowest">
				<div class="max-w-[1440px] mx-auto px-8 md:px-16">
					<div class="text-center mb-xl">
						<h2 class="font-headline-lg text-4xl md:text-headline-lg text-emerald-900 mb-6 italic font-normal leading-tight">Moments Choisis</h2>
						<p class="max-w-xl mx-auto font-body-md text-outline">Chaque recoin de Verdant Refuge est conçu pour être un tableau vivant de paix et de beauté organique.</p>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
						<div class="space-y-6">
							<div class="organic-shape-1 overflow-hidden h-[350px] md:h-96 w-full shadow-2xl shadow-emerald-900/10">
								<img class="w-full h-full object-cover" alt="Petit-déjeuner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2G6Ba3oKqPz72mXhsvjjtgqvyUbWU5y1q7KGNoceZDkbeZb3M-U-FkpB9XjymLNJtwhjxu_A6UbLu2PR1lBtjc9_xbbtC6vwI1E2w7iEq0PjiEOOI4e-fbmXUFWhU0aqzsMD1LmYi8vpz3ea1WHmO5B-1h0iM_F5d30McD_rdlmkx8PJi2mwnny2O7UpOuObnUpoLtYx48ym5fk7Ka-Q4nQWxlx-K8koQqaudgISiZleOwOA-w_Fh5mZcR3KACteWH1mSbiIBl7A" />
							</div>
							<div class="text-center px-4">
								<h3 class="font-title-lg text-title-lg text-primary text-xl tracking-tight">Petit-déjeuner Artisanal</h3>
								<p class="font-body-md text-on-surface-variant mt-2">Éveillez vos sens avec l'odeur du pain au levain frais et du miel sauvage de montagne.</p>
							</div>
						</div>
						<div class="space-y-6 md:translate-y-12">
							<div class="organic-shape-2 overflow-hidden h-[350px] md:h-96 w-full shadow-2xl shadow-emerald-900/10">
								<img class="w-full h-full object-cover" alt="Jardin" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBavB7GK02ugR5SK01TxhPLzIgvONQqvNCyIMVNKo7EMF_RSZqaoNrJDUh08g1PPgTbq8DEx7wDxReKGdDKpQ1BiLrUmB4ZtsrJ87FurzjwJV-UNxjX-fB0D3UGEQYXHyHndS_MLGzQ5Z13XtOrWzBMrTUjxv2c5B8x3jv44Xj15E2EEUyWDgkk3CAmw9AEuLxDaOLj9RZdtBiGJ4Be4p2Q0pFNzAiaGbwZ44obQVlDmYogr2xqAwdENmYdVJDnYJw6IUJ1KMtuq4g" />
							</div>
							<div class="text-center px-4">
								<h3 class="font-title-lg text-title-lg text-primary text-xl tracking-tight">Le Jardin Serein</h3>
								<p class="font-body-md text-on-surface-variant mt-2">Perdez-vous dans quatre hectares de sentiers botaniques méticuleusement entretenus.</p>
							</div>
						</div>
						<div class="space-y-6">
							<div class="organic-shape-1 overflow-hidden h-[350px] md:h-96 w-full shadow-2xl shadow-emerald-900/10">
								<img class="w-full h-full object-cover" alt="Nature" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHqvu8uRU2f8Lp5ZjdyyK3-1GtBIxi6cpf8IMtcXlYsJIptBqW2q22juxlzjznqpqBvMF933Q_ckars2CQzD3DktX90LWyidcXpXPQeXXagY3Uv-O0WzmIfcRWOWX-eyS20fEvS6Txcg2avkuj6bbVsX7lrOkEA_hpIrW17q7l7PeLJHLxFVN6oZ2fUu8BPAhLb1GhIZ2PpHqxk2Z0TI00iI-EKFFBVL-aLfv2BfqkDqJmqEFW7b3iXz4H0Xncb65Jxa-GKhfBVg0" />
							</div>
							<div class="text-center px-4">
								<h3 class="font-title-lg text-title-lg text-primary text-xl tracking-tight">Activités Nature</h3>
								<p class="font-body-md text-on-surface-variant mt-2">Bains de forêt, méditation guidée et séances d'observation des étoiles.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Avis Clients Section (Moved to End) */}
			<section class="py-xl px-8 md:px-16 max-w-[1440px] mx-auto overflow-hidden">
				<div class="text-center mb-16">
					<h2 class="font-headline-lg text-4xl md:text-headline-lg text-primary italic leading-tight">Instants Partagés</h2>
					<p class="font-body-md text-outline">Ce que nos hôtes racontent de leur expérience.</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div class="glass p-8 md:p-10 rounded-[2.5rem] shadow-xl border-emerald-50">
						<div class="flex text-amber-400 mb-6">
							<span class="material-symbols-outlined">star</span>
							<span class="material-symbols-outlined">star</span>
							<span class="material-symbols-outlined">star</span>
							<span class="material-symbols-outlined">star</span>
							<span class="material-symbols-outlined">star</span>
						</div>
						<p class="font-body-lg italic text-on-surface-variant mb-8">
							"Une déconnexion totale. Nous avons adoré le petit-déjeuner face aux pins et la sérénité du spa botanique. Un vrai bijou."
						</p>
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-serif text-primary shadow-inner">M</div>
							<div>
								<span class="block font-title-lg text-primary tracking-tight">Marie-Laure D.</span>
								<span class="text-xs font-label-sm text-outline uppercase tracking-widest">Séjour en Mai 2024</span>
							</div>
						</div>
					</div>
					<div class="glass p-8 md:p-10 rounded-[2.5rem] shadow-2xl border-emerald-50 md:scale-105 bg-white/90 z-10">
						<div class="flex text-amber-400 mb-6">
							<span class="material-symbols-outlined">star</span>
							<span class="material-symbols-outlined">star</span>
							<span class="material-symbols-outlined">star</span>
							<span class="material-symbols-outlined">star</span>
							<span class="material-symbols-outlined">star</span>
						</div>
						<p class="font-body-lg italic text-on-surface-variant mb-8">
							"L'architecture est époustouflante. On a l'impression de dormir dans les arbres tout en profitant d'un luxe absolu."
						</p>
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-serif text-primary shadow-inner">J</div>
							<div>
								<span class="block font-title-lg text-primary tracking-tight">Julien R.</span>
								<span class="text-xs font-label-sm text-outline uppercase tracking-widest">Séjour en Juillet 2024</span>
							</div>
						</div>
					</div>
					<div class="glass p-8 md:p-10 rounded-[2.5rem] shadow-xl border-emerald-50">
						<div class="flex text-amber-400 mb-6">
							<span class="material-symbols-outlined">star</span>
							<span class="material-symbols-outlined">star</span>
							<span class="material-symbols-outlined">star</span>
							<span class="material-symbols-outlined">star</span>
							<span class="material-symbols-outlined">star</span>
						</div>
						<p class="font-body-lg italic text-on-surface-variant mb-8">
							"Un accueil chaleureux et discret. Le jardin est un labyrinthe de paix. Nous reviendrons pour l'hiver prochain."
						</p>
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-serif text-primary shadow-inner">S</div>
							<div>
								<span class="block font-title-lg text-primary tracking-tight">Sophie & Marc</span>
								<span class="text-xs font-label-sm text-outline uppercase tracking-widest">Séjour en Juin 2024</span>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
