from django.urls import path
from .views import *

urlpatterns = [
    path('',index),
    path('about', about),
    path('anonymous_donation', anonymous_donation),
    path('donation_needs', donation_needs),
    path('donor_home', donor_home),
    path('donor_management', donor_management),
    path('login', loginpage),
    path('logout', logout,name='logout'),
    path('ngo_dashboard', ngo_dashboard),
    path('ngo_pickup_schedule', ngo_pickup_schedule),
    path('ngo_request', ngo_request),
    path('pickup', pickup,name='pickup'),
    path('register',register),
    path('verifyuser', verifyuser),
    path('reports', reports),
    path('settings', settings),
]
