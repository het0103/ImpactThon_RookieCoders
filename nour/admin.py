from django.contrib import admin
from .models import register_ngo

class displayngo(admin.ModelAdmin):
    list_display = ['name', 'email', 'mobile', 'addr', 'pincode','password', 'timestamp']

admin.site.register(register_ngo, displayngo)