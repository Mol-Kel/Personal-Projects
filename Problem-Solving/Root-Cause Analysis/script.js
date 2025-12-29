const data = {
    problem: "",
    whys: [],
    fishbone: {},
    actions: []
};

function switchTab(tabName) {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));

    event.target.classList.add("active");
    document.getElementById(tabName).classList.add("active");
}

function analyzeWhys() {
    const problem = document.getElementById("problem").value;
    if (!problem) {
        alert("Please enter a problem statement first.");
        return;
    }

    data.problem = problem;
    data.whys = [];

    for (let i = 1; i <= 5; i++) {
        const why = document.getElementById(`why${i}`).value;
        if (why) data.whys.push(why);
    }

    if (data.whys.length === 0) {
        alert('Please enter at least one "why" to analyze.');
        return;
    }

    generateReport();
    document.querySelector("[onclick=\"switchTab('report')\"]").click();
}

function clearWhys() {
    document.getElementById("problem").value = "";
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`why${i}`).value = "";
    }
}

function drawFishbone() {
    const canvas = document.getElementById("fishboneCanvas");
    const ctx = canvas.getContext("2d");

    canvas.style.display = "block";
    canvas.width = canvas.offsetWidth;
    canvas.height = 500;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const headX = canvas.width - 50;

    // Draw spine
    ctx.strokeStyle = "#667eea";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, centerY);
    ctx.lineTo(headX, centerY);
    ctx.stroke();

    // Draw head
    ctx.beginPath();
    ctx.arc(headX + 20, centerY, 25, 0, Math.PI * 2);
    ctx.fillStyle = "#667eea";
    ctx.fill();

    const effect = document.getElementById("effect").value || "Problem";
    ctx.fillStyle = "white";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Effect", headX + 20, centerY);

    // Categories and positions
    const categories = [
        { name: "People", id: "people", y: centerY - 120, side: "top" },
        { name: "Process", id: "process", y: centerY - 80, side: "top" },
        { name: "Equipment", id: "equipment", y: centerY - 40, side: "top" },
        { name: "Materials", id: "materials", y: centerY + 40, side: "bottom" },
        { name: "Environment", id: "environment", y: centerY + 80, side: "bottom" },
        { name: "Management", id: "management", y: centerY + 120, side: "bottom" }
    ];

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#764ba2";

    categories.forEach((cat, i) => {
        const x = 150 + i * 100;
        const value = document.getElementById(cat.id).value;

        // Draw bone
        ctx.beginPath();
        ctx.moveTo(x, centerY);
        ctx.lineTo(x, cat.y);
        ctx.stroke();

        // Draw label
        ctx.fillStyle = "#333";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(cat.name, x, cat.y - 10);

        // Draw value
        if (value) {
            ctx.font = "11px Arial";
            ctx.fillStyle = "#666";
            const words = value.split(" ");
            let line = "";
            let lineY = cat.y - 25;

            words.forEach((word) => {
                if (line.length + word.length < 15) {
                    line += word + " ";
                } else {
                    ctx.fillText(line, x, lineY);
                    line = word + " ";
                    lineY -= 12;
                }
            });
            ctx.fillText(line, x, lineY);
        }
    });

    data.fishbone = {
        effect: effect,
        people: document.getElementById("people").value,
        process: document.getElementById("process").value,
        equipment: document.getElementById("equipment").value,
        materials: document.getElementById("materials").value,
        environment: document.getElementById("environment").value,
        management: document.getElementById("management").value
    };
}

function generateReport() {
    const results = document.getElementById("results");
    const content = document.getElementById("reportContent");

    let html = `
                <div class="root-cause">
                    <strong>Problem Statement:</strong><br>
                    ${data.problem}
                </div>
            `;

    if (data.whys.length > 0) {
        html += `<div class="root-cause">
                    <strong>5 Whys Analysis:</strong><br>`;
        data.whys.forEach((why, i) => {
            html += `<br><strong>Why ${i + 1}:</strong> ${why}`;
        });
        html += `<br><br><strong>Root Cause:</strong> ${data.whys[data.whys.length - 1]}`;
        html += `</div>`;
    }

    if (Object.keys(data.fishbone).length > 0 && data.fishbone.effect) {
        html += `<div class="root-cause">
                    <strong>Fishbone Analysis:</strong><br>
                    <strong>Effect:</strong> ${data.fishbone.effect}<br>`;

        const cats = ["people", "process", "equipment", "materials", "environment", "management"];
        cats.forEach((cat) => {
            if (data.fishbone[cat]) {
                html += `<br><strong>${cat.charAt(0).toUpperCase() + cat.slice(1)}:</strong> ${data.fishbone[cat]}`;
            }
        });
        html += `</div>`;
    }

    if (data.actions.length > 0) {
        html += `<div class="root-cause">
                    <strong>Corrective Actions:</strong><br>`;
        data.actions.forEach((action, i) => {
            html += `<div class="action-item">${i + 1}. ${action}</div>`;
        });
        html += `</div>`;
    }

    content.innerHTML = html;
    results.style.display = "block";
}

function addActions() {
    const actions = document.getElementById("actions").value;
    if (!actions) {
        alert("Please enter corrective actions.");
        return;
    }

    data.actions = actions.split("\n").filter((a) => a.trim());
    generateReport();
}
