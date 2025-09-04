import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import GridPage from "./pages/GridPage/GridPage";
import Profile from "./pages/Profile/Profile";
import TrackLeaderboard from "./pages/TrackLeaderboard/TrackLeaderboard";
import { useEffect, useState } from "react";
import CarDetail from "./pages/CarDetail/CarDetail";
import TrackDetail from "./pages/TrackDetail/TrackDetail";

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
            <Route path="/tracks" element={loggedIn ? <GridPage type="tracks" /> : <Login />} />
            <Route path="/tracks/:id" element={loggedIn ? <TrackDetail /> : <Login />} />
            <Route path="/cars" element={loggedIn ? <GridPage type="cars" /> : <Login />} />
            <Route path="/cars/:id" element={loggedIn ? <CarDetail /> : <Login />} />
            <Route path="/leaderboard" element={loggedIn ? <GridPage type="leaderboard" /> : <Login />} />
            <Route path="/leaderboard/track/:id" element={loggedIn ? <TrackLeaderboard /> : <Login />} />
            <Route path="/profile" element={loggedIn ? <Profile /> : <Login />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
