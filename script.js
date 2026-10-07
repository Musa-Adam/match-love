  const form = document.getElementById('form');
  const name1 = document.getElementById('name1');
  const name2 = document.getElementById('name2');
  const errorEl = document.getElementById('error');
  const result = document.getElementById('result');
  const heartWrap = document.getElementById('heartWrap');
  const heartFill = document.getElementById('heartFill');
  const scoreEl = document.getElementById('score');
  const namesEl = document.getElementById('names');
  const messageEl = document.getElementById('message');

  // Each tier: upper limit of the score, heart colour, and a result message.
  const tiers = [
    { max: 24,  color: '#6f8fc7', text: 'Different worlds. Friendship is still on the table.' },
    { max: 49,  color: '#a77bd1', text: 'Some sparks, some static. It takes effort, but it can work.' },
    { max: 74,  color: '#e8639a', text: 'A good match. You two have real potential.' },
    { max: 89,  color: '#e8336d', text: 'A great match. This one feels easy.' },
    { max: 100, color: '#d6153f', text: 'A perfect pair. Start planning the celebration.' }
  ];

  function showError(message, field) {
    errorEl.textContent = message;
    [name1, name2].forEach(i => i.removeAttribute('aria-invalid'));
    if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
  }

  function validate() {
    const a = name1.value.trim(), b = name2.value.trim();
    if (!a) { showError('Enter the first name.', name1); return null; }
    if (!b) { showError('Enter the second name.', name2); return null; }
    if (a.toLowerCase() === b.toLowerCase()) {
      showError('Enter two different names.', name2); return null;
    }
    showError('');
    return [a, b];
  }

  function countUp(target) {
    const duration = 1600, start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      scoreEl.textContent = Math.round(target * eased) + '%';
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function burstHearts(score) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = heartWrap.getBoundingClientRect();
    const count = Math.max(3, Math.round(score / 8));
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'burst';
      el.textContent = score >= 50 ? '\u2764\uFE0F' : '\uD83D\uDC99';
      el.style.left = rect.left + rect.width / 2 + (Math.random() - .5) * rect.width * .7 + 'px';
      el.style.top = rect.top + rect.height * .7 + 'px';
      el.style.setProperty('--dx', (Math.random() - .5) * 160 + 'px');
      el.style.animationDelay = 1.2 + Math.random() * .8 + 's';
      el.addEventListener('animationend', () => el.remove());
      document.body.appendChild(el);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const names = validate();
    if (!names) return;

    const score = Math.floor(Math.random() * 101);           // random 0–100
    const tier = tiers.find(t => score <= t.max);

    // Reset the heart, then fill it on the next frame so the animation replays
    result.hidden = false;
    heartFill.style.transition = 'none';
    heartFill.style.transform = 'translateY(90px)';
    heartWrap.classList.remove('beat');
    void heartFill.getBoundingClientRect();

    heartFill.style.transition = '';
    heartFill.querySelector('rect').style.fill = tier.color;
    heartFill.style.transform = 'translateY(' + (90 - 90 * score / 100) + 'px)';
    heartWrap.classList.add('beat');

    namesEl.textContent = names[0] + ' + ' + names[1];
    messageEl.textContent = tier.text;
    countUp(score);
    burstHearts(score);
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  [name1, name2].forEach(i => i.addEventListener('input', () => showError('')));
