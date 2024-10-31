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
          @click="doSocialLogin"
        >
          <v-icon :style="`font-size: 16px;color:white;`"
            >mdi-arrow-left</v-icon
          >
          {{ $t("LoginScreen.BACK_BTN") }}
        </v-btn>

        <v-col cols="12" align="center" justify="center">
          <v-card variant="text" class="test">
            <v-tabs
              v-model="tab"
              :color="config.mfontcolor"
              height="60px"
              centered
              fixed-tabs
              max-width="100"
              @change="resetForms"
              :bg-color="config.mcolor"
            >
              <v-tab value="login-tab">{{ $t("LoginScreen.LOGIN") }}</v-tab>
              <v-tab value="reg-tab">{{ $t("LoginScreen.REGISTER") }}</v-tab>
            </v-tabs>

            <v-card>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item value="login-tab">
                  <v-card
                    class="monster-login-panel"
                    :style="`background-color:${config.mcolor}`"
                  >
                    <v-card-text :style="`background-color:#fff9`">
                      <v-row>
                        <v-col cols="12" sm12 md12>
                          <v-form v-model="login.valid" ref="loginForm">
                            <alert
                              :errorMessage="login.errors"
                              :alert="login.showerror"
                            ></alert>

                            <v-text-field
                              solo
                              data-test="login-email"
                              :placeholder="$t('LoginScreen.EMAIL')"
                              name="loginEmail"
                              prepend-icon="mdi-account"
                              type="text"
                              v-model="login.email"
                              autocomplete="email"
                              :rules="[rules.required, rules.email]"
                            ></v-text-field>

                            <v-text-field
                              solo
                              data-test="login-password"
                              id="loginPassword"
                              :placeholder="$t('LoginScreen.PASSWORD')"
                              name="loginPassword"
                              prepend-icon="mdi-lock"
                              autocomplete="password"
                              @click:append="login.show1 = !login.show1"
                              :type="login.show1 ? 'text' : 'password'"
                              v-model="login.password"
                              :rules="[rules.required]"
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
                        @click="changePassword"
                      ></v-btn>
                    </v-card-actions>
                  </v-card>
                </v-tabs-window-item>

                <v-tabs-window-item value="reg-tab">
                  <v-card
                    class="monster-login-panel"
                    :style="`background:${config.innercolor} !important`"
                  >
                    <v-card-text :style="`background-color:#fff9`">
                      <v-row>
                        <v-col xs12>
                          <v-form v-model="register.valid" ref="registerForm">
                            <alert
                              :errorType="register.errType"
                              :errorMessage="register.errors"
                              :alert="register.showerror"
                            ></alert>

                            <v-text-field
                              solo
                              data-test="reg-name"
                              id="regPassword"
                              :placeholder="$t('LoginScreen.NAME')"
                              name="regFullname"
                              prepend-icon="mdi-account"
                              type="text"
                              autocomplete="name"
                              v-model="register.fullname"
                              :rules="[rules.required]"
                            ></v-text-field>
                            <v-text-field
                              solo
                              data-test="reg-email"
                              :placeholder="$t('LoginScreen.EMAIL')"
                              name="registerUserEmail"
                              prepend-icon="mdi-email"
                              type="text"
                              v-model="register.username"
                              autocomplete="email"
                              :rules="[rules.required, rules.email]"
                            ></v-text-field>

                            <v-text-field
                              solo
                              data-test="reg-password"
                              v-if="isDirectPasswordRegistration()"
                              :placeholder="$t('LoginScreen.PASSWORD')"
                              name="registerUsername"
                              prepend-icon="mdi-lock"
                              v-model="register.password"
                              autocomplete="password"
                              :append-icon="
                                login.show1 ? 'mdi-eye' : 'mdi-eye-off'
                              "
                              @click:append="login.show1 = !login.show1"
                              :type="login.show1 ? 'text' : 'password'"
                              :rules="[rules.required]"
                            ></v-text-field>

                            <v-text-field
                              solo
                              data-test="reg-invitation-code"
                              id="loginInvitecode"
                              :placeholder="$t('LoginScreen.INVITECODE')"
                              name="loginInvitecode"
                              prepend-icon="mdi-share-variant"
                              type="text"
                              autocomplete="inviteCode"
                              v-model="register.invitecode"
                            ></v-text-field>

                            <v-checkbox
                              dense
                              data-test="reg-agreement"
                              class="mx-3 regulamin-checkbox"
                              v-model="register.agree"
                              :rules="[rules.required]"
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
                </v-tabs-window-item>
              </v-tabs-window>
            </v-card>
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
import { ref, reactive, onMounted, onBeforeMount } from "vue"
import { useRouter, useRoute } from "vue-router"
import loginApi from "@/services/loginapi"
import fapi from "@/services/fetchapi"
import token from "@/core/auth"
import companyconfig from "@/core/companyconfig"
import alert from "@/components/shared/errorAlert"
import AppFooter from "@/components/parts/footerComponent"
// import { useI18n } from "vue-i18n"
import { i18n } from "@/plugins/i18n"
export default {
  components: {
    alert,
    AppFooter,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    // const { t } = useI18n()
    const default_tab = "tab-login"
    const tab = ref(route.query.inviteCode ? "tab-reg" : "tab-login")
    const login = reactive({
      valid: true,
      email: "",
      password: "",
      invitecode: "",
      errors: "",
      showerror: false,
      show1: false,
      loading: false,
    })
    const config = reactive({})
    const register = reactive({
      password: "",
      valid: true,
      username: "",
      fullname: "",
      invitecode: route.query.inviteCode ?? "",
      errors: "",
      showerror: false,
      agree: true,
      errType: "error",
      loading: false,
    })
    const dialog = reactive({
      show: false,
      content: "",
    })
    const showsocialLogin = ref(true)
    const redirectToFbBot = ref(false)
    let styleTag

    const loginForm = ref(null)
    const registerForm = ref(null)

    const rules = {
      required: (value) => !!value || "Required.",
      email: (value) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(value) || "Invalid e-mail."
      },
    }

    onBeforeMount(() => {
      setupLayout()
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      if (token.isLoggedIn()) {
        router.push({
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
        redirectToFbBot.value = true
      }
    })

    onMounted(() => {
      styleTag = document.createElement("style")
      styleTag.appendChild(document.createTextNode(config.custom_css))
      document.head.appendChild(styleTag)
    })

    const showRulesDialog = () => {
      dialog.show = true
    }

    const agreeRules = () => {
      dialog.show = false
      register.agree = true
    }

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        Object.assign(config, {
          logo: data.logo_image,
          layout_login_image: data.layout_login_image,
          loginbg: data.Login_btn_bg,
          logincolor: data.Login_btn_color,
          cancelbg: data.Cancel_btn_bg,
          cancelcolor: data.Cancel_btn_color,
          forgotbg: data.Forgot_btn_bg ? data.Forgot_btn_bg : "#808080",
          forgotcolor: data.Forgot_btn_color,
          logintabbg: data.Login_Tab_bg,
          logintabcolor: data.Login_Tab_color,
          registerbg: data.Register_btn_bg,
          registercolor: data.Register_btn_color,
          line1: data.login_text_1_line,
          line2: data.login_text_2_line,
          mcolor: data.main_color,
          mfontcolor: data.main_font_color,
          pcolor: data.primary_color,
          pfontcolor: data.primary_font_color,
          background_color: data.background_color,
          outercolor: data.layout_background_color_outer,
          innercolor: data.layout_background_color_inner,
          direct_signup_password: data.direct_signup_password,
          login_logo: data.login_logo,
          custom_css: data.layout_custom_css,
          login_pic: data.login_pic,
        })
        dialog.content = data.company_rules
        showsocialLogin.value = !data.only_email_login
      }
    }

    const registerAgreeRule = (value) => {
      if (!value) {
        return "You must agree to the terms"
      }
      return true
    }

    const resetForms = () => {
      if (login.value) {
        login.value.reset()
      }
      if (register.value) {
        register.valid = true
        register.username = ""
        register.fullname = ""
        register.invitecode = route.query.inviteCode ?? ""
        register.agree = true
        register.value.resetValidation()
      }
    }

    const changePassword = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "forgotpassword",
        query: { company_name: passedCompanyId },
      })
    }

    const doSocialLogin = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "login",
        query: { company_name: passedCompanyId },
      })
    }

    const doLogin = async () => {
      let isvalid = await loginForm.value.validate()
      login.valid = isvalid.valid
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let isLegacyMode = companyconfig.isLegacyMode(passedCompanyId)
      if (isvalid.valid) {
        login.showerror = false
        login.loading = true

        let guest_hash = localStorage.getItem("guest_hash")
        if (guest_hash) {
          let googleTag =
            typeof window.gtag !== "undefined" ? window.gtag : undefined
          loginApi.setGuestHash(guest_hash, passedCompanyId, googleTag)
        }

        loginApi
          .doEmailLogin(
            login.email,
            login.password,
            passedCompanyId,
            login.invitecode,
            isLegacyMode
          )
          .then((response) => {
            let accesstkn = response.data
            let msg = response.data.message
            if (msg === LOGIN_SUCCESS && response.data.url) {
              if (redirectToFbBot.value) {
                console.log(">>>FB LOGIN 2")
                companyconfig.goToFbBotLogin(passedCompanyId, response.data.url)
                return
              }
              if (isLegacyMode) {
                goLegacyUrl(response.data.url)
                return
              }
            }
            if (msg === LOGIN_SUCCESS && accesstkn.access_token) {
              token.setTokens(
                accesstkn.access_token,
                accesstkn.refresh_token,
                accesstkn.expiry_second
              )
              let lang = i18n.global.locale
              fapi
                .hasMandatoryRules(
                  accesstkn.access_token,
                  passedCompanyId,
                  lang
                )
                .then(function (response) {
                  if (response === true) {
                    router.push({
                      name: "rules",
                      query: { company_name: passedCompanyId },
                    })
                  } else {
                    router.push({
                      name: "home",
                      query: { company_name: passedCompanyId },
                    })
                  }
                  login.loading = false
                })
                .catch(() => {
                  router.push({
                    name: "home",
                    query: { company_name: passedCompanyId },
                  })
                  login.loading = false
                })
            } else {
              login.errors = "Incorrect email or password"
              login.showerror = true
              login.loading = false
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
                login.errors = "Incorrect email format"
              } else if (
                errormsg.password &&
                errormsg.password[0] === PASSWORD_IS_REQUIRED
              ) {
                login.errors = "Password is required"
              } else if (
                errormsg.company_url &&
                errormsg.company_url[0] === COMPANY_URL_IS_REQUIRED
              ) {
                login.errors = "Company URL is required"
              } else if (
                errormsg.password &&
                errormsg.password[0] === INCORRECT_EMAIL_OR_PASSWORD
              ) {
                login.errors = "Incorrect email or password"
              } else {
                login.errors = "Incorrect email or password"
              }
            } else {
              login.errors = "Incorrect email or password"
            }
            login.showerror = true
            login.loading = false
          })
      }
    }

    const isDirectPasswordRegistration = () => {
      return config.direct_signup_password == 1
    }

    const cancelLogin = () => {
      resetForms()
    }

    const cancelRegister = () => {
      resetForms()
    }

    const doRegister = async () => {
      let isvalid = await registerForm.value.validate()
      register.valid = isvalid.valid
      if (isvalid.valid) {
        register.showerror = false
        register.loading = true
        let url = companyconfig.getCompanyIdfromUrl()
        let isLegacyMode = companyconfig.isLegacyMode(url)
        let passedCompanyId = companyconfig.getCompanyIdfromUrl()

        let guest_hash = localStorage.getItem("guest_hash")
        if (guest_hash) {
          let googleTag =
            typeof window.gtag !== "undefined" ? window.gtag : undefined
          loginApi.setGuestHash(guest_hash, passedCompanyId, googleTag)
        }

        loginApi
          .doRegister(
            register.username,
            register.fullname,
            url,
            register.invitecode,
            isDirectPasswordRegistration() ? register.password : null,
            isLegacyMode
          )
          .then((response) => {
            let msg = response.data.message
            if (msg === CREATED_ACCOUNT_SUCCESSFULLY) {
              register.errors = "Account created successfully"
              register.errType = "success"
              register.showerror = true
              register.loading = false
              resetForms()

              //Track FB SignUp Event
              if (window.fbq && typeof window.fbq !== "undefined") {
                window.fbq("track", "CompleteRegistration")
              }
            }
          })
          .catch((response) => {
            let msg = response.data.message
            register.errType = "error"
            if (msg === UNABLE_TO_CREATE_ACCOUNT) {
              let errormsg = response.data.error
              if (
                errormsg.company_url &&
                errormsg.company_url[0] === NO_COMPANY_FOUND
              ) {
                register.errors = "No company found"
              } else if (
                errormsg.company_url &&
                errormsg.company_url[0] === COMPANY_URL_IS_REQUIRED
              ) {
                register.errors = "Company URL is required"
              } else if (
                errormsg.email &&
                errormsg.email[0] === INCORRECT_EMAIL_FORMAT
              ) {
                register.errors = "Incorrect email format"
              } else if (
                errormsg.email &&
                errormsg.email[0] === EMAIL_IS_REQUIRED
              ) {
                register.errors = "Email is required"
              } else if (
                errormsg.name &&
                errormsg.name[0] === NAME_IS_REQUIRED
              ) {
                register.errors = "Name is required"
              }
            } else if (
              msg === ACCOUNT_ALREADY_EXISTS ||
              msg === "User already exists"
            ) {
              register.errors = "Account already exists"
            }
            register.showerror = true
            register.loading = false
          })
      }
    }

    const goLegacyUrl = (url) => {
      location.href = url
    }

    return {
      rules,
      default_tab,
      tab,
      login,
      config,
      register,
      dialog,
      loginForm,
      registerForm,
      showsocialLogin,
      redirectToFbBot,
      showRulesDialog,
      agreeRules,
      setupLayout,
      registerAgreeRule,
      resetForms,
      changePassword,
      doSocialLogin,
      doLogin,
      isDirectPasswordRegistration,
      cancelLogin,
      cancelRegister,
      doRegister,
      goLegacyUrl,
    }
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

.v-messages__message {
  text-align: start;
}
</style>
