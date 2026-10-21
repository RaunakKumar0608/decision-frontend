import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Decisions from "./pages/Decisions.jsx";
import Groups from "./pages/Groups.jsx";
import Layout from "./components/Layout.jsx";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/decisions" element={<Decisions />} />
            <Route path="/groups" element={<Groups />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  );
}