import { useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';

export function Login() {
    const { route } = useLocation();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulation d'authentification
        setTimeout(() => {
            setLoading(false);
            route('/admin/stats');
        }, 1500);
    };

    return (
        <div class="min-h-screen bg-emerald-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div class="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop" class="w-full h-full object-cover opacity-30 blur-sm" alt="Nature" />
                <div class="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-emerald-950/50"></div>
            </div>

            <div class="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-700">
                <div class="text-center mb-10">
                    <div class="w-16 h-16 bg-primary-fixed-dim rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6">
                        <span class="material-symbols-outlined text-emerald-950 text-3xl font-bold">eco</span>
                    </div>
                    <h1 class="font-serif text-3xl text-white tracking-tight">Verdant Refuge</h1>
                    <p class="text-emerald-400/60 text-sm mt-2 font-medium uppercase tracking-[0.2em]">Espace Administrateur</p>
                </div>

                <div class="glass p-10 rounded-[2.5rem] border-white/10 shadow-2xl bg-white/5 backdrop-blur-2xl">
                    <form onSubmit={handleLogin} class="space-y-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80 ml-2">Identifiant</label>
                            <div class="relative">
                                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">alternate_email</span>
                                <input 
                                    type="email" 
                                    required
                                    placeholder="admin@verdantrefuge.fr" 
                                    class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/5 transition-all"
                                />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80 ml-2">Mot de passe</label>
                            <div class="relative">
                                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">lock</span>
                                <input 
                                    type="password" 
                                    required
                                    placeholder="••••••••" 
                                    class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/5 transition-all"
                                />
                            </div>
                        </div>

                        <div class="flex items-center justify-between px-2">
                            <label class="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" class="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-0 focus:ring-offset-0" />
                                <span class="text-xs text-white/40 group-hover:text-white/60 transition-colors">Se souvenir de moi</span>
                            </label>
                            <a href="#" class="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Oublié ?</a>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            class="w-full bg-primary-fixed-dim text-emerald-950 font-bold py-4 rounded-2xl shadow-xl shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <span class="w-5 h-5 border-2 border-emerald-950/30 border-t-emerald-950 rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <span>Se connecter</span>
                                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p class="text-center mt-8 text-white/20 text-[10px] font-bold uppercase tracking-widest">
                    Accès strictement réservé aux employés de Verdant Refuge
                </p>
            </div>
        </div>
    );
}
