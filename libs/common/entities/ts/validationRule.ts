/* eslint-disable @typescript-eslint/no-unused-vars */
interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
}
