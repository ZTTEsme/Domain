import HomeModel from "./homeModel";

export default interface HomePresenter {
  updateView(model: HomeModel): void;
}
