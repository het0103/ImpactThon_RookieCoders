document.addEventListener('DOMContentLoaded', () => {
    const pickupForm = document.getElementById('pickupForm');

    pickupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        schedulePickup();
    });
});

function schedulePickup() {
    const formData = {
        id: Date.now(),
        donorName: document.getElementById('donorName').value,
        address: document.getElementById('pickupAddress').value,
        dateTime: document.getElementById('pickupDate').value,
        foodType: document.getElementById('foodType').value,
        quantity: parseInt(document.getElementById('quantity').value),
        status: 'pending',
        urgency: 'normal'
    };

    // Get current dashboard data
    let data = JSON.parse(localStorage.getItem('ngoDashboardData'));

    // Safety check if dashboard data doesn't exist
    if (!data) {
        data = {
            stats: { totalDonations: 0, pendingPickups: 0, activeDonors: 0, completedPickups: 0 },
            activities: [],
            alerts: [],
            pickups: []
        };
    }

    // 1. Add to pickups array
    if (!data.pickups) data.pickups = [];
    data.pickups.push(formData);

    // 2. Update stats
    if (!data.stats) data.stats = { pendingPickups: 0 };
    data.stats.pendingPickups++;

    // 3. Add to activities
    if (!data.activities) data.activities = [];
    data.activities.unshift({
        id: Date.now(),
        type: 'pickup',
        title: 'New pickup scheduled',
        description: `Pickup scheduled for ${formData.donorName}`,
        time: 'Just now',
        icon: 'calendar-plus'
    });

    // Limit activities size
    if (data.activities.length > 20) {
        data.activities = data.activities.slice(0, 20);
    }

    // Save back to localStorage
    localStorage.setItem('ngoDashboardData', JSON.stringify(data));

    // 4. Redirect back to Dashboard
    alert('Pickup scheduled successfully!');
    window.location.href = 'ngo_dashboard.html';
}
