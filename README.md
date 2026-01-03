# 🍽️ NourishNet – Where resources find purpose

A hackathon-built web platform that connects **food donors, NGOs, and volunteers** to reduce food waste and fight hunger through efficient coordination and real-time collaboration.

---

## 🌟 Overview

**NourishNet** is a social impact web application developed during a hackathon.  
It creates a unified ecosystem where surplus food can be donated, managed by NGOs, and delivered to people in need with the help of volunteers.

### 🎯 Mission
**Reducing food waste while addressing hunger through technology-driven community collaboration.**

---

## 🚀 Key Features

### 👥 Multi-Role Platform
- **🍽️ Donors** – Restaurants, hotels, individuals, and organizations donating surplus food
- **🏢 NGOs** – Manage food collection, requests, and distribution
- **🤝 Volunteers** – Assist in food pickup and delivery

---

### 🔧 Core Functionalities

#### 🍽️ Donors
- Donate surplus food using a simple and guided form
- Schedule food pickup
- Track donation history and status
- View impact of their contributions

#### 🏢 NGOs
- View and manage incoming food donations
- Create and manage pickup schedules
- Coordinate with volunteers
- Monitor food distribution activities
- Access impact reports and statistics

#### 🤝 Volunteers
- Register as **Student / Organization / Individual** volunteer
- View available and assigned tasks
- Accept and complete food pickup & delivery tasks
- Earn **social credit points** for completed tasks
- Track contribution history and impact

---

## ⚡ Platform Highlights

- **Real-time Notifications**  
  Live updates for donation status, pickup assignments, and task completion.

- **Social Credit System**  
  Volunteers earn points for successful task completion, encouraging participation and consistency.

- **Impact Reporting**  
  Graph-based reports showing food donated, tasks completed, and community reach.

- **Role-based Authentication**  
  Secure login system with dashboards tailored to each user role.

- **Responsive Design**  
  Optimized for desktop and mobile devices.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Django (Python)
- **Database**: SQLite3
- **Authentication**: Django built-in authentication system

### Frontend
- **HTML, CSS**
- **JavaScript (Vanilla)**
- **Django Templates**

---

### Project Structure
NourishNet/
├── manage.py                    # Django management script
├── db.sqlite3                   # SQLite database
├── nourishnet/                  # Main project settings
│   ├── settings.py              # Django configuration
│   ├── urls.py                  # Main URL routing
│   └── wsgi.py                  # WSGI configuration
├── nour/                        # Main application
│   ├── models.py                # Database models
│   ├── views.py                 # View functions
│   ├── urls.py                  # App URL routing
│   ├── templates/               # HTML templates
│   ├── static/                  # CSS, JS, images
│   └── migrations/              # Database migrations
└── venv/                        # Virtual environment


---

## 🗄️ Database Models (Simplified)

- **User / RegisterUser** – Donor and NGO registration
- **Volunteer** – Volunteer profiles with role types
- **Donation** – Food donation details and status
- **VolunteerTask** – Pickup and delivery task management
- **SocialCredit** – Volunteer reward and contribution tracking

---

## 🚀 How to Run the Project Locally

### Prerequisites
- Python 3.8+
- pip
- Git

### Setup Steps

1.
```bash
git clone https://github.com/het0103/ImpactThon_RookieCoders.git
cd ImpactThon_RookieCoders

2.
python -m venv venv
venv\Scripts\activate

3. 
pip install django

4.
python manage.py makemigrations
python manage.py migrate

5.
python manage.py runserver

📍 Open in browser:
http://127.0.0.1:8000/

📍 Admin Panel:
http://127.0.0.1:8000/admin/

🎯 Hackathon Context
**Problem Statement

Large quantities of edible food are wasted daily
Many communities face food insecurity
Lack of efficient coordination between donors, NGOs, and volunteers

**Our Solution

NourishNet bridges this gap by:
Digitally connecting all stakeholders
Enabling real-time coordination
Encouraging volunteering through a reward system
Providing measurable impact through reports and graphs

🔮 Future Enhancements

Mobile application
Location-based volunteer assignment
Advanced analytics dashboard
Multi-language support
Cloud deployment for scalability

👥 Team

Team Name: RookieCoders
Hackathon: ImpactThon

🔗 GitHub Repository:
https://github.com/het0103/ImpactThon_RookieCoders

📌 Project Status

🚀 Hackathon Prototype – Version 1.0

✔ Multi-role user system
✔ Real-time notifications
✔ Social credit system
✔ Impact reporting with graphs
✔ Food donation and volunteer coordination

Together, we aim to reduce food waste and fight hunger.