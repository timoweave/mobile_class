// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('conFusion', ['ionic', 'ngCordova', 'conFusion.controllers', 'conFusion.services'])

.run(function($ionicPlatform, $cordovaSplashscreen, $timeout, $rootScope, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      window.cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }

    $timeout(function() {
      // $cordovaSplashscreen.hide();
    }, 1000);

    $rootScope.$on('$stateChangeStart', function() {
      $rootScope.$broadcast('loading:show')
    });
    $rootScope.$on('$stateChangeSuccess', function() {
      $rootScope.$broadcast('loading:hide')
    });
    $rootScope.$on('loading:show', function() {
      console.log('loading:show ...');
      $ionicLoading.show({
        template: "<ion-spinner></ion-spinner> hahaha ..."
      });
    });
    $rootScope.$on('loading:hide', function() {
      console.log('loading:hide ...');
      $timeout(function() { $ionicLoading.hide() }, 10000);
      $ionicLoading.hide();
    });

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'mainContent': {
        templateUrl: 'templates/home.html',
        controller: 'IndexController',
        resolve : {
          'dish' : ['menuFactory',
                    function(menuFactory) {
                      return menuFactory.get({id:0})
                             .$promise.then(
                               function(dish){
                                 return dish;
                               },
                               function(response) {
                                 
                                 console.log("Error: "+response.status + " " + response.statusText);
                               }
                             );
                    }],
          'promotion' : ["promotionFactory",
                         function(promotionFactory) {
                           return promotionFactory.get({id:0});
                         }],
          'leader' : ["corporateFactory",
                      function (corporateFactory) {
                           return corporateFactory.get({id:3});                        
                      }]
        }
      }
    }
  })

  .state('app.aboutus', {
      url: '/aboutus',
      views: {
        'mainContent': {
          templateUrl: 'templates/aboutus.html',
          controller: "AboutController",
          resolve : {
            leaders : ["corporateFactory",
                       function(corporateFactory) {
                         return corporateFactory.query();
                      }]
          }
        }
      }
    })

  .state('app.contactus', {
      url: '/contactus',
      views: {
        'mainContent': {
          templateUrl: 'templates/contactus.html',
          controller: 'ContactController'
        }
      }
    })

  .state('app.menu', {
    url: '/menu',
    views: {
      'mainContent': {
        templateUrl: 'templates/menu.html',
        controller: 'MenuController',
        resolve : {
          'dishes' : ['menuFactory', '$timeout', '$ionicLoading',
                      function(menuFactory, $timeout, $ionicLoading) {
                        return menuFactory
                               .query(function(response) {
                                 return response;
                               }, function(response) {
                                    console.log("Error : " + response.status + response.statusText);
                                  });
                      } ]
        }
      }
    }
  })

  .state('app.favorites', {
    url: '/favorites',
    views: {
      'mainContent': {
        templateUrl: 'templates/favorites.html',
        controller: 'FavoriteController',
        resolve : {
          'dishes' : ['menuFactory', '$timeout', '$ionicLoading', 
                      function(menuFactory, $timeout, $ionicLoading) {
                        return menuFactory
                               .query(function(response) {
                                 return response;
                               }, function(response) {
                                    console.log("Error : " + response.status + response.statusText);
                                  });
                      } ],
          'favorites' : ['favoriteService', function(favoriteService) {
                                              return favoriteService.getFavorites();
                                            } ],
          'promotions': ['promotionFactory', function(promotionFactory) {
                                               var promo = undefined;
                                               promotionFactory.query(function(resp) { promo = resp; } );
                                               return promo;
                                             } ]
        }
      }
    }
  })

  .state('app.feedback', {
    url: '/feedback',
    views: {
      'mainContent': {
        templateUrl: 'templates/dish-comment.html',
        controller: 'FeedbackController'
      }
    }
  })
  .state('app.register', {
    url : '/register',
    views : {
      'mainContent' : {
        templateUrl : 'templates/register.html',
        controller: 'RegisterController'
      }
    }
  })
  .state('app.dishdetails', {
    url: '/menu/:id',
    views: {
      'mainContent': {
        templateUrl: 'templates/dishdetail.html',
        controller: 'DishDetailController',
        resolve : {
          'dish': ['$stateParams', 'menuFactory', function($stateParams, menuFactory) {
                                                    var param_id = parseInt($stateParams.id, 10);
                                                    return menuFactory
                                                           .get({id:param_id})
                                                           .$promise.then(function(got_dish) {
                                                             return got_dish;
                                                           });
                                                  } ]
        }
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
