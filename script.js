var app = angular.module('wikipediaApp', ['ngMaterial']);

app.controller("MainController", function($scope, $log, dataService){
  	var main = this;
	var urlBase = 'http://en.wikipedia.org/?curid=';
	main.term = '';
  
	main.searchWikipedia = function(term){
		dataService.searchWikipedia(term).then(function(data){
			main.response = data;
			var firstObject =  Object.keys(main.response)[0]
			setArticle(firstObject);
		});
	};
		
	//build wikipedia page URL from link parts
	function setArticle(pageId){
		main.focusedArticle = main.response[pageId];
		main.articleThumbnail = hasThumbnail(main.focusedArticle);
		main.articleURL = urlBase + pageId;
	}
	
	//check if a thumbnail exists
	function hasThumbnail(obj){
		if(obj.hasOwnProperty('thumbnail')){
			main.hasThumbnail = true;
			return obj.thumbnail;
		}
		main.hasThumbnail = false;
		return null;
	}

	
	main.setArticle = function(pageId){
		setArticle(pageId);
	};
	main.hasData = function(){
		if(main.response == null ){
			return false;
		}
		return true;
	}
	main.clear = function(){
		main.response = null;
		main.term = '';
	}
});


app.service('dataService', function($http, $log, $q){
  var apiBase = 'https://en.wikipedia.org/w/api.php?';
  this.searchWikipedia = function(term){
    var query = 'action=query&format=json&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
    var callback = '&callback=JSON_CALLBACK';
    var deferred = $q.defer();
    $http.jsonp(apiBase + query + term + callback)
      .success(function(data){
        deferred.resolve(data.query.pages);
      })
      .error(function(error){
        deferred.reject(error);
    });	
    return deferred.promise;
  }
});
