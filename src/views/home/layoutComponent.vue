<template>
  <v-card flat tile>
    <v-app-bar
      app
      absolute
      dense
      flat
      elevate-on-scroll
      :color="config.mcolor"
      :style="`color:${config.mfontcolor} !important`"
    >
      <v-app-bar-nav-icon
        class="border0px"
        style="color: white"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <pageheader></pageheader>
      <template v-slot:extension v-if="config.showMenu">
        <v-tabs align-with-title v-model="tab" :color="config.mfontcolor">
          <v-tabs-slider></v-tabs-slider>
          <v-tab @click="navigatehome">Home</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <span
      id="close-widget-btn"
      @click="closeWidget()"
      v-if="config.layout_has_close"
    >
      <v-icon style="color: #fff">mdi-close</v-icon>
    </span>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      :style="`background-color:${config.menuColor};top: 0px`"
    >
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-icon style="color: white">mdi-account-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-title id="layoutUserID" style="color: white">
          {{ $t("AppScreen.USER_ID") + ": " + loggedUser.user_id }}
        </v-list-item-title>

        <v-btn icon @click.stop="drawer = !drawer">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item>
            <v-list-item-title @click="navigatehome" style="color: white">{{
              $t("AppScreen.CONTEST")
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="personaldata" style="color: white">{{
              $t("AppScreen.MY_ACCOUNT")
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="personalHistory" style="color: white">{{
              $t("AppScreen.HISTORY")
            }}</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item>
            <v-list-item-title @click="receiptUpload" style="color: white"
              >Skanuj</v-list-item-title
            >
          </v-list-item> -->
          <v-list-item>
            <v-list-item-title @click="surveys" style="color: white">{{
              $t("AppScreen.SURVEYS")
            }}</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item>
            <v-list-item-title @click="notifications" style="color: white"
              >Gry</v-list-item-title
            >
          </v-list-item> -->
          <v-list-item>
            <v-list-item-title @click="scoreboard" style="color: white">{{
              $t("AppScreen.RESULTS")
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="logout" style="color: white">{{
              $t("AppScreen.LOG_OUT")
            }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main class="min-height" :class="this.$route.name">
      <div class="pa-0 mb-6">
        <router-view></router-view>
      </div>
    </v-main>
    <AppFooter> </AppFooter>
  </v-card>
</template>

<script>
import companyconfig from "@/core/companyconfig"
import pageheader from "@/components/home/headerComponent"
import auth from "@/core/auth"
import Vue from "vue"
import loginapi from "@/services/loginapi"
import { NO_COMPANY_FOUND, NO_COMPANY_TASK_FOUND } from "@/appConstants"
import api from "@/services/fetchapi"
import AppFooter from "@/components/parts/footerComponent"
// import {NO_COMPANY_FOUND, PASSWORD_RESET_SUCCESS, SMS_SENT} from "@/appConstants";
export default {
  data() {
    return {
      config: {},
      companyname: "",
      year: 0,
      tab: "tab1",
      drawer: false,
      loggedUser: false,
      tasks: {},
    }
  },
  created() {
    console.log("DEBUG: created called in module layout")
    this.setupLayout()
    this.loadtasks()
    this.getUser()
  },
  computed: {
    menuItems() {
      let menuItems = [{ icon: "lock_open", title: "Home", link: "/Logout" }]
      return menuItems
    },
  },
  components: {
    pageheader,
    AppFooter,
  },
  methods: {
    /** Navigate to home page */
    navigatehome() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "home",
        query: { company_name: passedCompanyId },
      })
      this.drawer = false
    },

    /** Navigate to notifications page */
    notifications() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()

      try {
        this.$router.push({
          name: "notifications",
          query: { company_name: passedCompanyId },
        })
      } catch (error) {
        console.error(error)
      }
      this.drawer = false
    },

    /** Navigate to survey page */
    surveys() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()

      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "page_open",
          value: "notifications",
        })
      }

      this.$router.push({
        name: "surveys",
        query: { company_name: passedCompanyId },
      })
      this.drawer = false
    },

    receiptUpload() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      for (let i = 0; i < this.tasks?.length; i++) {
        if (this.tasks[i].type === "BILL") {
          this.$router.push({
            name: "receipt",
            params: { id: this.tasks[i].id },
            query: { company_name: passedCompanyId },
          })
        }
      }
    },
    /** Navigate to scoreboard page */
    scoreboard() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()

      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "page_open",
          value: "scoreboard",
        })
      }

      this.$router.push({
        name: "scoreboard",
        query: { company_name: passedCompanyId },
      })
      this.drawer = false
    },
    /** Navigate to userdata page */
    personaldata() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()

      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "page_open",
          value: "personaldata",
        })
      }

      this.$router.push({
        name: "personaldata",
        query: { company_name: passedCompanyId },
      })
      this.drawer = false
    },
    personalHistory() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()

      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "page_open",
          value: "personalHistory",
        })
      }

      this.$router.push({
        name: "personalhistory",
        query: { company_name: passedCompanyId },
      })
      this.drawer = false
    },
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "layout_has_close", data.layout_has_close)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "showMenu", data.showMenu)
        this.$set(this.config, "menuColor", data.menu_color)
        this.$set(this.config, "menuColorActive", data.menu_color_active)
      }
      this.companyname = passedCompanyId
      this.year = new Date().getFullYear()
    },
    /*
    sendRegistrationEventGtag () {
      if (typeof window.gtag != 'function') {
        setTimeout(this.sendRegistrationEventGtag, 200);
        return;
      }
      window.gtag('event', 'conversion', {'send_to': 'AW-298953983/U1FTCLTc-qMDEP_Zxo4B'});
    },*/
    getUser() {
      console.log("DEBUG: getUser called in layout")
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let data = companyconfig.getUserScheme(passedCompanyId)
      if (data != "" && data.user_id) {
        this.loggedUser = data
        window.localStorage.setItem("system_user_id", data.user_id) //NEEDED FOR "SUPPORTBOARD" CHAT SYNCHRONIZATION
      } else {
        loginapi
          .getUser(auth.getIdToken(), passedCompanyId)
          .then((response) => {
            if (response.data.id) {
              const user = {
                user_id: response.data.id,
                email: response.data.email,
              }
              if (
                typeof response.data.first != "undefined" &&
                response.data.first == "1"
              ) {
                this.endRegistrationEventGtag()
              }
              this.loggedUser = user

              //Save for future needs
              companyconfig.setUser(user, passedCompanyId)
              window.localStorage.setItem("system_user_id", response.data.id) //NEEDED FOR "SUPPORTBOARD" CHAT SYNCHRONIZATION
            }
          })
          .catch((response) => {
            console.log(response)
          })
      }
    },
    /** Logout the user. */
    logout() {
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "authorization",
          value: "logout",
        })
      }

      Vue.prototype.$token = null
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      companyconfig.resetCompanyLocals(passedCompanyId)
      this.$router.push({
        name: "welcome",
        query: {
          company_name: passedCompanyId,
        },
      })

      auth.clearTokens()
    },
    closeWidget() {
      parent.postMessage("close", "*")
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "home",
        query: { company_name: passedCompanyId },
      })
    },
    loadtasks() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = this.$i18n.locale
      api
        .getTasks(token, passedCompanyId, lang)
        .then((result) => {
          let response = result.data
          this.tasks = response.data
          this.showTasks = true
        })
        .catch((err) => {
          this.showTasks = false
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_FOUND) {
            console.log(errormsg)
          } else if (errormsg === NO_COMPANY_TASK_FOUND) {
            console.log(errormsg)
          }
        })
    },
  },
}
</script>
<style>
.min-height {
  min-height: 100vh;
  min-height: calc(let(--vh, 1vh) * 100);
}
</style>
