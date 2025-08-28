import { Link } from "react-router-dom";
import "./notFound.css";

const NotFound = () => {
    return (
        <div className="full-screen notfound">
            <div className="half left">
                <h1 className="error-code">404</h1>
            </div>
            <div className="half right">
                <p className="error-message">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
                <Link to="/" className="back-home">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
