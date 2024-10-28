<template>
  <v-card flat :style="`background-color:${config.innercolor} !important`">
    <v-card-text
      class="py-2 text-center"
      v-text="
        `${$t('RewardsScreen.ASK_STAFF_TO_SCAN')} ${reward.price} ${$t(
          'AppScreen.BUY_POINTS'
        )}. ${$t('RewardsScreen.DONT_CLOSE_WINDOW')}`
      "
    ></v-card-text>
    <div class="qr-code-container">
      <vue-qr :text="reward.pin" :size="200"></vue-qr>
    </div>
    <v-card-text
      class="py-1 text-center red--text font-weight-bold"
      v-text="`$t('RewardsScreen.DONT_SKAN_YOUSELF')`"
    ></v-card-text>
    <v-card-text
      class="py-1 text-center red--text font-weight-bold"
      v-text="`$t('RewardsScreen.MAY_LOOSE_POINTS')`"
    ></v-card-text>
  </v-card>
</template>
<script>
// import alert from "@/components/shared/errorAlert"
import { AcceptanceType } from "@/appConstants"
import VueQr from "vue-qr"
import companyconfig from "@/core/companyconfig"
export default {
  props: {
    reward: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      acceptance: {
        pin: "",
      },
      color: {
        dark: "#000000ff",
        light: "#ffffffff",
      },
      type: "image/webp",
      AcceptanceType,
      src: "https://cdn.2take.it/v2/skanuj-wygrywaj/1663023868631fbafcdd5a26.77375972.jpg",
      config: {},
    }
  },

  created() {
    this.id = this.$route.params.id
    this.setupLayout()
  },
  methods: {
    pinAcceptanceRule(value) {
      if (!value) {
        return this.$t("Errors.PIN_REQUIRED")
      } else if (value !== this.reward.pin) {
        return this.$t("Errors.INVALID_PIN")
      }
      return true
    },
    onDataUrlChange(dataUrl) {
      this.dataUrl = dataUrl
    },
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "innercolor", data.layout_background_color_inner)
        this.$set(this.config, "outercolor", data.layout_background_color_outer)
      }
    },
  },
  components: {
    // alert,
    VueQr,
  },
}
</script>

<style>
.v-text-field--filled:not(.v-text-field--single-line) input {
  margin-top: 10px;
}

.v-application i.primary-text.theme--light {
  color: black;
}

input {
  font-size: 16px;
}

.acceptance-warning {
  color: red;
  text-align: center;
  font-weight: 500;
}

.hidden {
  display: none;
}

.qr-code-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
