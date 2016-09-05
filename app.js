
var app = angular.module('mainApp', []);

app.controller('mainCtrl', ['$scope','$http', function($scope, $http) {

  $scope.gridHeaders = [
    "Truck Id",
    "Truck name",
    "Customer name",
    "Customer phone",
    "Pickup state",
    "Pickup zipCode",
    "Dropoff state",
    "Dropoff zipCode",
    "Payment mode",
    "Expected miles",
    "Expense",
    "Cost"
  ];

  $scope.truckList = [
    {id:100, name: 'Maximus'},
    {id:200, name: 'Avengers'},
    {id:300, name: 'XMen'}
  ];

  $scope.paymentModeList = [
    "COD", "Debit", "Credit", "Check"
  ];

  $scope.addOrderSubmit = function(){
    //Hide the modal if all input given is valid
    $("#myModal").modal("hide");
    
    //Debugging
    alert("Thanks for submitting");

  };
		
	$http.get("getTrucksInfo.json")
    .success(
      function(data) {
        $scope.response=data.reports
      }
    ).error(function(error){
      $scope.error = error;
    });
}]);
