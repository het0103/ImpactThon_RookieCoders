// Anonymous Donation JavaScript
class AnonymousDonationApp {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Form submission
        const donationForm = document.getElementById('anonymous-donation-form');
        if (donationForm) {
            donationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitAnonymousDonation();
            });
        }
    }

    submitAnonymousDonation() {
        const formData = new FormData(document.getElementById('anonymous-donation-form'));

        // Get form values
        const ngo = formData.get('ngo-select');
        const foodType = formData.get('food-type');
        const quantity = formData.get('quantity');
        const pickupTime = formData.get('pickup-time');
        const pickupLocation = formData.get('pickup-location');
        const contactInfo = formData.get('contact-info');

        // Create donation object
        const donation = {
            id: Date.now(),
            ngo: ngo,
            foodType: foodType,
            quantity: quantity,
            pickupTime: pickupTime,
            pickupLocation: pickupLocation,
            contactInfo: contactInfo || 'Anonymous',
            date: new Date().toISOString(),
            status: 'Pending',
            type: 'anonymous'
        };

        // Get existing donations from localStorage
        let donations = JSON.parse(localStorage.getItem('donations')) || [];

        // Add new donation
        donations.push(donation);

        // Save back to localStorage
        localStorage.setItem('donations', JSON.stringify(donations));

        // Show success message
        this.showSuccessMessage('Thank you for your anonymous donation! An NGO representative will contact you shortly for pickup arrangements.');

        // Reset form
        document.getElementById('anonymous-donation-form').reset();
    }

    showSuccessMessage(message) {
        const successDiv = document.getElementById('success-message');
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        successDiv.style.backgroundColor = '#d4edda';
        successDiv.style.color = '#155724';
        successDiv.style.padding = '15px';
        successDiv.style.border = '1px solid #c3e6cb';
        successDiv.style.borderRadius = '5px';
        successDiv.style.margin = '20px 0';

        // Hide after 5 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnonymousDonationApp();
});