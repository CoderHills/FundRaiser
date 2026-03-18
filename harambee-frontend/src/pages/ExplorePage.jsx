import { useState, useMemo } from "react";
import { CAMPAIGNS, CATEGORIES } from "../data/campaigns";
import CampaignCard from "../components/CampaignCard";
import "./ExplorePage.css";

const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "ending", label: "Ending Soon" },
  { value: "pct", label: "Most Funded %" },
];

export default function ExplorePage({ navigate, onDonate }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("trending");


  const filtered = useMemo(() => {
    let list = [...CAMPAIGNS];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }
    if (category !== "all") list = list.filter((c) => c.category === category);

    list.sort((a, b) => {
      if (sort === "trending") return b.donors - a.donors;
      if (sort === "ending") return a.daysLeft - b.daysLeft;
      if (sort === "pct") return (b.raised / b.target) - (a.raised / a.target);
      return b.id - a.id;
    });
    return list;
  }, [search, category, sort]);

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
            {filtered.length} campaign{filtered.length !== 1 ? "s" : ""} found
            {category !== "all" ? ` in ${CATEGORIES.find((c) => c.id === category)?.label}` : ""}
          </p>

          {filtered.length === 0 ? (
            <div className="empty-state">
              
              <h3>No campaigns found</h3>
              <p>Try a different search term or category.</p>
              <button className="btn btn-secondary" onClick={() => { setSearch(""); setCategory("all"); }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map((c) => (
                <CampaignCard key={c.id} campaign={c} navigate={navigate} onDonate={onDonate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
