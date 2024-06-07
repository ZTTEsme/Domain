import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import Labels from "../entities/labels";

export default class HomePageModel {
  public breadcrumb: Breadcrumb[] = [];

  public labels: Labels = new Labels();
  public showCompaniesMenue: boolean = false;
}
