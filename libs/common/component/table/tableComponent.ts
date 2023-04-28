import {Component, Prop, Vue, Watch} from "vue-facing-decorator";

@Component({
  emits: ["changePage","sort","update:modelValue"],
  template:`
    <div>
    <table class="table table-striped table-bordered text-center ">
      <thead>
      <tr>
        <th v-for="column in columns" :key="column.field" @click="sort(column.field)">
          {{ column.label }}
          <span v-if="sortField.includes(column.field)">
               <i class="fa-solid fa-repeat fa-rotate-90"></i>
          </span>
        </th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item.id">
        <td v-for="column in columns" :key="column.field">
          <span v-if="column.render">
             <span v-html="reRender(column,item)"></span>
          </span>
          <span v-else>
            {{item[column.field]}}
          </span>
        </td>
        <td>
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
    return  column.render(item[column.field]);
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
    this.items = this.paginatedItems;
  }

  private get paginatedItems(): Item[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }

  private sort(field: string): void {
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
    debugger
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

  @Watch("pageSize")
  watchPageSize(newValue: number, oldValue: number) {
    this.currentPage = 1;
    if(this.backEnd){
      this.$emit("changePage",this.currentPage,this.pageSize);
    }
    else {
      this.items = this.paginatedItems;
    }
  }

}
