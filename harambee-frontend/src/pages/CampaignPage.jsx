import { useState, useEffect } from "react";
import { CATEGORIES } from "../data/campaigns";
import { getCampaign, getCampaigns } from "../utils/api";
import { formatKES, formatKESFull, pct, getCategoryColor } from "../utils/helpers";
import CampaignCard from "../components/CampaignCard";
import "./CampaignPage.css";

export default function CampaignPage({ campaign, navigate, onDonate }) {
  const [tab, setTab] = useState("story");

  if (!campaign) {
    navigate("explore");
    return null;
  }

  const cat = CATEGORIES.find((c) => c.id === campaign.category_id);

  const progress = pct(campaign.raised, campaign.target);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (campaign?.category_id) {
      getCampaigns({ category: campaign.category_id, per_page: 3 }).then(data => {
        setRelated(data.campaigns || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [campaign]);




  return (
    <main className="campaign-page">
      <div className="container cp-grid">

        <div className="cp-main">
          <div className="cp-breadcrumb">
            <button onClick={() => navigate("home")}>Home</button>
            <span>›</span>
            <button onClick={() => navigate("explore")}>Explore</button>
            <span>›</span>
            <span>{campaign.title}</span>
          </div>

          <div className="cp-image-wrap">
            <img src={campaign.image} alt={campaign.title} className="cp-image" />
          </div>

          <div className="cp-meta-row">
            <span className={`tag ${getCategoryColor(campaign.category_id)}`}>

                {cat?.label || campaign.category_id}

            </span>

            <span className="cp-location">📍 {campaign.location}</span>
          </div>

          <h1 className="cp-title">{campaign.title}</h1>

          <div className="cp-organizer-row">
            <div className="avatar">{(campaign.organizer || '').split(" ").map((w) => w[0]).slice(0, 2).join("") || '?'}</div>

            <div>
              <div className="cp-org-label">Organised by</div>
              <div className="cp-org-name">{campaign.organizer}</div>
            </div>
          </div>


          <div className="cp-tabs">
{["story", "updates", "donors"].map((t) => (
              <button
                key={t}
                className={`cp-tab ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === "updates" && (campaign.updates || []).length > 0 && (
                  <span className="tab-badge">{(campaign.updates || []).length}</span>
                )}
              </button>
            ))}

          </div>

          <div className="cp-tab-content">
            {tab === "story" && (
              <div className="cp-story animate-fadein">
                <p className="cp-desc-lead">{campaign.description}</p>
                <div className="divider" />
                {(campaign.story || '').split("\n\n").map((para, i) => (
                  <p key={i} className="cp-story-para">{para}</p>
                ))}
              </div>
            )}

            {tab === "updates" && (
              <div className="cp-updates animate-fadein">
                {campaign.updates.length === 0 ? (
                  <div className="no-updates">
                    <p>📭 No updates yet. Check back soon.</p>
                  </div>
                ) : (
                  (campaign.updates || []).map((u, i) => (

                    <div key={i} className="update-item">
                      <div className="update-dot" />
                      <div className="update-body">
                        <div className="update-date">{u.date}</div>
                        <p className="update-text">{u.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "donors" && (
              <div className="cp-donors animate-fadein">
                <p className="donors-count">
                  <strong>{(campaign.donors || 0).toLocaleString()}</strong> people have donated

                </p>
                {(campaign.recent_donors || []).map((d, i) => (


                  <div key={i} className="donor-item">
                    <div className="avatar avatar-sm" style={{ background: `hsl(${(i * 60 + 130) % 360},50%,40%)` }}>
                      {d.name === "Anonymous" ? "?" : d.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="donor-info">
                      <span className="donor-name">{d.name}</span>
                      <span className="donor-time">{d.time}</span>
                    </div>
                    <span className="donor-amount">{formatKESFull(d.amount)}</span>
                  </div>
                ))}
                <p className="donors-more">+ {Math.max(0, (campaign.donors || 0) - (campaign.recent_donors || []).length).toLocaleString()} more donors</p>

              </div>
            )}
          </div>
        </div>


        <aside className="cp-sidebar">
          <div className="cp-sidebar-card">
            <div className="cp-raised-big">{formatKES(campaign.raised)}</div>
            <div className="cp-raised-sub">raised of {formatKES(campaign.target)} goal</div>

            <div className="progress-bar cp-progress">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>


            <button
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => onDonate(campaign)}
            >
              Donate Now
            </button>

            <div className="cp-share">
              <p>Share this campaign</p>
              <div className="share-btns">
                <button className="share-btn whatsapp">
                  <span>💬</span> WhatsApp
                </button>
                <button className="share-btn facebook">
                  <span>f</span> Facebook
                </button>
                <button className="share-btn twitter">
                  <span>𝕏</span> X
                </button>
              </div>
            </div>

          </div>
        </aside>
      </div>


      {related.length > 0 && (
        <div className="cp-related">
          <div className="container">
              <h2 className="section-title">More {cat?.label || campaign.category_id} campaigns</h2>

            <div className="grid-3" style={{ marginTop: "1.5rem" }}>
              {related.map((c) => (
                <CampaignCard key={c.id} campaign={c} navigate={navigate} onDonate={onDonate} />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
