
$http({
    url: "http://vtsreports.s3-website-us-east-1.amazonaws.com/getTrucksInfo.json",
    method: "GET",
    headers:{
        "Accept" : "application/json",
        "Content-Type" : "application/json"
    }            
})
.success(function(response){
	$scope.response = response;
})
.error(function(error){
		$scope.error = error;
});

// "http://localhost:8080/vts/reports"
// url: "http://www.w3schools.com/angular/customers.php",


   // $http.get("getTrucksInfo.json")
 //    .success(
 //      function(data) {
 //        $scope.response=data.reports
 //      }
 //    ).error(function(error){
 //      $scope.error = error;
 //    });