import CompanySiteUsersModel from "../models/companySiteUsersModel";

export default interface CompanySiteUsersPresenter{
  updateView(model: CompanySiteUsersModel): void;
}
