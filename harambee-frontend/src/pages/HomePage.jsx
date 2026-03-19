import { useState, useEffect } from "react";
import { getCampaigns } from "../utils/api";
import { getCategoryColor } from "../utils/helpers";
import { useAuth } from "../contexts/AuthContext.jsx";
import "./HomePage.css";

export default function HomePage({ navigate, onDonate }) {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    if (user) {
      getCampaigns({ featured: "true", per_page: 1 })
        .then(data => setFeatured(data.campaigns || []))
        .catch(() => {});
    }
  }, [user]);

  if (user) {
    return (
      <main className="home">
        <section className="hero">
          <div className="hero-bg">
            <div className="hero-blob blob1" />
            <div className="hero-blob blob2" />
            <div className="hero-blob blob3" />
          </div>
          <div className="container hero-inner">
            <div className="hero-text animate-fadeup" style={{ textAlign: 'center', maxWidth: '700px' }}>
              <h1 className="hero-title">
                Unite Your Community.<br />
                <em>Fund Dreams Instantly.</em>
              </h1>
              <p className="hero-sub">
                Easy setup. M-Pesa, Airtel, Card. Free to start. Cash out anytime.
              </p>
              <div className="hero-actions" style={{ justifyContent: 'center' }}>
                <button className="btn btn-primary btn-lg" onClick={() => navigate("create")}>
                  Start a Fundraiser — It's Free
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => navigate("explore")}>
                  Explore Campaigns
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <main className="home">
        <section className="hero">
          <div className="hero-bg">
            <div className="hero-blob blob1" />
            <div className="hero-blob blob2" />
            <div className="hero-blob blob3" />
          </div>
          <div className="container hero-inner">
            <div className="hero-text animate-fadeup">
              <div className="hero-eyebrow">
              <span className="tag tag-sun">Africa's Fundraising Platform</span>
              </div>
              <h1 className="hero-title">
                Unite Your Community.<br />
                <em>Fund Dreams Instantly.</em>
              </h1>
              <p className="hero-sub">
                Easy setup. M-Pesa, Airtel, Card. Free to start. Cash out anytime.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary btn-lg" onClick={() => navigate("dashboard")}>
                  Sign In to Get Started
                </button>
                <button className="btn btn-sun btn-lg" onClick={() => navigate("dashboard", { register: true })}>
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section hiw-section">
          <div className="container">
            <div className="hiw-label">Simple as 1-2-3</div>
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              How Harambee works
            </h2>
            <p className="section-sub" style={{ textAlign: "center", marginBottom: "3rem" }}>
              Get your fundraiser live in under 5 minutes.
            </p>
            <div className="hiw-grid">
              {[
                {
                  title: "Create your fundraiser",
                  desc: "Fill in your cause details, set a target, add photos and your story. It takes less than 5 minutes.",
                },
                {
                  title: "Share with your people",
                  desc: "Share to WhatsApp, Facebook, X or via SMS with a single tap. Reach your friends, family and diaspora.",
                },
                {
                  title: "Receive & withdraw",
                  desc: "Donors pay via M-Pesa, Airtel, card, or PayPal. Withdraw to your M-Pesa anytime you need.",
                },
              ].map((s, i) => (
                <div key={i} className="hiw-step">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ussd-banner">
          <div className="container ussd-inner">
            <div className="ussd-text">
              <h2>No smartphone? No problem.</h2>
              <p>Create and manage your fundraiser via USSD — works on any phone. Kenya only.</p>
            </div>
            <div className="ussd-code">
              <div className="ussd-dial">Dial</div>
              <div className="ussd-number">*483*57#</div>
              <div className="ussd-dial">on any network</div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-inner">
            <h2>Your cause deserves to be heard.</h2>
            <p>Join thousands of fundraisers who have raised millions for causes that matter.</p>
            <button className="btn btn-white btn-lg" onClick={() => navigate("dashboard", { register: true })}>
              Start your free fundraiser
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
