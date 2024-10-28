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
          text
          class="border0px pad2px"
          small
          :color="config.mcolor"
          :style="
            `color: ` +
            config.mfontcolor +
            ` !important;font-size: 21px;margin-top: 15px;`
          "
          @click="goback"
        >
          <v-icon :style="`font-size: 16px;color: ` + config.mfontcolor + `;`"
            >mdi-arrow-left</v-icon
          >
          {{ $t("LoginScreen.BACK_BTN") }}
        </v-btn>
        <v-col cols="12" align="center" justify="center">
          <v-tabs
            :color="config.mfontcolor"
            :background-color="config.mcolor"
            height="60px"
            centered
            fixed-tabs
            hide-slider
          >
            <v-tab ripple v-text="$t('LoginScreen.FORGOT_PASSWORD')"></v-tab>
            <v-tab-item>
              <v-card flat elevation="n-7" class="pt-10 monster-login-panel">
                <v-form ref="form" v-model="chngpassword.valid">
                  <v-row justify="center">
                    <v-col cols="10">
                      <alert
                        :errorMessage="chngpassword.errors"
                        :errorType="chngpassword.errType"
                        :alert="chngpassword.showerr"
                      ></alert>

                      <v-text-field
                        solo
                        v-if="!chngpassword.verification_code_sent"
                        v-model="chngpassword.phone"
                        :placeholder="$t('LoginScreen.PHONE_FIELD')"
                        persistent-hint
                        :rules="[
                          (value) => {
                            return agreerule(value)
                          },
                        ]"
                      ></v-text-field>

                      <v-text-field
                        solo
                        v-if="chngpassword.verification_code_sent"
                        id="logininvitecode"
                        :placeholder="$t('LoginScreen.SMS_CODE')"
                        name="registerconfirmationcode"
                        prepend-icon="sms"
                        type="text"
                        autocomplete="off"
                        v-model="chngpassword.verification_code"
                      ></v-text-field>

                      <v-text-field
                        solo
                        v-if="chngpassword.verification_code_sent"
                        id="loginpassword"
                        :placeholder="$t('LoginScreen.NEW_PASSWORD')"
                        name="loginpassword"
                        prepend-icon="lock"
                        :append-icon="
                          chngpassword.show1 ? 'visibility' : 'visibility_off'
                        "
                        @click:append="chngpassword.show1 = !chngpassword.show1"
                        :type="chngpassword.show1 ? 'text' : 'password'"
                        v-model="chngpassword.password"
                        :rules="[
                          (value) => {
                            return passwordrule(value)
                          },
                        ]"
                      ></v-text-field>

                      <v-spacer></v-spacer>
                    </v-col>
                  </v-row>
                  <v-card-actions>
                    <v-flex class="text-center">
                      <v-btn
                        block
                        @click="doChangePassword"
                        v-text="$t('LoginScreen.CHANGE_PASSWORD')"
                        :color="config.mcolor"
                        class="login-form-btn"
                        :style="`color:#fff;background-color:#000;`"
                      ></v-btn>
                    </v-flex>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-container>
    <AppFooter> </AppFooter>
  </v-main>
</template>
<script>
import {
  PASSWORD_RESET_SUCCESS,
  NO_COMPANY_FOUND,
  SMS_SENT,
} from "@/appConstants"
import Vue from "vue"
import loginapi from "@/services/loginapi"
import companyconfig from "@/core/companyconfig"
import alert from "@/components/shared/errorAlert"
import AppFooter from "@/components/parts/footerComponent"
export default {
  data: () => ({
    chngpassword: {
      phone: "",
      verification_code: "",
      password: "",
      valid: true,
      errors: "",
      showerr: false,
      errType: "error",
      verification_code_sent: false,
      show1: false,
    },
    config: {},
  }),
  created() {
    this.setupLayout()
  },
  mounted() {
    this.styleTag = document.createElement("style")
    this.styleTag.appendChild(document.createTextNode(this.config.custom_css))
    document.head.appendChild(this.styleTag)
  },
  methods: {
    /** Navigate to previous url */
    goback() {
      this.$router.go(-1)
    },
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        Vue.set(this.config, "logo", data.logo_image)
        Vue.set(this.config, "forgotbg", data.Forgot_btn_bg)
        Vue.set(this.config, "forgotcolor", data.Forgot_btn_color)
        Vue.set(this.config, "cancelbg", data.Cancel_btn_bg)
        Vue.set(this.config, "cancelcolor", data.Cancel_btn_color)
        Vue.set(this.config, "logintabbg", data.Login_Tab_bg)
        Vue.set(this.config, "logintabcolor", data.Login_Tab_color)
        Vue.set(this.config, "line1", data.login_text_1_line)
        Vue.set(this.config, "line2", data.login_text_2_line)
        Vue.set(this.config, "mcolor", data.main_color)
        Vue.set(this.config, "mfontcolor", data.main_font_color)
        Vue.set(this.config, "pcolor", data.primary_color)
        Vue.set(this.config, "pfontcolor", data.primary_font_color)
        Vue.set(this.config, "background_color", data.background_color)
        Vue.set(this.config, "login_logo", data.login_logo)
        Vue.set(this.config, "custom_css", data.layout_custom_css)
        Vue.set(this.config, "login_pic", data.login_pic)
      }
    },
    /** Submit the password to api to get the password reset email */
    doChangePassword() {
      let isvalid = this.$refs.form.validate()
      if (isvalid) {
        this.chngpassword.showerr = false
        let url = companyconfig.getCompanyIdfromUrl()
        let isLegacyMode = companyconfig.isLegacyMode(url)
        loginapi
          .doPhonePasswordChange(
            this.chngpassword.phone,
            url,
            this.chngpassword.password,
            this.chngpassword.verification_code,
            isLegacyMode
          )
          .then((response) => {
            let msg = response.data.message
            if (msg === SMS_SENT) {
              this.chngpassword.errors = this.$t("LoginScreen.SMS_SENT")
              this.chngpassword.showerr = true
              this.chngpassword.errType = "success"
              this.chngpassword.verification_code_sent = true
            } else if (msg === PASSWORD_RESET_SUCCESS) {
              this.chngpassword.errors = this.$t(
                "LoginScreen.PASSWORD_RESET_SUCCESS"
              )
              this.chngpassword.showerr = true
              this.chngpassword.errType = "success"
              this.$refs.form.reset()
              this.goback()
            } else {
              this.chngpassword.errors = this.$t("Errors.ACCOUNT_NOT_FOUND")
              this.chngpassword.showerr = true
              this.chngpassword.errType = "error"
            }
          })
          .catch((response) => {
            let errormsg = response.data.message
            if (errormsg === NO_COMPANY_FOUND) {
              this.chngpassword.errors = this.$t("Errors.NO_COMPANY_FOUND")
            } else {
              this.chngpassword.errors = this.$t("Errors.ACCOUNT_NOT_FOUND")
            }
            this.chngpassword.errType = "error"
            this.chngpassword.showerr = true
          })
      }
    },
    /** Change Password validations  */
    agreerule(value) {
      const regexp = /^\d{9,}$/
      if (!value) {
        return this.$t("LoginScreen.PHONE_REQUIRED")
      }
      if (!regexp.test(value)) {
        return this.$t("LoginScreen.PHONE_VALID")
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
  },
  components: {
    alert,
    AppFooter,
  },
}
</script>
