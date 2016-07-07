'use strict';

angular.module('conFusion.services', ['ngResource'])
// .constant("dataURL", "http://localhost:3000/") // for json-server localhost
// .constant("dataURLFormat", "") // for json-server localhost
.constant("dataURLFormat", ".json") // for firebase 
.constant("dataURL", "https://confusionrest.firebaseio.com/") // firebase
.constant("imageURL", "http://localhost:8180/") // local
// .constant("imageURL", "https://confusionrest.firebaseapp.com/") // firebase public
.constant("conFusionHistory", ["Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.",
                               "The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan."])
.factory('menuFactory', ['$resource', 'dataURL', 'dataURLFormat', menuFunc])
.factory('promotionFactory', ['$resource', 'dataURL', 'dataURLFormat', promotionFunc])
.factory('corporateFactory', ['$resource', 'dataURL', 'dataURLFormat', corporateFunc])
.factory('feedbackFactory', ['$resource', 'dataURL', 'dataURLFormat', feedbackFunc])
.factory('favoriteFactory', ['$resource', 'dataURL', 'dataURLFormat', '$ionicPopup', '$ionicLoading', '$timeout', favoriteFunc])
.service('favoriteService', ['$resource', 'menuFactory', 'dataURL', 'dataURLFormat', '$ionicPopup', '$ionicLoading', '$timeout', '$localStorage', favoriteServiceFunc])
.factory('loadingFactory', ['$resource', 'dataURL', 'dataURLFormat', '$ionicPopup', '$ionicLoading', '$timeout', loadingFunc])
.factory('imageFactory', ['$resource', 'imageURL', imageFunc])
.service('$localStorage', ['$window', localStorageServ])
;

function localStorageServ($window) {
  var local_storage = $window.localStorage;
  this.get = function(key, value) {
    return local_storage[key] || value;
  };
  this.set = function(key, value) {
    local_storage[key] = value;
  };
  this.getObj = function(key, value) {
    var saved_obj = local_storage[key];
    if (saved_obj) {
      return JSON.parse(saved_obj);
    } else {
      return value;
    }
  };
  this.setObj = function(key, value) {
    local_storage[key] = JSON.stringify(value);
  };
}

function loadingFunc($resource, dataURL, dataURLFormat, $ionicPopup, $ionicLoading, $timeout)
{ // ionic popup, loading, un-loading(hiding), calback, timeout
  var loadFac = {};

  loadFac.popupLoading = function(message, loading, callback, timelimit)
  { // popup, then "show-loading + message, timeout, hide-loading, thn callback"
    $ionicPopup
    .confirm(message)
    .then(function(confirmed) {
      if (confirmed) {
        loadFac.loading(loading, callback, timelimit);
      }
    });
  };

  loadFac.loading = function(message, callback, timelimit)
  { // show-loading + message, timeout, hide-loading, thn callback
    showLoading(message, function() {
      $timeout(function() {
        hideLoading(function() {
          callback();
        });
      }, timelimit);
    });

    function showLoading(message, callback) {
      $ionicLoading
      .show(message)
      .then(callback);
    };

    function hideLoading(callback) {
      $ionicLoading
      .hide()
      .then(callback);
    };
  }

  return loadFac;
}

function favoriteServiceFunc($resource, menuFactory, dataURL, dataURLFormat, $ionicPopup, $ionicLoading, $timeout, $localStorage)
{
  var self = this;

  self.favorite_dish_list = $localStorage.getObj("favorites", []);
  self.deleteFavorite = function (dish_id) {
    console.log("srv delete favorite", dish_id);
    self.favorite_dish_list = self.favorite_dish_list
                            .reduce(function(reminding_dishes, item) {
                              if (dish_id !== item.id) {
                                reminding_dishes.push(item);
                              }
                              return reminding_dishes;
                            }, []);
    $localStorage.setObj("favorites", self.favorite_dish_list);
    console.log("srv delete favorite_dish_list", self.favorite_dish_list);
  }

  self.addFavorite = function (dish_id) {
    console.log("srv add favorite", dish_id);
    var found_dish = self.favorite_dish_list
                     .filter(function(item) {
                       return item.id == dish_id;
                     });
    if (found_dish.length === 0) {

      menuFactory
      .get({id:dish_id})
      .$promise.then(
        function(dish){
          self.favorite_dish_list.push(dish);
          $localStorage.setObj("favorites", self.favorite_dish_list);
          console.log("srv addFavorite favorite_dish_list", self.favorite_dish_list);
        },
        function(response) {
          console.log("Error: "+response.status + " " + response.statusText);
        });

    }
  };

  self.getFavorites = function() {
    console.log("srv getFavorites favorite_dish_list", self.favorite_dish_list);
    self.favorite_dish_list = $localStorage.getObj("favorites", []);
    return self.favorite_dish_list;
  };

}

function favoriteFunc($resource, dataURL, dataURLFormat, $ionicPopup, $ionicLoading, $timeout)
{
  var favFac = {};
  var favorite_dish_id_list = [];

  favFac.deleteFavorite = function (dish_id) {
    console.log("fac delete favorite", dish_id);
    favorite_dish_id_list = favorite_dish_id_list
                            .reduce(function(reminding_dishes, item) {
                              if (dish_id !== item) {
                                reminding_dishes.push(item);
                              }
                              return reminding_dishes;
                            }, []);
    console.log("fac delete favorite", favorite_dish_id_list);
  }

  favFac.addFavorite = function (dish_id) {
    console.log("add favorite", dish_id);
    var found_dish = favorite_dish_id_list
                    .filter(function(item_id) {
                      return item_id == dish_id;
                    });
    if (found_dish.length === 0) {
      favorite_dish_id_list.push(dish_id);
      console.log("fac add favorite", favorite_dish_id_list);
    }
  };

  favFac.getFavorites = function() {
    console.log("fac get favorite", favorite_dish_id_list);
    return favorite_dish_id_list;
  };

  return favFac;
}

function menuFunc($resource, dataURL, dataURLFormat)
{
  return $resource(dataURL+"dishes/:id" + dataURLFormat ,null,  {'update':{method:'PUT' }});
}

function promotionFunc($resource, dataURL, dataURLFormat)
{
  return $resource(dataURL+"promotions/:id" + dataURLFormat);;
}

function corporateFunc($resource,dataURL, dataURLFormat)
{
  return $resource(dataURL+"leadership/:id"+dataURLFormat);
}

function feedbackFunc($resource,dataURL,dataURLFormat)
{
  return $resource(dataURL+"feedback/:id"+dataURLFormat, null, {'update' : {method: 'PUT'}});
}

function imageFunc($resource, imageURL)
{
  return $resource(imageURL + "images/:id");
}
