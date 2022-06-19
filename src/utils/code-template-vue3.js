import { buildActiveTabs } from "@/utils/conde-utils-generator";

export const genVue3JS = function (formConfig, widgetList) {
  let defaultValueList = []
  let rulesList = []
  let fieldOptions = []
  let uploadData = []

  const activeTabs = buildActiveTabs(formConfig, widgetList)

  const v3JSTemplate =
    `  import { defineComponent, toRefs, reactive, getCurrentInstance } from 'vue'
  
  export default defineComponent({
    components: {},
    props: {},
    setup() {
      const state = reactive({
        ${formConfig.modelName}: {
          ${defaultValueList.join('\n')}
        },
        
        ${formConfig.rulesName}: {
          ${rulesList.join('\n')}
        },
        
        ${activeTabs.join('\n')}
        
        ${fieldOptions.join('\n')}
        
        ${uploadData.join('\n')}
      })
    
      const instance = getCurrentInstance()
      
      const submitForm = () => {
        instance.ctx.$refs['vForm'].validate(valid => {
          if (!valid) return
          
          //TODO: 提交表单
        })
      }
      
      const resetForm = () => {
        instance.ctx.$refs['vForm'].resetFields()
      }
      
      return {
        ...toRefs(state),
        submitForm,
        resetForm
      }
    }
  })`

  return v3JSTemplate
}

