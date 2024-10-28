<template>
  <div>
    <v-alert
      :type="errorType"
      transition="slide-y-reverse-transition"
      v-model="showalert"
      :color="errorType === 'error' ? 'red' : 'green'"
      :dismissible="dismissible"
      @click="removeErrors"
      class="content"
      >{{ errorMessage }}</v-alert
    >
  </div>
</template>

<script>
export default {
  data() {
    return { showalert: false }
  },
  props: {
    errorType: {
      type: String,
      default: "error", //"success"
    },
    errorMessage: String,
    dismissible: {
      type: Boolean,
      default: true,
    },
    alert: { type: Boolean, default: false },
    callback: {
      type: Function,
      default: null,
    },
  },
  mounted() {},
  watch: {
    /**
     * Show the alert when value changes
     */
    alert: function (oldval) {
      this.showalert = oldval
      if (oldval) {
        setTimeout(this.removeErrors, 5000)
      }
    },
  },
  methods: {
    removeErrors() {
      this.showalert = false
      if (this.callback) {
        this.callback()
      }
    },
  },
}
</script>
<style scoped>
.content {
  text-align: center;
}
</style>
