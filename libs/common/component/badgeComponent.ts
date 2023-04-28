import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  emits:['click'],
  template:`
    <button type="button" class="btn position-relative" :class="btnType"  @click="buttonClick">
        {{text}}
      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        {{badge}}
        <span class="visually-hidden">unread messages</span>
      </span>
    </button>
  `
})
export default class BadgeComponent extends Vue {
  @Prop({default:""})
  private text!: string;

  @Prop({default:""})
  private badge!: string;

  @Prop({default:"btn-out-primary"})
  private btnType!:string;

  @Prop() private onClick!: () => void;

  private mounted() {

  }

  private buttonClick(): void {
    this.$emit("click");
  }

}
