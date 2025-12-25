// NGO and Driver Database - Dynamic assignment based on donation
const ngoDatabase = [
    {
        id: 1,
        name: "Helping Hands NGO",
        contact: "+91-9876543210",
        address: "123 Community Street, Downtown",
        hotline: "1800-HELP-123",
        drivers: [
            {
                name: "Rajesh Kumar",
                phone: "+91-9876543211",
                rating: 4.8,
                vehicle: "Tata Ace Mini Truck",
                license: "MH-12-AB-1234",
                photo: "👨"
            },
            {
                name: "Priya Sharma",
                phone: "+91-9876543212",
                rating: 4.9,
                vehicle: "Mahindra Pickup",
                license: "MH-12-CD-5678",
                photo: "👩"
            }
        ]
    },
    {
        id: 2,
        name: "Food for All Foundation",
        contact: "+91-9876543220",
        address: "456 Welfare Road, Midtown",
        hotline: "1800-FOOD-456",
        drivers: [
            {
                name: "Amit Singh",
                phone: "+91-9876543221",
                rating: 4.7,
                vehicle: "Ashok Leyland Dost",
                license: "MH-13-EF-9012",
                photo: "👨"
            },
            {
                name: "Sunita Patel",
                phone: "+91-9876543222",
                rating: 4.6,
                vehicle: "Force Tempo Traveller",
                license: "MH-13-GH-3456",
                photo: "👩"
            }
        ]
    },
    {
        id: 3,
        name: "Community Care Network",
        contact: "+91-9876543230",
        address: "789 Service Lane, Uptown",
        hotline: "1800-CARE-789",
        drivers: [
            {
                name: "Vikram Rao",
                phone: "+91-9876543231",
                rating: 4.9,
                vehicle: "Bharat Benz 1015",
                license: "MH-14-IJ-7890",
                photo: "👨"
            },
            {
                name: "Meera Joshi",
                phone: "+91-9876543232",
                rating: 4.8,
                vehicle: "Eicher Pro 2049",
                license: "MH-14-KL-1234",
                photo: "👩"
            }
        ]
    }
];

// Get donation ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const donationId = parseInt(urlParams.get('id'));

// Load donation data and populate page
function loadPickupDetails() {
    const donations = JSON.parse(localStorage.getItem('donations')) || [];

    // Find the specific donation
    const donation = donations.find(d => d.id === donationId);

    if (!donation) {
        showError('Donation not found');
        return;
    }

    // Assign NGO and driver based on donation ID (for demo purposes)
    const ngoIndex = donationId % ngoDatabase.length;
    const ngo = ngoDatabase[ngoIndex];

    const driverIndex = Math.floor(donationId / 100) % ngo.drivers.length;
    const driver = ngo.drivers[driverIndex];

    // Populate order information
    document.getElementById('orderId').textContent = donation.id;
    document.getElementById('foodType').textContent = donation.foodType;
    document.getElementById('quantity').textContent = donation.quantity;
    document.getElementById('location').textContent = donation.pickupLocation;
    document.getElementById('pickupTime').textContent = formatTime(donation.pickupTime);

    // Dynamic Title based on Order Type
    const headerTitle = document.querySelector('.pickup-header h1');
    const headerSubtitle = document.querySelector('.pickup-header p');

    if (donation.type === 'anonymous') {
        headerTitle.textContent = 'Anonymous Donation Pickup';
        headerSubtitle.textContent = 'Thank you for your generous anonymous contribution!';
    } else if (donation.type === 'request-response') {
        headerTitle.textContent = 'Request Fulfillment Pickup';
        headerSubtitle.textContent = 'Fulfilling an NGO request via NourishNet';
    } else {
        headerTitle.textContent = 'Standard Donation Pickup';
        headerSubtitle.textContent = 'Track your food donation pickup';
    }

    // Set status with appropriate styling
    const statusElement = document.getElementById('status');
    statusElement.textContent = donation.status.charAt(0).toUpperCase() + donation.status.slice(1);
    statusElement.className = `status-badge status-${donation.status}`;

    // Populate NGO information
    document.getElementById('ngoName').textContent = ngo.name;
    document.getElementById('ngoContact').textContent = ngo.contact;
    document.getElementById('ngoAddress').textContent = ngo.address;
    document.getElementById('ngoHotline').textContent = ngo.hotline;

    // Populate driver information
    document.getElementById('driverPhoto').textContent = driver.photo;
    document.getElementById('driverName').textContent = driver.name;
    document.getElementById('driverPhone').textContent = driver.phone;
    document.getElementById('driverRating').textContent = '⭐'.repeat(Math.floor(driver.rating)) + (driver.rating % 1 ? '⭐' : '');
    document.getElementById('vehicleType').textContent = driver.vehicle;
    document.getElementById('licensePlate').textContent = driver.license;
    document.getElementById('driverDirect').textContent = driver.phone;

    // Removing button state update logic since button is gone
}

function formatTime(timeString) {
    if (!timeString) return 'Not specified';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function showError(message) {
    document.querySelector('.pickup-content').innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <h3 style="color: var(--danger);">Error</h3>
            <p>${message}</p>
            <a href="/ngo_dashboard" class="btn">Back to Dashboard</a>
        </div>
    `;
}

// Event listeners
// Confirm Pickup button listener removed

document.getElementById('contactDriverBtn').addEventListener('click', function () {
    const driverPhone = document.getElementById('driverPhone').textContent;
    window.location.href = `tel:${driverPhone}`;
});

// Update NGO Dashboard - Removed here as it was triggered by the button
// Status updates should now ideally come from the Driver/NGO side (simulated elsewhere or auto-updated)

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    if (!donationId) {
        showError('No donation ID provided');
        return;
    }

    loadPickupDetails();
});