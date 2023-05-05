import {Component, Prop, Vue} from "vue-facing-decorator";

@Component({
  emits: ["getFile"],
  template:`
    <div class="row">
         <div class="col-12 text-center">
           <div v-show="showToast" class="mb-3 p-1 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3 text-center">
             {{ fileTypeValidMsg }}
           </div>

           <div class="mb-3">

             <div ref="fileCard" class="card" style="cursor:pointer">
               <h6 class="card-header">{{ title }}</h6>
               <div class="card-body text-center">
                 <p>
                   <i class="fa-solid fa-cloud-arrow-up fa-2xl" @click.prevent="openDialog"></i>
                 </p>
                 <p>
                   {{supportTypes}}
                 </p>
                 <hr/>
                 <p class="card-text">
                   {{ fileName }} 
                   <span v-show="fileName !==null"><i class="fa-regular fa-trash-can" @click="deleteFile"></i></span>
                 </p>
               </div>
             </div>

             <input ref="fileInput" class="form-control" type="file" style="display:none"
                    @input="handleFileChange"
                    :accept="acceptedFileTypes">
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
         </div>
    </div>
  `
})
export default class FileUploadComponent extends Vue{

  @Prop({default:"submit"})
  private submitBtnMsg:string|null = null;

  @Prop({default:"File Upload"})
  private title:string|null = null;

  @Prop({default:"File Type Not Matched"})
  private fileTypeValidMsg:string|null = null;

  @Prop({default:['xlsx','xls']})
  private acceptedFileTypes:string[]|null = [];

  private supportTypes:string|undefined = undefined;

  private fileName:string|null = null;

  private showToast:boolean = false;

  private uploadProgress:number = 0;

  private file:any= null;

  mounted(){
    this.supportTypes = this.acceptedFileTypes?.join(",");
  }

  deleteFile():void{
    this.file = null;
    this.fileName = null;
    this.uploadProgress = 0;
  }

  openDialog(){
    const ele:any = this.$refs['fileInput'];
    ele.click();
  }

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
          this.fileName = this.file.name;
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
    }, 100);
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
