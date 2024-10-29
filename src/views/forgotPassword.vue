<template>
  <v-main>
    <div
      style="position: absolute; top: 20px; right: 20px; cursor: pointer"
      @click="closeWindow"
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
            `color:` +
            config.mfontcolor +
            ` !important;font-size: 21px;margin-top: 15px;`
          "
          @click="goBack"
        >
          <v-icon :style="`font-size: 16px;color: ` + config.mfontcolor + `;`"
            >mdi-arrow-left</v-icon
          >
          {{ $t("LoginScreen.BACK_BTN") }}
        </v-btn>
        <v-col cols="12" align="center" justify="center">
          <v-tabs
            :color="config.mfontcolor"
            centered
            fixed-tabs
            hide-slider
            v-model="tab"
            :bg-color="config.mcolor"
          >
            <v-tab
              ripple
              value="forgotForm"
              v-text="$t('LoginScreen.FORGOT_PASSWORD')"
              class="monster-login-using"
            ></v-tab>
          </v-tabs>
          <v-tabs-window
            v-model="tab"
            :style="`background-color:${config.mcolor}`"
          >
            <v-tabs-window-item value="forgotForm">
              <v-card
                flat
                class="pt-10 monster-login-panel"
                :style="`background-color:#fff9`"
              >
                <v-form ref="formRef" v-model="chngpassword.valid">
                  <v-row justify="center">
                    <v-col cols="10">
                      <alert
                        :errorMessage="chngpassword.errors"
                        :errorType="chngpassword.errType"
                        :alert="chngpassword.showerr"
                      ></alert>

                      <v-text-field
                        solo
                        v-model="chngpassword.email"
                        :placeholder="$t('LoginScreen.EMAIL')"
                        persistent-hint
                        :rules="[
                          (value) => {
                            return agreeRule(value)
                          },
                        ]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-card-actions style="justify-content: center">
                    <!-- <v-flex class="text-center"> -->
                    <v-btn
                      block
                      @click="doChangePassword"
                      v-text="$t('LoginScreen.CHANGE_PASSWORD')"
                      class="login-form-btn"
                      :style="`color:#fff;background-color:${config.forgotbg};width: 100%`"
                    ></v-btn>
                    <!-- </v-flex> -->
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-col>
      </v-row>
    </v-container>
    <AppFooter> </AppFooter>
  </v-main>
</template>

<script>
import { ref, onMounted, reactive } from "vue"
import { useRouter } from "vue-router"
import { PASSWORD_RESET_SUCCESS, NO_COMPANY_FOUND } from "@/appConstants"
import loginapi from "@/services/loginapi"
import companyconfig from "@/core/companyconfig"
import alert from "@/components/shared/errorAlert"
import AppFooter from "@/components/parts/footerComponent"
import { useI18n } from "vue-i18n"

export default {
  components: {
    alert,
    AppFooter,
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const formRef = ref(null)
    const chngpassword = reactive({
      email: "",
      valid: true,
      errors: "",
      showerr: false,
      errType: "error",
    })
    const config = reactive({})
    const tab = ref("forgotForm")
    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        config.logo = data.logo_image
        config.forgotbg = data.Forgot_btn_bg || data.main_color
        config.forgotcolor = data.Forgot_btn_color
        config.cancelbg = data.Cancel_btn_bg
        config.cancelcolor = data.Cancel_btn_color
        config.logintabbg = data.Login_Tab_bg
        config.logintabcolor = data.Login_Tab_color
        config.line1 = data.login_text_1_line
        config.line2 = data.login_text_2_line
        config.mcolor = data.main_color
        config.mfontcolor = data.main_font_color
        config.pcolor = data.primary_color
        config.pfontcolor = data.primary_font_color
        config.background_color = data.background_color
        config.login_logo = data.login_logo
        config.custom_css = data.layout_custom_css
        config.login_pic = data.login_pic
      }
    }

    const goBack = () => {
      router.go(-1)
    }

    const doChangePassword = async () => {
      let isvalid = await formRef.value.validate()
      if (isvalid.valid) {
        chngpassword.showerr = false
        let url = companyconfig.getCompanyIdfromUrl()
        let isLegacyMode = companyconfig.isLegacyMode(url)
        loginapi
          .doPasswordChange(chngpassword.email, url, isLegacyMode)
          .then((response) => {
            let msg = response.data.message
            if (msg === PASSWORD_RESET_SUCCESS) {
              chngpassword.errors = t("LoginScreen.PASSWORD_RESET_SUCCESS")
              chngpassword.showerr = true
              chngpassword.errType = "success"
              formRef.value.reset()
              goBack()
            } else {
              chngpassword.errors = t("Errors.ACCOUNT_NOT_FOUND")
              chngpassword.showerr = true
              chngpassword.errType = "error"
            }
          })
          .catch((response) => {
            let errormsg = response.data.message
            if (errormsg === NO_COMPANY_FOUND) {
              chngpassword.errors = t("Errors.NO_COMPANY_FOUND")
            } else {
              chngpassword.errors = t("Errors.ACCOUNT_NOT_FOUND")
            }
            chngpassword.errType = "error"
            chngpassword.showerr = true
          })
      }
    }

    const agreeRule = (value) => {
      const regexp =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!value) {
        return t("LoginScreen.EMAIL_REQUIRED")
      }
      if (!regexp.test(value)) {
        return t("LoginScreen.EMAIL_VALID")
      }
      return true
    }

    const closeWindow = () => {
      parent.postMessage("close", "*")
    }

    onMounted(() => {
      setupLayout()
      const styleTag = document.createElement("style")
      styleTag.appendChild(document.createTextNode(config.custom_css))
      document.head.appendChild(styleTag)
    })

    return {
      chngpassword,
      config,
      tab,
      formRef,
      goBack,
      doChangePassword,
      agreeRule,
      closeWindow,
    }
  },
}
</script>
