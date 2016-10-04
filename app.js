
var app = angular.module('mainApp', []);

app.controller('mainCtrl', ['$scope','$http', function($scope, $http) {

  $scope.isPickupContactSameAsCC = true;

  // $scope.truckSummaryHeaders = [
  //   "Truck Name",
  //   "Total gas expense",
  //   "Total Toll expense",
  //   "Total Maintenance expense",
  //   "Other expenses",
  //   "Total expected Payment",
  //   "Actual payment received",
  //   "Total Profit"
  // ];

  $scope.tripSummaryHeaders = [
    
    "Truck Name",
    "Drivers",
    "Start date",
    "End date",
    "Starting miles",
    "Ending miles",
    "Gas expense",
    "Toll expense",
    "Maintenance expense",
    "Misc expense"
  ];

  $scope.gridHeaders = [
    "",
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

  $scope.orderStatusList = [
      "Not Started", "In-Progress", "Completed"
  ]

  $scope.paidStatusList = [
      "Not Paid", "Paid"
  ]

  $scope.truckList = [
    {id:100, name: 'Maximus'},
    {id:200, name: 'Avengers'},
    {id:300, name: 'XMen'}
  ];

  $scope.truckListFilter = [
    {id:0, name: '', display: "All"},
    {id:100, name: 'Maximus', display: 'Maximus'},
    {id:200, name: 'Avengers', display: 'Avengers'},
    {id:300, name: 'XMen', display: 'XMen'}
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

  
  $scope.selectedOrder=null;
  $scope.mOrderDetailSelection="";
  $scope.orderDetailToggle="panel panel-primary collapse"
  $scope.orderSelected = function(event){
      
      console.log($scope.orderDetailSelection)
      $scope.selectedOrder = $scope.orderDetailSelection;
      
      if($scope.orderDetailToggle == "panel panel-primary collapse")
      {
        $scope.orderDetailToggle="panel panel-primary collapse in";
      }
  }

  $scope.addModeEnabled=false
  $scope.onAddOrderClick = function()
  {
    $scope.addModeEnabled=true
  }

  $scope.response = null;
  $scope.addOrderSubmit = function(){
  
    // var customerInfo = new Object();
    // customerInfo.name = $scope.customerName;

    var order = new Object();
    order.truckId=$scope.selectedTruck.id;
    order.truckName=$scope.selectedTruck.name;
    order.vehicles=$scope.vehicles;
    
    var pickupContactInfo = null;
    var customerInfo = new Object();
    customerInfo.firstName = $scope.customerName;
    customerInfo.lastName = "";
    customerInfo.addressLine1 = "";
    customerInfo.contactNumber = $scope.customerContact;
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
      pickupContactInfo.firstName = $scope.customerName;
      pickupContactInfo.lastName = "";
      pickupContactInfo.addressLine1 = $scope.pickupAddressLine1;
      pickupContactInfo.contactNumber = "0123456789";
      pickupContactInfo.state = $scope.pickupState;
      pickupContactInfo.zipCode = $scope.pickupZipCode;
      pickupContactInfo.city = $scope.pickupCity;
      
    }  
    order.pickupContactInfo = pickupContactInfo;
    // alert(pickupContactInfo.state + "," + pickupContactInfo.zipCode)

    var dropoffContactInfo = new Object();
    dropoffContactInfo.firstName = $scope.customerName;
    dropoffContactInfo.lastName = "";
    dropoffContactInfo.addressLine1 = $scope.dropoffAddressLine1;
    pickupContactInfo.contactNumber = "9876543210";
    dropoffContactInfo.state = $scope.dropoffState;
    dropoffContactInfo.zipCode = $scope.dropoffZipCode;
    dropoffContactInfo.city = $scope.dropoffCity;
    order.dropoffContactInfo = dropoffContactInfo;

    // order.orderDate = $scope.orderDate;

    order.orderDate = new Date().toISOString().substring(0, 10);;
    order.pickupDate = $scope.pickupDate.toISOString().substring(0, 10);
    order.dropoffDate = $scope.dropoffDate.toISOString().substring(0, 10);;
    order.paymentMode = $scope.selectedPaymentMode;
    order.expectedMiles = $scope.expectedMiles;
    order.serviceFee = $scope.cost;
    //$scope.response.push(order)
    $scope.upsertOrder(order);

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
  $scope.upsertOrder = function(order)
  {
    $http(
      {
        method: 'POST',
        url : "http://localhost:8080/vts-core/truck/orders",
        headers: {
          'Content-Type' : 'application/json',
          'Accept' : 'application/json',
          'Access-Control-Allow-Origin' : '*'
        },
        data: order
    })
    .then(
        function success(data){
          console.log(data);
        },
        function error(error){
          console.log(error)
        }
    );
  }

  $http.get("http://localhost:8080/vts-core/truck/orders")
    .then(
        function success(response){
          $scope.response = response.data.reports;
          console.log(response)
          
        },
        function error(response){
          $scope.error = response;
        }
    );

  $scope.tripLogs = null;
  $http.get("http://localhost:8080/vts-core/trips")
    .then(
        function success(response){
          console.log("success")
          console.log(response.data)
          $scope.tripLogs = response.data;
        },
        function error(response){
          console.log(response)
          $scope.error = response;
        }
    );  

}]);
