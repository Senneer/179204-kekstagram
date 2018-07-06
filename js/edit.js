'use strict';

(function () {
  var uploadFileInp = document.querySelector('#upload-file');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadCancelBtn = document.querySelector('.img-upload__cancel');
  var imgScaleInp = document.querySelector('.resize__control--value');
  var plusScaleBtn = document.querySelector('.resize__control--plus');
  var minusScaleBtn = document.querySelector('.resize__control--minus');
  var uploadPreview = document.querySelector('.img-upload__preview');
  var previewUploadImg = uploadPreview.querySelector('img');
  var imgEffectInputs = document.querySelectorAll('.effects__radio');
  var effectScaleWrapper = document.querySelector('.img-upload__scale');
  var hashtagInp = document.querySelector('.text__hashtags');
  var commentInp = document.querySelector('.text__description');
  var form = document.querySelector('.img-upload__form');

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  imgEffectInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      var currentEffect = window.effect.current();

      if (currentEffect === 'none') {
        previewUploadImg.className = '';
        previewUploadImg.style.filter = 'none';
        effectScaleWrapper.classList.add('hidden');
      } else {
        effectScaleWrapper.classList.remove('hidden');
        window.slider.reset();
        applyEffect();
      }
    });
  });

  function setImgScaleValue() {
    var scale = imgScaleInp.value.replace(/\% ?/, '');
    uploadPreview.style.transform = 'scale(' + scale / 100 + ')';
  }

  function escPressHandler(e) {
    window.assets.isEscEvent(e, closeImgUpload);
  }

  function applyEffect() {
    var val = window.slider.getState();
    previewUploadImg.style.filter = window.effect.cssProp(val);
    window.effect.changeImgClass(previewUploadImg);
  }

  function clearTextfields() {
    hashtagInp.value = '';
    commentInp.value = '';
  }

  function setDefaultFormVals() {
    var DEFAULT_SCALE = 100;

    clearTextfields();
    window.slider.reset();
    window.scale.setState(DEFAULT_SCALE);
    setImgScaleValue();
    imgEffectInputs[imgEffectInputs.length - 1].checked = true;
  }

  function openImgUpload() {
    imgUploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', escPressHandler);
    setDefaultFormVals();
    window.slider.init(applyEffect);
    applyEffect();
  }

  function closeImgUpload() {
    uploadFileInp.value = '';
    setDefaultFormVals();
    imgUploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', escPressHandler);
  }

  uploadFileInp.addEventListener('change', function () {
    var file = uploadFileInp.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (el) {
      return fileName.endsWith(el);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        previewUploadImg.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
    openImgUpload();
  });

  uploadCancelBtn.addEventListener('click', function () {
    closeImgUpload();
  });

  plusScaleBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scale.increase(setImgScaleValue);
  });

  minusScaleBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scale.decrease(setImgScaleValue);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);

    window.backend.upload(data, closeImgUpload, window.backend.showError);
  });
})();
