import Controller from "@ember/controller";
import { action } from "@ember/object";
import CompanyModel from "../models/company";
import ContactModel from "../models/contact";

export default class IndexController extends Controller {
  company!: CompanyModel;
  contact!: ContactModel;

  @action
  save() {
    this.company.save().catch((e: any) => {
      console.error(e);
    });

    this.contact.save().catch((e: any) => {
      console.error(e);
    });
  }
}
