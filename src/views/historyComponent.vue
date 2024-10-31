<template>
  <v-card flat tile>
    <v-toolbar
      dense
      :color="config.mcolor"
      :style="`color:${config.mfontcolor} !important`"
      flat
    >
      <v-btn
        icon
        class="border0px"
        @click="navigate"
        :style="`color:${config.mfontcolor} !important`"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title v-text="$t('AppScreen.HISTORY')"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        class="border0px"
        @click="navigatehome"
        :style="`color:${config.mfontcolor} !important`"
      >
        <v-icon>mdi-home-circle-outline</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card flat>
      <v-card-text>
        <v-row>
          <v-col class="col-12">
            <v-timeline dense v-if="historyExists">
              <v-timeline-item
                v-for="(hist, index) in history"
                :key="index"
                large
                right
                :color="hist.color"
              >
                <v-card class="elevation-2">
                  <v-card-text>
                    <div
                      :class="`subtitle-2 font-weight-bold green--text`"
                      :style="`color:${hist.mcolor} !important`"
                    >
                      {{ hist.points }}
                    </div>
                    <div
                      :class="`subtitle-1 font-weight-bold`"
                      v-text="hist.type"
                    ></div>
                    <div
                      :class="`caption font-weight-bold`"
                      v-text="hist.date"
                    ></div>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
            <h2
              v-if="!historyExists"
              class="text-center"
              :style="`color:${config.mcolor} !important`"
              v-text="$t('AppScreen.NO_HISTORY_FOUND')"
            ></h2>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-card>
</template>
<script>
import { NO_HISTORY, NO_COMPANY_FOUND } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
import api from "@/services/fetchapi"
export default {
  data() {
    return {
      history: [],
      config: {},
      colors: [
        "cyan",
        "green",
        "purple",
        "amber",
        "pink",
        "teal",
        "indigo",
        "light-green",
        "light-blue",
        "blue-grey",
        "brown",
      ],
      historyExists: false,
    }
  },
  mounted() {
    this.setupLayout()
    this.loadHistory()
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
      }
    },
    /** Navigate to previous url */
    navigate() {
      this.$router.go(-1)
    },
    /** Navigate to home page */
    navigatehome() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "home",
        query: { company_name: passedCompanyId },
      })
    },
    /** Load the user entire history */
    loadHistory() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      //let lang = this.$i18n.locale;
      api
        .getHistory(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          let items = response.data
          let data = []
          if (items.length != 0) {
            items.forEach((item) => {
              let obj = {}
              if (item.points < 0) {
                obj.mcolor = "red"
              } else {
                obj.mcolor = "green"
              }
              obj.points = item.points + " " + this.$t("AppScreen.POINTS")
              obj.type = this.getType(item.type)
              obj.date = item.date
              obj.color =
                this.colors[Math.floor(Math.random() * this.colors.length)]
              data.push(obj)
            })
            this.history = data
            this.historyExists = true
          } else {
            this.historyExists = false
          }
        })
        .catch((err) => {
          this.historyExists = false
          let errmsg = err.data.message
          if (errmsg === NO_HISTORY) {
            console.log(err)
          } else if (errmsg === NO_COMPANY_FOUND) {
            console.log(err)
          }
        })
    },
    /** Get the type of history information which are displayed */
    getType(type) {
      let op = ""
      switch (type) {
        case "S":
          op = this.$t("AppScreen.SURVEY_ANSWERED")
          break
        case "SV":
          op = this.$t("AppScreen.SURVEY_VIEWED")
          break
        case "BAR":
          op = this.$t("AppScreen.BARCODE_SCANNED")
          break
        case "RRU":
          op = this.$t("AppScreen.REGISTRATION_WITH_INVITE_CODE")
          break
        case "BAP":
          op = this.$t("AppScreen.BOUGHT_A_PRICE")
          break
      }
      return op
    },
  },
}

//  S = survey answered
//             SV = survey viewed
//             BAR = barcode scanned
//             RRU = Registration with invitation code
//             BAP = Bought A Price
</script>
