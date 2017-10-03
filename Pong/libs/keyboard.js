window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);


var Key = {
  _pressed: {},

	  A: 65,
    B: 66,
    C: 67,
    D: 68,
    F: 70,
    K: 75,
    L: 76,
    R: 82,
    S: 83,
    U: 85,
    W: 87,

    SPACE: 32,
    LT: 49,
    GT: 50,
    LEFTARROW: 37,
    UPARROW: 38,
    RIGHTARROW: 39,
    DOWNARROW: 40,
    ONE: 1,

  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};


/*
    window.addEventListener("keydown", function(evt) {
        alert("keydown: " + evt.keyCode);
    }, false);
*/