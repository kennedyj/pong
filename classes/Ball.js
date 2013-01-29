/*
 * Ball (Moves, bounces, grows, and shrinks)
 */
function Ball() {
  this.massSaturnV = 3039000;
  this.massEarth = 5.9742 * Math.pow(10, 24);
  
  this.life = 100;
  this.lifeToRadius = 10;
  this.decay = 0.01;
  this.alive = false;
  
  this.drawTrail = true;
  this.maxTrailLength = 500;
  this.trail = [];
  
  this.repulse = true;
}

Ball.prototype = new Particle();

Ball.prototype.reset = function() {
  this.life = 100;
  this.alive = false;

  delete this.trail;
  this.trail = [];
}

Ball.prototype.radius = function() {
  return (this.life / this.lifeToRadius > 3) ? this.life / this.lifeToRadius : 3;
}

Ball.prototype.mass = function() {
  // The mass of a Saturn V Rocket
  return this.massEarth;
}

Ball.prototype.draw = function(ctx, particles) {
  ctx.fillStyle = BALL_FILL_COLOR;
  ctx.strokeStyle = BALL_LINE_COLOR;
  ctx.lineWidth = 1;
  
  ctx.beginPath();
  ctx.arc(this.position.x, this.position.y, this.radius(), 0, Math.PI * 2, true);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  
  // Make a particle
  if (game.particlesOn) {
    var p = new Particle();
    p.well = this.well;
    var oppositeAngle = (this.angle < 180) ? this.angle + 180 : this.angle - 180;
  
    // Use our velocity in the opposite direction to know where to spawn the particle at
    p.angle = oppositeAngle;
    // Using the radius as the velocity ensures no matter how large the ball gets that the particles spawn
    // outside of it
    p.velocity = this.radius();
    var os = p.step();
    
  
    // Set the properties to what they should be
    p.angle = randomFromArc(arc(oppositeAngle, 180));
    p.velocity = Math.random() * 2;
    p.decay = 0.01;
    p.position = {
      x: this.position.x + os.x,
      y: this.position.y - os.y
    };
    
    particles.push(p);
  }
  

  // Draw the trail
  if (this.drawTrail) {
    ctx.beginPath();
    ctx.strokeStyle = BALL_TAIL_COLOR;
    ctx.lineWidth = 1;
    
    for (var i = 0; i < this.trail.length; i++) {
      ctx.lineTo(this.trail[i].position.x, this.trail[i].position.y);
    }
    
    ctx.stroke();
    ctx.closePath();
    
    var tp = new Point(this.position.x, this.position.y);
    this.trail.push(tp);
    
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
  }

  this.life -= this.decay;

  // Update this position
  this.updateTrajectory();
  var s = this.step();

  this.position.x += s.x;
  this.position.y -= s.y;
}
