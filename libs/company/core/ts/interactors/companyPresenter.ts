import CompanyModel from "../models/companyModel";

export default interface CompanyPresenter {
  updateView(model: CompanyModel): void;
}
