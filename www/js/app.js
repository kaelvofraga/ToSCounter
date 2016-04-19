(function () { 
  'use strict';

  angular.module('TosCalc', [
      'ui.router' 
    , 'LocalStorageModule'
  ])
  
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider
      .state('home', {
          url: '/',
          templateUrl: 'partials/home.html',
          controller: 'MainController',
          controllerAs: 'mainCtrl'
      });
    
    $urlRouterProvider.otherwise('/');
  }) 
   
  .controller('MainController', MainController);
  
  function MainController($scope, $timeout, localStorageService) {
    
    var updateLevel = function (stats) {
      var level = 0;
      angular.forEach(stats, function (stat) {
          level += stat.value;
       });
      return level; 
    }
    
    var resetTimeout = null;
    
    $scope.user = {};
    $scope.user.id = 1;
    $scope.editingName = false;
    $scope.resetTransformed = false;
    $scope.backup = null;   
    $scope.stats = localStorageService.get('stats' + $scope.user.id);
    $scope.user.name = localStorageService.get('user' + $scope.user.id);
    $scope.user.level = updateLevel($scope.stats);
    
    if ($scope.user.name === null) {
        $scope.user.name = "Enter your name";
    }
    
    if ($scope.stats === null) {
       $scope.stats = [
           {label: 'str', value: 0}
         , {label: 'con', value: 0}
         , {label: 'int', value: 0}
         , {label: 'spr', value: 0}
         , {label: 'dex', value: 0}
       ];
     }
     
     $scope.statIncrease = function(stat) {
       ++(stat.value);
       $scope.saveLocaly();
     } 
     
     $scope.statDecrease = function(stat) {
       --(stat.value);
       if (stat.value < 0) {
         stat.value = 0;
       }
       $scope.saveLocaly();
     } 
     
     $scope.saveLocaly = function() {
       $scope.user.level = updateLevel($scope.stats);      
       localStorageService.set('stats' + $scope.user.id, $scope.stats);
     }
     
     var transformResetButton = function() {
       $scope.resetTransformed = true;
       if (resetTimeout !== null) {
         $timeout.cancel(resetTimeout);
       } 
       resetTimeout = $timeout(function() {
         $scope.resetTransformed = false;
       }, 30000);
     }
     
     $scope.reset = function() { 
       $scope.backup = angular.copy($scope.stats);
       $scope.stats = [
           {label: 'str', value: 0}
         , {label: 'con', value: 0}
         , {label: 'int', value: 0}
         , {label: 'spr', value: 0}
         , {label: 'dex', value: 0}
       ];
       $scope.saveLocaly();
       transformResetButton();       
     }
     
     $scope.undo = function() { 
       $scope.stats = angular.copy($scope.backup);
       $scope.saveLocaly();
       $scope.resetTransformed = false;
       if (resetTimeout !== null) {
         $timeout.cancel(resetTimeout);
       }       
     }
     
     $scope.editName = function() {
         $scope.editingName = !$scope.editingName;
     }
     
     $scope.saveName = function() {
         localStorageService.set('user' + $scope.user.id, $scope.user.name);
     }               
  }  
  MainController.$inject = ['$scope', '$timeout', 'localStorageService'];     
  
})();