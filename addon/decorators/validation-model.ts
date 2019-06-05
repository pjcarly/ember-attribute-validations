import Validator from "ember-attribute-validations/mixins/validator";

export function validationModel(desc: any) {
  desc.reopen(Validator);
}
