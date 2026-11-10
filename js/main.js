// Progressive enhancement: forms and filters work only when JavaScript is enabled.
(() => {
  'use strict';

  // Program cards filter (interactive feature #1).
  const filterButtons = document.querySelectorAll('[data-filter]');
  const programItems = document.querySelectorAll('.program-item');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      programItems.forEach((item) => {
        item.hidden = filter !== 'all' && item.dataset.category !== filter;
      });
    });
  });

  // Registration form validation and local confirmation.
  const registrationForm = document.querySelector('#registrationForm');
  if (registrationForm) {
    const password = registrationForm.querySelector('#password');
    const confirmPassword = registrationForm.querySelector('#confirmPassword');
    const startDate = registrationForm.querySelector('#startDate');
    const modeFeedback = registrationForm.querySelector('#modeFeedback');
    const status = registrationForm.querySelector('#registrationStatus');

    // Date cannot be in the past.
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    startDate.min = localToday;

    const validatePasswords = () => {
      const match = password.value === confirmPassword.value && confirmPassword.value.length > 0;
      confirmPassword.setCustomValidity(match ? '' : 'Пароли не совпадают.');
      confirmPassword.classList.toggle('is-invalid', !match && confirmPassword.value.length > 0);
      return match;
    };
    password.addEventListener('input', validatePasswords);
    confirmPassword.addEventListener('input', validatePasswords);

    registrationForm.addEventListener('submit', (event) => {
      event.preventDefault();
      status.textContent = '';
      status.className = 'form-status mt-3';
      validatePasswords();

      const modeChosen = registrationForm.querySelector('input[name="studyMode"]:checked');
      modeFeedback.style.display = modeChosen ? 'none' : 'block';
      registrationForm.classList.add('was-validated');

      if (!registrationForm.checkValidity() || !modeChosen) {
        status.textContent = 'Пожалуйста, проверь обязательные поля и исправь отмеченные ошибки.';
        status.classList.add('error');
        const firstInvalid = registrationForm.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      status.textContent = 'Заявка успешно проверена! Это демонстрационное подтверждение: данные не отправлены на сервер.';
      status.classList.add('success');
      registrationForm.reset();
      registrationForm.classList.remove('was-validated');
      confirmPassword.setCustomValidity('');
    });
  }

  // Contact form basic validation + honeypot anti-spam.
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    const status = document.querySelector('#contactStatus');
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      status.textContent = '';
      status.className = 'form-status mt-3';
      contactForm.classList.add('was-validated');

      const honeypot = contactForm.querySelector('#website');
      if (honeypot.value) {
        status.textContent = 'Не удалось обработать сообщение.';
        status.classList.add('error');
        return;
      }
      if (!contactForm.checkValidity()) {
        status.textContent = 'Пожалуйста, заполни все обязательные поля корректно.';
        status.classList.add('error');
        const firstInvalid = contactForm.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      status.textContent = 'Спасибо! Сообщение проверено. В этом статическом макете оно не отправляется на сервер.';
      status.classList.add('success');
      contactForm.reset();
      contactForm.classList.remove('was-validated');
    });
  }
})();
