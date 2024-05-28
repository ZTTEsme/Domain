export default class DropdownSelectModel<T> {
  public value: T | undefined = undefined;
  public name: string = "";

  public constructor(init?: Partial<DropdownSelectModel<T>>) {
    Object.assign(this, init);
  }
}
