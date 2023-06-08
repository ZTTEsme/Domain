import {Component, Prop, Vue, Watch, Emit} from "vue-facing-decorator";
import SelectItem from "./selectItem";
import JsExtension from "qnect-sdk-web/lib/common/core/ts/jsExtension";

@Component({
  template:`
    <div>
      <div class="cds-select">
        <div class="cds-input" style="position: relative">
          <div class="input-group flex-nowrap">
            <input v-show="searchable" type="text" class="form-control"
                   :value="selectedItem.label"
                   @click="inputClick($event)"
                   :placeholder=placeholder
            >
            <input v-show="!searchable" type="text" class="form-control"
                   readonly
                   :value="selectedItem.label"
                   @click="inputClick($event)"
                   :placeholder=placeholder
            >

            <span class="cds-input-suffix" :style="inputSuffixStyle">
              <span v-if="isDropDown">
                <i class="fa-solid fa-chevron-up"></i>
              </span>
              <span v-else>
                <i class="fa-solid fa-chevron-up fa-rotate-180"></i>
              </span>
            </span>
          </div>
          <div class="cds-dropdown mt-2 border border-1 rounded" v-show="isDropDown" style="width:100%;z-index: 100;position:absolute">
            <div class="list-group">
              <div style="background-color: white" class="border-bottom" v-show="searchable">
                <input id="selected-search" :style="searchStyle" class="form-control" v-model="searchTerm" placeholder="Search">
              </div>
              <button v-for="item in internalItems" type="button" class="list-group-item list-group-item-action border-0" :class="item.active?'active':''" :value="item.value" @click="switchSelect(item)">
                {{ item.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export default class SelectComponent extends Vue{



  @Prop({default:false})
  private readonly searchable:boolean|null = null;

  @Prop({default:false})
  private readonly multi:boolean|null = null;

  @Prop({default:"Please choose"})
  private readonly placeholder:string|null = null

  @Prop({default:[]})
  private readonly itemsFromParent:SelectItem[] = []

  private searchTerm:string = "";

  private selectedItem:SelectItem = new SelectItem();

  private internalItems:SelectItem[] = [];

  private readonly inputSuffixStyle:string =""+
  "position: absolute;\n" +
  "height: 100%;\n" +
  "right: 5px;\n" +
  "top: 5px;\n" +
  "text-align: center;\n" +
  "color: #c0c4cc;\n" +
  "transition: all .3s;\n" +
  "pointer-events: none;\n" +
  "z-index: 100;\n"

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

private isDropDown:boolean = false;

@Watch("itemsFromParent")
public watchItemsFromParent():void {
    this.internalItems = this.itemsFromParent
    this.internalItems.forEach(ele=>{
      if(ele.active){
        this.selectedItem = ele;
      }
    })
  }

  @Watch("selectedItem")
  public watchSelectedItem():void {
   this.getSelectedItems();
  }

  @Watch("searchTerm")
  public searchAvailable(searchTerm: string, oldValue: string):void {
    if(JsExtension.isBlank(searchTerm)){
      this.internalItems = this.itemsFromParent;
    }
    else {
      this.internalItems = this.itemsFromParent.filter(object => object.label?.includes(this.searchTerm));
    }
  }

  @Emit
  public getSelectedItems():SelectItem {
    return this.selectedItem;
  }


  public inputClick(event:Event):void{
    const ele:HTMLElement = event.target as HTMLElement;
    this.internalItems = this.itemsFromParent;
    if(!this.isDropDown) {
      this.searchTerm = "";
    }
    this.isDropDown = !this.isDropDown;
  }

  public switchSelect(item:SelectItem):void{
    if(!item.active){
      item.active = true;
      this.selectedItem = item;
      this.itemsFromParent.forEach(ele =>{
        if(ele.value !== item.value){
          ele.active = false;
        }
      });
    }
    this.isDropDown = false;
  }

}
