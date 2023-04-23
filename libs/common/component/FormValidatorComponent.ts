import { Component, Prop, Vue,Ref } from "vue-facing-decorator";

@Component({
})



export default class FormValidatorComponent extends Vue {

  @Prop
  private readonly props:any={
    formItems: {
      type: Array as () => FormItem[],
      required: true,
    },
  }

  private setup(props:any) {
    const form = Ref({});
    const validate = () => {
      let isValid = true;
      for (const item of props.formItems) {
        const value = form.value[item.prop];
        if (item.rules) {
          for (const rule of item.rules) {
            if (!rule.validator(value)) {
              console.error(`${item.label}: ${rule.message}`);
              isValid = false;
              break;
            }
          }
        }
      }
      return isValid;
    };
    return {
      form,
      validate,
    };

  }

}
