const SUPABASE_URL = 'https://squgzapymrjcozldeboe.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdWd6YXB5bXJqY296bGRlYm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDkzNTQsImV4cCI6MjA5NTIyNTM1NH0.dlXZz77Dw9YSGGpJDsMNMJUfPqTe-vc8AlMbr6ayj1U';

let accessToken = null;

const loginWrap = document.getElementById('login-wrap');
const adminHeader = document.getElementById('admin-header');
const messagesWrap = document.getElementById('messages-wrap');
const logoutBtn = document.getElementById('logout-btn');

async function showMessages() {
  loginWrap.style.display = 'none';
  adminHeader.style.display = 'flex';
  messagesWrap.classList.add('visible');
  logoutBtn.style.display = 'inline-block';

  const res = await fetch(`${SUPABASE_URL}/rest/v1/messages?select=*&order=created_at.desc`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${accessToken}`,
    }
  });
  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    messagesWrap.innerHTML = '<div class="empty-state">No messages yet.</div>';
    document.getElementById('message-count').textContent = '0 messages';
    return;
  }

  document.getElementById('message-count').textContent = `${data.length} message${data.length !== 1 ? 's' : ''}`;
  messagesWrap.innerHTML = data.map(m => `
    <div class="message-card">
      <div class="message-meta">
        <div>
          <span class="message-sender">${escapeHtml(m.name)}</span>
          <span class="message-email" style="margin-left:0.75rem;">${escapeHtml(m.email)}</span>
        </div>
        <span class="message-date">${new Date(m.created_at).toLocaleString()}</span>
      </div>
      <p class="message-body">${escapeHtml(m.message)}</p>
    </div>
  `).join('');
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('login-btn');
  const errorEl = document.getElementById('login-error');
  btn.disabled = true;
  btn.textContent = 'Logging in...';
  errorEl.textContent = '';

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: document.getElementById('admin-email').value,
        password: document.getElementById('admin-password').value,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      errorEl.textContent = data.error_description || data.msg || 'Login failed.';
      btn.disabled = false;
      btn.textContent = 'Log in';
    } else {
      accessToken = data.access_token;
      showMessages();
    }
  } catch (err) {
    errorEl.textContent = 'Network error: ' + err.message;
    btn.disabled = false;
    btn.textContent = 'Log in';
  }
});

logoutBtn.addEventListener('click', () => {
  accessToken = null;
  location.reload();
});
