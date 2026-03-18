import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import CampaignPage from "./pages/CampaignPage";
import CreatePage from "./pages/CreatePage";
import DashboardPage from "./pages/DashboardPage";
import DonateModal from "./components/DonateModal";
import "./styles/global.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donateTarget, setDonateTarget] = useState(null);

  const navigate = (p, data = null) => {
    setPage(p);
    if (data) setSelectedCampaign(data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <Navbar page={page} navigate={navigate} />

      {page === "home" && (
        <HomePage navigate={navigate} onDonate={setDonateTarget} />
      )}
      {page === "explore" && (
        <ExplorePage navigate={navigate} onDonate={setDonateTarget} />
      )}
      {page === "campaign" && (
        <CampaignPage
          campaign={selectedCampaign}
          navigate={navigate}
          onDonate={setDonateTarget}
        />
      )}
      {page === "create" && <CreatePage navigate={navigate} />}
      {page === "dashboard" && <DashboardPage navigate={navigate} />}

      <Footer navigate={navigate} />

      {donateTarget && (
        <DonateModal
          campaign={donateTarget}
          onClose={() => setDonateTarget(null)}
        />
      )}
    </div>
  );
}
