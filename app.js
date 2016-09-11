
var app = angular.module('mainApp', []);

app.controller('mainCtrl', ['$scope','$http', function($scope, $http) {

  $scope.isPickupContactSameAsCC = true;

  $scope.gridHeaders = [
    // "Truck Id",
    "Truck name",
    "Customer name",
    "Customer phone",
    "Order date",
    "Pickup date",
    "Pickup location",
    // "Pickup state",
    // "Pickup zipCode",
    "Dropoff date",
    "Dropoff location",
    // "Dropoff state",
    // "Dropoff zipCode",
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

  $scope.vehicles = [];
  $scope.addMoreVehicle = function(){
    var vehicle = new Object();
    vehicle.make = $scope.make;
    vehicle.model = $scope.model;
    vehicle.year = $scope.year;
    vehicle.vin = $scope.vin;
    $scope.vehicles.push(vehicle);

    $scope.make = "";
    $scope.model = "";
    $scope.year = "";
    $scope.vin = "";
  }

  $scope.response = null;
  $scope.addOrderSubmit = function(){
  
    var customerInfo = new Object();
    customerInfo.name = $scope.customerName;

    var order = new Object();
    order.truckId=$scope.selectedTruck.id;
    order.truckName=$scope.selectedTruck.name;
    
    var pickupContactInfo = null;
    var customerInfo = new Object();
    customerInfo.name = $scope.customerName;
    customerInfo.phone = $scope.customerContact;
    customerInfo.state = $scope.customerState;
    customerInfo.zipCode = $scope.customerZipCode;
    customerInfo.city = $scope.customerCity;
    order.customerInfo = customerInfo;


    if($scope.isPickupContactSameAsCC)
    {
      pickupContactInfo=customerInfo;
    }
    else
    {
      pickupContactInfo = new Object();
      pickupContactInfo.state = $scope.pickupState;
      pickupContactInfo.zipCode = $scope.pickupZipCode;
      pickupContactInfo.city = $scope.pickupCity;
      
    }  
    order.pickupContactInfo = pickupContactInfo;
    alert(pickupContactInfo.state + "," + pickupContactInfo.zipCode)

    var dropoffContactInfo = new Object();
    dropoffContactInfo.state = $scope.dropoffState;
    dropoffContactInfo.zipCode = $scope.dropoffZipCode;
    dropoffContactInfo.city = $scope.dropoffCity;
    order.dropoffContactInfo = dropoffContactInfo;

    // order.orderDate = $scope.orderDate;

    order.orderDate = new Date();
    order.pickupDate = $scope.pickupDate;
    order.dropoffDate = $scope.dropoffDate;
    order.paymentMode = $scope.selectedPaymentMode;
    order.expectedMiles = $scope.expectedMiles;
    order.cost = $scope.cost;
    order.expense = $scope.expense;
    $scope.response.push(order)

    //Hide the modal if all input given is valid
    $("#myModal").modal("hide");
  };

  $scope.pickupClassToggle="panel-collapse collapse";
  $scope.onCheckedPickupContact = function()
  {
    if(!$scope.isPickupContactSameAsCC)
    {
      $scope.pickupClassToggle="panel-collapse collapse in";
    }
    else
    {
      $scope.pickupClassToggle="panel-collapse collapse";
    }
  }

  // http://localhost:8080/vts-core/truck/orders

  $http.get("http://localhost:8080/vts-core/truck/orders")
    .then(
        function success(response){
          $scope.response = response.data.reports;
          
        },
        function error(response){
          $scope.error = response;
        }
    );

}]);
