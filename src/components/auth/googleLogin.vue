<template>
  <g-signin-button
    class="social-icons"
    :params="getGoogleAppId()"
    @success="OnGoogleAuthSuccess"
    @error="OnGoogleAuthFail"
  >
    <a class="social-icon social-icon--google">
      <v-icon large color="white">mdi-google</v-icon>
      <div class="tooltip" style="background: #4385f4">Google</div>
    </a>
  </g-signin-button>
</template>

<script>
import {
  LOGIN_SUCCESS,
  INVALID_ACCESS_TOKEN,
  ACCESS_TOKEN_IS_REQUIRED,
  COMPANY_URL_IS_REQUIRED,
  NO_COMPANY_FOUND,
} from "@/appConstants"
import loginapi from "@/services/loginapi"
import fapi from "@/services/fetchapi"
import token from "@/core/auth"
import companyconfig from "@/core/companyconfig"
import GlobalConfig from "@/variable"
export default {
  data() {
    return {
      googleSignInParams2TI: {
        client_id: GlobalConfig.GOOGLE_LOGIN_APP_2TI_ID,
      },
      googleSignInParamsBlvly: {
        client_id: GlobalConfig.GOOGLE_LOGIN_APP_BLOVLY_ID,
      },
      redirectToFbBot: false,
    }
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
    getGoogleAppId() {
      const companyName = companyconfig.getCompanyIdfromUrl()
      if (
        (companyconfig.getCompanyScheme().partner_company_id > 0 ||
          companyName === "blovly") &&
        companyName !== "galeria-tarnovia-1"
      ) {
        console.log(this.googleSignInParamsBlvly)
        return this.googleSignInParamsBlvly
      } else {
        console.log(this.googleSignInParams2TI)
        return this.googleSignInParams2TI
      }
    },
    /**
     * Callback from Google Api with google user has toekn if authentication is success.
     */
    OnGoogleAuthSuccess(googleUser) {
      // `googleUser` is the GoogleUser object that represents the just-signed-in user.
      // See https://developers.google.com/identity/sign-in/web/reference#users
      //const profile = googleUser.getBasicProfile(); // etc et
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let invitecode = this.$localStorage.get("invitecode_" + passedCompanyId)
      let isLegacyMode = companyconfig.isLegacyMode(passedCompanyId)
      let googletoken = googleUser.getAuthResponse().id_token

      let guest_hash = localStorage.getItem("guest_hash")
      if (guest_hash) {
        let googletag =
          typeof window.gtag !== "undefined" ? window.gtag : undefined
        loginapi.setGuestHash(guest_hash, passedCompanyId, googletag)
      }

      loginapi
        .doGoogleApiLogin(
          googletoken,
          passedCompanyId,
          invitecode,
          isLegacyMode
        )
        .then((response) => {
          console.log(222)
          let msg = response.data.message
          if (msg === LOGIN_SUCCESS && response.data.url) {
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

            // this.goLegacyUrl(response.data.url);
            // return;
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
            this.$emit("showerror", this.$t("Errors.GOOGLELOGIN_ERROR"))
          }
        })
        .catch((response) => {
          console.log(333)
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
    OnGoogleAuthFail(error) {
      //this.$emit("showerror", this.$t("LoginScreen.GOOGLELOGIN_ERROR"));
      console.log("OH NOES", error)
    },
    goLegacyUrl(url) {
      location.href = url
    },
  },
}
</script>
<style>
.ggl-button {
  color: #cd201f;
  cursor: pointer;
}
</style>
