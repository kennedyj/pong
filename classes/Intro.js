function Intro(intro) {
  this.element = intro;
}

Intro.prototype.hide = function() {
  this.element.style.display = "none";
}

Intro.prototype.show = function() {
  this.element.style.display = "block";
}
