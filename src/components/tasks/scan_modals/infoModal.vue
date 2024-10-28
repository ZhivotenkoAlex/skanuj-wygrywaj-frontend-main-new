<template>
  <v-dialog
    v-model="childVisible"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card
      class="modelFullscreen"
      :style="`color:${config.mfontcolor};text-align: center`"
    >
      <div class="pt-12">
        <v-img
          :src="config.shortlogo"
          max-height="80px"
          contain
          v-if="config.showLogo"
        ></v-img>
      </div>
      <div class="pt-12">
        <h4 class="modalHeader">{{ $t("TaskScreen.MODAL_INFO_TITLE") }}</h4>
      </div>

      <div class="pt-2">
        <div>
          <img
            src="../../../assets/images/receipt/check-info.png"
            class="progressModalImage"
          />
        </div>
      </div>

      <h5 class="status-info-p" style="font-size: 14px">
        {{ errorMessage }}
      </h5>

      <v-btn
        :style="`background-color:${config.mcolor}`"
        @click="hide"
        class="mt-2 modalNotActionBtn mb-12"
      >
        {{ $t("TaskScreen.SCAN_CLOSE") }}
      </v-btn>
    </v-card>
  </v-dialog>
</template>
<script>
import $ from "jquery"
import companyconfig from "@/core/companyconfig"
export default {
  data() {
    return {
      childVisible: true,
      config: {},
    }
  },
  props: {
    errorMessage: {
      type: String,
      default: "",
    },
  },
  created() {
    this.setupLayout()
  },
  methods: {
    hide() {
      this.$emit("error-modal-hide")
    },
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "shortlogo", data.shortLogo)
        this.$set(this.config, "showLogo", data.showLogo)
        this.$set(this.config, "showMenu", data.showMenu)
        this.$set(this.config, "logoPosition", data.logoPosition)
      }
    },
    rescan() {
      this.hide()
      $("#file").click()
    },
  },
}
</script>
