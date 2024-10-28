<template>
  <v-dialog
    v-model="childVisible"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card
      class="modelFullscreen"
      v-bind:style="{
        backgroundImage: 'url(' + config.background_loyalty + ')',
      }"
      style="
        text-align: center;
        background: #ffffff;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      "
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

      <div
        :style="`color:${config.mfontcolor};margin: 20px; border-radius: 20px;`"
      >
        <div class="pt-12">
          <div>
            <img
              src="../../../assets/images/receipt/check-error.png"
              class="progressModalImage"
            />
          </div>
        </div>

        <div class="pt-5 pb-5">
          <h4 class="modalHeader">{{ $t("TaskScreen.MODAL_ERROR_TITLE") }}</h4>
        </div>

        <h5 class="rewards-section pt-3">{{ errorMessage }}</h5>

        <div class="pl-5 pr-5 pb-1">
          <v-btn
            v-if="id > 0"
            @click="sendManualVerification"
            block
            class="mt-10 modalNotActionBtn w-100"
            style="max-width: 100%"
          >
            Wyślij do weryfikacji ręcznej
          </v-btn>
          <v-btn
            :style="`background-color:${config.mcolor}`"
            @click="hide"
            block
            class="mt-3 modalNotActionBtn mb-12 mr-3 w-100"
          >
            {{ $t("TaskScreen.SCAN_CLOSE") }}
          </v-btn>
        </div>
      </div>
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
      default: "Error happened",
    },
    id: {
      type: [String, Number],
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
    sendManualVerification() {
      this.$emit("send-manual-verification")
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
    rescan() {
      this.hide()
      $("#file").click()
    },
  },
}
</script>
