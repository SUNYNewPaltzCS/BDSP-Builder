angular.module('app')
	.controller('indexController', function( $window, $scope, $http) {
		$scope.testOutput = function() {
			console.log($scope.selectIndex);
		}
		$scope.auth = function() {
			console.log("CLICK RECEIVED");
			$http.get('/fusiontable')
				.success(function(data) {
					$window.location.href = data;
				});
		}
		$scope.table = {};
		$scope.selectIndex = 0;
		$http.get('/fusiontable/table')
			.success(function(data) {
				$scope.table = data;
				console.log(data);
			});
	});

			
