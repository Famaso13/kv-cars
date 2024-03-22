import { colors } from "../../../colors";
import Header from "../../components/header/Header";
import "./Home.css";

const Home = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <div className="content">
        <div className="picture">
          <div
            className="column"
            style={{ backgroundColor: colors.home_column }}
          ></div>
        </div>
        <div className="message" style={{ backgroundColor: colors.main }}>
          <h1
            className="message_text"
            style={{
              fontSize: "3rem",
              fontWeight: "bolder",
            }}
          >
            Test your abilities
          </h1>
          <h3 className="message_text">
            Get on the track and set the best time
          </h3>
        </div>
      </div>
      <div className="blank"></div>
    </div>
  );
};

export default Home;
