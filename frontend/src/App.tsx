import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import Login from "./pages/Login";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/projects"
            element={isAuthenticated ? <ProjectList /> : <Navigate to="/login" />}
          />
          <Route
            path="/projects/:id"
            element={isAuthenticated ? <ProjectDetail /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/projects" : "/login"} />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
