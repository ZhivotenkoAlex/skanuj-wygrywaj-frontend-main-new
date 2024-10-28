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
        background: #0f0f0f;
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
        class="pt-10 pb-10 pl-10 pr-10"
        :style="`color:${config.mfontcolor};background-color: rgb(0 0 0 / 52%);
          margin: 20px;
          border-radius: 20px;`"
      >
        <div class="pt-2 pb-5">
          <div>
            <img
              src="../../../assets/images/receipt/check.png"
              class="progressModalImage"
            />
          </div>
        </div>
        <h5 class="modalHeader white--text">
          {{ $t("TaskScreen.MODAL_SUCCESS_REVIEWED_TITLE") }}
        </h5>
        <div class="pl-5 pr-5 pb-1">
          <p class="modalInfoText white--text">
            {{ $t("TaskScreen.MODAL_SUCCESS_REVIEWED") }}
          </p>
        </div>
        <v-btn
          :style="`background-color:${config.mcolor}`"
          @click="hide"
          block
          class="mt-3 modalNotActionBtn mb-12 mr-3 w-100"
        >
          {{ $t("TaskScreen.SCAN_CLOSE") }}
        </v-btn>
      </div>
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
      product: 1,
      incentive: 0,
    }
  },
  props: {},
  created() {
    this.setupLayout()
  },
  methods: {
    hide() {
      this.$emit("awaiting-modal-hide")
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
