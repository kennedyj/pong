function Paddle(name) {
  this.name = name;
  this.isPlayer = false;
  this.speed = 1;
  this.size = {x: 6, y: 60};
  
  this.position = new Point(0, 0);
}

Paddle.prototype = new Point();

Paddle.prototype.move = function(point) {
  if (this.isPlayer && !game.selfPlay) {
    this.position.y = point.position.y - (this.size.y / 2);
  }
  else {
    this.position.y += (point.position.y - this.position.y - (this.size.y / 2)) * game.difficulty.paddleSpeed;
  }

  if (game.debug) {
    this.position.y = point.position.y - (this.size.y / 2);
  }
}

Paddle.prototype.draw = function(context) {
  context.fillStyle = PADDLE_FILL_COLOR;
  context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
}

Paddle.prototype.collide = function(ball) {
  if (ball.position.y > this.position.y && ball.position.y < this.position.y + this.size.y) {
    // If it actually happens to be right on
    var step = ball.step();
    if (this.isPlayer) {
      if (ball.willCollide([{min: 90, max: 270}])) {
        if (ball.position.x - ball.radius() < this.position.x + this.size.x) {
          ball.position.x = this.position.x + this.size.x + ball.radius();
          return true;
        }
        
        if (ball.position.x - ball.radius() - ball.step.x < this.position.x + this.size.x) {
          ball.position.x = this.position.x + this.size.x + ball.radius();
          return true;
        }
      }
    }
    else {
      if (ball.willCollide([{min: 0, max: 90}, {min: 270, max: 360}])) {
        if (ball.position.x + ball.radius() > this.position.x) {
          ball.position.x = this.position.x - ball.radius();
          return true;
        }
        
        if (ball.position.x + ball.radius() + ball.step.x > this.position.x) {
          ball.position.x = this.position.x - ball.radius();
          return true;
        }
      }
    }
  }
  return false;
}
