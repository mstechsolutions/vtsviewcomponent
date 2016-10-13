
var app = angular.module('mainApp', ['ngMessages']);

app.controller('mainCtrl', ['$scope','$http', function($scope, $http) {

  $scope.baseServiceUrl="http://localhost:8080"
  $scope.isPickupContactSameAsCC = true;

  $scope.ALERT_BASE="list-group-item list-group-item-action";
  $scope.ALERT_SUCCESS="list-group-item-success";
  $scope.ALERT_INFO="list-group-item-info";
  $scope.ALERT_DANGER="list-group-item-danger";
  $scope.ALERT_WARNING="list-group-item-warning";

  $scope.selectedOrder=null;

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
    "Truck name",
    "Customer name",
    "Customer phone",
    "Order date",
    "Pickup date",
    "Pickup location",
    "Dropoff date",
    "Dropoff location",
    "Payment mode",
    "Expected miles",
    "Service fee"
  ];

  $scope.orderStatusList = [
      "Not Started", "In-Progress", "Completed", "Deferred"
  ]

  $scope.paidStatusList = [
      "Not Paid", "Paid"
  ]

  $scope.truckListFilter = [
    {id:0, name: '', display: "All"},
    {id:1, name: 'Maximus', display: 'Maximus'},
    {id:10, name: 'Avengers', display: 'Avengers'},
    {id:300, name: 'XMen', display: 'XMen'}
  ];

  $scope.truckList = [
    {id:1, name: 'Maximus'},
    {id:10, name: 'Avengers'},
    {id:300, name: 'XMen'}
  ];

  $scope.paymentModeList = [
    "COD", "Debit", "Credit", "Check"
  ];  

  $scope.getTruckObjectByName = function(truckId)
  {
    var i=0;
    for(i; i< $scope.truckList.length; i++)
    {
      if($scope.truckList[i].id == truckId)
      {
        $scope.selectedOrder.truckName=$scope.truckList[i];
        break;
      }
    }
  }

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
  
  $scope.getStartDateOfMonth = function(date)
  {
    date.setDate(1)
    return date;
  }

  // $scope.onFilterChange = function()
  // {
  //   console.log($scope.response.length)
  // }

  // $scope.$watch('selectedTruckFilter.id', function() {
  //   console.log("selected truck filter id is "  + $scope.selectedTruckFilter);
  // });
  
  $scope.orderEndDateFilter = new Date();
  $scope.orderStartDateFilter = $scope.getStartDateOfMonth(new Date());
  $scope.filterByDateRange = function()
  {
    console.log($scope.orderStartDateFilter)
    var queryParameters = new Object();
    queryParameters.startDate=$scope.orderStartDateFilter.toISOString().substring(0, 10);
    queryParameters.enddate=$scope.orderEndDateFilter.toISOString().substring(0, 10);
    $scope.getOrders(queryParameters);
    
  }

  $scope.onCustomerContactChange = function()
  {
    $scope.customerContactChangeValid = ($scope.selectedOrder.customerInfo.contactNumber != null && 
    $scope.selectedOrder.customerInfo.contactNumber.length == 10 && 
    !isNaN(Number($scope.selectedOrder.customerInfo.contactNumber)))
    
  }

  $scope.makeAlertStyle = function(style)
  {
    return $scope.ALERT_BASE.concat(" ", style);
  }

  $scope.orderHomeToggle="tab-pane active";
  $scope.orderDtlToggle="tab-pane";
  $scope.selectedTableRow = function(e)
  {
    var orderToggleTemp=$scope.orderDtlToggle;
    $scope.orderDtlToggle=$scope.orderHomeToggle;
    $scope.orderHomeToggle=orderToggleTemp;
    
    $scope.selectedOrder = angular.copy(e);
    /*Assign truck object instead of truck name*/
    $scope.getTruckObjectByName(Number($scope.selectedOrder.truckId))
    console.log($scope.selectedOrder)

  }

  $scope.goBack2OrderList=function()
  {
    var orderToggleTemp=$scope.orderHomeToggle;
    $scope.orderHomeToggle=$scope.orderDtlToggle;
    $scope.orderDtlToggle=orderToggleTemp;
  }

  $scope.orderSummary = new Object();
  $scope.$watchCollection("filteredOrders", function() {
    console.log("At filtered orders");
    
    $scope.orderSummary.totalOrderAmount=new Object();
    $scope.orderSummary.totalOrderAmount.value=0;
    $scope.orderSummary.totalOrderAmount.alert=$scope.makeAlertStyle($scope.ALERT_INFO);
    
    $scope.orderSummary.totalOrderPaid=new Object();
    $scope.orderSummary.totalOrderPaid.value=0;
    $scope.orderSummary.totalOrderPaid.alert=$scope.makeAlertStyle($scope.ALERT_INFO);
    
    $scope.orderSummary.totalOrderUnPaid=new Object();
    $scope.orderSummary.totalOrderUnPaid.value=0;
    $scope.orderSummary.totalOrderUnPaid.alert=$scope.makeAlertStyle($scope.ALERT_INFO);

    $scope.orderSummary.totalUnpaidButOrderCompleted=new Object();
    $scope.orderSummary.totalUnpaidButOrderCompleted.value=0;
    $scope.orderSummary.totalUnpaidButOrderCompleted.alert=$scope.makeAlertStyle($scope.ALERT_INFO);

    angular.forEach($scope.filteredOrders, function(order)
    {
      if(order.orderStatus !=null && order.orderStatus.toUpperCase() != "DEFERRED")
      {
        if(!order.isPaid)
        {
          $scope.orderSummary.totalOrderUnPaid.value += order.serviceFee;
          if($scope.orderSummary.totalOrderUnPaid.value > 0)
            $scope.orderSummary.totalOrderUnPaid.alert=$scope.makeAlertStyle($scope.ALERT_WARNING)
        }
        if(order.isPaid)
        {
          $scope.orderSummary.totalOrderPaid.value += order.serviceFee;
          if($scope.orderSummary.totalOrderPaid.value > 0)
            $scope.orderSummary.totalOrderPaid.alert=$scope.makeAlertStyle($scope.ALERT_SUCCESS)

        }


        if(order.orderStatus.toUpperCase() == "COMPLETED" && !order.isPaid)
        {
          $scope.orderSummary.totalUnpaidButOrderCompleted.value += order.serviceFee;
          if($scope.orderSummary.totalUnpaidButOrderCompleted.value > 0)
            $scope.orderSummary.totalUnpaidButOrderCompleted.alert=$scope.makeAlertStyle($scope.ALERT_DANGER)
        }

        $scope.orderSummary.totalOrderAmount.value += order.serviceFee;
        $scope.orderSummary.totalOrderAmount.alert=$scope.makeAlertStyle($scope.ALERT_SUCCESS)
        // console.log($scope.orderSummary.totalOrderAmount.alert)
      }
    })

    console.log($scope.orderSummary.totalAmount)
  });
  
  /*
    No longer used
  */
  $scope.orderDetailToggle="panel panel-primary collapse"
  $scope.orderSelected = function(event){
      
      console.log($scope.orderDetailSelection)
      $scope.selectedOrder = angular.copy($scope.orderDetailSelection);
      
      /*Assign truck object instead of truck name*/
      $scope.getTruckObjectByName(Number($scope.selectedOrder.truckId))
      
      if($scope.orderDetailToggle == "panel panel-primary collapse")
      {
        $scope.orderDetailToggle="panel panel-primary collapse in";
      }
  }

  $scope.addModeEnabled=false
  $scope.onAddOrderClick = function(toggleValue)
  {
    console.log(toggleValue)
    $scope.addModeEnabled=Boolean(toggleValue);
  }

  $scope.response = null;
  $scope.addOrderSubmit = function(){
  
    // var customerInfo = new Object();
    // customerInfo.name = $scope.customerName;

    console.log("at add order testing")
    console.log($scope.selectedOrder.truckName)
    console.log($scope.selectedOrder.paymentMode)

    var order = new Object();
    order.truckId=$scope.selectedOrder.truckName.id
    order.truckName=$scope.selectedOrder.truckName.name;
    order.vehicles=$scope.vehicles;
    
    var pickupContactInfo = null;
    var customerInfo = new Object();
    customerInfo.firstName = $scope.selectedOrder.customerInfo.firstName;
    customerInfo.lastName = "";
    customerInfo.addressLine1 = $scope.selectedOrder.customerInfo.addressLine1;
    customerInfo.contactNumber = $scope.selectedOrder.customerInfo.phone;
    customerInfo.state = $scope.selectedOrder.customerInfo.state;
    customerInfo.zipCode = $scope.selectedOrder.customerInfo.zipCode;
    customerInfo.city = $scope.selectedOrder.customerInfo.city;
    order.customerInfo = customerInfo;


    if($scope.isPickupContactSameAsCC)
    {
      pickupContactInfo=customerInfo;
    }
    else
    {
      pickupContactInfo = new Object();

      //Not enabled yet
      pickupContactInfo.firstName = "";
      pickupContactInfo.lastName = "";
      pickupContactInfo.contactNumber = "";
      pickupContactInfo.addressLine1 = $scope.selectedOrder.pickupContactInfo.addressLine1;
      pickupContactInfo.state = $scope.selectedOrder.pickupContactInfo.state;
      pickupContactInfo.zipCode = $scope.selectedOrder.pickupContactInfo.zipCode;
      pickupContactInfo.city = $scope.selectedOrder.pickupContactInfo.city;
      
    }  
    order.pickupContactInfo = pickupContactInfo;
  
    var dropoffContactInfo = new Object();
    //Not enabnled yet
    dropoffContactInfo.firstName = "";
    dropoffContactInfo.lastName = "";
    pickupContactInfo.contactNumber = "";
    
    dropoffContactInfo.addressLine1 = $scope.selectedOrder.dropoffContactInfo.addressLine1;
    
    dropoffContactInfo.state = $scope.selectedOrder.dropoffContactInfo.state;
    dropoffContactInfo.zipCode = $scope.selectedOrder.dropoffContactInfo.zipCode;
    dropoffContactInfo.city = $scope.selectedOrder.dropoffContactInfo.city;
    order.dropoffContactInfo = dropoffContactInfo;

    // order.orderDate = $scope.orderDate;

    order.orderDate = new Date().toISOString().substring(0, 10);
    order.pickupDate = $scope.selectedOrder.pickupDate.toISOString().substring(0, 10);
    order.dropoffDate = $scope.selectedOrder.dropoffDate.toISOString().substring(0, 10);;
    order.paymentMode = $scope.selectedOrder.paymentMode;
    order.expectedMiles = $scope.selectedOrder.expectedMiles;
    order.serviceFee = $scope.selectedOrder.serviceFee;
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
          "Content-Type" : "application/json",
          "Accept" : "application/json",
          "Access-Control-Allow-Origin" : "*",
          "Access-Control-Allow-Methods" : "GET, POST, PATCH, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers" : "Origin, Content-Type, X-Auth-Token"
        },
        data: order
    })
    .then(
        function success(data){
          $scope.selectedOrder = null;
          $scope.vehicles = null;
          console.log(data);
        },
        function error(error){
          console.log(error)
        }
    );
  }

  $scope.getOrders = function(queryParameters)
  {

    $http({
      method: "GET",
      url : "http://localhost:8080/vts-core/truck/orders",
      headers: {
        "Content-Type" : "application/json",
        "Accept" : "application/json"
      },
      params:queryParameters
    })
    .then(
        function success(response){          
          $scope.response = response.data;
          console.log(response)
          
        },
        function error(response){
          $scope.error = response;
        }
    );

  }

  $http.get("http://localhost:8080/vts-core/truck/orders")
    .then(
        function success(response){          
          $scope.response = response.data;
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
