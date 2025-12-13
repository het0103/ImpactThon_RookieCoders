from django.db import models

class register_ngo(models.Model):
    name=models.CharField(max_length=30)
    email=models.EmailField()
    mobile=models.IntegerField()
    addr = models.TextField()
    pincode = models.IntegerField()
    password=models.CharField(max_length=20)
    timestamp=models.DateTimeField(auto_now=True)
