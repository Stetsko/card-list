(function() {
'use strict';
angular.module('app.factory', ['ngRoute'])
			 .factory('listFactory', listFactory)

	function listFactory(localStorageService, $timeout) {
		var service = {};

		service.cards = localStorageService.get('myPrefix');

		service.getLists = function () {
			return service.cards;
		};

		service.deleteCard = function(card) {
			return _.pull(service.cards, card)
		};

		if (service.cards == null) {
			service.cards = [];
			localStorageService.set('myPrefix', service.cards)
		}

		if (service.cards.length > 0) {
			service.lastCard = service.cards[service.cards.length - 1]
			var cardId = service.lastCard.id
		}else{
			cardId = 0;
		}

		var counter = function(num) {
			var count = Number(num);
			return count+1
		};

		var $id = String(counter(cardId));

		service.addNewCard = function(front, back) {
			service.cards.push({
				id: $id,
				front: front,
				back: back
			});
		};


		service.updateCard = function(updetingCard) {
			var cardId = String(updetingCard.id)
			console.log(cardId);
			var card = _.findWhere(service.cards, {id: updetingCard.id})
			card.front = updetingCard.front;
			card.back = updetingCard.back;
		};

		return service
	}
})();