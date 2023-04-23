import CompanyModel from "../../../../company/core/ts/models/companyModel";
import CompanySiteModel from "../models/companySiteModel";

export default interface CompanySitePresenter{
  updateView(model: CompanySiteModel): void;
}
