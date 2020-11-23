import { attr } from "@ember-data/model";
import ValidationModel from "@getflights/ember-attribute-validations/model/validation-model";

export default class CompanyModel extends ValidationModel {
  //@ts-ignore
  @attr("string", { validation: { required: true } })
  name!: string;

  //@ts-ignore
  @attr("string", { validation: { max: 10 } })
  vatNumber?: string;

  //@ts-ignore
  @attr("number", { validation: { range: { from: 0, to: 5 } } })
  rating?: number;

  //@ts-ignore
  @attr("number", { validation: { precision: 2, decimals: 1 } })
  score?: number;

  //@ts-ignore
  @attr("number", { validation: { negative: true, number: true } })
  credit?: number;

  //@ts-ignore
  @attr("number", { validation: { positive: true, number: true } })
  debit?: number;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    company: CompanyModel;
  }
}
