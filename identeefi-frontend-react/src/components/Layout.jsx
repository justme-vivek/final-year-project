import { Outlet, useLocation } from "react-router-dom"
import AppShell from "./shared/AppShell"
import { APP_PREFIXES } from "../utils/roles"

// Public routes render bare (they bring their own navbar/footer); app routes get the AppShell.
const Layout = () => {
    const { pathname } = useLocation();
    const isApp = APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
    if (isApp) return <AppShell />;
    return (
        <main className="App">
            <Outlet />
        </main>
    );
}

export default Layout
