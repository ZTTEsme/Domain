interface Column {
  label: string;
  field: string;
  render?(value:string): string;
  sortRotate?:string;
  width?:string;
}
