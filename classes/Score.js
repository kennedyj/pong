function Score(playerOne, playerTwo) {
  this.PLAYER_ONE = 0;
  this.PLAYER_TWO = 1;
  
  this.endScore = 11;
  
  this.playerOne = playerOne;
  this.playerTwo = playerTwo;
  
  this.playerOneScore = 0;
  this.playerTwoScore = 0;
  
  this.lastScored = this.PLAYER_ONE;
}

Score.prototype.playerOneScored = function() {
  this.playerOneScore++;
  this.updateScores();
  this.lastScored = this.PLAYER_ONE;
  
  if (this.playerOneScore >= this.endScore) {
    return false;
  }
  
  return true;
}

Score.prototype.playerTwoScored = function() {
  this.playerTwoScore++;
  this.updateScores();
  this.lastScored = this.PLAYER_TWO;
  
  if (this.playerTwoScore >= this.endScore) {
    return false;
  } 
  
  return true;
}

Score.prototype.updateScores = function() {
  this.playerOne.innerHTML = this.playerOneScore;
  this.playerTwo.innerHTML = this.playerTwoScore;
}

Score.prototype.reset = function() {
  this.playerOneScore = 0;
  this.playerTwoScore = 0;

  this.updateScores();
}
