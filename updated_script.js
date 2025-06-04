// Main JavaScript for RealtyMiami landing page
// Handles form initialization, validation, and submission

// Constants
const API_ENDPOINT = 'https://your-middleware-api.com/api/submit';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('RealtyMiami landing page initialized');
    
    // Initialize form with URL parameters
    initializeFormFromUrl();
    
    // Add form submission handler
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', handleFormSubmit);
});

// Parse URL parameters and initialize form
function initializeFormFromUrl() {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const building = urlParams.get('building');
    const address = urlParams.get('address');
    
    // Set hidden form fields if parameters exist
    if (building) {
        document.getElementById('building').value = building;
        
        // Update page title with building name
        const buildingName = building.charAt(0).toUpperCase() + building.slice(1);
        document.getElementById('building-title').textContent = `Interested in ${buildingName}?`;
        document.title = `${buildingName} - RealtyMiami`;
    }
    
    if (address) {
        document.getElementById('address').value = address;
    }
    
    console.log('Form initialized with building:', building, 'address:', address);
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    try {
        // Prepare data for middleware
        const payload = {
            // Lead information
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            communication_preference: formData.get('communication'),
            message: formData.get('message') || '',
            
            // Building information from QR code
            building: formData.get('building') || '',
            address: formData.get('address') || '',
            
            // Metadata
            source: 'landing_page',
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
        };
        
        // Send data to middleware API
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        // Handle response
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Form submitted successfully:', result);
        
        // Show success message
        document.getElementById('contact-form').style.display = 'none';
        document.getElementById('success-message').style.display = 'block';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error submitting form:', error);
        
        // Show error message
        alert('There was a problem submitting your information. Please try again or contact us directly.');
        
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

// Validate form data
function validateForm(formData) {
    // Check name
    const name = formData.get('name');
    if (!name || name.trim() === '') {
        alert('Please enter your name');
        document.getElementById('name').focus();
        return false;
    }
    
    // Check email
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        alert('Please enter a valid email address');
        document.getElementById('email').focus();
        return false;
    }
    
    // Check phone
    const phone = formData.get('phone');
    if (!phone || phone.trim() === '') {
        alert('Please enter your phone number');
        document.getElementById('phone').focus();
        return false;
    }
    
    return true;
}
