import {Component, Prop, Vue, Emit, Model, Watch} from "vue-facing-decorator";


@Component({
  template:`
    <div class="container">
         <div class="row">
           <div class="col-5">
             <div class="card">
               <div class="card-header">
                 {{ leftTitle }}
               </div>
               <div>
                 <input id="available-search"  :style="searchStyle" class="form-control" v-model="searchAvailableTerm" placeholder="Search">
               </div>
               <ul class="list-group list-group-flush" style="height:300px;overflow-y:auto">
                 <li class="list-group-item border border-bottom-1"  style="cursor:pointer" v-for="(item,index) in availableItems" :key="item.id">
                   <input class="form-check-input me-1" type="checkbox" :value="item.id" :id="item.id" @click="updateSelectedCache(item,index)">
                   <label class="form-check-label stretched-link" :for="item.id"> {{ item.name }}</label>
                 </li>
               </ul>
             </div>
           </div>
           <div class="col-2" style="display:flex;justify-content: center;align-items: center;">
             <button type="button" class="btn btn-outline-success me-1" :disabled='selectedItemsForCache.length<=0' @click="moveToSelected()">
               {{ add }}
               <i class="fa-solid fa-chevron-up fa-rotate-90"></i>
             </button>
             <button type="button" class="btn btn-outline-danger ms-1" :disabled='availableItemsForCache.length<=0'   @click="moveToAvailable()">
               <i class="fa-solid fa-chevron-up fa-rotate-270"></i>
               {{ remove }}
             </button>
           </div>
           <div class="col-5">
             <div class="card">
               <div class="card-header">
                 {{ rightTitle }}
               </div>
               <div>
                 <input id="selected-search" :style="searchStyle" class="form-control" v-model="searchSelectedTerm" placeholder="Search">
               </div>
               <ul class="list-group list-group-flush" style="height:300px;overflow-y:auto">
                 <li class="list-group-item border border-bottom-1" style="cursor:pointer;" v-for="(item,index) in selectedItems" :key="item.id" >
                   <input class="form-check-input me-1" type="checkbox" :value="item.id" :id='item.id+"_selected"' @click="updateAvailableCache(item,index)">
                   <label class="form-check-label stretched-link" :for='item.id+"_selected"'> {{ item.name }}</label>
                 </li>
               </ul>
             </div>
           </div>
           
         </div>
         <div class="row">
           <div class="col-12">
             <hr/>
             <div style="float:right">
               <slot></slot>
             </div>
           </div>
         </div>
        
    </div>
  `
})

export default class ShuttleBoxComponent extends Vue {

  private searchAvailableTerm:string = "";

  private searchSelectedTerm:string = "";

  @Prop({default:"add"})
  private add:string = "";

  @Prop({default:"remove"})
  private remove:string = "";

  @Prop({default:""})
  private searchTermSelected:string = "";

  @Prop({default:[]})
  private leftItems: Item[] = [];

  @Prop({default:[]})
  private rightItems: Item[] = [];

  @Prop({default:"submit"})
  private readonly submit!: string

  @Prop({default:"cancel"})
  private readonly cancel!: string

  @Prop({default:"rightTitle"})
  private readonly rightTitle!: string

  @Prop({default:"leftTitle"})
  private readonly leftTitle!: string

  private readonly searchStyle:string ="    width: 85%;\n" +
    "    font-size: 12px;\n" +
    "    display: inline-block;\n" +
    "    -webkit-box-sizing: border-box;\n" +
    "    box-sizing: border-box;\n" +
    "    border-radius: 16px;\n" +
    "    padding-right: 10px;\n" +
    "    padding-left: 30px;\n" +
    "    display: block;\n" +
    "    margin: 5px auto;\n" +
    "    text-align: center;";

  private selectedItems: Item[] = [];

  private selectedItemsForCache: Item[] = [];

  private availableItems: Item[] = [];

  private availableItemsForCache: Item[] = [];


  updateSelectedCache(item:Item,index:number){
    if(!this.selectedItemsForCache.some(obj=>obj.id === item.id)) {
      this.selectedItemsForCache.push(item);
    }

  }

  updateAvailableCache(item:Item,index:number){
    if(!this.availableItemsForCache.some(obj=>obj.id === item.id)){
      this.availableItemsForCache.push(item);
    }
  }

  moveToSelected() {
    this.selectedItemsForCache.forEach(ele=>{
      if(!this.selectedItems.some(obj=>obj.id === ele.id)){
        this.selectedItems.push(ele);
      }
    });
    this.availableItems = this.availableItems.filter(obj1 => !this.selectedItemsForCache.some(obj2 => obj1.id === obj2.id));
    this.selectedItemsForCache = [];
  }

  moveToAvailable() {
    this.availableItemsForCache.forEach(ele=>{
      if(!this.availableItems.some(obj=>obj.id === ele.id)){
        this.availableItems.push(ele);
      }
    })
    this.selectedItems = this.selectedItems.filter(obj1 => !this.availableItems.some(obj2 => obj1.id === obj2.id));
    this.availableItemsForCache = [];
  }

  @Emit
  clearSelected(){
    this.selectedItems = [];
  }

  @Emit
  getSelectedItems(){
    return this.selectedItems;
  }

  get filteredAvailableItems() {
    return this.availableItems.filter((item) =>
      item.name.toLowerCase().includes(this.searchAvailableTerm.toLowerCase())
    );
  }

  get filteredSelectedItems() {
    return this.selectedItems;
  }

  mounted() {
    this.availableItems = this.leftItems;
    this.selectedItems = this.rightItems;
  }

  @Watch("searchAvailableTerm")
  searchAvailable(searchAvailableTerm: string, oldValue: string) {
    if(searchAvailableTerm.trim().length==0){
      this.availableItems =[...this.leftItems,...this.rightItems].filter(obj1 => !this.selectedItems.some(obj2 => obj1.id === obj2.id));
    }else {
      this.availableItems = [...this.leftItems,...this.rightItems].filter(obj1 => !this.selectedItems.some(obj2 => obj1.id === obj2.id)).filter((item) => item.name.includes(this.searchAvailableTerm));
    }
  }

  @Watch("searchSelectedTerm")
  searchSelected(searchSelectedTerm: string, oldValue: string) {
    if(searchSelectedTerm.trim().length==0){
      this.selectedItems =[...this.leftItems,...this.rightItems].filter(obj1 => !this.availableItems.some(obj2 => obj1.id === obj2.id));
    }else {
      this.selectedItems = [...this.leftItems,...this.rightItems].filter(obj1 => !this.availableItems.some(obj2 => obj1.id === obj2.id)).filter((item) => item.name.includes(this.searchSelectedTerm));
    }
  }
}
