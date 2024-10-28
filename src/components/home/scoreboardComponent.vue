<template>
  <v-card flat>
    <v-card-text v-if="config.scorecardLayout == 'Default'">
      <v-row dense>
        <v-col cols="12">
          <div class="text-center">
            <div
              class="subtitle-2"
              :style="`color:${config.mfontcolor} !important`"
            >
              {{ $t("AppScreen.YOUR_SCORES") }}
            </div>
          </div>
        </v-col>
        <v-col cols="12">
          <div align="center" justify="center" style="cursor:pointer">
            <div class="text-center mb-5">
              <v-badge
                bordered
                icon="mdi-lock mdi-16px"
                label
                offset-x="40"
                offset-y="40"
              >
                <v-progress-circular
                  rotate="270"
                  size="150"
                  :value="pointspercent"
                  width="3"
                  :color="config.mcolor"
                  @click="showHistory"
                  class="block"
                  style="opacity:0.7"
                >
                  <h3 style="color: black;">{{ $t("AppScreen.BALANCE") }}</h3>
                  <div
                    class="subtitle-1 font-weight-bold"
                    :style="`color:${config.mcolor} !important`"
                  >
                    {{ points }}
                    {{ $t("AppScreen.POINTS") }}
                  </div>
                  <div
                    class="subtitle-2"
                    :style="`color:${config.scolor} !important`"
                  >
                    {{ points }}
                    {{ $t("AppScreen.POINTS") }}
                  </div>
                </v-progress-circular>
                <v-progress-circular
                  rotate="270"
                  size="190"
                  :value="pointspercent"
                  width="3"
                  :color="config.scolor"
                  @click="showHistory"
                  style="margin-left:-170px;opacity:0.7"
                ></v-progress-circular>
              </v-badge>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider></v-divider>
    </v-card-text>
    <v-card-text v-if="config.scorecardLayout == 'PandG'">
      <v-row dense>
        <v-col cols="12">
          <div class="text-center">
            <h1 :style="`color:${config.mfontcolor} !important`">
              {{ $t("AppScreen.YOUR_SCORES") }}
              {{ points }}
              {{ $t("AppScreen.POINTS") }}
            </h1>
          </div>
        </v-col>
      </v-row>
      <v-divider
        class="line"
        :style="`border-color:${config.mfontcolor} !important`"
      ></v-divider>
    </v-card-text>
    <v-card-text v-if="config.scorecardLayout == 'Cococola'">
      <v-row dense>
        <v-col cols="12">
          <div class="text-center">
            <h3 :style="`color:${config.pfontcolor} !important`">
              {{ $t("AppScreen.YOUR_SCORES") }}
            </h3>
            <h1 class="mt-2" :style="`color:${config.mfontcolor}`">
              {{ points }}
              {{ $t("AppScreen.POINTS") }}
            </h1>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { NO_COMPANY_FOUND } from "@/appConstants";
import companyconfig from "@/core/companyconfig";
import api from "@/services/fetchapi";
import auth from "@/core/auth";
export default {
  data() {
    return {
      points: 0,
      pointspercent: 0,
      config: {}
    };
  },
  created() {
    this.setupLayout();
    this.getExpensiveProduct();
  },
  methods: {
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme();
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color);
        this.$set(this.config, "mfontcolor", data.main_font_color);
        this.$set(this.config, "scolor", data.success_color);
        this.$set(this.config, "scorecardLayout", data.scorecardLayout); //Need to add the field in db
      }
    },
    /**
     * Navigate to user history
     */
    showHistory() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl();
      this.$router.push({
        name: "history",
        query: { company_name: passedCompanyId }
      });
    },
    /**
     * Get the less expensive product to calculate the chart values
     */
    getExpensiveProduct() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl();
      let token = auth.getAccessToken();
      api
        .getLessExpensiveProduct(token, passedCompanyId)
        .then(result => {
          let response = result.data;
          if (response.data) {
            let data = response.data;
            this.loadPoints(data);
          }
        })
        .catch(err => {
          this.loadPoints(1);
          let errormsg = err.data.message;
          if (errormsg === NO_COMPANY_FOUND) {
            console.log(err);
          }
        });
    },
    /**
     * Load the points
     * @param {decimal} productprice - Less Expensive product price
     */
    loadPoints(productprice) {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl();
      let token = auth.getAccessToken();
      api
        .getUserAddress(token, passedCompanyId)
        .then(result => {
          let response = result.data;
          if (response.data) {
            let data = response.data;
            this.points = data.points;
            this.pointspercent = parseInt((data.points / productprice) * 100);
          }
        })
        .catch(err => {
          let errormsg = err.data.message;
          if (errormsg === NO_COMPANY_FOUND) {
            console.log(err);
          }
        });
    }
  }
};
</script>
<style>
.block .v-progress-circular__info {
  display: block !important;
}
.block .v-progress-circular__underlay {
  stroke: rgba(185, 188, 191, 0.3);
}
.v-divider.line {
  border-width: 2px;
  margin-top: 10px;
}
</style>
