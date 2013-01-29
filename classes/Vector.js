/*
 * Vector (Includes Angle and Velocity)
 */
function Vector() {
  this.angle = 0;
  this.velocity = 1;
}

Vector.prototype = new Point();

Vector.prototype.step = function() {
  var vectorAngle = this.angle * Math.PI / 180;

  return {
      x: this.velocity * Math.cos(vectorAngle),
      y: this.velocity * Math.sin(vectorAngle)
  };
};

Vector.prototype.willCollide = function(angles, magnitude) {
  for (var angleIndex in angles) {
    var angleRange = angles[angleIndex];
    
    if (this.angle >= angleRange.min && this.angle <= angleRange.max) {
      return true;
    }
  }
  
  return false;
}

Vector.prototype.drawLine = function(context, alpha) {
  alpha = (alpha != null) ? alpha : 0.3;
  var s = this.step();
  
  context.beginPath();
  context.moveTo(this.position.x, this.position.y);
  context.lineTo(this.position.x + s.x, this.position.y - s.y);
  
  context.strokeStyle = colorWithAlpha(VECTOR_LINE_COLOR, alpha);
  context.lineWidth = 1;
  context.stroke();
}

Vector.prototype.toString = function() {
  return "{x: " + this.position.x + ", y:" + this.position.y + ", a: " + this.angle + ", v: " + this.velocity + "}";
}
