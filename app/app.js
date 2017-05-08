(function() {
	'use strict';
	angular.module('app', ['ngRoute',
		'app.list',
		'app.card',
		'app.new-card',
		'app.factory',
		'LocalStorageModule'])
	.config(Config )
	.config(localStorageServiceProvider);

	function Config($routeProvider, $locationProvider) {
		$routeProvider
		.when('/',{
			templateUrl: 'components/list.html',
			controller: 'listsCtrl'
		})
		.when('/card/:cardId',{
			templateUrl: 'components/card.html',
			controller: 'listCtrl'})
		.when('/new-card',{
			templateUrl: 'components/new-card.html',
			controller: 'addCardCtrl'})
		.otherwise({
			template: '404 no such page'
		})
		$locationProvider.html5Mode(true);
	};

	function localStorageServiceProvider(localStorageServiceProvider) {
		localStorageServiceProvider.setPrefix('myPrefix');
	}

})();

