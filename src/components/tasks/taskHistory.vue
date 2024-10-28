<template>
  <v-card flat tile>
    <v-card-text v-if="history.length > 0">
      <div v-for="(item, index) in history" :key="index">
        <v-row>
          <v-col cols="4">
            <!--<div
              class="subtitle-2"
              v-if="tasktype === C_INVITE"
              :style="`color:${config.mcolor} !important`"
            >
              {{ getPoints(item.points) }}
            </div>-->
            <div
              class="subtitle-2"
              v-if="tasktype != C_INVITE"
              :style="`color:${config.mfontcolor} !important`"
            >
              {{ getPoints(item.delta) }}
            </div>
            <div
              class="subtitle-2"
              :style="`color:${config.mfontcolor} !important`"
            >
              <span v-text="item.date"></span>
            </div>
          </v-col>
          <v-col cols="8">
            <div class="font-weight-lighter subtitle-2"
                 :style="`color:${config.mfontcolor} !important`">
              <span v-if="tasktype === C_INVITE">
                {{
                  $t("TaskScreen.USER_REGISTERED_WITH_CODE", {
                    user: item.full_name
                  })
                }}
              </span>
              <span v-if="tasktype === C_QR_SCAN">{{
                $t("TaskScreen.QR_SCANNED")
              }}</span>
              <span v-if="tasktype === C_SURVEY">{{
                $t("TaskScreen.SURVEY_FILLED")
              }}</span>
            </div>
          </v-col>
        </v-row>
        <v-divider v-if="index + 1 < history.length"></v-divider>
      </div>
    </v-card-text>
    <v-card-text v-if="history.length == 0">
      <h2
        class="text-center mt-4"
        :style="`color:${config.mfontcolor} !important`"
        v-text="$t('AppScreen.NO_HISTORY_FOUND')"
      ></h2>
    </v-card-text>
  </v-card>
</template>
<script>
import {
  SURVEY,
  INVITE,
  QR_SCAN,
  NO_COMPANY_FOUND,
  NO_INVITE_CODE,
  NO_BARCODE_SCANNED,
  NO_SURVEY_DONE
} from "@/appConstants";
import companyconfig from "@/core/companyconfig";
import api from "@/services/fetchapi";
import auth from "@/core/auth";
export default {
  data() {
    return {
      config: {},
      history: [],
      C_SURVEY: SURVEY,
      C_INVITE: INVITE,
      C_QR_SCAN: QR_SCAN
    };
  },
  props: {
    tasktype: {
      type: String,
      default: INVITE
    },
    taskId: String
  },
  created() {
    this.setupLayout();
    switch (this.tasktype) {
      case INVITE:
        this.getInviteHist();
        break;
      case QR_SCAN:
        this.getBarcodeHist();
        break;
      case SURVEY:
        this.getSurveycodeHist();
        break;
    }
  },
  methods: {
    /**
     * Bind the Labels with points
     */
    getPoints(val) {
      return "+ " + parseInt(val) + " " + this.$t("AppScreen.POINTS");
    },
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme();
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color);
        this.$set(this.config, "mfontcolor", data.main_font_color);
        this.$set(this.config, "pcolor", data.primary_color);
        this.$set(this.config, "pfontcolor", data.primary_font_color);
      }
    },
    /**
     * Get the invite history
     */
    getInviteHist() {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl();
      let token = auth.getAccessToken();
      api
        .getInviteHistory(token, passedCompanyId) //,taskId
        .then(result => {
          let response = result.data;
          if (result.message === NO_INVITE_CODE) {
            console.log("no data");
          } else if (response.data) {
            this.history = response.data;
          }
        })
        .catch(err => {
          let errmsg = err.data.message;
          if (errmsg === NO_COMPANY_FOUND) {
            console.log(err);
          }
        });
    },
    /**
     * Get the Bar code history
     */
    getBarcodeHist() {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl();
      let token = auth.getAccessToken();
      api
        .getBarCodeHistory(token, passedCompanyId) //,taskId
        .then(result => {
          if (result.message === NO_BARCODE_SCANNED) {
            console.log("no data");
          } else {
            let response = result.data;
            if (response.data) {
              this.history = response.data;
            }
          }
        })
        .catch(err => {
          let errmsg = err.data.message;
          if (errmsg === NO_COMPANY_FOUND) {
            console.log(err);
          }
        });
    },
    /**
     * Get the survey history details.
     */
    getSurveycodeHist() {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl();
      let token = auth.getAccessToken();
      api
        .getSurveyHistory(token, passedCompanyId) //,taskId
        .then(result => {
          if (result.message === NO_SURVEY_DONE) {
            console.log("no data");
          } else {
            let response = result.data;
            if (response.data) {
              this.history = response.data;
            }
          }
        })
        .catch(err => {
          let errmsg = err.data.message;
          if (errmsg === NO_COMPANY_FOUND) {
            console.log(err);
          }
        });
    }
  }
};
</script>
<style>
.hidearrows .v-slide-group__prev--disabled {
  display: none !important;
}
</style>
