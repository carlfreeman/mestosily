document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const fields = {
    name: { element: document.getElementById('name'), error: document.getElementById('name-error') },
    phone: { element: document.getElementById('phone'), error: document.getElementById('phone-error') },
    message: { element: document.getElementById('message'), error: document.getElementById('message-error') },
    recaptcha: { error: document.getElementById('recaptcha-error') }
  };

  // Валидация при вводе
  Object.values(fields).forEach(({element, error}) => {
    if (element) {
      element.addEventListener('input', () => validateField(element, error));
      element.addEventListener('blur', () => validateField(element, error));
    }
  });

  // Валидация всей формы
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Валидация полей ввода
    Object.values(fields).forEach(({element, error}) => {
      if (element && !validateField(element, error)) {
        isValid = false;
      }
    });
    
    // // Валидация reCAPTCHA
    // if (!grecaptcha.getResponse()) {
    //   fields.recaptcha.error.textContent = 'Пожалуйста, пройдите reCaptcha';
    //   fields.recaptcha.error.classList.add('visible');
    //   isValid = false;
    // } else {
    //   fields.recaptcha.error.classList.remove('visible');
    // }
    
    if (!isValid) {
      // Прокрутка к первой ошибке
      const firstError = document.querySelector('.error-message.visible');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Отправка формы
    await submitForm();
  });

  // Валидация отдельного поля
  function validateField(field, errorElement) {
    if (!errorElement) return true;
    
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
    
    if (field.required && !field.value.trim()) {
      errorElement.textContent = 'Это поле обязательно для заполнения';
      errorElement.classList.add('visible');
      return false;
    }
    
    if (field.maxLength && field.value.length > field.maxLength) {
      errorElement.textContent = `Максимальная длина: ${field.maxLength} символов`;
      errorElement.classList.add('visible');
      return false;
    }
    
    if (field.pattern && !new RegExp(field.pattern).test(field.value)) {
      if (field.id === 'name') {
        errorElement.textContent = 'Проверьте правильность ввода';
      } else if (field.id === 'phone') {
        errorElement.textContent = 'Формат: +7, 8 или без кода';
      }
      errorElement.classList.add('visible');
      return false;
    }
    return true;
  }

  async function submitForm() {
    const button = form.querySelector('button');
    const originalText = button.textContent;
    
    try {
      button.textContent = 'Отправка...';
      button.disabled = true;
      
      const formData = {
        name: fields.name.element.value.trim(),
        phone: fields.phone.element.value.trim(),
        message: fields.message.element.value.trim(),
        'g-recaptcha-response': grecaptcha.getResponse()
      };
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showSuccessMessage();
        form.reset();
        grecaptcha.reset();
      } else {
        throw new Error(result.error || 'Ошибка сервера');
      }
    } catch (error) {
      showErrorMessage(error);
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  }
  
  function showSuccessMessage() {
    alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
  }
  
  function showErrorMessage(error) {
    console.error('Ошибка:', error);
    alert(error.message || 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const parallaxBg = document.querySelector('.parallax-bg');
    const header = document.querySelector('.parallax-header');

    if (parallaxBg && header) {
    const updateParallax = () => {
        const scrollPosition = window.pageYOffset;
        const headerHeight = header.offsetHeight;

        if (scrollPosition < headerHeight) {
            const translateY = scrollPosition * 0.25;
            parallaxBg.style.transform = `translateY(${translateY}px)`;

            const opacity = 1 - (scrollPosition / headerHeight * 0.7);
            parallaxBg.style.opacity = opacity > 0.2 ? opacity : 0.2;
        }
    };

    window.addEventListener('scroll', updateParallax);
    window.addEventListener('resize', updateParallax);
    }
});