<template>
  <v-card flat tile :style="`background-color:${config.innercolor} !important`">
    <div v-if="!product.id">
      <Loader />
    </div>
    <v-card flat v-else>
      <v-card flat>
        <v-img
          contain
          :src="product.picture"
          v-if="product.picture"
          height="200px"
        ></v-img>
        <v-form v-model="acceptance.valid" ref="acceptForm" class="px-2">
          <AcceptancePin
            :pin="product.pin"
            v-if="
              product.allow_reservation === '1' &&
              (product.need_accept === AcceptanceType.ACCEPTANCE_PIN ||
                product.need_accept === AcceptanceType.ACCEPTANCE_QR)
            "
          />
        </v-form>
      </v-card>
      <v-container>
        <v-row
          justify="center"
          :style="`background-color:${config.innercolor} !important`"
          v-if="
            product.need_accept === AcceptanceType.ACCEPTANCE_QR ||
            product.need_accept === AcceptanceType.ACCEPTANCE_PIN
          "
        >
          <v-col cols="auto">
            <v-btn
              class="button"
              :style="`background-color:${config.mcolor}`"
              @click="navigatehome"
              v-text="$t('LoginScreen.BACK_BTN')"
            ></v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              class="button"
              :style="`background-color:${config.mcolor}`"
              :loading="product.loading"
              :disabled="product.loading"
              @click="applyReservation"
              v-text="`$t('RewardsScreen.REDEEM_VOUCHER')`"
            ></v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-alert v-if="showError" type="warning" dismissible>
        {{ error }}
      </v-alert>
    </v-card>
  </v-card>
</template>
<script>
import { NO_COMPANY_FOUND, PURCHASE_APPLIED_SUCCESSFULLY } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
import auth from "@/core/auth"
// import alert from "@/components/shared/errorAlert"
import { AcceptanceType } from "@/appConstants"
import AcceptancePin from "./acceptancePin.vue"
// import AcceptanceQr from "./acceptanceqr.vue"
// import AcceptanceQrByUser from "./acceptanceQrByUser.vue"
import Loader from "@/components/shared/loaderComponent.vue"
export default {
  data() {
    return {
      product: {
        id: "",
        name: "",
        description: "",
        picture: "",
        price: 0,
        is_virtual: "",
        need_accept: "",
        pin: "",
        admin_verify_needed: "",
        has_codes: "",
        allow_reservations: "",
      },
      config: {},
      showError: false,
      error: null,
      acceptance: {
        pin: "",
      },
      AcceptanceType,
    }
  },
  created() {
    this.id = this.$route.params.id
    this.setupLayout()
    this.loadPurchase()
  },
  mounted() {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "NEW_LOYALTY", {
        event_category: "page_open",
        value: "reward_purchase",
      })
    }
  },
  methods: {
    handleFormValue(pinValue) {
      console.log("Received PIN value from child:", pinValue)
      // Process the pinValue as needed
    },
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "pcolor", data.primary_color)
        this.$set(this.config, "pfontcolor", data.primary_font_color)
        this.$set(this.config, "innercolor", data.layout_background_color_inner)
        this.$set(this.config, "outercolor", data.layout_background_color_outer)
      }
    },
    /**
     * Submit the user details for purchase
     */
    applyReservation() {
      let isaccept = this.$refs.acceptForm.validate()
      if (isaccept) {
        let token = auth.getAccessToken()
        let self = this
        this.getAcceptance()

        api
          .applyPurchase(this.id, token)
          .then(function (response) {
            let msg = response.data.message
            if (msg === PURCHASE_APPLIED_SUCCESSFULLY) {
              self.showSuccess = true

              if (typeof window.gtag !== "undefined") {
                window.gtag("event", "NEW_LOYALTY", {
                  event_category: "purchase",
                  value: "success",
                })
              }
              self.navigateresult(response.data.data.id)
            } else {
              self.showError = true
            }
          })
          .catch(function () {
            self.showError = true
            self.error = self.$t("Errors.FAILED_TO_PURCHASE")
          })
      }
    },
    pinAcceptanceRule(value) {
      if (!value) {
        return this.$t("Errors.PIN_REQUIRED")
      } else if (value !== this.reward.pin) {
        return this.$t("Errors.INVALID_PIN")
      }
      return true
    },
    /** Navigate to purchase result page */
    navigateresult(purchaseId) {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "reservationresult",
        query: { company_name: passedCompanyId, id: purchaseId },
      })
    },
    /** Navigate to home page */
    navigatehome() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "home",
        query: { company_name: passedCompanyId },
      })
    },
    /**
     * Load Reward Name
     */
    loadPurchase() {
      let token = auth.getAccessToken()
      api
        .getPurchase(token, this.id)
        .then((result) => {
          let response = result.data
          let data = response.data
          this.product = data
          this.loadProduct(data.product_id)
        })
        .catch((err) => {
          let errmsg = err.data.message
          console.log(errmsg)
        })
    },
    loadProduct(id) {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = this.$i18n.locale
      api
        .getReward(token, passedCompanyId, lang, id)
        .then((result) => {
          let response = result.data
          if (response.data) {
            let data = response.data[0]
            this.product = data
          }
        })
        .catch((err) => {
          let errmsg = err.data.message
          if (errmsg === NO_COMPANY_FOUND) {
            console.log(err)
          }
        })
    },
    getAcceptance() {
      if (this.product.need_accept === AcceptanceType.ACCEPTANCE_NO) {
        return true
      } else if (this.product.need_accept === AcceptanceType.ACCEPTANCE_PIN) {
        return this.product.pin === this.acceptance.pin
      }
    },
    /**
     * Navigate tp previous url
     */
    navigate() {
      this.$router.go(-1)
    },
  },
  components: {
    // alert,
    AcceptancePin,
    // AcceptanceQr,
    // AcceptanceQrByUser,
    Loader,
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

.button {
  min-width: 130px !important;
}

.form {
  padding: 10px 10px 5px 10px !important;
  background: white;
  margin: 0;
}
</style>
