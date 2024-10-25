<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <p
      v-show="!isErrorCompany"
      v-text="$t('Errors.FAILED_TO_LOAD_COMPANY_ISSUE')"
    ></p>
    <p v-show="!isError" v-text="$t('Errors.FAILED_TO_LOAD')"></p>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue"
import api from "@/services/companyapi"
// import fapi from "@/services/fetchapi"
import auth from "@/core/auth.js"
import companyconfig from "@/core/companyconfig"
import config from "@/variable"
import { loadLanguageAsync } from "@/plugins/i18n"
import { useRoute } from "vue-router"

export default {
  setup() {
    const isLoaded = ref(false)
    const isError = ref(false)
    const route = useRoute()
    const isErrorCompany = ref(false)

    const processUrlParams = () => {
      const passedCompanyName = companyconfig.getCompanyIdfromUrl()
      if (route.query.bot_fbhash) {
        companyconfig.setUrlParamToLocalStorage(
          passedCompanyName,
          "bot_fbhash",
          route.query.bot_fbhash
        )
      }

      if (route.query.bot_fbid) {
        companyconfig.setUrlParamToLocalStorage(
          passedCompanyName,
          "bot_fbid",
          route.query.bot_fbid
        )
      }
    }

    const processCompany = () => {
      processUrlParams()
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let isLegacy = false
      if (route.query.legacy) {
        companyconfig.setLoginLegacyMode(passedCompanyId)
        isLegacy = true
      }
      api
        .getCompanyInfo(passedCompanyId, isLegacy)
        .then((result) => {
          companyconfig.setCompanyScheme(result.data, passedCompanyId)
          if (result.data.data.id) {
            localStorage.setItem("company_id", result.data.data.id) //NEEDED FOR "SUPPORTBOARD" CHAT SYNCHRONIZATION
            localStorage.setItem(
              "vuels__2tiCompanyId",
              JSON.stringify({ value: result.data.data.id })
            ) //NEEDED FOR "SUPPORTBOARD" CHAT SYNCHRONIZATION
            localStorage.setItem(
              "vuels__2tiCompanyName",
              JSON.stringify({ value: result.data.data.url_name })
            ) //NEEDED FOR "SUPPORTBOARD" CHAT SYNCHRONIZATION
          }
          isLoaded.value = true
          doRedirect()
        })
        .catch((err) => {
          let msg = err.data.message
          if (msg === "NO_COMPANY_FOUND") {
            isError.value = false
            isErrorCompany.value = true
          } else {
            isError.value = true
            isErrorCompany.value = false
          }
          console.log(err) //redirect to error page no company found
        })
    }

    const checkCompanyChanged = (callback) => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let companyId = companyconfig.getCompanyId()
      if (companyId === "" || passedCompanyId != companyId) {
        companyconfig.resetCompanyLocals(companyId)
        processCompany()
        callback()
      } else {
        callback()
      }
      processCompany()
      callback()
    }

    const doRedirect = () => {
      let islogged = auth.isLoggedIn()
      console.log("🚀 ~ doRedirect ~ islogged:", islogged)
      // let currentroute = route.name
      // let inviteCode = route.query.inviteCode
      // let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      // if (!islogged) {
      //   if (inviteCode) {
      //     router.push({
      //       name: "signup",
      //       query: { company_name: passedCompanyId, inviteCode: inviteCode },
      //     })
      //   } else if (currentroute != "login") {
      //     router.push({
      //       name: "login",
      //       query: { company_name: passedCompanyId },
      //     })
      //   }
      // } else {
      //   if (
      //     currentroute === "welcome" ||
      //     currentroute === "login" ||
      //     currentroute === "signup" ||
      //     currentroute === "forgotpassword"
      //   ) {
      //     let token = auth.getAccessToken()
      //     let lang = this.$i18n.locale
      //     if (fapi.hasAnyRules(token, passedCompanyId, lang)) {
      //       router.push({
      //         name: "rules",
      //         query: { company_name: passedCompanyId },
      //       })
      //     } else {
      //       router.push({
      //         name: "home",
      //         query: { company_name: passedCompanyId },
      //       })
      //     }
      //   } else {
      //     router.push({
      //       name: currentroute,
      //       query: { company_name: passedCompanyId },
      //     })
      //   }
      // }
    }

    const checkAuthenticatedWithConfigLoaded = () => {
      let isConfigLoaded = companyconfig.isCompanySchemeSet()
      let islogged = auth.isLoggedIn()
      if (islogged && isConfigLoaded) {
        doRedirect()
      } else if (!isConfigLoaded) {
        isLoaded.value = true
        processCompany()
      } else if (isConfigLoaded) {
        isLoaded.value = true
        doRedirect()
      }
    }

    const checkValidCompany = () => {
      processUrlParams()
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let isLegacy = false
      if (route.query.legacy) {
        companyconfig.setLoginLegacyMode(passedCompanyId)
        isLegacy = true
      }
      api
        .isValidCompany(passedCompanyId, isLegacy)
        .then((response) => {
          if (response === true) {
            checkCompanyChanged(checkAuthenticatedWithConfigLoaded)
          } else {
            isLoaded.value = true
            isError.value = false
            isErrorCompany.value = true
          }
        })
        .catch(() => {
          isLoaded.value = true
          isError.value = false
          isErrorCompany.value = true
        })
    }

    const checkUrl = (callback) => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      if (passedCompanyId === "") {
        isLoaded.value = true
        isError.value = false
        isErrorCompany.value = true
      } else {
        callback()
      }
    }

    const loadLanguageJSON = (callback) => {
      let lang = auth.getAppLanguage()
      let data = companyconfig.getCompanyScheme()
      let url_name = data.url_name
      if (!url_name) {
        let url_string = window.location.href
        let url = new URL(url_string)
        url_name = url.searchParams.get("company_name")
      }

      loadLanguageAsync(lang, url_name)
        .then(() => {
          callback(checkValidCompany)
        })
        .catch((err) => {
          isLoaded.value = true
          isError.value = false
          console.log(err)
        })
    }

    const appendCompanyCss = () => {
      let ss = document.styleSheets
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let companycss = passedCompanyId + ".css"
      for (let i = 0, max = ss.length; i < max; i++) {
        let href = ss[i].href
        if (href && href.indexOf(companycss) > 0) return
      }
      let file = document.createElement("link")
      file.rel = "stylesheet"
      file.href = config.baseUrl + "company_css/" + passedCompanyId + ".css"
      document.head.appendChild(file)
    }

    onMounted(() => {
      //appendCompanyCss();
      loadLanguageJSON(checkUrl)
    })

    return {
      isLoaded,
      isError,
      isErrorCompany,
      processUrlParams,
      processCompany,
      checkCompanyChanged,
      doRedirect,
      checkAuthenticatedWithConfigLoaded,
      checkValidCompany,
      checkUrl,
      loadLanguageJSON,
      appendCompanyCss,
    }
  },
}
</script>
