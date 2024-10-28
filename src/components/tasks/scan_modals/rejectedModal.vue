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
      align="center"
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
        <h5 class="modalHeader">{{ $t("TaskScreen.MODAL_REJECTED_TITLE") }}</h5>
      </div>
      <div class="pt-8 pl-5 pr-5">
        <p class="modalInfoText">
          {{ $t("TaskScreen." + receiptProcessingResultStatus) }}
        </p>
      </div>

      <div class="pt-2">
        <div>
          <img
            src="../../../assets/images/receipt/check-error.png"
            class="progressModalImage"
          />
        </div>
      </div>

      <v-btn
        :style="`background-color:${config.mcolor}`"
        @click="hide"
        class="mt-12"
      >
        {{ $t("TaskScreen.SCAN_CLOSE") }}
      </v-btn>
    </v-card>
  </v-dialog>
</template>
<script>
import companyconfig from "@/core/companyconfig"
export default {
  data() {
    return {
      childVisible: true,
      config: {},
    }
  },
  props: {
    receiptProcessingResultStatus: {
      type: String,
      default: "Nie udało się dokonać weryfikacji",
    },
  },
  created() {
    this.setupLayout()
  },
  methods: {
    hide() {
      this.$emit("rejected-modal-hide")
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
  },
}
</script>
