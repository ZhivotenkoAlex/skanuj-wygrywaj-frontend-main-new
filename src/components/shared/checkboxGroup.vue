<template>
  <div>
    <header>{{ label }}</header>
    <v-row>
      <v-col v-for="(item, index) in options" :class="colclass" :key="index">
        <v-checkbox
          :name="name"
          :label="item"
          :value="item"
          @change="updatecheckbox(name, $event, item)"
        ></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "checkboxGroup",
  data() {
    return {
      formData: this.value || [],
    }
  },
  props: ["label", "name", "value", "options", "colclass"],
  methods: {
    /**
     * Update the checkbox value for dynamic forms.
     */
    updatecheckbox(fieldName, checkvalue, value) {
      if (checkvalue != null) {
        this.formData.push(value)
      } else {
        let index = this.formData.indexOf(value)
        if (index > -1) {
          this.formData.splice(index, 1)
        }
      }
      this.$emit("input", this.formData)
    },
  },
}
</script>
