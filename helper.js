const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
curentPose = "non"

function checkHandCondition(landmarks) {
    allSame = false;
    pointx5 = Math.floor(landmarks[5].x * 10);
    pointx6 = Math.floor(landmarks[6].x * 10);
    pointx7 = Math.floor(landmarks[7].x * 10);
    pointx8 = Math.floor(landmarks[8].x * 10);
    // console.log(landmarks);
    pointy5 = Math.floor(landmarks[5].y * 10);
    pointy6 = Math.floor(landmarks[6].y * 10);
    pointy7 = Math.floor(landmarks[7].y * 10);
    pointy8 = Math.floor(landmarks[8].y * 10);
    //
    pointy5 = Math.floor(landmarks[5].y * 10);
    pointy6 = Math.floor(landmarks[6].y * 10);
    pointy7 = Math.floor(landmarks[7].y * 10);
    pointy8 = Math.floor(landmarks[8].y * 10);

    firstPoint = pointx5;
    secondPoint = pointy5;
    if (firstPoint == pointx6 &&
        firstPoint == pointx7 &&
        firstPoint == pointx8) {
        if (pointy8 > pointy5) {
            if (curentPose != "Down") {
                console.log("Down");
                curentPose = "Down";
                key_map=1;
            }
        }
        else if (curentPose != "Up") {
            console.log("Up");
            curentPose = "Up";
            key_map=0;
        }

    }
    else if (secondPoint == pointy6 &&
        secondPoint == pointy7 &&
        secondPoint == pointy8) {
        if (pointx8 > pointx5) {
            if (curentPose != "Right") {
                console.log("Right");
                curentPose = "Right";
                key_map=3;
            }
        }
        else if (curentPose != "Left") {
            console.log("Left");
            curentPose = "Left";
            key_map=2;
        }
    }
    // {
    //     console.log("Not in same line");
    // }
}

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            checkHandCondition(landmarks);
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                { color: '#00FF00', lineWidth: 5 });
            drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }
    }
    canvasCtx.restore();
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});
hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 240,
    height: 120
});
camera.start();


/////////////////////////////////////////////////////////////////////////////////
const CONTROLS = ['up', 'down', 'left', 'right', 'noaction'];
const CONTROL_CODES = [38, 40, 37, 39, -1];

function UI_() {
  this.addExampleHandler;
  this.thumbDisplayed = {};

  this.statusElement = document.getElementById('status');
  this.trainStatusElement = document.getElementById('train-status');
  this.learningRateElement = document.getElementById('learningRate');
  this.batchSizeFractionElement = document.getElementById('batchSizeFraction');
  this.epochsElement = document.getElementById('epochs');
  this.denseUnitsElement = document.getElementById('dense-units');
// console.log("ooooooooooo ",document.getElementById('up'));
  this.upButton = document.getElementById('up');
  this.downButton = document.getElementById('down');
  this.leftButton = document.getElementById('left');
  this.rightButton = document.getElementById('right');
  this.noactionButton = document.getElementById('noaction');

  this.upButton.addEventListener('mousedown', () => this.handler(0));
  this.upButton.addEventListener('mouseup', () => mouseDown = false);

  this.downButton.addEventListener('mousedown', () => this.handler(1));
  this.downButton.addEventListener('mouseup', () => mouseDown = false);

  this.leftButton.addEventListener('mousedown', () => this.handler(2));
  this.leftButton.addEventListener('mouseup', () => mouseDown = false);

  this.rightButton.addEventListener('mousedown', () => this.handler(3));
  this.rightButton.addEventListener('mouseup', () => mouseDown = false);

  this.noactionButton.addEventListener('mousedown', () => this.handler(4));
  this.noactionButton.addEventListener('mouseup', () => mouseDown = false);

}


UI_.prototype.init = function () {
  document.getElementById('controller').style.display = '';
  this.statusElement.style.display = 'none';
}


// Set hyper params from UI values.
UI_.prototype.getLearningRate = function(){return +this.learningRateElement.value; }
UI_.prototype.getBatchSizeFraction = function(){return +this.batchSizeFractionElement.value;}
UI_.prototype.getEpochs = function(){return +this.epochsElement.value;}
UI_.prototype.getDenseUnits = function(){ return +this.denseUnitsElement.value;}

UI_.prototype.startPacman = function() {
  //google.pacman.startGameplay();
}
var key_map = {
  // 0: 38, //UP
  // 1: 40, //Down
  // 2: 37, //Left
  // 3: 39, //Right
};
UI_.prototype.predictClass = async function(classId)  {
  console.log("class : ",classId);
  this.trainStatus("Pressing " +CONTROLS[classId]);
  // this.statusElement.text = classId;
  //google.pacman.keyPressed(CONTROL_CODES[classId]);
  //document.body.setAttribute('data-active', CONTROLS[classId]);
  if(classId != 4)
    document.dispatchEvent(new KeyboardEvent('keydown',{'keyCode':key_map})); //[classId]
}

UI_.prototype.isPredicting = function() {
  this.statusElement.style.visibility = 'visible';
}
UI_.prototype.donePredicting = function()  {
  this.statusElement.style.visibility = 'hidden';
}
UI_.prototype.trainStatus = function(status) {
  this.trainStatusElement.innerText = status;
}

//export let addExampleHandler;
UI_.prototype.setExampleHandler = function(handler)  {
  this.addExampleHandler = handler;
}

let mouseDown = false;
const totals = [0, 0, 0, 0, 0];


UI_.prototype.handler = async function(label) {
  mouseDown = true;
  const className = CONTROLS[label];
  const button = document.getElementById(className);
  const total = document.getElementById(className + '-total');
  while (mouseDown) {
    this.addExampleHandler(label);
    document.body.setAttribute('data-active', CONTROLS[label]);
    total.innerText = totals[label]++;
    await tf.nextFrame();
  }
  document.body.removeAttribute('data-active');
}

UI_.prototype.draw = function(image, canvas){
  const [width, height] = [224, 224];
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(width, height);
  const data = image.dataSync();
  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
    imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
    imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
    imageData.data[j + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

UI_.prototype.drawThumb = function(img, label) {
  if (this.thumbDisplayed[label] == null) {
    this.thumbCanvas = document.getElementById(CONTROLS[label] + '-thumb');
    this.draw(img, this.thumbCanvas);
  }
}


