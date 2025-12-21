// Donation Needs Page JavaScript
class DonationNeedsApp {
    constructor() {
        this.requests = [];
        this.filteredRequests = [];
        this.currentRequestId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadRequests();
        this.displayRequests();
    }

    bindEvents() {
        // Filter events
        const urgencyFilter = document.getElementById('urgency-filter');
        const searchInput = document.getElementById('search-items');

        if (urgencyFilter) {
            urgencyFilter.addEventListener('change', () => {
                this.filterRequests();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterRequests();
            });
        }

        // Donation form
        const donationForm = document.getElementById('quick-donation-form');
        if (donationForm) {
            donationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitDonation();
            });
        }
    }

    loadRequests() {
        this.requests = JSON.parse(localStorage.getItem('ngoRequests')) || [];
        this.filteredRequests = [...this.requests];
    }

    filterRequests() {
        const urgencyFilter = document.getElementById('urgency-filter').value;
        const searchTerm = document.getElementById('search-items').value.toLowerCase();

        this.filteredRequests = this.requests.filter(request => {
            // Urgency filter
            if (urgencyFilter !== 'all' && request.urgency !== urgencyFilter) {
                return false;
            }

            // Search filter
            if (searchTerm) {
                const itemsMatch = request.items.toLowerCase().includes(searchTerm);
                const quantityMatch = request.quantity.toLowerCase().includes(searchTerm);
                const notesMatch = request.notes && request.notes.toLowerCase().includes(searchTerm);

                if (!itemsMatch && !quantityMatch && !notesMatch) {
                    return false;
                }
            }

            return true;
        });

        this.displayRequests();
    }

    displayRequests() {
        const grid = document.getElementById('needs-grid');

        if (this.filteredRequests.length === 0) {
            grid.innerHTML = `
                <div class="no-requests">
                    <h3>No donation requests available</h3>
                    <p>Check back later for new requests from NGOs in need.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredRequests.map(request => this.createRequestCard(request)).join('');
    }

    createRequestCard(request) {
        const urgencyClass = request.urgency || 'normal';
        const urgencyLabel = request.urgency ? request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1) : 'Normal';

        return `
            <div class="request-card" data-id="${request.id}">
                <div class="request-header">
                    <div class="urgency-badge ${urgencyClass}">${urgencyLabel}</div>
                    <div class="request-date">${this.formatDate(request.date)}</div>
                </div>
                <div class="request-content">
                    <h3>Items Needed</h3>
                    <p class="items">${request.items}</p>
                    <h4>Quantity Required</h4>
                    <p class="quantity">${request.quantity}</p>
                    ${request.notes ? `
                        <h4>Additional Notes</h4>
                        <p class="notes">${request.notes}</p>
                    ` : ''}
                </div>
                <div class="request-actions">
                    <button class="btn btn-donate" onclick="openDonationModal(${request.id})">
                        Donate Now
                    </button>
                </div>
            </div>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    openDonationModal(requestId) {
        this.currentRequestId = requestId;
        const request = this.requests.find(r => r.id === requestId);

        if (!request) return;

        const detailsDiv = document.getElementById('request-details');
        detailsDiv.innerHTML = `
            <div class="request-summary">
                <h3>Donating to: NGO Request</h3>
                <p><strong>Items:</strong> ${request.items}</p>
                <p><strong>Quantity Needed:</strong> ${request.quantity}</p>
                <p><strong>Urgency:</strong> ${request.urgency || 'Normal'}</p>
            </div>
        `;

        document.getElementById('donationModal').style.display = 'flex';
    }

    closeDonationModal() {
        document.getElementById('donationModal').style.display = 'none';
        document.getElementById('quick-donation-form').reset();
        this.currentRequestId = null;
    }

    submitDonation() {
        const formData = new FormData(document.getElementById('quick-donation-form'));

        const donation = {
            id: Date.now(),
            requestId: this.currentRequestId,
            quantity: formData.get('donate-quantity'),
            pickupTime: formData.get('donate-pickup-time'),
            pickupLocation: formData.get('donate-pickup-location'),
            contactInfo: formData.get('donate-contact') || 'Anonymous',
            date: new Date().toISOString(),
            status: 'Pending',
            type: 'request-response'
        };

        // Get existing donations from localStorage
        let donations = JSON.parse(localStorage.getItem('donations')) || [];

        // Add new donation
        donations.push(donation);

        // Save back to localStorage
        localStorage.setItem('donations', JSON.stringify(donations));

        // Redirect to pickup page
        window.location.href = `pickup.html?id=${donation.id}`;

        // Close modal (though redirect will happen first)
        this.closeDonationModal();
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

// Global functions
function openDonationModal(requestId) {
    if (window.donationNeedsApp) {
        window.donationNeedsApp.openDonationModal(requestId);
    }
}

function closeDonationModal() {
    if (window.donationNeedsApp) {
        window.donationNeedsApp.closeDonationModal();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.donationNeedsApp = new DonationNeedsApp();
});