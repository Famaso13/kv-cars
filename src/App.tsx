import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Sign_up from "./pages/sign_up/Sign_up";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Sign_up />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
