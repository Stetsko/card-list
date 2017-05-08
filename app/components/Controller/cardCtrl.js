(function() {

	'use strict';
	angular
	.module('app.card', ['ngRoute',
											 'LocalStorageModule'])
	.controller('cardCtrl', cardCtrl)

//Editing and deleting

	function cardCtrl($scope, listFactory, $location, $timeout, localStorageService) {
		$scope.isEditing = false;
		$scope.editingCard = null;
		$scope.btnValUpdate = "Upadate";
		$scope.btnValDel = "Delete";
		$scope.stete = 1;

		$scope.deleteCard = function(card) {

		if ($scope.stete == 1) {
			$scope.stete = 2
			$scope.btnValDel = "Press again if you sure";
		}else{

			$scope.stete = 0
			listFactory.deleteCard(card);
			$scope.btnValDel = "Deleting ..."
			$timeout(function() {
				$location.path('/')
				localStorageService.set('myPrefix', listFactory.cards)
			}, 2000)
		}

	};

	$scope.editCard = function(card) {
		$scope.isEditing = true;
		$scope.editingCard = angular.copy(card);
		};

	$scope.updateCard = function() {
			listFactory.updateCard($scope.editingCard);

			$scope.editingCard = null;
			$scope.isEditing = false;
			$scope.btnValUpdate = "Updating ..."

			$timeout(function() {
				$location.path('/')
				localStorageService.set('myPrefix', listFactory.cards)
			}, 2000)
		}
	}
})();