from django.shortcuts import render, redirect
from .models import *

def index(request):
    return render(request, "index.html")

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
                return render(request, "register_ngo.html", {"error": "Passwords do not match."})
            else:
                user = register_ngo(name=name, email=email,mobile=mobile,addr=addr,pincode=pincode, password=pwd1,timestamp="")
                user.save()
                return redirect(index)

    return render(request, "register_ngo.html")

def loginpage(request):
    return render(request, 'login.html')

def verifyuser(request):
    if request.method == "POST":
        useremail = request.POST.get("email")
        password = request.POST.get("password")
        try:
            userdata = register_ngo.objects.get(email=useremail, password=password)
            request.session["login_id"] = userdata.id
            request.session["login_email"] = userdata.email
            request.session.save()
            return redirect('donor_home')
        except:
            return render(request, "login.html", {"error": "Password is not Correct"})
    return render(request, "login.html")

def logout(request):
    try:
        del request.session["login_id"]
        del request.session["login_email"]
        return redirect('index')
    except:
        pass
    return redirect('index')

def about(request):
    return render(request, 'about.html')

def donor_home(request):
    # Check if user is logged in
    if "login_id" not in request.session:
        return redirect('loginpage')
    
    return render(request, 'donar/donor_home.html')

def donor_demo(request):
    # Demo page without login requirement for testing
    return render(request, 'donar/donor_demo.html')