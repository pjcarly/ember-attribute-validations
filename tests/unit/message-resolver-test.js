import Ember from 'ember';
import MessageResolver from 'ember-attribute-validations/message-resolver';
import defaultMessages from 'ember-attribute-validations/messages';
import {
	module, test
}
from 'qunit';

module('Unit | MessageResolver');

var resolver = MessageResolver.create();

test('test deep messages', function(assert) {
	deepEqual(resolver.resolve({
		typeKey: 'min'
	}, {
		type: "string"
	}), defaultMessages.min.string);

	deepEqual(resolver.resolve({
		typeKey: 'min'
	}, {
		type: "number"
	}), defaultMessages.min.number);

	deepEqual(resolver.resolve({
		typeKey: 'max'
	}, {
		type: "string"
	}), defaultMessages.max.string);

	deepEqual(resolver.resolve({
		typeKey: 'max'
	}, {
		type: "number"
	}), defaultMessages.max.number);

	deepEqual(resolver.resolve({
		typeKey: 'range'
	}, {
		type: "string"
	}), defaultMessages.range.string);

	deepEqual(resolver.resolve({
		typeKey: 'range'
	}, {
		type: "number"
	}), defaultMessages.range.number);
});

test('test normal messages', function(assert) {
	deepEqual(resolver.resolve({
		typeKey: 'required'
	}, {
		type: "string"
	}), defaultMessages.required);

	deepEqual(resolver.resolve({
		typeKey: 'email'
	}, {
		type: "string"
	}), defaultMessages.email);

	deepEqual(resolver.resolve({
		typeKey: 'url'
	}, {
		type: "string"
	}), defaultMessages.url);

	deepEqual(resolver.resolve({
		typeKey: 'acceptance'
	}, {
		type: "string"
	}), defaultMessages.acceptance);
});

test('should throw missing message', function(assert) {

	throws(function() {
		resolver.resolve({
			typeKey: 'unknown-type'
		}, {
			type: "string"
		});
	}, function(err) {
		return err.message === "Assertion Failed: Could not resolve message for `unknown-type` Validator and  `string` ";
	});
});

test('should resolve right validator key', function(assert) {

	deepEqual(resolver._parseValidatorType({
		typeKey: 'required'
	}), 'required');

	deepEqual(resolver._parseValidatorType({
		constructor: {
			typeKey: 'required'
		}
	}), 'required');

	deepEqual(resolver._parseValidatorType({}), '');
});


test('should resolve right attribute key', function(assert) {

	deepEqual(resolver._parseAttributeType({
		type: 'string'
	}), 'string');
});

test('should parseName', function(assert) {

	var parsedName = resolver.parseName({
		typeKey: 'required'
	}, {
		type: 'string',
		name: 'attribute',
		parentTypeKey: 'model'
	});

	deepEqual(parsedName.attributeType, 'string');
	deepEqual(parsedName.validatorType, 'required');
	deepEqual(parsedName.modelType, 'model');
	deepEqual(parsedName.validatorPath, 'required.string');
	deepEqual(parsedName.modelPath, 'model.attribute.required');
});
