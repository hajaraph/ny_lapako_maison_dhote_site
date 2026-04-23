import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { api } from '../../api';

export function AdminDashboard() {
    const { url, route } = useLocation();
    const currentTab = url.split('/')[2] || 'stats';
    const [donnees, setDonnees] = useState([]);
    const [profil, setProfil] = useState(null);
    const [chargement, setChargement] = useState(true);

    const navigate = (tab) => route(`/admin/${tab}`);

    useEffect(() => {
        setChargement(true);
        if (currentTab === 'stats') {
            // On peut agréger des stats ici plus tard
            setChargement(false);
        } else if (currentTab === 'news') {
            api.actualites.lister().then(setDonnees).finally(() => setChargement(false));
        } else if (currentTab === 'events') {
            api.evenements.lister().then(setDonnees).finally(() => setChargement(false));
        } else if (currentTab === 'reviews') {
            api.avis.lister().then(setDonnees).finally(() => setChargement(false));
        } else if (currentTab === 'profile') {
            api.admin.getProfil().then(setProfil).finally(() => setChargement(false));
        }
    }, [currentTab]);

    const supprimerElement = async (id) => {
        if (!confirm("Supprimer cet élément ?")) return;
        try {
            if (currentTab === 'news') await api.actualites.supprimer(id);
            setDonnees(donnees.filter(d => d.id !== id));
        } catch (e) { alert("Erreur suppression"); }
    };

    const modererAvis = async (id, statut) => {
        try {
            await api.avis.moderer(id, statut);
            setDonnees(donnees.map(a => a.id === id ? { ...a, statut } : a));
        } catch (e) { alert("Erreur modération"); }
    };

    return (
        <div class="min-h-screen bg-[#FDFBF7] text-slate-900 font-body-md flex flex-col lg:flex-row">
            {/* Sidebar Or Profond */}
            <aside class="hidden lg:flex fixed inset-y-6 left-6 w-72 bg-[#d0af2f] rounded-[3rem] shadow-2xl z-40 flex-col border border-white/20">
                <div class="p-8 flex items-center gap-4">
                    <div class="w-12 h-12 bg-[#231b00] rounded-2xl flex items-center justify-center shadow-lg cursor-pointer" onClick={() => route('/')}>
                        <span class="material-symbols-outlined text-[#ffe179] font-bold text-2xl">eco</span>
                    </div>
                    <div>
                        <h1 class="font-serif text-xl font-black text-[#231b00]">Verdant</h1>
                        <p class="text-[9px] text-[#231b00]/60 uppercase tracking-[0.3em] font-black">Management</p>
                    </div>
                </div>
                <nav class="flex-grow px-4 space-y-2 mt-8">
                    <SidebarLink active={currentTab === 'stats'} icon="dashboard" label="Vue globale" onClick={() => navigate('stats')} />
                    <SidebarLink active={currentTab === 'news'} icon="auto_awesome" label="Actualités" onClick={() => navigate('news')} />
                    <SidebarLink active={currentTab === 'events'} icon="event" label="Événements" onClick={() => navigate('events')} />
                    <SidebarLink active={currentTab === 'reviews'} icon="forum" label="Avis Clients" onClick={() => navigate('reviews')} />
                    <SidebarLink active={currentTab === 'profile'} icon="settings" label="Mon Compte" onClick={() => navigate('profile')} />
                </nav>
                <div class="p-6">
                    <button onClick={() => route('/')} class="w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] bg-[#231b00]/10 text-[#231b00] hover:bg-[#231b00] hover:text-white transition-all">
                        <span class="material-symbols-outlined">logout</span>
                        <span class="font-black text-[10px] uppercase tracking-widest">Quitter</span>
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main class="flex-grow lg:ml-88 p-4 md:p-10 pb-32 lg:pb-10 transition-all duration-500">
                <header class="flex justify-between items-center mb-12 px-6">
                    <h2 class="font-serif text-3xl md:text-5xl text-primary capitalize italic">
                        {currentTab === 'stats' ? 'Tableau de bord' : currentTab === 'profile' ? 'Paramètres' : currentTab}
                    </h2>
                    {profil && (
                        <div class="flex items-center gap-3 bg-white p-2 pr-6 rounded-full border border-[#f4f1e6] shadow-sm">
                            <img src={`https://ui-avatars.com/api/?name=${profil.nom}&background=d0af2f&color=231b00`} class="h-10 w-10 rounded-full" />
                            <span class="text-xs font-black text-[#231b00] uppercase">{profil.nom}</span>
                        </div>
                    )}
                </header>

                <div class="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    {chargement ? (
                        <div class="flex justify-center py-20"><span class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span></div>
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

            {/* Mobile Nav */}
            <nav class="lg:hidden fixed bottom-4 inset-x-4 h-20 bg-[#d0af2f] rounded-full shadow-2xl z-50 flex items-center justify-around px-6 border border-white/20">
                <MobileNavLink active={currentTab === 'stats'} icon="grid_view" onClick={() => navigate('stats')} />
                <MobileNavLink active={currentTab === 'news'} icon="auto_awesome" onClick={() => navigate('news')} />
                <div class="w-14 h-14 bg-[#231b00] rounded-full flex items-center justify-center -translate-y-6 shadow-2xl border-4 border-[#FDFBF7]" onClick={() => route('/')}>
                    <span class="material-symbols-outlined text-[#ffe179] font-bold">home</span>
                </div>
                <MobileNavLink active={currentTab === 'events'} icon="event" onClick={() => navigate('events')} />
                <MobileNavLink active={currentTab === 'profile'} icon="person" onClick={() => navigate('profile')} />
            </nav>
        </div>
    );
}

function SidebarLink({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} class={`w-full flex items-center gap-5 px-6 py-4 rounded-[1.5rem] transition-all duration-500 ${active ? 'bg-[#231b00] text-[#ffe179]' : 'text-[#231b00]/50 hover:bg-white/10'}`}>
            <span class="material-symbols-outlined">{icon}</span>
            <span class="font-black text-[10px] hidden lg:block tracking-[0.2em] uppercase">{label}</span>
        </button>
    );
}

function MobileNavLink({ icon, active, onClick }) {
    return (
        <button onClick={onClick} class={`p-3 rounded-2xl ${active ? 'text-[#231b00]' : 'text-[#231b00]/30'}`}>
            <span class="material-symbols-outlined text-2xl font-bold">{icon}</span>
        </button>
    );
}

function StatsOverview() {
    return (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Occupation" value="89%" icon="bed" />
            <StatCard label="Avis à modérer" value="5" icon="forum" />
            <StatCard label="Événements" value="3" icon="event" />
        </div>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div class="bg-white p-8 rounded-[3rem] border border-[#f4f1e6] shadow-sm">
            <span class="material-symbols-outlined text-primary text-3xl mb-4">{icon}</span>
            <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
            <h4 class="text-4xl font-serif text-primary mt-2">{value}</h4>
        </div>
    );
}

function NewsManager({ data, onSupprimer }) {
    return (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            {data.map(actu => (
                <div class="bg-white rounded-[4rem] overflow-hidden border border-[#f4f1e6] group relative">
                    <img src={actu.image_url || 'https://picsum.photos/seed/1/800/600'} class="h-64 w-full object-cover" />
                    <div class="p-10">
                        <h4 class="font-serif text-2xl text-primary italic">{actu.titre}</h4>
                        <p class="text-slate-400 text-sm mt-4 line-clamp-2">{actu.contenu}</p>
                        <button onClick={() => onSupprimer(actu.id)} class="mt-6 text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline">Supprimer</button>
                    </div>
                </div>
            ))}
            <button class="bg-[#231b00] rounded-[4rem] border-2 border-dashed border-primary/20 flex flex-col items-center justify-center p-10 text-primary hover:border-primary transition-all">
                <span class="material-symbols-outlined text-4xl mb-4">add</span>
                <span class="font-black text-[10px] uppercase">Nouvelle Actualité</span>
            </button>
        </div>
    );
}

function EventsManager({ data }) {
    return (
        <div class="space-y-6">
            {data.map(ev => (
                <div class="bg-white p-8 rounded-[3rem] border border-[#f4f1e6] flex justify-between items-center">
                    <div>
                        <span class="text-primary font-black text-[10px] uppercase tracking-widest">{ev.date_evenement}</span>
                        <h4 class="font-serif text-2xl text-[#231b00] italic">{ev.titre}</h4>
                    </div>
                    <span class="px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">{ev.statut}</span>
                </div>
            ))}
        </div>
    );
}

function ReviewsManager({ data, onModerer }) {
    return (
        <div class="bg-white p-12 rounded-[5rem] border border-[#f4f1e6]">
            <h3 class="font-serif text-4xl text-primary italic mb-12">Livre d'Or</h3>
            <div class="space-y-12">
                {data.map(a => (
                    <div class="flex gap-10 group">
                        <div class="w-16 h-16 bg-[#f4f1e6] rounded-full flex items-center justify-center font-serif text-primary font-black text-2xl">{a.nom_client[0]}</div>
                        <div class="flex-grow space-y-4">
                            <div class="flex items-center gap-6">
                                <span class="font-black text-[#231b00] text-sm uppercase">{a.nom_client}</span>
                                <span class={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${a.statut === 'approuve' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{a.statut}</span>
                            </div>
                            <p class="text-slate-500 text-lg italic leading-relaxed italic">"{a.commentaire}"</p>
                            <div class="flex gap-8 pt-4">
                                {a.statut === 'en_attente' && <button onClick={() => onModerer(a.id, 'approuve')} class="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Approuver</button>}
                                <button class="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500">Supprimer</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProfileManager({ profil, setProfil }) {
    const enregistrer = async () => {
        try {
            await api.admin.updateProfil(profil);
            alert("Profil sauvegardé !");
        } catch (e) { alert("Erreur sauvegarde"); }
    };

    return (
        <div class="max-w-5xl bg-white p-12 md:p-20 rounded-[5rem] border border-[#f4f1e6]">
            <div class="flex flex-col md:flex-row gap-16 items-start">
                <img src={`https://ui-avatars.com/api/?name=${profil.nom}&background=d0af2f&color=231b00&size=300`} class="w-44 h-44 rounded-[3.5rem] shadow-2xl" />
                <div class="flex-grow w-full space-y-12">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div class="space-y-4">
                            <label class="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 ml-8">Nom</label>
                            <input value={profil.nom} onInput={e => setProfil({...profil, nom: e.target.value})} class="w-full bg-[#f4f1e6]/30 border-2 border-transparent rounded-full py-6 px-10 text-primary font-black outline-none focus:border-primary" />
                        </div>
                        <div class="space-y-4">
                            <label class="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 ml-8">Email</label>
                            <input value={profil.email} onInput={e => setProfil({...profil, email: e.target.value})} class="w-full bg-[#f4f1e6]/30 border-2 border-transparent rounded-full py-6 px-10 text-primary font-black outline-none focus:border-primary" />
                        </div>
                    </div>
                    <button onClick={enregistrer} class="bg-[#231b00] text-[#ffe179] px-16 py-6 rounded-full font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-primary hover:text-[#231b00] transition-all">Sauvegarder</button>
                </div>
            </div>
        </div>
    );
}
