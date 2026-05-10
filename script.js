const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

const clearBtn = document.getElementById("clearBtn");
const predictionsDiv = document.getElementById("predictions");

const GRID_SIZE = 28;

let drawing = false;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function setupPredictions() {

    for (let i = 0; i < 10; i++) {

        const wrapper = document.createElement("div");
        wrapper.className = "prediction-bar";

        const label = document.createElement("div");
        label.id = `label-${i}`;
        label.innerText = `${i}: 0%`;

        const barContainer = document.createElement("div");
        barContainer.className = "bar-container";

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.id = `bar-${i}`;

        barContainer.appendChild(bar);

        wrapper.appendChild(label);
        wrapper.appendChild(barContainer);

        predictionsDiv.appendChild(wrapper);
    }
}

setupPredictions();

function draw(x, y) {

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

canvas.addEventListener("mousedown", () => {

    drawing = true;
});

canvas.addEventListener("mouseup", () => {

    drawing = false;
});

canvas.addEventListener("mouseleave", () => {

    drawing = false;
});

canvas.addEventListener("mousemove", (e) => {

    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    draw(x, y);

    updatePredictions();
});

clearBtn.addEventListener("click", () => {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updatePredictions();
});

function updatePredictions() {

    let values = [];
    let total = 0;

    for (let i = 0; i < 10; i++) {

        const value = Math.random();

        values.push(value);

        total += value;
    }

    for (let i = 0; i < 10; i++) {

        const prob = values[i] / total;

        const percent = (prob * 100).toFixed(1);

        document.getElementById(
            `label-${i}`
        ).innerText = `${i}: ${percent}%`;

        document.getElementById(
            `bar-${i}`
        ).style.width = `${percent}%`;
    }
}

updatePredictions();