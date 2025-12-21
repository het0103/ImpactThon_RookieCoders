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

        // Initialize demo NGO requests
        if (!localStorage.getItem('ngoRequests')) {
            const demoRequests = [
                {
                    id: Date.now() + 1,
                    items: 'Rice, Vegetables, Cooking Oil',
                    quantity: '100 kg rice, 50 kg vegetables, 20 liters oil',
                    urgency: 'urgent',
                    notes: 'Needed for our community kitchen serving 200 families daily. Perishable items required immediately.',
                    date: new Date().toISOString(),
                    status: 'active'
                },
                {
                    id: Date.now() + 2,
                    items: 'Bread, Milk, Fruits',
                    quantity: '200 loaves bread, 50 liters milk, 100 kg fruits',
                    urgency: 'normal',
                    notes: 'Supporting our school feeding program for underprivileged children.',
                    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    status: 'active'
                },
                {
                    id: Date.now() + 3,
                    items: 'Canned Food, Pasta, Soup',
                    quantity: '300 cans, 100 packets pasta, 150 cans soup',
                    urgency: 'critical',
                    notes: 'Emergency relief for flood-affected families. Non-perishable items only.',
                    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                    status: 'active'
                },
                {
                    id: Date.now() + 4,
                    items: 'Chicken, Fish, Meat',
                    quantity: '150 kg chicken, 80 kg fish, 100 kg meat',
                    urgency: 'normal',
                    notes: 'Protein supplies for our nutrition program targeting malnourished children.',
                    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                    status: 'active'
                }
            ];
            localStorage.setItem('ngoRequests', JSON.stringify(demoRequests));
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

        // Only show pending pickups
        const pendingPickups = pickups.filter(p => p.status.toLowerCase() === 'pending');

        if (pendingPickups && pendingPickups.length > 0) {
            pendingPickups.forEach(pickup => {
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
        const pickupIndex = data.pickups.findIndex(p => p.id === pickupId);

        if (pickupIndex !== -1) {
            // Update status instead of deleting
            data.pickups[pickupIndex].status = 'Confirmed';

            // data.stats.completedPickups++; // Don't incr completed yet, maybe track confirmed?
            data.stats.pendingPickups = Math.max(0, data.stats.pendingPickups - 1);

            // Add to activities
            data.activities.unshift({
                id: Date.now(),
                type: 'pickup',
                title: 'Pickup Confirmed',
                description: `Pickup confirmed for ${data.pickups[pickupIndex].donorName}`,
                time: 'Just now',
                icon: 'check-circle'
            });

            localStorage.setItem('ngoDashboardData', JSON.stringify(data));

            // Sync with donor data - mark as Confirmed
            this.syncPickupStatusWithDonor(pickupId, 'Confirmed');

            this.loadDashboardData();
            this.showNotification('Pickup confirmed successfully!', 'success');
        }
    }

    cancelPickup(pickupId) {
        if (confirm('Are you sure you want to cancel this pickup?')) {
            const data = JSON.parse(localStorage.getItem('ngoDashboardData'));
            const pickupIndex = data.pickups.findIndex(p => p.id === pickupId);

            if (pickupIndex !== -1) {
                // Update status instead of deleting
                data.pickups[pickupIndex].status = 'cancelled';
                data.stats.pendingPickups = Math.max(0, data.stats.pendingPickups - 1);

                localStorage.setItem('ngoDashboardData', JSON.stringify(data));

                // Sync with donor data - mark as cancelled
                this.syncPickupStatusWithDonor(pickupId, 'cancelled');

                this.loadDashboardData();
                this.showNotification('Pickup cancelled.', 'info');
            }
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

        // Request form
        const requestForm = document.getElementById('requestForm');
        if (requestForm) {
            requestForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitRequest();
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

    // schedulePickup logic moved to ngo_pickup_schedule.js

    // submitRequest moved to ngo_request.js

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

        // Map for quick lookup
        const ngoPickupsMap = new Map(ngoData.pickups.map(p => [p.id, p]));

        donorDonations.forEach(donation => {
            if (ngoPickupsMap.has(donation.id)) {
                // Update existing if needed (e.g. if donor changed something, though usually NGO drives status)
                // We mainly want to ensure consistency. 
                // If donor side has a newer status that matters, we could sync it here.
                // For now, we assume NGO dashboard is the source of truth for STATUS once it's in the system.
            } else {
                // NEW DONATION DETECTED
                // Add stats
                ngoData.stats.totalDonations += 1;
                if (donation.status.toLowerCase() === 'pending') {
                    ngoData.stats.pendingPickups += 1;
                }

                // Add activity
                const activity = {
                    id: Date.now() + Math.random(),
                    type: 'donation',
                    title: 'New donation received',
                    description: `${donation.foodType} - ${donation.quantity} from ${donation.pickupLocation}`,
                    time: 'Recently',
                    icon: 'utensils'
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
                    status: donation.status, // use donor status
                    urgency: 'normal'
                };
                ngoData.pickups.push(pickupEntry);
            }
        });

        localStorage.setItem('ngoDashboardData', JSON.stringify(ngoData));

        // Refresh UI
        this.updateStats(ngoData.stats);
        this.renderActivities(ngoData.activities);
        // Important: renderPickups filters pending, so we pass full list and let it filter
        this.renderPickups(ngoData.pickups);
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

// closePickupModal moved to separate page logic

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
// Window click listener specific to pickups removed