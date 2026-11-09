// Victor Tolentino | 20412496
 
(function () {
  // THEME SWITCH
  const html = document.documentElement;
  const switcher = document.querySelector('#themeSwitch');
 
  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('victor-theme') || 'light';
  } catch (error) {
    savedTheme = 'light';
  }
 
  html.setAttribute('data-bs-theme', savedTheme);
 
  if (switcher) {
    switcher.checked = savedTheme === 'dark';
 
    switcher.addEventListener('change', function () {
      const nextTheme = switcher.checked ? 'dark' : 'light';
      html.setAttribute('data-bs-theme', nextTheme);
 
      try {
        localStorage.setItem('victor-theme', nextTheme);
      } catch (error) {
        // Theme switching still works if storage is unavailable.
      }
    });
  }
 
  // Live clock and OS model
  // Idea inspired from Satvik's session box: https://satvik.live/
  const clock = document.getElementById('clock');
 
  if (clock) {
    const updateClock = function () {
      const time = new Date().toLocaleTimeString('en-AU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      clock.textContent = time.toLowerCase();
    };
 
    updateClock();
    window.setInterval(updateClock, 1000);
  }
 
  const osLabel = document.getElementById('os');
 
  if (osLabel) {
    const platform = (navigator.userAgentData?.platform || navigator.platform || '').toLowerCase();
    const info = platform + ' ' + navigator.userAgent.toLowerCase();
    let os = 'UNKNOWN';
 
    if (/iphone|ipad|ipod/.test(info)) os = 'IOS';
    else if (/android/.test(info)) os = 'ANDROID';
    else if (/win/.test(info)) os = 'WINDOWS';
    else if (/mac/.test(info)) os = 'MAC';
    else if (/linux|x11/.test(info)) os = 'LINUX';
    osLabel.textContent = os;
  }
 
  // HOME TYPEWRITER: types and deletes phrases (home page)
  const typingTarget = document.querySelector('.typewrite');
 
  if (typingTarget) {
    let words = [];
    try {
      words = JSON.parse(typingTarget.dataset.words || '[]');
    } catch (error) {
      words = [];
    }
 
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Show the first phrase without animation
      typingTarget.textContent = words[0] || '';
    } else if (words.length) {
      let wordIndex = 0;
      let characterIndex = 0;
      let deleting = false;
 
      const typeLoop = function () {
        const word = words[wordIndex] || '';
 
        characterIndex += deleting ? -1 : 1;
        typingTarget.textContent = word.slice(0, characterIndex);
 
        let delay = deleting ? 55 : 95;
 
        if (!deleting && characterIndex === word.length) {
          deleting = true;
          delay = 1200;
        } else if (deleting && characterIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          delay = 350;
        }
 
        window.setTimeout(typeLoop, delay);
      };
 
      typeLoop();
    }
  }
 // Project Page: filter buttons, project lists, detail panel
  const detail = document.getElementById('projectDetail');
  if (detail) {
    const items = document.querySelectorAll('.project-item');
    const panels = document.querySelectorAll('.project-detail');
    const filters = document.querySelectorAll('.filter-btn');
    const emptyMsg = document.getElementById('filterEmpty');
 
    function show(id) {
      items.forEach(item => {
        const isOn = item.dataset.target === id;
        item.classList.toggle('active', isOn);
        if (isOn) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
      });
      panels.forEach(panel => { panel.hidden = panel.id !== id; });
    }
    // interactive list
    items.forEach(item => {
      item.addEventListener('click', () => {
        show(item.dataset.target);
        if (window.innerWidth < 992) detail.scrollIntoView({ block: 'start' });
      });
    });
    // interactive filter button
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
 
        filters.forEach(b => {
          const isOn = b === btn;
          b.classList.toggle('active', isOn);
          b.setAttribute('aria-pressed', isOn);
        });
 
        let visible = 0;
        items.forEach(item => {
          const match = filter === 'all' || item.dataset.status === filter;
          item.hidden = !match;
          if (match) visible++;
        });
 
        if (emptyMsg) emptyMsg.hidden = visible > 0;
        detail.hidden = visible === 0;
 
        if (visible > 0) {
          const current = document.querySelector('.project-item.active');
          if (!current || current.hidden) {
            const first = [...items].find(item => !item.hidden);
            if (first) show(first.dataset.target);
          }
        }
      });
    });
  }
})();
