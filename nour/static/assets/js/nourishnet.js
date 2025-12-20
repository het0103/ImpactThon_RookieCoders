// =====================================
// NGO DASHBOARD JAVASCRIPT
// =====================================

class NGODashboard {
    constructor() {
        this.currentTime = document.getElementById('currentTime');
        this.currentDate = document.getElementById('currentDate');
        this.activityList = document.getElementById('activityList');
        this.alertsList = document.getElementById('alertsList');
        this.pickupsGrid = document.getElementById('pickupsGrid');
        this.alertCount = document.getElementById('alertCount');

        // Stats elements
        this.stats = {
            totalDonations: document.getElementById('totalDonations'),
            pendingPickups: document.getElementById('pendingPickups'),
            activeDonors: document.getElementById('activeDonors'),
            completedPickups: document.getElementById('completedPickups')
        };

        this.init();
    }

    init() {
        this.startClock();
        this.loadDashboardData();
        this.setupEventListeners();
        this.initializeDemoData();
        this.startRealTimeUpdates();
    }

    // =====================================
    // CLOCK & TIME MANAGEMENT
    // =====================================
    startClock() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const dateString = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if (this.currentTime) this.currentTime.textContent = timeString;
            if (this.currentDate) this.currentDate.textContent = dateString;
        };

        updateTime();
        setInterval(updateTime, 1000);
    }

    // =====================================
    // DATA MANAGEMENT
    // =====================================
    initializeDemoData() {
        let data = JSON.parse(localStorage.getItem('ngoDashboardData'));

        if (!data) {
            data = {
                stats: {
                    totalDonations: 1247,
                    pendingPickups: 8,
                    activeDonors: 156,
                    completedPickups: 23
                },
                activities: [
                    {
                        id: 1,
                        type: 'donation',
                        title: 'New donation received',
                        description: 'John Doe donated 50 meals',
                        time: '2 minutes ago',
                        icon: 'utensils'
                    },
                    {
                        id: 2,
                        type: 'pickup',
                        title: 'Pickup scheduled',
                        description: 'Pickup scheduled for Sarah Johnson',
                        time: '15 minutes ago',
                        icon: 'truck'
                    },
                    {
                        id: 3,
                        type: 'alert',
                        title: 'Urgent pickup needed',
                        description: 'Perishable food needs immediate pickup',
                        time: '1 hour ago',
                        icon: 'exclamation-triangle'
                    }
                ],
                alerts: [
                    {
                        id: 1,
                        type: 'urgent',
                        title: 'Temperature Alert',
                        description: 'Food storage temperature above safe limit at Downtown Center',
                        time: '30 minutes ago'
                    },
                    {
                        id: 2,
                        type: 'info',
                        title: 'New Donor Registration',
                        description: 'Restaurant ABC has joined the network',
                        time: '2 hours ago'
                    }
                ],
                pickups: []
            };
        }

        // Ensure demo pickups exist
        if (!data.pickups || data.pickups.length === 0) {
            data.pickups = [
                {
                    id: 1,
                    donorName: 'Maria Garcia',
                    address: '123 Main St, Downtown',
                    dateTime: '2025-12-20T14:00',
                    foodType: 'Cooked Food',
                    quantity: 75,
                    status: 'pending',
                    urgency: 'normal'
                },
                {
                    id: 2,
                    donorName: 'Tech Corp Cafeteria',
                    address: '456 Business Ave, Midtown',
                    dateTime: '2025-12-20T16:30',
                    foodType: 'Canned Goods',
                    quantity: 200,
                    status: 'pending',
                    urgency: 'urgent'
                },
                {
                    id: 3,
                    donorName: 'Green Restaurant',
                    address: '789 Oak St, Uptown',
                    dateTime: '2025-12-21T11:00',
                    foodType: 'Fresh Produce',
                    quantity: 120,
                    status: 'pending',
                    urgency: 'normal'
                }
            ];
            data.stats.pendingPickups = 3;
        }

        localStorage.setItem('ngoDashboardData', JSON.stringify(data));
    }

    loadDashboardData() {
        const data = JSON.parse(localStorage.getItem('ngoDashboardData'));
        if (data) {
            this.updateStats(data.stats);
            this.renderActivities(data.activities);
            this.renderAlerts(data.alerts);
            this.renderPickups(data.pickups);
        }

        // Sync with donor data
        this.syncWithDonorData();
    }

    updateStats(stats) {
        Object.keys(stats).forEach(key => {
            if (this.stats[key]) {
                this.animateNumber(this.stats[key], 0, stats[key], 1000);
            }
        });
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // =====================================
    // ACTIVITY MANAGEMENT
    // =====================================
    renderActivities(activities) {
        this.activityList.innerHTML = '';
        activities.forEach(activity => {
            const activityElement = this.createActivityElement(activity);
            this.activityList.appendChild(activityElement);
        });
    }

    createActivityElement(activity) {
        const div = document.createElement('div');
        div.className = 'activity-item';
        div.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">${activity.time}</div>
        `;
        return div;
    }

    // =====================================
    // ALERTS MANAGEMENT
    // =====================================
    renderAlerts(alerts) {
        this.alertsList.innerHTML = '';
        this.alertCount.textContent = alerts.length;

        alerts.forEach(alert => {
            const alertElement = this.createAlertElement(alert);
            this.alertsList.appendChild(alertElement);
        });
    }

    createAlertElement(alert) {
        const div = document.createElement('div');
        div.className = `alert-item ${alert.type}`;
        div.innerHTML = `
            <div class="alert-content">
                <h4>${alert.title}</h4>
                <p>${alert.description}</p>
                <small>${alert.time}</small>
            </div>
        `;
        return div;
    }

    // =====================================
    // PICKUPS MANAGEMENT
    // =====================================
    renderPickups(pickups) {
        this.pickupsGrid.innerHTML = '';
        if (pickups && pickups.length > 0) {
            pickups.forEach(pickup => {
                const pickupElement = this.createPickupElement(pickup);
                this.pickupsGrid.appendChild(pickupElement);
            });
        } else {
            // Add a message when no pickups
            this.pickupsGrid.innerHTML = '<div class="no-pickups">No pending pickups at this time.</div>';
        }
    }

    createPickupElement(pickup) {
        const date = new Date(pickup.dateTime);
        const timeString = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const dateString = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        const div = document.createElement('div');
        div.className = 'pickup-card';
        div.innerHTML = `
            <div class="pickup-header">
                <div class="pickup-title">${pickup.donorName}</div>
                <div class="pickup-status ${pickup.status} ${pickup.urgency}">${pickup.urgency}</div>
            </div>
            <div class="pickup-details">
                <div class="pickup-detail">
                    <span><i class="fas fa-map-marker-alt"></i> Address</span>
                    <strong>${pickup.address}</strong>
                </div>
                <div class="pickup-detail">
                    <span><i class="fas fa-clock"></i> Time</span>
                    <strong>${dateString} at ${timeString}</strong>
                </div>
                <div class="pickup-detail">
                    <span><i class="fas fa-utensils"></i> Food Type</span>
                    <strong>${pickup.foodType}</strong>
                </div>
                <div class="pickup-detail">
                    <span><i class="fas fa-users"></i> Quantity</span>
                    <strong>${pickup.quantity} servings</strong>
                </div>
            </div>
            <div class="pickup-actions">
            </div>
        `;

        // Create buttons and add event listeners
        const actionsDiv = div.querySelector('.pickup-actions');

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'btn btn-success';
        confirmBtn.innerHTML = '<i class="fas fa-check"></i> Confirm';
        confirmBtn.addEventListener('click', () => this.confirmPickup(pickup.id));
        actionsDiv.appendChild(confirmBtn);

        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'btn btn-secondary';
        detailsBtn.innerHTML = '<i class="fas fa-eye"></i> Details';
        detailsBtn.addEventListener('click', () => this.viewPickupDetails(pickup.id));
        actionsDiv.appendChild(detailsBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-danger';
        cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
        cancelBtn.addEventListener('click', () => this.cancelPickup(pickup.id));
        actionsDiv.appendChild(cancelBtn);

        return div;
    }

    confirmPickup(pickupId) {
        const data = JSON.parse(localStorage.getItem('ngoDashboardData'));
        const pickup = data.pickups.find(p => p.id === pickupId);
        if (pickup) {
            pickup.status = 'confirmed';
            data.stats.completedPickups++;
            data.stats.pendingPickups--;

            // Add to activities
            data.activities.unshift({
                id: Date.now(),
                type: 'pickup',
                title: 'Pickup confirmed',
                description: `Pickup confirmed for ${pickup.donorName}`,
                time: 'Just now',
                icon: 'check-circle'
            });

            localStorage.setItem('ngoDashboardData', JSON.stringify(data));

            // Sync with donor data
            this.syncPickupStatusWithDonor(pickupId, 'completed');

            this.loadDashboardData();
            this.showNotification('Pickup confirmed successfully!', 'success');
        }
    }

    cancelPickup(pickupId) {
        if (confirm('Are you sure you want to cancel this pickup?')) {
            const data = JSON.parse(localStorage.getItem('ngoDashboardData'));
            data.pickups = data.pickups.filter(p => p.id !== pickupId);
            data.stats.pendingPickups--;

            localStorage.setItem('ngoDashboardData', JSON.stringify(data));

            // Sync with donor data - mark as cancelled
            this.syncPickupStatusWithDonor(pickupId, 'cancelled');

            this.loadDashboardData();
            this.showNotification('Pickup cancelled.', 'info');
        }
    }

    viewPickupDetails(pickupId) {
        // For now, just show an alert. In a real app, this would open a detailed modal
        const data = JSON.parse(localStorage.getItem('ngoDashboardData'));
        const pickup = data.pickups.find(p => p.id === pickupId);
        if (pickup) {
            alert(`Pickup Details:
Donor: ${pickup.donorName}
Address: ${pickup.address}
Time: ${new Date(pickup.dateTime).toLocaleString()}
Food Type: ${pickup.foodType}
Quantity: ${pickup.quantity} servings`);
        }
    }

    // =====================================
    // EVENT LISTENERS
    // =====================================
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterPickups(e.target.dataset.filter);
            });
        });

        // Pickup form
        const pickupForm = document.getElementById('pickupForm');
        if (pickupForm) {
            pickupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.schedulePickup();
            });
        }
    }

    filterPickups(filter) {
        const data = JSON.parse(localStorage.getItem('ngoDashboardData'));
        let filteredPickups = data.pickups;

        switch (filter) {
            case 'urgent':
                filteredPickups = data.pickups.filter(p => p.urgency === 'urgent');
                break;
            case 'today':
                const today = new Date().toDateString();
                filteredPickups = data.pickups.filter(p => new Date(p.dateTime).toDateString() === today);
                break;
            default:
                filteredPickups = data.pickups;
        }

        this.renderPickups(filteredPickups);
    }

    schedulePickup() {
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

        const data = JSON.parse(localStorage.getItem('ngoDashboardData'));
        data.pickups.push(formData);
        data.stats.pendingPickups++;

        // Add to activities
        data.activities.unshift({
            id: Date.now(),
            type: 'pickup',
            title: 'New pickup scheduled',
            description: `Pickup scheduled for ${formData.donorName}`,
            time: 'Just now',
            icon: 'calendar-plus'
        });

        localStorage.setItem('ngoDashboardData', JSON.stringify(data));
        this.loadDashboardData();
        this.closePickupModal();
        this.showNotification('Pickup scheduled successfully!', 'success');

        // Reset form
        document.getElementById('pickupForm').reset();
    }

    // =====================================
    // MODAL MANAGEMENT
    // =====================================
    openPickupModal() {
        document.getElementById('pickupModal').style.display = 'block';
    }

    closePickupModal() {
        document.getElementById('pickupModal').style.display = 'none';
    }

    // Sync with donor data to ensure all donations are reflected
    syncWithDonorData() {
        const donorDonations = JSON.parse(localStorage.getItem('donations')) || [];
        let ngoData = JSON.parse(localStorage.getItem('ngoDashboardData'));

        if (!ngoData) {
            ngoData = {
                stats: { totalDonations: 0, pendingPickups: 0, activeDonors: 0, completedPickups: 0 },
                activities: [],
                alerts: [],
                pickups: []
            };
        }

        // Check for new donations that aren't in NGO data
        const existingPickupIds = ngoData.pickups.map(p => p.id);
        const newDonations = donorDonations.filter(d => !existingPickupIds.includes(d.id));

        newDonations.forEach(donation => {
            // Update stats
            ngoData.stats.totalDonations += 1;
            if (donation.status === 'pending') {
                ngoData.stats.pendingPickups += 1;
            } else if (donation.status === 'completed') {
                ngoData.stats.completedPickups += 1;
            }

            // Add activity
            const activity = {
                id: Date.now() + Math.random(),
                type: 'donation',
                title: donation.status === 'completed' ? 'Donation completed' : 'New donation received',
                description: `${donation.foodType} - ${donation.quantity} from ${donation.pickupLocation}`,
                time: 'Recently',
                icon: donation.status === 'completed' ? 'check-circle' : 'utensils'
            };
            ngoData.activities.unshift(activity);

            // Add pickup
            const pickupDateTime = `${donation.date}T${donation.pickupTime || '12:00'}`;
            const pickupEntry = {
                id: donation.id,
                donorName: donation.pickupLocation,
                address: donation.pickupLocation,
                dateTime: pickupDateTime,
                foodType: donation.foodType,
                quantity: this.parseQuantity(donation.quantity),
                status: donation.status === 'completed' ? 'confirmed' : 'pending',
                urgency: 'normal'
            };
            ngoData.pickups.push(pickupEntry);
        });

        if (newDonations.length > 0) {
            localStorage.setItem('ngoDashboardData', JSON.stringify(ngoData));
            this.updateStats(ngoData.stats);
            this.renderActivities(ngoData.activities);
            this.renderPickups(ngoData.pickups);
        }
    }

    // Sync pickup status changes with donor data
    syncPickupStatusWithDonor(pickupId, status) {
        const donorDonations = JSON.parse(localStorage.getItem('donations')) || [];
        const donation = donorDonations.find(d => d.id === pickupId);

        if (donation) {
            donation.status = status;
            localStorage.setItem('donations', JSON.stringify(donorDonations));
        }
    }

    // Parse quantity string to number
    parseQuantity(quantityString) {
        const match = quantityString.match(/(\d+)/);
        return match ? parseInt(match[1]) : 1;
    }
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    refreshActivity() {
        const refreshBtn = document.querySelector('.refresh-btn');
        refreshBtn.classList.add('loading');

        // Simulate API call
        setTimeout(() => {
            const data = JSON.parse(localStorage.getItem('ngoDashboardData'));

            // Add a new activity
            data.activities.unshift({
                id: Date.now(),
                type: 'donation',
                title: 'Activity refreshed',
                description: 'Dashboard data updated successfully',
                time: 'Just now',
                icon: 'sync'
            });

            localStorage.setItem('ngoDashboardData', JSON.stringify(data));
            this.loadDashboardData();
            refreshBtn.classList.remove('loading');
            this.showNotification('Activity refreshed!', 'success');
        }, 1000);
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            const data = JSON.parse(localStorage.getItem('ngoDashboardData'));

            // Randomly update stats slightly
            if (Math.random() > 0.7) {
                data.stats.totalDonations += Math.floor(Math.random() * 3);
                data.stats.activeDonors += Math.random() > 0.5 ? 1 : 0;

                localStorage.setItem('ngoDashboardData', JSON.stringify(data));
                this.updateStats(data.stats);
            }
        }, 30000);
    }

    // =====================================
    // QUICK ACTIONS
    // =====================================
    viewReports() {
        window.location.href = 'reports.html';
    }

    manageDonors() {
        window.location.href = 'donor_management.html';
    }

    settings() {
        window.location.href = 'settings.html';
    }
}

// =====================================
// GLOBAL FUNCTIONS
// =====================================
function refreshActivity() {
    dashboard.refreshActivity();
}

function openPickupModal() {
    dashboard.openPickupModal();
}

function closePickupModal() {
    dashboard.closePickupModal();
}

function viewReports() {
    dashboard.viewReports();
}

function manageDonors() {
    dashboard.manageDonors();
}

function settings() {
    dashboard.settings();
}

// =====================================
// NOTIFICATION STYLES (ADD TO CSS)
// =====================================
const notificationStyles = `
.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    border-radius: 8px;
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 3000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    border-left: 4px solid;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left-color: #2d6a4f;
}

.notification.success i {
    color: #2d6a4f;
}

.notification.error {
    border-left-color: #e63946;
}

.notification.error i {
    color: #e63946;
}

.notification.info {
    border-left-color: #49aa8a;
}

.notification.info i {
    color: #49aa8a;
}
`;

// Add notification styles to head
const style = document.createElement('style');
style.textContent = notificationStyles;
document.head.appendChild(style);

// =====================================
// INITIALIZE DASHBOARD
// =====================================
const dashboard = new NGODashboard();

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('pickupModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}