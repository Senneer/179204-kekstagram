'use strict';

var KEYCODES = {
  enter: 13,
  esc: 27
};

var PICTURES_QUANTITY = 25;

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var picturesList = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture__link');

var otherPeoplePictures = [];

function getRandomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

function pickRandomArrEl(array) {
  var EL_NUMBER = Math.floor(Math.random() * array.length);
  return array[EL_NUMBER];
}

function generatePictureUrl(id) {
  var url = 'photos/' + id + '.jpg';
  return url;
}

function generateComments() {
  var comments = [];
  var commentsQuantity = getRandomInteger(1, 5);

  for (var i = 0; i < commentsQuantity; i++) {
    var comment = '';
    var commentSentences = getRandomInteger(1, 2);

    for (var j = 0; j < commentSentences; j++) {
      var sentence = pickRandomArrEl(COMMENTS);
      comment += sentence;
    }

    comments.push(comment);
  }

  return comments;
}

function generatePostData(url) {
  return {
    url: url,
    likes: getRandomInteger(15, 200),
    comments: generateComments(),
    description: pickRandomArrEl(DESCRIPTIONS)
  };
}

function generatePreviewNode(obj) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.href = obj.url;
  pictureElement.querySelector('.picture__img').src = obj.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = obj.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = obj.comments.length;

  return pictureElement;
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
    commentNode.querySelector('.social__picture').src = 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
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

function renderPreviews() {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < PICTURES_QUANTITY; i++) {
    var url = generatePictureUrl(i + 1);
    var postData = generatePostData(url);
    otherPeoplePictures.push(postData);
    var postPreviewNode = generatePreviewNode(postData);
    addPreviewClickListener(postPreviewNode, postData);
    fragment.appendChild(postPreviewNode);
  }

  picturesList.appendChild(fragment);
}

function addPreviewClickListener(link, post) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    renderPost(post);
  });
}

function closeBigPicture() {
  var post = document.querySelector('.big-picture');
  post.classList.add('hidden');
  document.removeEventListener('keydown', bigPictureEscPressHandler);
}

function bigPictureEscPressHandler(e) {
  if (e.keyCode === KEYCODES.esc) {
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
  if (e.keyCode === KEYCODES.esc) {
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
  if (imgScaleValue < 100) {
    imgScaleValue += 25;
    setImgScaleValue();
  }
}

function decreaseImgScaleHandler(e) {
  e.preventDefault();
  if (imgScaleValue > 0) {
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

function getValueInPercent(val, max) {
  return val * 100 / max;
}

function getEffectCssValue(currentPerc) {
  var effectObj = EFFECT_VALUES[currentEffect];
  var val = currentPerc / 100 * effectObj.max + (1 - currentPerc / 100) * effectObj.min; // немножко уличной магии
  return effectObj.filter + '(' + val + effectObj.unit + ')';
}

function getEffectPercent() {
  var effectPinOffsetLeft = effectScalePin.offsetLeft;
  var effectLineWidth = effectScaleLine.offsetWidth;
  return Math.ceil(getValueInPercent(effectPinOffsetLeft, effectLineWidth));
}

function applyEffect(effectAmountPerc) {
  previewUploadImg.style.filter = getEffectCssValue(effectAmountPerc);
  effectValueInp.value = effectAmountPerc;
}

effectScalePin.addEventListener('mouseup', function () {
  var effectAmount = getEffectPercent();
  applyEffect(effectAmount);
});

// Валидация

var imgUploadForm = document.querySelector('.img-upload__form');
var submitBtn = imgUploadForm.querySelector('.img-upload__submit');
var hashtagInp = imgUploadForm.querySelector('.text__hashtags');
var commentInp = imgUploadForm.querySelector('.text__description');

function hasSameArrValues(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      return arr[i].toLowerCase() === arr[j].toLowerCase();
    }
  }
}

function hasExtraSymbol(hashtag) {
  for (var i = 1; i < hashtag.length; i++) {
    if (hashtag.charAt(i) === '#') {
      return true;
    }
  }
  return false;
}

function validateHashtags() {
  var hashtagArr = hashtagInp.value.trim().split(' ');

  for (var i = 0; i < hashtagArr.length; i++) {
    if (hashtagArr[i].charAt(0) !== '#') {
      hashtagInp.setCustomValidity('Хэштег должен начинаться с символа "#"');
    } else if (hashtagArr[i].length === 1) {
      hashtagInp.setCustomValidity('Хэштег должен содержать текст');
    } else if (hasExtraSymbol(hashtagArr[i])) {
      hashtagInp.setCustomValidity('Хэштеги должны разделяться пробелом');
    } else if (hashtagArr[i].length > 20) {
      hashtagInp.setCustomValidity('Длина хэштегов не должна превышать 20-и символов');
    } else if (hashtagArr.length > 5) {
      hashtagInp.setCustomValidity('Нельзя использовать больше 5-и хэштегов');
    } else if (hasSameArrValues(hashtagArr)) {
      hashtagInp.setCustomValidity('Хэштеги не должны повторяться');
    } else {
      hashtagInp.setCustomValidity('');
    }
  }
}

function hashtagChangeHandler() {
  hashtagInp.setCustomValidity('');
}

function imgSubmitHandler(e) {
  validateHashtags();
  if (!imgUploadForm.checkValidity()) {
    e.preventDefault();
    imgUploadForm.reportValidity();
  }
}

commentInp.addEventListener('invalid', function (e) {
  console.log(e);
});

hashtagInp.addEventListener('input', hashtagChangeHandler);
imgUploadForm.addEventListener('submit', imgSubmitHandler);

function init() {
  renderPreviews();
}

init();
