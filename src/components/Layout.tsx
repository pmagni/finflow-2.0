import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <Header />
        <main style={{ padding: '2rem', minHeight: 'calc(100vh - 10vh - 60px)' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}