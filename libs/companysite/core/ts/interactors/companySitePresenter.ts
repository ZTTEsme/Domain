import CompanySiteModel from "../models/companySiteModel";

export default interface CompanySitePresenter{
  updateView(model: CompanySiteModel): void;
}
