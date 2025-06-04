// Integration module for connecting landing page with Tally-Zoho-WATI middleware
// This file handles the integration between the form and the backend services

// Import configuration
// Note: In production, use proper import statements with bundling
// For GitHub Pages deployment, we're using global variables instead

// Middleware API endpoint - replace with your actual endpoint
const API_ENDPOINT = 'https://your-middleware-api.com/api/submit';

// Form submission handler with middleware integration
async function submitFormToMiddleware(formData) {
    // Show loading indicator
    const submitButton = document.querySelector('.submit-btn');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;
    
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
        
        console.log('Submitting form data:', payload);
        
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
            const errorText = await response.text();
            throw new Error(`API error (${response.status}): ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Form submitted successfully:', result);
        
        // Show success message
        document.getElementById('contact-form').style.display = 'none';
        document.getElementById('success-message').style.display = 'block';
        
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        return result;
    } catch (error) {
        console.error('Error submitting form:', error);
        
        // Reset button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        
        // Show error message
        alert('There was a problem submitting your information. Please try again or contact us directly.');
        
        throw error;
    }
}

// Initialize integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing RealtyMiami form integration');
    
    // Get the form element
    const form = document.getElementById('contact-form');
    
    // Add submit event listener
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        
        // Submit form data to middleware
        try {
            await submitFormToMiddleware(formData);
        } catch (error) {
            console.error('Form submission failed:', error);
        }
    });
    
    // Initialize form with URL parameters
    initializeFormFromUrl();
});

// Initialize form with building information from URL
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
