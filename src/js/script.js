document.addEventListener('DOMContentLoaded', function() {

  var ideasBlock = document.querySelector('.ideas__block');

  /* At first initialising render of Ideas Block */
  buildIdeasBlock();
  /* Then making its layout */
  layoutIdeasBlock();

  /* Listening for custom search of ideas in search-form */
  var searchForm = document.querySelector('.search-form');
  searchForm.addEventListener('submit', buildIdeasBlock);


  function buildIdeasBlock(e) {
    if(e) {
      // Hacking IE8
      e = e || window.event; 
      e.preventDefault ? e.preventDefault() : (e.returnValue=false);
    }

    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();

    var keyAPI = '4351479-f7575f8ebe04bee24766dab5a';
    var searchQuery = document.querySelector('.search-form__input').value;
    var url = "https://pixabay.com/api/?editors_choice=true&per_page=7&key="+keyAPI+"&q="+encodeURIComponent(searchQuery);

    xhr.open('GET', url);
    xhr.send();

    xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;

      if (this.status != 200) {
        alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
        return;
      }

      var photos = JSON.parse(this.responseText).hits;
      var compiledTemplate = _.template(ideas__template.innerHTML);
      var renderedIdeasBlock = compiledTemplate({data: photos});
      ideasBlock.innerHTML = renderedIdeasBlock;

      layoutIdeasBlock();
    }
  }


  // Invoking Isotope-Masonry plugin
  function layoutIdeasBlock() {
    new Isotope(ideasBlock, {
      layoutMode: 'fitRows',
      itemSelector: '.ideas__item',
      percentPosition: true,
      masonry: {
        columnWidth: '.ideas__sizer'
      }
    });
  }
  

  // Making new instance for each slider on page
  Array.prototype.slice.call(document.querySelectorAll('.hww-item__slider')).forEach(function (element, index) {
    var flkty = new Flickity(element, {
      wrapAround: true,
      prevNextButtons: false,
      pageDots: false
    });

    // Button previous
    var previousButton = element.parentNode.querySelector('.hww-item__button--prev');
    previousButton.addEventListener('click', function() {
      flkty.previous();
    });
    // Button next
    var nextButton = element.parentNode.querySelector('.hww-item__button--next');
    nextButton.addEventListener('click', function() {
      flkty.next();
    });
  });

});