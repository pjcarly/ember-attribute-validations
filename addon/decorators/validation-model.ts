import Validator from "ember-attribute-validations/mixins/validator";

export function validationModel(desc: any) {
  if(typeof desc === 'function') {
    desc.reopen(Validator);
  } else {
    return {
      ...desc,
      finisher(target: any) {
        target.reopen(Validator);

        return target;
      }
    };
  }
}
