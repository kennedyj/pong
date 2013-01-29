/*
 * Point (Used to measure distance)
 */
function Point(x, y) {
  this.position = {
    x: x,
    y: y
  };
}

Point.prototype.distanceTo = function(p) {
  var dx = p.x - this.position.x;
  var dy = p.y - this.position.y;
  return Math.sqrt(dx*dx + dy*dy);
};

Point.prototype.clonePosition = function() {
  return { 
    x: this.position.x,
    y: this.position.y
  };
};

Point.prototype.drawDot = function(context) {
  context.fillStyle = POINT_COLOR;  
  context.fillRect (this.position.x, this.position.y, 1, 1);
}
