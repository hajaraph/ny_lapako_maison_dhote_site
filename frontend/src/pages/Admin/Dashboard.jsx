import { useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';

export function AdminDashboard() {
    const { url, route } = useLocation();
    const currentTab = url.split('/')[2] || 'stats';

    const navigate = (tab) => route(`/admin/${tab}`);

    return (
        <div class="min-h-screen bg-[#F8FAF9] text-slate-900 font-body-md flex flex-col lg:flex-row">
            
            {/* --- SIDEBAR (Desktop uniquement) --- */}
            <aside class="hidden lg:flex fixed inset-y-6 left-6 w-72 bg-emerald-950 rounded-[3rem] shadow-2xl z-40 flex-col border border-white/5">
                <div class="p-8 flex items-center gap-4">
                    <div class="w-12 h-12 bg-primary-fixed-dim rounded-2xl flex items-center justify-center shadow-lg cursor-pointer" onClick={() => route('/')}>
                        <span class="material-symbols-outlined text-emerald-950 font-bold text-2xl">eco</span>
                    </div>
                    <div>
                        <h1 class="font-serif text-xl font-bold text-white tracking-tight">Verdant</h1>
                        <p class="text-[9px] text-emerald-400/60 uppercase tracking-[0.3em] font-bold">Admin Panel</p>
                    </div>
                </div>

                <nav class="flex-grow px-4 space-y-2 mt-8">
                    <SidebarLink active={currentTab === 'stats'} icon="dashboard" label="Tableau de bord" onClick={() => navigate('stats')} />
                    <div class="h-px bg-white/5 mx-6 my-6"></div>
                    <SidebarLink active={currentTab === 'news'} icon="auto_awesome" label="Actualités" onClick={() => navigate('news')} />
                    <SidebarLink active={currentTab === 'events'} icon="event" label="Événements" onClick={() => navigate('events')} />
                    <SidebarLink active={currentTab === 'reviews'} icon="forum" label="Avis Clients" onClick={() => navigate('reviews')} />
                    <div class="h-px bg-white/5 mx-6 my-6"></div>
                    <SidebarLink active={currentTab === 'profile'} icon="settings" label="Mon Profil" onClick={() => navigate('profile')} />
                </nav>

                <div class="p-6">
                    <button onClick={() => route('/')} class="w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] text-white/40 hover:text-white hover:bg-white/5 transition-all group">
                        <span class="material-symbols-outlined group-hover:rotate-12 transition-transform">logout</span>
                        <span class="font-bold text-[10px] uppercase tracking-widest">Quitter l'admin</span>
                    </button>
                </div>
            </aside>

            {/* --- BOTTOM NAV (Mobile uniquement) --- */}
            <nav class="lg:hidden fixed bottom-4 inset-x-4 h-20 bg-emerald-950 rounded-full shadow-2xl z-50 flex items-center justify-around px-6 border border-white/10 backdrop-blur-lg">
                <MobileNavLink active={currentTab === 'stats'} icon="grid_view" onClick={() => navigate('stats')} />
                <MobileNavLink active={currentTab === 'news'} icon="auto_awesome" onClick={() => navigate('news')} />
                <div class="w-12 h-12 bg-primary-fixed-dim rounded-full flex items-center justify-center -translate-y-6 shadow-xl border-4 border-[#F8FAF9]" onClick={() => route('/')}>
                    <span class="material-symbols-outlined text-emerald-950 font-bold">home</span>
                </div>
                <MobileNavLink active={currentTab === 'events'} icon="event" onClick={() => navigate('events')} />
                <MobileNavLink active={currentTab === 'profile'} icon="person" onClick={() => navigate('profile')} />
            </nav>

            {/* --- CONTENT AREA --- */}
            <main class="flex-grow lg:ml-88 p-4 md:p-10 pb-32 lg:pb-10 transition-all duration-500">
                <header class="flex justify-between items-center mb-8 lg:mb-12 px-2 md:px-6">
                    <div>
                        <h2 class="font-serif text-3xl md:text-4xl text-emerald-950 capitalize tracking-tight italic">
                            {currentTab === 'stats' ? 'Aperçu' : currentTab === 'profile' ? 'Compte' : currentTab}
                        </h2>
                    </div>
                    
                    <div class="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-slate-100 shadow-sm">
                        <div class="h-8 w-8 rounded-full overflow-hidden border-2 border-emerald-50">
                            <img src="https://ui-avatars.com/api/?name=Admin&background=006d36&color=fff" alt="User" />
                        </div>
                        <span class="text-[10px] font-black uppercase text-emerald-950 hidden sm:block tracking-widest">Admin</span>
                    </div>
                </header>

                <div class="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {currentTab === 'stats' && <StatsView />}
                    {(currentTab === 'news' || currentTab === 'events') && <ManagerView type={currentTab} />}
                    {currentTab === 'reviews' && <ReviewsManager />}
                    {currentTab === 'profile' && <ProfileManager />}
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} class={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-500 group ${active ? 'bg-primary-container text-emerald-950 shadow-xl' : 'text-emerald-100/30 hover:text-white hover:bg-white/5'}`}>
            <span class="material-symbols-outlined">{icon}</span>
            <span class="font-bold text-[11px] tracking-widest uppercase">{label}</span>
        </button>
    );
}

function MobileNavLink({ icon, active, onClick }) {
    return (
        <button onClick={onClick} class={`p-3 rounded-2xl transition-all ${active ? 'text-primary-fixed-dim' : 'text-white/30'}`}>
            <span class="material-symbols-outlined text-2xl">{icon}</span>
        </button>
    );
}

function StatsView() {
    return (
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div class="lg:col-span-2 space-y-6 md:space-y-8">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    <SmallStatCard label="Occupation" value="89%" icon="bed" color="text-emerald-600" />
                    <SmallStatCard label="Revenus" value="15.2k€" icon="payments" color="text-blue-600" />
                    <SmallStatCard label="Note" value="4.9/5" icon="grade" color="text-amber-500" />
                </div>
                <div class="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <h3 class="font-serif text-xl md:text-2xl text-emerald-950 mb-8 md:mb-12 italic">Fréquentation</h3>
                    <div class="h-48 md:h-64 flex items-end gap-2 md:gap-4">
                        {[40, 65, 30, 85, 55, 95, 75, 45, 90, 60].map(h => (
                            <div class="flex-grow group/bar relative">
                                <div class="w-full bg-slate-50 rounded-full h-48 md:h-64 overflow-hidden">
                                    <div style={{ height: `${h}%` }} class="absolute bottom-0 w-full bg-primary/10 group-hover/bar:bg-primary transition-all duration-700 ease-out rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div class="bg-emerald-950 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl">
                <div>
                    <h3 class="font-serif text-2xl md:text-3xl mb-8 italic">Agenda</h3>
                    <div class="space-y-8">
                        <AgendaItem time="14:00" label="Check-in Suite Horizon" name="Mr. Durand" />
                        <AgendaItem time="16:30" label="Soin Botanique" name="Massage" />
                    </div>
                </div>
                <button class="w-full mt-10 py-4 bg-primary-container text-emerald-950 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-white transition-all">Planning</button>
            </div>
        </div>
    );
}

function SmallStatCard({ label, value, icon, color }) {
    return (
        <div class="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-primary/20 transition-all">
            <div class={`w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span class={`material-symbols-outlined ${color}`}>{icon}</span>
            </div>
            <p class="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">{label}</p>
            <h4 class="text-2xl font-serif text-emerald-950">{value}</h4>
        </div>
    );
}

function AgendaItem({ time, label, name }) {
    return (
        <div class="flex gap-4 md:gap-6 relative">
            <div class="flex flex-col items-center shrink-0">
                <div class="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                <div class="w-0.5 h-12 bg-white/5 mt-2"></div>
            </div>
            <div class="pt-0">
                <span class="text-[10px] font-black text-emerald-400 tracking-widest">{time}</span>
                <p class="text-xs font-bold text-white/90">{label}</p>
                <p class="text-[9px] text-white/30 uppercase tracking-widest">{name}</p>
            </div>
        </div>
    );
}

function ManagerView({ type }) {
    return (
        <div class="space-y-8 md:space-y-10">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2 md:px-4">
                <div class="bg-white p-1 rounded-full border border-slate-100 flex gap-1 shadow-sm overflow-hidden">
                    <button class="px-4 md:px-6 py-2 bg-emerald-50 text-primary rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest">Tous</button>
                    <button class="px-4 md:px-6 py-2 text-slate-400 hover:text-emerald-950 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors">Publiés</button>
                </div>
                <button class="w-full sm:w-auto bg-emerald-950 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-all">
                    <span class="material-symbols-outlined text-lg">add</span>
                    Nouveau
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[1, 2, 3].map(i => (
                    <div class="bg-white rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-sm border border-slate-50">
                        <div class="h-48 md:h-64 relative overflow-hidden group">
                            <img src={`https://picsum.photos/seed/${type + i}/800/600`} class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Cover" />
                            <div class="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 md:p-8">
                                <button class="w-full py-4 bg-white text-emerald-950 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl">Éditer</button>
                            </div>
                        </div>
                        <div class="p-8 md:p-10">
                            <h4 class="font-serif text-xl md:text-2xl text-emerald-950 mb-3 italic leading-tight">Article {i}</h4>
                            <p class="text-slate-400 text-xs leading-relaxed line-clamp-2">Détails de gestion de contenu...</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReviewsManager() {
    return (
        <div class="max-w-4xl px-2">
            <div class="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-sm">
                <h3 class="font-serif text-2xl md:text-3xl text-emerald-950 italic mb-8 md:mb-12">Avis Clients</h3>
                <div class="space-y-10 md:space-y-12">
                    <ReviewRow name="S. Martin" status="En attente" comment="Accueil irréprochable et spa magnifique." />
                    <ReviewRow name="M. Dupont" status="Approuvé" comment="Cuisine créative et saveurs sauvages." />
                </div>
            </div>
        </div>
    );
}

function ReviewRow({ name, status, comment }) {
    return (
        <div class="flex gap-6 md:gap-10">
            <div class="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center shrink-0 border border-emerald-100 uppercase font-serif text-primary font-bold">
                {name[0]}
            </div>
            <div class="flex-grow space-y-3 md:space-y-4">
                <div class="flex items-center gap-3">
                    <span class="font-black text-emerald-950 text-xs md:text-sm tracking-tight uppercase">{name}</span>
                    <span class={`px-2 py-0.5 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest ${status === 'Approuvé' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{status}</span>
                </div>
                <p class="text-slate-500 text-sm md:text-base italic leading-relaxed">"{comment}"</p>
                <div class="flex gap-4 pt-2">
                    <button class="text-[9px] font-black text-primary uppercase tracking-widest hover:underline underline-offset-8">Approuver</button>
                    <button class="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500 transition-colors">Supprimer</button>
                </div>
            </div>
        </div>
    );
}

function ProfileManager() {
    return (
        <div class="max-w-4xl px-2">
            <div class="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-sm">
                <div class="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start">
                    <div class="relative shrink-0">
                        <div class="w-28 h-28 md:w-36 md:h-36 rounded-[2.2rem] md:rounded-[2.5rem] overflow-hidden border-4 md:border-8 border-emerald-50 shadow-2xl">
                            <img src="https://ui-avatars.com/api/?name=Admin&background=006d36&color=fff&size=200" class="w-full h-full object-cover" alt="Profile" />
                        </div>
                    </div>
                    <div class="flex-grow w-full space-y-8 md:space-y-12">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                            <ProfileInput label="Nom complet" value="Administrateur" />
                            <ProfileInput label="Email" value="admin@verdantrefuge.fr" />
                        </div>
                        <button class="w-full md:w-auto bg-emerald-950 text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Sauvegarder</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileInput({ label, value, type = 'text' }) {
    return (
        <div class="space-y-3 md:space-y-4">
            <label class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-4 md:ml-6">{label}</label>
            <input type={type} value={value} class="w-full bg-slate-50 border-none rounded-full py-4 md:py-5 px-6 md:px-8 text-sm text-emerald-950 font-bold outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all" />
        </div>
    );
}
