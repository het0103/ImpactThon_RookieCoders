// Donor Dashboard JavaScript
class DonorApp {
    constructor() {
        this.donations = JSON.parse(localStorage.getItem('donations')) || [];
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.bindEvents();
        this.showPage('dashboard');
        this.updateDashboard();
    }

    bindEvents() {
        // Navigation events
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.showPage(page);
            }
        });

        // Form submission
        const donationForm = document.getElementById('donation-form');
        if (donationForm) {
            donationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitDonation();
            });
        }
    }

    showPage(pageName) {
        // Hide all sections
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`${pageName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentPage = pageName;

        // Load page-specific content
        if (pageName === 'dashboard') {
            this.updateDashboard();
        } else if (pageName === 'donations') {
            this.loadDonations();
        }
    }

    submitDonation() {
        const form = document.getElementById('donation-form');
        const formData = new FormData(form);
        
        const donation = {
            id: Date.now(),
            foodType: formData.get('food-type'),
            quantity: formData.get('quantity'),
            pickupTime: formData.get('pickup-time'),
            pickupLocation: formData.get('pickup-location'),
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        };

        this.donations.push(donation);
        localStorage.setItem('donations', JSON.stringify(this.donations));

        // Show success message
        this.showSuccessMessage('Donation submitted successfully!');
        
        // Reset form
        form.reset();
        
        // Update dashboard
        this.updateDashboard();
    }

    updateDashboard() {
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().getMonth();
        
        // Calculate statistics
        const todaysDonations = this.donations.filter(d => d.date === today).length;
        const monthlyDonations = this.donations.filter(d => {
            const donationMonth = new Date(d.date).getMonth();
            return donationMonth === currentMonth;
        }).length;
        const pendingPickups = this.donations.filter(d => d.status === 'pending').length;

        // Update dashboard cards
        this.updateCard('today-count', todaysDonations);
        this.updateCard('month-count', monthlyDonations);
        this.updateCard('pickup-count', pendingPickups);
    }

    updateCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    loadDonations() {
        const tbody = document.getElementById('donations-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.donations.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: #666;">
                        No donations found. <a href="#" class="nav-link" data-page="donate">Make your first donation</a>
                    </td>
                </tr>
            `;
            return;
        }

        this.donations.slice().reverse().forEach(donation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donation.foodType}</td>
                <td>${donation.quantity}</td>
                <td>${this.formatDate(donation.date)}</td>
                <td>${donation.pickupLocation}</td>
                <td>
                    <span class="status-badge status-${donation.status}">
                        ${donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    showSuccessMessage(message) {
        const successDiv = document.getElementById('success-message');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
            
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 3000);
        }
    }

    // Simulate pickup completion (for demo purposes)
    completePickup(donationId) {
        const donation = this.donations.find(d => d.id === donationId);
        if (donation) {
            donation.status = 'completed';
            localStorage.setItem('donations', JSON.stringify(this.donations));
            this.updateDashboard();
            if (this.currentPage === 'donations') {
                this.loadDonations();
            }
        }
    }

    // Generate dummy data for demo
    generateDummyData() {
        if (this.donations.length === 0) {
            const dummyDonations = [
                {
                    id: 1,
                    foodType: 'Cooked Rice',
                    quantity: '5 kg',
                    pickupTime: '18:00',
                    pickupLocation: 'Main Street Restaurant',
                    date: '2025-12-10',
                    status: 'completed'
                },
                {
                    id: 2,
                    foodType: 'Fresh Vegetables',
                    quantity: '3 kg',
                    pickupTime: '16:30',
                    pickupLocation: 'Green Market',
                    date: '2025-12-12',
                    status: 'completed'
                },
                {
                    id: 3,
                    foodType: 'Bread',
                    quantity: '20 pieces',
                    pickupTime: '20:00',
                    pickupLocation: 'City Bakery',
                    date: '2025-12-14',
                    status: 'pending'
                }
            ];

            this.donations = dummyDonations;
            localStorage.setItem('donations', JSON.stringify(this.donations));
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const app = new DonorApp();
    
    // Generate dummy data for demo (remove this in production)
    app.generateDummyData();
    app.updateDashboard();
});

// Utility functions for form validation
function validateDonationForm() {
    const form = document.getElementById('donation-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            field.style.borderColor = '#e1e8ed';
        }
    });

    return isValid;
}

// Auto-complete for pickup locations (dummy data)
const pickupLocations = [
    'Main Street Restaurant',
    'City Center Mall',
    'Green Market',
    'Downtown Bakery',
    'Community Kitchen',
    'Local Grocery Store',
    'University Cafeteria',
    'Office Complex Cafeteria'
];

function setupLocationAutocomplete() {
    const locationInput = document.getElementById('pickup-location');
    if (locationInput) {
        locationInput.addEventListener('input', function() {
            // Simple autocomplete implementation could go here
            console.log('Location input changed:', this.value);
        });
    }
}
