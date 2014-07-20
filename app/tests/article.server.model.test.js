'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Article = mongoose.model('Article');

/**
 * Globals
 */
var user, article;

describe('#VersionModel', function() {
    it('should expose a version model in the original schema', function() {
        should.exist(Article.VersionedModel);
    });
});

/**
 * Unit tests
 */
describe('Article Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			article = new Article({
				title: 'Article Title',
				content: 'Article Content',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return article.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			article.title = '';

			return article.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should save a version model when saving origin model twice', function(done) {
			var test = new Article({ title: 'franz' });
	        test.save(function(err) {
	            should.not.exist(err);

	            test.title = 'hugo';

	            test.save(function(err) {
	                should.not.exist(err);

	                Article.VersionedModel.findOne({
	                    refId : test._id,
	                    versions : { $elemMatch : { refVersion : test.__v }}
	                }, function(err, versionedModel) {
	                    should.not.exist(err);
	                    should.exist(versionedModel);

	                    done();
	                });
	            });
	        });
	    });
	});

	afterEach(function(done) {
		Article.remove().exec();
		User.remove().exec();
		done();
	});
});