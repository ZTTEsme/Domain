import CompanyUsersModel from "../models/companyUsersModel";

export default interface CompanyUsersPresenter{
  updateView(model: CompanyUsersModel): void;
}
