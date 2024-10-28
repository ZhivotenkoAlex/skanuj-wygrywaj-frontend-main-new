<template>
  <v-main>
    <div
      style="position: absolute; top: 20px; right: 20px; cursor: pointer"
      onclick="parent.postMessage('close', '*')"
    >
      <v-icon
        large
        color="black"
        style="
          font-size: 25px;
          text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
          color: #fff !important;
        "
        >close</v-icon
      >
    </div>
    <v-container fill-height>
      <v-row justify="center">
        <v-col cols="12" align="center">
          <!--          <h4>Vítat</h4>-->
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" align="center">
          <v-img
            :src="config.layout_login_image"
            width="200px"
            height="auto"
            contain
          ></v-img>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" align="center">
          <h4>Přihlášení...</h4>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import {
  LOGIN_SUCCESS,
  // LOGIN_FAILED,
  // NO_COMPANY_FOUND,
  // COMPANY_URL_IS_REQUIRED,
} from "@/appConstants"
import Vue from "vue"
import loginapi from "@/services/loginapi"
import token from "@/core/auth"
import companyconfig from "@/core/companyconfig"
import fapi from "@/services/fetchapi"
export default {
  data() {
    return {
      login: {
        errors: "",
        showerror: false,
        show1: false,
        loading: false,
      },
      config: {},
    }
  },
  created() {
    this.setupLayout()
    if (token.isLoggedIn()) {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "rules",
        query: { company_name: passedCompanyId },
      })
    } else {
      this.doLogin()
    }
  },
  methods: {
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        Vue.set(this.config, "logo", data.logo_image)
        Vue.set(this.config, "layout_login_image", data.layout_login_image)
        Vue.set(this.config, "loginbg", data.Login_btn_bg)
        Vue.set(this.config, "logincolor", data.Login_btn_color)
        Vue.set(this.config, "cancelbg", data.Cancel_btn_bg)
        Vue.set(this.config, "cancelcolor", data.Cancel_btn_color)
        Vue.set(this.config, "forgotbg", data.Forgot_btn_bg)
        Vue.set(this.config, "forgotcolor", data.Forgot_btn_color)
        Vue.set(this.config, "logintabbg", data.Login_Tab_bg)
        Vue.set(this.config, "logintabcolor", data.Login_Tab_color)
        Vue.set(this.config, "registerbg", data.Register_btn_bg)
        Vue.set(this.config, "registercolor", data.Register_btn_color)
        Vue.set(this.config, "line1", data.login_text_1_line)
        Vue.set(this.config, "line2", data.login_text_2_line)
        // Vue.set(this.dialog, "content", data.company_rules);
        Vue.set(this.config, "mcolor", data.main_color)
        Vue.set(this.config, "mfontcolor", data.main_font_color)
        Vue.set(this.config, "pcolor", data.primary_color)
        Vue.set(this.config, "pfontcolor", data.primary_font_color)
        Vue.set(this.config, "outercolor", data.layout_background_color_outer)
      }
    },
    /** Validate and do the login action */
    doLogin() {
      const passedCompanyId = this.$cn
      const customerToken = this.$token
      this.login.showerror = false
      this.login.loading = true

      let guest_hash = localStorage.getItem("guest_hash")
      if (guest_hash) {
        let googletag =
          typeof window.gtag !== "undefined" ? window.gtag : undefined
        loginapi.setGuestHash(guest_hash, passedCompanyId, googletag)
      }

      loginapi
        .doTokenLogin(customerToken, passedCompanyId)
        .then((response) => {
          let self = this
          let accesstkn = response.data
          let msg = response.data.message
          if (msg === LOGIN_SUCCESS && accesstkn.access_token) {
            token.setTokens(
              accesstkn.access_token,
              accesstkn.refresh_token,
              accesstkn.expiry_second
            )
            if (accesstkn.user_id) {
              const user = {
                user_id: accesstkn.user_id,
                email: accesstkn.email,
              }
              companyconfig.setUser(user, passedCompanyId)
            }
            let lang = this.$i18n.locale
            fapi
              .hasMandatoryRules(accesstkn.access_token, passedCompanyId, lang)
              .then(function (response) {
                // this.setupLayout();
                if (response === true) {
                  self.$router.push({
                    name: "rules",
                    query: { company_name: passedCompanyId },
                  })
                } else {
                  self.$router.push({
                    name: "home",
                    query: { company_name: passedCompanyId },
                  })
                }
                self.login.loading = false
              })
              .catch(() => {
                // this.setupLayout();
                this.$router.push({
                  name: "home",
                  query: { company_name: passedCompanyId },
                })
                this.login.loading = false
              })
          } else {
            // this.login.errors = this.$t("Errors.INCORRECT_TOKEN");
            // this.login.showerror = true;
            this.login.loading = false
          }
        })
        .catch((response) => {
          let msg = response.data.message
          console.log(msg) // Temporary
        })
    },
  },
  components: {},
}
</script>
<style>
.border0px {
  border: 0px solid !important;
}
.v-btn.v-btn--loading .v-btn__loader {
  padding-left: 12%;
  color: green;
}
.v-btn__loader .v-progress-circular {
  height: 15px !important;
  width: 15px !important;
}
.pad2px {
  padding: 0 2px !important;
}

@media screen and (max-width: 768px) {
  .v-btn.v-btn--loading .v-btn__loader {
    padding-left: 30%;
    color: green;
  }
}
</style>
