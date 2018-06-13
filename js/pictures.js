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

function generatePictureUrl() {
  var pictureNumber = PICTURES_QUANTITY ? PICTURES_QUANTITY-- : 0;
  var url = 'photos/' + pictureNumber + '.jpg';
  return url;
}

function generateComments() {
  var comments = [];
  var commentsQuantity = getRandomInteger(1, 5);
  var commentSentences = getRandomInteger(1, 2);
  for (var i = 0; i <= commentsQuantity; i++) {
    var comment = '';
    for (var j = 0; j <= commentSentences; j++) {
      var sentence = pickRandomArrEl(COMMENTS);
      comment += sentence;
    }
    comments.push(comment);
  }
  return comments;
}

function generatePictureData() {
  return {
    url: generatePictureUrl(),
    likes: getRandomInteger(15, 200),
    comments: generateComments(),
    description: pickRandomArrEl(DESCRIPTIONS)
  };
}

while (PICTURES_QUANTITY > 0) {
  var picture = generatePictureData();
  otherPeoplePictures.push(picture);
}
console.log(otherPeoplePictures);
