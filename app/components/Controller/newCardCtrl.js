(function() {
	'use strict';
	angular
	.module('app.new-card',[])
	.controller('addCardCtrl', addCardCtrl)

//Add a new card

	function addCardCtrl($scope, $location, $timeout, listFactory, localStorageService) {
		$scope.addCardNew = "Add New Card";
		$scope.addCard = function() {
				$location.path('/new-card')
		};

	$scope.addNewCard = function() {
		listFactory.addNewCard($scope.newFront, $scope.newBack)
				$scope.addCardNew = "Adding Card...";
				$timeout(function() {
				localStorageService.set('myPrefix', listFactory.cards)
				window.location.href = '/';
			}, 2000)
	};
};
})();