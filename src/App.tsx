import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import PatientDirectory from "./pages/PatientDirectory";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route Component={Dashboard} path="/dashboard" />
              <Route Component={PatientDirectory} path="/patient-directory" />
              <Route path="/create-patient" />
              <Route path="/create-prescription" />
              <Route path="/create-preassessment" />
              <Route path="/edit-profile" />
            </Route>
            <Route Component={LoginPage} path="/login" />
            <Route Component={RegisterPage} path="/register" />
            <Route Component={LandingPage} path="/" />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
