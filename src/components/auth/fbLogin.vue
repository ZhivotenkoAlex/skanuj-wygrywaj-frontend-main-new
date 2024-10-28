<template>
  <fb-signin-button
    :params="fbSignInParams"
    @error="onSignInError"
    @success="onSignInSuccess"
    class="social-icons"
  >
    <a class="social-icon social-icon--facebook">
      <v-icon color="white" large>mdi-facebook</v-icon>
      <div class="tooltip" style="background: #1976d2">Facebook</div>
    </a>
  </fb-signin-button>
</template>
<script>
import {
  LOGIN_SUCCESS,
  INVALID_ACCESS_TOKEN,
  ACCESS_TOKEN_IS_REQUIRED,
  COMPANY_URL_IS_REQUIRED,
  NO_COMPANY_FOUND,
} from "@/appConstants"
import GlobalConfig from "@/variable"
import loginapi from "@/services/loginapi"
import fapi from "@/services/fetchapi"
import token from "@/core/auth"
import companyconfig from "@/core/companyconfig"

export default {
  name: "fbLogin",

  data() {
    return {
      config: {},
      fbSignInParams: {
        scope: "email,public_profile",
        return_scopes: true,
      },
      redirectToFbBot: false,
    }
  },
  mounted() {
    this.initFacebookCore()
  },
  created() {
    let passedCompanyId = companyconfig.getCompanyIdfromUrl()
    let bot_fbhash = companyconfig.getUrlParamFromLocalStorage(
      passedCompanyId,
      "bot_fbhash"
    )
    let bot_fbid = companyconfig.getUrlParamFromLocalStorage(
      passedCompanyId,
      "bot_fbid"
    )
    if (bot_fbhash && bot_fbid) {
      this.redirectToFbBot = true
    }
  },
  methods: {
    async initFacebookCore() {
      await this.loadFacebookSDK(document, "script", "facebook-jssdk")
      await this.initFacebook()
    },
    async initFacebook() {
      window.fbAsyncInit = function () {
        let facebookAppId
        const companyName = companyconfig.getCompanyIdfromUrl()
        if (
          (companyconfig.getCompanyScheme().partner_company_id > 0 ||
            companyName === "blovly") &&
          companyName !== "galeria-tarnovia-1"
        ) {
          facebookAppId = GlobalConfig.FB_LOGIN_APP_BLOVLY_ID
        } else {
          facebookAppId = GlobalConfig.FB_LOGIN_APP_2TI_ID
        }

        console.log("FBID:" + facebookAppId)

        window.FB.init({
          appId: facebookAppId,
          cookie: true, // enable cookies to allow the server to access the session
          xfbml: true,
          version: "v13.0",
        })
      }
    },
    async loadFacebookSDK(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = "https://connect.facebook.net/en_US/sdk.js"
      fjs.parentNode.insertBefore(js, fjs)
    },
    /**
     * Sign in call back from FB API with response as login response.
     */
    onSignInSuccess(response) {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let invitecode = this.$localStorage.get("invitecode_" + passedCompanyId)
      let isLegacyMode = companyconfig.isLegacyMode(passedCompanyId)
      let data = response.authResponse

      let guest_hash = localStorage.getItem("guest_hash")
      if (guest_hash) {
        let googletag =
          typeof window.gtag !== "undefined" ? window.gtag : undefined
        loginapi.setGuestHash(guest_hash, passedCompanyId, googletag)
      }

      loginapi
        .dofbApiLogin(
          data.accessToken,
          passedCompanyId,
          invitecode,
          isLegacyMode
        )
        .then((response) => {
          let msg = response.data.message

          //Track FB SignUp Event
          if (window.fbq && typeof window.fbq !== "undefined") {
            window.fbq("track", "CompleteRegistration")
          }

          if (msg === LOGIN_SUCCESS && response.data.url) {
            if (this.redirectToFbBot) {
              console.log(">>>FB LOGIN 2")
              companyconfig.goToFbBotLogin(passedCompanyId, response.data.url)
              return
            }
            if (isLegacyMode) {
              this.goLegacyUrl(response.data.url)
              return
            }
          }

          let accesstkn = response.data
          if (accesstkn.token) {
            token.setTokens(
              accesstkn.token,
              accesstkn.refresh_token,
              accesstkn.expiry_second
            )
            let lang = this.$i18n.locale
            fapi
              .hasMandatoryRules(accesstkn.token, passedCompanyId, lang)
              .then(function (response) {
                if (response === true) {
                  this.$router.push({
                    name: "rules",
                    query: { company_name: passedCompanyId },
                  })
                } else {
                  this.$router.push({
                    name: "home",
                    query: { company_name: passedCompanyId },
                  })
                }
              })
              .catch(() => {
                this.$router.push({
                  name: "home",
                  query: { company_name: passedCompanyId },
                })
              })
          } else {
            this.$emit("showerror", this.$t("Errors.FBLOGIN_ERROR"))
          }
        })
        .catch((response) => {
          let errormsg = response.data.error
          if (
            errormsg.facebook &&
            errormsg.facebook[0] === INVALID_ACCESS_TOKEN
          ) {
            this.$emit("showerror", this.$t("Errors.INVALID_ACCESS_TOKEN"))
          } else if (
            errormsg.access_token &&
            errormsg.access_token[0] === ACCESS_TOKEN_IS_REQUIRED
          ) {
            this.$emit("showerror", this.$t("Errors.ACCESS_TOKEN_IS_REQUIRED"))
          } else if (
            errormsg.url_name &&
            errormsg.url_name[0] === COMPANY_URL_IS_REQUIRED
          ) {
            this.$emit("showerror", this.$t("Errors.COMPANY_URL_IS_REQUIRED"))
          } else if (
            errormsg.url_name &&
            errormsg.url_name[0] === NO_COMPANY_FOUND
          ) {
            this.$emit("showerror", this.$t("Errors.NO_COMPANY_FOUND"))
          }
        })
      this.$localStorage.remove("invitecode_" + passedCompanyId)
    },
    onSignInError(error) {
      console.log("OH NOES", error)
      this.$emit("showerror", this.$t("LoginScreen.FBLOGIN_ERROR"))
    },
    goLegacyUrl(url) {
      location.href = url
    },
  },
}
</script>
