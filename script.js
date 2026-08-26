// Theme switcher: accessible, persistent, and updates the button label to describe the theme it applies
(function (){
  const THEME_KEY = 'theme-preference';
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  function getPreferredTheme(){
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    // Fall back to system preference
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');
    return mq && mq.matches ? 'light' : 'dark';
  }

  function getIconSvg(theme){
    // Returns SVG inner markup for the icon that represents the THEME TO APPLY (light or dark)
    if (theme === 'light'){
      // sun icon
      return `
        <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
        <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </g>
      `;
    }
    // moon icon (for dark)
    return `
      <path fill="currentColor" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
    `;
  }

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    if (btn){
      const willApply = theme === 'dark' ? 'light' : 'dark';
      // Update accessible label to describe the theme the button will switch to
      btn.setAttribute('aria-label', `Switch to ${willApply} theme`);
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');

      // Ensure the SVG contains both sun and moon shapes (only set once)
      const icon = btn.querySelector('#theme-icon');
      if (icon && icon.childElementCount === 0){
        icon.innerHTML = `
          <g class="icon-shape sun" transform="translate(0,0)">
            <circle cx="12" cy="12" r="4" class="sun-core"></circle>
            <g class="sun-rays" stroke="var(--icon-sun-color)" stroke-width="2" stroke-linecap="round">
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

      // Toggle classes to animate between sun and moon (icon shows the theme that will be applied)
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
    const current = root.getAttribute('data-theme') || getPreferredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  // Initialize
  const initial = getPreferredTheme();
  applyTheme(initial);

  if (btn){
    btn.addEventListener('click', toggleTheme);
    // support keyboard activation
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        toggleTheme();
      }
    });
  }

  // keep system changes in sync only when user hasn't explicitly chosen a theme
  window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)){
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });
})();


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
