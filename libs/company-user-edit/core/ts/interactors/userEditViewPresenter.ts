import UserEditViewModelAssembler from "../assemblers/userEditViewModelAssembler";

export default interface UserEditViewPresenter {
  updateView(model: UserEditViewModelAssembler): void;
}
