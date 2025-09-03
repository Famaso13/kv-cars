import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Profile from "./pages/Profile/Profile";
import TrackLeaderboard from "./pages/TrackLeaderboard/TrackLeaderboard";
import { useEffect, useState } from "react";
import Cars from "./pages/Cars/Cars";
import CarDetail from "./pages/CarDetail/CarDetail";

function App() {
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(() => !!sessionStorage.getItem("user"));
    useEffect(() => {
        setLoggedIn(!!sessionStorage.getItem("user"));
    }, [location]);
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/leaderboard" element={loggedIn ? <Leaderboard /> : <Login />} />
            <Route path="/cars" element={loggedIn ? <Cars /> : <Login />} />
            <Route path="/profile" element={loggedIn ? <Profile /> : <Login />} />
            <Route path="/leaderboard/track/:id" element={loggedIn ? <TrackLeaderboard /> : <Login />} />
            <Route path="/cars/:id" element={loggedIn ? <CarDetail /> : <Login />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
