import { tracked } from "@glimmer/tracking";
import DS from "ember-data";

/**
 * Error thrown when a Model validation fails.
 *
 * This error contains the `DS.Errors` object from the Model.
 */
export default class ValidationError extends Error {
  @tracked errors: DS.Errors;
  @tracked message: string;

  constructor(message: string, errors: DS.Errors) {
    super(message);
    this.message = message;
    this.errors = errors;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}
