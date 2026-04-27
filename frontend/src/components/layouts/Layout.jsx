import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MiniNavbar from "./MiniNavbar";

const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <MiniNavbar />
                <main className="flex-1 p-4 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;