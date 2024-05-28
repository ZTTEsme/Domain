import CompanyViewModel from "../models/companyViewModel";

export default interface CompanyPresenter {
  updateView(model: CompanyViewModel): void;
}
