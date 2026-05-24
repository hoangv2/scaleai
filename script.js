const SUPABASE_URL = 'https://squgzapymrjcozldeboe.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdWd6YXB5bXJqY296bGRlYm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDkzNTQsImV4cCI6MjA5NTIyNTM1NH0.dlXZz77Dw9YSGGpJDsMNMJUfPqTe-vc8AlMbr6ayj1U';

document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  status.className = 'form-status';
  status.textContent = '';

  const res = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value,
    }),
  });

  if (!res.ok) {
    status.textContent = 'Something went wrong. Please try again.';
    status.className = 'form-status error';
    btn.disabled = false;
    btn.textContent = 'Send Message';
  } else {
    const form = document.getElementById('contact-form');
    form.innerHTML = `
      <div class="form-success">
        <div class="form-success-icon">✓</div>
        <h4>Message sent!</h4>
        <p>Thanks for reaching out. I'll get back to you soon.</p>
      </div>
    `;
  }
});

// Scroll-triggered fade-in for sections
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.15 }
);
document.querySelectorAll('.skill-card, .project-card, .stat, .about-text').forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--text)' : '';
  });
}, { passive: true });
