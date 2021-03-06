function preload(){

  sound = loadSound('untitled-spirited-version.mp3');
}

var lastTime = 0;
var deltaTime = 0;
var BOX_DIM = 30;
var GRID_DENSITY = 3;
var INTERVAL = BOX_DIM * GRID_DENSITY;
var Z_SPEED = 5;
var FRAME_MULTIPLIER = 0.2;
var nCols, nRows;
function setup(){

  var cnv = createCanvas(600, 600, WEBGL);
  nCols = Math.ceil(width / (GRID_DENSITY * BOX_DIM)) + 1;
  nRows = Math.ceil(height / (GRID_DENSITY * BOX_DIM)) + 1;

  cnv.mouseClicked(togglePlay);

  amplitude = new p5.Amplitude();
  fft = new p5.FFT();

}

function getDeltaTime(){
  var time = millis();
  deltaTime = time - lastTime;
  lastTime = time; 
}

var GRID_FUNCTIONS = {
  rightToLeftdiagonalWave: function(row, col, fc){
    return sin(row + col + fc * FRAME_MULTIPLIER);
  }, 
  concentricSquaresWave: function(row, col, fc){
    var squareLength = nRows < nCols ? nRows : nCols;
    var row = row <= squareLength / 2 ? row : squareLength - row;
    var col = col <= squareLength / 2 ? col : squareLength - col;
    var val = row < col ? row : col;
    return sin(val + fc * FRAME_MULTIPLIER);
  }
};

function drawGrid(offset, gridFn, drawObjFn){
  translate(-width / 2, -height / 2 + INTERVAL / 4, 0);
  for (var i = 0; i < nRows; i++){
    var startLoc = offset * (i % 2);
    translate(startLoc, 0, 0);
    for (var j = 0; j < nCols; j++){
      var t = gridFn(i, j, frameCount);
      var c = setColors(t);
      translate(INTERVAL * j, 0, -Z_SPEED * deltaTime * t);
      drawObjFn(c);
      translate(-INTERVAL * j, 0, Z_SPEED * deltaTime * t);
    }
    translate(-startLoc, INTERVAL, 0); 
  }
}


function setColors(t){
  var red = map(t, 1, -1, 255, 0);
  var green = map(t, 1, -1, 0, 200);
  var blue = 128;
  var alpha = map(t, 1, -1, 50, 100);
  return color(red, green, blue, alpha);
}

function drawRotatingCube(c){
  stroke(0, 0, 0, c[3]);
  fill(c);
  push();
  rotateX(radians(45));
  rotateY(radians(45));
  rotate(radians(frameCount), [1, 1, -1])
  box(BOX_DIM, BOX_DIM, BOX_DIM);
  pop();
}

function drawDot(c){
  noStroke();
  fill(c);
  push();
  ellipse(0, 0, BOX_DIM, BOX_DIM);
  pop();
}

function draw(){
  getDeltaTime();
  var level = amplitude.getLevel();
  var waveform = fft.waveform();
  background(200);
  drawGrid(0, GRID_FUNCTIONS.rightToLeftdiagonalWave, drawRotatingCube);

}

function togglePlay(){
  if (sound.isPlaying()){
    sound.pause();
  } else {
    sound.loop();
  }
}
