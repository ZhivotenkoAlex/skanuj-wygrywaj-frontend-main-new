<template>
  <v-card flat tile id="cashback-screen">
    <div id="cashback-screen-tools">
      <v-btn
        icon
        class="border0px"
        @click="navigate"
        :style="`color:${config.mfontcolor} !important`"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </div>
    <v-card flat v-if="!showSuccess">
      <v-card-text>
        <v-row>
          <v-col class="col-12">
            <v-form v-model="credentials.valid" ref="addrForm">
              <alert
                :errorType="credentials.errtype"
                :errorMessage="credentials.errors"
                :alert="credentials.showerror"
              ></alert>

              <v-text-field
                autocomplete="off"
                filled
                dense
                :label="$t('Cashback.CASHBACK_NAME')"
                name="addrCity"
                prepend-icon="person"
                type="text"
                v-model="credentials.full_name"
              ></v-text-field>

              <v-text-field
                autocomplete="off"
                filled
                dense
                :label="$t('Cashback.BANK_ACCOUNT')"
                name="addrProvince"
                prepend-icon="account_balance_wallet"
                type="text"
                v-model="credentials.bankaccount"
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          id="getmymoneybtn"
          block
          :color="config.mcolor"
          :loading="credentials.loading"
          :disabled="
            credentials.loading ||
            points == 0 ||
            !credentials.full_name ||
            !credentials.bankaccount ||
            !checkboxOne ||
            !checkboxTwo
          "
          @click="doRequest"
          v-text="
            $t('Cashback.CASHBACK_REQUEST_BTN') +
            ' (' +
            points +
            ' ' +
            $t('AppScreen.POINTS') +
            ')'
          "
        ></v-btn>
      </v-card-actions>
      <div class="blovly-powered mt-12" align="center">
        <p id="poweredCashbackText">{{ $t("AppScreen.FOOTER_TEXT") }}</p>
        <img
          id="poweredCashbackLogo"
          alt="Vue logo"
          src="../../../assets/blovly-logo.png"
        />
      </div>
      <div id="regulamin">
        <v-checkbox v-model="checkboxOne">
          <template v-slot:label>
            <span
              class="checkboxtext"
              v-html="$t('Cashback.AGREEMENT_LINK', { link: AgreementLink })"
              id="cashback-agreement-label"
            ></span>
          </template>
        </v-checkbox>
        <v-checkbox v-model="checkboxTwo">
          <template v-slot:label>
            <span
              class="checkboxtext"
              v-html="$t('Cashback.PRIVACY_LINK', { link: PrivacyLink })"
              id="cashback-privacy-label"
            ></span>
          </template>
        </v-checkbox>
      </div>
    </v-card>
    <v-layout align-center justify-center v-if="showSuccess" class="mt-12">
      <v-card elevated raised width="350" class="text-center pt-10">
        <v-icon height="150px" size="64" color="green"
          >mdi-check-circle-outline</v-icon
        >
        <v-card-title
          v-text="$t('Cashback.PURCHASE_SUCCESSFUL')"
          class="font-weight-bold justify-center cashback-success-text"
        ></v-card-title>
        <v-card-actions>
          <v-btn
            id="purchasesGoHome"
            block
            :color="config.mcolor"
            class="mt-12"
            v-text="$t('Cashback.GOTO_HOME')"
            @click="navigatehome"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-card>
</template>
<script>
import {
  NO_COMPANY_FOUND,
  REQUEST_SUCCESSFULL,
  CASHBACK_ERROR_SUBMIT,
  CASHBACK_WRONG_BANK_ACCOUNT,
  CASHBACK_WRONG_NAME,
  CASHBACK_WRONG_SUMM,
} from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
import auth from "@/core/auth"
import alert from "@/components/shared/errorAlert"
export default {
  data() {
    return {
      AgreementLink:
        "<a href='https://www.blovly.com/pg-cashback/' class='checkboxlink' target='_blank'>https://www.blovly.com/pg-cashback/</a>",
      PrivacyLink:
        "<a href='https://www.blovly.com/pg-privacy/' class='checkboxlink' target='_blank'>https://www.blovly.com/pg-privacy/</a>",
      userPointsText: "zł",
      tabaddr: "",
      config: {},
      showSuccess: false,
      credentials: {
        full_name: "",
        bankaccount: "",
        errtype: "error",
        errors: "",
        showerror: false,
        loading: false,
      },
      points: 0.0,
      checkboxOne: false,
      checkboxTwo: false,
    }
  },
  created() {
    this.setupLayout()
    this.loadPoints()
  },
  methods: {
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
      }
    },
    /**
     * Submit the user details for purchase
     */
    doRequest() {
      if (!this.checkboxOne || !this.checkboxTwo) {
        this.credentials.showSuccess = false
        this.credentials.errors = "Musíte souhlasit s podmínkami"
        this.credentials.showerror = true
        return
      }
      let isvalid = this.$refs.addrForm.validate()
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      if (isvalid) {
        let token = auth.getAccessToken()
        this.credentials.showerror = false
        this.credentials.loading = true
        let self = this
        api
          .requestCashback(
            token,
            passedCompanyId,
            this.credentials.full_name,
            this.credentials.bankaccount
          )
          .then(function (response) {
            let msg = response.data.message
            if (msg === REQUEST_SUCCESSFULL) {
              self.showSuccess = true
            } else {
              self.showSuccess = false
              self.credentials.errors = self.$t("Errors.FAILED_TO_PURCHASE")
              self.credentials.showerror = true
              self.$refs.addrForm.name.focus()
            }
            self.credentials.loading = false
          })
          .catch(function (error) {
            let errmsg = error.data.message
            if (errmsg === CASHBACK_ERROR_SUBMIT) {
              self.credentials.errors = self.$t("Errors.CASHBACK_ERROR_SUBMIT")
            } else if (errmsg === CASHBACK_WRONG_BANK_ACCOUNT) {
              self.credentials.errors = self.$t(
                "Errors.CASHBACK_WRONG_BANK_ACCOUNT"
              )
            } else if (errmsg === CASHBACK_WRONG_NAME) {
              self.credentials.errors = self.$t("Errors.CASHBACK_WRONG_NAME")
            } else if (errmsg === CASHBACK_WRONG_SUMM) {
              self.credentials.errors = self.$t("Errors.CASHBACK_WRONG_SUMM")
            } else {
              self.credentials.errors = self.$t("Errors.FAILED_TO_PURCHASE")
            }
            self.showSuccess = false
            self.credentials.showerror = true
            self.credentials.loading = false
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
    /** User zipcode mandatory rule */
    purchasezipcoderule(value) {
      if (!value) {
        return this.$t("Errors.ZIPCODE_REQUIRED")
      }
      return true
    },
    /**
     * Navigate tp previous url
     */
    navigate() {
      this.$router.go(-1)
    },
    /**
     * Load the points
     */
    loadPoints() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getCashbackPoints(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          if (response.data) {
            let data = response.data
            this.points = data.cashback_points
          }
        })
        .catch((err) => {
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_FOUND) {
            console.log(err)
          }
        })
    },
    /**
     * Navigate to home page
     */
    navigatehome() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "home",
        query: { company_name: passedCompanyId },
      })
    },
  },
  components: {
    alert,
  },
}
</script>
