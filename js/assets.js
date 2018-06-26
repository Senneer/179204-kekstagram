'use strict';

(function () {

  function getRandomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }

  function pickRandomArrEl(array) {
    var EL_NUMBER = Math.floor(Math.random() * array.length);
    return array[EL_NUMBER];
  }

  window.assets = {
    getRandomInteger: getRandomInteger,
    pickRandomArrEl: pickRandomArrEl
  };
})();
