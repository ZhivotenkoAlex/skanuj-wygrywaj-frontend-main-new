<template>
  <v-card flat :style="`background-color:${config.innercolor} !important`">
    <div class="qr-code-container" v-if="scannerEnabled">
      <qrcode-stream
        class="qr-code-container"
        @detect="onDetect"
      ></qrcode-stream>
    </div>
    <v-card
      v-if="inputEnabled"
      class="form_container"
      :style="`background-color:${config.innercolor} !important`"
    >
      <v-text-field
        class="form"
        autocomplete="off"
        filled
        dense
        :placeholder="'PIN'"
        name="pin"
        prepend-icon="mdi-home-map-marker"
        type="password"
        v-model="acceptance.pin"
        validate-on-blur
        :rules="[
          (value) => {
            return pinAcceptanceRule(value)
          },
        ]"
      ></v-text-field>
      <v-btn
        block
        color="primary"
        @click="purchaseViaPin"
        v-text="
          `${$t('RewardsScreen.ORDER')} (${reward.price}) ${$t(
            'AppScreen.BUY_POINTS'
          )}) `
        "
      ></v-btn>
    </v-card>

    <v-alert v-if="showError" type="warning" dismissible>
      {{ error }}
    </v-alert>
    <v-card-text
      v-if="reward.description"
      class="py-2 text-center"
      v-html="reward.description"
    ></v-card-text>
    <v-card
      class="buttons"
      :style="`background-color:${config.innercolor} !important`"
    >
      <v-btn
        block
        color="primary"
        @click="enableScanner"
        v-text="`$t('RewardsScreen.START_SCAN')`"
      ></v-btn>

      <v-btn
        block
        color="primary"
        @click="enableTextInput"
        v-text="`$t('RewardsScreen.ENTER_CODE')`"
      ></v-btn>
    </v-card>
  </v-card>
</template>
<script>
// import alert from "@/components/shared/errorAlert"
import api from "@/services/fetchapi"
import auth from "@/core/auth"
import companyconfig from "@/core/companyconfig"
import { AcceptanceType } from "@/appConstants"
import { QrcodeStream } from "vue-qrcode-reader"
import { CREATED_PURCHASE_SUCCESSFULLY } from "@/appConstants"
export default {
  props: {
    reward: {
      type: Object,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      acceptance: {
        pin: "",
      },
      AcceptanceType,
      scannerEnabled: false,
      inputEnabled: false,
      error: this.$t("Errors.INCORRECT_QR"),
      showError: false,
      config: {},
    }
  },

  created() {
    this.id = this.$route.params.id
    this.setupLayout()
  },
  methods: {
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "innercolor", data.layout_background_color_inner)
        this.$set(this.config, "outercolor", data.layout_background_color_outer)
      }
    },
    qrAcceptanceRule(value) {
      if (!value) {
        return this.$t("Errors.PIN_REQUIRED")
      } else if (value !== this.reward.pin) {
        return this.$t("Errors.INVALID_PIN")
      }
      return true
    },
    enableScanner() {
      this.scannerEnabled = true
      this.inputEnabled = false
    },
    enableTextInput() {
      this.inputEnabled = true
      this.scannerEnabled = false
    },
    pinAcceptanceRule(value) {
      if (!value) {
        return this.$t("Errors.PIN_REQUIRED")
      } else if (value !== this.reward.pin) {
        return this.$t("Errors.INVALID_PIN")
      }
      return true
    },
    async onDetect(detectedCodes) {
      const code = await detectedCodes
      if (code.content === this.reward.pin) {
        this.doPurchase()
      } else {
        this.showError = true
      }
    },
    purchaseViaPin() {
      this.doPurchase()
    },
    navigateresult(purchaseId) {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "result",
        query: { company_name: passedCompanyId, id: purchaseId },
      })
    },
    doPurchase() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let self = this
      api
        .purchaseReward(
          token,
          passedCompanyId,
          self.reward.name,
          self.address.full_name,
          self.address.street_number,
          self.address.apartment_number,
          self.address.street_address,
          self.address.zip_code,
          self.address.city,
          self.address.country,
          self.id
        )
        .then(function (response) {
          let msg = response.data.message
          if (msg === CREATED_PURCHASE_SUCCESSFULLY) {
            self.showSuccess = true

            if (typeof window.gtag !== "undefined") {
              window.gtag("event", "NEW_LOYALTY", {
                event_category: "purchase",
                value: "success",
              })
            }
            self.navigateresult(response.data.data.id)
          }
        })
        .catch(function () {
          this.showError = true
          this.inputEnabled = false
          this.scannerEnabled = false
        })
    },
  },
  components: {
    // alert,
    QrcodeStream,
    // QrcodeDropZone,
    // QrcodeCapture,
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
  width: 200px;
  margin: 0 auto;
}

.buttons {
  display: grid;
  gap: 10px;
  margin-bottom: 30px;
  margin-top: 30px;
}

.form {
  padding: 10px 10px 5px 10px !important;
  background: white;
  margin: 0;
}

.form_container {
  margin: 20px 0;
  display: grid;
  gap: 10px;
}
</style>
