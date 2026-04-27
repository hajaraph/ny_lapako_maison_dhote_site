import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Home } from './pages/Home/index.jsx';
import { Login } from './pages/Auth/Login.jsx';
import { AdminDashboard } from './pages/Admin/Dashboard.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';

export function App() {
	return (
		<LocationProvider>
			<div class="flex min-h-screen flex-col bg-background text-on-surface">
				<Router>
					<Route path="/" component={() => (
						<>
							<Header />
							<main class="flex-grow">
								<Home />
							</main>
							<Footer />
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
