import RolesEditViewModelAssembler from "../assemblers/rolesEditViewModelAssembler";

export default interface RolesEditViewPresenter {
  updateView(model: RolesEditViewModelAssembler): void;
}
