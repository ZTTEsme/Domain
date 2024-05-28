import Router from "cloos-vue-router/lib/core/router";
import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";

import ValidationUtil from "qnect-sdk-web/lib/common/core/ts/validationUtil";
import RolesEditViewState from "../interactors/rolesEditViewState";
import RolesEditViewModel from "../models/rolesEditViewModel";

export default class RolesEditViewModelAssembler {
  public static fromState(state: RolesEditViewState, router: Router, i18nGateway: I18nGateway): RolesEditViewModel {
    const model: RolesEditViewModel = new RolesEditViewModel();

    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(
      router,
      undefined,
      new Breadcrumb({ name: i18nGateway.get("common.home"), link: "/" })
    );
    if (state.isInvalidMode || state.noAccess) {
      model.breadcrumb[model.breadcrumb.length - 1].name = i18nGateway.get("role.title");
    } else if (state.isNewMode) {
      model.breadcrumb[model.breadcrumb.length - 1].name = i18nGateway.get("users.newRole");
    } else {
      model.breadcrumb[model.breadcrumb.length - 1].name = state.role.alias;
    }

    model.msgTitle = state.isNewMode ? i18nGateway.get("users.addNewRole") : i18nGateway.get("common.rolesEdit");

    if (state.noAccess) {
      model.msgNoAccess = i18nGateway.get("common.noAccess");
      return model;
    }

    if (state.isInvalidMode) {
      model.msgNoAccess = i18nGateway.get("users.roleNotFound");
      return model;
    }

    model.showMainContent = true;
    model.disableActions = state.loading;

    RolesEditViewModelAssembler.addPermissionForm(state, model, i18nGateway);
    RolesEditViewModelAssembler.addDeleteModal(state, model, i18nGateway);

    return model;
  }

  private static addDeleteModal(state: RolesEditViewState, model: RolesEditViewModel, i18nGateway: I18nGateway): void {
    model.showDeleteModal = state.deleteRequested;
    model.msgDeleteModalTitle = i18nGateway.get("users.deleteRole");
    model.msgDeleteModalText = i18nGateway.get("users.deleteRoleExplanation", {
      name: `<strong>${state.role.alias}</strong>`,
    });
    model.showDeleteFailed = state.deleteFailed;
    model.msgDeleteFailed = i18nGateway.get("users.deleteRoleFailed");
    model.msgDeleteModalDeleteAction = i18nGateway.get("users.deleteRole");
    model.msgDeleteModalCancelAction = i18nGateway.get("common.cancel");
  }

  private static addPermissionForm(
    state: RolesEditViewState,
    model: RolesEditViewModel,
    i18nGateway: I18nGateway
  ): void {
    model.role = state.role;
    model.filter = state.filter;
    model.formErrors = ValidationUtil.validationErrorsToObject(state.validationErrors, i18nGateway);

    model.msgRoleName = i18nGateway.get("role.name");
    model.msgRoleNameError = !state.roleNameValid ? i18nGateway.get("settings.fieldRequired") : "";
    model.msgPermissions = i18nGateway.get("common.permissions");
    model.msgFilter = i18nGateway.get("common.filter");
    model.msgShowAll = i18nGateway.get("common.showAll");
    model.msgNoPermissionsFound =
      state.role.permissions.filter((p) => p.show).length === 0 ? i18nGateway.get("common.noPermissionsFound") : "";

    model.showDeleteAction = state.isEditMode;
    model.msgDeleteAction = i18nGateway.get("common.delete");
    model.msgSaveAction = i18nGateway.get("common.save");

    model.showSaveFailed = state.saveFailed;
    model.msgSaveFailed = i18nGateway.get("users.saveRoleFailed");
    model.showSaveSuccessful = state.saveSuccessful;
    model.msgSaveSuccessful = i18nGateway.get("common.saveSuccessful");
    model.showAddedSuccessful = state.addedSuccessful;
    model.msgAddedSuccessful = i18nGateway.get("common.addedSuccessful");
  }
}
