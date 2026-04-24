import { useState, useEffect } from 'preact/hooks';
import { api } from '../../api';
import './style.css';

export function Home() {
    const [actualites, setActualites] = useState([]);
    const [evenements, setEvenements] = useState([]);
    const [avis, setAvis] = useState([]);
    const [nouvelAvis, setNouvelAvis] = useState({ nom_client: '', commentaire: '', note: 5, date_sejour: '' });
    const [envoiEnCours, setEnvoiEnCours] = useState(false);

    useEffect(() => {
        api.actualites.lister()
            .then(data => setActualites(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("Erreur actualités:", err);
                setActualites([]);
            });

        api.evenements.lister()
            .then(data => setEvenements(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("Erreur événements:", err);
                setEvenements([]);
            });

        api.avis.lister()
            .then(data => {
                if (Array.isArray(data)) {
                    setAvis(data.filter(a => a && (a.statut === 'approuve' || a.statut === 'Approuvé')));
                } else {
                    setAvis([]);
                }
            })
            .catch(err => {
                console.error("Erreur avis:", err);
                setAvis([]);
            });
    }, []);

    const soumettreAvis = async (e) => {
        e.preventDefault();
        setEnvoiEnCours(true);
        try {
            await api.avis.soumettre(nouvelAvis);
            alert("Merci ! Votre avis est en attente de modération.");
            setNouvelAvis({ nom_client: '', commentaire: '', note: 5, date_sejour: '' });
        } catch (err) {
            alert("Erreur lors de l'envoi.");
        } finally {
            setEnvoiEnCours(false);
        }
    };

	return (
		<div class="home bg-background">
			{/* 1. HERO SECTION */}
			<section id="esprit" class="scroll-mt-24 relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
				<div class="absolute inset-0 z-0">
					<img class="w-full h-full object-cover" alt="Patio" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWYkFc45A9M8apLV9JE5XM_BLybjOls-oZP9m2tmZso-MJB44IaCIiyqQvkpYb8tIBuEiBSdE7Q6X-VfghxIZgeD0ss8bQ5hydyPDF8vQ3aIP2Zg-Z3eTrHbcHKeAzKP4JH3D0dsvvado_Ps_Cn3VqLYWIs6K0TRtUyTi-QcnWQS69CyoH4aASp-jCVG_8Cw5hpBjlg0QkgKCEcBwlmek5QRgT7I5_GYCMJ4qe7XnOXhp5hhjBU4vUeSGlvZG64IdyT4YPQavXElU" />
					<div class="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-background"></div>
				</div>
				<div class="relative z-10 text-center px-6 max-w-4xl">
					<span class="inline-block px-6 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-lg text-white font-sans text-[10px] uppercase tracking-[0.4em]">
						L'Expérience de l'Or Végétal
					</span>
					<h1 class="font-serif text-6xl md:text-8xl text-white mb-10 leading-[1.1] font-light">
						La Lumière <br/> <span class="italic font-normal">au Coeur</span> du Jardin
					</h1>
					<p class="font-sans text-white/80 mb-14 max-w-xl mx-auto leading-relaxed tracking-wide font-light">
						Un sanctuaire ocre baigné de soleil. Redécouvrez le luxe du silence et la poésie de la nature.
					</p>
					<div class="flex flex-col md:flex-row gap-6 justify-center items-center">
						<button class="group relative px-12 py-5 overflow-hidden rounded-full bg-white transition-all duration-500">
							<span class="relative z-10 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#231b00]">Découvrir les Suites</span>
						</button>
						<button class="px-12 py-5 rounded-full border border-white/30 text-white font-sans text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 transition-all duration-500">
							Le Jardin
						</button>
					</div>
				</div>
			</section>

			{/* 2. PHILOSOPHIE SECTION */}
			<section id="jardin" class="scroll-mt-24 py-xl px-8 md:px-16 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
				<div class="space-y-8 order-2 md:order-1">
					<h2 class="font-headline-lg text-4xl md:text-headline-lg text-primary italic leading-tight">Le Charme Solaire du Jardin</h2>
					<p class="font-body-lg text-on-surface/80 leading-relaxed">
						La terrasse ocre de notre maison d'hôte s'ouvre comme une scène suspendue entre un ciel d'azur intense et un jardin luxuriant. Bordé par une balustrade vert émeraude, cet espace devient un refuge où le temps s'arrête, bercé par le doux parfum des fougères suspendues et l'authenticité de la table en bois brut. Un véritable havre pour vos petits-déjeuners face à la nature.
					</p>
				</div>
				<div class="relative order-1 md:order-2 group">
					<div class="organic-shape-2 overflow-hidden h-[350px] md:h-[500px] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
						<img class="w-full h-full object-cover" alt="Intérieur" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBUc_VMgb-h3oXpWG8ANG4DDlg7f5Fpyyv5wAhgTBUxOkfLRXUg9OmJ2O3drfbZrOV2TmnuPfqQuk1205yi4RGxF_D6I8oLkrorAvKSWLXxa5v9EbgODTFIVtKsKHTb-XWTB5GKZ1iJ0Z-Re04lz19kAlaVXXnNtBzUSha06BeG-nqsmINpDEBsT1yi6Yf6c5p5vRruFClMq8GTZLuUUURj7hEcYunbmgdxcJ8AbrWNBzSQPjKhWTyX0c_CkkvVLxuaFT3utgI7p8" />
					</div>
				</div>
			</section>

			{/* 3. NOS SUITES SECTION */}
			<section id="chambres" class="scroll-mt-24 py-xl bg-surface-container-low overflow-hidden">
				<div class="max-w-[1440px] mx-auto px-8 md:px-16">
					<div class="flex justify-between items-end mb-16">
						<div>
							<h2 class="font-headline-lg text-4xl md:text-headline-lg text-primary italic leading-tight">VOTRE CHAMBRE</h2>
							<p class="font-body-md text-outline uppercase tracking-widest text-xs mt-2">Le luxe de l'espace et de la clarté.</p>
						</div>
						<a href="/chambres" class="text-tertiary font-label-sm uppercase tracking-widest border-b-2 border-primary pb-1 hidden md:block font-bold">Tout voir</a>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-10">
						{[
							{ name: "Suite Solaire", img: "AB6AXuCBUc_VMgb-h3oXpWG8ANG4DDlg7f5Fpyyv5wAhgTBUxOkfLRXUg9OmJ2O3drfbZrOV2TmnuPfqQuk1205yi4RGxF_D6I8oLkrorAvKSWLXxa5v9EbgODTFIVtKsKHTb-XWTB5GKZ1iJ0Z-Re04lz19kAlaVXXnNtBzUSha06BeG-nqsmINpDEBsT1yi6Yf6c5p5vRruFClMq8GTZLuUUURj7hEcYunbmgdxcJ8AbrWNBzSQPjKhWTyX0c_CkkvVLxuaFT3utgI7p8", detail: "Baignée de lumière • 45m²" },
							{ name: "Suite Canopée", img: "AB6AXuBJEy5mzEF09TPhPTrjZdxQ6JehpqRtDdAEj5NPRaE4ZCSQQCkcd4mlFW5FrGKcDYBYM6huSyykiOv-arV4bBb1Q07_prma2K4diG8HuPa9BiHNIL47MJsNewOG24XBYj3Z8iTbEeu_n-KlSyGV5QJ_GZSw3I01SBqzl4hJj67vUOpA83wUKdEoTY6b61i6mETS1-YjI5pPNKZzhsdUapGauefPozXk1ph5iDchvLFhE66I4387qjnan6c7fkH1X60ZTrDXEWjmWTc", detail: "Face aux pins • 60m²" },
							{ name: "Suite Éclat", img: "AB6AXuCWYkFc45A9M8apLV9JE5XM_BLybjOls-oZP9m2tmZso-MJB44IaCIiyqQvkpYb8tIBuEiBSdE7Q6X-VfghxIZgeD0ss8bQ5hydyPDF8vQ3aIP2Zg-Z3eTrHbcHKeAzKP4JH3D0dsvvado_Ps_Cn3VqLYWIs6K0TRtUyTi-QcnWQS69CyoH4aASp-jCVG_8Cw5hpBjlg0QkgKCEcBwlmek5QRgT7I5_GYCMJ4qe7XnOXhp5hhjBU4vUeSGlvZG64IdyT4YPQavXElU", detail: "Design Or • 50m²" }
						].map(suite => (
							<div class="group cursor-pointer">
								<div class="h-[350px] md:h-[450px] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl relative">
									<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src={`https://lh3.googleusercontent.com/aida-public/${suite.img}`} />
									<div class="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-700"></div>
								</div>
								<h3 class="font-title-lg text-primary text-2xl italic tracking-tight">{suite.name}</h3>
								<p class="text-[10px] font-black font-label-sm text-tertiary uppercase mt-2 tracking-[0.2em]">{suite.detail}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 4. ACTUALITÉS DYNAMIQUES */}
            {actualites.length > 0 && (
                <section class="py-xl px-8 md:px-16 max-w-[1440px] mx-auto">
                    <h2 class="font-headline-lg text-4xl text-primary italic mb-12">Murmures du Refuge</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {actualites.slice(0, 3).map(actu => (
                            <div class="glass rounded-[3rem] overflow-hidden shadow-xl border-primary/5 group">
                                <div class="h-64 overflow-hidden">
                                    <img src={actu.image_url || `https://picsum.photos/seed/${actu.id}/800/600`} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                </div>
                                <div class="p-10">
                                    <span class="text-[9px] font-black text-tertiary uppercase tracking-widest">{actu.date_publication}</span>
                                    <h3 class="font-serif text-2xl text-primary italic mt-4">{actu.titre}</h3>
                                    <p class="text-sm text-on-surface/70 mt-4 line-clamp-3">{actu.contenu}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

			{/* 5. SERVICES / MOMENTS SECTION */}
			<section class="py-xl bg-surface-container-lowest">
				<div class="max-w-[1440px] mx-auto px-8 md:px-16">
					<div class="text-center mb-20">
						<h2 class="font-headline-lg text-4xl text-primary mb-6 italic font-normal leading-tight">Moments Choisis</h2>
						<p class="max-w-xl mx-auto font-body-md text-outline">L'or du détail au service de votre sérénité.</p>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
						<div class="space-y-6">
							<div class="organic-shape-1 overflow-hidden h-96 w-full shadow-2xl border border-primary/10">
								<img class="w-full h-full object-cover" alt="Petit-déjeuner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2G6Ba3oKqPz72mXhsvjjtgqvyUbWU5y1q7KGNoceZDkbeZb3M-U-FkpB9XjymLNJtwhjxu_A6UbLu2PR1lBtjc9_xbbtC6vwI1E2w7iEq0PjiEOOI4e-fbmXUFWhU0aqzsMD1LmYi8vpz3ea1WHmO5B-1h0iM_F5d30McD_rdlmkx8PJi2mwnny2O7UpOuObnUpoLtYx48ym5fk7Ka-Q4nQWxlx-K8koQqaudgISiZleOwOA-w_Fh5mZcR3KACteWH1mSbiIBl7A" />
							</div>
							<div class="text-center">
								<h3 class="font-title-lg text-primary text-xl font-bold italic">Réveil Artisanal</h3>
								<p class="text-sm text-on-surface/60 mt-2">Pain au levain et miel sauvage du domaine.</p>
							</div>
						</div>
						<div class="space-y-6 md:translate-y-12">
							<div class="organic-shape-2 overflow-hidden h-96 w-full shadow-2xl border border-primary/10">
								<img class="w-full h-full object-cover" alt="Jardin" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBavB7GK02ugR5SK01TxhPLzIgvONQqvNCyIMVNKo7EMF_RSZqaoNrJDUh08g1PPgTbq8DEx7wDxReKGdDKpQ1BiLrUmB4ZtsrJ87FurzjwJV-UNxjX-fB0D3UGEQYXHyHndS_MLGzQ5Z13XtOrWzBMrTUjxv2c5B8x3jv44Xj15E2EEUyWDgkk3CAmw9AEuLxDaOLj9RZdtBiGJ4Be4p2Q0pFNzAiaGbwZ44obQVlDmYogr2xqAwdENmYdVJDnYJw6IUJ1KMtuq4g" />
							</div>
							<div class="text-center">
								<h3 class="font-title-lg text-primary text-xl font-bold italic">Le Jardin Serein</h3>
								<p class="text-sm text-on-surface/60 mt-2">4 hectares de poésie botanique.</p>
							</div>
						</div>
						<div class="space-y-6">
							<div class="organic-shape-1 overflow-hidden h-96 w-full shadow-2xl border border-primary/10">
								<img class="w-full h-full object-cover" alt="Randonnée" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHqvu8uRU2f8Lp5ZjdyyK3-1GtBIxi6cpf8IMtcXlYsJIptBqW2q22juxlzjznqpqBvMF933Q_ckars2CQzD3DktX90LWyidcXpXPQeXXagY3Uv-O0WzmIfcRWOWX-eyS20fEvS6Txcg2avkuj6bbVsX7lrOkEA_hpIrW17q7l7PeLJHLxFVN6oZ2fUu8BPAhLb1GhIZ2PpHqxk2Z0TI00iI-EKFFBVL-aLfv2BfqkDqJmqEFW7b3iXz4H0Xncb65Jxa-GKhfBVg0" />
							</div>
							<div class="text-center">
								<h3 class="font-title-lg text-primary text-xl font-bold italic">Bains de Forêt</h3>
								<p class="text-sm text-on-surface/60 mt-2">Méditation guidée sous les pins centenaires.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 6. ÉVÉNEMENTS DYNAMIQUES */}
            {evenements.length > 0 && (
                <section class="py-xl bg-surface-container-low border-y border-primary/10">
                    <div class="max-w-[1440px] mx-auto px-8 md:px-16 text-center">
                        <h2 class="font-headline-lg text-4xl text-primary italic mb-16">Instants Présents</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                            {evenements.map(ev => (
                                <div class="bg-white rounded-[3rem] p-10 shadow-xl border border-primary/5 hover:border-tertiary transition-colors">
                                    <span class="text-[9px] font-black text-tertiary bg-tertiary/10 px-4 py-2 rounded-full inline-block uppercase tracking-widest">{ev.date_evenement}</span>
                                    <h3 class="font-serif text-2xl text-primary italic mt-6">{ev.titre}</h3>
                                    <p class="text-sm text-on-surface/60 mt-4 leading-relaxed">{ev.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

			{/* 7. LIVRE D'OR DYNAMIQUE + FORMULAIRE */}
			<section id="avis" class="scroll-mt-24 py-xl px-8 md:px-16 max-w-[1440px] mx-auto overflow-hidden">
				<div class="text-center mb-20">
					<h2 class="font-headline-lg text-4xl text-primary italic leading-tight">Instants Partagés</h2>
					<p class="font-body-md text-tertiary uppercase tracking-widest text-[10px] font-black mt-2">Leur séjour au Refuge.</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-10">
					{avis.map((a, i) => (
						<div class={`glass p-12 rounded-[3.5rem] shadow-2xl border-primary/10 relative ${i === 1 ? 'md:scale-105 bg-white/90 z-10' : ''}`}>
							<div class="flex text-primary mb-8 gap-1">
								{[...Array(Math.max(0, parseInt(a.note) || 0))].map((_, idx) => (
									<span key={idx} class="material-symbols-outlined text-xl">grade</span>
								))}
							</div>
							<p class="font-serif italic text-on-surface/80 text-lg leading-relaxed mb-10">"{a.commentaire || 'Sans commentaire'}"</p>
							<div class="flex items-center gap-5">
								<div class="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center font-serif text-xl font-bold">
									{(a.nom_client || "?")[0].toUpperCase()}
								</div>
								<div>
									<span class="block font-serif text-primary text-lg italic">{a.nom_client || "Client Anonyme"}</span>
									<span class="text-[9px] font-black text-outline uppercase tracking-widest">{a.date_sejour || "Date inconnue"}</span>
								</div>
							</div>
						</div>
					))}
				</div>

                {/* Formulaire Avis Client */}
                <div class="mt-32 max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-[5rem] border border-primary/10 shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    <h3 class="font-serif text-4xl text-primary italic text-center mb-12">Laissez une trace de votre passage</h3>
                    <form onSubmit={soumettreAvis} class="space-y-10 relative z-10">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div class="space-y-3">
                                <label class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-8">Votre Nom</label>
                                <input type="text" required value={nouvelAvis.nom_client} onInput={e => setNouvelAvis({...nouvelAvis, nom_client: e.target.value})} class="w-full bg-[#f4f1e6]/30 border-2 border-transparent rounded-full py-6 px-10 text-primary font-black outline-none focus:border-primary transition-all shadow-inner" />
                            </div>
                            <div class="space-y-3">
                                <label class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-8">Date du séjour</label>
                                <input type="text" placeholder="ex: Mai 2024" value={nouvelAvis.date_sejour} onInput={e => setNouvelAvis({...nouvelAvis, date_sejour: e.target.value})} class="w-full bg-[#f4f1e6]/30 border-2 border-transparent rounded-full py-6 px-10 text-primary font-black outline-none focus:border-primary transition-all shadow-inner" />
                            </div>
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-8">Votre message</label>
                            <textarea required rows={4} value={nouvelAvis.commentaire} onInput={e => setNouvelAvis({...nouvelAvis, commentaire: e.target.value})} class="w-full bg-[#f4f1e6]/30 border-2 border-transparent rounded-[3rem] py-8 px-10 text-primary font-black outline-none focus:border-primary transition-all shadow-inner"></textarea>
                        </div>
                        <button type="submit" disabled={envoiEnCours} class="w-full bg-[#231b00] text-primary font-black py-6 rounded-full uppercase tracking-[0.3em] text-xs hover:bg-primary hover:text-[#231b00] transition-all shadow-2xl">
                            {envoiEnCours ? "Envoi en cours..." : "Soumettre au livre d'or"}
                        </button>
                    </form>
                </div>
			</section>
		</div>
	);
}
