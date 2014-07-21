'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			versioned: {
				method: 'GET',
				isArray: false,
				url: 'articles/:articleId/versions'
			}
		});
	}
]);