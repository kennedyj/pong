/*
Class for the Gravity Well
*/
function GravityWell() {
  this.massSun = 2 * Math.pow(10, 30);
  this.sizeConversion = 1;
  
  this.repulsionRadius = 1;
  
  this.position = { x: 0, y: 0 };
  this.radius = 20;
  this.quality = 18;
  this.segments = [];
  this.repulsorSegments = [];
}

// Used for hit detection
GravityWell.prototype = new Point();

GravityWell.prototype.mass = function() {
  // The Mass of the Sun
  return this.massSun;
}

GravityWell.prototype.repulsionDistance = function() {
  return this.radius + this.repulsionRadius;
}

GravityWell.prototype.updateWell = function() { 
  // If this is the first time, create the needed segments
  if (this.segments.length == 0) {
    for (var i = 0; i < this.quality; i++) {
      var s = {
        position: {x: this.position.x, y: this.position.y},
        normal: {x: 0, y: 0},
        offset: {x: 0, y: 0}
      };
      
      this.segments.push(s);
    }
  }
  
  if (this.repulsorSegments.length == 0) {
    for (var i = 0; i < this.quality; i++) {
      var s = {
        position: {x: this.position.x, y: this.position.y},
        normal: {x: 0, y: 0},
        offset: {x: 0, y: 0}
      };
      
      this.repulsorSegments.push(s);
    }
  }
  
  // Iterate over each segment and update them based on quality
  for (var i = 0; i < this.quality; i++) {
    var n = this.segments[i];
    var angle = (i / this.quality) * Math.PI * 2;
    
    n.normal.x = Math.cos(angle) * this.radius;
    n.normal.y = Math.sin(angle) * this.radius;
    
    n.offset.x = Math.random() * 5;
    n.offset.y = Math.random() * 5;
    
    // Do the same stuff for the repulsor
    n = this.repulsorSegments[i];
    angle = (i / this.quality) * Math.PI * 2;
    
    n.normal.x = Math.cos(angle) * (this.radius + this.repulsionRadius);
    n.normal.y = Math.sin(angle) * (this.radius + this.repulsionRadius);
    
    n.offset.x = Math.random() * 5;
    n.offset.y = Math.random() * 5;
  }
};

GravityWell.prototype.draw = function(context) { 
  // Update the gravity well
  context.beginPath();
  context.fillStyle = WELL_FILL_COLOR; 
  context.strokeStyle = WELL_LINE_COLOR;
  context.lineWidth = 1.5;
  
  this.updateWell();
  
  // Based on segments, draw the gravity well
  for (var i = 0; i < this.segments.length; i++) {
    // Set the starting point and the next point
    sp = this.segments[i];
    np = this.segments[i+1];
    
    // Set the variance used in the rendering
    sp.position.x += ( (this.position.x + sp.normal.x + sp.offset.x) - sp.position.x ) * 0.2;
    sp.position.y += ( (this.position.y + sp.normal.y + sp.offset.y) - sp.position.y ) * 0.2;
    
    if (i == 0) {
      // This is the first loop, so we need to start by moving into position
      context.moveTo(sp.position.x, sp.position.y);
    }
    else if (np) {
      // Draw a curve between the current and next trail point
      context.quadraticCurveTo(
          sp.position.x, sp.position.y, 
          sp.position.x + ( np.position.x - sp.position.x ) / 2, 
          sp.position.y + ( np.position.y - sp.position.y ) / 2
      );
    }
  }
  
  context.closePath();
  context.fill();
  context.stroke();
  
  // Update the repulsor field
  context.beginPath();
  context.fillStyle = REPULSOR_FILL_COLOR;
  context.strokeStyle = REPULSOR_LINE_COLOR;
  context.lineWidth = 1.5;
  
  // Based on segments, draw the gravity well
  for (var i = 0; i < this.repulsorSegments.length; i++) {
    // Set the starting point and the next point
    sp = this.repulsorSegments[i];
    np = this.repulsorSegments[i+1];
    
    // Set the variance used in the rendering
    sp.position.x += ( (this.position.x + sp.normal.x + sp.offset.x) - sp.position.x ) * 0.2;
    sp.position.y += ( (this.position.y + sp.normal.y + sp.offset.y) - sp.position.y ) * 0.2;
    
    if (i == 0) {
      // This is the first loop, so we need to start by moving into position
      context.moveTo(sp.position.x, sp.position.y);
    }
    else if (np) {
      // Draw a curve between the current and next trail point
      context.quadraticCurveTo(
          sp.position.x, sp.position.y, 
          sp.position.x + ( np.position.x - sp.position.x ) / 2, 
          sp.position.y + ( np.position.y - sp.position.y ) / 2
      );
    }
  }
  
  context.closePath();
  context.fill();
  context.stroke();
};
