const canvas = document.getElementById("my-canvas"); 
const ctx = canvas.getContext("2d"); 
canvas.width = 800; 
canvas.height = 800; 
const rainWidth = 5; 
const rainHeight = 30; 
const grassHeight = 160; 
const stemWidth = 10; 
const stemHeight = 200; 
const flowerSize = 10; 
const numFlowers = 100; 
const numRain = 20; 
const rotorWidth = 30; 
const rotorLength = 300; 
let angle = 0; 

// UTILITIES

// random integer generator
const getRandomInt = (min, max) => {
    // designed to take in floats or integers
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    // multiply by the range, and add the minimum
    // example with range 2-5: generated 0.3 (-> multiply by 3) = 0.9 (-> add 2) = 2.9 (-> floor) = 2
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

// ATTRIBUTES

const stemObject = {xCoords: [], yCoords: []}; 
let flowerColors = ["#b11e88", "#ea0061", "#fe7496", "#fcc439", "#f9e4f3"]; 
// fill stem list with random x and y locations in the ground area
for (let i = 0; i < numFlowers; i++) {
    stemObject.xCoords.push(getRandomInt(0, canvas.width)); 
    stemObject.yCoords.push(getRandomInt(canvas.height - grassHeight, canvas.height)); 
}


// draw background
const drawBackground = () => {
    ctx.fillStyle = "skyblue"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
}

// draw rain 
const drawRain = () => {
    const drawDroplet = (rainX, rainY) => {
        ctx.fillStyle = "blue"; 
        ctx.fillRect(rainX, rainY, rainWidth, rainHeight); 
    }
    for (let i = 0; i < numRain; i++) {
        drawDroplet(getRandomInt(0, canvas.width), getRandomInt(0, canvas.height)); 
    }
}

// animate the flower rotating
const rotateFlower = () => {
    angle += Math.PI / 50; 
    for (let i = 0; i < numFlowers; i++) {
        let currX = stemObject.xCoords[i]; 
        let currY = stemObject.yCoords[i]; 
        let currColor = flowerColors[i % flowerColors.length]; 
        
        // save current state and set origin to the center of the flower
        ctx.save(); 
        ctx.translate(currX + stemWidth / 2, currY - stemHeight); 
        ctx.rotate(angle); 
        // draw flower
        ctx.fillStyle = currColor; 
        ctx.beginPath(); 
        ctx.arc(-flowerSize, -flowerSize, flowerSize, 0, 2*Math.PI); 
        ctx.fill(); 
        ctx.beginPath(); 
        ctx.arc(flowerSize, -flowerSize, flowerSize, 0, 2*Math.PI); 
        ctx.fill(); 
        ctx.beginPath(); 
        ctx.arc(flowerSize, flowerSize, flowerSize, 0, 2*Math.PI); 
        ctx.fill(); 
        ctx.beginPath(); 
        ctx.arc(-flowerSize, flowerSize, flowerSize, 0, 2*Math.PI); 
        ctx.fill(); 
        ctx.beginPath(); 
        ctx.fillStyle = "yellow"; 
        ctx.arc(0, 0, flowerSize / 2, 0, 2*Math.PI); 
        ctx.fill(); 
        // restore to previous state so that next flower can be rotated
        ctx.restore(); 
    }
    // reset angle to 0 if close to 2*PI (to prevent overflow)
    if (angle >= 2*Math.PI - Math.PI / 100 && angle <= 2*Math.PI + Math.PI / 100) {
        angle = 0; 
    }
}

// draw ground and stems
const drawGroundAndStems = () => {
    // draw ground
    ctx.fillStyle = "#0d4930"; 
    ctx.fillRect(0, canvas.height - grassHeight, canvas.width, grassHeight); 
    // draw stem 
    ctx.fillStyle = "green"; 
    for (let i = 0; i < numFlowers; i++) {
        let currX = stemObject.xCoords[i]; 
        let currY = stemObject.yCoords[i]; 
        ctx.fillRect(currX, currY - stemHeight, stemWidth, stemHeight);
    }
}

// draw windmill base
const drawWindmillBase = () => {
    const windmillWidth = 150; 
    const bottomLeft = [canvas.width / 2 - windmillWidth / 2, canvas.height - grassHeight];  
    const bottomRight = [canvas.width / 2 + windmillWidth / 2, canvas.height - grassHeight];  
    const topLeft = [canvas.width / 2 - windmillWidth / 4, grassHeight * 2]; 
    const topRight = [canvas.width / 2 + windmillWidth / 4, grassHeight * 2]; 
    // draw windmill top
    ctx.fillStyle = "grey"; 
    ctx.beginPath(); 
    ctx.arc(canvas.width / 2, topLeft[1], windmillWidth / 4, 0, 2 * Math.PI); 
    ctx.fill(); 
    // draw windmill base
    ctx.fillStyle = "saddlebrown"; 
    ctx.beginPath(); 
    ctx.moveTo(topLeft[0], topLeft[1]); 
    ctx.lineTo(bottomLeft[0], bottomLeft[1]); 
    ctx.lineTo(bottomRight[0], bottomRight[1]); 
    ctx.lineTo(topRight[0], topRight[1]); 
    ctx.lineTo(topLeft[0], topLeft[1]); 
    ctx.fill();
}

// rotate windmill 
const rotateWindmill = () => {
    center = [canvas.width / 2, grassHeight * 2]; 
    ctx.save(); 
    ctx.translate(center[0], center[1]); 
    ctx.rotate(angle); 
    ctx.fillStyle = "white"; 
    ctx.fillRect(rotorWidth / 2, -rotorWidth / 2, rotorLength, rotorWidth); 
    ctx.fillRect(-rotorWidth / 2, -rotorWidth / 2, -rotorLength, rotorWidth); 
    ctx.fillRect(rotorWidth / 2, rotorWidth / 2, -rotorWidth, rotorLength); 
    ctx.fillRect(rotorWidth / 2, -rotorWidth / 2, -rotorWidth, -rotorLength); 
    ctx.fillStyle = "black"; 
    ctx.fillRect(-rotorWidth / 2, -rotorWidth / 2, rotorWidth, rotorWidth); 
    ctx.restore(); 
}

// main loop
const main = () => {
    drawBackground(); 
    drawWindmillBase(); 
    rotateWindmill(); 
    drawGroundAndStems(); 
    rotateFlower(); 
    drawRain(); 
}
setInterval(main, 20); 
