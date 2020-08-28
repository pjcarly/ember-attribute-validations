import MessageResolver from "@getflights/ember-attribute-validations/message-resolver";
import defaultMessages from "@getflights/ember-attribute-validations/messages";
import { module, test } from "qunit";

module("Unit | MessageResolver");

var resolver = MessageResolver.create();

test("test deep messages", function (assert) {
  assert.deepEqual(
    resolver.resolve(
      {
        typeKey: "min",
      },
      {
        type: "string",
      }
    ),
    defaultMessages.min.string
  );

  assert.deepEqual(
    resolver.resolve(
      {
        typeKey: "min",
      },
      {
        type: "number",
      }
    ),
    defaultMessages.min.number
  );

  assert.deepEqual(
    resolver.resolve(
      {
        typeKey: "max",
      },
      {
        type: "string",
      }
    ),
    defaultMessages.max.string
  );

  assert.deepEqual(
    resolver.resolve(
      {
        typeKey: "max",
      },
      {
        type: "number",
      }
    ),
    defaultMessages.max.number
  );

  assert.deepEqual(
    resolver.resolve(
      {
        typeKey: "range",
      },
      {
        type: "string",
      }
    ),
    defaultMessages.range.string
  );

  assert.deepEqual(
    resolver.resolve(
      {
        typeKey: "range",
      },
      {
        type: "number",
      }
    ),
    defaultMessages.range.number
  );
});

test("test normal messages", function (assert) {
  assert.deepEqual(
    resolver.resolve(
      {
        typeKey: "required",
      },
      {
        type: "string",
      }
    ),
    defaultMessages.required
  );

  assert.deepEqual(
    resolver.resolve(
      {
        typeKey: "email",
      },
      {
        type: "string",
      }
    ),
    defaultMessages.email
  );

  assert.deepEqual(
    resolver.resolve(
      {
        typeKey: "url",
      },
      {
        type: "string",
      }
    ),
    defaultMessages.url
  );

  assert.deepEqual(
    resolver.resolve(
      {
        typeKey: "acceptance",
      },
      {
        type: "string",
      }
    ),
    defaultMessages.acceptance
  );
});

test("should throw missing message", function (assert) {
  assert.throws(
    function () {
      resolver.resolve(
        {
          typeKey: "unknown-type",
        },
        {
          type: "string",
        }
      );
    },
    function (err) {
      return (
        err.message ===
        "Assertion Failed: Could not resolve message for `unknown-type` Validator and  `string` "
      );
    }
  );
});

test("should resolve right validator key", function (assert) {
  assert.deepEqual(
    resolver._parseValidatorType({
      typeKey: "required",
    }),
    "required"
  );

  assert.deepEqual(
    resolver._parseValidatorType({
      constructor: {
        typeKey: "required",
      },
    }),
    "required"
  );

  assert.deepEqual(resolver._parseValidatorType({}), "");
});

test("should resolve right attribute key", function (assert) {
  assert.deepEqual(
    resolver._parseAttributeType({
      type: "string",
    }),
    "string"
  );
});

test("should parseName", function (assert) {
  var parsedName = resolver.parseName(
    {
      typeKey: "required",
    },
    {
      type: "string",
      name: "attribute",
      parentTypeKey: "model",
    }
  );

  assert.deepEqual(parsedName.attributeType, "string");
  assert.deepEqual(parsedName.validatorType, "required");
  assert.deepEqual(parsedName.modelType, "model");
  assert.deepEqual(parsedName.validatorPath, "required.string");
  assert.deepEqual(parsedName.modelPath, "model.attribute.required");
});
