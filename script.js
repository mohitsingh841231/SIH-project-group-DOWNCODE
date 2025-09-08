document.addEventListener("DOMContentLoaded", () => {
  const aiBtn = document.getElementById("ai-btn");
  const aiBox = document.getElementById("ai-box");
  const aiSend = document.getElementById("ai-send");
  const aiInput = document.getElementById("ai-input");
  const aiMessages = document.getElementById("ai-messages");

  // Toggle chatbox
  aiBtn.addEventListener("click", () => {
    aiBox.classList.toggle("hidden");
  });

  // Send message function
  function sendMessage() {
    const userText = aiInput.value.trim();
    if (userText === "") return;

    // Add user message
    const userMsg = document.createElement("p");
    userMsg.textContent = userText;
    userMsg.classList.add("user-msg");
    aiMessages.appendChild(userMsg);

    aiInput.value = "";
    aiMessages.scrollTop = aiMessages.scrollHeight;

    // Simulate AI reply (replace with real API later)
    setTimeout(() => {
      const aiMsg = document.createElement("p");
      aiMsg.textContent = "🤖 " + "I got your message: " + userText;
      aiMsg.classList.add("ai-msg");
      aiMessages.appendChild(aiMsg);
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }, 500);
  }

  // Button click
  aiSend.addEventListener("click", sendMessage);

  // ✅ Enter key press
  aiInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent line break
      sendMessage();
    }
  });
});
document.getElementById("ai-btn").addEventListener("click", function() {
  const aiBox = document.getElementById("ai-box");
  aiBox.style.display = aiBox.style.display === "flex" ? "none" : "flex";
});
const aiBtn = document.getElementById("ai-btn");
const aiBox = document.getElementById("ai-box");
const aiMessages = document.getElementById("ai-messages");
const aiInput = document.getElementById("ai-input");
const aiSend = document.getElementById("ai-send");

// Toggle chat
aiBtn.addEventListener("click", () => {
  aiBox.classList.toggle("hidden");
});

// Fetch beach condition from Open-Meteo API
async function getBeachCondition(lat, lon, beachName) {
  try {
    const url = `https://api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wind_speed,water_temperature`;
    const res = await fetch(url);
    const data = await res.json();

    const waveHeight = data.hourly.wave_height[0];
    const windSpeed = data.hourly.wind_speed[0];
    const waterTemp = data.hourly.water_temperature[0];

    return `🌴 Conditions at <b>${beachName}</b>:<br>
            🌊 Wave Height: ${waveHeight} m<br>
            💨 Wind Speed: ${windSpeed} m/s<br>
            🌡️ Water Temp: ${waterTemp} °C`;
  } catch {
    return "⚠️ Unable to fetch beach conditions right now.";
  }
}

// Send message
async function sendMessage() {
  const msg = aiInput.value.trim();
  if (!msg) return;

  aiMessages.innerHTML += `<p class="user-msg">${msg}</p>`;
  aiInput.value = "";
  aiMessages.scrollTop = aiMessages.scrollHeight;

  let reply;
  if (msg.toLowerCase().includes("goa")) {
    reply = await getBeachCondition(15.2993, 74.1240, "Goa Beach");
  } else if (msg.toLowerCase().includes("miami")) {
    reply = await getBeachCondition(25.7617, -80.1918, "Miami Beach");
  } else if (msg.toLowerCase().includes("bondi")) {
    reply = await getBeachCondition(-33.8908, 151.2743, "Bondi Beach");
  } else {
    reply = "❓ Try asking about Goa, Miami, or Bondi beach.";
  }

  aiMessages.innerHTML += `<p class="ai-msg">${reply}</p>`;
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

aiSend.addEventListener("click", sendMessage);
aiInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
// script.js - AI assistant (clean, single instance)
document.addEventListener("DOMContentLoaded", () => {
  const aiBtn = document.getElementById("ai-btn");
  const aiBox = document.getElementById("ai-box");
  const aiMessages = document.getElementById("ai-messages");
  const aiInput = document.getElementById("ai-input");
  const aiSend = document.getElementById("ai-send");

  // Make sure elements exist
  if (!aiBtn || !aiBox || !aiMessages || !aiInput || !aiSend) {
    console.error("AI assistant elements missing from DOM.");
    return;
  }

  // Beach database (extend as needed)
  const BEACHES = [
    { key: "goa",   name: "Goa",   lat: 15.2993, lon: 74.1240 },
    { key: "miami", name: "Miami", lat: 25.7907, lon: -80.1300 },
    { key: "bondi", name: "Bondi", lat: -33.8908, lon: 151.2743 }
  ];

  // Toggle chat box (single unified approach)
  aiBtn.addEventListener("click", () => {
    aiBox.classList.toggle("hidden");
    if (!aiBox.classList.contains("hidden")) aiInput.focus();
  });

  // Helper: find beach by user message
  function findBeach(query) {
    const q = query.toLowerCase();
    return BEACHES.find(b => q.includes(b.key) || q.includes(b.name.toLowerCase()));
  }

  // Helper: find nearest time index for returned hourly times
  function findNearestTimeIndex(times) {
    if (!Array.isArray(times) || times.length === 0) return 0;
    const now = Date.now();
    let bestIdx = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < times.length; i++) {
      const t = Date.parse(times[i]); // ISO -> ms
      const diff = Math.abs(t - now);
      if (diff < bestDiff) { bestDiff = diff; bestIdx = i; }
    }
    return bestIdx;
  }

  // Fetch data from Open-Meteo Marine API (no API key required)
  async function getBeachCondition(lat, lon, name) {
    try {
      const url = `https://api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
                  `&hourly=wave_height,wave_direction,wave_period,sea_surface_temperature`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response not ok: " + res.status);
      const data = await res.json();
      const hourly = data.hourly || {};
      const times = hourly.time || [];
      if (times.length === 0) {
        return `⚠️ No marine data available for <b>${escapeHtml(name)}</b>.`;
      }
      const idx = findNearestTimeIndex(times);

      const waveHeight = hourly.wave_height?.[idx];
      const waveDir    = hourly.wave_direction?.[idx];
      const wavePeriod = hourly.wave_period?.[idx];
      const sst        = hourly.sea_surface_temperature?.[idx];

      const parts = [];
      if (waveHeight != null) parts.push(`🌊 Wave height: ${waveHeight} m`);
      if (waveDir    != null) parts.push(`🧭 Wave direction: ${Math.round(waveDir)}°`);
      if (wavePeriod != null) parts.push(`⏱ Wave period: ${wavePeriod} s`);
      if (sst        != null) parts.push(`🌡 Sea temp: ${sst} °C`);

      if (parts.length === 0) {
        return `⚠️ No numeric marine values returned for <b>${escapeHtml(name)}</b>.`;
      }
      return `🌴 Conditions at <b>${escapeHtml(name)}</b>:<br>` + parts.join("<br>");
    } catch (err) {
      console.error("getBeachCondition error:", err);
      return "⚠️ Unable to fetch beach conditions right now. (Check console/network)";
    }
  }

  // Helper to escape user-supplied text
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // UI helpers
  function appendUser(msg) {
    const p = document.createElement("p");
    p.className = "user-msg";
    p.textContent = msg;
    aiMessages.appendChild(p);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }
  function appendAI(html) {
    const p = document.createElement("p");
    p.className = "ai-msg";
    p.innerHTML = html;
    aiMessages.appendChild(p);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  // typing indicator
  function showTyping() {
    const p = document.createElement("p");
    p.className = "ai-msg";
    p.id = "ai-typing";
    p.textContent = "BLU AI is thinking…";
    aiMessages.appendChild(p);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }
  function hideTyping() {
    const el = document.getElementById("ai-typing");
    if (el) el.remove();
  }

  // Prevent double send
  let sending = false;

  // Main send handler
  async function handleSend() {
    if (sending) return;
    const text = aiInput.value.trim();
    if (!text) return;
    sending = true;

    appendUser(text);
    aiInput.value = "";

    const beach = findBeach(text);
    if (!beach) {
      appendAI("❓ I couldn't identify that beach. Try: Goa, Miami, or Bondi (or type 'Goa beach').");
      sending = false;
      return;
    }

    showTyping();
    const reply = await getBeachCondition(beach.lat, beach.lon, beach.name);
    hideTyping();
    appendAI(reply);
    sending = false;
  }

  // events
  aiSend.addEventListener("click", handleSend);
  aiInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  });

  // optional: close when clicking outside
  document.addEventListener("click", (e) => {
    if (!aiBox.classList.contains("hidden")) {
      const inside = aiBox.contains(e.target) || aiBtn.contains(e.target);
      if (!inside) aiBox.classList.add("hidden");
    }
  });

  // initial: ensure chat hidden
  aiBox.classList.add("hidden");
});


