// Parse URL parameters
function getUrlParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams) {
        params[key] = decodeURIComponent(value);
    }
    
    return params;
}

// Initialize form with building information from URL
function initializeForm() {
    const params = getUrlParams();
    
    // Set hidden form fields
    if (params.building) {
        document.getElementById('building').value = params.building;
        
        // Update the page title with building name
        const buildingName = params.building.charAt(0).toUpperCase() + params.building.slice(1);
        document.getElementById('building-title').textContent = `Interested in ${buildingName}?`;
        
        // Update page title
        document.title = `${buildingName} - RealtyMiami`;
    }
    
    if (params.address) {
        document.getElementById('address').value = params.address;
    }
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const formDataObj = {};
    
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    // Validate form
    if (!validateForm(formDataObj)) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Send data to backend API
    sendFormData(formDataObj)
        .then(response => {
            // Show success message
            document.getElementById('contact-form').style.display = 'none';
            document.getElementById('success-message').style.display = 'block';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(error => {
            // Show error and reset button
            alert('There was an error submitting your information. Please try again.');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            console.error('Form submission error:', error);
        });
}

// Validate form data
function validateForm(data) {
    // Check name
    if (!data.name || data.name.trim() === '') {
        alert('Please enter your name');
        return false;
    }
    
    // Check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Check phone
    if (!data.phone || data.phone.trim() === '') {
        alert('Please enter your phone number');
        return false;
    }
    
    return true;
}

// Send form data to backend API
async function sendFormData(data) {
    // Replace with your actual API endpoint
    const apiUrl = 'https://your-middleware-api.com/submit';
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form with URL parameters
    initializeForm();
    
    // Add form submission handler
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', handleFormSubmit);
});
