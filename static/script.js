// Kurdish Number to Word Converter - Frontend Logic
class KurdishConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupKeyboardShortcuts();
    }

    initializeElements() {
        // Input elements
        this.numberInput = document.getElementById('numberInput');
        this.convertBtn = document.getElementById('convertBtn');

        // Output elements
        this.outputBox = document.getElementById('outputBox');
        this.copyBtn = document.getElementById('copyBtn');


        // Toast elements
        this.errorToast = document.getElementById('errorToast');
        this.successToast = document.getElementById('successToast');
        this.errorMessage = document.getElementById('errorMessage');
        this.successMessage = document.getElementById('successMessage');
        this.closeError = document.getElementById('closeError');

        // Loading overlay
        this.loadingOverlay = document.getElementById('loadingOverlay');
    }

    bindEvents() {
        // Convert button click
        this.convertBtn.addEventListener('click', () => this.convertNumber());

        // Enter key in input field
        this.numberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.convertNumber();
            }
        });

        // Input validation and formatting
        this.numberInput.addEventListener('input', (e) => this.handleInput(e));
        this.numberInput.addEventListener('paste', (e) => this.handlePaste(e));

        // Copy button
        this.copyBtn.addEventListener('click', () => this.copyResult());


        // Close error toast
        this.closeError.addEventListener('click', () => this.hideErrorToast());

        // Auto-hide success toast
        this.successToast.addEventListener('click', () => this.hideSuccessToast());
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to convert
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.convertNumber();
            }

            // Ctrl/Cmd + C to copy (when result is visible)
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && this.copyBtn.style.display !== 'none') {
                e.preventDefault();
                this.copyResult();
            }

            // Escape to clear
            if (e.key === 'Escape') {
                this.clearResult();
                this.numberInput.focus();
            }
        });
    }

    handleInput(e) {
        let value = e.target.value;

        // Remove any non-digit characters except commas
        value = value.replace(/[^\d,]/g, '');

        // Remove leading zeros
        value = value.replace(/^0+/, '') || '0';

        // Add commas for thousands separator
        if (value !== '0') {
            value = this.addCommas(value.replace(/,/g, ''));
        }

        e.target.value = value;

        // Update convert button state
        this.updateConvertButton();
    }

    handlePaste(e) {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const cleaned = paste.replace(/[^\d]/g, '');

        if (cleaned) {
            this.numberInput.value = this.addCommas(cleaned);
            this.updateConvertButton();
        }
    }

    addCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    removeCommas(num) {
        return num.replace(/,/g, '');
    }

    updateConvertButton() {
        const value = this.removeCommas(this.numberInput.value);
        const isValid = value && value !== '0' && /^\d+$/.test(value);

        this.convertBtn.disabled = !isValid;

        if (isValid) {
            this.convertBtn.classList.remove('disabled');
        } else {
            this.convertBtn.classList.add('disabled');
        }
    }

    async convertNumber() {
        const inputValue = this.numberInput.value.trim();

        if (!inputValue) {
            this.showError('تکایە ژمارەیەک بنووسە (Please enter a number)');
            return;
        }

        const cleanNumber = this.removeCommas(inputValue);

        if (!/^\d+$/.test(cleanNumber)) {
            this.showError('تەنها ژمارەی ئەرێنی دەکرێت (Only positive integers allowed)');
            return;
        }

        if (cleanNumber.length > 19) {
            this.showError('ژمارەکە زۆر گەورەیە - تا ١٠¹⁸ پشتگیری دەکرێت (Number too large - supports up to 10¹⁸)');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    number: cleanNumber
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showResult(data.kurdish_words);
                this.showSuccess('گۆڕینەکە سەرکەوتوو بوو! (Conversion successful!)');
            } else {
                this.showError(data.error || 'هەڵەیەک ڕوویدا (An error occurred)');
            }
        } catch (error) {
            console.error('Conversion error:', error);
            this.showError('هەڵەیەک لە پەیوەندیکردندا ڕوویدا (Connection error occurred)');
        } finally {
            this.hideLoading();
        }
    }

    showResult(kurdishWords) {
        // Clear placeholder
        this.outputBox.innerHTML = '';

        // Add result
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-text';
        resultDiv.textContent = kurdishWords;
        this.outputBox.appendChild(resultDiv);

        // Update styling
        this.outputBox.classList.add('has-result');

        // Show copy button
        this.copyBtn.style.display = 'flex';

        // Add animation
        resultDiv.style.animation = 'fadeInUp 0.5s ease-out';
    }

    clearResult() {
        this.outputBox.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-arrow-up"></i>
                ژمارەیەک بنووسە و دوگمەی گۆڕین لێبدە
            </div>
        `;
        this.outputBox.classList.remove('has-result');
        this.copyBtn.style.display = 'none';
        this.numberInput.value = '';
        this.updateConvertButton();
    }

    async copyResult() {
        const resultText = this.outputBox.querySelector('.result-text');
        if (!resultText) return;

        try {
            await navigator.clipboard.writeText(resultText.textContent);
            this.showSuccess('کۆپی کرا! (Copied!)');

            // Visual feedback
            this.copyBtn.style.animation = 'pulse 0.3s ease-out';
            setTimeout(() => {
                this.copyBtn.style.animation = '';
            }, 300);
        } catch (error) {
            console.error('Copy failed:', error);

            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = resultText.textContent;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                this.showSuccess('کۆپی کرا! (Copied!)');
            } catch (fallbackError) {
                this.showError('کۆپی نەکرا (Copy failed)');
            }

            document.body.removeChild(textArea);
        }
    }

    showLoading() {
        this.loadingOverlay.style.display = 'flex';
        this.convertBtn.disabled = true;
    }

    hideLoading() {
        this.loadingOverlay.style.display = 'none';
        this.updateConvertButton();
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorToast.style.display = 'flex';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideErrorToast();
        }, 5000);
    }

    hideErrorToast() {
        this.errorToast.style.display = 'none';
    }

    showSuccess(message) {
        this.successMessage.textContent = message;
        this.successToast.style.display = 'flex';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideSuccessToast();
        }, 3000);
    }

    hideSuccessToast() {
        this.successToast.style.display = 'none';
    }

}

// Initialize the converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KurdishConverter();
});
