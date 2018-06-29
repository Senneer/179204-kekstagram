'use strict';

(function () {

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
    window.assets.isEscEvent(e, closeBigPicture);
  }

  window.renderPost = renderPost;

})();