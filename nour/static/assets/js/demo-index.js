
/* ========= REAL CUT-FREE INFINITE LOOP ========= */


const track = document.getElementById("scrollTrack");

/* Duplicate content */
track.innerHTML += track.innerHTML;

let scrollPos = 0;
let speed = 0.5; // adjust for speed

function animateScroll() {
  scrollPos += speed;

  if (scrollPos >= track.scrollWidth / 2) {
    scrollPos = 0;
  }

  track.style.transform = `translateX(${-scrollPos}px)`;
  requestAnimationFrame(animateScroll);
}

animateScroll();

/* Pause on hover */
track.addEventListener("mouseenter", () => speed = 0);
track.addEventListener("mouseleave", () => speed = 0.5);

/* Accessibility: respect reduced motion */
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  speed = 0;
}
let currentOtp = null;
let otpVerified = false;

function randomOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
const entry = document.getElementById("pageEntry");
const content = document.querySelector(".page-content");

if (sessionStorage.getItem("entryPlayed")) {
  // Already played → skip animation
  if (entry) entry.remove();
  content.style.opacity = "1";
} else {
  // First time → play animation
  sessionStorage.setItem("entryPlayed", "true");

  setTimeout(() => {
    entry.style.opacity = "0";
    entry.style.transition = "opacity 0.6s ease";
  }, 1200);

  setTimeout(() => {
    entry.remove();
    content.style.opacity = "1";
  }, 1800);
}

function sendOtp() {
  // choose method
  const method = document.querySelector('input[name="otp-method"]:checked').value;
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('mobile').value.trim();

  // basic presence checks
  if (method === 'email' && !email) { alert('Enter email first'); return; }
  if (method === 'phone' && !/^[0-9]{10}$/.test(phone)) { alert('Enter valid 10-digit phone first'); return; }

  currentOtp = randomOtp();
  otpVerified = false;

  // show OTP input UI
  document.querySelector('.otp-input-box').style.display = 'block';
  document.getElementById('otpInput').value = '';

  // update status — since no backend, we show simulated delivery info
  const statusEl = document.getElementById('otpStatus');
  statusEl.textContent = `OTP sent to ${method === 'email' ? 'email' : 'phone'} (SIMULATED).`;
  document.getElementById('otpResult').textContent = '';

  // For demo only: show the OTP in an alert so you can test verify easily.
  // In a real app you must NOT reveal the OTP to the user like this.
  alert('SIMULATED OTP (for testing): ' + currentOtp);
}

function verifyOtp() {
  const val = document.getElementById('otpInput').value.trim();
  const resultEl = document.getElementById('otpResult');

  if (!currentOtp) {
    resultEl.textContent = 'Please send OTP first.';
    resultEl.style.color = 'crimson';
    return;
  }

  if (val === currentOtp) {
    otpVerified = true;
    resultEl.textContent = 'OTP verified ✓';
    resultEl.style.color = 'green';
  } else {
    otpVerified = false;
    resultEl.textContent = 'Wrong OTP — try again.';
    resultEl.style.color = 'crimson';
  }
}

function handleRegister(e) {
  e.preventDefault();

  // Basic checks
  const ngo = document.getElementById('ngoName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('mobile').value.trim();
  const address = document.getElementById('address').value.trim();
  const pincode = document.getElementById('pincode').value.trim();

  if (!ngo || !email || !phone || !address || !pincode) {
    alert('Please fill all required fields.');
    return;
  }

  if (!otpVerified) {
    alert('Please verify OTP before submitting registration.');
    return;
  }

  // Demo: show collected data (in real app submit to server)
  const data = { ngo, email, phone, address, pincode };
  alert('Registration successful (demo).\n\nData:\n' + JSON.stringify(data, null, 2));

  // reset (demo)
  document.getElementById('regForm').reset();
  document.querySelector('.otp-input-box').style.display = 'none';
  document.getElementById('otpStatus').textContent = '';
  document.getElementById('otpResult').textContent = '';
  currentOtp = null;
  otpVerified = false;
}
