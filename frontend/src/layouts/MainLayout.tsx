import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

export default function MainLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          background: "#f8fafc",
        }}
      >
        <Header />

        <div
          style={{
            padding: "30px",
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}