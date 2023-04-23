import { Component, Prop, Vue,Ref } from "vue-facing-decorator";
import JsExtension from "qnect-sdk-web/lib/common/core/ts/jsExtension";


@Component({
  emits: ["click"],
  template: `
    <button :disabled="disabled" :style="btnStyle" type="button" class="btn btn-sm" :class="shape" @click="buttonClick" >
          <i   v-show="hasIcon" class="flex-shrink-0" :class="icon" :style="iconStyle"></i>
          <img v-show="hasImg" :src="img" class="img-fluid mx-auto d-block" alt="" :style="imgStyle" >
          <span v-show="hasMsg">{{msg}}</span>
    </button>
  `,
})
export default class ButtonComponent extends Vue {

  @Prop()
  private readonly img!: string;

  @Prop({default:false})
  private readonly disabled!: boolean;

  @Prop({default:"btn-outline-primary"})
  private readonly shape!:string;

  @Prop({default:"padding:2px"})
  private readonly btnStyle!: string

  @Prop({default:""})
  private readonly imgStyle!: string

  @Prop({default:""})
  private readonly iconStyle!: string

  @Prop({ default: "" })
  private readonly icon!: string;

  @Prop({ default: "" })
  private readonly msg!: string;

  public get hasIcon(): boolean {
    return !JsExtension.isBlank(this.icon);
  }

  public get hasImg(): boolean {
    return !JsExtension.isBlank(this.img);
  }

  public get hasMsg(): boolean {
    return !JsExtension.isBlank(this.msg);
  }

  private buttonClick(): void {
    this.$emit("click");
  }

}
