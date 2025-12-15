// if(!localStorage.getItem("ngoLogin")){
//   location.href="login.html";
// }

// Live Time
setInterval(()=>{
  document.getElementById("time").innerText =
    new Date().toLocaleString();
},1000);

// Dummy Data
let donors = [
  "Ravi – 2km – 20 meals",
  "Anita – 1km – Packed food",
  "Hotel Grand – 3km – Buffet"
];

let alerts = [
  "New donation received",
  "Food expiring in 1 hour",
  "Pickup delayed"
];

let pickups = [
  {id:101,place:"Sector 21"},
  {id:102,place:"MG Road"}
];

// Render
function load(){
  donors.forEach(d=>{
    donorsList.innerHTML += `<li>${d}</li>`;
  });

  alerts.forEach(a=>{
    alertsList.innerHTML += `<li>🔔 ${a}</li>`;
  });

  pickups.forEach(p=>{
    pickupBox.innerHTML += `
      <div>
        <p>ID ${p.id} – ${p.place}</p>
        <button onclick="confirm(${p.id})">Confirm</button>
      </div>`;
  });
}

const donorsList = document.getElementById("donors");
const alertsList = document.getElementById("alerts");
const pickupBox = document.getElementById("pickups");

load();

function confirm(id){
  localStorage.setItem("pickupId",id);
  location.href="pickup-confirm.html";
}
