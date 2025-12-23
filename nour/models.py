from django.db import models

class register_ngo(models.Model):
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