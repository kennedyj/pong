function GameWorld(canvas) {
  this.NORTH = 0;
  this.SOUTH = 1;
  this.EAST = 2;
  this.WEST = 3;

  this.char_p = 80;
  this.char_s = 83;
  this.char_space = 32;
  
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.framerate = 60;
  
  this.size = {
    x: canvas.width,
    y: canvas.height
  }
  
  this.fps = 0;
  this.fpsMin = 1000;
  this.fpsMax = 0;
  this.timeLastSecond = new Date().getTime();
  this.frames = 0;
  
  /*
   * 
   */
  this.background;
  this.score;
  this.intro;
  this.messages;
  
  // Increase the size of the AU to help with ration to game size
  this.ASTRONOMICAL_UNIT = 149598000;// * 1000;
  this.sizeConversion = this.ASTRONOMICAL_UNIT / this.size.y * 1000;

  this.middlePoint = {x: this.size.x / 2, y: this.size.y / 2};

  this.ballLifeStart = 100;
  this.ballLifeMax = 300;
  
  this.playing = false;
  this.paused = false;
  this.particlesOn = true;
  
  this.playerPaddle = new Paddle("Player");
  this.computerPaddle = new Paddle("AI");
  
  this.ball = new Ball();
  this.well = new GravityWell();
  this.particles = [];
  
  this.mouse = new Point(0, 0);
  
  this.debug = false;
  this.selfPlay = false;
  
  // Possibility to alter difficulty
  this.difficulty = {ballSpeed: 9, paddleSpeed: 0.13};
}

GameWorld.prototype.collideNorth = function(ball) {
  return ball.position.y - ball.radius() <= 0 && ball.willCollide([{min: 0, max: 180}]);
}

GameWorld.prototype.collideSouth = function(ball) {
  return ball.position.y + ball.radius() >= this.size.y && ball.willCollide([{min: 180, max: 360}]);
}

GameWorld.prototype.collideEast = function(ball) {
  return ball.position.x + ball.radius() >= this.size.x && ball.willCollide([{min: 0, max: 90}, {min: 270, max: 360}]);
}

GameWorld.prototype.collideWest = function(ball) {
  return ball.position.x - ball.radius() <= 0 && ball.willCollide([{min: 90, max: 270}]);
}

// Borrowed this code (http://hakim.se/experiments/)
GameWorld.prototype.calculateFps = function() {
  // Fetch the current time for this frame
  var frameTime = new Date().getTime();
  
  // Increase the frame count
  this.frames++;
  
  // Check if a second has passed since the last time we updated the FPS
  if(frameTime > this.timeLastSecond + 1000) {
    // Establish the current, minimum and maximum FPS
    this.fps = Math.min(Math.round((this.frames * 1000) / (frameTime - this.timeLastSecond)), this.framerate);
    this.fpsMin = Math.min(this.fpsMin, this.fps);
    this.fpsMax = Math.max(this.fpsMax, this.fps);
    
    this.timeLastSecond = frameTime;
    this.frames = 0;
  }
}

GameWorld.prototype.init = function() {
  this.well.sizeConversion = this.sizeConversion;
  this.well.repulsionRadius = 10;
  this.well.position.x = this.middlePoint.x;
  this.well.position.y = this.middlePoint.y;
  
  this.playerPaddle.isPlayer = true;
  this.playerPaddle.position.x = 20;
  this.playerPaddle.position.y = this.middlePoint.y;
  
  this.computerPaddle.position.x = 900 - 20 - this.computerPaddle.size.x;
  this.computerPaddle.position.y = this.middlePoint.y;
  
  this.background.draw();

  document.addEventListener('mousemove', documentMouseMoveHandler, false);
  document.addEventListener('keydown', documentKeyDownHandler, false);
  document.addEventListener('keyup', documentKeyUpHandler, false);
  
  this.loopInterval = setInterval(loop, 1000 / this.framerate);
}
