import { Hono } from 'hono';
import { bdd } from '../bdd';

const routeActualites = new Hono();

routeActualites.get('/', (c) => {
    const data = bdd.query("SELECT * FROM actualites ORDER BY id DESC").all();
    return c.json(data);
});

routeActualites.post('/', async (c) => {
    const corps = await c.req.json();
    bdd.run(
        "INSERT INTO actualites (titre, contenu, image_url, date_publication, statut) VALUES (?, ?, ?, ?, ?)",
        [corps.titre, corps.contenu, corps.image_url, corps.date_publication, corps.statut]
    );
    return c.json({ message: "Actualité créée" }, 201);
});

routeActualites.delete('/:id', (c) => {
    const id = c.req.param('id');
    bdd.run("DELETE FROM actualites WHERE id = ?", [id]);
    return c.json({ message: "Actualité supprimée" });
});

export default routeActualites;
