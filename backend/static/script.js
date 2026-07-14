// ==========================================
// KRISHIMITRA AI
// script.js
// Part 1 - Navigation & Language
// ==========================================

// ----------------------------
// Show Selected Section
// ----------------------------
function showSection(sectionId) {

    // Hide dashboard
    document.getElementById("dashboard").style.display = "none";

    // Hide all sections
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    // Show selected section
    const selected = document.getElementById(sectionId);

    if (selected) {
        selected.classList.add("active");

        selected.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

}

// ----------------------------
// Back to Dashboard
// ----------------------------
function goBack() {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById("dashboard").style.display = "grid";

    document.getElementById("dashboard").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

// ----------------------------
// Image Preview
// ----------------------------
function previewLeaf(event) {

    const preview = document.getElementById("previewImage");

    if (!event.target.files.length) {
        preview.style.display = "none";
        return;
    }

    preview.src = URL.createObjectURL(event.target.files[0]);
    preview.style.display = "block";

}

// ----------------------------
// Language Translation
// ----------------------------
function changeLanguage() {

    const lang = document.getElementById("language").value;

    const title = document.querySelector(".hero h1");
    const subtitle = document.querySelector(".hero h2");
    const description = document.querySelector(".hero p");

    if (lang === "en") {

        title.innerHTML = "🌾 KrishiMithra AI";

        subtitle.innerHTML =
            "Smart AI Farming Assistant for Every Farmer";

        description.innerHTML =
            "Empowering farmers with Artificial Intelligence to make better farming decisions. Get crop recommendations, detect plant diseases, monitor weather conditions, estimate crop yield, predict profits, and stay updated with market prices—all in one place.";

    }

    else if (lang === "te") {

        title.innerHTML = "🌾 కృషిమిత్ర AI";

        subtitle.innerHTML =
            "ప్రతి రైతుకు స్మార్ట్ AI వ్యవసాయ సహాయకుడు";

        description.innerHTML =
            "కృత్రిమ మేధస్సుతో రైతులకు పంటల సూచనలు, వ్యాధి గుర్తింపు, వాతావరణ సమాచారం, దిగుబడి అంచనా మరియు మార్కెట్ ధరలను అందిస్తుంది.";

    }

    else if (lang === "hi") {

        title.innerHTML = "🌾 कृषिमित्र AI";

        subtitle.innerHTML =
            "हर किसान के लिए स्मार्ट AI कृषि सहायक";

        description.innerHTML =
            "कृत्रिम बुद्धिमत्ता की सहायता से फसल सुझाव, रोग पहचान, मौसम जानकारी, उत्पादन अनुमान और बाजार मूल्य प्राप्त करें।";

    }

}
// ==========================================
// Part 2 - Crop Recommendation
// Climate Advisor
// Cultivation Advisor
// ==========================================

// ----------------------------
// Crop Recommendation
// ----------------------------
function recommendCrop() {

    const soil = document.getElementById("soil").value;
    const season = document.getElementById("season").value;
    const water = document.getElementById("water").value;

    if (soil === "" || season === "" || water === "") {

        alert("Please fill all the fields.");
        return;
    }

    let crop = "";
    let reason = "";

    if (soil === "Black Soil" && season === "Kharif") {

        crop = "🌾 Cotton";
        reason = "Black soil retains moisture and is ideal for cotton.";

    }

    else if (soil === "Black Soil" && season === "Rabi") {

        crop = "🌾 Wheat";
        reason = "Black soil with Rabi season supports wheat cultivation.";

    }

    else if (soil === "Red Soil") {

        crop = "🥜 Groundnut";
        reason = "Groundnut performs well in red soil.";

    }

    else if (soil === "Alluvial Soil") {

        crop = "🌾 Rice";
        reason = "Alluvial soil is rich in nutrients and ideal for rice.";

    }

    else if (soil === "Laterite Soil") {

        crop = "🍵 Tea";
        reason = "Laterite soil supports tea plantations.";

    }

    else if (soil === "Sandy Soil") {

        crop = "🌽 Millets";
        reason = "Millets grow well even in sandy soil.";

    }

    else {

        crop = "🌱 Mixed Crops";
        reason = "Suitable crop could not be determined.";

    }

    document.getElementById("cropResult").innerHTML = `

        <div class="result">

            <h2>✅ Recommended Crop</h2>

            <br>

            <h1>${crop}</h1>

            <br>

            <p>${reason}</p>

        </div>

    `;

}

// ----------------------------
// Climate Information
function getCurrentLocation(){

    if(!navigator.geolocation){

        alert("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async function(position){

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const response = await fetch(

                `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=91050d0db7438126ab3c6ef6c3569c73`

            );

            const data = await response.json();

            if(data.length > 0){

                document.getElementById("district").value = data[0].name;

                getClimate();

            }

        },

        function(){

            alert("Unable to access your location.");

        }

    );

}
async function getClimate() {

    const district = document.getElementById("district").value;

    if (district === "") {
        alert("Please select a district.");
        return;
    }

    document.getElementById("climateResult").innerHTML = `
        <div class="result">
            ⏳ Fetching live weather data...
        </div>
    `;

    try {

        const response = await fetch(`/weather?city=${encodeURIComponent(district)}`);
        const data = await response.json();

        if (data.error) {

            document.getElementById("climateResult").innerHTML = `
                <div class="result">
                    ❌ ${data.error}
                </div>
            `;
            return;

        }

        document.getElementById("climateResult").innerHTML = `

        <div class="result">

            <h2>🌦 Live Climate Report</h2>

            <br>

            🌡 Temperature : <b>${data.temperature}°C</b>

            <br><br>

            💧 Humidity : <b>${data.humidity}%</b>

            <br><br>

            🌥 Condition : <b>${data.condition}</b>

            <br><br>

            💨 Wind Speed : <b>${data.wind} m/s</b>

            <br><br>

            ✅ Suitable for farming based on current weather.

        </div>

        `;

    }

    catch (error) {

        console.log(error);

        document.getElementById("climateResult").innerHTML = `
            <div class="result">
                ❌ Failed to fetch weather data.
            </div>
        `;

    }

}
// ==========================================
// Part 3 - Yield Prediction
// Market Intelligence
// Profit Prediction
// ==========================================

// ----------------------------
// Yield Prediction
// ----------------------------
function predictYield() {

    const crop = document.getElementById("cropName").value.trim();
    const soil = document.getElementById("yieldSoil").value;
    const water = document.getElementById("yieldWater").value;

    if (crop === "" || soil === "" || water === "") {
        alert("Please fill all the fields.");
        return;
    }

    let yieldValue = "🌱 3000 kg/hectare";

    switch (crop.toLowerCase()) {

        case "rice":
            yieldValue = "🌾 4200 kg/hectare";
            break;

        case "cotton":
            yieldValue = "🌿 2800 kg/hectare";
            break;

        case "groundnut":
            yieldValue = "🥜 2500 kg/hectare";
            break;

        case "maize":
            yieldValue = "🌽 3900 kg/hectare";
            break;

        case "wheat":
            yieldValue = "🌾 4100 kg/hectare";
            break;
    }

    document.getElementById("yieldResult").innerHTML = `
        <div class="result">
            <h2>🌾 Estimated Yield</h2>
            <br>
            <h1>${yieldValue}</h1>
            <br>
            <p>Estimated using AI prediction based on crop, soil and irrigation.</p>
        </div>
    `;

}

// ----------------------------
// Market Intelligence
// ----------------------------
function getMarketPrice() {

    const crop = document.getElementById("marketCrop").value;
    const district = document.getElementById("marketDistrict").value;

    if (crop === "" || district === "") {

        alert("Please select crop and district.");
        return;

    }

    let price = "";
    let trend = "";

    switch (crop) {

        case "Rice":
            price = "₹2,280 / Quintal";
            trend = "📈 Increasing";
            break;

        case "Cotton":
            price = "₹7,100 / Quintal";
            trend = "📈 High Demand";
            break;

        case "Groundnut":
            price = "₹6,500 / Quintal";
            trend = "📊 Stable";
            break;

        case "Maize":
            price = "₹2,100 / Quintal";
            trend = "📉 Slightly Down";
            break;

        default:
            price = "₹2,400 / Quintal";
            trend = "📊 Stable";
    }

    document.getElementById("marketResult").innerHTML = `
        <div class="result">
            <h2>💰 Current Market Price</h2>

            <br>

            <h1>${price}</h1>

            <br>

            ${trend}

            <br><br>

            <small>District : ${district}</small>

        </div>
    `;

}

// ----------------------------
// Profit Prediction
// ----------------------------
function calculateProfit() {

    const crop = document.getElementById("profitCrop").value;
    const acres = Number(document.getElementById("landArea").value);

    if (crop === "" || acres <= 0) {

        alert("Please enter valid details.");
        return;

    }

    const income = acres * 60000;
    const expenses = acres * 25000;
    const profit = income - expenses;

    document.getElementById("profitResult").innerHTML = `
        <div class="result">

            <h2>📈 Profit Prediction</h2>

            <br>

            🌾 Estimated Income

            <h3>₹${income.toLocaleString()}</h3>

            <br>

            💸 Estimated Expenses

            <h3>₹${expenses.toLocaleString()}</h3>

            <br>

            ✅ Estimated Profit

            <h2 style="color:#2e7d32;">
            ₹${profit.toLocaleString()}
            </h2>

        </div>
    `;

}
// ==========================================
// Part 4 - Disease Detection
// ==========================================
// ======================================
// Disease Detection
// ======================================

async function detectDisease() {

    const imageInput = document.getElementById("leafImage");

    if (imageInput.files.length === 0) {
        alert("Please select a leaf image.");
        return;
    }

    const file = imageInput.files[0];
    const imageURL = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("image", file);

    // Loading Card
    document.getElementById("diseaseResult").innerHTML = `
    <div style="
    background:white;
    padding:30px;
    border-radius:20px;
    text-align:center;
    box-shadow:0 15px 35px rgba(0,0,0,.15);
    ">

        <h2 style="color:#2e7d32;">
        🤖 AI is analyzing your leaf...
        </h2>

        <br>

        <img
        src="${imageURL}"
        style="
        width:220px;
        border-radius:15px;
        box-shadow:0 10px 20px rgba(0,0,0,.2);
        ">

        <br><br>

        <p>Please wait a few seconds...</p>

    </div>
    `;

    try {

        const response = await fetch("/predict_disease", {

            method: "POST",
            body: formData

        });

        const data = await response.json();
        window.latestDiseaseReport = data;

        if (data.error) {

            document.getElementById("diseaseResult").innerHTML = `
            <div class="result">
                ❌ ${data.error}
            </div>
            `;

            return;

        }

        document.getElementById("diseaseResult").innerHTML = `

<div style="
background:white;
padding:35px;
border-radius:20px;
box-shadow:0 15px 35px rgba(0,0,0,.15);
animation:fade .5s;
">

<h2 style="
text-align:center;
color:#2e7d32;
margin-bottom:25px;
">

🌾 AI Disease Diagnosis Report

</h2>

<div style="text-align:center;">

<img
src="${imageURL}"
style="
width:260px;
max-width:100%;
border-radius:18px;
box-shadow:0 10px 20px rgba(0,0,0,.2);
">

</div>

<hr style="margin:25px 0;">

<h3>🌿 Crop</h3>

<p><b>${data.crop}</b></p>

<h3>🦠 Disease</h3>

<p><b>${data.disease}</b></p>

<h3>🚦 Disease Severity</h3>

<p><b>${data.severity}</b></p>

<h3>🎯 AI Confidence</h3>

<div style="
width:100%;
height:20px;
background:#e8f5e9;
border-radius:20px;
overflow:hidden;
margin-bottom:10px;
">

<div style="
width:${data.confidence}%;
height:100%;
background:linear-gradient(90deg,#43a047,#2e7d32);
">

</div>

</div>

<p>

<b>${data.confidence}%</b>

</p>

<hr style="margin:25px 0;">

<h3>💊 Recommended Medicine</h3>

<p>${data.medicine}</p>

<h3>🌱 Organic Treatment</h3>

<p>${data.organic}</p>

<h3>💧 Watering Advice</h3>

<p>${data.watering}</p>

<h3>🛡 Prevention</h3>

<ul style="padding-left:20px;line-height:2;">

${data.prevention.map(item => `<li>${item}</li>`).join("")}

</ul>

<h3>📅 Suggested Spray Interval</h3>

<p>${data.spray}</p>

<h3>🤖 AI Recommendation</h3>

<div style="
background:#f5fff5;
padding:18px;
border-left:6px solid #43a047;
border-radius:12px;
line-height:1.8;
">

${data.recommendation}

</div>

</div>

`;

    }

    catch (error) {

        console.error(error);

        document.getElementById("diseaseResult").innerHTML = `
        <div class="result">

        ❌ Server Error

        </div>
        `;

    }

}
function downloadReport(){

    if(!window.latestDiseaseReport){

        alert("No report available.");

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const d = window.latestDiseaseReport;

    let y = 20;

    doc.setFontSize(22);
    doc.text("KrishiMithra AI",20,y);

    y+=12;

    doc.setFontSize(16);
    doc.text("Disease Diagnosis Report",20,y);

    y+=18;

    doc.setFontSize(12);

    doc.text(`Crop : ${d.crop}`,20,y);

    y+=10;

    doc.text(`Disease : ${d.disease}`,20,y);

    y+=10;

    doc.text(`Confidence : ${d.confidence}%`,20,y);

    y+=10;

    doc.text(`Severity : ${d.severity}`,20,y);

    y+=10;

    doc.text(`Medicine : ${d.medicine}`,20,y);

    y+=10;

    doc.text(`Organic Treatment : ${d.organic}`,20,y);

    y+=10;

    doc.text(`Watering Advice : ${d.watering}`,20,y);

    y+=15;

    doc.text("Prevention :",20,y);

    y+=10;

    d.prevention.forEach(item=>{

        doc.text("- "+item,25,y);

        y+=8;

    });

    y+=5;

    doc.text(`Spray Interval : ${d.spray}`,20,y);

    y+=12;

    doc.text("AI Recommendation :",20,y);

    y+=10;

    const lines = doc.splitTextToSize(d.recommendation,170);

    doc.text(lines,20,y);

    doc.save("KrishiMithra_AI_Report.pdf");

}