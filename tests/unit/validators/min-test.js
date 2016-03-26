import Ember from 'ember';
import Validator from 'ember-attribute-validations/validators/min';

module('Min Validator test');

test('test missing min value', function() {
	var attribute = {
		type: 'string',
		options: {},
		name: 'email'
	};

	var validator = Validator.create({
		attribute: attribute
	});

	throws(function() {
		validator.validate('email', 'value', attribute);
	}, function(err) {
		return err.message === "Assertion Failed: You must define a `min` for MinValidator";
	});
});

test('validate string', function() {
	var attribute = {
		type: 'string',
		options: {},
		name: 'email'
	};

	var validator = Validator.create({
		attribute: attribute,
		message: '%@ must not be shorter than %@',
		min: 3
	});

	deepEqual(validator.validate('email', 'testing value', attribute, {}), undefined);
	deepEqual(validator.validate('email', 'vlada', attribute, {}), undefined);

	deepEqual(validator.validate('email', '', attribute, {}), 'Email must not be shorter than 3');
	deepEqual(validator.validate('email', null, attribute, {}), 'Email must not be shorter than 3');
	deepEqual(validator.validate('email', false, attribute, {}), 'Email must not be shorter than 3');
	deepEqual(validator.validate('email', undefined, attribute, {}), 'Email must not be shorter than 3');
	deepEqual(validator.validate('email', 'fo', attribute, {}), 'Email must not be shorter than 3');
});

test('validate number', function() {
	var attribute = {
		type: 'number',
		options: {},
		name: 'rating'
	};

	var validator = Validator.create({
		attribute: attribute,
		message: '%@ must not be lesser than %@',
		min: 5
	});

	deepEqual(validator.validate('rating', '6', attribute, {}), undefined);
	deepEqual(validator.validate('rating', 8, attribute, {}), undefined);

	deepEqual(validator.validate('rating', 1, attribute, {}), 'Rating must not be lesser than 5');
	deepEqual(validator.validate('rating', null, attribute, {}), 'Rating must not be lesser than 5');
	deepEqual(validator.validate('rating', false, attribute, {}), 'Rating must not be lesser than 5');
	deepEqual(validator.validate('rating', undefined, attribute, {}), 'Rating must not be lesser than 5');
});
