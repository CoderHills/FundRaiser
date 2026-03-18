import { formatKES, pct, getCategoryColor } from "../utils/helpers";
import { CATEGORIES } from "../data/campaigns";
import "./CampaignCard.css";

export default function CampaignCard({ campaign, navigate, onDonate }) {
  const cat = CATEGORIES.find((c) => c.id === campaign.category);
  const progress = pct(campaign.raised, campaign.target);

  return (
    <article className="campaign-card card" onClick={() => navigate("campaign", campaign)}>
      <div className="cc-image">
        <img src={campaign.image} alt={campaign.title} loading="lazy" />
        <div className="cc-category">
          <span className={`tag ${getCategoryColor(campaign.category)}`}>
            {cat?.label}
          </span>
        </div>
        {campaign.featured && (
          <div className="cc-featured">Featured</div>
        )}
      </div>

      <div className="cc-body">
        <h3 className="cc-title">{campaign.title}</h3>
        <p className="cc-location">📍 {campaign.location}</p>
        <p className="cc-desc">{campaign.description.slice(0, 100)}…</p>

        <div className="cc-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="cc-stats">
            <span className="cc-raised">{formatKES(campaign.raised)} raised</span>
            <span className="cc-pct">{progress}%</span>
          </div>
          {/* Stats removed */}
        </div>

        <div className="cc-footer">
          <div className="cc-organizer">
            <div className="avatar avatar-sm">
              {campaign.organizer.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div className="cc-by">By {campaign.organizer}</div>

            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => { e.stopPropagation(); onDonate(campaign); }}
          >
            Donate
          </button>
        </div>
      </div>
    </article>
  );
}
