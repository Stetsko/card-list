(function() {
	'use strict';
	angular
	.module('app.list', ['ngRoute'])
	.controller('listsCtrl', listsCtrl)
	.controller('listCtrl', listCtrl)

// listing 

	function listsCtrl($scope, listFactory, localStorageService) {
		$scope.lists = listFactory.getLists();
		$scope.isDefault = false;

		if(listFactory.cards == null || listFactory.cards.length == 0){
			$scope.isDefault = true;
			listFactory.cards = [];
			localStorageService.set('myPrefix', listFactory.cards)
			
		}else{
			$scope.isDefault = false;
			$scope.lists = listFactory.getLists();
		}
	};

	function listCtrl($scope, $routeParams, listFactory) {
		var cardId = $routeParams.cardId;
		$scope.card = _.findWhere(listFactory.getLists(), {'id': cardId});
	};

})();