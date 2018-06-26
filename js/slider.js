'use strict';

(function () {
  var scaleWrapper = document.querySelector('.scale');
  var effectScaleLine = scaleWrapper.querySelector('.scale__line');
  var effectScalePin = scaleWrapper.querySelector('.scale__pin');
  var effectScaleLevel = scaleWrapper.querySelector('.scale__level');

  function getValueInPercent(val, max) {
    return val * 100 / max;
  }

  function getEffectPercent() {
    var effectPinOffsetLeft = effectScalePin.offsetLeft;
    var effectMaxVal = effectScaleLine.offsetWidth;
    return Math.ceil(getValueInPercent(effectPinOffsetLeft, effectMaxVal));
  }

  effectScalePin.addEventListener('mousedown', function (e) {
    e.preventDefault();

    var xCoord = e.clientX;
    var LINE_WIDTH = effectScaleLine.offsetWidth;

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = xCoord - moveEvt.clientX;

      xCoord = moveEvt.clientX;

      var move = effectScalePin.offsetLeft - shift;
      if (move >= 0 && move <= LINE_WIDTH) {
        effectScalePin.style.left = move + 'px';
        effectScaleLevel.style.width = move + 'px';
        var effectPerc = getEffectPercent();
        window.applyEffect(effectPerc);
      }
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
