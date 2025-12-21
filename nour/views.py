from django.shortcuts import render, redirect
from .models import *
# import requests

def index(request):
    return render(request, "index.html")

def about(request):
    return render(request, 'about.html')

def anonymous_donation(request):
    return render(request, 'anonymous_donation.html')

def donation_needs(request):
    return render(request, 'donation_needs.html')

def donor_home(request):
    return render(request, 'donor_home.html')

def donor_management(request):
    return render(request, 'donor_management.html')

def loginpage(request):
    return render(request, 'login.html')

def ngo_dashboard(request):
    return render(request, "ngo_dashboard.html")

def ngo_pickup_schedule(request):
    return render(request, "ngo_pickup_schedule.html")

def ngo_request(request):
    return render(request, "ngo_request.html")

def pickup(request):
    return render(request, "pickup.html")

# for ngo registration
def register(request):
    if request.method == "POST":
        name = request.POST.get("username", "").strip()
        email = request.POST.get("email", "").strip()
        mobile = request.POST.get("mobile", "")
        addr = request.POST.get("address", "")
        pincode = request.POST.get("pincode", "")
        pwd1 = request.POST.get("pwd1", "")
        pwd2 = request.POST.get("pwd2", "")
        if register_ngo.objects.filter(email=email).exists():
            return render(request, "login.html", {"error": "Account already exists. Please log in."})
        else:
            if pwd1 != pwd2:
                return render(request, "register.html", {"error": "Passwords do not match."})
            else:
                user = register_ngo(name=name, email=email,mobile=mobile,addr=addr,pincode=pincode, password=pwd1,timestamp="")
                user.save()
                return redirect(index)
    return render(request, "register.html")


def verifyuser(request):
    if request.method == "POST":
        useremail = request.POST.get("email")
        password = request.POST.get("password")
        try:
            userdata = register_ngo.objects.get(email=useremail, password=password)
            request.session["login_id"] = userdata.id
            request.session["login_email"] = userdata.email
            request.session.save()
            return redirect(index)
        except:
            return redirect(loginpage)

def logout(request):
    try:
        del request.session["login_id"]
        del request.session["login_email"]
        return redirect(index)
    except:
        pass

def reports(request):
    return render(request, "reports.html")

def settings(request):
    return render(request, "settings.html")