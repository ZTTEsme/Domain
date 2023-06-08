import {Component, Prop, Vue, Watch} from "vue-facing-decorator";
import MultiSelectItem from "./multiSelectItem";
import JsExtension from "qnect-sdk-web/lib/common/core/ts/jsExtension";

@Component({
  emits:["getSelectedItems"],
  template:`
    <div>
      <div class="cds-multi-select">
        <div class="cds-multi-select" style="display: inline-block;position: relative;width: 100%">
          <div class="select-tags" style="position: absolute;line-height: normal;white-space: normal;z-index: 100;top: 50%;transform: translateY(-50%);display: flex;align-items: center;flex-wrap: wrap;">
            <span v-for="item in selectedItems" style="box-sizing: border-box;border-color: transparent;margin: 2px 2px 2px 6px;background-color: #f0f2f5;display: flex;max-width: 100%;align-items: center;">
              <span class="me-2" style="height: 24px;padding: 0 8px;line-height: 22px;">{{item.label}}</span>
              <i class="fa-regular fa-circle-xmark" @click="removeCurrent(item)" style="border-radius: 50%;text-align: center;position: relative;cursor: pointer;font-size: 12px;height: 16px;width: 16px;line-height: 16px;vertical-align: middle;right: 5px;"></i>
            </span>
          </div>
          <div class="input-group flex-nowrap">
            <input v-show="searchable" type="text" class="form-control"
                   readonly
                   @click="inputClick($event)"
                   :placeholder=placeholder
            >
            <input v-show="!searchable" type="text" class="form-control"
                   readonly
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
            <ul class="list-group">
              <div style="background-color: white" class="border-bottom" v-show="searchable">
                <input id="selected-search" :style="searchStyle" class="form-control" v-model="searchTerm" placeholder="Search">
              </div>
              <li class="list-group-item border-0" v-for="(item,index) in internalItems">
                <input class="form-check-input me-1" :key="index" type="checkbox" style="cursor:pointer" :value="item.value"  v-model="item.active" @change="selectItem(item)">
                <label class="form-check-label" for="firstCheckbox">{{ item.label }}</label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})

export default class MultiSelectComponent extends Vue{

  @Prop({default:false})
  private readonly searchable:boolean = false;

  @Prop({default:""})
  private readonly placeholder:string|null = null;

  @Prop({default:[]})
  private readonly itemsFromParent:MultiSelectItem[] = [];

  private isDropDown:boolean = false;

  private selectedItems:MultiSelectItem[] = [];

  private length:number = 0;

  private internalItems:MultiSelectItem[] = [];

  private searchTerm:string = ""

  private readonly inputSuffixStyle:string =""+
    "position: absolute;\n" +
    "height: 100%;\n" +
    "right: 5px;\n" +
    "top: 5px;\n" +
    "text-align: center;\n" +
    "color: #c0c4cc;\n" +
    "transition: all .3s;\n" +
    "pointer-events: none;\n" +
    "z-index: 100;\n";

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

  @Watch("itemsFromParent")
  public WatchItemsFromParent(itemsFromParent: MultiSelectItem[], oldValue: string):void {
    this.internalItems = [];
    this.internalItems = this.itemsFromParent;
    this.internalItems.forEach(ele=>{
      if(ele.active){
        this.selectedItems.push(ele);
      }
    })
    this.length = this.selectedItems.length;
  }

  @Watch("length")
  public watchSelectedItems(length: number, oldValue: number):void {
    if(length !== oldValue) {
      this.getSelectedItems();
    }
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

  public selectItem(item:MultiSelectItem):void {
    if(item.active) {
      if(!this.selectedItems.some(obj=>obj.value === item.value)) {
        this.selectedItems.push(item);
      }
    }
    else {
      this.selectedItems = this.selectedItems.filter(obj=>obj.value !== item.value);
    }
    this.length = this.selectedItems.length;
  }

  public inputClick(event:Event):void {
    const ele:HTMLElement = event.target as HTMLElement;
    this.searchTerm = "";
    this.internalItems = this.itemsFromParent;
    this.isDropDown = !this.isDropDown;
  }

  public removeCurrent(item : MultiSelectItem):void{
    this.internalItems.forEach(ele=>{
      if(ele.value === item.value) {
        ele.active = false;
      }
    });
    this.selectedItems = this.selectedItems.filter(obj=>obj.value !== item.value);
    this.length = this.selectedItems.length;
  }

  private getSelectedItems():void{
    this.$emit("getSelectedItems",this.selectedItems)
  }

}
