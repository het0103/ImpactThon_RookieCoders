from django.urls import path
from .views import *

urlpatterns = [
    path('',index),
    # path('about', about),
    path('login', loginpage),
    path('verifyuser', verifyuser),
    path('register_ngo',register),
    path('logout', logout,name='logout'),
    path('donor', donor),
    # path('donor-demo', donor_demo),
]
