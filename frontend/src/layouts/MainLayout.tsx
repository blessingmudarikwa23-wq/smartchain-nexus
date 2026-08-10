import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

export default function MainLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: "#f8fafc",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          background: "#f8fafc",
        }}
      >
        <Header />

        <div
          style={{
            width: "100%",
            padding: "28px 32px 40px 32px",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}