import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedinIn, faYoutube } from "@fortawesome/free-brands-svg-icons";
import './RedesSocials.css';

export const RedesSocials = () => {
    return (
        <div>
            <div className="social">
                <a href="#">
                    <FontAwesomeIcon icon={faGithub} className="icon" />
                </a>
                <a href="#">
                    <FontAwesomeIcon icon={faYoutube} className="icon" />
                </a>

                <a href="#">
                    <FontAwesomeIcon icon={faLinkedinIn} className="icon" />
                </a>
            </div>
        </div>
    );
};
