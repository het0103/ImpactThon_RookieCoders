// if(!localStorage.getItem("ngoLogin")){
//   location.href="login.html";
// }

class NGOApp {
    constructor() {
        this.donations = JSON.parse(localStorage.getItem("donations")) || [];
        this.init();
    }

    init() {
      setInterval(() => {
    this.donations = JSON.parse(localStorage.getItem("donations")) || [];
    this.loadActivity();
    this.loadAlerts();
    this.loadPendingPickups();
}, 3000);

        this.updateTime();
        setInterval(() => this.updateTime(), 1000);

        this.loadActivity();
        this.loadAlerts();
        this.loadPendingPickups();
    }

    updateTime() {
        const timeEl = document.getElementById("time");
        if (!timeEl) return;

        const now = new Date();
        timeEl.textContent = now.toLocaleString();
    }

    loadActivity() {
        const list = document.getElementById("donors");
        if (!list) return;

        list.innerHTML = "";

        const recent = this.donations.slice(-5).reverse();

        if (recent.length === 0) {
            list.innerHTML = "<li>No recent donor activity</li>";
            return;
        }

        recent.forEach(d => {
            const li = document.createElement("li");
            li.textContent = `${d.foodType} • ${d.quantity} • ${d.pickupLocation}`;
            list.appendChild(li);
        });
    }

    loadAlerts() {
        const list = document.getElementById("alerts");
        if (!list) return;

        list.innerHTML = "";

        const pending = this.donations.filter(d => d.status === "pending");

        if (pending.length === 0) {
            list.innerHTML = "<li>No live alerts 🎉</li>";
            return;
        }

        pending.forEach(d => {
            const li = document.createElement("li");
            li.textContent = `Pickup pending: ${d.foodType} (${d.pickupTime})`;
            list.appendChild(li);
        });
    }

    loadPendingPickups() {
        const container = document.getElementById("pickups");
        if (!container) return;

        container.innerHTML = "";

        const pending = this.donations.filter(d => d.status === "pending");

        if (pending.length === 0) {
            container.innerHTML = "<p>No pending pickups</p>";
            return;
        }

        pending.forEach(d => {
            const div = document.createElement("div");
            div.className = "pickup";

            div.innerHTML = `
                <strong>${d.foodType}</strong>
                <span>${d.quantity}</span>
                <span>${d.pickupLocation}</span>
                <span>Time: ${d.pickupTime}</span>
                <button onclick="ngoApp.confirmPickup(${d.id})">
                    Confirm Pickup
                </button>
            `;

            container.appendChild(div);
        });
    }

    confirmPickup(id) {
        const donation = this.donations.find(d => d.id === id);
        if (!donation) return;

        donation.status = "completed";
        localStorage.setItem("donations", JSON.stringify(this.donations));

        this.loadActivity();
        this.loadAlerts();
        this.loadPendingPickups();
    }
}

let ngoApp;
document.addEventListener("DOMContentLoaded", () => {
    ngoApp = new NGOApp();
});
this.donations = JSON.parse(localStorage.getItem("donations")) || [];
 