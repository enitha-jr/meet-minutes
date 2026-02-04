import "../../styles/Hero.css";
import { FaArrowDown } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import heroImg from "../../assets/icons/hero1.jpg";

import Login from "../../components/Login";
import SignUp from "../../components/SignUp";

function Hero() {

  const location = useLocation();

  const scrollDown = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  return (
    <div className="hero-section">

      <div className="hero-row">

        {/* LEFT TEXT */}
        <div className="hero-text">
          <img src={heroImg} alt="hero" />
          <h1>MeetMinutes</h1>
          <p>Manage meetings. Capture minutes. Track progress.</p>
        </div>


        {/* RIGHT  FORM */}
        <div className="hero-login-wrapper">
          {location.pathname === "/signup" ? <SignUp /> : <Login />}
        </div>


      </div>

      <div className="scroll-arrow" onClick={scrollDown}>
        <FaArrowDown />
      </div>

    </div>
  );
}

export default Hero;
