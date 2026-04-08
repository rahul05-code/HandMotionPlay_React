import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";

/**
 * AdminLayout encapsulates the specific global structure for administrative routes,
 * rendering the unique AdminNavbar over the main outlet.
 */
const AdminLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
