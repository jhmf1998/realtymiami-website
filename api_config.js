// API Configuration for RealtyMiami Landing Page
// This file contains the configuration for connecting to the middleware API

const API_CONFIG = {
    // Base URL for the middleware API
    BASE_URL: 'https://your-middleware-api.com',
    
    // Endpoints
    ENDPOINTS: {
        FORM_SUBMIT: '/api/submit',
        WHATSAPP_MESSAGE: '/api/whatsapp',
        VERIFY_EMAIL: '/api/verify-email',
        VERIFY_PHONE: '/api/verify-phone'
    },
    
    // API version
    API_VERSION: 'v1',
    
    // Timeout in milliseconds
    TIMEOUT: 10000,
    
    // Retry configuration
    RETRY: {
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000
    }
};

// Function to get the full API URL for an endpoint
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}/${API_CONFIG.API_VERSION}${endpoint}`;
}

// Function to handle API errors
function handleApiError(error) {
    console.error('API Error:', error);
    
    // Determine error type and return appropriate message
    if (error.status === 401) {
        return 'Authentication error. Please contact support.';
    } else if (error.status === 400) {
        return 'Invalid form data. Please check your information and try again.';
    } else if (error.status === 429) {
        return 'Too many requests. Please try again later.';
    } else if (error.status >= 500) {
        return 'Server error. Please try again later or contact support.';
    } else {
        return 'An unexpected error occurred. Please try again or contact support.';
    }
}

// Export configuration and helper functions
export { API_CONFIG, getApiUrl, handleApiError };
