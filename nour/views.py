from django.contrib.auth import login
from django.shortcuts import render, redirect
from django.contrib import messages
from django.utils import timezone
from .models import *

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

# Existing NGO/Donor Registration and Authentication
def register(request):
    if request.method == "POST":
        user_type = request.POST.get("user_type")
        name = request.POST.get("username", "").strip()
        email = request.POST.get("email", "").strip()
        mobile = request.POST.get("mobile", "")
        addr = request.POST.get("address", "")
        pincode = request.POST.get("pincode", "")
        pwd1 = request.POST.get("pwd1", "")
        pwd2 = request.POST.get("pwd2", "")

        if register_users.objects.filter(email=email).exists():
            return render(request, "login.html", {"error": "Account already exists. Please login"})

        if pwd1 != pwd2:
            return render(request, "register.html", {"error": "Passwords do not match"})

        user = register_users(
            user_type=user_type,
            name=name,
            email=email,
            mobile=mobile,
            addr=addr,
            pincode=pincode,
            password=pwd1
        )
        user.save()
        return redirect(loginpage)

    return render(request, "register.html")


def verifyuser(request):
    if request.method == "POST":
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "").strip()

        try:
            user = register_users.objects.get(email=email)
        except register_users.DoesNotExist:
            return render(request, "login.html", {"error": "No account found. Please register"})

        if user.password != password:
            return render(request, "login.html", {"error": "Invalid email or password"})

        # ✅ Maintain SAME session variable everywhere
        request.session["login_id"] = user.id
        request.session["login_email"] = user.email
        request.session["user_type"] = user.user_type

        if user.user_type == "ngo":
            return redirect(ngo_dashboard)
        else:
            return redirect(donor_home)
    return render(request, "login.html")


# NEW VOLUNTEER AUTHENTICATION SYSTEM
def volunteer_register(request):
    """Volunteer registration with type selection"""
    if request.method == "POST":
        volunteer_type = request.POST.get("volunteer_type")
        name = request.POST.get("name", "").strip()
        email = request.POST.get("email", "").strip()
        phone = request.POST.get("phone", "")
        city = request.POST.get("city", "")
        pwd1 = request.POST.get("pwd1", "")
        pwd2 = request.POST.get("pwd2", "")
        
        # Type-specific fields
        college_name = request.POST.get("college_name", "")
        student_id = request.POST.get("student_id", "")
        organization_name = request.POST.get("organization_name", "")
        registration_id = request.POST.get("registration_id", "")
        government_id = request.POST.get("government_id", "")

        # Check if volunteer already exists
        if Volunteer.objects.filter(email=email).exists():
            return render(request, "volunteer_register.html", {"error": "Account already exists. Please login"})

        if pwd1 != pwd2:
            return render(request, "volunteer_register.html", {"error": "Passwords do not match"})

        # Create volunteer record
        volunteer = Volunteer(
            volunteer_type=volunteer_type,
            name=name,
            email=email,
            phone=phone,
            city=city,
            password=pwd1
        )
        
        # Set type-specific fields
        if volunteer_type == "student":
            volunteer.college_name = college_name
            volunteer.student_id = student_id
        elif volunteer_type == "organization":
            volunteer.organization_name = organization_name
            volunteer.registration_id = registration_id
        elif volunteer_type == "individual":
            volunteer.government_id = government_id
        
        volunteer.save()
        return redirect(volunteer_login)

    return render(request, "volunteer_register.html")


def volunteer_login(request):
    """Volunteer login page"""
    return render(request, "volunteer_login.html")


def verify_volunteer(request):
    """Volunteer authentication"""
    if request.method == "POST":
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "").strip()

        try:
            volunteer = Volunteer.objects.get(email=email)
        except Volunteer.DoesNotExist:
            return render(request, "volunteer_login.html", {"error": "Invalid email or password"})

        if volunteer.password != password:
            return render(request, "volunteer_login.html", {"error": "Invalid email or password"})

        # Set volunteer session
        request.session["volunteer_id"] = volunteer.id
        request.session["volunteer_email"] = volunteer.email
        request.session["user_type"] = "volunteer"

        return redirect(volunteer_dashboard)

    return render(request, "volunteer_login.html")


def volunteer_dashboard(request):
    """Volunteer dashboard showing tasks and credits"""
    if not request.session.get('volunteer_id'):
        return redirect(volunteer_login)
    
    volunteer = Volunteer.objects.get(id=request.session['volunteer_id'])
    
    # Create some sample tasks if none exist (for demo purposes)
    if VolunteerTask.objects.count() == 0:
        create_sample_tasks()
    
    # Get available tasks
    available_tasks = VolunteerTask.objects.filter(status='available').order_by('-created_at')[:10]
    
    # Get accepted tasks by this volunteer
    accepted_tasks = VolunteerTask.objects.filter(
        assigned_volunteer=volunteer, 
        status='accepted'
    ).order_by('-created_at')
    
    # Get completed tasks by this volunteer
    completed_tasks = VolunteerTask.objects.filter(
        assigned_volunteer=volunteer, 
        status='completed'
    ).order_by('-completed_at')[:5]
    
    context = {
        'volunteer': volunteer,
        'available_tasks': available_tasks,
        'accepted_tasks': accepted_tasks,
        'completed_tasks': completed_tasks,
    }
    
    return render(request, "volunteer_dashboard.html", context)


def create_volunteer_task_from_donation(donor_or_ngo, task_type, title, description, location, quantity=None):
    """Helper function to create volunteer tasks when donations are posted"""
    task = VolunteerTask.objects.create(
        title=title,
        description=description,
        task_type=task_type,
        pickup_location=location,
        food_quantity=quantity or "Not specified",
        credit_reward=10 if task_type == 'pickup' else 15,
        donor=donor_or_ngo if donor_or_ngo.user_type == 'donor' else None,
        ngo=donor_or_ngo if donor_or_ngo.user_type == 'ngo' else None,
    )
    return task


def create_sample_tasks():
    """Create sample tasks for demo purposes"""
    sample_tasks = [
        {
            'title': 'Food Collection from Hotel Taj',
            'description': 'Collect surplus food from Hotel Taj and deliver to nearby NGO. Approximately 20kg of cooked food available.',
            'task_type': 'pickup',
            'pickup_location': 'Hotel Taj, MG Road, Downtown',
            'delivery_location': 'Hope Foundation, Church Street',
            'food_quantity': '20kg cooked meals',
            'credit_reward': 15,
        },
        {
            'title': 'Bakery Surplus Distribution',
            'description': 'Pick up day-old bread and pastries from City Bakery and distribute to homeless shelter.',
            'task_type': 'delivery',
            'pickup_location': 'City Bakery, Park Avenue',
            'delivery_location': 'Homeless Shelter, Railway Station',
            'food_quantity': '50 bread loaves + pastries',
            'credit_reward': 12,
        },
        {
            'title': 'Wedding Hall Food Rescue',
            'description': 'Large amount of surplus food available from a wedding function. Need volunteers for immediate pickup.',
            'task_type': 'pickup',
            'pickup_location': 'Grand Wedding Hall, Sector 15',
            'delivery_location': 'Multiple NGOs in the area',
            'food_quantity': '100+ meals',
            'credit_reward': 20,
        },
        {
            'title': 'Restaurant Chain Food Collection',
            'description': 'Daily food collection from popular restaurant chain. Looking for regular volunteers.',
            'task_type': 'pickup',
            'pickup_location': 'Pizza Corner, Mall Road',
            'delivery_location': 'Care Foundation, Nehru Nagar',
            'food_quantity': '15-20 pizzas',
            'credit_reward': 10,
        },
        {
            'title': 'Community Kitchen Support',
            'description': 'Help distribute meals prepared by community kitchen to various locations in the city.',
            'task_type': 'delivery',
            'pickup_location': 'Community Kitchen, Gandhi Square',
            'delivery_location': 'Various slum areas',
            'food_quantity': '50 meal packets',
            'credit_reward': 18,
        },
    ]
    
    for task_data in sample_tasks:
        VolunteerTask.objects.create(**task_data)


def donor_post_food(request):
    """Example view for donors to post available food - creates volunteer tasks automatically"""
    if not request.session.get('login_id'):
        return redirect(login)

    donor = register_users.objects.get(id=request.session['login_id'])

    if request.method == "POST":
        food_type = request.POST.get("food_type", "")
        quantity = request.POST.get("quantity", "")
        location = request.POST.get("location", "")
        description = request.POST.get("description", "")

        # Create volunteer task automatically
        title = f"Food Collection: {food_type}"
        task_description = f"Collect {quantity} of {food_type} from {donor.name}. {description}"

        create_volunteer_task_from_donation(
            donor_or_ngo=donor,
            task_type='pickup',
            title=title,
            description=task_description,
            location=location,
            quantity=quantity
        )

        messages.success(request, "Food posted successfully! Volunteers have been notified.")
        return redirect(donor_home)

    return render(request, 'donor_post_food.html')


def ngo_request_food(request):
    """Example view for NGOs to request food - creates volunteer tasks automatically"""
    if not request.session.get('login_id'):
        return redirect(login)

    ngo = register_users.objects.get(id=request.session['login_id'])

    if request.method == "POST":
        food_needed = request.POST.get("food_needed", "")
        quantity = request.POST.get("quantity", "")
        location = request.POST.get("location", "")
        description = request.POST.get("description", "")

        # Create volunteer task automatically
        title = f"Food Needed: {food_needed}"
        task_description = f"Help deliver {quantity} of {food_needed} to {ngo.name}. {description}"

        create_volunteer_task_from_donation(
            donor_or_ngo=ngo,
            task_type='delivery',
            title=title,
            description=task_description,
            location=location,
            quantity=quantity
        )

        messages.success(request, "Food request posted successfully! Volunteers have been notified.")
        return redirect(ngo_dashboard)

    return render(request, 'ngo_request_food.html')


def accept_task(request, task_id):
    """Volunteer accepts a task"""
    if not request.session.get('volunteer_id'):
        return redirect(volunteer_login)
    
    volunteer = Volunteer.objects.get(id=request.session['volunteer_id'])
    
    try:
        task = VolunteerTask.objects.get(id=task_id, status='available')
        task.status = 'accepted'
        task.assigned_volunteer = volunteer
        task.save()
        messages.success(request, f'Task "{task.title}" accepted successfully!')
    except VolunteerTask.DoesNotExist:
        messages.error(request, 'Task not available or already taken.')
    
    return redirect(volunteer_dashboard)


def complete_task(request, task_id):
    """Mark task as completed and award credits"""
    if not request.session.get('volunteer_id'):
        return redirect(volunteer_login)
    
    volunteer = Volunteer.objects.get(id=request.session['volunteer_id'])
    
    try:
        task = VolunteerTask.objects.get(
            id=task_id, 
            assigned_volunteer=volunteer,
            status='accepted'
        )
        
        # Mark task as completed
        task.status = 'completed'
        task.completed_at = timezone.now()
        task.save()
        
        # Award social credits
        volunteer.social_credits += task.credit_reward
        volunteer.tasks_completed += 1
        volunteer.save()
        
        # Create credit history record
        SocialCredit.objects.create(
            volunteer=volunteer,
            task=task,
            credits_earned=task.credit_reward,
            description=f"Completed task: {task.title}"
        )
        
        messages.success(request, f'Task completed! You earned {task.credit_reward} social credits!')
        
    except VolunteerTask.DoesNotExist:
        messages.error(request, 'Task not found or not assigned to you.')
    
    return redirect(volunteer_dashboard)


def logout(request):
    request.session.flush()
    return redirect(index)


def reports(request):
    return render(request, "reports.html")

def settings(request):
    return render(request, "settings.html")