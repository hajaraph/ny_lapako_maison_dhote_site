import { Hono } from 'hono';
import { bdd } from '../bdd';

const routeAvis = new Hono();

routeAvis.get('/', (c) => {
    const data = bdd.query("SELECT * FROM avis_clients ORDER BY id DESC").all();
    return c.json(data);
});

routeAvis.post('/', async (c) => {
    const corps = await c.req.json();
    bdd.run(
        "INSERT INTO avis_clients (nom_client, commentaire, note, date_sejour) VALUES (?, ?, ?, ?)",
        [corps.nom_client, corps.commentaire, corps.note, corps.date_sejour]
    );
    return c.json({ message: "Avis soumis avec succès" }, 201);
});

routeAvis.patch('/:id/statut', async (c) => {
    const id = c.req.param('id');
    const { statut } = await c.req.json();
    bdd.run("UPDATE avis_clients SET statut = ? WHERE id = ?", [statut, id]);
    return c.json({ message: "Statut mis à jour" });
});

export default routeAvis;
