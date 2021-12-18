import { attr } from "@ember-data/model";
import ValidationModel from "@getflights/ember-attribute-validations/model/validation-model";

export default class ContactModel extends ValidationModel {
  //@ts-ignore
  @attr("string", { validation: { in: ["MR", "MS"] } })
  salutation!: string;

  //@ts-ignore
  @attr("string", {
    validation: { required: true, range: { from: 2, to: 20 } },
  })
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
  @attr("date", {
    validation: {
      date: true,
      after: new Date("2000-01-01"),
      before() {
        return new Date();
      },
    },
  })
  birthdate?: Date;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    contact: ContactModel;
  }
}
