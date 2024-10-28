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
    <v-container
      :style="`background-color:${config.background_color} !important`"
    >
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
          <v-icon :style="`font-size: 16px;color:white ;`"
            >mdi-arrow-left</v-icon
          >
          {{ $t("LoginScreen.BACK_BTN") }}
        </v-btn>
        <v-col cols="12" align="center" justify="center">
          <v-card class="monster-login-panel">
            <v-tabs
              v-model="tab"
              :color="config.mfontcolor"
              :background-color="config.mcolor"
              height="60px"
              centered
              fixed-tabs
              @change="resetForms"
              :bg-color="config.mcolor"
            >
              <v-tab
                ripple
                value="login-tab"
                v-text="$t('LoginScreen.LOGIN')"
                class="monster-login-using"
              ></v-tab>
              <v-tab
                ripple
                value="reg-tab"
                v-text="$t('LoginScreen.REGISTER')"
                class="monster-login-using"
              ></v-tab>
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
                              :placeholder="$t('LoginScreen.PHONE_FIELD')"
                              name="loginPhone"
                              prepend-icon="mdi-phone"
                              type="text"
                              v-model="login.phone"
                              autocomplete="loginPhone"
                              :rules="[rules.required, rules.phone]"
                            ></v-text-field>

                            <v-text-field
                              solo
                              id="loginPassword"
                              autocomplete="loginPassword"
                              :placeholder="$t('LoginScreen.PASSWORD')"
                              name="loginPassword"
                              prepend-icon="mdi-lock"
                              :append-icon="
                                login.show1 ? 'visibility' : 'visibility_off'
                              "
                              @click:append="login.show1 = !login.show1"
                              :type="login.show1 ? 'text' : 'password'"
                              v-model="login.password"
                              :rules="[rules.required]"
                            ></v-text-field>

                            <v-row>
                              <v-col cols="12">
                                <v-btn
                                  block
                                  class="loginbtn login-form-btn"
                                  :style="`color:#fff;background:${config.mcolor}`"
                                  @click="doLogin"
                                  :loading="login.loading"
                                  :disabled="login.loading"
                                  v-text="$t('LoginScreen.LOGIN')"
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
                        class="border0px pad2px login-form-btn"
                        :color="config.forgotbg"
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
                    :style="`background: ${config.mcolor}`"
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
                              v-if="!register.confirmationcodesent"
                              id="regPassword"
                              :placeholder="$t('LoginScreen.NAME')"
                              name="regFullname"
                              prepend-icon="mdi-account"
                              type="text"
                              autocomplete="regPassword"
                              v-model="register.fullname"
                              :rules="[rules.required]"
                            ></v-text-field>
                            <v-text-field
                              solo
                              v-if="!register.confirmationcodesent"
                              :placeholder="$t('LoginScreen.PHONE_FIELD')"
                              name="registerUserPhone"
                              prepend-icon="mdi-phone"
                              type="text"
                              v-model="register.phone"
                              autocomplete="registerUserPhone"
                              :rules="[rules.required, rules.phone]"
                            ></v-text-field>

                            <v-text-field
                              solo
                              v-if="!register.confirmationcodesent"
                              :placeholder="$t('LoginScreen.PASSWORD')"
                              name="registerUserPassword"
                              prepend-icon="mdi-lock"
                              v-model="register.password"
                              :append-icon="
                                login.show1 ? 'mdi-eye' : 'mdi-eye-off'
                              "
                              @click:append="login.show1 = !login.show1"
                              :type="login.show1 ? 'text' : 'password'"
                              autocomplete="registerUserPassword"
                              :rules="[rules.required]"
                            ></v-text-field>

                            <v-text-field
                              solo
                              v-if="!register.confirmationcodesent"
                              id="loginInvitecode"
                              :placeholder="$t('LoginScreen.INVITECODE')"
                              name="loginInvitecode"
                              prepend-icon="mdi-share-variant"
                              type="text"
                              autocomplete="loginInvitecode"
                              v-model="register.invitecode"
                            ></v-text-field>

                            <v-text-field
                              solo
                              v-if="register.confirmationcodesent"
                              id="confirmationcode"
                              :label="$t('LoginScreen.SMS_CODE')"
                              name="confirmationcode"
                              prepend-icon="sms"
                              type="text"
                              autocomplete="confirmationcode"
                              v-model="register.confirmationcode"
                            ></v-text-field>

                            <v-checkbox
                              solo
                              v-if="!register.confirmationcodesent"
                              dense
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
                                    :style="`color:${config.mfontcolor}`"
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
  SMS_SENT,
  UNABLE_TO_CREATE_ACCOUNT,
  NO_COMPANY_FOUND,
  COMPANY_URL_IS_REQUIRED,
  EMAIL_IS_REQUIRED,
  NAME_IS_REQUIRED,
  ACCOUNT_ALREADY_EXISTS,
  UNABLE_TO_VALIDATE_ACCOUNT,
} from "@/appConstants"

import { ref, reactive, onMounted, onBeforeMount } from "vue"
import { useRouter } from "vue-router"
import loginapi from "@/services/loginapi"
import fapi from "@/services/fetchapi"
import token from "@/core/auth"
import companyconfig from "@/core/companyconfig"
import alert from "@/components/shared/errorAlert"
import AppFooter from "@/components/parts/footerComponent"
import { useI18n } from "vue-i18n"
import { i18n } from "@/plugins/i18n"
export default {
  components: {
    alert,
    AppFooter,
  },
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const login = reactive({
      valid: true,
      phone: "",
      password: "",
      errors: "",
      showerror: false,
      show1: false,
      loading: false,
    })
    const tab = ref("tab-login")
    const config = reactive({})
    const register = reactive({
      password: "",
      valid: true,
      phone: "",
      fullname: "",
      invitecode: "",
      errors: "",
      showerror: false,
      agree: true,
      errType: "error",
      loading: false,
      confirmationcode: "",
      confirmationcodesent: false,
    })

    const loginForm = ref(null)
    const registerForm = ref(null)

    const dialog = reactive({
      show: false,
      content: "",
    })

    const showsocialLogin = ref(true)
    const redirectToFbBot = ref(false)

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
      const styleTag = document.createElement("style")
      styleTag.appendChild(document.createTextNode(config.custom_css))
      document.head.appendChild(styleTag)
    })

    function showRulesDialog() {
      dialog.show = true
    }

    function agreeRules() {
      dialog.show = false
      register.agree = true
    }

    function setupLayout() {
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
          login_logo: data.login_logo,
          custom_css: data.layout_custom_css,
          login_pic: data.login_pic,
        })
        dialog.content = data.company_rules
        showsocialLogin.value = !data.only_email_login
      }
    }

    function resetForms() {
      if (loginForm.value) {
        loginForm.value.reset()
      }
      if (registerForm.value) {
        register.valid = true
        register.username = ""
        register.fullname = ""
        register.invitecode = ""
        register.agree = true
        registerForm.value.resetValidation()
      }
    }

    function changePassword() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "forgotphonepassword",
        query: { company_name: passedCompanyId },
      })
    }

    function doSocialLogin() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "login",
        query: { company_name: passedCompanyId },
      })
    }

    async function doLogin() {
      let isvalid = await loginForm.value.validate()
      login.valid = isvalid.valid
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let isLegacyMode = companyconfig.isLegacyMode(passedCompanyId)
      if (isvalid.valid) {
        login.showerror = false
        login.loading = true

        let guest_hash = localStorage.getItem("guest_hash")
        if (guest_hash) {
          let googletag =
            typeof window.gtag !== "undefined" ? window.gtag : undefined
          loginapi.setGuestHash(guest_hash, passedCompanyId, googletag)
        }

        loginapi
          .doSMSLogin(
            login.phone,
            login.password,
            passedCompanyId,
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
              login.errors = t("Errors.INCORRECT_EMAIL_OR_PASSWORD")
              // register.errors = "INCORRECT EMAIL OR PASSWORD"
              login.showerror = true
              login.loading = false
            }
          })
          .catch((response) => {
            let msg = response.data.message
            if (msg === LOGIN_FAILED) {
              let errormsg = response.data.error
              login.errors = t("LoginScreen.INCORRECT_PHONE_OR_PASSWORD")
              if (
                errormsg.email &&
                errormsg.email[0] === INCORRECT_EMAIL_FORMAT
              ) {
                login.errors = t("Errors.INCORRECT_EMAIL_FORMAT")
              } else if (
                errormsg.password &&
                errormsg.password[0] === PASSWORD_IS_REQUIRED
              ) {
                login.errors = t("Errors.PASSWORD_IS_REQUIRED")
              } else if (
                errormsg.company_url &&
                errormsg.company_url[0] === COMPANY_URL_IS_REQUIRED
              ) {
                login.errors = t("Errors.COMPANY_URL_IS_REQUIRED")
              } else if (
                errormsg.password &&
                errormsg.password[0] === INCORRECT_EMAIL_OR_PASSWORD
              ) {
                login.errors = t("Errors.INCORRECT_EMAIL_OR_PASSWORD")
              }
            } else {
              login.errors = t("Errors.INCORRECT_EMAIL_OR_PASSWORD")
            }
            login.showerror = true
            login.loading = false
          })
      }
    }

    function doRegister() {
      let isvalid = registerForm.value.validate()
      register.valid = isvalid.valid
      if (isvalid.valid) {
        register.showerror = false
        register.loading = true
        let url = companyconfig.getCompanyIdfromUrl()
        let isLegacyMode = companyconfig.isLegacyMode(url)

        let guest_hash = localStorage.getItem("guest_hash")
        if (guest_hash) {
          let googletag =
            typeof window.gtag !== "undefined" ? window.gtag : undefined
          loginapi.setGuestHash(guest_hash, url, googletag)
        }

        loginapi
          .doSMSRegister(
            register.phone,
            register.fullname,
            url,
            register.invitecode,
            register.password,
            isLegacyMode,
            register.confirmationcode
          )
          .then((response) => {
            let msg = response.data.message
            if (msg === CREATED_ACCOUNT_SUCCESSFULLY) {
              register.errors = t("LoginScreen.CREATED_ACCOUNT_SUCCESSFULLY")
              register.errType = "success"
              register.showerror = true
              register.loading = false
              resetForms()

              if (window.fbq && typeof window.fbq !== "undefined") {
                window.fbq("track", "CompleteRegistration")
              }
            }
            if (msg === SMS_SENT && !register.confirmationcode) {
              register.errors = t("LoginScreen.SMS_SENT")
              register.errType = "success"
              register.showerror = true
              register.loading = false
              register.confirmationcodesent = true
            }
          })
          .catch((response) => {
            console.log("wrong")
            register.errType = "error"
            register.showerror = true
            register.loading = false
            let msg = response.data.message
            if (msg === UNABLE_TO_CREATE_ACCOUNT) {
              let errormsg = response.data.error
              if (
                errormsg.company_url &&
                errormsg.company_url[0] === NO_COMPANY_FOUND
              ) {
                register.errors = t("Errors.NO_COMPANY_FOUND")
              } else if (
                errormsg.company_url &&
                errormsg.company_url[0] === COMPANY_URL_IS_REQUIRED
              ) {
                register.errors = t("Errors.COMPANY_URL_IS_REQUIRED")
              } else if (
                errormsg.email &&
                errormsg.email[0] === INCORRECT_EMAIL_FORMAT
              ) {
                register.errors = t("Errors.INCORRECT_EMAIL_FORMAT")
              } else if (
                errormsg.email &&
                errormsg.email[0] === EMAIL_IS_REQUIRED
              ) {
                register.errors = t("Errors.EMAIL_IS_REQUIRED")
              } else if (
                errormsg.name &&
                errormsg.name[0] === NAME_IS_REQUIRED
              ) {
                register.errors = t("Errors.NAME_IS_REQUIRED")
              }
            } else if (msg === ACCOUNT_ALREADY_EXISTS) {
              register.errors = t("Errors.ACCOUNT_ALREADY_EXISTS")
            } else if (msg === UNABLE_TO_VALIDATE_ACCOUNT) {
              register.errors = t("LoginScreen.UNABLE_TO_VALIDATE_ACCOUNT")
            }
            register.showerror = true
            register.loading = false
          })
      }
    }

    const rules = {
      required: (value) => !!value || "Required.",
      phone: (value) => {
        const regexp = /^\d{9,}$/
        return regexp.test(value) || "Invalid phone."
      },
    }

    function goLegacyUrl(url) {
      location.href = url
    }

    return {
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
      doLogin,
      doRegister,
      goLegacyUrl,
      changePassword,
      doSocialLogin,
      resetForms,
      rules,
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
</style>
