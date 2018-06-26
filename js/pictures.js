'use strict';

function generateComments() {
  var comments = [];
  var commentsQuantity = window.assets.getRandomInteger(1, 5);

  for (var i = 0; i < commentsQuantity; i++) {
    var comment = '';
    var commentSentences = window.assets.getRandomInteger(1, 2);

    for (var j = 0; j < commentSentences; j++) {
      var sentence = window.assets.pickRandomArrEl(window.data.COMMENTS);
      comment += sentence;
    }

    comments.push(comment);
  }

  return comments;
}

function generatePostData(url) {
  return {
    url: url,
    likes: window.assets.getRandomInteger(15, 200),
    comments: generateComments(),
    description: window.assets.pickRandomArrEl(window.data.DESCRIPTIONS)
  };
}

function renderPost(postData) {
  var post = document.querySelector('.big-picture');
  var postNode = post.cloneNode(true);
  postNode.classList.remove('hidden');
  postNode.querySelector('.big-picture__img img').src = postData.url;
  postNode.querySelector('.likes-count').textContent = postData.likes;
  postNode.querySelector('.comments-count').textContent = postData.comments.length;
  postNode.querySelector('.social__caption').textContent = postData.description;
  postNode.querySelector('.social__comment-count').classList.add('visually-hidden');
  postNode.querySelector('.social__loadmore').classList.add('visually-hidden');

  var fragment = document.createDocumentFragment();
  var commentsList = postNode.querySelector('.social__comments');
  var closeBtn = postNode.querySelector('.big-picture__cancel');

  for (var i = 0; i < postData.comments.length; i++) {
    var commentNode = postNode.querySelector('.social__comment').cloneNode(true);
    commentNode.querySelector('.social__picture').src = 'img/avatar-' + window.assets.getRandomInteger(1, 6) + '.svg';
    commentNode.querySelector('.social__text').textContent = postData.comments[i];
    fragment.appendChild(commentNode);
  }

  commentsList.innerHTML = '';
  commentsList.appendChild(fragment);

  closeBtn.addEventListener('click', function (e) {
    e.preventDefault();
    closeBigPicture();
  });

  document.addEventListener('keydown', bigPictureEscPressHandler);

  post.parentNode.replaceChild(postNode, post);
}

function closeBigPicture() {
  var post = document.querySelector('.big-picture');
  post.classList.add('hidden');
  document.removeEventListener('keydown', bigPictureEscPressHandler);
}

function bigPictureEscPressHandler(e) {
  if (e.keyCode === window.KEYCODES.esc) {
    closeBigPicture();
  }
}

// Редактирование
var imgScaleValue = 100;

var uploadFileInp = document.querySelector('#upload-file');
var uploadCancelBtn = document.querySelector('.img-upload__cancel');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var imgScale = document.querySelector('.resize__control--value');
var plusScaleBtn = document.querySelector('.resize__control--plus');
var minusScaleBtn = document.querySelector('.resize__control--minus');
var uploadPreview = document.querySelector('.img-upload__preview');

function popupEscPressHandler(e) {
  if (e.keyCode === window.KEYCODES.esc) {
    closeImgUpload();
  }
}

function setImgScaleValue() {
  imgScale.value = imgScaleValue + '%';
  uploadPreview.style.transform = 'scale(' + imgScaleValue / 100 + ')';
}

function openImgUpload() {
  imgUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', popupEscPressHandler);
  setImgScaleValue();
}

function closeImgUpload() {
  uploadFileInp.value = '';
  imgUploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', popupEscPressHandler);
}

function increaseImgScaleHandler(e) {
  e.preventDefault();
  var MAX_SCALE = 100;

  if (imgScaleValue < MAX_SCALE) {
    imgScaleValue += 25;
    setImgScaleValue();
  }
}

function decreaseImgScaleHandler(e) {
  e.preventDefault();
  var MIN_SCALE = 25;

  if (imgScaleValue > MIN_SCALE) {
    imgScaleValue -= 25;
    setImgScaleValue();
  }
}

uploadFileInp.addEventListener('change', function () {
  var checkedInpEffect = document.querySelector('.effects__radio:checked');

  currentEffect = checkedInpEffect.value;
  openImgUpload();
  setDefaultEffectValues();
});
uploadCancelBtn.addEventListener('click', function () {
  closeImgUpload();
});

plusScaleBtn.addEventListener('click', increaseImgScaleHandler);
minusScaleBtn.addEventListener('click', decreaseImgScaleHandler);

var imgEffectInputs = document.querySelectorAll('.effects__radio');
var effectScaleWrapper = document.querySelector('.img-upload__scale');
var previewUploadImg = uploadPreview.querySelector('img');
var currentEffect = 'none';

function changeImgEffect(effect) {
  previewUploadImg.className = '';
  previewUploadImg.classList.add('effects__preview--' + effect);
}

for (var i = 0; i < imgEffectInputs.length; i++) {
  imgEffectInputs[i].addEventListener('change', function (e) {
    currentEffect = e.target.value;

    setDefaultEffectValues();
  });
}

// Наложение эффектов
var EFFECT_VALUES = {
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    unit: ''
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    unit: ''
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    unit: '%'
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    unit: 'px'
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    unit: ''
  }
};

var effectScaleLine = document.querySelector('.scale__line');
var effectScalePin = effectScaleLine.querySelector('.scale__pin');
var effectScaleLevel = effectScaleLine.querySelector('.scale__level');
var effectValueInp = document.querySelector('.scale__value');

function moveEfectScale(val) {
  effectScalePin.style.left = val + '%';
  effectScaleLevel.style.width = val + '%';
}

function setDefaultEffectValues() {
  var maxPerc = 100;

  if (currentEffect === 'none') {
    previewUploadImg.style.filter = 'none';
    effectScaleWrapper.classList.add('hidden');
  } else {
    effectScaleWrapper.classList.remove('hidden');
    applyEffect(maxPerc);
  }

  moveEfectScale(maxPerc);
  changeImgEffect(currentEffect);
}

function getEffectCssValue(currentPerc) {
  var effectObj = EFFECT_VALUES[currentEffect];
  var val = currentPerc / 100 * effectObj.max + (1 - currentPerc / 100) * effectObj.min; // немножко уличной магии
  return effectObj.filter + '(' + val + effectObj.unit + ')';
}

function applyEffect(effectAmountPerc) {
  previewUploadImg.style.filter = getEffectCssValue(effectAmountPerc);
  effectValueInp.value = effectAmountPerc;
}

// Валидация

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
  if (e.keyCode === window.KEYCODES.esc) {
    e.stopPropagation();
  }
}

hashtagInp.addEventListener('keydown', uploadEscPressHandler);
commentInp.addEventListener('keydown', uploadEscPressHandler);
hashtagInp.addEventListener('input', hashtagChangeHandler);
imgUploadForm.addEventListener('submit', imgSubmitHandler);

function init() {
  window.renderPreviews();
}

init();
