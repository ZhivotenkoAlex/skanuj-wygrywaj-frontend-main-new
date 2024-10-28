<template>
  <v-card flat>
    <v-row>
      <v-col class="col-8">
        <div
          class="title 2take"
          id="cashbackTitle"
          :style="`color:${config.mfontcolor}`"
        >
          {{ $t("AppScreen.CASHBACK_TITLE") }}
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-2" id="wallet-img-col">
        <img src="../../assets/images/cashback/wallet.png" id="wallet-img" />
      </v-col>
      <v-col class="col-10">
        <div id="cashback-content">
          {{ $t("AppScreen.YOUR_SCORES") }}
          <p id="user-points">
            {{ points }}&nbsp;<span id="user-points-currency">{{
              $t("AppScreen.POINTS")
            }}</span>
          </p>
          <v-btn
            block
            rounded
            id="casback-btn"
            :style="`color:${config.mfontcolor}`"
            :color="config.mcolor"
            @click="goToCashback"
            v-text="$t('Cashback.CASHBACK_REQUEST_BTN')"
            :disabled="points == 0"
          ></v-btn>
        </div>
      </v-col>
    </v-row>
    <div class="blovly-powered" align="center">
      <p id="poweredCashbackText">{{ $t("AppScreen.FOOTER_TEXT") }}</p>
      <img
        id="poweredCashbackLogo"
        alt="Vue logo"
        src="../../assets/blovly-logo.png"
      />
    </div>
  </v-card>
</template>

<script>
import { NO_COMPANY_FOUND } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
import auth from "@/core/auth"
export default {
  data() {
    return {
      points: 0.0,
      pointspercent: 0,
      config: {},
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
        this.$set(this.config, "scolor", data.success_color)
        this.$set(this.config, "scorecardLayout", data.scorecardLayout) //Need to add the field in db
      }
    },
    /**
     * Load the points
     * @param {decimal} productprice - Less Expensive product price
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
            if (
              data.cashback_points !== undefined ||
              data.cashback_points !== null
            ) {
              this.points = data.cashback_points
            }
          }
        })
        .catch((err) => {
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_FOUND) {
            console.log(err)
          }
        })
    },
    goToCashback() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "cashback",
        query: { company_name: passedCompanyId },
      })
    },
  },
}
</script>
<style>
.test {
  color: #0c5460;
}
</style>
