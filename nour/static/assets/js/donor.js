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

        // Subscription duration buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.duration-btn')) {
                const frequency = e.target.dataset.frequency;
                const duration = e.target.dataset.duration;
                this.showSubscriptionForm(frequency, duration);
            }
        });

        // Subscription form
        const subscriptionForm = document.getElementById('subscription-form');
        if (subscriptionForm) {
            subscriptionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitSubscription();
            });
        }

        // Cancel subscription
        const cancelBtn = document.getElementById('cancel-subscription');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideSubscriptionForm();
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

        // Update NGO Dashboard data
        this.updateNGODashboard(donation);

        // Show success message
        this.showSuccessMessage('Donation submitted successfully!');

        // Reset form
        form.reset();

        // Update dashboard
        this.updateDashboard();
    }

    showSubscriptionForm(frequency, duration) {
        document.getElementById('subscription-setup').style.display = 'block';
        document.getElementById('sub-frequency').value = frequency;
        document.getElementById('sub-duration').value = duration === '1' ? '1 Month' : '1 Year';

        // Set minimum start date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('sub-start-date').min = tomorrow.toISOString().split('T')[0];
        document.getElementById('sub-start-date').value = tomorrow.toISOString().split('T')[0];
    }

    hideSubscriptionForm() {
        document.getElementById('subscription-setup').style.display = 'none';
        document.getElementById('subscription-form').reset();
    }

    submitSubscription() {
        const form = document.getElementById('subscription-form');
        const formData = new FormData(form);

        const subscription = {
            id: Date.now(),
            foodType: formData.get('sub-food-type'),
            quantity: formData.get('sub-quantity'),
            ngo: formData.get('sub-ngo') || 'Any NGO',
            pickupLocation: formData.get('sub-pickup-location'),
            frequency: formData.get('sub-frequency'),
            duration: formData.get('sub-duration'),
            startDate: formData.get('sub-start-date'),
            status: 'active',
            createdDate: new Date().toISOString()
        };

        // Get existing subscriptions or create new array
        let subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
        subscriptions.push(subscription);
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));

        // Show success message
        this.showSuccessMessage(`Subscription created successfully! You'll donate ${subscription.frequency} for ${subscription.duration}.`);

        // Hide form
        this.hideSubscriptionForm();
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
                    <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
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
                <td>
                    <button class="pickup-info-btn" onclick="window.open('/pickup.html', '_self')" fdprocessedid="0n44nj">View Info</button>
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

            // Update NGO Dashboard when pickup is completed
            this.updateNGOPickupStatus(donationId, 'confirmed');

            this.updateDashboard();
            if (this.currentPage === 'donations') {
                this.loadDonations();
            }
        }
    }

    // Update NGO Dashboard data when donation is made
    updateNGODashboard(donation) {
        let ngoData = JSON.parse(localStorage.getItem('ngoDashboardData'));

        // Initialize NGO data if it doesn't exist
        if (!ngoData) {
            ngoData = {
                stats: {
                    totalDonations: 0,
                    pendingPickups: 0,
                    activeDonors: 0,
                    completedPickups: 0
                },
                activities: [],
                alerts: [],
                pickups: []
            };
        }

        // Update stats
        ngoData.stats.totalDonations += 1;
        ngoData.stats.pendingPickups += 1;

        // Add to activities
        const activity = {
            id: Date.now(),
            type: 'donation',
            title: 'New donation received',
            description: `${donation.foodType} - ${donation.quantity} from ${donation.pickupLocation}`,
            time: 'Just now',
            icon: 'utensils'
        };
        ngoData.activities.unshift(activity);

        // Create pickup entry for NGO dashboard
        const pickupDateTime = `${donation.date}T${donation.pickupTime}`;
        const pickupEntry = {
            id: donation.id,
            donorName: donation.pickupLocation, // Using location as donor name for demo
            address: donation.pickupLocation,
            dateTime: pickupDateTime,
            foodType: donation.foodType,
            quantity: this.parseQuantity(donation.quantity),
            status: 'pending',
            urgency: 'normal'
        };
        ngoData.pickups.push(pickupEntry);

        // Save updated NGO data
        localStorage.setItem('ngoDashboardData', JSON.stringify(ngoData));
    }

    // Update NGO Dashboard when pickup status changes
    updateNGOPickupStatus(donationId, status) {
        let ngoData = JSON.parse(localStorage.getItem('ngoDashboardData'));
        if (!ngoData) return;

        const pickup = ngoData.pickups.find(p => p.id === donationId);
        if (pickup) {
            pickup.status = status;

            // Update stats
            if (status === 'confirmed') {
                ngoData.stats.pendingPickups -= 1;
                ngoData.stats.completedPickups += 1;

                // Add completion activity
                const activity = {
                    id: Date.now(),
                    type: 'pickup',
                    title: 'Pickup completed',
                    description: `Pickup completed for ${pickup.donorName}`,
                    time: 'Just now',
                    icon: 'check-circle'
                };
                ngoData.activities.unshift(activity);
            }

            localStorage.setItem('ngoDashboardData', JSON.stringify(ngoData));
        }
    }

    // Parse quantity string to number for NGO dashboard
    parseQuantity(quantityString) {
        const match = quantityString.match(/(\d+)/);
        return match ? parseInt(match[1]) : 1;
    }
}

    // Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const app = new DonorApp();

    // Generate dummy data for demo (remove this in production)
    // app.generateDummyData(); // Commented out as method doesn't exist
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
    const locationInput = document.getElementById('pickuplocation');
    if (locationInput) {
        locationInput.addEventListener('input', function () {
            // Simple autocomplete implementation could go here
            console.log('Location input changed:', this.value);
        });
    }
}
