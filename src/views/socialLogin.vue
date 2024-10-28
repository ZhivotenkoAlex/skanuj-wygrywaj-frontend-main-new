<template>
  <v-main>
    <div
      style="position: absolute; top: 20px; right: 20px; cursor: pointer"
      @click="() => parent.postMessage('close', '*')"
    >
      <v-icon
        large
        color="black"
        style="
          font-size: 25px;
          text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
          color: #fff !important;
        "
      >
        close
      </v-icon>
    </div>
    <v-container
      :style="`background-color:${config.background_color} !important`"
    >
      <v-row justify="center">
        <v-col cols="12" align="center" :style="`padding-top:5px`">
          <v-img
            v-if="config.login_logo"
            :src="config.login_logo"
            contain
            id="login-logo"
          ></v-img>
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
          <!--                    <v-img  :src="config.login_pic" id="login-pic" height="auto" contain></v-img>-->
        </v-col>
      </v-row>
      <v-row justify="center" class="monster-billet-row">
        <div class="monster-billet-row-inner">
          <v-col cols="12" align="center">
            <h4
              :style="`color:${config.mfontcolor} !important`"
              style="font-size: 24px"
              v-html="`${config.line2}`"
            ></h4>
          </v-col>
        </div>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" align="center" justify="center">
          <v-btn
            text
            class="border0px pad2px mb-8"
            v-if="showFaceLoginPhoneForm"
            small
            :style="`color:${config.mfontcolor} !important;font-size: 21px;margin-top: 15px;`"
            @click="hideFaceLoginPhoneForm"
          >
            <v-icon :style="`font-size: 16px;color: ${config.mfontcolor};`"
              >mdi-arrow-left</v-icon
            >
            {{ $t("LoginScreen.BACK_BTN") }}
          </v-btn>
          <v-card tile :style="`background:${config.mcolor} !important`">
            <v-row v-if="!showFaceLoginPhoneForm" style="margin: 12px">
              <v-row justify="center">
                <v-col
                  cols="10"
                  class="mb-0 pb-0"
                  style="color: white !important"
                >
                  <p
                    style="
                      text-align: center;
                      /* color: white; */
                      text-transform: uppercase;
                      pointer-events: none;
                      font-size: 25px;
                    "
                    v-if="!showFaceLoginPhoneForm"
                    id="login-line-2"
                  >
                    {{ $t("LoginScreen.LOGIN_USING") }}
                  </p>
                  <h3 data-test="title">
                    {{ $t("LoginScreen.LOGIN_USING_SUBTITLE") }}
                  </h3>
                  <v-alert
                    data-test="agreement-error"
                    v-if="options.showerr && !options.agree"
                    type="error"
                    transition="slide-y-reverse-transition"
                    >{{ $t(options.errors) }}
                  </v-alert>
                </v-col>
                <v-col cols="10 pb-10 pt-7" sm10 md10>
                  <div
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-direction: column;
                    "
                  >
                    <a
                      @click="triggerAgreementError"
                      data-test="face-login-button"
                    >
                      <div class="social-icons">
                        <button
                          class="social-icon facelogin"
                          :class="options.agree ? '' : 'no-pointer-events'"
                        >
                          <svg
                            id="Layer_1"
                            style="enable-background: new 0 0 30 30"
                            version="1.1"
                            viewBox="0 0 30 30"
                            xml:space="preserve"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                          >
                            <path
                              d="  M12.062,20c0.688,0.5,1.688,1,2.938,1s2.25-0.5,2.938-1"
                              style="
                                fill: none;
                                stroke: rgb(52 52 52);
                                stroke-width: 2;
                                stroke-linecap: round;
                                stroke-linejoin: round;
                                stroke-miterlimit: 10;
                              "
                            />
                            <line
                              style="
                                fill: none;
                                stroke: rgb(52 52 52);
                                stroke-width: 2;
                                stroke-linecap: round;
                                stroke-linejoin: round;
                                stroke-miterlimit: 10;
                              "
                              x1="20"
                              x2="20"
                              y1="12"
                              y2="14"
                            />
                            <line
                              style="
                                fill: none;
                                stroke: rgb(52 52 52);
                                stroke-width: 2;
                                stroke-linecap: round;
                                stroke-linejoin: round;
                                stroke-miterlimit: 10;
                              "
                              x1="10"
                              x2="10"
                              y1="12"
                              y2="14"
                            />
                            <path
                              d="M15,12  v4c0,0.552-0.448,1-1,1"
                              style="
                                fill: none;
                                stroke: rgb(52 52 52);
                                stroke-width: 2;
                                stroke-linecap: round;
                                stroke-linejoin: round;
                                stroke-miterlimit: 10;
                              "
                            />
                            <g>
                              <path
                                d="M26,9   V6c0-1.105-0.895-2-2-2h-3"
                                style="
                                  fill: none;
                                  stroke: rgb(52 52 52);
                                  stroke-width: 2;
                                  stroke-linecap: round;
                                  stroke-linejoin: round;
                                  stroke-miterlimit: 10;
                                "
                              />
                              <path
                                d="M9,4   H6C4.895,4,4,4.895,4,6v3"
                                style="
                                  fill: none;
                                  stroke: rgb(52 52 52);
                                  stroke-width: 2;
                                  stroke-linecap: round;
                                  stroke-linejoin: round;
                                  stroke-miterlimit: 10;
                                "
                              />
                              <path
                                d="   M21,26h3c1.105,0,2-0.895,2-2v-3"
                                style="
                                  fill: none;
                                  stroke: rgb(52 52 52);
                                  stroke-width: 2;
                                  stroke-linecap: round;
                                  stroke-linejoin: round;
                                  stroke-miterlimit: 10;
                                "
                              />
                              <path
                                d="M4,21   v3c0,1.105,0.895,2,2,2h3"
                                style="
                                  fill: none;
                                  stroke: rgb(52 52 52);
                                  stroke-width: 2;
                                  stroke-linecap: round;
                                  stroke-linejoin: round;
                                  stroke-miterlimit: 10;
                                "
                              />
                            </g>
                          </svg>
                        </button>
                      </div>
                    </a>
                  </div>
                </v-col>
                <v-col cols="10" style="color: white !important">
                  <p data-test="subtitle" class="mx-auto">
                    {{ $t("LoginScreen.ANOTHER_LOGIN_USING") }}
                  </p>
                </v-col>
              </v-row>
              <v-col cols="12 pb-10" sm12 md12>
                <div id="login-line-icons">
                  <!--Email login button-->
                  <a
                    @click="triggerAgreementError"
                    style="cursor: pointer"
                    data-test="email-login-button"
                  >
                    <div class="social-icons">
                      <a
                        class="social-icon social-icon--email"
                        @click="doemaillogin"
                        :class="options.agree ? '' : 'no-pointer-events'"
                      >
                        <v-icon large color="white">mdi-email</v-icon>
                        <div class="tooltip" style="background: #f46178">
                          Email
                        </div>
                      </a>
                    </div>
                  </a>

                  <!--Apple login button-->
                  <a
                    @click="triggerAgreementError"
                    style="cursor: pointer"
                    v-if="options.showAppleLogin > 0"
                  >
                    <div class="social-icons">
                      <a
                        class="social-icon social-icon--apple"
                        @click="doAppleLogin"
                        :class="options.agree ? '' : 'no-pointer-events'"
                      >
                        <v-icon large color="white">mdi-apple</v-icon>
                        <div class="tooltip">Apple</div>
                      </a>
                    </div>
                  </a>

                  <!--Facebook login button-->
                  <a @click="triggerAgreementError" style="cursor: pointer">
                    <fblogin
                      :class="options.agree ? '' : 'no-pointer-events'"
                      v-if="options.showSocial"
                      @showerror="showloginerror"
                      @click="setInviteCode"
                    ></fblogin>
                  </a>

                  <!--Google login button-->
                  <!--TODO: Make Google login works with Safari browser. Now it's not-->
                  <a
                    @click="triggerAgreementError"
                    style="cursor: pointer"
                    v-if="!isSafariBrowser"
                  >
                    <googlelogin
                      :class="options.agree ? '' : 'no-pointer-events'"
                      v-if="options.showSocial"
                      @showerror="showloginerror"
                      @click="setInviteCode"
                    ></googlelogin>
                  </a>

                  <!--SMS login button-->
                  <a @click="triggerAgreementError" style="cursor: pointer">
                    <div class="social-icons">
                      <a
                        class="social-icon social-icon--phone"
                        @click="dosmslogin"
                        :class="options.agree ? '' : 'no-pointer-events'"
                      >
                        <v-icon large color="white">mdi-phone</v-icon>
                        <div class="tooltip" style="background: #f4b753">
                          SMS
                        </div>
                      </a>
                    </div>
                  </a>
                </div>
              </v-col>
            </v-row>

            <v-row justify="center" v-if="!showFaceLoginPhoneForm">
              <v-col cols="10" class="mb-0 pb-5">
                <v-checkbox
                  data-test="agreement-checkbox"
                  v-if="dialog.content.length > 0"
                  v-model="options.agree"
                  :rules="[
                    (value) => {
                      return agreerule(value)
                    },
                  ]"
                  class="regulamin-checkbox"
                >
                  <template v-slot:label>
                    <div class="condition">
                      <span
                        v-text="$t('LoginScreen.IAGREE')"
                        style="color: white"
                      ></span>
                      <a
                        class="regulamin-link"
                        v-text="$t('LoginScreen.TERMS')"
                        style="color: white !important"
                        @click="showRulesDialog"
                      >
                      </a>
                    </div>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="10" class="mb-0 pb-0">
                <v-form
                  v-model="register.valid"
                  class="face-login-form mb-12 py-12 px-4"
                  style="display: none"
                  ref="registerform"
                >
                  <v-alert
                    v-if="options.showerr && showFaceLoginPhoneForm"
                    type="error"
                    transition="slide-y-reverse-transition"
                    >{{ $t(options.errors) }}
                  </v-alert>

                  <p class="mx-auto black--text">Wpisz numer telefonu</p>
                  <v-text-field
                    solo
                    class="facephone"
                    :disabled="register.confirmationcodesent"
                    placeholder="+48"
                    name="registeruserphone"
                    style="width: 100%"
                    type="text"
                    v-model="register.phone"
                    autocomplete="off"
                  ></v-text-field>

                  <p
                    class="mx-auto black--text"
                    v-if="register.confirmationcodesent"
                  >
                    {{ $t("LoginScreen.SMS_CODE") }}
                  </p>
                  <v-text-field
                    solo
                    v-if="register.confirmationcodesent"
                    :label="$t('LoginScreen.SMS_CODE')"
                    name="registerconfirmationcode"
                    style="width: 100%"
                    type="text"
                    autocomplete="off"
                    v-model="register.confirmationcode"
                  ></v-text-field>

                  <v-btn
                    class="login-form-btn"
                    block
                    :style="`color:#fff!important;background-color:#000!important;`"
                    @click="doPhoneCheck"
                    :disabled="register.requestSent"
                  >
                    {{ $t("LoginScreen.NEXT") }}
                    <img
                      v-if="register.requestSent"
                      src="~@/assets/images/button_loader.gif"
                      class="button-loader"
                    />
                  </v-btn>
                </v-form>

                <input
                  type="tel"
                  id="facephone"
                  class="facephone face-login-hidden"
                  style="display: none; background-color: white"
                  placeholder="+48"
                />

                <button
                  id="facesubmit"
                  class="facesubmit mt-3 face-login-hidden"
                  style="display: none"
                >
                  {{ $t("LoginScreen.SEND") }}
                </button>
              </v-col>
            </v-row>
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

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue"
import { useRouter } from "vue-router"
import fblogin from "@/components/auth/fbLogin"
import googlelogin from "@/components/auth/googleLogin"
import token from "@/core/auth"
import companyconfig from "@/core/companyconfig"
import loginapi from "@/services/loginapi"
import AppFooter from "@/components/parts/footerComponent"
import {
  ACCESS_TOKEN_IS_REQUIRED,
  COMPANY_URL_IS_REQUIRED,
  INVALID_ACCESS_TOKEN,
  LOGIN_SUCCESS,
  NO_COMPANY_FOUND,
  INCORRECT_EMAIL_FORMAT,
  CREATED_ACCOUNT_SUCCESSFULLY,
  SMS_SENT,
  UNABLE_TO_CREATE_ACCOUNT,
  EMAIL_IS_REQUIRED,
  NAME_IS_REQUIRED,
  ACCOUNT_ALREADY_EXISTS,
  UNABLE_TO_VALIDATE_ACCOUNT,
  SMS_CHECK_CONFIRMED,
} from "@/appConstants"
import fapi from "@/services/fetchapi"

const config = reactive({})
const options = reactive({
  showerr: false,
  errors: "",
  agree: false,
  invitecode: "",
  showSocial: true,
  showAppleLogin: false,
})
const dialog = reactive({
  show: false,
  content: "",
})
const register = reactive({
  valid: true,
  phone: "",
  errors: "",
  showerror: false,
  confirmationcode: "",
  confirmationcodesent: false,
  requestSent: false,
})
const showFaceLoginPhoneForm = ref(false)
const isSafariBrowser = ref(false)
const router = useRouter()

onBeforeMount(() => {
  setupLayout()

  let passedCompanyId = companyconfig.getCompanyIdfromUrl()

  if (companyconfig.allowAppleLogin()) {
    options.showAppleLogin = parseInt(companyconfig.allowAppleLogin())
  }

  if (companyconfig.allowEmailLoginOnly()) {
    options.showSocial = !parseInt(companyconfig.allowEmailLoginOnly())
  } else if (token.isLoggedIn()) {
    router.push({
      name: "rules",
      query: { company_name: passedCompanyId },
    })
  }

  checkSafariBrowser()
})

onMounted(() => {
  // let VueApp = this

  const styleTag = document.createElement("style")
  styleTag.appendChild(document.createTextNode(config.custom_css))
  document.head.appendChild(styleTag)

  window.facelogin_show_callback = function () {
    console.log("facelogin_show_callback callback")
  }

  window.facelogin_phone_callback = function () {
    faceLoginPhoneCallback()
  }

  window.facelogin_finish_callback = function (
    is_success,
    atoken,
    is_register,
    failure_info,
    failure_reason
  ) {
    console.log("facelogin_finish_callback callback", [
      is_success,
      atoken,
      is_register,
      failure_info,
      failure_reason,
    ])
    faceLoginFinishCallback(
      is_success,
      atoken,
      is_register,
      failure_info,
      failure_reason
    )
  }

  resetFaceLoginScript()
})

function setInviteCode() {
  let passedCompanyId = companyconfig.getCompanyIdfromUrl()
  localStorage.removeItem("invitecode_" + passedCompanyId)
  if (options.invitecode != "") {
    localStorage.setItem("invitecode_" + passedCompanyId, options.invitecode)
  }
}

function resetFaceLoginScript() {
  var script_dom_elements = ["facelogin_script", "ti-video-wrapper"]

  script_dom_elements.forEach((elem) => {
    var dom_element = document.getElementById(elem)
    if (dom_element != null) {
      dom_element.remove()
    }
  })

  var scripts = ["https://f.blovly.com/client-bundle.js"]

  scripts.forEach((script) => {
    let tag = document.createElement("script")
    tag.setAttribute("id", "facelogin_script")
    tag.setAttribute("src", script)
    document.body.appendChild(tag)
  })
}

function showRulesDialog() {
  dialog.show = true
}

function agreeRules() {
  dialog.show = false
  options.agree = true
}

function doemaillogin() {
  let passedCompanyId = companyconfig.getCompanyIdfromUrl()
  router.push({
    name: "signup",
    query: { company_name: passedCompanyId },
  })
}

function doAppleLogin() {
  const passedCompanyId = companyconfig.getCompanyIdfromUrl()
  const clientId = "it.2take.login"
  const redirectUrl =
    "https://login.2take.it/api/web/user/apple-login?cn=" + passedCompanyId
  const responseType = "code%20id_token"
  const state = ""
  const scope = "name%20email"
  const responseMode = "form_post"

  const link =
    "https://appleid.apple.com/auth/authorize?client_id=" +
    clientId +
    "&redirect_uri=" +
    redirectUrl +
    "&response_type=" +
    responseType +
    "&state=" +
    state +
    "&scope=" +
    scope +
    "&response_mode=" +
    responseMode

  window.open(link, "Loyalty", "width=350,height=" + screen.height)
  parent.postMessage("close", "*")
}

function dosmslogin() {
  let passedCompanyId = companyconfig.getCompanyIdfromUrl()
  router.push({
    name: "signupsms",
    query: { company_name: passedCompanyId },
  })
}

function hideFaceLoginPhoneForm() {
  showFaceLoginPhoneForm.value = false
  var elements = document.getElementsByClassName("face-login-form")

  for (var i = 0; i < elements.length; i++) {
    elements[i].style["display"] = "none"
  }
  register.valid = true
  register.phone = ""
  register.errors = ""
  register.showerror = false
  register.confirmationcode = ""
  register.confirmationcodesent = false
  global.first_init = true
  resetFaceLoginScript()
}

function faceLoginPhoneCallback() {
  console.log("facelogin_phone_callback callback")
  showFaceLoginScriptElements()
}

function showFaceLoginScriptElements() {
  var elements = document.getElementsByClassName("face-login-form")
  showFaceLoginPhoneForm.value = true

  for (var i = 0; i < elements.length; i++) {
    elements[i].style["display"] = "block"
  }

  elements = document.getElementsByClassName("face-login-hidden")
  showFaceLoginPhoneForm.value = true

  for (i = 0; i < elements.length; i++) {
    elements[i].style["display"] = "none"
  }
}

function faceLoginFinishCallback(
  is_success,
  atoken,
  is_register,
  failure_info,
  failure_reason
) {
  if (!is_success) {
    console.error("faceLoginFinishCallback failure")
    showloginerror("Errors.INVALID_PHONE")
    console.error(failure_reason)
    return
  }

  console.log("Finished with token:" + atoken)

  onFaceLoginSuccess(atoken)
}

function sendFacePhoneConfirm() {
  var elements = document.getElementsByClassName("facephone")

  for (var i = 0; i < elements.length; i++) {
    elements[i].value = register.phone
  }

  document.getElementById("facesubmit").click()
}

function doPhoneCheck() {
  options.showerr = false
  let isvalid = register.valid
  if (isvalid) {
    register.showerror = false

    let passedCompanyId = companyconfig.getCompanyIdfromUrl(),
      invitecode = localStorage.getItem("invitecode_" + passedCompanyId),
      isLegacyMode = companyconfig.isLegacyMode(passedCompanyId)

    let guest_hash = localStorage.getItem("guest_hash")
    if (guest_hash) {
      let googletag =
        typeof window.gtag !== "undefined" ? window.gtag : undefined
      loginapi.setGuestHash(guest_hash, passedCompanyId, googletag)
    }

    var phone = register.phone
    register.requestSent = true

    loginapi
      .doFaceLoginPhoneCheck(
        phone.replace(/\D/g, ""),
        passedCompanyId,
        isLegacyMode,
        invitecode,
        register.confirmationcode
      )
      .then((response) => {
        let msg = response.data.message

        if (
          msg === CREATED_ACCOUNT_SUCCESSFULLY ||
          msg === SMS_CHECK_CONFIRMED
        ) {
          sendFacePhoneConfirm()
        }
        if (
          (msg === SMS_SENT || msg === ACCOUNT_ALREADY_EXISTS) &&
          !register.confirmationcode
        ) {
          register.confirmationcodesent = true
        }
        register.requestSent = false
      })
      .catch((response) => {
        register.requestSent = false
        console.log("wrong")
        register.showerror = true
        let msg = response.data.message
        if (msg === UNABLE_TO_CREATE_ACCOUNT) {
          let errormsg = response.data.error
          if (
            errormsg.company_url &&
            errormsg.company_url[0] === NO_COMPANY_FOUND
          ) {
            register.errors = "Errors.NO_COMPANY_FOUND"
          } else if (
            errormsg.company_url &&
            errormsg.company_url[0] === COMPANY_URL_IS_REQUIRED
          ) {
            register.errors = "Errors.COMPANY_URL_IS_REQUIRED"
          } else if (
            errormsg.email &&
            errormsg.email[0] === INCORRECT_EMAIL_FORMAT
          ) {
            register.errors = "Errors.INCORRECT_EMAIL_FORMAT"
          } else if (
            errormsg.email &&
            errormsg.email[0] === EMAIL_IS_REQUIRED
          ) {
            register.errors = "Errors.EMAIL_IS_REQUIRED"
          } else if (errormsg.name && errormsg.name[0] === NAME_IS_REQUIRED) {
            register.errors = "Errors.NAME_IS_REQUIRED"
          }
        } else if (msg === UNABLE_TO_VALIDATE_ACCOUNT) {
          register.errors = "LoginScreen.UNABLE_TO_VALIDATE_ACCOUNT"
        }
        register.showerror = true
        register.loading = false
      })
  }
}

function onFaceLoginSuccess(atoken) {
  register.requestSent = true
  let passedCompanyId = companyconfig.getCompanyIdfromUrl(),
    invitecode = localStorage.getItem("invitecode_" + passedCompanyId),
    isLegacyMode = companyconfig.isLegacyMode(passedCompanyId)

  var phone = register.phone
  loginapi
    .doFaceLogin(
      atoken,
      passedCompanyId,
      invitecode,
      isLegacyMode,
      phone.replace(/\D/g, "")
    )
    .then((response) => {
      register.requestSent = false
      let msg = response.data.message

      if (isLegacyMode && msg === LOGIN_SUCCESS && response.data.url) {
        goLegacyUrl(response.data.url)
        return
      }

      let accesstkn = response.data

      if (accesstkn.access_token) {
        token.setTokens(
          accesstkn.access_token,
          accesstkn.refresh_token,
          accesstkn.expiry_second
        )

        let lang = this.$i18n.locale

        fapi
          .hasMandatoryRules(accesstkn.access_token, passedCompanyId, lang)
          .then(function (response) {
            if (response === true) {
              router.push({
                name: "rules",
                query: {
                  company_name: passedCompanyId,
                },
              })
            } else {
              router.push({
                name: "home",
                query: {
                  company_name: passedCompanyId,
                },
              })
            }
          })
          .catch(() => {
            router.push({
              name: "home",
              query: { company_name: passedCompanyId },
            })
          })
      } else {
        this.$emit("showerror", "Errors.GOOGLELOGIN_ERROR")
      }
    })
    .catch((response) => {
      register.requestSent = false
      let errormsg = response.data.error
      if (errormsg.facebook && errormsg.facebook[0] === INVALID_ACCESS_TOKEN) {
        this.$emit("showerror", "Errors.INVALID_ACCESS_TOKEN")
      } else if (
        errormsg.access_token &&
        errormsg.access_token[0] === ACCESS_TOKEN_IS_REQUIRED
      ) {
        this.$emit("showerror", "Errors.ACCESS_TOKEN_IS_REQUIRED")
      } else if (
        errormsg.url_name &&
        errormsg.url_name[0] === COMPANY_URL_IS_REQUIRED
      ) {
        this.$emit("showerror", "Errors.COMPANY_URL_IS_REQUIRED")
      } else if (
        errormsg.url_name &&
        errormsg.url_name[0] === NO_COMPANY_FOUND
      ) {
        this.$emit("showerror", "Errors.NO_COMPANY_FOUND")
      } else {
        showloginerror("Errors." + errormsg)
      }
    })
}

function setupLayout() {
  let data = companyconfig.getCompanyScheme()
  if (data != "") {
    config.logo = data.logo_image
    config.layout_login_image = data.layout_login_image
    config.loginbg = data.Login_btn_bg
    config.logincolor = data.Login_btn_color
    config.logintabbg = data.Login_Tab_bg
    config.logintabcolor = data.Login_Tab_color
    config.line1 = data.login_text_1_line
    config.line2 = data.login_text_2_line
    dialog.content = data.company_rules
    config.mcolor = data.main_color
    config.mfontcolor = data.main_font_color
    config.pcolor = data.primary_color
    config.pfontcolor = data.primary_font_color
    config.background_color = data.background_color
    config.login_logo = data.login_logo
    config.custom_css = data.layout_custom_css
    config.login_pic = data.login_pic
    config.outercolor = data.layout_background_color_outer
    config.innercolor = data.layout_background_color_inner
  }
}

function agreerule(value) {
  if (!value) {
    return ""
  }
  return true
}

function showloginerror(error) {
  options.showerr = false
  options.errors = error
  options.showerr = true
}

function triggerAgreementError() {
  if (options.agree) {
    options.showerr = false
    return true
  } else {
    options.showerr = false
    options.errors = ""
    options.errors = "Errors.ACCEPT_TERMS"
    options.showerr = true
  }
}

function goLegacyUrl(url) {
  location.href = url
}

function checkSafariBrowser() {
  var ua = navigator.userAgent.toLowerCase()
  if (ua.indexOf("safari") != -1) {
    if (ua.indexOf("chrome") > -1) {
      return
    } else {
      isSafariBrowser.value = true
    }
  }
}
</script>

<style>
#login-line-icons {
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  min-height: 50px;
}

/* Color Variables */
/* Social Icon Mixin */
/* Social Icons */
.social-icons {
  display: -webkit-box;
  display: flex;
}

.social-icon {
  display: -webkit-box;
  display: block;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: relative;
  width: 50px;
  height: 50px;
  margin: 0 5px;
  /*border-radius: 50%;*/
  cursor: pointer;
  font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 1.5rem;
  text-decoration: none;
  -webkit-transition: all 0.15s ease;
  transition: all 0.15s ease;
}

.social-icon:hover {
  color: #fff;
}

.social-icon:hover .tooltip {
  visibility: visible;
  opacity: 1;
  /*-webkit-transform: translate(-50%, -150%);*/
  /*transform: translate(-50%, -150%);*/
}

.social-icon:active {
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5) inset;
}

.social-icon--facebook {
  background: #1976d2;
  color: #fff;
}

.social-icon--facebook .tooltip {
  background: rgb(108, 108, 108);
  color: currentColor;
}

.social-icon--facebook .tooltip:after {
  border-top-color: #3b5a9b;
}

.social-icon--google {
  /* background: rgb(108, 108, 108); */
  background: #4385f4;
  color: #fff;
}

.social-icon--google .tooltip {
  background: rgb(108, 108, 108);
  color: currentColor;
}

.social-icon--google .tooltip:after {
  border-top-color: #4385f4;
}

.social-icon--phone {
  /* background: rgb(108, 108, 108); */
  background: #f4b753;
  color: #fff;
}

.social-icon--phone .tooltip {
  background: rgb(108, 108, 108);
  color: currentColor;
}

.social-icon--phone .tooltip:after {
  border-top-color: #f4b753;
}

.social-icon--email {
  /* background: rgb(108, 108, 108); */
  background: #f46178;
  color: #fff;
}

.social-icon--email .tooltip {
  background: rgb(108, 108, 108);
  color: currentColor;
}

.social-icon--email .tooltip:after {
  border-top-color: #f46178;
}

.social-icon--apple {
  background: rgb(108, 108, 108);
  color: #fff;
}

.social-icon--apple .tooltip {
  background: rgb(108, 108, 108);
  color: currentColor;
}

.social-icon--apple .tooltip:after {
  border-top-color: #000000;
}

.social-icon i {
  position: relative;
  /* top: -12px; */
  margin: 0 !important;
}

.social-icon-label {
  font-size: 7.5pt;
  margin-top: -25px;
  color: #fff;
  white-space: nowrap;
}

/* Tooltips */
.tooltip {
  z-index: 1;
  bottom: 0;
  text-align: center;
  width: 100%;
  margin-bottom: -2px;
  display: block;
  position: absolute;
  font-size: 7.5pt;
}

.tooltip:after {
  /*display: block;*/
  /*position: absolute;*/
  /*bottom: 1px;*/
  /*left: 50%;*/
  /*width: 0;*/
  /*height: 0;*/
  /*content: "";*/
  /*border: solid;*/
  /*border-width: 10px 10px 0 10px;*/
  /*border-color: transparent;*/
  /*-webkit-transform: translate(-50%, 100%);*/
  /*transform: translate(-50%, 100%);*/
}

.no-pointer-events {
  pointer-events: none;
}

.v-input--selection-controls {
  padding-top: 0;
  margin-top: 0;
}

.v-application #login-line-icons a,
#login-line-icons .theme--light.v-icon {
  color: #ffffff !important;
  caret-color: #ffffff !important;
}

.regulamin-checkbox .theme--light.v-icon {
  color: #868686 !important;
}
.theme--dark.v-label {
  color: rgb(0 0 0 / 70%);
}

.button-loader {
  width: 14px;
  position: relative;
  right: -20px;
  margin-left: -14px;
}

#ti-remote-video-wrapper video {
  display: flex;
  position: absolute;
  top: -20%;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

@media (min-width: 720px) {
  #ti-remote-video-wrapper video {
    transform: none !important;
    transform-origin: center top !important;
    max-width: 480px !important;
    height: auto !important;
    width: 100% !important;
  }
}
</style>
