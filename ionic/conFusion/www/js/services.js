'use strict';

angular.module('conFusion.services', ['ngResource'])
.constant("baseURL","http://localhost:3000/")
.constant("conFusionHistory", ["Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.", "The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan."])
.service('menuFactory', ['$resource', 'baseURL', menuFunc])
.factory('corporateFactory', ['$resource', 'baseURL', corporateFunc])
.factory('feedbackFactory', ['$resource', 'baseURL', feedbackFunc])
.factory('favoriteFactory', ['$resource', 'baseURL', '$ionicPopup', '$ionicLoading', '$timeout', favoriteFunc])
.factory('loadingFactory', ['$resource', 'baseURL', '$ionicPopup', '$ionicLoading', '$timeout', loadingFunc])
;

function loadingFunc($resource, baseURL, $ionicPopup, $ionicLoading, $timeout)
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

function favoriteFunc($resource, baseURL, $ionicPopup, $ionicLoading, $timeout)
{
  var favFac = {};
  var favorite_dish_id_list = [];

  favFac.deleteFavorite = function (dish_id) {
    favorite_dish_id_list = favorite_dish_id_list
                            .reduce(function(reminding_dishes, item) {
                              if (dish_id !== item) {
                                reminding_dishes.push(item);
                              }
                              return reminding_dishes;
                            }, []);
  }

  favFac.addFavorite = function (dish_id) {
    var found_dish = favorite_dish_id_list
                    .filter(function(item_id) {
                      return item_id == dish_id;
                    });
    if (found_dish.length === 0) {
      favorite_dish_id_list.push(dish_id);
    }
  };

  favFac.getFavorites = function() { return favorite_dish_id_list; };

  return favFac;
}

function menuFunc($resource,baseURL)
{
  
  this.getDishes = function(){
    
    return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
    
  };
  
  // implement a function named getPromotion
  // that returns a selected promotion.
  this.getPromotion = function() {
    return   $resource(baseURL+"promotions/:id");;
  }
}

function corporateFunc($resource,baseURL)
{
  return $resource(baseURL+"leadership/:id");
}

function feedbackFunc($resource,baseURL)
{
  return $resource(baseURL+"feedback/:id", null, {'update' : {method: 'PUT'}});
}
