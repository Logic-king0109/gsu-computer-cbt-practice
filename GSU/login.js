// Login form with complete validation, Netlify submission, and loading
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const usernameInput = document.getElementById('username');
    const pinInput = document.querySelector('input[name="password"]');
    const submitBtn = document.getElementById('submit');
    
    // Fix PIN input to be password type and limit to 4 digits
    if(pinInput) {
        pinInput.type = 'password';
        pinInput.placeholder = ' last four digits....';
        
        // Limit to 4 digits only
        pinInput.addEventListener('input', function(e) {
            // Remove any non-digit characters
            this.value = this.value.replace(/\D/g, '');
            
            // Limit to 4 digits
            if (this.value.length > 4) {
                this.value = this.value.slice(0, 4);
            }
        });
    }
    
    // Extract last 4 digits from username
    function getLastFourDigits(username) {
        // Remove all non-digit characters
        const digits = username.replace(/\D/g, '');
        // Get last 4 digits
        return digits.slice(-4);
    }
    
    // Loading animation function
    function showLoadingAnimation() {
        if(submitBtn) {
            submitBtn.disabled = true;
            submitBtn.value = 'Logging in...';
            submitBtn.style.opacity = '0.8';
            submitBtn.style.cursor = 'not-allowed';
        }
    }
    
    // Hide loading animation function  
    function hideLoadingAnimation() {
        if(submitBtn) {
            submitBtn.disabled = false;
            submitBtn.value = 'get started';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
    }
    
    // Form submission handler
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop default form submission
            
            // Get form values
            const username = usernameInput.value.trim();
            const pin = pinInput.value;
            
            // Validate both fields are filled
            if (!username) {
                alert('Please enter your registration number');
                return;
            }
            
            if (!pin) {
                alert('Please enter your PIN');
                return;
            }
            
            // Validate PIN is exactly 4 digits
            if (pin.length !== 4) {
                alert('PIN must be exactly 4 digits');
                return;
            }
            
            // Extract last 4 digits from username
            const lastFourDigits = getLastFourDigits(username);
            
            // Check if username has at least 4 digits
            if (lastFourDigits.length < 4) {
                alert('enter your registration number (e.g., UG24/MHND/1052)');
                return;
            }
            
            // Validate PIN matches last 4 digits of username
            if (pin !== lastFourDigits) {
                alert(`PIN must match last 4 digits of username. Your PIN should be: ${lastFourDigits}`);
                return;
            }
            
            // Show loading animation
            showLoadingAnimation();
            
            // Submit to Netlify first, then redirect
            submitToNetlify(username, pin);
        });
    }
    
    // Netlify submission function
    function submitToNetlify(username, pin) {
        // Create form data for Netlify
        const formData = new FormData();
        formData.append('form-name', 'login');
        formData.append('username', username);
        formData.append('pin', pin);
        formData.append('timestamp', new Date().toISOString());
        
        // Submit to Netlify
        fetch('/', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Form submission attempted');
            
            // Always redirect after 2 seconds (whether Netlify works or not)
            setTimeout(() => {
window.location.href = 'real.html';
            }, 2000);
        })
        .catch(error => {
            console.error('Netlify submission error:', error);
            
            // Still redirect even if Netlify fails
            setTimeout(() => {
                window.location.href = 'real.html';
            }, 2000);
        });
    }
});