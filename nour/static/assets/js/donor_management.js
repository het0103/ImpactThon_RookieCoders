  // Initialize time display
        function updateTime() {
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

            document.getElementById('currentTime').textContent = timeString;
            document.getElementById('currentDate').textContent = dateString;
        }

        updateTime();
        setInterval(updateTime, 1000);

        // Load donor data
        function loadDonors() {
            const donations = JSON.parse(localStorage.getItem('donations')) || [];
            const donors = {};

            // Group donations by donor
            donations.forEach(donation => {
                if (!donors[donation.pickupLocation]) {
                    donors[donation.pickupLocation] = {
                        name: donation.pickupLocation,
                        totalDonations: 0,
                        lastDonation: donation.date,
                        status: 'active'
                    };
                }
                donors[donation.pickupLocation].totalDonations += 1;
            });

            const donorsGrid = document.getElementById('donorsGrid');
            donorsGrid.innerHTML = '';

            Object.values(donors).forEach(donor => {
                const donorCard = document.createElement('div');
                donorCard.className = 'donor-card';
                donorCard.innerHTML = `
                    <div class="donor-header">
                        <h4>${donor.name}</h4>
                        <span class="donor-status ${donor.status}">${donor.status}</span>
                    </div>
                    <div class="donor-details">
                        <p><i class="fas fa-hand-holding-heart"></i> ${donor.totalDonations} donations</p>
                        <p><i class="fas fa-calendar"></i> Last donation: ${new Date(donor.lastDonation).toLocaleDateString()}</p>
                    </div>
                    <div class="donor-actions">
                        <button class="btn btn-secondary btn-sm">
                            <i class="fas fa-eye"></i> View Profile
                        </button>
                        <button class="btn btn-primary btn-sm">
                            <i class="fas fa-envelope"></i> Contact
                        </button>
                    </div>
                `;
                donorsGrid.appendChild(donorCard);
            });
        }

        loadDonors();

        function promptAddDonor() {
            const name = prompt("Enter Donor Name:");
            if (name) {
                alert(`Donor "${name}" added to pending review list.`);
                // In a real app, this would save to a pending list
            }
        }