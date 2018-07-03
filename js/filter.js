'use strict';

(function () {
  var filters = document.querySelector('.img-filters');
  var buttons = filters.querySelectorAll('.img-filters__button');
  var Filter = {
    'filter-popular': filterByPopularity,
    'filter-new': filterByNew,
    'filter-discussed': filterByDiscuss
  };
  var DEBOUNCE_INTERVAL = 500;
  var initArr = [];

  function addActiveClass(btn) {
    var activeClass = 'img-filters__button--active';
    filters.querySelector('.' + activeClass).classList.remove(activeClass);
    btn.classList.add(activeClass);
  }

  var onFilterChange = window.assets.debounce(function (btn, rebuildArr, callback) {
    var arr = rebuildArr();
    addActiveClass(btn);
    callback(arr);
  }, DEBOUNCE_INTERVAL);

  function showFilters(arr, callback) {
    if (!filters.classList.contains('img-filters--inactive')) {
      return false;
    }

    filters.classList.remove('img-filters--inactive');
    initArr = arr;

    buttons.forEach(function (el) {
      el.addEventListener('click', function () {
        var filter = el.id;
        onFilterChange(el, Filter[filter], callback);
      });
    });

    return false;
  }

  function filterByDiscuss() {
    var arr = initArr.slice().sort(function (a, b) {
      var adiscussion = a.comments.length;
      var bdiscussion = b.comments.length;
      var discussionDiff = bdiscussion - adiscussion;

      if (discussionDiff === 0) {
        discussionDiff = b.likes - a.likes;
      }
      return discussionDiff;
    });

    return arr;
  }

  function filterByPopularity() {
    return initArr;
  }

  function filterByNew() {
    var arr = initArr.slice().sort(function () {
      return 0.5 - Math.random();
    });

    return arr.slice(0, 10);
  }

  window.filter = {
    init: showFilters
  };
})();
