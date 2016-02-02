var app = angular.module('angularTable', ['ngRoute', 'angularUtils.directives.dirPagination']).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
	  when("/store/:filter?/:sort?/:item?", {
	      templateUrl: '../index.html',
	      controller: app.listdata
		}).
		otherwise({
        redirectTo: '/store'
        //templateUrl: template_folder + '/maintenance.htm',
    });
}])

app.controller('listdata',function($http, $scope, $routeParams, $location){

    console.log('item', $location.search().item);

	var vm = this;
    var itemResult = function() {
        if ($location.search().item === undefined) {
            return 15;
        } else { 
            return $location.search().item;
        };
    };
        
    $scope.itemper = itemResult();  
	$scope.products = []; //declare an empty array
	vm.pageno = 1; // initialize page no to 1
	vm.total_count = 0;
	vm.itemsPerPage =  $scope.itemper; //this could be a dynamic value from a drop down
    var api = "http://v2.api.onesupershop.com/"
	$scope.itemspage = [ 	
    {
        value: 10, 
        name: 10
    }, 
    {
        value: 20, 
        name: 20
    },
     {
        value: 50, 
        name: 50
    }
  ];

  $scope.pricesort = [ 	
    {
        value: 'selling_price', 
        name: 'price: low-high'
    }, 
    {
        value: '-selling_price', 
        name: 'price: high-low'
    }
  ];

	$scope.handleRequest = function(pageno){ // This would fetch the data on page change.
		//In practice this should be in a factory.
	var url = api + 'products' + '?limit=' + vm.itemsPerPage + "&page=" + pageno;
	console.log(url);
		$scope.products = [];
		$http.get(url).success(function(response){ 
			console.log('data', response);
			$scope.products = response.data;  //ajax request to fetch data into vm.data
			$scope.total_count = response.total;
		});
	};

    $scope.getItemPerpage = function() {
        var item = $scope.items_value.value;
        $location.path('category').search('item', item);
        $location.replace();
    };

	$scope.handleRequest($scope.itemper, vm.pageno); // Call the function to fetch initial data on page load.
});