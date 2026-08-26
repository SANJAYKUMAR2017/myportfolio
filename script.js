// Theme switcher: accessible, persistent, and updates the button label to describe the theme it applies
document.addEventListener('DOMContentLoaded', () => {
  const THEME_KEY = 'theme-preference';
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  function safeGet(key){
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value){
    try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
  }

  function getStoredTheme(){
    const s = safeGet(THEME_KEY);
    return (s === 'light' || s === 'dark') ? s : null;
  }

  function getSystemTheme(){
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
  }

  function ensureIconInitialized(icon){
    if (!icon || icon.childElementCount > 0) return;
    icon.innerHTML = `
      <g class="icon-shape sun" transform="translate(0,0)">
        <circle cx="12" cy="12" r="4" class="sun-core"></circle>
        <g class="sun-rays" stroke-width="2" stroke-linecap="round">
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </g>
      </g>
      <g class="icon-shape moon" transform="translate(0,0)">
        <path class="moon-core" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
      </g>
    `;
  }

  function applyTheme(theme, {save = false} = {}){
    if (!theme) return;
    root.setAttribute('data-theme', theme);
    if (save) safeSet(THEME_KEY, theme);

    if (btn){
      const willApply = theme === 'dark' ? 'light' : 'dark';
      btn.setAttribute('aria-label', `Switch to ${willApply} theme`);
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');

      const icon = btn.querySelector('#theme-icon');
      ensureIconInitialized(icon);

      // Toggle classes so CSS performs the animated transition and color adaptation
      if (willApply === 'light'){
        btn.classList.add('show-sun');
        btn.classList.remove('show-moon');
      } else {
        btn.classList.add('show-moon');
        btn.classList.remove('show-sun');
      }
    }
  }

  function toggleTheme(){
    const current = root.getAttribute('data-theme') || getSystemTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, {save: true});
  }

  // Initialize on load: prefer stored theme, else fall back to system
  const stored = getStoredTheme();
  const initial = stored || getSystemTheme();
  applyTheme(initial, {save: !!stored});

  // Event listeners
  if (btn){
    btn.addEventListener('click', toggleTheme);
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        toggleTheme();
      }
    });
  }

  // Keep system changes in sync only when user hasn't explicitly chosen a theme
  if (window.matchMedia){
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', (e) => {
      if (!getStoredTheme()){
        applyTheme(e.matches ? 'light' : 'dark', {save: false});
      }
    });
  }
});


// Smooth scrolling for internal links and basic form handling
document.addEventListener('click', (e) => {
  const el = e.target.closest('a[href^="#"]');
  if (!el) return;
  const href = el.getAttribute('href');
  if (href === '#') return; // ignore placeholders
  const target = document.querySelector(href);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
});

const form = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

if (form) {
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    formNote.textContent = '';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      formNote.textContent = 'Please complete all fields.';
      return;
    }

    // Basic email pattern check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formNote.textContent = 'Please provide a valid email address.';
      return;
    }

    // Simulate sending: replace with real API call if desired
    formNote.textContent = 'Sending...';
    setTimeout(() => {
      formNote.textContent = 'Thanks — message sent! I will reply soon.';
      form.reset();
    }, 900);
  });
}
