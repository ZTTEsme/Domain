import HomePageModel from "../models/homePageModel";

export default interface HomePagePresenter{
  updateView(model: HomePageModel): void;
}
