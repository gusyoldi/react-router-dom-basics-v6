import { useState } from "react";
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Landing, Home, Dashboard, Analytics, Admin } from "./pages/components";

function Navigation() {
	return (
		<nav>
			<ul>
				<li>
					<Link to="/">Landing</Link>
				</li>
				<li>
					<Link to="/home">Home</Link>
				</li>
				<li>
					<Link to="/dashboard">Dashboard</Link>
				</li>
				<li>
					<Link to="/analytics">Analytics</Link>
				</li>
				<li>
					<Link to="/admin">Admin</Link>
				</li>
			</ul>
		</nav>
	);
}

function ProtectedRoute({ isAllowed, children, redirectTo = "/" }) {
	if (!isAllowed) {
		return <Navigate to={redirectTo} />;
	} else {
		return children ? children : <Outlet />;
	}
}

function App() {
	const [user, setUser] = useState(null);

	const login = () => {
		setUser({
			id: 1,
			name: "John",
			permissions: ["analyze"],
			roles: ['admin']
		});
	};

	const logout = () => {
		setUser(null);
	};

	return (
		<BrowserRouter>
			<Navigation />

			{user ? (
				<>
					<button onClick={logout}>Logout</button>
					<span> Usuario logueado</span>
				</>
			) : (
				<>
					<button onClick={login}>Login</button>
					<span> Usuario deslogueado</span>
				</>
			)}

			<Routes>
				<Route index element={<Landing />} />
				<Route element={<ProtectedRoute isAllowed={!!user} />}>
					<Route path="/home" element={<Home />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
					<Route path="/analytics" element={
				<ProtectedRoute 
					isAllowed={!!user && user.permissions.includes("analyze")} 
					redirectTo={'/home'}>

					<Analytics />
				</ProtectedRoute>
					} />
				<Route path="/admin" element={
					<ProtectedRoute 
					isAllowed={!!user && user.roles.includes("admin")} 
					redirectTo={'/home'}>

					<Admin />
				</ProtectedRoute>
				} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
