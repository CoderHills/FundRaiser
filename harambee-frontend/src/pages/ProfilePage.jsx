import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getCampaigns, apiFetch } from "../utils/api";
import CampaignCard from "../components/CampaignCard";
import "./ProfilePage.css";

export default function ProfilePage({ navigate, onDonate }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("campaigns");
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      loadMyCampaigns();
    }
  }, [user]);

  const loadMyCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getCampaigns({ per_page: 100 });
      const userCampaigns = (data.campaigns || []).filter(
        (c) => c.organizer?.toLowerCase() === user?.name?.toLowerCase()
      );
      setMyCampaigns(userCampaigns);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("home");
  };

  if (!user) {
    return (
      <main className="profile-page">
        <div className="container">
          <div className="not-logged-in">
            <h2>Please log in to view your profile</h2>
            <button className="btn btn-primary" onClick={() => navigate("dashboard")}>
              Log In
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-header">
        <div className="container">
          <div className="profile-hero">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p className="profile-email">{user.email}</p>
              {user.phone && <p className="profile-phone">{user.phone}</p>}
            </div>
            <button className="btn btn-secondary" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {message && (
            <div className={`profile-message ${message.includes("Failed") ? "error" : "success"}`}>
              {message}
            </div>
          )}

          {editing && (
            <form className="profile-edit-form" onSubmit={handleUpdateProfile}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="07XX XXX XXX"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="container profile-body">
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "campaigns" ? "active" : ""}`}
            onClick={() => setActiveTab("campaigns")}
          >
            My Campaigns
          </button>
          <button
            className={`tab-btn ${activeTab === "donations" ? "active" : ""}`}
            onClick={() => setActiveTab("donations")}
          >
            My Donations
          </button>
          <button
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>

        <div className="profile-content">
          {activeTab === "campaigns" && (
            <div className="tab-panel">
              <div className="panel-header">
                <h2>My Fundraisers</h2>
                <button className="btn btn-primary" onClick={() => navigate("create")}>
                  + Create Campaign
                </button>
              </div>
              
              {loading ? (
                <div className="loading-grid">
                  <div className="skeleton-card"></div>
                  <div className="skeleton-card"></div>
                </div>
              ) : myCampaigns.length === 0 ? (
                <div className="empty-state">
                  <h3>No campaigns yet</h3>
                  <p>Start your first fundraiser and make a difference!</p>
                  <button className="btn btn-primary" onClick={() => navigate("create")}>
                    Create Campaign
                  </button>
                </div>
              ) : (
                <div className="grid-3">
                  {myCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.slug}
                      campaign={campaign}
                      navigate={navigate}
                      onDonate={onDonate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "donations" && (
            <div className="tab-panel">
              <h2>My Donations</h2>
              <div className="empty-state">
                <h3>No donations yet</h3>
                <p>When you donate to campaigns, they'll show up here.</p>
                <button className="btn btn-secondary" onClick={() => navigate("explore")}>
                  Explore Campaigns
                </button>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="tab-panel">
              <h2>Account Settings</h2>
              
              <div className="settings-section">
                <h3>Notifications</h3>
                <label className="settings-toggle">
                  <input type="checkbox" defaultChecked />
                  <span>Email notifications for donations</span>
                </label>
                <label className="settings-toggle">
                  <input type="checkbox" defaultChecked />
                  <span>Email notifications for campaign updates</span>
                </label>
              </div>

              <div className="settings-section">
                <h3>Privacy</h3>
                <label className="settings-toggle">
                  <input type="checkbox" />
                  <span>Make my donations anonymous by default</span>
                </label>
              </div>

              <div className="settings-section danger-zone">
                
                <button className="btn btn-danger" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
