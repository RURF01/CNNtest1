


let model;
let canvas;
let ctx;
let drawing = false;

// Función para cargar el modelo
async function loadModel() {
    // Cambié la URL del modelo a la que proporcionaste en tu código
    model = await tf.loadLayersModel('https://github.com/RURF01/CNNtest1/raw/main/numeros_conv/model.json');
    console.log("Modelo cargado correctamente.");
}

function startDrawing(event) {
    drawing = true;
    draw(event);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(event) {
    if (!drawing) return;

    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

function preprocessCanvas(image) {
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .expandDims(2)
        .expandDims()
        .toFloat();
    return tensor.div(255.0);
}

async function predict() {
    let tensor = preprocessCanvas(canvas);
    // Cambié el método para esperar la promesa de predict
    const prediction = await model.predict(tensor).data();
    let results = Array.from(prediction);
    displayResult(results);
}

function displayResult(results) {
    const maxIndex = results.indexOf(Math.max(...results));
    document.getElementById('prediction').innerText = maxIndex;
}

window.onload = function () {
    loadModel();

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchmove', function (event) {
        let touch = event.touches[0];
        let mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    document.getElementById('predict-button').addEventListener('click', predict);
};