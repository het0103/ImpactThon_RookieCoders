from django.shortcuts import render, redirect
from .models import *

def index(request):
    return render(request, "index.html")

def register(request):
        if request.method == "POST":
            name = request.POST.get("username", "").strip()
            email = request.POST.get("email", "").strip()
            mobile = request.POST.get("mobile", "")
            addr = request.POST.get("address", "")
            pincode = request.POST.get("pincode", "")
            pwd1 = request.POST.get("pass1", "")
            pwd2 = request.POST.get("pass2", "")
            if register_ngo.objects.filter(email=email).exists():
                return redirect(loginpage)
            if pwd1 != pwd2:
                return render(request, "register_ngo.html", {"error": "Passwords do not match."})

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
        print(useremail)
        print(password)
        try:
            userdata = register_ngo.objects.get(email=useremail, password=password)
            request.session["login_id"] = userdata.id
            request.session["login_email"] = userdata.email
            request.session.save()
            print("Login Successful")
            return redirect(index)
        except:
            print("invalid Details")
            return redirect(loginpage)

    return render(request, "login.html")

def about(request):
    return render(request, 'about.html')