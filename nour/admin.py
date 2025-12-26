from django.contrib import admin
from .models import *

class displayngo(admin.ModelAdmin):
    list_display = ['name', 'email', 'mobile', 'addr', 'pincode','password', 'timestamp']

class VolunteerAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'volunteer_type', 'city', 'social_credits', 'tasks_completed', 'created_at']
    list_filter = ['volunteer_type', 'city', 'created_at']
    search_fields = ['name', 'email', 'city']

class VolunteerTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'task_type', 'status', 'assigned_volunteer', 'credit_reward', 'created_at']
    list_filter = ['task_type', 'status', 'created_at']
    search_fields = ['title', 'description', 'pickup_location']

class SocialCreditAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'task', 'credits_earned', 'earned_at']
    list_filter = ['earned_at']

admin.site.register(register_ngo, displayngo)
admin.site.register(Volunteer, VolunteerAdmin)
admin.site.register(VolunteerTask, VolunteerTaskAdmin)
admin.site.register(SocialCredit, SocialCreditAdmin)
