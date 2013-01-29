/*
 * Drawing Helpers
 */
function handleParticles(particles, context) {
  for (var pi in particles) {
    var p = particles[pi];
    
    p.draw(context);
    
    if (p.life <= 0) {
      particles.splice(pi, 1);
    }
  }
}

/*
 * Utility Methods
 */
/*
 * Generate a random number between a min and a max
 */
function random(pair) {
  return ((pair.max - pair.min + 1) * Math.random()) + pair.min
}

/*
 * Generate a random angle between a range of ranges
 * [{min: 90, max: 270}] or [{min:0, max: 90}, {min: 270, max: 359}]
 */
function randomAngles(angles) {
  return random(angles[Math.floor(Math.random() * angles.length)]);
}

/*
 * Determine an arc of angles based on an initial angle and a variance
 */
function arc(angle, variance) {
  var high = ((angle + variance) <= 360) ? angle + variance : (angle + variance) - 360;
  var low = ((angle - variance) >= 0) ? angle - variance : (angle - variance) + 360;
  
  return {min: low, max: high};
}

/*
 * Used to calculate a random angle within an arc of possible values
 */
function randomFromArc(arc) {
  if (arc.max > arc.min) {
    return random(arc);
  }
  else {
    return randomAngles([{min: arc.min, max: 360}, {min: 0, max: arc.max}]);
  }
}

/*
 * Round to the tenth
 */
function roundTenths(value) {
  return Math.round(value * 10) / 10;
}

/*
 * Return an rgba value of color with alpha
 */
function colorWithAlpha(color, alpha) {
  return "rgba(" + color + ", " + alpha + ")";
}

/*
 * Particle Generation helpers
 */
function generateRandomParticle(well, initialPosition, angles) {
  if (game.particlesOn) {
    var p = new Particle();
    p.well = well;
    
    p.angle = randomAngles(angles);
    p.velocity = Math.random() * 4;
    var rd = (Math.random() + 0.2333) / 10;
    p.decay = (rd < 0.01 || rd > 0.06) ? 0.02 : rd;
    p.position = {x: initialPosition.x, y: initialPosition.y};
    
    return p;
  }
}

/*
 * Call the above method X times
 */
function generateRandomParticles(well, particles, amount, position, angles) {
  if (game.particlesOn) {
    if (amount > 500) {
      amount = 500;
    }
    
    for (var index = 0; index < amount; index++) {
      var p = generateRandomParticle(well, position, angles);
      
      particles.push(p);
    }
  }
}
