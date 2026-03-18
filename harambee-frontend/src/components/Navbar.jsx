import { useState } from "react";
import "./Navbar.css";

export default function Navbar({ page, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => navigate("home")}>
          <img src="/images/donation.jpg" alt="Harambee" style={{height: '70px', width: 'auto'}} />
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <button
            className={`nav-link ${page === "explore" ? "active" : ""}`}
            onClick={() => { navigate("explore"); setMenuOpen(false); }}
          >
            Explore
          </button>
          <button
            className={`nav-link ${page === "dashboard" ? "active" : ""}`}
            onClick={() => { navigate("dashboard"); setMenuOpen(false); }}
          >
            Sign In
          </button>
          <a className="nav-link" href="#">How it Works</a>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { navigate("create"); setMenuOpen(false); }}
          >
            Start a Fundraiser
          </button>
        </div>

        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
