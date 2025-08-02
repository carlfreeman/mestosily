document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('booking-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
            'g-recaptcha-response': grecaptcha.getResponse()
        };
        
        const button = form.querySelector('button');
        const originalText = button.textContent;
        
        try {
            button.textContent = 'Отправка...';
            button.disabled = true;
            
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert(result.message || 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                form.reset();
                grecaptcha.reset();
            } else {
                throw new Error(result.error || 'Ошибка при отправке');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert(error.message || 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    });
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