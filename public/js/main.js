document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput && !dateInput.value) {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    dateInput.value = iso;
  }

  const navToggle = document.querySelector('.main-nav');
  if (navToggle) {
    navToggle.addEventListener('click', (event) => {
      const target = event.target;
      if (target && target.tagName === 'A') {
        target.classList.add('active');
      }
    });
  }
});

// TODO(VULN-02 variant): teammates may add DOM XSS here.
