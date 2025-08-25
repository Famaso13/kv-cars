import "../../App.css";
import Header from "../../components/Header/Header";
import "./home.css";

const Home = () => {
    return (
        <>
            <Header loggedIn={true} />
            <div className="full-screen">
                <div className="half">
                    <img className="full-screen" src="/home.png" alt="carsOnTrack" />
                </div>
                <div className="half"></div>
            </div>
        </>
    );
};

export default Home;
