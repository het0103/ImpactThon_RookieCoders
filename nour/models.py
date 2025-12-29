from django.db import models

class register_users(models.Model):
    USER_TYPE_CHOICES = (
        ('donor', 'Donor'),
        ('ngo', 'NGO'),
    )
    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES
    )
    name=models.CharField(max_length=30)
    email=models.EmailField()
    mobile=models.IntegerField()
    addr = models.TextField()
    pincode = models.IntegerField()
    password=models.CharField(max_length=20)
    timestamp=models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.email} ({self.user_type})"


class Volunteer(models.Model):
    VOLUNTEER_TYPE_CHOICES = (
        ('student', 'Student Volunteer'),
        ('organization', 'Organization Volunteer'),
        ('individual', 'Individual Volunteer'),
    )
    
    # Common fields for all volunteers
    volunteer_type = models.CharField(max_length=20, choices=VOLUNTEER_TYPE_CHOICES)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    city = models.CharField(max_length=50)
    password = models.CharField(max_length=20)
    
    # Type-specific fields
    college_name = models.CharField(max_length=100, blank=True, null=True)  # For students
    student_id = models.CharField(max_length=50, blank=True, null=True)  # For students
    organization_name = models.CharField(max_length=100, blank=True, null=True)  # For organizations
    registration_id = models.CharField(max_length=50, blank=True, null=True)  # For organizations
    government_id = models.CharField(max_length=50, blank=True, null=True)  # For individuals (optional)
    
    # Credit tracking
    social_credits = models.IntegerField(default=0)
    tasks_completed = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.volunteer_type})"


class VolunteerTask(models.Model):
    TASK_STATUS_CHOICES = (
        ('available', 'Available'),
        ('accepted', 'Accepted'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    TASK_TYPE_CHOICES = (
        ('pickup', 'Food Pickup'),
        ('delivery', 'Food Delivery'),
        ('donation_request', 'Donation Request'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    task_type = models.CharField(max_length=20, choices=TASK_TYPE_CHOICES)
    
    # Location details
    pickup_location = models.TextField()
    delivery_location = models.TextField(blank=True, null=True)
    
    # Task details
    food_quantity = models.CharField(max_length=100, blank=True, null=True)
    pickup_time = models.DateTimeField(blank=True, null=True)
    
    # Task status and assignment
    status = models.CharField(max_length=20, choices=TASK_STATUS_CHOICES, default='available')
    assigned_volunteer = models.ForeignKey(Volunteer, on_delete=models.SET_NULL, blank=True, null=True)
    
    # Credits to be awarded
    credit_reward = models.IntegerField(default=10)
    
    # Related entities
    donor = models.ForeignKey(register_users, on_delete=models.CASCADE, related_name='donor_tasks', blank=True, null=True)
    ngo = models.ForeignKey(register_users, on_delete=models.CASCADE, related_name='ngo_tasks', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.status}"


class SocialCredit(models.Model):
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='credit_history')
    task = models.ForeignKey(VolunteerTask, on_delete=models.CASCADE)
    credits_earned = models.IntegerField()
    earned_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=200, default="Task completion reward")

    def __str__(self):
        return f"{self.volunteer.name} earned {self.credits_earned} credits"