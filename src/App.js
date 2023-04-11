import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import AppPage from "./pages/AppPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import History from "./pages/Histoty";

function App() {
  return (
    <div>
      {/* <SignUp /> */}
      <BrowserRouter>
        <Routes>
          <Route element={<SignUp />} path="/signup" />
          <Route element={<SignIn />} path="/" />
          <Route element={<AppPage />} path="/home" />
          <Route element={<History />} path="/history" />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
