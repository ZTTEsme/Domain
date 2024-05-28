import RolesViewModel from "../models/rolesViewModel";

export default interface RolesViewPresenter {
  updateView(model: RolesViewModel): void;
}
