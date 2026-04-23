import { Hono } from 'hono';
import { bdd } from '../bdd';

const routeAdmin = new Hono();

// Récupérer le profil admin unique
routeAdmin.get('/profil', (c) => {
    const profil = bdd.query("SELECT id, nom, email FROM administrateurs LIMIT 1").get();
    return c.json(profil);
});

// Mettre à jour le profil admin
routeAdmin.patch('/profil', async (c) => {
    const corps = await c.req.json();
    const { nom, email, mot_de_passe } = corps;

    if (mot_de_passe && mot_de_passe.trim() !== "") {
        bdd.run(
            "UPDATE administrateurs SET nom = ?, email = ?, mot_de_passe = ? WHERE id = 1",
            [nom, email, mot_de_passe]
        );
    } else {
        bdd.run(
            "UPDATE administrateurs SET nom = ?, email = ? WHERE id = 1",
            [nom, email]
        );
    }
    
    return c.json({ message: "Profil admin mis à jour avec succès" });
});

export default routeAdmin;
