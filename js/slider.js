'use strict';

(function () {
  var scaleWrapper = document.querySelector('.scale');
  var effectScaleLine = scaleWrapper.querySelector('.scale__line');
  var effectScalePin = scaleWrapper.querySelector('.scale__pin');
  var effectScaleLevel = scaleWrapper.querySelector('.scale__level');
  var effectValueInp = document.querySelector('.scale__value');

  var DEFAULT_VALUE = 100;

  function getValueInPercent(val, max) {
    return val * 100 / max;
  }

  function getEffectPercent() {
    var effectPinOffsetLeft = effectScalePin.offsetLeft;
    var effectMaxVal = effectScaleLine.offsetWidth;
    return Math.ceil(getValueInPercent(effectPinOffsetLeft, effectMaxVal));
  }

  function resetSlider() {
    effectValueInp.value = DEFAULT_VALUE;
    effectScalePin.style.left = DEFAULT_VALUE + '%';
    effectScaleLevel.style.width = DEFAULT_VALUE + '%';
  }

  function initSlider(callback) {
    effectScalePin.addEventListener('mousedown', function (e) {
      e.preventDefault();

      var xCoord = e.clientX;
      var lineWidth = effectScaleLine.offsetWidth;

      var mouseMoveHandler = function (moveEvt) {

        var shift = xCoord - moveEvt.clientX;

        xCoord = moveEvt.clientX;

        var move = effectScalePin.offsetLeft - shift;
        if (move >= 0 && move <= lineWidth) {
          effectScalePin.style.left = move + 'px';
          effectScaleLevel.style.width = move + 'px';
          var effectPerc = getEffectPercent();
          effectValueInp.value = effectPerc;
          callback();
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
  }

  window.slider = {
    getState: function () {
      return effectValueInp.value;
    },
    reset: resetSlider,
    init: initSlider
  };
})();
