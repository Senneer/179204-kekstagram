'use strict';

(function () {

  var imgUploadForm = document.querySelector('.img-upload__form');
  var hashtagInp = imgUploadForm.querySelector('.text__hashtags');
  var commentInp = imgUploadForm.querySelector('.text__description');

  function hasExtraSymbol(hashtag) {
    for (var k = 1; k < hashtag.length; k++) {
      if (hashtag.charAt(k) === '#') {
        return true;
      }
    }
    return false;
  }

  function validateHashtags() {
    var HASHTAG_LENGTH = 20;
    var HASHTAG_AMOUNT = 5;
    var hashtagArr = hashtagInp.value.trim().split(' ');

    if (hashtagArr[0].length > 0) {
      for (var j = 0; j < hashtagArr.length; j++) {
        var nonUnique = hashtagArr.some(function (el, index) {
          return index !== j ? el.toLowerCase() === hashtagArr[j].toLowerCase() : false;
        });

        if (hashtagArr[j].charAt(0) !== '#') {
          hashtagInp.setCustomValidity('Хэштег должен начинаться с символа "#"');
          break;
        } else if (hashtagArr[j].length === 1) {
          hashtagInp.setCustomValidity('Хэштег должен содержать текст');
          break;
        } else if (hasExtraSymbol(hashtagArr[j])) {
          hashtagInp.setCustomValidity('Хэштеги должны разделяться пробелом');
          break;
        } else if (hashtagArr[j].length > HASHTAG_LENGTH) {
          hashtagInp.setCustomValidity('Длина хэштегов не должна превышать 20-и символов');
          break;
        } else if (hashtagArr.length > HASHTAG_AMOUNT) {
          hashtagInp.setCustomValidity('Нельзя использовать больше 5-и хэштегов');
          break;
        } else if (nonUnique) {
          hashtagInp.setCustomValidity('Хэштеги не должны повторяться');
          break;
        } else {
          hashtagInp.setCustomValidity('');
        }
      }
    }
  }

  function validateText() {
    var value = commentInp.value;

    if (value.length > 140) {
      commentInp.setCustomValidity('Длина комментария не должна превышать 140 символов');
    } else {
      commentInp.setCustomValidity('');
    }
  }

  function hashtagChangeHandler() {
    hashtagInp.setCustomValidity('');
  }

  function imgSubmitHandler(e) {
    validateHashtags();
    validateText();
    if (!imgUploadForm.checkValidity()) {
      e.preventDefault();
      imgUploadForm.reportValidity();
    }
  }

  function uploadEscPressHandler(e) {
    window.assets.isEscEvent(e, function () {
      e.stopPropagation();
    });
  }

  hashtagInp.addEventListener('keydown', uploadEscPressHandler);
  commentInp.addEventListener('keydown', uploadEscPressHandler);
  hashtagInp.addEventListener('input', hashtagChangeHandler);
  imgUploadForm.addEventListener('submit', imgSubmitHandler);
})();
