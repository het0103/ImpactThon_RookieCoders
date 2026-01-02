# 🍽️ NourishNet - Together Against Hunger

[![Django](https://img.shields.io/badge/Django-6.0-green.svg)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.x-blue.svg)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey.svg)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Overview

**NourishNet** is a comprehensive food waste reduction and hunger relief platform built for hackathons and social impact initiatives. The application connects food donors, NGOs, and volunteers in an efficient ecosystem to rescue surplus food and deliver it to those in need.

### 🎯 Mission
*"Together Against Hunger"* - Reducing food waste while addressing hunger through technology-driven community collaboration.

## 🚀 Key Features

### 👥 Multi-Role Platform
- **🍽️ Donors**: Restaurants, hotels, individuals, and organizations can donate surplus food
- **🏢 NGOs**: Non  & organizations manage food distribution and outreach programs  
- **🤝 Volunteers**: Community members facilitate food pickup and delivery operations

### ✨ Core Functionalities

#### For Donors 🍽️
- **Dashboard Analytics**: Track daily, monthly donation statistics
- **Smart Donation Forms**: Easy food donation with pickup scheduling
- **History Tracking**: Complete donation history with status updates
- **Pickup Management**: Schedule and track food pickups

#### For NGOs 🏢  
- **Distribution Management**: Coordinate food distribution programs
- **Request System**: Submit requests for specific food types/quantities
- **Pickup Scheduling**: Manage pickup operations and logistics
- **Impact Reporting**: Track community impact and distribution metrics

#### For Volunteers 🤝
- **Social Credit System**: Gamified volunteering with reward points
- **Flexible Task Management**: Accept/reject tasks based on availability
- **Multiple Volunteer Types**: 
  - 🎓 Student Volunteers (College verification)
  - 🏢 Organization Volunteers (Corporate social responsibility)
  - 👤 Individual Volunteers (Community members)
- **Real-time Dashboard**: Live task updates and completion tracking

### 🛠️ Technical Features
- **Responsive Design**: Mobile-friendly interface for all user types
- **Real-time Updates**: Live task status and notification system
- **Secure Authentication**: Role-based access control
- **Data Analytics**: Comprehensive reporting and impact tracking
- **SQLite Database**: Lightweight, embedded database solution

## 🏗️ Technology Stack

### Backend
- **Framework**: Django 6.0
- **Language**: Python 3.x
- **Database**: SQLite3
- **Authentication**: Django's built-in auth system

### Frontend
- **Templates**: Django Templates
- **Styling**: Custom CSS with responsive design
- **JavaScript**: Vanilla JS for interactive features
- **Assets**: Static file management

### Project Structure
```
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
```

## 📊 Database Schema

### Core Models
- **`register_users`**: Unified registration for donors and NGOs
- **`Volunteer`**: Volunteer profiles with type-specific fields
- **`VolunteerTask`**: Task management system for food operations
- **`SocialCredit`**: Gamification and reward tracking

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip package manager
- Git (for cloning)

### Installation

1. **Clone the Repository**
```powershell
git clone https://github.com/het0103/ImpactThon_RookieCoders.git
cd ImpactThon_RookieCoders
```

2. **Create Virtual Environment**
```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

3. **Install Dependencies**
```powershell
pip install django
```

4. **Database Setup**
```powershell
python manage.py makemigrations
python manage.py migrate
```

5. **Create Superuser (Optional)**
```powershell
python manage.py createsuperuser
```

6. **Run Development Server**
```powershell
python manage.py runserver
```

7. **Access the Application**
   - Open browser to `http://127.0.0.1:8000`
   - Main landing page with role selection
   - Admin panel at `http://127.0.0.1:8000/admin`

## 🖥️ Usage Guide

### Getting Started
1. **Visit Homepage**: Navigate to the main landing page
2. **Choose Role**: Select between Donor, NGO, or Volunteer
3. **Register/Login**: Create account or login to existing account
4. **Explore Dashboard**: Access role-specific features and functionalities

### For Donors
1. Navigate to donor dashboard
2. Click "Make Donation" to donate food
3. Fill in food details and pickup information
4. Track donation status in history section

### For Volunteers
1. Register with volunteer type (Student/Organization/Individual)
2. Browse available tasks on dashboard
3. Accept tasks and complete them to earn social credits
4. Track your impact through completion history

### For NGOs
1. Register as NGO organization
2. Access NGO dashboard for distribution management
3. Create pickup schedules and requests
4. Coordinate with volunteers for food operations

## 🎯 Hackathon Context

### Impact Theme
Focusing on social good and community impact through technology solutions.

### Problem Statement
- **Food Waste**: Millions of tons of surplus food discarded daily
- **Hunger Crisis**: Significant population facing food insecurity
- **Coordination Gap**: Lack of efficient systems connecting food surplus with need

### Our Solution
NourishNet bridges this gap through:
- **Technology Integration**: Digital platform for seamless coordination
- **Community Engagement**: Gamified volunteer system
- **Real-time Logistics**: Efficient pickup and delivery management
- **Impact Tracking**: Measurable social impact metrics

### Development Team: RookieCoders
Passionate developers committed to leveraging technology for social impact and community welfare.

## 🔮 Future Enhancements

### Planned Features
- [ ] **Mobile Application**: React Native or Flutter mobile app
- [ ] **AI Integration**: Smart matching algorithms for optimal food distribution
- [ ] **Geolocation**: GPS-based volunteer task assignment
- [ ] **Payment Gateway**: Monetary donation processing
- [ ] **Analytics Dashboard**: Advanced reporting and insights
- [ ] **Multi-language Support**: Localization for different regions
- [ ] **Integration APIs**: Third-party service integrations
- [ ] **Blockchain**: Transparent impact tracking and verification

### Scalability
- Cloud deployment (AWS/Azure/GCP)
- PostgreSQL for production database
- Redis for caching and session management
- Celery for background task processing


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 📞 Contact

### Team RookieCoders
- **GitHub**: [het0103](https://github.com/het0103)
- **Repository**: [ImpactThon_RookieCoders](https://github.com/het0103/ImpactThon_RookieCoders)


---

## 📈 Project Status

🚀 **Active Development** - Built during ImpactThon hackathon with ongoing enhancements planned.

### Current Version: 1.0.0
- ✅ Multi-role user system (Donors, NGOs, Volunteers)
- ✅ Task management and assignment system  
- ✅ Social credit and gamification system
- ✅ Responsive web interface
- ✅ Database design and migrations
- ✅ Authentication and authorization

*Together, we can make a difference in fighting hunger and reducing food waste!* 🌟