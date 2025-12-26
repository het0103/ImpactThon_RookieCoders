from django.urls import path
from .views import *

urlpatterns = [
    path('',index),
    path('about', about),
    path('anonymous_donation', anonymous_donation),
    path('donation_needs', donation_needs),
    path('donor_home', donor_home),
    path('donor_management', donor_management),
    path('ngo_dashboard', ngo_dashboard),
    path('ngo_pickup_schedule', ngo_pickup_schedule),
    path('ngo_request', ngo_request),
    path('pickup', pickup,name='pickup'),
    
    # Existing NGO/Donor authentication
    path("register", register, name="register"),
    path("login", loginpage, name="login"),
    path("logout", logout, name="logout"),
    path('verifyuser', verifyuser),
    
    # NEW VOLUNTEER ROUTES
    path("volunteer_register", volunteer_register, name="volunteer_register"),
    path("volunteer_login", volunteer_login, name="volunteer_login"),
    path("verify_volunteer", verify_volunteer, name="verify_volunteer"),
    path("volunteer_dashboard", volunteer_dashboard, name="volunteer_dashboard"),
    path("accept_task/<int:task_id>", accept_task, name="accept_task"),
    path("complete_task/<int:task_id>", complete_task, name="complete_task"),
    
    path('reports', reports),
    path('settings', settings),
]
