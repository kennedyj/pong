function Background(background, gameWorld) {
  this.background = background;
  this.gameWorld = gameWorld;
  this.context = background.getContext('2d');
}

Background.prototype.draw = function() {
  var bgGrad = this.context.createRadialGradient(this.gameWorld.size.x * 0.5, this.gameWorld.size.y * 0.5, this.gameWorld.size.y * 0.2, this.gameWorld.size.x * 0.5, this.gameWorld.size.y * 0.5, this.gameWorld.size.y * 0.25);  
  bgGrad.addColorStop(0, BACKGROUND_STEP_ONE);
  bgGrad.addColorStop(0.8, BACKGROUND_STEP_TWO);
  bgGrad.addColorStop(1, BACKGROUND_STEP_THREE);
  
  this.context.fillStyle = bgGrad;
  this.context.beginPath();
  this.context.arc(this.gameWorld.size.x * 0.5, this.gameWorld.size.y * 0.5, this.gameWorld.size.y * 0.25, 0, Math.PI*2, true);
  this.context.closePath();
  this.context.fill();    
}
