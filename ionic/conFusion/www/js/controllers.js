angular
.module('conFusion.controllers', [])
.controller('AppCtrl', appCtrl)
.controller('MenuController', ['$scope', '$stateParams', 'menuFactory', 'favoriteFactory', 'loadingFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', menuController])
.controller('FavoriteController', ['$scope', '$stateParams', 'menuFactory', 'favoriteFactory', 'loadingFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', favoriteController])
.controller('ContactController', ['$scope', contactController])
.controller('FeedbackController', ['$scope', 'menuFactory', 'feedbackFactory', feedbackController])
.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'favoriteFactory', 'loadingFactory', 'feedbackFactory', 'baseURL', '$ionicPopover', "$ionicModal", "$timeout", dishDetailController])
.controller('DishCommentController', ['$scope', 'menuFactory', dishCommentController])
.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', indexController])
.controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', 'conFusionHistory', aboutController])
;

function favoriteController($scope, $stateParams, menuFactory, favoriteFactory, loadingFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout)
{
  $scope.shouldShowDeleteThisFavorite = undefined;
  $scope.shouldShowDeleteFavorite = false;
  $scope.baseURL = baseURL;
  $scope.dishes = undefined;

  $scope.showDeleteThisButton = function(dish_id) {
    $scope.shouldShowDeleteThisFavorite = dish_id;
  }

  $scope.shouldShowDeleteThisButton = function(dish_id) {
    return (dish_id === $scope.shouldShowDeleteThisFavorite);
  }
  
  $scope.toggleDelete = function() {
    if ($scope.shouldShowDeleteFavorite === true) {
      $scope.shouldShowDeleteFavorite = false;      
    } else {
      $scope.shouldShowDeleteFavorite = true;      
    }
  };

  $scope.deleteFavorite = function(dish_id) {
    var dish_name = $scope.dishes[dish_id].name;
    var message = { title : 'Confirm Deleting Favorite',
                    template : 'Are you sure to delete ' + dish_name + '?'};
    var deleting = "Deleting Favorite "+ dish_name;
    loadingFactory.popupLoading(message, deleting, function() {
      favoriteFactory.deleteFavorite(dish_id);
      $scope.shouldShowDeleteFavorite = false;
    }, 500);
  }

  $scope.favorites = function() {
    // console.log("get favorites", favoriteFactory.getFavorites());
    var favorites = [];
    favoriteFactory.getFavorites().forEach(function(index) {
      var dish = $scope.dishes[index];
      favorites.push(dish);
    });
    return favorites;
  };

  if (($scope.dishes === undefined) || ($scope.dishes.length == 0)) {
    var message = {template : "loading favorite dishes..."};
    loadingFactory.loading(message, function() {
      menuFactory.getDishes().query(
        function(response) {
          $timeout(function() {
            $scope.dishes = response;
            $scope.showMenu = true;
          }, 500);
        },
        function(response) {
          $timeout(function() {
            $scope.message = "Error: "+response.status + " " + response.statusText;
          }, 500);
        });
      // $scope.favorites();
    }, 500);
  }
  
}

function menuController($scope, $stateParams, menuFactory, favoriteFactory, loadingFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout)
{
  $scope.baseURL = baseURL;
  $scope.tab = 1;
  $scope.tabList = [{ index: 1, title : "The Menu"},
                    { index : 2, title : "Appetizers"},
                    { index: 3, title : "Mains"},
                    { index : 4, title : "Desserts"}];
  $scope.filterText = '';
  $scope.showDetails = false;
  $scope.showMenu = false;
  $scope.message = "Loading ...";
  $scope.dishes = undefined;

  $scope.select = function(setTab) {
    $scope.tab = setTab;
    
    if (setTab === 2) {
      $scope.filtText = "appetizer";
    }
    else if (setTab === 3) {
      $scope.filtText = "mains";
    }
    else if (setTab === 4) {
      $scope.filtText = "dessert";
    }
    else {
      $scope.filtText = "";
    }
  };

  $scope.isSelected = function (checkTab) {
    return ($scope.tab === checkTab);
  };
  
  $scope.toggleDetails = function() {
    $scope.showDetails = !$scope.showDetails;
  };

  $scope.addFavorite = function(dish_id) {

    var dish_name = $scope.dishes[dish_id].name;
    var message = { title : 'Adding Favorite',
                    template : 'Add ' + dish_name + ' to your favorite!'};
    var adding = "Adding " + dish_name;
    loadingFactory.popupLoading(message, adding, function() {
      favoriteFactory.addFavorite(dish_id);
      // console.log("all favorites ", favoriteFactory.getFavorites());
      $ionicListDelegate.closeOptionButtons();
    }, 500);
  }

  if (($scope.dishes === undefined) || ($scope.dishes.length == 0)) {
    var loading_message = "loading dishes...";
    loadingFactory.loading(loading_message, function() {
      menuFactory.getDishes().query(
        function(response) {
          $scope.dishes = response;
          $scope.showMenu = true;
        },
        function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
        });
    }, 500);
  }
}

function appCtrl($scope, $ionicModal, $timeout)
{

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // $scope.$on('$ionicView.enter', function(e) {
  // });

  // Form data for the login modal
  $scope.loginData = {};
  
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.showLogin = function() {
    $scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 500);
  };


  //--//--
  $scope.reservation = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve_table.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveTableModal = modal;
  });
  
  // Triggered in the login modal to close it
  $scope.closeReserveTable = function() {
    $scope.reserveTableModal.hide();
  };
  
  // Open the login modal
  $scope.showReserveTable = function() {
    $scope.reserveTableModal.show();
  };
  
  // Perform the login action when the user submits the login form
  $scope.doReserveTable = function() {
    console.log('Doing table reservation', $scope.reservation);
    
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeReserveTable();
    }, 500);
  };
  
  //--//--
}

function contactController($scope)
{

  $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
  
  var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
  
  $scope.channels = channels;
  $scope.invalidChannelSelection = false;
  $scope.address = { street : "121, Clear Water Bay Road", area : "Clear Water Bay",  city: "Kowloon", country : "Hong Kong"};
  $scope.email = "confusion@food.net";
  $scope.phone = "851 1234 5678";
  $scope.fax = "851 8765 4321";
  $scope.actions = [ {icon : "ion-android-call", color : "button-positive", label : "Call"},
                     {icon : "ion-social-skype", color : "button-calm", label : "Skype"},
                     {icon : "ion-andriod-mail", color : "button-balanced", label : "Email"}]
}

function feedbackController($scope, menuFactory, feedbackFactory)
{
  
  $scope.sendFeedback = function() {
    
    console.log($scope.feedback);
    
    if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
      $scope.invalidChannelSelection = true;
      console.log('incorrect');
    }
    else {
      $scope.invalidChannelSelection = false;
      feedbackFactory.save($scope.feedback);
      $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
      $scope.feedback.mychannel="";
      $scope.feedbackForm.$setPristine();
      console.log($scope.feedback);
    }
  };
}

function dishDetailController($scope, $stateParams, menuFactory, favoriteFactory, loadingFactory, feedbackFactory, baseURL, $ionicPopover, $ionicModal, $timeout)
{
  $scope.baseURL = baseURL;
  
  $scope.dish = {};
  $scope.showDish = false;
  $scope.message="Loading ...";
  
  $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
                .$promise.then(
                  function(response){
                    $scope.dish = response;
                    $scope.showDish = true;
                  },
                  function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                  }
                );

  $ionicPopover
  .fromTemplateUrl('templates/dishDetailMenu.html', { scope: $scope })
  .then(function(popover) {
    $scope.popoverMenu = popover;
    $scope.addFavorite = function() {
      var dish_name = $scope.dish.name;
      var message = { title : 'Adding Favorite',
                      template : 'Add ' + dish_name + ' to your favorite!'};
      var adding = "Adding " + dish_name;
      loadingFactory.popupLoading(message, adding, function() {
        favoriteFactory.addFavorite($scope.dish.id);
      }, 500);
    }
    $scope.addComment = function() {
      $scope.showFeedback();
      console.log("hello comment", $scope.dish);
    }
  });
  $scope.openPopoverMenu = function($event, dish) {
    $scope.dish = dish;
    $scope.popoverMenu.show($event);
  };
  $scope.closePopoverMenu = function() {
    $scope.popoverMenu.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.popoverMenu.remove();
  });
  $scope.$on('popoverMenu.hidden', function() {
  });
  $scope.$on('popoverMenu.removed', function() {
  });

  $ionicModal.fromTemplateUrl('templates/feedback.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.feedbackModal = modal;
    $scope.feedbackData = {};
  });

  // Triggered in the login modal to close it
  $scope.closeFeedback = function() {
    $scope.feedbackModal.hide();
  };

  // Open the feedback modal
  $scope.showFeedback = function() {
    $scope.feedbackModal.show();
  };

  // Perform the feedback action when the user submits the feedback form
  $scope.doFeedback = function() {
    console.log('Doing feedback', $scope.feedbackData);

    // Simulate a feedback delay. Remove this and replace with your feedback
    // code if using a feedback system
    $scope.feedbackData.date = new Date().toISOString();
    $scope.dish.comments.push($scope.feedbackData);
    menuFactory.getDishes().update({id:$scope.dish.id}, $scope.dish);
    $scope.feedbackData = {rating:0, comment:"", author:"", date:""};

    $timeout(function() {
      $scope.closeFeedback();
    }, 500);
  };

}

function dishCommentController($scope,menuFactory)
{
  
  $scope.mycomment = {rating:5, comment:"", author:"", date:""};
  
  $scope.submitComment = function () {
    
    $scope.mycomment.date = new Date().toISOString();
    console.log($scope.mycomment);
    
    $scope.dish.comments.push($scope.mycomment);
    menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
    
    $scope.commentForm.$setPristine();
    
    $scope.mycomment = {rating:5, comment:"", author:"", date:""};
  }
}

function indexController($scope, menuFactory, corporateFactory, baseURL)
{

  $scope.baseURL = baseURL;
  $scope.leader = corporateFactory.get({id:3});
  $scope.showDish = false;
  $scope.message="Loading ...";
  $scope.dish = menuFactory.getDishes().get({id:0})
                .$promise.then(
                  function(response){
                    $scope.dish = response;
                    $scope.showDish = true;
                  },
                  function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                  }
                );
  $scope.promotion = menuFactory.getPromotion().get({id:0});
  
}

function aboutController($scope, corporateFactory, baseURL, conFusionHistory)
{
  
  $scope.baseURL = baseURL;
  $scope.leaders = corporateFactory.query();
  console.log($scope.leaders);
  $scope.histories = conFusionHistory;
}