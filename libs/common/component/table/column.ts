// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Column {
  label: string;
  field: string;
  sortRotate?:string;
  width?:string;
  render?(value:string): string;

}
