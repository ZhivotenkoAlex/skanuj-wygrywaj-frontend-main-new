<template>
  <v-card flat tile :style="`background-color:#fff0 !important`">
    <v-toolbar
      dense
      :color="config.mcolor"
      :style="`color:${config.mfontcolor} !important`"
      flat
    >
      <v-toolbar-title
        v-text="$t('AppScreen.RESULTS')"
        style="color: white"
      ></v-toolbar-title>
      <!-- <v-btn
        icon
        class="border0px"
        @click="navigate"
        :style="`color:${config.mfontcolor} !important`"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon
        class="border0px"
        @click="navigatehome"
        :style="`color:${config.mfontcolor}`"
      >
        <v-icon>mdi-home-circle-outline</v-icon>
      </v-btn> -->
    </v-toolbar>
    <!--    <v-card-title id="scan-card-title">-->
    <!--      <v-row>-->
    <!--        <v-col cols="8" md="10">-->
    <!--          <div :style="`color:${config.mfontcolor} !important`" v-text="$t('TaskScreen.SCAN_RECEIPT')"></div>-->
    <!--        </v-col>-->
    <!--        <v-col cols="4" md="2">-->
    <!--          <v-btn-->
    <!--              block-->
    <!--              rounded-->
    <!--              id="receipt-action-btn"-->
    <!--              :style="`color:#fff`"-->
    <!--              @click="console.log('clicked')"-->
    <!--              v-text="$t('TaskScreen.SCAN')"></v-btn>-->
    <!--        </v-col>-->
    <!--      </v-row>-->
    <!--    </v-card-title>-->

    <v-card
      v-if="task"
      max-width="344"
      class="mx-auto pa-3 ma-4"
      style="text-align: center; background: #ffffffb3"
    >
      <h4>
        {{ $t("AppScreen.RESULTS_FOR") }}
        {{ new Date().toISOString().slice(0, 10) }}
      </h4>
      <div v-if="this.userPosition">
        <br />
        <h3>
          {{ $t("AppScreen.RANK") }}: {{ this.userPosition }}
          {{ this.userPoints }}
          {{ $t("AppScreen.POINTS_SHORT") }}
        </h3>
      </div>
      <br />
      <p>{{ $t("AppScreen.ADD_BILL") }}</p>
      <br />
      <v-btn
        block
        id="receipt-action-btn"
        @click="personaldata"
        :style="`background:${config.mcolor}`"
      >
        {{ $t("PersonalData.COMPLETE_DATA") }}
      </v-btn>
      <p class="pt-4">{{ $t("AppScreen.TO_BE_IN_TOUCH") }}</p>
    </v-card>

    <v-card
      v-if="task && results.length > 0"
      max-width="344"
      class="mx-auto pa-3 ma-4 mb-12"
      style="text-align: center"
    >
      <h4>{{ $t("AppScreen.TOP_RESULTS") }}</h4>
      <br />
      <div class="row p-0 m-0">
        <div class="col-6">
          <p style="text-align: left" class="p-0 m-0 mb-0 pl-2">
            <b> {{ $t("PersonalData.NAME") }}</b>
          </p>
        </div>
        <div class="col-6">
          <p style="text-align: right"></p>
        </div>
      </div>
      <div class="row p-0 m-0" v-for="result in results" :key="result.user_id">
        <div class="col-6 p-0 m-0">
          <p style="text-align: left" class="p-0 m-0 mb-0 pl-2">
            <span v-if="selfUserId == result.user_id" style="color: #b2c63a">
              {{
                result.name.length > 0
                  ? result.name
                  : $t("PersonalData.USER") + result.user_id
              }}
            </span>
            <span v-if="selfUserId != result.user_id">
              {{
                result.name.length > 0
                  ? result.name
                  : $t("PersonalData.USER") + result.user_id
              }}
            </span>
          </p>
        </div>
        <div class="col-6 p-0 m-0">
          <p style="text-align: right" class="p-0 m-0 mb-0">
            <span v-if="selfUserId == result.user_id" style="color: #b2c63a">
              {{ result.score }}
            </span>
            <span v-if="selfUserId != result.user_id">
              {{ result.score }}
            </span>
          </p>
        </div>
      </div>
    </v-card>
  </v-card>
</template>
<script>
import $ from "jquery"
import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
// import receipts_api from "@/services/receiptapi";
import auth from "@/core/auth"

window.$ = window.jQuery = $

export default {
  data() {
    return {
      id: 0,
      task: [],
      config: {},
      image: "",
      imageUrl: "",
      userPoints: "",
      userPosition: "",
      results: [],
      selfUserId: 0,
    }
  },
  components: {},
  created() {
    this.id = 0
    this.setupLayout()
    this.getScoreboard()
    this.selfUserId = window.localStorage.getItem("system_user_id")
  },
  methods: {
    /** Navigate to previous url */
    navigate() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "home",
        query: { company_name: passedCompanyId },
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
    /** Navigate to userdata page */
    personaldata() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "personaldata",
        query: { company_name: passedCompanyId },
      })
      this.drawer = false
    },
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "custom_css", data.layout_custom_css)
        this.$set(this.config, "innercolor", data.layout_background_color_inner)
      }
    },
    /**
     * Load the scoreboard
     * @param {decimal} productprice - Less Expensive product price
     */
    getScoreboard() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getScoreboard(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          if (response.data) {
            this.results = response.data.users
            this.userPoints = response.data.userScore
            this.userPosition = response.data.userPosition
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  mounted() {
    this.styleTag = document.createElement("style")
    this.styleTag.appendChild(document.createTextNode(this.config.custom_css))
    document.head.appendChild(this.styleTag)
  },
}
</script>
