'use strict';

(function () {
  var picturesList = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture__link');
  var otherPeoplePictures = [];

  function generatePictureUrl(id) {
    var url = 'photos/' + id + '.jpg';
    return url;
  }

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

  function generatePreviewNode(obj) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.href = obj.url;
    pictureElement.querySelector('.picture__img').src = obj.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = obj.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = obj.comments.length;

    return pictureElement;
  }

  function generatePostData(url) {
    return {
      url: url,
      likes: window.assets.getRandomInteger(15, 200),
      comments: generateComments(),
      description: window.assets.pickRandomArrEl(window.data.DESCRIPTIONS)
    };
  }

  function addPreviewClickListener(link, post) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.renderPost(post);
    });
  }

  window.renderPreviews = function () {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < window.data.PICTURES_QUANTITY; i++) {
      var url = generatePictureUrl(i + 1);
      var postData = generatePostData(url);
      otherPeoplePictures.push(postData);
      var postPreviewNode = generatePreviewNode(postData);
      addPreviewClickListener(postPreviewNode, postData);
      fragment.appendChild(postPreviewNode);
    }

    picturesList.appendChild(fragment);
  };
})();
