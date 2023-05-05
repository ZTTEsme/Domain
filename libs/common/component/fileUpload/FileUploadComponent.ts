import {Component, Prop, Vue} from "vue-facing-decorator";

@Component({
  emits: ["getFile"],
  template:`

    <div v-show="showToast" class="mb-3 p-1 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3 text-center">
    {{ fileTypeValidMsg }}
    </div>
    
    <div class="mb-3">
    <input class="form-control" type="file" id="formFileMultiple" 
           @change="handleFileChange"
           :accept="acceptedFileTypes"
    />
    </div>

    <div class="progress mt-2" role="progressbar" aria-label="Basic example" :aria-valuenow="uploadProgress" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar" :style="{width:uploadProgress+'%'}"></div>
    </div>
    
    <div class="mt-2" style="float:right">
    <button 
      type="button" 
      class="btn btn-primary" 
      style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
      @click.prevent="getFile"
    >
      {{ submitBtnMsg }}
    </button>
    </div>
  `
})
export default class FileUploadComponent extends Vue{

  @Prop({default:"submit"})
  private submitBtnMsg:string|null = null;

  @Prop({default:"File Type Not Matched"})
  private fileTypeValidMsg:string|null = null;

  @Prop({default:['xlsx','xls']})
  private acceptedFileTypes:string[]|null = [];

  private showToast:boolean = false;

  private uploadProgress:number = 0;

  private file:any= null;

  handleFileChange(event: Event) {
    this.showToast = false
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.file = target.files[0];
      if(this.acceptedFileTypes != null) {
        if (this.acceptedFileTypes.indexOf(this.file.name.split('.').pop()) < 0) {
          this.file = null;
          this.uploadProgress = 0;
          this.showToast = true;
          return;
        }else {
          this.uploadFile();
        }
      }
    }
  };

  onUploadProgress(){
    this.uploadProgress = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        if (this.uploadProgress < 100) {
          this.uploadProgress += 10;
        } else {
          clearInterval(interval);
        }
      }, 50);
    }, 1000);
  }

  uploadFile() {
    if (!this.file){
      return;
    }
    else {
      this.onUploadProgress();
    }
  };

  private getFile():void{
    this.$emit("getFile",this.file);
  }

}
