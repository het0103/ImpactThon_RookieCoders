from django.urls import path
from .views import *

urlpatterns = [
    path('',index),
    # path('about', about),
    path('login', loginpage),
    path('verifyuser', verifyuser),
    path('register_ngo',register),
    path('verifyuser', verifyuser),
    path('logout', logout),
]
