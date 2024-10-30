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
      <PageHeader></PageHeader>
      <template v-slot:extension v-if="config.showMenu">
        <v-tabs align-with-title v-model="tab" :color="config.mfontcolor">
          <!-- <v-tabs-slider></v-tabs-slider> -->
          <v-tab @click="navigateHome">Home</v-tab>
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
      :style="`background-color:${config.menuColor};top: 65px`"
    >
      <v-list-item class="px-2 sidebar-title">
        <v-avatar>
          <v-icon style="color: white">mdi-account-circle</v-icon>
        </v-avatar>

        <v-list-item-title id="layoutUserID" style="color: white">
          <!-- {{ $t("AppScreen.USER_ID") + ": " + loggedUser.user_id }} -->
          {{ loggedUser.user_id }}
        </v-list-item-title>

        <v-btn
          variant="flat"
          :color="config.menuColor"
          icon
          @click.stop="drawer = !drawer"
        >
          <v-icon color="white">mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>
      <v-list nav dense v-model:selected="selectedItem">
        <v-list-item value="home">
          <v-list-item-title @click="navigateHome" style="color: white">{{
            $t("AppScreen.CONTEST")
          }}</v-list-item-title>
        </v-list-item>
        <v-list-item value="account">
          <v-list-item-title @click="personalData" style="color: white">{{
            $t("AppScreen.MY_ACCOUNT")
          }}</v-list-item-title>
        </v-list-item>
        <v-list-item value="history">
          <v-list-item-title @click="personalHistory" style="color: white">{{
            $t("AppScreen.HISTORY")
          }}</v-list-item-title>
        </v-list-item>
        <!-- <v-list-item>
            <v-list-item-title @click="receiptUpload" style="color: white"
              >Skanuj</v-list-item-title
            >
          </v-list-item> -->
        <v-list-item value="surveys">
          <v-list-item-title @click="surveys" style="color: white">{{
            $t("AppScreen.SURVEYS")
          }}</v-list-item-title>
        </v-list-item>
        <!-- <v-list-item>
            <v-list-item-title @click="notifications" style="color: white"
              >Gry</v-list-item-title
            >
          </v-list-item> -->
        <v-list-item value="results">
          <v-list-item-title @click="scoreboard" style="color: white">{{
            $t("AppScreen.RESULTS")
          }}</v-list-item-title>
        </v-list-item>
        <v-list-item value="logout">
          <v-list-item-title @click="logout" style="color: white">{{
            $t("AppScreen.LOG_OUT")
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="min-height" :class="$route.name">
      <div class="pa-0 mb-6">
        <router-view></router-view>
      </div>
    </v-main>
    <AppFooter> </AppFooter>
  </v-card>
</template>

<script>
import { ref, onMounted } from "vue"
import companyconfig from "@/core/companyconfig"
import PageHeader from "@/components/home/headerComponent"
import auth from "@/core/auth"
import loginapi from "@/services/loginapi"
import { NO_COMPANY_FOUND, NO_COMPANY_TASK_FOUND } from "@/appConstants"
import api from "@/services/fetchapi"
import AppFooter from "@/components/parts/footerComponent"
import { i18n } from "@/plugins/i18n"
import { useRouter } from "vue-router"

export default {
  components: {
    PageHeader,
    AppFooter,
  },
  setup() {
    const router = useRouter()
    const config = ref({})
    const companyname = ref("")
    const year = ref(0)
    const tab = ref("tab1")
    const drawer = ref(false)
    const loggedUser = ref(false)
    const tasks = ref({})
    const selectedItem = ref(null)
    const navigateHome = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "home",
        query: { company_name: passedCompanyId },
      })
      drawer.value = false
    }

    const notifications = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()

      try {
        router.push({
          name: "notifications",
          query: { company_name: passedCompanyId },
        })
      } catch (error) {
        console.error(error)
      }
      drawer.value = false
    }

    const surveys = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()

      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "page_open",
          value: "notifications",
        })
      }

      router.push({
        name: "surveys",
        query: { company_name: passedCompanyId },
      })
      drawer.value = false
    }

    const receiptUpload = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      for (let i = 0; i < tasks.value?.length; i++) {
        if (tasks.value[i].type === "BILL") {
          router.push({
            name: "receipt",
            params: { id: tasks.value[i].id },
            query: { company_name: passedCompanyId },
          })
        }
      }
    }

    const scoreboard = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()

      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "page_open",
          value: "scoreboard",
        })
      }

      router.push({
        name: "scoreboard",
        query: { company_name: passedCompanyId },
      })
      drawer.value = false
    }

    const personalData = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()

      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "page_open",
          value: "personaldata",
        })
      }

      router.push({
        name: "personaldata",
        query: { company_name: passedCompanyId },
      })
      drawer.value = false
    }

    const personalHistory = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()

      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "page_open",
          value: "personalHistory",
        })
      }

      router.push({
        name: "personalhistory",
        query: { company_name: passedCompanyId },
      })
      drawer.value = false
    }

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      if (data != "") {
        config.value.mcolor = data.main_color
        config.value.layout_has_close = data.layout_has_close
        config.value.mfontcolor = data.main_font_color
        config.value.showMenu = data.showMenu
        config.value.menuColor = data.menu_color
        config.value.menuColorActive = data.menu_color_active
      }
      companyname.value = passedCompanyId
      year.value = new Date().getFullYear()
    }

    const getUser = () => {
      console.log("DEBUG: getUser called in layout")
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let data = companyconfig.getUserScheme(passedCompanyId)
      if (data != "" && data.user_id) {
        loggedUser.value = data
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
              loggedUser.value = user

              //Save for future needs
              companyconfig.setUser(user, passedCompanyId)
              window.localStorage.setItem("system_user_id", response.data.id) //NEEDED FOR "SUPPORTBOARD" CHAT SYNCHRONIZATION
            }
          })
          .catch((response) => {
            console.log(response)
          })
      }
    }

    const logout = () => {
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "authorization",
          value: "logout",
        })
      }

      // Vue.prototype.$token = null
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      companyconfig.resetCompanyLocals(passedCompanyId)
      router.push({
        name: "welcome",
        query: {
          company_name: passedCompanyId,
        },
      })

      auth.clearTokens()
    }

    const closeWidget = () => {
      parent.postMessage("close", "*")
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "home",
        query: { company_name: passedCompanyId },
      })
    }

    const loadTasks = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = i18n.global.locale
      api
        .getTasks(token, passedCompanyId, lang)
        .then((result) => {
          let response = result.data
          tasks.value = response.data
          // this.showTasks = true
        })
        .catch((err) => {
          // this.showTasks = false
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_FOUND) {
            console.log(errormsg)
          } else if (errormsg === NO_COMPANY_TASK_FOUND) {
            console.log(errormsg)
          }
        })
    }

    onMounted(() => {
      console.log("DEBUG: created called in module layout")
      setupLayout()
      loadTasks()
      getUser()
    })

    return {
      config,
      companyname,
      year,
      tab,
      drawer,
      loggedUser,
      tasks,
      selectedItem,
      navigateHome,
      notifications,
      surveys,
      receiptUpload,
      scoreboard,
      personalData,
      personalHistory,
      setupLayout,
      getUser,
      logout,
      closeWidget,
      loadTasks,
    }
  },
}
</script>

<style scoped>
.min-height {
  min-height: 100vh;
  min-height: calc(let(--vh, 1vh) * 100);
}

:deep(.sidebar-title > .v-list-item__content) {
  display: flex !important;
  flex-direction: row;
  align-items: center;
}
</style>
