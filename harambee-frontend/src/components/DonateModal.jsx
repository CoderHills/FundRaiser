import { useState } from "react";
import { formatKESFull } from "../utils/helpers";
import "./DonateModal.css";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];
const PAYMENT_METHODS = [
  { id: "mpesa", label: "M-Pesa", desc: "Lipa na M-Pesa" },
  { id: "airtel", label: "Airtel Money", desc: "Airtel Money Kenya" },
  { id: "card", label: "Card", desc: "Visa / Mastercard" },
  { id: "paypal", label: "PayPal", desc: "International" },
];

export default function DonateModal({ campaign, onClose }) {
  const [step, setStep] = useState(1); 
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState(false);
  const [method, setMethod] = useState("mpesa");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const numAmount = parseInt(amount) || 0;

  const handleQuick = (v) => {
    setAmount(String(v));
    setCustomAmount(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 2200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box donate-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dm-header">
          <div>
            <p className="dm-for">Donating to</p>
            <h3 className="dm-campaign-title">{campaign.title}</h3>
          </div>
          <button className="dm-close" onClick={onClose}></button>
        </div>

        {step < 4 && (
          <div className="dm-steps">
            {["Amount", "Payment", "Confirm"].map((s, i) => (
              <div key={s} className={`dm-step ${step > i + 1 ? "done" : ""} ${step === i + 1 ? "active" : ""}`}>
                <div className="dm-step-dot">{step > i + 1 ? "✓" : i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        <div className="dm-body">
          {step === 1 && (
            <div className="dm-section animate-fadeup">
              <p className="dm-label">Choose an amount (KES)</p>
              <div className="quick-amounts">
                {QUICK_AMOUNTS.map((v) => (
                  <button
                    key={v}
                    className={`qa-btn ${amount === String(v) && !customAmount ? "active" : ""}`}
                    onClick={() => handleQuick(v)}
                  >
                    {v.toLocaleString()}
                  </button>
                ))}
                <button
                  className={`qa-btn ${customAmount ? "active" : ""}`}
                  onClick={() => { setCustomAmount(true); setAmount(""); }}
                >
                  Other
                </button>
              </div>

              {customAmount && (
                <div className="dm-input-group" style={{ marginTop: "1rem" }}>
                  <span className="dm-currency">KES</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ paddingLeft: "3.5rem" }}
                    autoFocus
                  />
                </div>
              )}

              {numAmount > 0 && (
                <p className="dm-fee-note">
                  Platform fee: KES {Math.round(numAmount * 0.0425).toLocaleString()} (4.25%) · You're contributing KES {numAmount.toLocaleString()}
                </p>
              )}

              <div className="dm-input-group" style={{ marginTop: "1rem" }}>
                <textarea
                  placeholder="Leave a message of support (optional)"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ resize: "none" }}
                />
              </div>

              <label className="dm-checkbox">
                <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                <span>Donate anonymously</span>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="dm-section animate-fadeup">
              <p className="dm-label">Select payment method</p>
              <div className="pm-grid">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.id}
                    className={`pm-option ${method === pm.id ? "active" : ""}`}
                    onClick={() => setMethod(pm.id)}
                  >
                    
                    <span className="pm-name">{pm.label}</span>
                    <span className="pm-desc">{pm.desc}</span>
                  </button>
                ))}
              </div>

              {(method === "mpesa" || method === "airtel") && (
                <div className="dm-input-group" style={{ marginTop: "1.25rem" }}>
                  
                  <input
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ paddingLeft: "3rem" }}
                  />
                </div>
              )}

              {method === "card" && (
                <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <input type="text" placeholder="Card number" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <input type="text" placeholder="MM / YY" />
                    <input type="text" placeholder="CVC" />
                  </div>
                </div>
              )}

              {!anonymous && (
                <input
                  type="text"
                  placeholder="Your name (shown on campaign)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ marginTop: "0.75rem" }}
                />
              )}
            </div>
          )}

          {step === 2 && (
            <div className="dm-footer">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                disabled={!phone || (!name && !anonymous)}
                onClick={() => setStep(3)}
                style={{ marginLeft: "auto" }}
              >
                Continue →
              </button>
            </div>
          )}

          {step === 3 && (

            <div className="dm-section animate-fadeup">
              <div className="confirm-box">
                <div className="confirm-row">
                  <span>Donation amount</span>
                  <strong>{formatKESFull(numAmount)}</strong>
                </div>
                <div className="confirm-row">
                  <span>Platform fee (4.25%)</span>
                  <span>KES {Math.round(numAmount * 0.0425).toLocaleString()}</span>
                </div>
                <div className="confirm-row total">
                  <span>Campaign receives</span>
                  <strong className="confirm-total">
                    {formatKESFull(Math.round(numAmount * 0.9575))}
                  </strong>
                </div>
                <div className="divider" />
                <div className="confirm-row">
                  <span>Payment method</span>
                  <span>{PAYMENT_METHODS.find((p) => p.id === method)?.label}</span>
                </div>
                {(phone) && (
                  <div className="confirm-row">
                    <span>Phone</span>
                    <span>{phone}</span>
                  </div>
                )}
                {!anonymous && name && (
                  <div className="confirm-row">
                    <span>From</span>
                    <span>{name}</span>
                  </div>
                )}
                {anonymous && (
                  <div className="confirm-row">
                    <span>Donor</span>
                    <span>Anonymous</span>
                  </div>
                )}
                {message && (
                  <div className="confirm-message">"{message}"</div>
                )}
              </div>
              {method === "mpesa" && (
                <div className="mpesa-note">
                  An M-Pesa STK push will be sent to <strong>{phone}</strong>. Enter your PIN to complete the donation.
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="dm-section dm-success animate-fadeup">
              <h3>Donation Successful!</h3>
              <p>Thank you{name ? `, ${name}` : ""}! Your donation of <strong>{formatKESFull(numAmount)}</strong> to <em>{campaign.title}</em> has been received.</p>
              <p className="success-sub">A confirmation SMS has been sent to {phone || "your phone"}. The campaign organizer will be notified.</p>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }} onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>

        {step < 4 && (
          <div className="dm-footer">
            {step > 1 && (
              <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button
                className="btn btn-primary"
                disabled={step === 1 && !numAmount}
                onClick={() => setStep(step + 1)}
                style={{ marginLeft: "auto" }}
              >
                Continue →
              </button>
            ) : (
              <button
                className="btn btn-sun btn-lg"
                onClick={handleSubmit}
                disabled={loading}
                style={{ marginLeft: "auto" }}
              >
                {loading ? (
                  <span className="loading-dots">
                    Processing<span>.</span><span>.</span><span>.</span>
                  </span>
                ) : (
                  `🤝 Donate ${formatKESFull(numAmount)}`
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
