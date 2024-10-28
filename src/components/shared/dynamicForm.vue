<template>
  <v-container>
    <component
      v-for="(field, index) in schema"
      :key="index"
      :is="field.fieldType"
      :value="formData[field.name]"
      @input="updateForm(field.name, $event)"
      v-bind="field"
    ></component>
  </v-container>
</template>
<script>
// import checkboxgroup from "./checkboxGroup"
// import { VTextField, VCheckbox, VTextarea, VSelect } from "vuetify/lib"
export default {
  // components: { VTextField, VTextarea, VCheckbox, VSelect, checkboxgroup },
  props: ["schema", "value"],
  data() {
    return {
      formData: this.value || {},
    }
  },
  methods: {
    /**
     * Update the values for fields in dynamic form
     */
    updateForm(fieldName, value) {
      this.$set(this.formData, fieldName, value)
      this.$emit("input", this.formData)
    },
  },
}
</script>
