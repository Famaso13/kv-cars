import "../../App.css";
import Header from "../../components/Header/Header";
import "./home.css";
import "../../components/Header/header.css";
import { useEffect, useState } from "react";

const Home = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        if (sessionStorage.getItem("user") !== null) setLoggedIn(true);
    }, []);
    return (
        <>
            <Header loggedIn={loggedIn} />
            <div className="full-screen">
                <div id="background" className="left">
                    <div style={{ width: "92%" }}></div>
                    <div className="column"></div>
                </div>
                <div className="right">
                    <h1>Test your abilities</h1>
                    <p>Get on the track and set the best time</p>
                </div>
            </div>
        </>
    );
};

export default Home;
