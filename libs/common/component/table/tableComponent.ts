import {Component, Prop, Vue, Watch, Ref, Emit} from "vue-facing-decorator";

@Component({
  emits: ["changePage","sort","update:modelValue"],
  template:`
    <div>
    <table class="table table-striped table-bordered text-center ">
      <thead>
      <tr>
        <th v-if="checked">
          <input type="checkbox" v-model="allSelected" @change="selectAll" style="cursor:pointer">
        </th>
        <th v-for="column in columns" :key="column.field" @click="sort(column.field,column)" style="cursor:pointer" :style="{width:column.width}">
          {{ column.label }}
          <span v-if="sortField.includes(column.field)" class="ms-1">
               <i v-if='sortOrder === "asc"'      class="fa-solid fa-arrow-up-short-wide fa-xs"></i>
               <i v-else-if='sortOrder ==="desc"' class="fa-solid fa-arrow-up-short-wide fa-xs fa-rotate-180" :class="column.sortRotate"></i>
          </span>
        </th>
        <th v-if="operateInfo.operate">
          {{ operateInfo.${'colName'} }}
        </th>
        
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item.id">
        <td v-if="checked">
          <input type="checkbox" :value="item" v-model="item.selected" @change="selectRow(item)" style="cursor:pointer">
        </td>
        <td v-for="column in columns" :key="column.field">
          <span v-if="column.render">
             <span v-html="reRender(column,item)"></span>
          </span>
          <span v-else>
            {{item[column.field]}}
          </span>
        </td>
        <td v-if="operateInfo.operate">
          <slot name="operate" :row="item"></slot>
        </td>
      </tr>
      </tbody>
    </table>
    <nav style="float:right">
      <div class="mt-auto">
        <div  class="row float-end me-1" >
          <div class="col ps-0 pe-1" >
            <select class="form-select" aria-label="Default select example" v-model="pageSize">
              <option v-for="item in pageItems" :value=item>{{ item }}</option>
            </select>
          </div>
          <div class="col ps-0 pe-0">
            <nav>
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" aria-label="Previous" href="#" @click.prevent="prevPage">
                    <span aria-hidden="true">«</span>
                  </a>
                </li>
                <li class="page-item" v-for="page in pages" :key="page" :class="{ active: currentPage === page }">
                  <a class="page-link" href="#" @click.prevent="gotoPage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="nextPage">
                    <span aria-hidden="true">»</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </nav>
    </div>
  `
})

export default class TableComponent extends Vue {

  private currentPage:number = 1;

  private pageSize:number = 0;

  public  items:Item[] = [];

  private sortOrder:string = 'asc';

  private sortField:string = '';

  private allSelected=false

  private allSelectedRows:Item[] = [];

  @Prop()
  private checked:boolean = false;

  @Prop()
  private operateInfo:any = {};

  @Prop()
  private sortedOrder:string="";

  @Prop
  private sortedFields:string="";

  @Prop({default:false})
  private backEnd:boolean = false;

  @Prop({default:0})
  private totalCount:number = 0;

  @Prop({default:[]})
  public data:Item[] = [];

  @Prop({default:[]})
  private columns:Column[] = []

  @Prop({default:0})
  private pageSizes:number = 0;

  @Prop({default:[]})
  private pageItems:number[] = [];
  public reRender(column:Column,item:Item){
    return column.render?.(item[column.field]);
  }

  private get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize!);
  }

  get pages(): number[] {
    const pagesArray = [];
    let startPage = 1;
    let endPage = this.totalPages;

    if (this.totalPages > 10) {
      if (this.currentPage <= 6) {
        endPage = 10;
      } else if (this.currentPage + 4 >= this.totalPages) {
        startPage = this.totalPages - 9;
      } else {
        startPage = this.currentPage - 5;
        endPage = this.currentPage + 4;
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  // init
  mounted(){
    this.pageSize = this.pageSizes;
    this.sortOrder = this.sortedOrder;
    this.sortField = this.sortedFields;
    //前端分页
    if(!this.backEnd){
      this.items = this.paginatedItems;
    }
    //后端分页
    else {
      this.items = this.data;
    }
  }

  private get paginatedItems(): Item[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }

  private sort(field: string,column:Column): void {
    if(this.backEnd){
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.$emit("sort",field,this.sortOrder);
    }else {
      if (this.sortField.includes(field)) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      }
      this.items.sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];
        if (valueA < valueB) {
          return this.sortOrder === 'asc' ? -1 : 1;
        } else if (valueA > valueB) {
          return this.sortOrder === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
    }
    column.sortRotate = "fa-rotate-180"
  }

  private prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      if(this.backEnd){
        this.$emit("changePage",this.currentPage,this.pageSize);
      }
      else {
        this.items = this.paginatedItems;
      }
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if(this.backEnd){
        this.$emit("changePage",this.currentPage,this.pageSize!);
      }
      else {
        this.items = this.paginatedItems;
      }
    }
  }

  private gotoPage(page: number): void {
    this.currentPage = page;
    if(this.backEnd){
      this.$emit("changePage",this.currentPage,this.pageSize);
    }
    else {
      this.items = this.paginatedItems;
    }
  }

  @Watch("items")
  watchItems(newValue: Item[]){
    this.allSelectedRows = newValue;
  }

  @Watch("pageSize")
  watchPageSize(newValue: number, oldValue: number) {
    if(this.checked) {
      this.allSelected = false;
    }
    this.currentPage = 1;
    if(this.backEnd){
      this.$emit("changePage",this.currentPage,this.pageSize);
    }
    else {
      this.items = this.paginatedItems;
    }
  }

  selectAll() {
    this.allSelectedRows.forEach(item => {
      item.selected = this.allSelected;
    });
    this.$emit("getSelectedRows",this.allSelectedRows.filter(row => row.selected));
  }

  selectRow(item:Item){
    if (!item.selected) {
      this.allSelected = false;
    } else {
      const allRowsSelected = this.allSelectedRows.every(item => {
        return item.selected;
      });
      if (allRowsSelected) {
        this.allSelected = true;
      }
    }
    this.$emit("getSelectedRows",this.allSelectedRows.filter(row => row.selected));
  }
}
