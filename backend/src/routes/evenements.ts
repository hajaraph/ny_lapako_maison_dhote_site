import { Hono } from 'hono';
import { bdd } from '../bdd';

const routeEvenements = new Hono();

routeEvenements.get('/', (c) => {
    const data = bdd.query("SELECT * FROM evenements ORDER BY date_evenement ASC").all();
    return c.json(data);
});

routeEvenements.post('/', async (c) => {
    const corps = await c.req.json();
    bdd.run(
        "INSERT INTO evenements (titre, description, date_evenement, image_url, statut) VALUES (?, ?, ?, ?, ?)",
        [corps.titre, corps.description, corps.date_evenement, corps.image_url, corps.statut]
    );
    return c.json({ message: "Événement créé" }, 201);
});

export default routeEvenements;
