var myApp = angular.module("grocerease", ["ui.router"])

myApp.config( function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/home")

    $stateProvider.state("home",{
        url: "/home",
        templateUrl: "index.html",
        controller: "indexController"
    })
    .state("register",{
        url:"/register",
        templateUrl:"/template/register.html",
        controller: "registerController"
    })
    ;
})

myApp.controller("indexController", [
    "$scope",
    "$http",
    "$state",
    "$window",
    function ($scope, $http, $state, $window){

        
        
        $scope.submitLoginForm = function () {
            var userLogin = {
              username: $scope.loginData.username,
              password: $scope.loginData.password,
            };
      
            console.log(userLogin);
      
            $scope.loginData = {};
      
            $http
              .post("http://10.21.81.248:8000/groceryapp/login/", userLogin)
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                if (error.data && error.data.message) {
                  $window.alert(error.data.message);
                } else {
                  $window.alert("An error occured. Please try again");
                }
              });
          };

        // $scope.isDropdownOpen = false;
        
        // $scope.toggleDropdown = function () {
        //     $scope.isDropdownOpen = !$scope.isDropdownOpen;
        // };

}]);

myApp.controller("loginController", [
    "$scope",
    "$http",
    "$state",
    "$window",
    function ($scope, $http, $state, $window) {
      $scope.loginData = {};
  
      $scope.submitLoginForm = function () {
        var userLogin = {
          username: $scope.loginData.username,
          password: $scope.loginData.password,
        };
  
        console.log(userLogin);
  
        $scope.loginData = {};
  
        $http
          .post("http://10.21.81.248/groceryapp/login/", userLogin)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            if (error.data && error.data.message) {
              $window.alert(error.data.message);
            } else {
              $window.alert("An error occured. Please try again");
            }
          });
      };
    },
  ]);

myApp.controller("registerController", [
    "$scope",
    "$http",
    "$state", 
    "$window",
    function ($scope, $http, $state, $window) {
      $scope.formData = {};
  
      $scope.submitForm = function () {

        var pass = $scope.formData.pass;
        var confirmPass = $scope.formData.cnfrmPass;
  
        var userData = {
          firstname: $scope.formData.fName,
          lastname: $scope.formData.lName,
          email: $scope.formData.email,
          username: $scope.formData.username,
          password: $scope.formData.pass,
          confirmPassword: $scope.formData.cnfrmPass,
        };
  
        console.log(userData);

        if (pass === confirmPass) {
          $scope.formData = {};
  
          $http({
            method: "POST",
            url: "http://10.21.81.248:8000/groceryapp/register/",
            data: userData
          })
            .then(function (response) {
              var register = response.data;
              console.log(register);    
              $state.go("login");
            })
            .catch(function (error) {
              if (error.data && error.data.message) {
                  $window.alert(error.data.message);
              } else {
                  $window.alert("An error occured. Please try again");
              }
            });
        } else {
          
        }
      };
    },
  ]);
  
