from django.urls import path
from .views import *

urlpatterns = [
    path('',index, name='index'),
    # path('about', about),
    path('login', loginpage, name='loginpage'),
    path('verifyuser', verifyuser, name='verifyuser'),
    path('register_ngo',register, name='register_ngo'),
    path('logout', logout, name='logout'),
    path('donor-home', donor_home, name='donor_home'),
    path('donor-demo', donor_demo, name='donor_demo'),
]
