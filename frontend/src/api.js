const BASE_URL = 'http://localhost:3000';

async function requete(endpoint, methode = 'GET', donnees = null) {
    const options = {
        method: methode,
        headers: { 'Content-Type': 'application/json' },
    };
    if (donnees) options.body = JSON.stringify(donnees);

    const reponse = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!reponse.ok) throw new Error(`Erreur API: ${reponse.status}`);
    return await reponse.json();
}

export const api = {
    actualites: {
        lister: () => requete('/actualites'),
        creer: (data) => requete('/actualites', 'POST', data),
        supprimer: (id) => requete(`/actualites/${id}`, 'DELETE'),
    },
    evenements: {
        lister: () => requete('/evenements'),
        creer: (data) => requete('/evenements', 'POST', data),
    },
    avis: {
        lister: () => requete('/avis'),
        soumettre: (data) => requete('/avis', 'POST', data),
        moderer: (id, statut) => requete(`/avis/${id}/statut`, 'PATCH', { statut }),
    },
    admin: {
        getProfil: () => requete('/admin/profil'),
        updateProfil: (data) => requete('/admin/profil', 'PATCH', data),
    }
};
