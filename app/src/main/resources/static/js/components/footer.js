function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  footer.innerHTML = `
    <footer class="footer">
      <div class="footer-logo">
        <p><strong>Smart Clinic Management System</strong></p>
        <p>© 2026 Smart Clinic. All rights reserved.</p>
      </div>

      <div class="footer-column">
        <h4>Company</h4>
        <a href="#">About</a>
        <a href="#">Careers</a>
        <a href="#">Press</a>
      </div>

      <div class="footer-column">
        <h4>Support</h4>
        <a href="#">Account</a>
        <a href="#">Help Center</a>
        <a href="#">Contact</a>
      </div>

      <div class="footer-column">
        <h4>Legals</h4>
        <a href="#">Terms</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Licensing</a>
      </div>
    </footer>
  `;
}

window.renderFooter = renderFooter;
document.addEventListener("DOMContentLoaded", renderFooter);
