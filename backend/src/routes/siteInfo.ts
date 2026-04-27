import { Hono } from 'hono';
import { db } from '../bdd';
import { siteSettings } from '../db/schema';
import { formaterSiteSettingsResponse } from '../lib/siteSettings';

const routeSiteInfo = new Hono();

routeSiteInfo.get('/', async (c) => {
	const siteInfo = await db.select().from(siteSettings).limit(1).get();

	return c.json(formaterSiteSettingsResponse(siteInfo ?? null));
});

export default routeSiteInfo;
