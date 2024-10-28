<template>
  <v-card flat tile>
    <v-container
      v-if="!product.id"
      :style="`background-color:${config.innercolor} !important`"
    >
      <Loader />
    </v-container>
    <v-card
      flat
      v-else
      :style="`background-color:${config.innercolor} !important`"
    >
      <!-- Hidden form start -->
      <v-card-text :class="{ hidden: isHidden }">
        <v-row>
          <v-col class="col-12">
            <v-form v-model="address.valid" ref="addrForm" class="form">
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="`${$t('PersonalData.NAME_AND_LAST_NAME')}`"
                name="full_name"
                prepend-icon="person"
                type="text"
                autofocus
                v-model="address.full_name"
                :rules="[
                  (value) => {
                    return purchasefullnamerule(value)
                  },
                ]"
              ></v-text-field>
              <v-row no-gutters>
                <v-col xs6>
                  <v-text-field
                    autocomplete="off"
                    filled
                    dense
                    :placeholder="$t('PersonalData.APARTMENT_NUMBER')"
                    name="addrAprtment"
                    prepend-icon="mdi-home-floor-0"
                    type="text"
                    v-model="address.apartment_number"
                  ></v-text-field>
                </v-col>
                <v-col xs6>
                  <v-text-field
                    autocomplete="off"
                    filled
                    dense
                    :placeholder="$t('PersonalData.HOUSE_NUMBER')"
                    name="addrStreet"
                    prepend-icon="mdi-home-account"
                    type="text"
                    v-model="address.street_number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.STREET')"
                name="address"
                prepend-icon="mdi-home-map-marker"
                type="text"
                v-model="address.street_address"
              ></v-text-field>

              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.CITY')"
                name="addrCity"
                prepend-icon="mdi-home-city"
                type="text"
                v-model="address.city"
              ></v-text-field>
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.COUNTRY')"
                name="addrProvince"
                prepend-icon="mdi-globe-model"
                type="text"
                v-model="address.country"
              ></v-text-field>
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.ZIP_CODE')"
                name="addrZip"
                prepend-icon="mdi-home-map-marker"
                type="text"
                v-model="address.zip_code"
                :rules="[
                  (value) => {
                    return purchasezipcoderule(value)
                  },
                ]"
              ></v-text-field>
              <alert
                :errorType="address.errtype"
                :errorMessage="address.errors"
                :alert="address.showerror"
              ></alert>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
      <!-- Hidden form finish -->
      <v-card
        flat
        :style="`background-color:${config.innercolor} !important; border-radius:10px;`"
      >
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
              product.need_accept === AcceptanceType.ACCEPTANCE_PIN &&
              product.allow_reservation === '0'
            "
          />
          <AcceptanceQr
            :reward="product"
            v-if="
              product.need_accept === AcceptanceType.ACCEPTANCE_QR &&
              product.allow_reservation === '0'
            "
          />
          <AcceptanceQrByUser
            :reward="product"
            :address="address"
            v-if="
              product.need_accept === AcceptanceType.ACCEPTANCE_QR_SCAN_BY_USER
            "
          />
        </v-form>
      </v-card>
      <v-container :style="`background-color:${config.innercolor} !important`">
        <v-row justify="center" v-if="showButtons()">
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
              :loading="address.loading"
              :disabled="address.loading"
              @click="doPurchase"
              v-text="`${$t('RewardsScreen.ORDER')} (${product.price})`"
            ></v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-card>
</template>
<script>
import {
  NO_COMPANY_FOUND,
  CREATED_PURCHASE_SUCCESSFULLY,
  UNABLE_TO_CREATE_PURCHASE,
  PRODUCT_ID_IS_REQUIRED,
  COMPANY_URL_IS_REQUIRED,
  INSUFFICIENT_POINT,
  PRODUCT_DOES_NOT_BELONG_TO_THIS_COMPANY,
  NO_PRODUCT_FOUND,
  PURCHASE_LIMIT_EXCEEDED,
  USER_DONT_BELONG_TO_THIS_COMPANY,
} from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
import auth from "@/core/auth"
import alert from "@/components/shared/errorAlert"
import { AcceptanceType } from "@/appConstants"
import AcceptancePin from "./acceptancePin.vue"
import AcceptanceQr from "./acceptanceQr.vue"
import AcceptanceQrByUser from "./acceptanceQrByUser.vue"
import Loader from "@/components/shared/loaderComponent.vue"
export default {
  data() {
    return {
      tabaddr: "",
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
        allow_reservation: "",
      },
      config: {},
      showSuccess: false,
      address: {
        full_name: "",
        street_number: "",
        apartment_number: "",
        street_address: "",
        city: "",
        country: "",
        zip_code: "",
        errtype: "error",
        errors: "",
        showerror: false,
        loading: false,
      },
      acceptance: {
        pin: "",
      },

      AcceptanceType,
    }
  },
  created() {
    this.id = this.$route.params.id
    this.setupLayout()
    this.loadAddress()
    this.loadReward()
  },
  mounted() {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "NEW_LOYALTY", {
        event_category: "page_open",
        value: "reward_purchase",
      })
    }
  },
  computed: {
    isHidden() {
      const hiddenFormArray = [
        AcceptanceType.ACCEPTANCE_NORMAL,
        AcceptanceType.ACCEPTANCE_TIMER,
        AcceptanceType.ACCEPTANCE_NO,
      ]
      return !hiddenFormArray.includes(this.product.need_accept)
    },
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
    doPurchase() {
      let isvalid = this.$refs.addrForm.validate()
      let isaccept = this.$refs.acceptForm.validate()
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      if (isvalid && isaccept) {
        let token = auth.getAccessToken()
        this.address.showerror = false
        this.address.loading = true
        let self = this
        this.getAcceptance()

        api
          .purchaseReward(
            token,
            passedCompanyId,
            this.product.name,
            this.address.full_name,
            this.address.street_number,
            this.address.apartment_number,
            this.address.street_address,
            this.address.zip_code,
            this.address.city,
            this.address.country,
            this.id
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
            } else {
              self.showSuccess = false
              self.address.errors = self.$t("Errors.FAILED_TO_PURCHASE")
              self.address.showerror = true
              self.$refs.addrForm.name.focus()
            }
            self.address.loading = false
          })
          .catch(function (error) {
            let errmsg = error.data.message
            if (errmsg === UNABLE_TO_CREATE_PURCHASE) {
              let errObj = error.data.error
              if (
                errObj.product_id &&
                errObj.product_id[0] === PRODUCT_ID_IS_REQUIRED
              ) {
                self.address.errors = self.$t("Errors.PRODUCT_ID_IS_REQUIRED")
              } else if (
                errObj.url_name &&
                errObj.url_name[0] === COMPANY_URL_IS_REQUIRED
              ) {
                self.address.errors = self.$t("Errors.COMPANY_URL_IS_REQUIRED")
              } else if (
                errObj.money &&
                errObj.money[0] === INSUFFICIENT_POINT
              ) {
                self.address.errors = self.$t("Errors.INSUFFICIENT_POINT")
              } else if (
                errObj.url_name &&
                errObj.url_name[0] === NO_COMPANY_FOUND
              ) {
                self.address.errors = self.$t("Errors.NO_COMPANY_FOUND")
              } else if (
                errObj.product_id &&
                errObj.product_id[0] == PRODUCT_DOES_NOT_BELONG_TO_THIS_COMPANY
              ) {
                self.address.errors = self.$t(
                  "Errors.PRODUCT_DOES_NOT_BELONG_TO_THIS_COMPANY"
                )
              } else if (
                errObj.product_id &&
                errObj.product_id[0] === NO_PRODUCT_FOUND
              ) {
                self.address.errors = self.$t("Errors.NO_PRODUCT_FOUND")
              } else if (
                errObj.purchase &&
                errObj.purchase[0] === PURCHASE_LIMIT_EXCEEDED
              ) {
                self.address.errors = self.$t("Errors.PURCHASE_LIMIT_EXCEEDED")
              } else if (
                errObj.money &&
                errObj.money[0] === USER_DONT_BELONG_TO_THIS_COMPANY
              ) {
                self.address.errors = self.$t(
                  "Errors.USER_DONT_BELONG_TO_THIS_COMPANY"
                )
              }
            } else {
              self.address.errors = self.$t("Errors.FAILED_TO_PURCHASE")
            }
            self.showSuccess = false
            self.address.showerror = true
            self.address.loading = false
          })
      }
    },
    /** Purchase Name Mandatory rule */
    purchasefullnamerule(value) {
      if (!value) {
        return this.$t("Errors.NAME_REQUIRED")
      }
      return true
    },
    pinAcceptanceRule(value) {
      if (!value) {
        return this.$t("Errors.PIN_REQUIRED")
      } else if (value !== this.reward.pin) {
        return this.$t("Errors.INVALID_PIN")
      }
      return true
    },
    /** User zipcode mandatory rule */
    purchasezipcoderule(value) {
      if (!value) {
        return this.$t("Errors.ZIPCODE_REQUIRED")
      }
      return true
    },
    /** Navigate to purchase result page */
    navigateresult(purchaseId) {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "result",
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
    loadReward() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = this.$i18n.locale
      api
        .getReward(token, passedCompanyId, lang, this.id)
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
    showButtons() {
      if (this.product.allow_reservation === "1") {
        return (
          this.product.need_accept === AcceptanceType.ACCEPTANCE_QR ||
          this.product.need_accept === AcceptanceType.ACCEPTANCE_PIN
        )
      }
      return (
        this.product.need_accept !== AcceptanceType.ACCEPTANCE_QR &&
        this.product.need_accept !== AcceptanceType.ACCEPTANCE_QR_SCAN_BY_USER
      )
    },

    getAcceptance() {
      if (this.product.need_accept === AcceptanceType.ACCEPTANCE_NO) {
        return true
      } else if (this.product.need_accept === AcceptanceType.ACCEPTANCE_PIN) {
        return this.product.pin === this.acceptance.pin
      }
    },
    /**
     * Load the user address details
     */
    loadAddress() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getUserAddress(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          if (response.data) {
            let data = response.data
            this.address.full_name = data.full_name
            this.address.street_number = data.street_number
            this.address.apartment_number = data.apartment_number
            this.address.street_address = data.street_address
            this.address.city = data.city
            this.address.country = data.country
            this.address.zip_code = data.zip_code
          }
        })
        .catch((err) => {
          let errmsg = err.data.message
          if (errmsg === NO_COMPANY_FOUND) {
            console.log(err)
          }
        })
    },
    /**
     * Navigate tp previous url
     */
    navigate() {
      this.$router.go(-1)
    },
  },
  components: {
    alert,
    AcceptancePin,
    AcceptanceQr,
    AcceptanceQrByUser,
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
  padding: 5px 10px;
  background: white;
  border-radius: 10px;
}
</style>
