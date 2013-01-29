function loop() {
  var collided = -1;
  
  game.context.clearRect(0, 0, game.size.x, game.size.y);
  
  game.calculateFps();
  
  if (!game.playing) {
  }
  else {
    // Draw all the particles
    if (game.particlesOn) {
      handleParticles(particles, game.context);
    }
    
    // Restart the ball
    if (!game.ball.alive) {
      game.ball.well = game.well;
      game.ball.position.x = 50;
      game.ball.position.y = game.middlePoint.y;
      
      game.ball.reset();
      
      game.ball.decay = 0;
      game.ball.life = game.ballLifeStart;
      game.ball.angle = random({min: 0, max: 60}, {min: 300, max: 359});
      game.ball.velocity = 9;
      game.ball.alive = true;
    }
    
    // Draw the ball and the well
    game.ball.draw(game.context, game.particles);
    game.well.draw(game.context);
    
    if (game.debug || game.selfPlay) {
      game.playerPaddle.move(game.ball);
    } else {
      game.playerPaddle.move(game.mouse);
    }
    
    game.playerPaddle.draw(game.context);
    
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
    else if (game.collideNorth(ball) || game.collideSouth(ball)) {
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
    if (game.ball.life <= 0 || game.ball.life >= ballLifeMax) {
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
  }
  
  if (!game.playing) {
    game.intro.show();
  }
  
  // Set the Messages
  game.messages.innerHTML = "fps: " + game.fps + " (" + game.fpsMin + ") <br /> " + 
    "Life: " + roundTenths(game.ball.life);

}

