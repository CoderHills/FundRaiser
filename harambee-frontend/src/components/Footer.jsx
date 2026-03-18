import "./Footer.css";

export default function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">Hara<em>mbee</em></div>
            <p>Africa's most trusted fundraising platform. Secure, transparent, and built for every Kenyan.</p>
            <div className="footer-payments">
              <span>M-Pesa</span>
              <span>Airtel</span>
              <span>Visa/Mastercard</span>
              <span>PayPal</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Fundraise</h4>
            <button onClick={() => navigate("create")}>Start a fundraiser</button>
            <a href="#">Medical fundraisers</a>
            <a href="#">Education</a>
            <a href="#">Emergency relief</a>
            <a href="#">Memorial</a>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <a href="#">How it works</a>
            <a href="#">Pricing & fees</a>
            <a href="#">Verification</a>
            <a href="#">USSD *483*57#</a>
            <a href="#">Affiliates</a>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Help Centre</a>
            <a href="#">Contact us</a>
            <a href="tel:+254207650919">Call +254 20 765 0919</a>
            <a href="mailto:support@harambee.africa">Email support@harambee.africa</a>
            <div className="footer-social">
              <a href="#">X</a>
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Harambee Africa Ltd. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
