import { CAMPAIGNS, TESTIMONIALS, CATEGORIES } from "../data/campaigns";
import CampaignCard from "../components/CampaignCard";
import "./HomePage.css";

export default function HomePage({ navigate, onDonate }) {
  const featured = CAMPAIGNS.filter((c) => c.featured);
  const trending = CAMPAIGNS.slice(0, 3);

  return (
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
            <span className="tag tag-green">Africa's Fundraising Platform</span>
            </div>
            <h1 className="hero-title">
              Unite Your Community.<br />
              <em>Fund Dreams Instantly.</em>
            </h1>
            <p className="hero-sub">
              Easy setup. M-Pesa, Airtel, Card. Free to start. Cash out anytime.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate("create")}>
                Start a Fundraiser — It's Free
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate("explore")}>
                Explore Campaigns
              </button>
            </div>
            <p className="hero-note">No setup fee · 4.25% platform fee · Withdraw anytime</p>
          </div>
          <div className="hero-card-stack">
            <div className="hcs-card hcs-back" />
            <div className="hcs-card hcs-mid" />
            <div className="hcs-card hcs-front">
              <div className="hcs-image">
                <img src={CAMPAIGNS[0].image} alt="" />
              </div>
              <div className="hcs-content">
                <span className="tag tag-green" style={{ fontSize: "0.7rem" }}>Medical</span>
                <p className="hcs-title">{CAMPAIGNS[0].title}</p>
                <div className="progress-bar" style={{ margin: "0.75rem 0 0.4rem" }}>
                  <div className="progress-fill" style={{ width: "73%" }} />
                </div>
                <div className="hcs-stats">
                  <span className="hcs-raised">KES 623K raised</span>
                  <span>73%</span>
                </div>
              <div className="hcs-donors">412 donors</div>
              </div>
            </div>
            <div className="hcs-activity">
              <div className="hcs-act-item">
                <div className="avatar avatar-sm" style={{ background: "#22a060" }}></div>
                <div>
                  <strong>Grace N.</strong> donated KES 10,000
                  <p>5 hours ago</p>
                </div>
              </div>
              <div className="hcs-act-item" style={{ animationDelay: "0.3s" }}>
                <div className="avatar avatar-sm" style={{ background: "#0b7fc7" }}></div>
                <div>
                  <strong>Diaspora Support</strong> donated KES 50,000
                  <p>1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className="section section-sm">
        <div className="container">
          <h2 className="section-title">What are you raising for?</h2>
          <div className="cat-grid">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className="cat-btn"
                onClick={() => navigate("explore")}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Campaigns that need you</h2>
              <p className="section-sub">Real people, real causes. Every donation counts.</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate("explore")}>
              See all campaigns
            </button>
          </div>
          <div className="grid-3">
            {featured.map((c) => (
              <CampaignCard key={c.id} campaign={c} navigate={navigate} onDonate={onDonate} />
            ))}
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
                num: "01",
                title: "Create your fundraiser",
                desc: "Fill in your cause details, set a target, add photos and your story. It takes less than 5 minutes.",
              },
              {
                num: "02",
                title: "Share with your people",
                desc: "Share to WhatsApp, Facebook, X or via SMS with a single tap. Reach your friends, family and diaspora.",
              },
              {
                num: "03",
                title: "Receive & withdraw",
                desc: "Donors pay via M-Pesa, Airtel, card, or PayPal. Withdraw to your M-Pesa anytime you need.",
              },
            ].map((s) => (
              <div key={s.num} className="hiw-step">
                <div className="hiw-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate("create")}>
              Start your fundraiser now
            </button>
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

      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            Stories of impact
          </h2>
          <p className="section-sub" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            Thousands of Kenyans have transformed their lives with Harambee.
          </p>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card card">
                <div className="test-quote">"</div>
                <p className="test-text">{t.text}</p>
                <div className="test-footer">
                  <div className="test-name">{t.name}</div>
                  <div className="test-loc">{t.location} · {t.raised}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <h2>Your cause deserves to be heard.</h2>
          <p>Join over 133,000 fundraisers who have raised billions for causes that matter.</p>
          <button className="btn btn-white btn-lg" onClick={() => navigate("create")}>
            Start your free fundraiser
          </button>
        </div>
      </section>
    </main>
  );
}

