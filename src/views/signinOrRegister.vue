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
    <v-container>
      <v-row justify="center">
        <v-col cols="12" align="center" :style="`padding-top:5px`">
          <v-img :src="config.login_logo" contain id="login-logo"></v-img>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" align="center" :style="`padding-top:5px;`">
          <h4
            class="config-line-1"
            :style="`color:${config.mfontcolor} !important`"
            v-html="`${config.line1}`"
          ></h4>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" align="center">
          <v-img
            :src="config.login_pic"
            id="login-pic"
            height="auto"
            contain
          ></v-img>
        </v-col>
      </v-row>
      <v-row justify="center" class="monster-billet-row">
        <div class="monster-billet-row-inner">
          <v-col cols="12" align="center">
            <h4
              :style="`color:${config.mfontcolor} !important`"
              v-html="`${config.line2}`"
            ></h4>
          </v-col>
        </div>
      </v-row>

      <v-row justify="center">
        <v-btn
          data-test="back-button"
          text
          class="border0px pad2px"
          small
          :color="config.mcolor"
          :style="`color:white!important; font-size: 15px;margin-top: 15px;background:${config.mcolor}`"
          @click="dosociallogin"
        >
          <v-icon :style="`font-size: 16px;color:white;`"
            >mdi-arrow-left</v-icon
          >
          {{ $t("LoginScreen.BACK_BTN") }}
        </v-btn>

        <v-col cols="12" align="center" justify="center">
          <v-card class="monster-login-panel">
            <v-tabs
              v-model="tab"
              :color="config.mfontcolor"
              height="60px"
              centered
              fixed-tabs
              @change="resetforms"
            >
              <v-tab
                href="#tab-login"
                data-test="login-tab"
                ripple
                v-text="$t('LoginScreen.LOGIN')"
                class="monster-login-using"
                :style="`background: ${config.mcolor}`"
              ></v-tab>
              <v-tab
                href="#tab-reg"
                data-test="reg-tab"
                ripple
                v-text="$t('LoginScreen.REGISTER')"
                class="monster-login-using"
                :style="`background: ${config.mcolor}`"
              ></v-tab>
              <v-tab-item :key="1" :value="'tab-login'">
                <v-card
                  elevation="n-7"
                  class="monster-login-panel"
                  :style="`background-color:${config.mcolor}`"
                >
                  <v-card-text :style="`background-color:#fff9`">
                    <v-row>
                      <v-col cols="12" sm12 md12>
                        <v-form v-model="login.valid" ref="loginform">
                          <alert
                            :errorMessage="login.errors"
                            :alert="login.showerror"
                          ></alert>

                          <v-text-field
                            solo
                            data-test="login-email"
                            :placeholder="$t('LoginScreen.EMAIL')"
                            name="loginemail"
                            prepend-icon="person"
                            type="text"
                            v-model="login.email"
                            autocomplete="off"
                            :rules="[
                              (value) => {
                                return usernamerule(value)
                              },
                            ]"
                          ></v-text-field>

                          <v-text-field
                            solo
                            data-test="login-password"
                            id="loginpassword"
                            :placeholder="$t('LoginScreen.PASSWORD')"
                            name="loginpassword"
                            prepend-icon="lock"
                            @click:append="login.show1 = !login.show1"
                            :type="login.show1 ? 'text' : 'password'"
                            v-model="login.password"
                            :rules="[
                              (value) => {
                                return passwordrule(value)
                              },
                            ]"
                          ></v-text-field>
                          <v-row>
                            <v-col cols="12">
                              <v-btn
                                block
                                data-test="login-button"
                                class="loginbtn login-form-btn"
                                :style="`color:#fff;background:${config.mcolor}`"
                                @click="doLogin"
                                :loading="login.loading"
                                :disabled="login.loading"
                                v-text="$t('LoginScreen.LOGIN_BTN')"
                              ></v-btn>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions :style="`background-color:#fff9`">
                    <v-btn
                      text
                      small
                      data-test="forgot-password-button"
                      class="border0px pad2px login-form-btn"
                      :color="config.forgotcolor"
                      :style="`color:#fff;background-color:${config.forgotbg};width: 100%`"
                      v-text="$t('LoginScreen.FORGOT_PASSWORD')"
                      @click="changepassword"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
              <v-tab-item :key="2" :value="'tab-reg'">
                <v-card
                  class="monster-login-panel"
                  :style="`background:${config.innercolor} !important`"
                >
                  <v-card-text :style="`background-color:#fff9`">
                    <v-row>
                      <v-col xs12>
                        <v-form v-model="register.valid" ref="registerform">
                          <alert
                            :errorType="register.errType"
                            :errorMessage="register.errors"
                            :alert="register.showerror"
                          ></alert>

                          <v-text-field
                            solo
                            data-test="reg-name"
                            id="regpassword"
                            :placeholder="$t('LoginScreen.NAME')"
                            name="regfullname"
                            prepend-icon="person"
                            type="text"
                            autocomplete="off"
                            v-model="register.fullname"
                            :rules="[
                              (value) => {
                                return regfullnamerule(value)
                              },
                            ]"
                          ></v-text-field>
                          <v-text-field
                            solo
                            data-test="reg-email"
                            :placeholder="$t('LoginScreen.EMAIL')"
                            name="registerusername"
                            prepend-icon="email"
                            type="text"
                            v-model="register.username"
                            autocomplete="off"
                            :rules="[
                              (value) => {
                                return registerusernamerule(value)
                              },
                            ]"
                          ></v-text-field>

                          <v-text-field
                            data-test="reg-password"
                            v-if="isDirectPasswordRegistration()"
                            solo
                            :placeholder="$t('LoginScreen.PASSWORD')"
                            name="registerusername"
                            prepend-icon="lock"
                            v-model="register.password"
                            autocomplete="off"
                            :append-icon="
                              login.show1 ? 'visibility' : 'visibility_off'
                            "
                            @click:append="login.show1 = !login.show1"
                            :type="login.show1 ? 'text' : 'password'"
                            :rules="[
                              (value) => {
                                return passwordrule(value)
                              },
                            ]"
                          ></v-text-field>

                          <v-text-field
                            solo
                            data-test="reg-invitation-code"
                            id="logininvitecode"
                            :placeholder="$t('LoginScreen.INVITECODE')"
                            name="logininvitecode"
                            prepend-icon="share"
                            type="text"
                            autocomplete="off"
                            v-model="register.invitecode"
                          ></v-text-field>

                          <v-checkbox
                            dense
                            data-test="reg-agreement"
                            class="mx-3 regulamin-checkbox"
                            v-model="register.agree"
                            :rules="[
                              (value) => {
                                return registerAgreerule(value)
                              },
                            ]"
                          >
                            <template v-slot:label>
                              <div class="condition">
                                <span
                                  v-text="$t('LoginScreen.IAGREE')"
                                  :style="`color:${config.mfontcolor} !important`"
                                ></span>
                                <a
                                  class="regulamin-link"
                                  :style="`color:${config.mfontcolor}!important`"
                                  v-text="$t('LoginScreen.TERMS')"
                                  @click="showRulesDialog"
                                >
                                </a>
                              </div>
                            </template>
                          </v-checkbox>
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions :style="`background-color:#fff9`">
                    <v-btn
                      class="login-form-btn"
                      block
                      :style="`color:#fff;background:${config.mcolor}`"
                      @click="doRegister"
                      v-text="$t('LoginScreen.REGISTER')"
                      :loading="register.loading"
                      :disabled="register.loading"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog.show" content-class="rules-dialog" fullscreen>
        <v-card :style="`background: transparent;`">
          <v-toolbar :style="`background:${config.mcolor} !important`">
            <v-btn icon dark @click="dialog.show = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title
              :style="`color:#fff;`"
              v-text="$t('LoginScreen.RULES_TITLE')"
            ></v-toolbar-title>
          </v-toolbar>
          <v-card-text
            :style="`color:${config.mfontcolor};background: #ffffffb3;margin-top:10px;`"
            v-html="dialog.content"
          ></v-card-text>
          <v-divider></v-divider>
          <v-card-actions :style="`background: #ffffffb3;`">
            <v-spacer></v-spacer>
            <v-btn
              :color="config.pcolor"
              :style="`color:white !important;background:${config.mcolor}`"
              text
              @click="agreeRules"
              v-text="$t('LoginScreen.ACCEPT_BTN')"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <AppFooter> </AppFooter>
  </v-main>
</template>

<script>
import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  INCORRECT_EMAIL_FORMAT,
  PASSWORD_IS_REQUIRED,
  INCORRECT_EMAIL_OR_PASSWORD,
  CREATED_ACCOUNT_SUCCESSFULLY,
  UNABLE_TO_CREATE_ACCOUNT,
  NO_COMPANY_FOUND,
  COMPANY_URL_IS_REQUIRED,
  EMAIL_IS_REQUIRED,
  NAME_IS_REQUIRED,
  ACCOUNT_ALREADY_EXISTS,
} from "@/appConstants"
import Vue from "vue"
import loginapi from "@/services/loginapi"
import fapi from "@/services/fetchapi"
import token from "@/core/auth"
import companyconfig from "@/core/companyconfig"
import alert from "@/components/shared/errorAlert"
import AppFooter from "@/components/parts/footerComponent"
export default {
  data() {
    return {
      default_tab: "tab-login",
      tab: "tab-login",
      login: {
        valid: true,
        email: "",
        password: "",
        invitecode: "",
        errors: "",
        showerror: false,
        show1: false,
        loading: false,
      },
      config: {},
      //pconfig: {},
      register: {
        password: "",
        valid: true,
        username: "",
        fullname: "",
        invitecode: this.$route.query.inviteCode ?? "",
        errors: "",
        showerror: false,
        agree: true,
        errType: "error",
        loading: false,
      },
      dialog: {
        show: false,
        content: "",
      },
      showsocialLogin: true,
      redirectToFbBot: false,
    }
  },
  created() {
    this.setupLayout()
    let passedCompanyId = companyconfig.getCompanyIdfromUrl()
    if (token.isLoggedIn()) {
      this.$router.push({
        name: "rules",
        query: { company_name: passedCompanyId },
      })
    }

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

  mounted() {
    this.styleTag = document.createElement("style")
    this.styleTag.appendChild(document.createTextNode(this.config.custom_css))
    document.head.appendChild(this.styleTag)
    this.tab = this.$route.query.inviteCode ? "tab-reg" : this.default_tab
  },

  methods: {
    /** Show the Rules dialod on clicking the agree button */
    showRulesDialog() {
      this.dialog.show = true
    },
    /** Agree the rules */
    agreeRules() {
      this.dialog.show = false
      this.register.agree = true
    },
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
        Vue.set(
          this.config,
          "forgotbg",
          data.Forgot_btn_bg ? data.Forgot_btn_bg : "#808080"
        )
        Vue.set(this.config, "forgotcolor", data.Forgot_btn_color)
        Vue.set(this.config, "logintabbg", data.Login_Tab_bg)
        Vue.set(this.config, "logintabcolor", data.Login_Tab_color)
        Vue.set(this.config, "registerbg", data.Register_btn_bg)
        Vue.set(this.config, "registercolor", data.Register_btn_color)
        Vue.set(this.config, "line1", data.login_text_1_line)
        Vue.set(this.config, "line2", data.login_text_2_line)
        Vue.set(this.dialog, "content", data.company_rules)
        Vue.set(this.config, "mcolor", data.main_color)
        Vue.set(this.config, "mfontcolor", data.main_font_color)
        Vue.set(this.config, "pcolor", data.primary_color)
        Vue.set(this.config, "pfontcolor", data.primary_font_color)
        Vue.set(this.config, "background_color", data.background_color)
        Vue.set(this.config, "outercolor", data.layout_background_color_outer)
        Vue.set(this.config, "innercolor", data.layout_background_color_inner)
        Vue.set(
          this.config,
          "direct_signup_password",
          data.direct_signup_password
        )
        Vue.set(this.config, "login_logo", data.login_logo)
        Vue.set(this.config, "custom_css", data.layout_custom_css)
        Vue.set(this.config, "login_pic", data.login_pic)
        this.showsocialLogin = !data.only_email_login
      }
    },
    /** Login Username validation */
    usernamerule(value) {
      const regexp =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!value) {
        return this.$t("LoginScreen.EMAIL_REQUIRED")
      } else if (!regexp.test(value)) {
        return this.$t("LoginScreen.EMAIL_VALID")
      }
      return true
    },
    /** Login Password validation */
    passwordrule(value) {
      if (!value) {
        return this.$t("LoginScreen.PASSWORD_REQUIRED")
      }
      return true
    },
    /** Register Username validation */
    registerusernamerule(value) {
      const regexp =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!value) {
        return this.$t("LoginScreen.EMAIL_REQUIRED")
      }
      if (!regexp.test(value)) {
        return this.$t("LoginScreen.EMAIL_VALID")
      }
      return true
    },
    /** Register user full name validation */
    regfullnamerule(value) {
      if (!value) {
        return this.$t("LoginScreen.NAME_REQUIRED")
      }
      return true
    },
    /** Register mandatory agree check validation */
    registerAgreerule(value) {
      if (!value) {
        return this.$t("LoginScreen.MUST_AGREE_VALID")
      }
      return true
    },
    /** Reset the forms on tab change */
    resetforms() {
      if (this.$refs.loginform) {
        this.$refs.loginform.reset()
      }
      if (this.$refs.registerform) {
        this.register.valid = true
        this.register.username = ""
        this.register.fullname = ""
        this.register.invitecode = this.$route.query.inviteCode ?? ""
        this.register.agree = true
        this.$refs.registerform.resetValidation()
      }
    },
    /** Redirect to change password screen */
    changepassword() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "forgotpassword",
        query: { company_name: passedCompanyId },
      })
    },
    /** Redirect to social login screen */
    dosociallogin() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "login",
        query: { company_name: passedCompanyId },
      })
    },
    /** Validate and do the login action */
    doLogin() {
      let isvalid = this.$refs.loginform.validate()
      this.login.valid = isvalid
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let isLegacyMode = companyconfig.isLegacyMode(passedCompanyId)
      if (isvalid) {
        this.login.showerror = false
        this.login.loading = true

        let guest_hash = localStorage.getItem("guest_hash")
        if (guest_hash) {
          let googletag =
            typeof window.gtag !== "undefined" ? window.gtag : undefined
          loginapi.setGuestHash(guest_hash, passedCompanyId, googletag)
        }

        loginapi
          .doEmailLogin(
            this.login.email,
            this.login.password,
            passedCompanyId,
            this.login.invitecode,
            isLegacyMode
          )
          .then((response) => {
            let self = this
            let accesstkn = response.data
            let msg = response.data.message
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
            if (msg === LOGIN_SUCCESS && accesstkn.access_token) {
              token.setTokens(
                accesstkn.access_token,
                accesstkn.refresh_token,
                accesstkn.expiry_second
              )
              let lang = this.$i18n.locale
              fapi
                .hasMandatoryRules(
                  accesstkn.access_token,
                  passedCompanyId,
                  lang
                )
                .then(function (response) {
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
                  this.$router.push({
                    name: "home",
                    query: { company_name: passedCompanyId },
                  })
                  this.login.loading = false
                })
            } else {
              this.login.errors = this.$t("Errors.INCORRECT_EMAIL_OR_PASSWORD")
              this.login.showerror = true
              this.login.loading = false
            }
          })
          .catch((response) => {
            let msg = response.data.message
            if (msg === LOGIN_FAILED) {
              let errormsg = response.data.error
              if (
                errormsg.email &&
                errormsg.email[0] === INCORRECT_EMAIL_FORMAT
              ) {
                this.login.errors = this.$t("Errors.INCORRECT_EMAIL_FORMAT")
              } else if (
                errormsg.password &&
                errormsg.password[0] === PASSWORD_IS_REQUIRED
              ) {
                this.login.errors = this.$t("Errors.PASSWORD_IS_REQUIRED")
              } else if (
                errormsg.company_url &&
                errormsg.company_url[0] === COMPANY_URL_IS_REQUIRED
              ) {
                this.login.errors = this.$t("Errors.COMPANY_URL_IS_REQUIRED")
              } else if (
                errormsg.password &&
                errormsg.password[0] === INCORRECT_EMAIL_OR_PASSWORD
              ) {
                this.login.errors = this.$t(
                  "Errors.INCORRECT_EMAIL_OR_PASSWORD"
                )
              } else {
                this.login.errors = this.$t(
                  "Errors.INCORRECT_EMAIL_OR_PASSWORD"
                )
              }
            } else {
              this.login.errors = this.$t("Errors.INCORRECT_EMAIL_OR_PASSWORD")
            }
            //this.login.errors = this.$t("LoginScreen.LOGIN_FAILED");
            this.login.showerror = true
            this.login.loading = false
          })
      }
    },
    isDirectPasswordRegistration() {
      return this.config.direct_signup_password == 1
    },
    /** Reset the login screen */
    cancelLogin() {
      this.resetforms()
    },
    /** Reset the register screen */
    cancelRegister() {
      this.resetforms()
    },
    /** Validate and do the registration which will prompt an email */
    doRegister() {
      let isvalid = this.$refs.registerform.validate()
      this.register.valid = isvalid
      if (isvalid) {
        this.register.showerror = false
        this.register.loading = true
        let url = companyconfig.getCompanyIdfromUrl()
        let isLegacyMode = companyconfig.isLegacyMode(url)
        let passedCompanyId = companyconfig.getCompanyIdfromUrl()

        let guest_hash = localStorage.getItem("guest_hash")
        if (guest_hash) {
          let googletag =
            typeof window.gtag !== "undefined" ? window.gtag : undefined
          loginapi.setGuestHash(guest_hash, passedCompanyId, googletag)
        }

        loginapi
          .doRegister(
            this.register.username,
            this.register.fullname,
            url,
            this.register.invitecode,
            this.isDirectPasswordRegistration() ? this.register.password : null,
            isLegacyMode
          )
          .then((response) => {
            let msg = response.data.message
            if (msg === CREATED_ACCOUNT_SUCCESSFULLY) {
              this.register.errors = this.$t(
                "LoginScreen.CREATED_ACCOUNT_SUCCESSFULLY"
              )
              this.register.errType = "success"
              this.register.showerror = true
              this.register.loading = false
              this.resetforms()

              //Track FB SignUp Event
              if (window.fbq && typeof window.fbq !== "undefined") {
                window.fbq("track", "CompleteRegistration")
              }
            }
          })
          .catch((response) => {
            let msg = response.data.message
            this.register.errType = "error"
            if (msg === UNABLE_TO_CREATE_ACCOUNT) {
              let errormsg = response.data.error
              if (
                errormsg.company_url &&
                errormsg.company_url[0] === NO_COMPANY_FOUND
              ) {
                this.register.errors = this.$t("Errors.NO_COMPANY_FOUND")
              } else if (
                errormsg.company_url &&
                errormsg.company_url[0] === COMPANY_URL_IS_REQUIRED
              ) {
                this.register.errors = this.$t("Errors.COMPANY_URL_IS_REQUIRED")
              } else if (
                errormsg.email &&
                errormsg.email[0] === INCORRECT_EMAIL_FORMAT
              ) {
                this.register.errors = this.$t("Errors.INCORRECT_EMAIL_FORMAT")
              } else if (
                errormsg.email &&
                errormsg.email[0] === EMAIL_IS_REQUIRED
              ) {
                this.register.errors = this.$t("Errors.EMAIL_IS_REQUIRED")
              } else if (
                errormsg.name &&
                errormsg.name[0] === NAME_IS_REQUIRED
              ) {
                this.register.errors = this.$t("Errors.NAME_IS_REQUIRED")
              }
            } else if (msg === ACCOUNT_ALREADY_EXISTS) {
              this.register.errors = this.$t("Errors.ACCOUNT_ALREADY_EXISTS")
            }
            this.register.showerror = true
            this.register.loading = false
          })
      }
    },
    goLegacyUrl(url) {
      location.href = url
    },
  },
  components: {
    alert,
    AppFooter,
  },
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
.v-tabs-bar {
  border-radius: 0;
}
</style>
