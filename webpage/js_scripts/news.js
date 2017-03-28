'use strict';

window.addEventListener('load', setupNews);

var news;

var apiUrl = 'https://newsapi.org/v1/articles?source=';

var sortUrl = '&sources?category=';
var newsApiKey = '&apiKey=358cd488b9374462aeb65917dac364b4';

var sourceUrl = 'the-guardian-uk';
var sourceCategory = 'general';


function setupNews() {

//    localStorage.getItem('url');
    getCategory();



  //  var url = 'https://newsapi.org/v1/articles?source=' + sourceUrl + '&sources?category=' + sourceCategory + '&apiKey=358cd488b9374462aeb65917dac364b4';
    var url = apiUrl + sourceUrl + sortUrl + sourceCategory + newsApiKey;
    console.log(url);

  // localStorage.setItem('newsPanel', url);
  //   localStorage.getItem('url');

  //  console.log("SAVED " + localStorage.getItem('url'));


    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            getNews(JSON.parse(xhr.responseText));
        } else {
            document.querySelector('body > main').innerHTML = 'sorry, something went wrong...';
        }
    }
    xhr.send();
}

var slideIndex = 0;
var timer;

function getNews(data) {
    news = data;
    slideShow();
}

function slideShow() {
    var newsPicture = window.newsPicturePanel;
    var newsTitle = window.newsTitlePanel;
    var newsText = window.newsTextPanel;

    if (slideIndex < 3) {
        newsPicture.src = news.articles[slideIndex].urlToImage;
        newsTitle.textContent = news.articles[slideIndex].title;
        newsText.textContent = news.articles[slideIndex].description;
        slideIndex++;

    } else {
        slideIndex = 0;
    }
    clearInterval(timer);
    timer = setInterval(slideShow, 7000);
}



// ----------------------- NEWS SETTINGS ---------------------------------------

/*Switching between panels*/
var settingsBtn = document.getElementById('newsSettingsBtn');
var categoriesSection;

settingsBtn.onclick = function() {
    var div = document.getElementById('newsSettingsContainer');
    var newsContainer = document.getElementById('newsContainer');

    if (div.style.display === 'block') {
        div.style.display = 'none';
        newsContainer.style.display = 'block';
        console.log("Works - settingsBtn");
    } else {
        div.style.display = 'block';
        newsContainer.style.display = 'none';
        console.log("!works - settingsBtn");
        // sourceRequest();
    }
}

var switchBtn = document.getElementById('switchBtn');

switchBtn.onclick = function() {
    var div = document.getElementById('newsSettingsContainer');
    var newsContainer = document.getElementById('newsContainer');

    if (newsContainer.style.display === 'block') {
        newsContainer.style.display = 'none';
        div.style.display = 'block';
        console.log("Works - switchBtn");
    } else {
        newsContainer.style.display = 'block';
        div.style.display = 'none';
        console.log("!works - switchBtn");

    }
}

function sourceRequest() {

    var urlSources = 'https://newsapi.org/v1/sources';


    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlSources, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            getSource(JSON.parse(xhr.responseText));
        } else {
            document.querySelector('body > main').innerHTML = 'sorry, something went wrong...';
        }
    }
    xhr.send();

}
var categories;
var categoryValue;


function getCategory() {
    categories = document.getElementById('categories');
    categoryValue = categories.value;

    console.log(categoryValue);

    var categoriesContainer = window.newsSettingsContainer;
    categoriesSection = document.createElement('section');
    categoriesSection.id = 'sectionCategory';
    categoriesContainer.appendChild(categoriesSection);

    var div = document.createElement('div');

    if (categoryValue == "sport") {
        deleteCategorySection();
        categoriesSection.appendChild(div);
        div.id = "sport";
        sourceCategory = 'sport';
        sourceRequest();

    } else if (categoryValue == "business") {
        deleteCategorySection();
        categoriesSection.appendChild(div);
        div.id = "business";
        sourceCategory = 'business';
        sourceRequest();

    } else if (categoryValue == "entertainment") {
        deleteCategorySection();
        categoriesSection.appendChild(div);
        div.id = "entertainment";
        sourceCategory = 'entertainment';
        sourceRequest();

    } else if (categoryValue == "gaming") {
        deleteCategorySection();
        categoriesSection.appendChild(div);
        div.id = "gaming";
        sourceCategory = 'gaming';
        sourceRequest();

    } else if (categoryValue == "general") {
        deleteCategorySection();
        categoriesSection.appendChild(div);
        div.id = "general";
        sourceCategory = 'general';
        sourceRequest();

    } else if (categoryValue == "music") {
        deleteCategorySection();
        categoriesSection.appendChild(div);
        div.id = "music";
        sourceCategory = 'music';
        sourceRequest()

    } else if (categoryValue == "technology") {
        deleteCategorySection();
        categoriesSection.appendChild(div);
        div.id = "technology";
        sourceCategory = 'technology';
        sourceRequest();
    }

    window.categories.addEventListener('click', setupNews);

}

function deleteCategorySection() {
    document.getElementById("sectionCategory").remove();
}

function getSource(source) {
    var divs;

    for (var i = 0; i < source.sources.length; i++) {
        if (source.sources[i].category == categoryValue) {
            /*this code displays all icons from given category*/

            divs = document.getElementById(categoryValue);
            var btns = document.createElement('img');
            btns.src = source.sources[i].urlsToLogos.small;
            btns.id = source.sources[i].id;
            btns.className = "markIcons";
            divs.appendChild(btns);
        }
    }
    setUrlsource();
}

function setUrlsource() {
    var getIconClass = document.getElementsByClassName('markIcons');
    for (var i = 0; i < getIconClass.length; i++) {
        getIconClass[i].onclick = function(e) {
            sourceUrl = this.id;
            alert("You selected: " + this.id);
        }
        document.getElementById(categoryValue).addEventListener('click', setupNews);
    }
}

// -----------------------------------------------------------------------------
