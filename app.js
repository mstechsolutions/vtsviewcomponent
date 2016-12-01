
var app = angular.module('mainApp', ['ngMessages'])
  .filter('sumByKey', function () {
    return function (data, key) {
        if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
            return 0;
        }

        var sum = 0;
        for (var i = data.length - 1; i >= 0; i--) {
            sum += parseInt(data[i][key]);
        }

        return sum;
    };
})

app.controller('mainCtrl', ['$scope','$http','$filter', function($scope, $http, $filter) {

  $scope.colors = [
 {name:'black', shade:'dark'},
 {name:'white', shade:'light'},
 {name:'red', shade:'dark'},
 {name:'red', shade:'dark'},
 {name:'yellow', shade:'light'}
];

  $scope.isPickupContactSameAsCC = true;

  $scope.ALERT_BASE="list-group-item list-group-item-action";
  $scope.ALERT_SUCCESS="list-group-item-success";
  $scope.ALERT_INFO="list-group-item-info";
  $scope.ALERT_DANGER="list-group-item-danger";
  $scope.ALERT_WARNING="list-group-item-warning";

  $scope.selectedOrder=null;

  $scope.baseServiceUrl="http://localhost:8080/vts-core/";
  // $scope.baseServiceUrl="http://lowcost-env.qywbriqueg.us-east-1.elasticbeanstalk.com/";

  $scope.truckSummaryHeaders = [
    "Truck Name",
    "Total Order",
    "Total Expense",
    "Net Profit"
  ];

  $scope.tripSummaryHeaders = [
    "Trip ID",
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
    "Order ID",
    "Truck name",
    "Customer name",
    "Customer phone",
    "Order date",
    "Pickup date",
    "Pickup location",
    "Dropoff date",
    "Dropoff location",
    "Payment status",
    "Order status",
    "Service fee"
  ];

  $scope.orderStatusList = [
      "Not Started", "In-Progress", "Completed", "Cancelled"
  ]

  $scope.paidStatusList = [
      "Not Paid", "Paid"
  ]

  $scope.truckListFilter = [
    {id:0, name: '', display: "All"},
    {id:1, name: 'Truck 1', display: 'Truck 1'},
    {id:2, name: 'Truck 2', display: 'Truck 2'},
    {id:3, name: 'Truck 3', display: 'Truck 3'}
  ];

  $scope.truckList = [
    {id:1, name: 'Truck 1'},
    {id:2, name: 'Truck 2'},
    {id:3, name: 'Truck 3'}
  ];

  $scope.paymentModeList = [
    "","COD", "Debit", "Credit", "Check"
  ];

  $scope.tripOptions = [
    "New", "Existing"
  ]

  $scope.driverList = [
    {id: 1, name: "Brad Pitt"},
    {id: 3, name: "Leo DCarpio"},
    {id: 2, name: "Will Smith"},
    {id: 3, name: "Matt Damon"}
  ];

  $scope.getDriverById = function(driverId)
  {
    var i=0;
    for(i; i< $scope.driverList.length; i++)
    {
      if($scope.driverList[i].id == driverId)
      {
        return $scope.driverList[i];
      }
    }
  }

  $scope.getTruckNameById = function(truckId)
  {
    var i=0;
    for(i; i< $scope.truckList.length; i++)
    {
      if($scope.truckList[i].id == truckId)
      {
        return $scope.truckList[i].name;
      }
    }
  }

  $scope.getTruckByName = function(truckId)
  {
    var i=0;
    for(i; i< $scope.truckList.length; i++)
    {
      if($scope.truckList[i].id == truckId)
      {
        return $scope.truckList[i];
      }
    }
  }

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

  $scope.validateForm = function(form)
  {
    console.log(form)
    var i=0;
    for(i; i<form.$error.required.length; i++)
    {
      console.log("The Form field error", form.$error.required[i].$name)
    }
    
  }

  $scope.existingTripOrders = [];
  $scope.refreshExistingOrderTrips = function(orders)
  {
    var index=0;
    var tempArray = [];
    $scope.existingTripOrders = [];
    for(var index=0; index < orders.length; index++)
    {
      var tripId = orders[index].tripId;
      if(tempArray.indexOf(tripId) == -1 )
      {
        tempArray.push(tripId);
        $scope.existingTripOrders.push(orders[index])
      }
    }
  }

  $scope.getContactListByPhone = function(contactType, phoneNumber)
  {
    var queryParameters = new Object();
    queryParameters.phoneNumber=phoneNumber;
    $scope.getContacts(contactType, queryParameters);
  }

  $scope.assignSelectedContactByType = function(contactType, contactInfo)
  {
    if(contactType == "CUSTOMER")
    {
      $scope.selectedOrder.customerInfo = contactInfo;
    }
    if(contactType == "DROPOFF_CONTACT")
    {
      $scope.selectedOrder.dropoffContactInfo = contactInfo;
    }
  }

  /*
  Trips
  */

  $scope.selectedTrip = null;

  $scope.tripsTabHome = "tripListTab"
  $scope.tripsTabDetail = "tripDetailTab"
  
  $scope.tripsTabActive = $scope.tripsTabHome;
  $scope.isTripNew = false;

  $scope.tripShowError = false;
  $scope.tripErrorText = "";

  $scope.addTrip = function()
  {
    $scope.tripsTabActive = $scope.tripsTabDetail;
    $scope.resetSelectedTrip();
    $scope.setTripEditMode(true);
    $scope.isTripNew = true;
  }

  $scope.selectedTripRow = function(e)
  {
     var selectedTrip = angular.copy(e);
     $scope.selectedTrip = selectedTrip;
     $scope.selectedTrip.truck = $scope.getTruckByName(selectedTrip.truckId)

     $scope.selectedTrip.driver1=$scope.getDriverById($scope.selectedTrip.driverId1);
     $scope.selectedTrip.driver2=$scope.getDriverById($scope.selectedTrip.driverId2);
     
     console.log(selectedTrip.startDate, selectedTrip.endDate)

     $scope.selectedTrip.startDate = new Date(selectedTrip.startDate);
     $scope.selectedTrip.startDate.setTime( $scope.selectedTrip.startDate.getTime() + $scope.selectedTrip.startDate.getTimezoneOffset()*60*1000 );

     $scope.selectedTrip.endDate = new Date(selectedTrip.endDate);
     $scope.selectedTrip.endDate.setTime( $scope.selectedTrip.endDate.getTime() + $scope.selectedTrip.endDate.getTimezoneOffset()*60*1000 );

     console.log($scope.selectedTrip.startDate, $scope.selectedTrip.endDate)
     
     $scope.resetTripNew();
  }

  $scope.goBack2TripList = function()
  {
    $scope.tripsTabActive = $scope.tripsTabHome;
    $scope.resetSelectedTrip();
    $scope.setTripEditMode(false);
    $scope.resetTripNew();
  }

  $scope.setTripEditMode = function(toggle)
  {
    $scope.editTripEnabled = toggle;
  }

  $scope.resetSelectedTrip = function()
  {
    $scope.selectedTrip = null;
  }

  $scope.resetTripNew = function()
  {
    $scope.isTripNew = false;
  }

  $scope.makeUpsertTrip = function(isTripNew)
  {
    var trip = new Object();
    
    trip.truckId=$scope.selectedTrip.truck.id;

    trip.driverId1=$scope.selectedTrip.driver1.id;
    trip.driverId2=$scope.selectedTrip.driver2.id;
    
    trip.startDate=$filter('date')($scope.selectedTrip.startDate, 'yyyy-MM-dd');
    trip.endDate=$filter('date')($scope.selectedTrip.endDate, 'yyyy-MM-dd');
    
    trip.startingMiles=$scope.selectedTrip.startingMiles;
    trip.endingMiles=$scope.selectedTrip.endingMiles;

    trip.gasExpense=$scope.selectedTrip.gasExpense;
    trip.tollExpense=$scope.selectedTrip.tollExpense;
    trip.maintenanceExpense=$scope.selectedTrip.maintenanceExpense;
    trip.miscExpense=$scope.selectedTrip.miscExpense;
    trip.payrollExpense=$scope.selectedTrip.payrollExpense;

    if(isTripNew)
    {
      trip.tripId=0;
      $scope.upsertTrip(trip, isTripNew);
    }
    else
    {
      trip.tripId=$scope.selectedTrip.tripId;
      $scope.upsertTrip(trip, isTripNew);
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
  $scope.orderStartDateFilter.setTime( $scope.orderStartDateFilter.getTime() - $scope.orderStartDateFilter.getTimezoneOffset()*60*1000 );
  $scope.filterByDateRange = function()
  {
    console.log($scope.orderStartDateFilter)
    var queryParameters = new Object();    
    
    queryParameters.startDate=$filter('date')($scope.orderStartDateFilter, 'yyyy-MM-dd');
    queryParameters.endDate=$filter('date')($scope.orderEndDateFilter, 'yyyy-MM-dd');
    $scope.getOrders(queryParameters);
    $scope.getTrips(queryParameters);
  }

  $scope.$watchCollection("response", function() {
    $scope.calculateTruckSummary();
  });

  $scope.$watchCollection("tripLogs", function() {
    $scope.calculateTruckSummary();
  });

  $scope.truckStatList = [];
  $scope.calculateTruckSummary = function()
  {
    var grandTotalExpense = 0;
    $scope.truckStatList = [];
    
    var orderList = angular.copy($scope.response);
    var tripList = angular.copy($scope.tripLogs);
    
    angular.forEach($scope.truckList, function(truck)
    {
      
      var tempTruckOrderAmountTotal = 0;
      var tempOrders = $filter('filter')(orderList, {truckId : truck.id});
      angular.forEach(tempOrders, function(tempOrder)
      {
        if(tempOrder.orderStatus != 'Cancelled')
          tempTruckOrderAmountTotal  = tempTruckOrderAmountTotal + tempOrder.serviceFee;
      });

      var tempTruckExpenseTotal = 0;
      var tempTrips = $filter('filter')(tripList, {truckId : truck.id});
      angular.forEach(tempTrips, function(tempTrip)
      {
        tempTruckExpenseTotal  = tempTruckExpenseTotal + tempTrip.gasExpense + tempTrip.tollExpense + tempTrip.maintenanceExpense + tempTrip.miscExpense + + tempTrip.payrollExpense;
      });

      var truckStat = new Object();
      truckStat.truckId = truck.id;
      truckStat.truckName = truck.name;
      truckStat.totalOrderAmount = tempTruckOrderAmountTotal;
      truckStat.totalTruckExpense = tempTruckExpenseTotal;
      truckStat.netProfit = tempTruckOrderAmountTotal - tempTruckExpenseTotal;
      
      grandTotalExpense = grandTotalExpense + tempTruckExpenseTotal;
      $scope.truckStatList.push(truckStat);
      
    });

    $scope.orderSummary.totalExpense = new Object();
    $scope.orderSummary.totalExpense.value = grandTotalExpense;
    $scope.orderSummary.totalExpense.alert=$scope.makeAlertStyle($scope.ALERT_SUCCESS)
    
  }

  /*
    Not used
  */
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
    
    var customerContactNumber=Number($scope.selectedOrder.customerInfo.contactNumber);
    if(!isNaN(customerContactNumber))
      $scope.selectedOrder.customerInfo.contactNumber=customerContactNumber;

    var dropoffContactNumber=Number($scope.selectedOrder.dropoffContactInfo.contactNumber);
    if(!isNaN(dropoffContactNumber))
      $scope.selectedOrder.dropoffContactInfo.contactNumber=dropoffContactNumber;

    /* Returned order Date format is different E.g. Oct 10, 2016*/
    $scope.selectedOrder.orderDate=new Date($scope.selectedOrder.orderDate);
    $scope.selectedOrder.orderDate.setTime( $scope.selectedOrder.orderDate.getTime() + $scope.selectedOrder.orderDate.getTimezoneOffset()*60*1000 );
    $scope.selectedOrder.pickupDate=new Date($scope.selectedOrder.pickupDate);
    $scope.selectedOrder.pickupDate.setTime( $scope.selectedOrder.pickupDate.getTime() + $scope.selectedOrder.pickupDate.getTimezoneOffset()*60*1000 );
    $scope.selectedOrder.dropoffDate=new Date($scope.selectedOrder.dropoffDate);
    $scope.selectedOrder.dropoffDate.setTime( $scope.selectedOrder.dropoffDate.getTime() + $scope.selectedOrder.dropoffDate.getTimezoneOffset()*60*1000 );
    $scope.selectedOrder.dueDate=new Date($scope.selectedOrder.dueDate);
    $scope.selectedOrder.dueDate.setTime( $scope.selectedOrder.dueDate.getTime() + $scope.selectedOrder.dueDate.getTimezoneOffset()*60*1000 );

    $scope.selectedOrder.tripOptions = "Existing";
    $scope.selectedOrder.orderTripId = $scope.selectedOrder.tripId;

    //Display added vehicles
    $scope.vehicles=$scope.selectedOrder.vehicles;

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
      if(order.orderStatus !=null && order.orderStatus.toUpperCase() != "CANCELLED")
      {
        if(!order.paid)
        {
          $scope.orderSummary.totalOrderUnPaid.value += order.serviceFee;
          if($scope.orderSummary.totalOrderUnPaid.value > 0)
            $scope.orderSummary.totalOrderUnPaid.alert=$scope.makeAlertStyle($scope.ALERT_WARNING)
        }
        if(order.paid)
        {
          $scope.orderSummary.totalOrderPaid.value += order.serviceFee;
          if($scope.orderSummary.totalOrderPaid.value > 0)
            $scope.orderSummary.totalOrderPaid.alert=$scope.makeAlertStyle($scope.ALERT_SUCCESS)

        }

        var dueDate = new Date(order.dueDate);
        var currentDate = new Date();

        console.log("payment order due:",order.orderId, dueDate, currentDate)

        if(order.orderStatus.toUpperCase() == "COMPLETED" && !Boolean(order.paid) && dueDate < currentDate )
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
  
  // /*
  //   No longer used
  // */

  // $scope.orderDetailToggle="panel panel-primary collapse"
  // $scope.orderSelected = function(event){
      
  //     console.log($scope.orderDetailSelection)
  //     $scope.selectedOrder = angular.copy($scope.orderDetailSelection);
      
  //     Assign truck object instead of truck name
  //     $scope.getTruckObjectByName(Number($scope.selectedOrder.truckId))
      
  //     if($scope.orderDetailToggle == "panel panel-primary collapse")
  //     {
  //       $scope.orderDetailToggle="panel panel-primary collapse in";
  //     }
  // }

  $scope.addModeEnabled=false
  $scope.onAddOrderClick = function(toggleValue)
  {
    console.log(toggleValue)
    if(Boolean(toggleValue))
    {
      console.log("add clicked", toggleValue)
      $scope.selectedOrder=new Object();
      $scope.selectedOrder.orderId=0;
      $scope.vehicles = [];
    }
    else
    {
      $('#orderTabs a:first').tab('show')
    }
    $scope.addModeEnabled=Boolean(toggleValue);
    
  }

  $scope.response = null;
  $scope.addOrderSubmit = function(){
  
    console.log("at add order testing")
    console.log($scope.selectedOrder.truckName)
    console.log($scope.selectedOrder.paymentMode)
    console.log($scope.selectedOrder.orderId)

    var order = new Object();
    order.orderId=$scope.selectedOrder.orderId;
    order.referenceOrderId=$scope.selectedOrder.referenceOrderId;
    order.truckId=$scope.selectedOrder.truckName.id
    order.truckName=$scope.selectedOrder.truckName.name;

    if($scope.selectedOrder.tripOptions == "New")
      order.tripId=0;
    else if($scope.selectedOrder.existingTripOrder != undefined)
      order.tripId=$scope.selectedOrder.existingTripOrder.tripId;
    else
      order.tripId=$scope.selectedOrder.orderTripId;
    
    
    //Need to lookout
    order.vehicles=$scope.vehicles;
    
    var pickupContactInfo = null;
    var customerInfo = new Object();
    customerInfo.firstName = $scope.selectedOrder.customerInfo.firstName;
    customerInfo.lastName = $scope.selectedOrder.customerInfo.lastName;
    customerInfo.addressLine1 = $scope.selectedOrder.customerInfo.addressLine1;
    customerInfo.addressLine2 = $scope.selectedOrder.customerInfo.addressLine2;
    customerInfo.contactNumber = $scope.selectedOrder.customerInfo.contactNumber;
    customerInfo.emailAddress = $scope.selectedOrder.customerInfo.emailAddress;
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
      pickupContactInfo.firstName = $scope.selectedOrder.pickupContactInfo.firstName;
      pickupContactInfo.lastName = $scope.selectedOrder.pickupContactInfo.lastName;
      pickupContactInfo.contactNumber = $scope.selectedOrder.pickupContactInfo.contactNumber;
      pickupContactInfo.addressLine1 = $scope.selectedOrder.pickupContactInfo.addressLine1;
      pickupContactInfo.addressLine2 = $scope.selectedOrder.pickupContactInfo.addressLine2;
      pickupContactInfo.state = $scope.selectedOrder.pickupContactInfo.state;
      pickupContactInfo.zipCode = $scope.selectedOrder.pickupContactInfo.zipCode;
      pickupContactInfo.city = $scope.selectedOrder.pickupContactInfo.city;
      
    }  
    order.pickupContactInfo = pickupContactInfo;
  
    var dropoffContactInfo = new Object();
    dropoffContactInfo.firstName = $scope.selectedOrder.dropoffContactInfo.firstName;
    dropoffContactInfo.lastName = $scope.selectedOrder.dropoffContactInfo.lastName;
    dropoffContactInfo.contactNumber = $scope.selectedOrder.dropoffContactInfo.contactNumber;
    dropoffContactInfo.addressLine1 = $scope.selectedOrder.dropoffContactInfo.addressLine1;
    dropoffContactInfo.addressLine2 = $scope.selectedOrder.dropoffContactInfo.addressLine2;
    dropoffContactInfo.state = $scope.selectedOrder.dropoffContactInfo.state;
    dropoffContactInfo.zipCode = $scope.selectedOrder.dropoffContactInfo.zipCode;
    dropoffContactInfo.city = $scope.selectedOrder.dropoffContactInfo.city;
    dropoffContactInfo.emailAddress = $scope.selectedOrder.dropoffContactInfo.emailAddress;
    order.dropoffContactInfo = dropoffContactInfo;

    order.orderStatus = $scope.selectedOrder.orderStatus;
    // order.orderDate = new Date().toISOString().substring(0, 10);
    
    if($scope.selectedOrder.orderDate == null)
    {
      order.orderDate = $filter('date')(new Date(), 'yyyy-MM-dd');

    }
    else
    {
      console.log($scope.selectedOrder.orderDate)
      order.orderDate = $filter('date')($scope.selectedOrder.orderDate, 'yyyy-MM-dd');
    }

    order.dueDate = $filter('date')($scope.selectedOrder.dueDate, 'yyyy-MM-dd');
    order.pickupDate = $scope.selectedOrder.pickupDate.toISOString().substring(0, 10);
    order.dropoffDate = $scope.selectedOrder.dropoffDate.toISOString().substring(0, 10);;
    order.paymentMode = $scope.selectedOrder.paymentMode;
    order.expectedMiles = $scope.selectedOrder.expectedMiles;
    order.serviceFee = $scope.selectedOrder.serviceFee;
    order.paid = $scope.selectedOrder.paid;

    console.log(JSON.stringify(order))
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

  /*
    Have to make it work
  */
  $scope.updateCachedOrders = function(order)
  {
    angular.forEach($scope.response, function(orderFromCache)
    {
      if(order.orderId == orderFromCache.orderId)
      {
        console.log("at cached orders update")
        console.log(order)
        orderFromCache = angular.copy(order);
      }
    });
  }

  $scope.upsertOrder = function(order)
  {
    $http(
      {
        method: 'POST',
        url : $scope.baseServiceUrl.concat("truck/orders"),
        headers: {
          "Content-Type": "application/json",
          "Accept" : "application/json"
        },
        data: order
    })
    .then(
        function success(response){
          if($scope.addModeEnabled)
          {
            $scope.selectedOrder = null;
            $scope.response.push(response.data)
          }
          else
          {
            $scope.selectedOrder = response.data;
            $scope.filterByDateRange();
            // $scope.updateCachedOrders(response.data);
          }
          
          console.log(response.data);
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
      url : $scope.baseServiceUrl.concat("truck/orders"),
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
          $scope.refreshExistingOrderTrips(response.data)
        },
        function error(response){
          $scope.error = response;
        }
    );

  }

  $scope.tripLogs = null;
  $scope.getTrips = function(queryParameters)
  {
    $http({
      method: "GET",
      url: $scope.baseServiceUrl.concat("trips"),
      headers: {
        "Content-Type" : "application/json",
        "Accept" : "application/json"
      },
      params:queryParameters
    })
    .then(
      function success(response){
        console.log("success")
        console.log("trips data", response.data)
        $scope.tripLogs = response.data;
      },
      function error(response){
        console.log(response)
        $scope.error = response;
      }
    );  
  }

  $scope.matchedCustomers = null;
  $scope.matchedDropoffContacts = null;
  $scope.getContacts = function(contactType, queryParameters)
  {
    $http({
      method: "GET",
      url: $scope.baseServiceUrl.concat("truck/orders/customer"),
      headers: {
        "Content-Type" : "application/json",
        "Accept" : "application/json"
      },
      params:queryParameters
    })
    .then(
      function success(response){
        console.log("success")
        
        if(contactType == 'CUSTOMER')
        {
          $scope.matchedCustomers = response.data;
          console.log("matched customers data", $scope.matchedCustomers)
        }
        else if(contactType == "DROPOFF_CONTACT")
        {
          $scope.matchedDropoffContacts = response.data;
          console.log("matched customers data", $scope.matchedDropoffContacts)
        }

      },
      function error(response){
        console.log(response)
        $scope.error = response;
      }
    );  
  }

  $scope.upsertTrip = function(trip, isTripNew)
  {
    var httpMethod=null;
    var resourceUrl = null;

    if(isTripNew)
    {
      httpMethod="POST";
      resourceUrl="trips/create";
    }
    else
    {
      httpMethod="PUT";
      resourceUrl="trips/update";
    }

    $http({
      method: httpMethod,
      url: $scope.baseServiceUrl.concat(resourceUrl),
      headers: {
        "Content-Type" : "application/json",
        "Accept" : "application/json"
      },
      data:trip
    })
    .then(
      function success(response){
        console.log("add trip success", response);
        if(isTripNew)
        {
          $scope.goBack2TripList();
        }
        
        $scope.tripShowError = false;
        $scope.tripErrorText = "";
        $scope.getTrips();
      },
      function error(response){
        console.log("add trip failed",response)
        $scope.tripShowError = true;
        $scope.tripErrorText = "Insert/Update trip failed";
        
      }
    );  
  }

  /* 
    Initial call
  */
  $scope.filterByDateRange();
  // $scope.getTrips();

}]);


