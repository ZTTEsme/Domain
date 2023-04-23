import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  template: `
    <div class="row g-0" v-show="show">
      <div class="col-xl-4"></div>
      <div class="col-xl-4">
        <img :src="img" class="img-fluid mx-auto d-block" alt="" >
      </div>
      <div class="col-xl-4"></div>
    </div>
  `,
})
export default class NoDataComponent extends Vue {
  @Prop()
  private readonly img!:string;

  @Prop({default:false})
  private readonly show!: boolean;


}
