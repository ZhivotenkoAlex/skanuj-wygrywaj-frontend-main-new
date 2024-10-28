<template>
  <v-app v-scroll="onScroll" style="margin: 0 auto; max-width: 750px">
    <router-view
      :style="`background-image:url(${config.loginImage}) !important;background-color:${config.innercolor};background-attachment: fixed;background-position-x:center; background-size: cover;`"
    ></router-view>
    <v-fab-transition>
      <v-btn
        color="blue darken-3"
        dark
        fab
        fixed
        bottom
        :right="showFabRight"
        :left="!showFabRight"
        v-show="showFab"
        @click="$vuetify.goTo('#app', { duration: 500, offset: 0 })"
      >
        <v-icon>keyboard_arrow_up</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-app>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, reactive } from "vue"
import { useRouter } from "vue-router"
import { INVALID_REFRESH_TOKEN } from "@/appConstants"
import auth from "@/core/auth"
import companyconfig from "@/core/companyconfig"
import { loadedLanguages } from "@/plugins/i18n"
import api from "@/services/loginapi"
import fetchapi from "./services/fetchapi"
import { loadLanguageAsync } from "@/plugins/i18n"

export default {
  name: "App",
  setup() {
    const router = useRouter()
    const timer = ref(null)
    const offsetTop = ref(0)
    const showFab = ref(false)
    const config = reactive({})
    const showFabRight = ref(false)

    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // const token = urlParams.get("token");
    // const companyName = urlParams.get("company_name");

    const onScroll = (e) => {
      offsetTop.value =
        e.target.documentElement.scrollTop || e.currentTarget.scrollY
      if (offsetTop.value > 100) {
        // Krystian asked to disable FAB icon... so I just commenting out it now, I know that in some time he will request it back again.... do not thank:)
        // showFab.value = true;
      } else {
        showFab.value = false
      }
    }

    const fetchRefreshToken = () => {
      if (auth.isLoggedIn() && auth.isTokenExpired()) {
        let rToken = auth.getIdToken()
        return api
          .doRefreshToken(rToken)
          .then((success) => {
            let data = success.data
            if (success.message === INVALID_REFRESH_TOKEN) {
              navigateToWelcome()
            } else if (data) {
              auth.setTokens(data.token, data.refresh_token, data.expiry_second)
              settimer(5000)
            }
          })
          .catch((error) => {
            console.error("Refresh login error: ", error)
            navigateToWelcome()
          })
      }

      settimer(5000)
    }

    const cancelAutoUpdate = () => {
      clearTimeout(timer.value)
    }

    const settimer = (mlsec) => {
      timer.value = setTimeout(() => {
        fetchRefreshToken()
      }, mlsec)
    }

    const navigateToWelcome = () => {
      auth.clearTokens()
      clearTimeout(timer.value)
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "welcome",
        query: { company_name: passedCompanyId },
      })
    }

    const loadMessagesOnScreenRefresh = () => {
      if (loadedLanguages.length === 0) {
        let lang = auth.getAppLanguage()
        let data = companyconfig.getCompanyScheme()

        let url_name = data.url_name
        if (!url_name) {
          let url_string = window.location.href
          let url = new URL(url_string)
          url_name = url.searchParams.get("company_name")
        }
        loadLanguageAsync(lang, url_name).then(() => {})
      }
    }

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        showFabRight.value = data.taskfabposition == "left"

        if (data.layout_font_url && data.layout_font_font_type) {
          applyCustomFont(data.layout_font_url, data.layout_font_font_type)
        }

        config.outercolor = data.layout_background_color_outer
        config.innercolor = data.layout_background_color_inner
        config.loginImage = data.layout_login_image
        if (data.layout_custom_js != "") {
          var new_script = document.createElement("script")
          new_script.appendChild(data.layout_custom_js)
          document.body.appendChild(new_script)
        }
      }
    }

    const fetchCompany = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      fetchapi.getCompanyInfo(passedCompanyId, false).then((response) => {
        let data = response.data
        if (data) {
          companyconfig.setCompanyScheme(data, passedCompanyId)
          setupLayout()
        }
      })
    }

    const saveGuestHash = () => {
      var url = window.location.href
      var captured = /guest_hash=([^&]+)/.exec(url)
      var result = captured ? captured[1] : false
      if (result) {
        localStorage.setItem("guest_hash", result)
      }
    }

    const applyCustomFont = (url, family) => {
      const style = document.createElement("style")
      style.innerHTML = `
        @import url('${url}');

        body, .v-application, .tooltip, .button_title, .v-application .text-h5 {
            font-family: '${family}', sans-serif !important;
          }
      `
      document.head.appendChild(style)
    }

    const get_top_domain = () => {
      var i,
        h,
        weird_cookie = "weird_get_top_level_domain=cookie",
        hostname = document.location.hostname.split(".")
      for (i = hostname.length - 1; i >= 0; i--) {
        h = hostname.slice(i).join(".")
        document.cookie = weird_cookie + ";domain=." + h + ";"
        if (document.cookie.indexOf(weird_cookie) > -1) {
          // We were able to store a cookie! This must be it
          document.cookie =
            weird_cookie.split("=")[0] +
            "=;domain=." +
            h +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT;"
          return h
        }
      }
    }

    onMounted(() => {
      document.domain = get_top_domain()
      fetchCompany()
      loadMessagesOnScreenRefresh()
      settimer(5000)
      setupLayout()
      saveGuestHash()
    })

    onBeforeUnmount(() => {
      cancelAutoUpdate()
    })

    return {
      onScroll,
      showFab,
      showFabRight,
      config,
    }
  },
}
</script>
