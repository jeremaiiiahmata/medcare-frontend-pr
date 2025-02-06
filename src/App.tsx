import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" />
              <Route path="/create-patient" />
              <Route path="/create-prescription" />
              <Route path="/create-preassessment" />
              <Route path="/edit-profile" />
            </Route>
            <Route path="/login" />
            <Route path="/register" />
            <Route path="/" />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
