# 🥘 NourishNet: Resources Find Purpose

[![Django](https://img.shields.io/badge/Django-6.0-green.svg)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.x-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built For](https://img.shields.io/badge/Built%20For-ImpactThon-orange)](https://github.com/het0103/ImpactThon_RookieCoders)

## 👋 What is NourishNet?

We often see big hotels donating food to large NGOs, but what about the small-scale surplus?
**Hostels, PGs, and local bakeries** waste food daily simply because the quantity is "too small" for big trucks to pick up.

**NourishNet** is our solution to this **"Last Mile Logistics"** problem. We built a hyperlocal platform that connects these small donors directly with nearby Volunteers and NGOs. It’s not just about food; it’s about ensuring that **resources find purpose**.

> **Mission:** "Bridging the gap between Surplus and Scarcity."

---

## 💡 Why This Project? (The Problem)

During our college days, we noticed two things:
1.  **Surplus:** Our hostel mess throws away good food daily because there's no easy way to donate it.
2.  **Logistics Gap:** NGOs want food, but they can't afford to send a van for just 10-15 meals.

We realized that if we could mobilize **Student Volunteers** (who are already moving around the city), we could solve the logistics issue for free.

---

## 🚀 How It Works (Key Features)

We built three distinct dashboards to handle the flow:

### 1. 🍽️ For Donors (Hostels/PGs)
* **Smart Priority Logic:** The system knows the difference!
    * *Cooked Food* = **High Priority** (Must be picked up in 2 hours).
    * *Books/Clothes* = **Standard Priority** (Can wait for the weekend).
* **Quick Post:** Post a donation in 3 clicks with location integration.

### 2. 🏢 For NGOs
* **Real-Time Alerts:** Get notified instantly when food is available within a 3km radius.
* **Resource Request:** Can't find what you need? NGOs can post requests (e.g., "Need 20 Blankets") for donors to see.

### 3. 🤝 For Volunteers (The Real Heroes)
* **Gamification:** We didn't want volunteering to be boring. Every delivery earns **"Social Credits"**.
* **Flexible Tasks:** Students can accept pickups based on their route and availability.
* **Leaderboard:** Top volunteers get recognized (Future feature).

---

## 🛠️ Tech Stack (Under the Hood)

We chose a stack that balances performance with development speed for the Hackathon:

* **Backend:** **Django 6.0 (Python)** - Chosen for its robust security and built-in Admin panel.
* **Database:** **SQLite3** - Lightweight and efficient for our current prototype.
* **Frontend:** **Django Templates + Vanilla JS** - We kept it simple to ensure the site loads fast on all devices.
* **Styling:** Custom CSS with a focus on Accessibility and Responsiveness.

---

## 📸 Project Structure

If you are exploring the code, here is how we organized it:

```text
NourishNet/
├── nourishnet/        # Core project settings
├── nour/              # Main App Logic
│   ├── models.py      # Database Schema (Donors, Tasks, Credits)
│   ├── views.py       # The brain behind the platform
│   ├── templates/     # HTML pages for Dashboards
│   └── static/        # CSS & Images
├── db.sqlite3         # Database file
└── manage.py          # Command center


⚡ Quick Start (Run it Locally)

1. Clone the Repo

git clone [https://github.com/het0103/ImpactThon_RookieCoders.git](https://github.com/het0103/ImpactThon_RookieCoders.git)
cd ImpactThon_RookieCoders

2. Set up Virtual Environment (Recommended)

python -m venv venv
# Windows:
venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

3.  Install Django

pip install django

4. Wake up the Database

python manage.py makemigrations
python manage.py migrate

5. Run the Server

python manage.py runserver

Open http://127.0.0.1:8000 in your browser and start saving food! 🌍