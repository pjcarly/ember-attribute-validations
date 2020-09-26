import Model, { attr } from "@ember-data/model";
import { validationModel } from "@getflights/ember-attribute-validations/decorators/validation-model";

@validationModel
export default class ContactModel extends Model {
  //@ts-ignore
  @attr("string", { validation: { in: { values: ["MR", "MS"] } } })
  salutation!: string;

  //@ts-ignore
  @attr("string", { validation: { required: true, range: { from: 2, to: 20 } }})
  firstName!: string;

  //@ts-ignore
  @attr("string", { validation: { required: true } })
  lastName!: string;

  //@ts-ignore
  @attr("string", { validation: { email: true } })
  email?: string;

  //@ts-ignore
  @attr("number", { validation: { wholenumber: true, max: 150, min: 0 } })
  age?: number;

  //@ts-ignore
  @attr("date", {validation: { date: true, after: new Date("2000-01-01"), before() {return new Date();}}})
  birthdate?: Date;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    contact: ContactModel;
  }
}
