import {Component, Prop, Vue,Watch} from "vue-facing-decorator";

@Component({
  emits:['getDate'],
  template:`
    <div class="form-group">
      <div>
         <input :type="type" class="form-control"  v-model="selectedDate"  id="date" :min="startDate" :max="endDate" >
      </div>
    </div>
  `
})

export default class TimePickerComponent extends Vue {

  @Prop()
  private readonly defaultDate:string|null = null;

  @Prop({default:"datetime-local"})
  private readonly type:string="";

  @Prop({default:'YYYY-MM-DD'})
  private readonly format:string = "";

  @Prop({})
  private readonly offBefore:number|null = null;

  @Prop({})
  private readonly offAfter:number|null = null;

  private selectedDate:string|null = null;

  private formattedDate:string|undefined = "";

  private startDate:string|null = null;

  private endDate:string|null = null;


  @Watch("selectedDate")
  public watchSelectedDate():void{
    this.getDate();
  }

  public mounted():void{
    if(null == this.defaultDate){
      this.selectedDate = this.getDateFromOffset(0);
    }else {
      this.selectedDate = this.defaultDate;
    }
    this.startDate = this.getDateFromOffset(this.offBefore);
    this.endDate = this.getDateFromOffset(this.offAfter);
  }


  private formatDate(dateString:string|null,format:string):string|undefined{
    let result:string = "";
    if(dateString != null) {
      const date:Date = new Date(dateString);
      const month:number = date.getMonth() + 1;
      const day:number = date.getDate();
      let monthStr:string = `${month}`;
      let dayStr:string = `${day}`;
      if(monthStr.length<2) {
        monthStr = `0${monthStr}`;
      }
      if(dayStr.length<2){
        dayStr = `0${dayStr}`;
      }
      if(format === "YYYY/MM/DD"){
        result = `${date.getFullYear()}/${monthStr}/${dayStr}`;
      }
      else if(format === "YYYY-MM-DD"){
        result = `${date.getFullYear()}-${monthStr}-${dayStr}`;
      }
      else if(format === "YYYY-MM-DD HH:mm:ss"){
        result = `${date.getFullYear()}-${monthStr}-${dayStr} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
      else {
        result = `${date.getFullYear()}-${monthStr}-${dayStr}`;
      }
      return result;
    }
  }

  private getDateFromOffset(offset: number|null): string|null {
    const today:Date = new Date();
    const date:Date = new Date(today);
    if(offset === null) {
      return null;
    }
    else {
      if(this.format === "YYYY-MM-DD HH:mm:ss"){
        date.setDate(today.getDate() + offset);
        const month:number = date.getMonth() + 1;
        const day:number = date.getDate();
        let monthStr:string = `${month}`;
        let dayStr:string = `${day}`;
        if(monthStr.length<2) {
          monthStr = `0${monthStr}`;
        }
        if(dayStr.length<2){
          dayStr = `0${dayStr}`;
        }
        return `${date.getFullYear()}-${monthStr}-${dayStr}T00:00`;
      }else {
        date.setDate(today.getDate() + offset);
        const month:number = date.getMonth() + 1;
        const day:number = date.getDate();
        let monthStr:string = `${month}`;
        let dayStr:string = `${day}`;
        if(monthStr.length<2) {
          monthStr = `0${monthStr}`;
        }
        if(dayStr.length<2){
          dayStr = `0${dayStr}`;
        }
        return `${date.getFullYear()}-${monthStr}-${dayStr}`;
      }
    }
  }

  private getDate():void{
    this.formattedDate = this.formatDate(this.selectedDate,this.format);
    this.$emit("getDate",this.formattedDate)
  }
}
