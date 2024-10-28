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

    <v-card
      class="ma-7 pa-3"
      v-for="notification in notifications"
      :key="notification.id"
    >
      <div class="col-12 p-0 m-0">
        <h4>Zagraj w gre</h4>
        <small class="text-center">
          Masz okazję zagrać w grę i wygrać nagrody. Im więcej punktów, tym
          więcej masz szans.
        </small>
        <div class="ml-3 mr-3 mt-3">
          <v-btn block @click="goGame()"> Zacznij </v-btn>
        </div>
      </div>
    </v-card>

    <v-card
      v-if="isLoaded && notifications.length === 0"
      flat
      class="monster-personal-data"
      style="margin: 20px; border-radius: 20px; padding: 20px"
    >
      <div class="text-center">
        <h3>BRAK ZAREJESTROWANEGO PARAGONU</h3>
        <p class="pt-5">Dodaj więcej paragonów i zdobądź więcej szans.</p>
        <v-btn
          :style="`background-color:${config.mcolor}`"
          @click="navigatehome"
          block
          class="mt-10 modalNotActionBtn"
          id="receipt-action-btn"
        >
          Dodaj paragon
        </v-btn>
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
// import config from "@/variable"

window.$ = window.jQuery = $

export default {
  data() {
    return {
      id: 0,
      task: [],
      config: {},
      token: "",
      image: "",
      imageUrl: "",
      notifications: [],
      isLoaded: false,
      initConfig: {},
    }
  },
  components: {},
  created() {
    this.id = 0
    this.setupLayout()
    this.getNotifications()
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
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "custom_css", data.layout_custom_css)
      }
    },
    /**
     * Load the scoreboard
     * @param {decimal} productprice - Less Expensive product price
     */
    getNotifications() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getNotifications(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          if (response) {
            this.notifications = response.notifications
          }
          this.isLoaded = true
        })
        .catch((err) => {
          console.log(err)
        })
    },
    goGame() {
      // let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      //   window.location.href =
      //     config.baseUrl +
      //     "/game/index?company_name=" +
      //     passedCompanyId +
      //     "&access_token=" +
      //     token
      window.location.href =
        "https://zhivotenkoalex.github.io/fortune-wheel/?" +
        "access_token=" +
        token
    },
  },
  mounted() {
    this.styleTag = document.createElement("style")
    this.styleTag.appendChild(document.createTextNode(this.config.custom_css))
    document.head.appendChild(this.styleTag)
  },
}
</script>
