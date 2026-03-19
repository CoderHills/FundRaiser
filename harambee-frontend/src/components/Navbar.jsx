import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import "./Navbar.css";

export default function Navbar({ page, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isNewUser } = useAuth();

  const handleCreateClick = () => {
    if (!user) {
      navigate("dashboard");
    } else {
      navigate("create");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => navigate("home")}>
          <img src="/images/donation.jpg" alt="Harambee" style={{height: '70px', width: 'auto'}} />
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {user && (
            <button
              className={`nav-link ${page === "explore" ? "active" : ""}`}
              onClick={() => { navigate("explore"); setMenuOpen(false); }}
            >
              Explore
            </button>
          )}

            {user ? (
              <div className="nav-user">
                <button 
                  className="nav-user-info" 
                  onClick={() => { navigate("profile"); setMenuOpen(false); }}
                  style={{ cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}
                >
                  <span className="nav-greeting">{isNewUser ? 'Welcome,' : 'Welcome back,'}</span>
                  <span className="nav-user-name">{user.name}</span>
                </button>
                <button className="nav-logout" onClick={logout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <button
                className={`nav-link ${page === "dashboard" ? "active" : ""}`}
                onClick={() => { navigate("dashboard"); setMenuOpen(false); }}
              >
                Sign In
              </button>
            )}
          <a className="nav-link" href="#">How it Works</a>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { handleCreateClick(); setMenuOpen(false); }}
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
