import { useState } from "react";
import { CATEGORIES } from "../data/campaigns";
import "./CreatePage.css";

const STEPS = ["Basics", "Story", "Goal", "Payouts", "Review"];

export default function CreatePage({ navigate }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    target: "",
    deadline: "",
    description: "",
    story: "",
    phone: "",
    accountName: "",
    method: "mpesa",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.title && form.category && form.location;
    if (step === 1) return form.description && form.story;
    if (step === 2) return form.target && form.deadline;
    if (step === 3) return form.phone && form.accountName;
    return true;
  };

  const handleSubmit = () => {
    setTimeout(() => setDone(true), 1000);
  };

  if (done) {
    return (
      <main className="create-page">
          <div className="create-success container-sm">

            <button className="btn btn-primary" onClick={() => navigate("dashboard")}>
              Go to Dashboard
            </button>
          </div>
      </main>
    );
  }

  return (
    <main className="create-page">
      <div className="create-hero">
        <div className="container-sm">
          <h1>Start your fundraiser</h1>
          <p>Free to start · Money on M-Pesa · Takes under 5 minutes</p>
        </div>
      </div>

      <div className="container-sm create-body">
        <div className="create-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`cs-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
              <div className="cs-dot">{i < step ? "✓" : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="create-card card">
          {step === 0 && (
            <div className="form-section animate-fadeup">
              <h2>Tell us about your cause</h2>
              <p className="form-hint">Give your fundraiser a clear, compelling title.</p>

              <div className="form-group">
                <label>Fundraiser title *</label>
                <input
                  type="text"
                  placeholder="e.g. Help mama Jane pay for surgery"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  maxLength={80}
                />
                <span className="char-count">{form.title.length}/80</span>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <div className="cat-picker">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`cat-pick-btn ${form.category === c.id ? "active" : ""}`}
                      onClick={() => set("category", c.id)}
                    >
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Nairobi, Kenya"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="form-section animate-fadeup">
              <h2>Tell your story</h2>
              <p className="form-hint">The more personal your story, the more people will connect and donate.</p>

              <div className="form-group">
                <label>Short description *</label>
                <textarea
                  rows={3}
                  placeholder="A brief 1–2 sentence summary of your cause (shown on campaign cards)"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  maxLength={200}
                />
                <span className="char-count">{form.description.length}/200</span>
              </div>

              <div className="form-group">
                <label>Full story *</label>
                <textarea
                  rows={8}
                  placeholder="Share the full details of your situation. Who is this for? What happened? What will the money be used for? Why now?"
                  value={form.story}
                  onChange={(e) => set("story", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Campaign photo / video</label>
                <div className="upload-zone">
                  
                  <p>Drag & drop or <span>browse files</span></p>
                  <small>JPG, PNG, MP4 · Max 50MB</small>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-section animate-fadeup">
              <h2>Set your goal</h2>
              <p className="form-hint">You can still receive donations after reaching your goal.</p>

              <div className="form-group">
                <label>Target amount (KES) *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "var(--ink-soft)", fontSize: "0.9rem" }}>KES</span>
                  <input
                    type="number"
                    placeholder="500,000"
                    value={form.target}
                    onChange={(e) => set("target", e.target.value)}
                    style={{ paddingLeft: "3.5rem" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Campaign end date *</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => set("deadline", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {form.target && (
                <div className="goal-preview">
                  <div className="gp-row">
                    <span>Your goal</span>
                    <strong>KES {parseInt(form.target).toLocaleString()}</strong>
                  </div>
                  <div className="gp-row">
                    <span>Platform fee (4.25%)</span>
                    <span>KES {Math.round(form.target * 0.0425).toLocaleString()}</span>
                  </div>
                  <div className="gp-row total">
                    <span>You receive (if goal met)</span>
                    <strong className="gp-total">KES {Math.round(form.target * 0.9575).toLocaleString()}</strong>
                  </div>
                </div>
              )}

              <div className="fee-info">
                <strong>About our fees:</strong> We charge a flat 4.25% platform fee on donations received. There are no setup fees, no monthly fees, and no withdrawal fees.
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-section animate-fadeup">
              <h2>Payout details</h2>
              <p className="form-hint">Where should donations go? You can withdraw anytime.</p>

              <div className="payout-methods">
                {[
                  { id: "mpesa", label: "M-Pesa", icon: "📱" },
                  { id: "bank", label: "Bank Account", icon: "🏦" },
                  { id: "airtel", label: "Airtel Money", icon: "📲" },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    className={`pm-pick ${form.method === pm.id ? "active" : ""}`}
                    onClick={() => set("method", pm.id)}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label>
                  {form.method === "bank" ? "Account number" : "Phone number"} *
                </label>
                <input
                  type={form.method === "bank" ? "text" : "tel"}
                  placeholder={form.method === "bank" ? "1234567890" : "07XX XXX XXX"}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Account name *</label>
                <input
                  type="text"
                  placeholder="Full name as registered"
                  value={form.accountName}
                  onChange={(e) => set("accountName", e.target.value)}
                />
              </div>

              <div className="verification-note">
                🛡️ We may verify your identity to protect donors. This usually takes 24–48 hours for new accounts.
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-section animate-fadeup">
              <h2>Review & launch</h2>
              <p className="form-hint">Check everything looks good before going live.</p>

              <div className="review-card">
                <div className="review-row"><span>Title</span><strong>{form.title || "—"}</strong></div>
                <div className="review-row"><span>Category</span><strong>{CATEGORIES.find((c) => c.id === form.category)?.label || "—"}</strong></div>
                <div className="review-row"><span>Location</span><strong>{form.location || "—"}</strong></div>
                <div className="review-row"><span>Target</span><strong>KES {parseInt(form.target || 0).toLocaleString()}</strong></div>
                <div className="review-row"><span>End date</span><strong>{form.deadline || "—"}</strong></div>
                <div className="review-row"><span>Payout</span><strong>{form.method.toUpperCase()} · {form.phone}</strong></div>
              </div>

              <div className="terms-check">
                <label>
                  <input type="checkbox" />
                  <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Community Guidelines</a>. I confirm all information is accurate.</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="create-nav">
          {step > 0 ? (
            <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
              ← Back
            </button>
          ) : (
            <button className="btn btn-ghost" onClick={() => navigate("home")}>
              Cancel
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              className="btn btn-primary"
              disabled={!canNext()}
              onClick={() => setStep(step + 1)}
            >
              Continue →
            </button>
          ) : (
            <button className="btn btn-sun btn-lg" onClick={handleSubmit}>
              Launch my fundraiser
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
