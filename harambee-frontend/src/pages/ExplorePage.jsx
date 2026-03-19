import { useState, useEffect, useMemo, useCallback } from "react";
import { CATEGORIES } from "../data/campaigns";
import { getCampaigns } from "../utils/api";
import { useAuth } from "../contexts/AuthContext.jsx";
import CampaignCard from "../components/CampaignCard";
import "./ExplorePage.css";

const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "ending", label: "Ending Soon" },
  { value: "pct", label: "Most Funded %" },
];

export default function ExplorePage({ navigate, onDonate }) {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("trending");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("dashboard");
    }
  }, [user, navigate]);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const params = { 
        featured: "false",
        per_page: 50
      };
      
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      
      if (category !== "all") {
        params.category = category;
      }
      
      const data = await getCampaigns(params);
      setCampaigns(data.campaigns || []);
      setTotalCount(data.total || data.campaigns?.length || 0);
      setError(null);
    } catch (err) {
      setError("Failed to load campaigns");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const filtered = useMemo(() => {
    let list = [...campaigns];
    
    list.sort((a, b) => {
      if (sort === "trending") return (b.donors || 0) - (a.donors || 0);
      if (sort === "ending") return (a.days_left || 0) - (b.days_left || 0);
      if (sort === "pct") return ((b.raised || 0) / b.target) - ((a.raised || 0) / a.target);
      return new Date(b.created_at) - new Date(a.created_at);
    });
    return list;
  }, [campaigns, sort]);

  return (
    <main className="explore-page">
      <div className="explore-hero">
        <div className="container">
          <h1>Explore Campaigns</h1>
          <p>Find causes that move you — from Kenya to the world.</p>
          <div className="explore-search">
            <input
              type="text"
              placeholder="Search campaigns, locations, causes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="container explore-body">
        <div className="explore-filters">
          <div className="filter-cats">
            <button
              className={`cat-filter-btn ${category === "all" ? "active" : ""}`}
              onClick={() => setCategory("all")}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`cat-filter-btn ${category === c.id ? "active" : ""}`}
                onClick={() => setCategory(c.id)}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          <div className="filter-right">

            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="explore-results">
          <p className="results-count">
            {loading ? "Loading..." : `${filtered.length} campaign${filtered.length !== 1 ? "s" : ""} found`}
            {category !== "all" ? ` in ${CATEGORIES.find((c) => c.id === category)?.label}` : ""}
            {debouncedSearch ? ` for "${debouncedSearch}"` : ""}
          </p>

          {error && (
            <div className="empty-state">
              <h3>Error loading campaigns</h3>
              <p>{error}</p>
              <button className="btn btn-secondary" onClick={loadCampaigns}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-grid">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No campaigns found</h3>
              <p>Try a different search term or category.</p>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map((c) => (
                <CampaignCard key={c.slug} campaign={c} navigate={navigate} onDonate={onDonate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
