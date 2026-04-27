import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';
import { useEffect, useState } from 'preact/hooks';

import { api } from './api';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Home } from './pages/Home/index.jsx';
import { Login } from './pages/Auth/Login.jsx';
import { AdminDashboard } from './pages/Admin/Dashboard.jsx';
import { NotFound } from './pages/_404.jsx';
import { DEFAULT_SITE_INFO, normalizeSiteInfo } from './lib/siteSettings.js';
import './style.css';

export function App() {
	const [siteInfo, setSiteInfo] = useState(DEFAULT_SITE_INFO);

	useEffect(() => {
		let alive = true;

		api.siteInfo
			.lire()
			.then((data) => {
				if (alive) {
					setSiteInfo(normalizeSiteInfo(data));
				}
			})
			.catch((error) => {
				console.error('Erreur chargement informations du site:', error);
			});

		return () => {
			alive = false;
		};
	}, []);

	return (
		<LocationProvider>
			<div class="flex min-h-screen flex-col bg-background text-on-surface">
				<Router>
					<Route path="/" component={() => (
						<>
							<Header />
							<main class="flex-grow">
								<Home siteInfo={siteInfo} />
							</main>
							<Footer siteInfo={siteInfo} />
						</>
					)} />
					<Route path="/login" component={Login} />
					<Route path="/admin" component={AdminDashboard} />
					<Route path="/admin/:tab" component={AdminDashboard} />
					<Route default component={NotFound} />
				</Router>
			</div>
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
