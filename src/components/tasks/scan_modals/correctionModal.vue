<template>
  <v-dialog
    v-model="childVisible"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card class="modelFullscreen" style="text-align: center" align="center">
      <div :style="`color:${config.mfontcolor}`" class="pt-12">
        <div>
          <img
            src="../../../assets/images/receipt/check-error.png"
            style="
              max-width: 45px;
              float: left;
              margin-left: 27px;
              margin-right: 10px;
            "
          />
          <h3
            class="status-processing"
            style="
              color: red;
              margin-top: 0px;
              font-size: 16px;
              float: left;
              width: 225px;
            "
          >
            {{ $t("TaskScreen.MODAL_CORRECTION_TITLE") }}
          </h3>
        </div>
        <h4
          class="status-processing pt-8 pb-8"
          style="color: #ff573c; clear: both"
        >
          {{ $t("TaskScreen.MODAL_CORRECTION_RETRY_SUBTITLE") }}
        </h4>
      </div>

      <div align="center" id="correct-content"></div>

      <v-divider class="mt-4 mb-4 ml-12 mr-12"></v-divider>

      <div :style="`color:${config.mfontcolor}`">
        <h4 class="rewards-section">
          {{ $t("TaskScreen.MODAL_ERROR_SUGGESTION_TITLE") }}:
        </h4>

        <v-row class="pl-5 pr-5">
          <v-col cols="3">
            <div>
              <img
                style="max-width: 100%"
                src="../../../assets/images/receipt/Fragmenty.png"
              />
            </div>
          </v-col>
          <v-col cols="9">
            <p class="text-left">
              {{ $t("TaskScreen.MODAL_ERROR_SUGGESTION_4") }}
            </p>
          </v-col>
        </v-row>

        <v-row class="pl-5 pr-5">
          <v-col cols="3">
            <div>
              <img
                style="max-width: 100%"
                src="../../../assets/images/receipt/Cienie.png"
              />
            </div>
          </v-col>
          <v-col cols="9">
            <p class="text-left">
              {{ $t("TaskScreen.MODAL_ERROR_SUGGESTION_1") }}
            </p>
          </v-col>
        </v-row>

        <v-row class="pl-5 pr-5">
          <v-col cols="3">
            <div>
              <img
                style="max-width: 100%"
                src="../../../assets/images/receipt/Przyslanianie.png"
              />
            </div>
          </v-col>
          <v-col cols="9">
            <p class="text-left">
              {{ $t("TaskScreen.MODAL_ERROR_SUGGESTION_2") }}
            </p>
          </v-col>
        </v-row>

        <v-row class="pl-5 pr-5">
          <v-col cols="3">
            <div>
              <img
                style="max-width: 100%"
                src="../../../assets/images/receipt/Swiatlo.png"
              />
            </div>
          </v-col>
          <v-col cols="9">
            <p class="text-left">
              {{ $t("TaskScreen.MODAL_ERROR_SUGGESTION_3") }}
            </p>
          </v-col>
        </v-row>
      </div>

      <v-btn
        :style="`background-color:${config.mcolor}`"
        @click="next"
        class="mt-12 modalActionBtn"
      >
        {{ $t("TaskScreen.SCAN_NEXT_BTN") }}
      </v-btn>
      <v-btn
        :style="`background-color:${config.mcolor}`"
        @click="mark"
        class="mt-12 modalActionBtn"
      >
        {{ $t("TaskScreen.SCAN_MARK_BTN") }}
      </v-btn>
      <v-btn
        :style="`background-color:${config.mcolor}`"
        @click="cancel"
        class="mt-2 modalNotActionBtn"
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
    }
  },
  methods: {
    next() {
      this.$emit("correction-modal-next")
    },
    mark() {
      this.$emit("correction-modal-mark")
    },
    cancel() {
      this.$emit("correction-modal-hide")
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
        this.$set(this.config, "background_loyalty", data.background_loyalty)
      }
    },
  },
}
</script>
