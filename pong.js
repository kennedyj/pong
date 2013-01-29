// Universal reference to the GameWorld
var game;

// Trigger the game creation after the document finishes loading
window.onload = function() {
  // Set the games html components
  game = new GameWorld(document.getElementById("pong"));
  
  game.background = new Background(document.getElementById("background"), game);
  game.score = new Score(document.getElementById("playerScore1"), document.getElementById("playerScore2"));
  game.intro = new Intro(document.getElementById("intro"));
  game.messages = document.getElementById("messages");
 
  // Finish the Game initialization
  game.init();
}

// Display Loop
function loop() {
  var collided = -1;
  
  // Clear the canvas
  game.context.clearRect(0, 0, game.size.x, game.size.y);
  
  // Calculate the current FPS
  game.calculateFps();
  
  // If the game isn't playing, do nothing
  if (!game.playing) {
    game.intro.show();
    return;
  }
  
  // Draw all the particles
  if (game.particlesOn) {
    handleParticles(game.particles, game.context);
  }
  
  // Restart the ball
  if (!game.ball.alive) {
    game.ball.well = game.well;
    
    // Set the ball to the side that scored last (defaults to Player One)
    if (game.score.lastScored == game.score.PLAYER_ONE) {
      game.ball.position.x = 50;
      game.ball.angle = random({min: 0, max: 60}, {min: 300, max: 359});
    }
    else {
      game.ball.position.x = game.size.x - 50;
      game.ball.angle = random({min: 90, max: 270});
    }
    game.ball.position.y = game.middlePoint.y;
    
    game.ball.reset();
    
    game.ball.life = game.ballLifeStart;
    game.ball.velocity = game.difficulty.ballSpeed;
    game.ball.alive = true;
  }
  
  // Draw the ball and the well
  game.ball.draw(game.context, game.particles);
  game.well.draw(game.context);
  
  // Move the player paddle
  if (game.debug || game.selfPlay) {
    game.playerPaddle.move(game.ball);
  } else {
    game.playerPaddle.move(game.mouse);
  }

  // Draw the player paddle
  game.playerPaddle.draw(game.context);
  
  // Move and draw the computer paddle
  game.computerPaddle.move(game.ball);
  game.computerPaddle.draw(game.context);
  
  // Check if the ball collides with the Paddle
  if (game.computerPaddle.collide(game.ball) || game.playerPaddle.collide(game.ball)) {
    var particleX = game.computerPaddle.position.x;
    var particleAngles = [{min: 91, max: 269}];
    
    if (game.ball.angle >= 90 && game.ball.angle <= 270) {
      collided = game.WEST;
      particleX = game.playerPaddle.position.x + game.playerPaddle.size.x;
      particleAngles = [{min: 0, max: 80}, {min: 269, max: 359}];
    }
    else {
      collided = game.EAST;
    }
    
    generateRandomParticles(game.well, game.particles, 50, {x: particleX, y: game.ball.position.y}, particleAngles);
    
    game.ball.angle = 180 - game.ball.angle;
    game.ball.life -= 10;
  }
  
  // Check if the ball collides with the gameWorld
  if (game.collideEast(game.ball) || game.collideWest(game.ball)) {
    // Which side did the ball bounce off of (checking West since it is easier)
    game.ball.alive = false;
  } 
  else if (game.collideNorth(game.ball) || game.collideSouth(game.ball)) {
    if (game.ball.angle < 180) {
      collided = game.NORTH;
    } 
    else {
      collided = game.SOUTH;
    }
    
    game.ball.angle = 360 - game.ball.angle;
    game.ball.life += 10;
  }
  
  // Keep the angle in the positives
  if (game.ball.angle < 0) {
    game.ball.angle = game.ball.angle + 360;
  }
  
  // Kill the Ball if it runs out of life
  if (game.ball.life <= 0 || game.ball.life >= game.ballLifeMax) {
    game.ball.alive = false;
  }
  
  // Generate the explosion if the ball died
  if (!game.ball.alive) {
    if (game.ball.position.x < game.middlePoint.x) {
      game.playing = game.score.playerTwoScored();
    }
    else {
      game.playing = game.score.playerOneScored();
    }
    generateRandomParticles(game.well, game.particles, Math.PI * (game.ball.radius() * game.ball.radius()), {x: game.ball.position.x, y: game.ball.position.y}, [{min: 0, max: 359}]);
    
    if (game.debug) {
      clearInterval(game.loopInterval);
      game.paused = true;
    }
  }
  
  // Set the Messages
  game.messages.innerHTML = "fps: " + game.fps + " (" + game.fpsMin + ") <br /> " + 
    "Life: " + roundTenths(game.ball.life);
}

/*
 * Update the mouse's position based on where it is in the game board
 */
function documentMouseMoveHandler(event){
  game.mouse.position.x = event.clientX - 10;
  game.mouse.position.y = event.clientY - 10;
}

/*
 * Key Handlers
 */
function documentKeyDownHandler(event) {
  switch (event.keyCode) {
  }
}

/*
 * Look for a key up event
 */
function documentKeyUpHandler(event) {
  switch(event.keyCode) {
  case game.char_space:
    // Space was pressed, start or pause/unpause the game
    if (!game.playing) {
      game.intro.hide();
      game.score.reset();
      game.playing = true;
    }
    else {
      if (!game.paused) {
        clearInterval(game.loopInterval);
        game.paused = true;
      }
      else {
        game.loopInterval = setInterval(loop, 1000 / game.framerate);
        game.paused = false;
      }
    }
    
    event.preventDefault();
    break;
  case game.char_p:
    // Toggle Particles
    game.particlesOn = !game.particlesOn;
    break;
  case game.char_s:
    // Toggle Self Play
    game.selfPlay = !game.selfPlay;
    break;
  }
}
