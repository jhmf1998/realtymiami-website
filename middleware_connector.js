// Middleware connector for Tally-Zoho-WATI integration
// This file handles the connection between the landing page form and the middleware API

class MiddlewareConnector {
    constructor(apiEndpoint) {
        this.apiEndpoint = apiEndpoint || 'https://your-middleware-api.com/api/submit';
        this.isInitialized = false;
    }

    // Initialize the connector
    init() {
        if (this.isInitialized) return;
        
        // Load any required dependencies or configurations
        console.log('Middleware connector initialized');
        this.isInitialized = true;
    }

    // Send form data to middleware API
    async submitForm(formData) {
        if (!this.isInitialized) {
            this.init();
        }

        try {
            // Prepare data for middleware API
            const payload = {
                // Form data
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                communication_preference: formData.communication,
                message: formData.message || '',
                
                // Building information
                building: formData.building || '',
                address: formData.address || '',
                
                // Metadata
                source: 'landing_page',
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent
            };

            // Send data to middleware API
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Form submitted successfully:', result);
            return result;
        } catch (error) {
            console.error('Error submitting form:', error);
            throw error;
        }
    }

    // Send direct WhatsApp message
    async sendWhatsAppMessage(phone, message) {
        if (!this.isInitialized) {
            this.init();
        }

        try {
            const response = await fetch(`${this.apiEndpoint}/whatsapp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: phone,
                    message: message
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw error;
        }
    }
}

// Create and export a singleton instance
const middlewareConnector = new MiddlewareConnector();
export default middlewareConnector;
