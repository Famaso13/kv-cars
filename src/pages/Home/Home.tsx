import "../../App.css";
import Header from "../../components/Header/Header";
import "./home.css";

const Home = () => {
    return (
        <>
            <Header loggedIn={true} />
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
