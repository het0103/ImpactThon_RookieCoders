document.addEventListener('DOMContentLoaded', () => {
    const requestForm = document.getElementById('requestForm');

    requestForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitRequest();
    });
});

function submitRequest() {
    const items = document.getElementById('requestItems').value;
    const quantity = document.getElementById('requestQuantity').value;
    const urgency = document.getElementById('urgency').value;
    const notes = document.getElementById('additionalNotes').value;

    const newRequest = {
        id: Date.now(),
        items: items,
        quantity: quantity,
        urgency: urgency,
        notes: notes,
        date: new Date().toISOString(),
        status: 'active'
    };

    // 1. Save to ngoRequests (for Donation Needs page)
    let requests = JSON.parse(localStorage.getItem('ngoRequests')) || [];
    requests.push(newRequest);
    localStorage.setItem('ngoRequests', JSON.stringify(requests));

    // 2. Add to Dashboard Activities (ngoDashboardData)
    // We update this so the dashboard shows "Donation request posted" in Recent Activity
    let dashboardData = JSON.parse(localStorage.getItem('ngoDashboardData'));

    // Safety check if dashboard data doesn't exist yet
    if (!dashboardData) {
        dashboardData = {
            stats: { totalDonations: 0, pendingPickups: 0, activeDonors: 0, completedPickups: 0 },
            activities: [],
            alerts: [],
            pickups: []
        };
    }

    const activity = {
        id: Date.now(),
        type: 'request',
        title: 'Donation request posted',
        description: `Request for ${items} (${quantity})`,
        time: 'Just now',
        icon: 'hand-holding-heart'
    };

    dashboardData.activities.unshift(activity);

    // Keep activity list at reasonable size (e.g., max 20)
    if (dashboardData.activities.length > 20) {
        dashboardData.activities = dashboardData.activities.slice(0, 20);
    }

    localStorage.setItem('ngoDashboardData', JSON.stringify(dashboardData));

    // 3. Redirect back to Dashboard
    alert('Donation request posted successfully!');
    window.location.href = '/ngo_dashboard';
}
