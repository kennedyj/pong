/*
 * Particle (Lives, and decays)
 */
function Particle() {
  this.size = 1;
  this.life = 1;
  this.decay = 0.01;
}

Particle.prototype = new GravityVector();

Particle.prototype.mass = function() {
  return this.size;
}

Particle.prototype.radius = function() {
  return this.size;
}

Particle.prototype.draw = function(ctx) {
  this.updateTrajectory();
  var s = this.step();

  // Fade out
  this.life -= this.decay;
  
  ctx.beginPath();
  ctx.moveTo(this.position.x, this.position.y);
  ctx.lineTo(this.position.x + s.x, this.position.y - s.y);
  
  this.position.x += s.x;
  this.position.y -= s.y;
  ctx.strokeStyle = colorWithAlpha(PARTICLE_LINE_COLOR, Math.max(this.life, 0));
  ctx.lineWidth = 1;
  ctx.stroke();
}
