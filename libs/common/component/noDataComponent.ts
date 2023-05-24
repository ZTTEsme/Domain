import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  template: `
    <div class="row g-0" v-show="show">
    <div class="col-md" style="display: flex;justify-content: center;align-items: center;height: 200px" >
      <!--        <img :src="img" class="img-fluid mx-auto d-block" style="height: 200px;display: none" alt="" >-->
      <slot></slot>
    </div>
    </div>
  `,
})
export default class NoDataComponent extends Vue {
  @Prop()
  private readonly img!:string;

  @Prop({default:false})
  private readonly show!: boolean;


}
