'use strict';

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
    url,
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

  for (var i = 0; i < postData.comments.length; i++) {
    var commentNode = postNode.querySelector('.social__comment').cloneNode(true);
    commentNode.querySelector('.social__picture').src = 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
    commentNode.querySelector('.social__text').textContent = postData.comments[i];
    fragment.appendChild(commentNode);
  }

  commentsList.innerHTML = '';
  commentsList.appendChild(fragment);

  post.parentNode.replaceChild(postNode, post);
}

function renderPreviews() {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < PICTURES_QUANTITY; i++) {
    var url = generatePictureUrl(i + 1);
    var postData = generatePostData(url);
    otherPeoplePictures.push(postData);
    var postPreviewNode = generatePreviewNode(postData);
    fragment.appendChild(postPreviewNode);
  }

  picturesList.appendChild(fragment);
}

function init() {
  renderPreviews();
  var post = otherPeoplePictures[0];
  renderPost(post);
}

init();
