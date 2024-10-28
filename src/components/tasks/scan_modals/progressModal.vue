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
        color: config.mfontcolor,
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

      <div class="pt-12 px-6">
        <h4 class="status-processing">Trwa przetwarzanie</h4>
        <br />
        <p class="status-info-p" v-if="scanNumber === 1">
          Możesz zbierać punkty w setkach sklepów internetowych na całym świecie
          i wymieniać na nagrody i niespodzianki
        </p>
        <p class="status-info-p" v-if="scanNumber === 2">
          Polecaj produkty znajomym i zdobywaj dodatkowe punkty!
        </p>
        <p class="status-info-p" v-if="scanNumber === 3">
          Nie trać czasu i przesyłaj zdjęcia paragonów w szybki sposób dzięki
          dedykowanemu systemowi OCR
        </p>

        <div align="center" v-if="scanNumber === 1" class="process-image">
          <img
            src="../../../assets/images/receipt/World_01.png"
            style="max-width: 120px; padding: 20px 0; width: 120px"
          />
        </div>
        <div align="center" v-if="scanNumber === 2" class="process-image">
          <img
            src="../../../assets/images/receipt/Points_01.png"
            style="max-width: 120px; padding: 20px 0; width: 120px"
          />
        </div>
        <div align="center" v-if="scanNumber === 3" class="process-image">
          <img
            src="../../../assets/images/receipt/Scan_01.png"
            style="max-width: 120px; padding: 20px 0; width: 120px"
          />
        </div>

        <div class="progress-bar-container">
          <div v-bind:style="{ width: percent + '%' }"></div>
        </div>
        <p style="margin: 10px auto; height: 50px">{{ text }}</p>
        <v-btn
          :style="`background-color:${config.mcolor};margin-top:30px;width: 200px`"
          large
          @click="hide()"
        >
          Anulowac
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import companyconfig from "@/core/companyconfig"

export default {
  props: ["text", "percent"],
  data() {
    return {
      childVisible: true,
      config: {},
      scanNumber: 0,
      bill_percent: 0,
      receipt_status: "",
    }
  },
  created() {
    this.setupLayout()
    this.scanNumber = Math.floor(Math.random() * 3) + 1
  },
  methods: {
    hide() {
      this.$emit("progress-modal-hide")
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
        this.$set(this.config, "logoPosition", data.logoPosition)
        this.$set(this.config, "background_loyalty", data.background_loyalty)
      }
    },
    randomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
  },
}
</script>

<style>
.progress-bar-container {
  width: 80%;
  height: 15px;
  background: white;
  border: 1px solid #6c6c6c;
  margin: auto;
  max-width: 350px;
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 45%) 0px 5px 5px 0px;
}

.progress-bar-container > div {
  height: 100%;
  background: #6c6c6c;
  border-radius: 4px;
}

.process-image {
  filter: grayscale(1);
}
</style>
