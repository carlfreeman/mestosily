document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('booking-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };
        
        const button = form.querySelector('button');
        const originalText = button.textContent;
        
        try {
            button.textContent = 'Отправка...';
            button.disabled = true;
            
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                form.reset();
            } else {
                throw new Error('Ошибка при отправке');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    });
});