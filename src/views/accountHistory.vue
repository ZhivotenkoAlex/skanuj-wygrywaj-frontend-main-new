<template>
  <v-card flat tile :style="`background:#fff0;`">
    <v-toolbar
      dense
      :color="config.mcolor"
      :style="`color:${config.mfontcolor} !important`"
      flat
    >
      <!-- <v-btn
        icon
        class="border0px"
        @click="navigatehome"
        :style="`color:${config.mfontcolor} !important`"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn> -->
      <v-toolbar-title
        v-text="$t('History.HISTORY')"
        style="color: white"
      ></v-toolbar-title>
      <!-- <v-spacer></v-spacer>
      <v-btn
        icon
        class="border0px"
        @click="navigatehome"
        :style="`color:${config.mfontcolor} !important`"
      >
        <v-icon>mdi-home-circle-outline</v-icon>
      </v-btn> -->
    </v-toolbar>

    <v-tabs
      v-model="tab"
      fixed-tabs
      color="blue-grey lighten-3"
      :style="`background-color:${config.innercolor} !important`"
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab
        href="#tab-1"
        :style="`background-color:${config.innercolor} !important;color:white`"
      >
        {{ $t("History.RECEIPTS") }}
        <v-icon>mdi-receipt-text-check</v-icon>
      </v-tab>

      <v-tab
        href="#tab-2"
        :style="`background-color:${config.innercolor} !important;color:white`"
      >
        {{ $t("History.AWARDS") }}
        <v-icon>mdi-gift</v-icon>
      </v-tab>
      <!-- <v-tab href="#tab-3">
        Games
        <v-icon>mdi-gift</v-icon>
      </v-tab> -->
    </v-tabs>

    <v-tabs-items v-model="tab" style="background-color: #fff0 !important">
      <v-tab-item :key="1" :value="'tab-1'">
        <receipts></receipts>
      </v-tab-item>
      <v-tab-item :key="2" :value="'tab-2'">
        <purchases></purchases>
      </v-tab-item>
      <!-- <v-tab-item :key="3" :value="'tab-3'">
        <games></games>
      </v-tab-item> -->
    </v-tabs-items>
  </v-card>
</template>
<script>
import { NO_HISTORY, NO_COMPANY_FOUND } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
import api from "@/services/fetchapi"
import receipts from "../components/history/receiptsComponent.vue"
// import games from "../components/history/gamesComponent"
import purchases from "../components/history/purchasesComponent"

export default {
  data() {
    return {
      default_tab: "tab-1",
      history: [],
      config: {},
      tab: "tab-1",
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
  components: {
    receipts,
    // games,
    purchases,
  },
  mounted() {
    this.setupLayout()
    this.loadHistory()
    this.tab = this.$route.params.tab || this.default_tab
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
        this.$set(this.config, "innercolor", data.layout_background_color_inner)
        this.$set(this.config, "outercolor", data.layout_background_color_outer)
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

<!-- DEFAULT 'BH' COMMENT 
  'LP = Link Posted, 
  LUV = Link Unique View, 
  CE = Contest Entry, 
  CD = Contest Daily Win, 
  CGV = Contest Got Vote , 
  CAV = Contest Add Vote, 
  RE = Registration Entry, 
  RRU = Registration of Reccomended User, 
  RRC = Registration of Reccomented Company, 
  PB = Prestashop Buy, 
  BB = Bill Buy, 
  BBB - Bill Buy Bonus, 
  BH = By Hand, 
  BAP = Bought A Price, 
  UP = Update, 
  S = Survey answered, 
  SV = Survey Viewed, 
  PS = Post Shares, 
  PL = Post Likes, 
  PC = Post Comments, 
  POP = Popup Viewed, 
  PROF = Profile filled in 
  GP = Game Played,
  GW = Game Won,
  RRP = Recomended Registration Partial, 
  BAR = Barcode scanned 
  CARD = card registered, 
  IMG = Image sent, 
  NTF = registered for notifications',
  -->
