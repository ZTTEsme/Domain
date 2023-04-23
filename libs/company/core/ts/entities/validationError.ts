export default class ValidationError {
   public field: string;
   public message: string;

  public constructor(init:ValidationError) {
    this.field = init.field;
    this.message = init.message;
  }
}
