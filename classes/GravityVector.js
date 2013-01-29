/*
 * Add an additional Gravity Vector
 */
function GravityVector(well) {
  this.GRAVITY_CONSTANT = 6.67428 * Math.pow(10, -11);
  this.gravity = new Vector();
  this.well = well;
  this.repulse = false;
}

GravityVector.prototype = new Vector();

GravityVector.prototype.mass = function() {
  return 1;
}

GravityVector.prototype.updateGravity = function() {
  this.gravity.position = {x: this.position.x, y: this.position.y};
  this.gravity.velocity = this.calculateGravityAcceleration();
  
  var ga = (Math.asin((this.position.y - this.well.position.y) / this.gravity.distanceTo(this.well.position)) * (180 / Math.PI));
  
  this.gravity.angle = ((this.position.x >= this.well.position.x) ? 180 - ga : ga);
}

GravityVector.prototype.gravityStep = function() {
  return this.gravity.step();
}

GravityVector.prototype.calculateGravityForce = function() {
  // MmG / r^2
  return (this.well.mass() * this.mass() * this.GRAVITY_CONSTANT) / Math.pow(this.distanceTo(this.well.position) * this.well.sizeConversion, 2);
}

GravityVector.prototype.calculateGravityAcceleration = function() {
  // MmG / r^2
  return this.calculateGravityForce() / this.mass();
}

GravityVector.prototype.updateTrajectory = function() {
  this.updateGravity();

  if (this.distanceTo(this.well.position) >= this.well.repulsionDistance() + this.radius()) {
    var gravityStep = this.gravityStep();
    var step = this.step();
    
    var dp = new Point(this.position.x + step.x + gravityStep.x, this.position.y - step.y - gravityStep.y);
    var radi = Math.asin((this.position.y - dp.position.y) / this.distanceTo(dp.position));
    var angle = radi * (180 / Math.PI);
    
    if (this.position.x >= dp.position.x) {
      angle = 180 - angle;
    }
  
    if (angle < 0) {
      angle += 360;
    }
  
    this.angle = angle;
  }
  else {
    if (this.repulse) {
      var newAngle = Math.asin((this.well.position.y - this.position.y) / this.well.distanceTo(this.position)) * (180 / Math.PI);
      this.angle = (this.well.position.x >= this.position.x) ? 180 - newAngle : newAngle;
      // If gravity overpowers the ball, this can be used
      //this.velocity = this.gravity.velocity + 10;
    }
  }
}
