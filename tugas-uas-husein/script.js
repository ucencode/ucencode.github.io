document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');

    if (form) {
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidation);
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate all fields
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField.call(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                showMessage('Mohon lengkapi semua field yang wajib diisi.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Mengirim...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                showMessage('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Clear any existing validation styles
                inputs.forEach(input => {
                    input.classList.remove('valid', 'invalid');
                });
            }, 2000);
        });
    }

    function validateField() {
        const field = this;
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const type = field.type;

        // Remove existing validation classes
        field.classList.remove('valid', 'invalid');

        // Check if required field is empty
        if (isRequired && !value) {
            field.classList.add('invalid');
            return false;
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('invalid');
                return false;
            }
        }

        // If field has value and is valid
        if (value) {
            field.classList.add('valid');
        }

        return true;
    }

    function clearValidation() {
        this.classList.remove('valid', 'invalid');
    }

    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;

        // Insert after form
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(messageDiv, form.nextSibling);

        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }
});
