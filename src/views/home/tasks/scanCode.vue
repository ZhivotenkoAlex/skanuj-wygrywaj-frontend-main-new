<template>
  <v-card flat tile>
    <v-toolbar
      dense
      :color="config.mcolor"
      :style="`color:${config.mfontcolor} !important`"
      flat
    >
      <v-btn
        icon
        class="border0px"
        @click="navigate"
        :style="`color:${config.mfontcolor} !important`"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon
        class="border0px"
        @click="navigatehome"
        :style="`color:${config.mfontcolor} !important`"
      >
        <v-icon>mdi-home-circle-outline</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-title>
      <v-row>
        <v-col cols="8" md="10">
          <div
            :style="`color:${config.mfontcolor} !important`"
            v-text="$t('TaskScreen.SCAN_QR')"
          ></div>
        </v-col>
        <v-col cols="4" md="2">
          <v-btn
            v-if="!scanerror"
            block
            :style="`color:${config.mfontcolor} !important`"
            :color="config.mcolor"
            @click="changeTab"
            v-text="$t('TaskScreen.SCAN')"
          ></v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-tabs
      v-model="tabs"
      grow
      :color="config.mcolor"
      :style="`color:${config.mfontcolor} !important`"
      class="hidearrows"
    >
      <v-tab
        href="#tab1"
        :style="`color:${config.mfontcolor} !important`"
        class="fontsize7"
        v-text="$t('TaskScreen.WHAT_YOU_GET')"
      ></v-tab>
      <v-tab
        href="#tab2"
        :style="`color:${config.mfontcolor} !important`"
        v-text="$t('TaskScreen.TASKS')"
      ></v-tab>
      <v-tab
        href="#tab3"
        :style="`color:${config.mfontcolor} !important`"
        v-text="$t('TaskScreen.HISTORY')"
      ></v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item value="tab1">
        <taskinfo :tasktype="C_QR_SCAN" :taskId="id"></taskinfo>
      </v-tab-item>
      <v-tab-item value="tab2">
        <v-container v-if="!scanerror && !showScan" class="text-center mt-10">
          <v-btn icon class="mb-12" ripple>
            <v-icon size="60" :color="config.mcolor">mdi-information</v-icon>
          </v-btn>
          <div
            class="font-weight subtitle-2"
            :style="`color:${config.mfontcolor} !important`"
            v-text="$t('TaskScreen.CLICK_TO_SCAN_QRCODE')"
          ></div>
        </v-container>
        <v-container v-if="showScan && !scanerror" class="text-center mt-10">
          <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>
        </v-container>
        <p class="error subtitle-1 ma-6 pa-4 white--text" v-if="scanerror">
          {{ errorMessage }}
        </p>
        <alert
          :errorMessage="scanErrorMessage"
          :alert="scanErrorExists"
          :errorType="scanErrorType"
        ></alert>
      </v-tab-item>
      <v-tab-item value="tab3">
        <taskhistory :tasktype="C_QR_SCAN"></taskhistory>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import {
  QR_SCAN,
  BARCODE_ALREADY_USED,
  YOU_HAVE_SCANNED_THIS_BARCODE_ALREADY,
} from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
import auth from "@/core/auth"
import { QrcodeStream } from "vue-qrcode-reader"
import taskinfo from "@/components/tasks/taskInfo"
import taskhistory from "@/components/tasks/taskHistory"
import alert from "@/components/shared/errorAlert"
export default {
  data() {
    return {
      id: 0,
      tabs: "tab-1",
      decodedContent: "",
      errorMessage: "",
      config: {},
      scanErrorMessage: "",
      scanErrorExists: false,
      scanErrorType: "error",
      showScan: false,
      scanerror: false,
      C_QR_SCAN: QR_SCAN,
    }
  },
  components: {
    QrcodeStream,
    taskinfo,
    taskhistory,
    alert,
  },
  created() {
    this.id = this.$route.params.id
    this.setupLayout()
  },
  methods: {
    /** click the start to navigate to tab 2 */
    changeTab() {
      this.tabs = "tab2"
    },
    /** Navigate to previous url */
    navigate() {
      this.$router.go(-1)
    },
    /** Navigate to home page */
    navigatehome() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "home",
        query: { company_name: passedCompanyId },
      })
    },
    /** Whether the scanner can parse the Qrcode */
    passBarcode() {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .sendBarCode(token, passedCompanyId, this.id, this.decodedContent)
        .then((result) => {
          console.log(result)
          this.showScan = false
          this.scanErrorExists = true
          this.scanErrorType = "success"
          this.scanErrorMessage = this.$t(
            "TaskScreen.BAR_CODE_SCANNED_SUCCESSFULLY"
          )
        })
        .catch((err) => {
          this.scanErrorExists = true
          this.scanErrorType = "error"
          let msg = err.data.message
          if (msg === BARCODE_ALREADY_USED) {
            this.scanErrorMessage = this.$t("Errors.BARCODE_ALREADY_USED")
          } else if (msg === YOU_HAVE_SCANNED_THIS_BARCODE_ALREADY) {
            this.scanErrorMessage = this.$t(
              "Errors.YOU_HAVE_SCANNED_THIS_BARCODE_ALREADY"
            )
          } else {
            this.scanErrorMessage = this.$t(
              "Errors.ERROR_OCCURRED_BARCODE_SCAN"
            )
          }
        })
    },
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
      }
    },
    /** When the js decode the content */
    onDecode(content) {
      this.decodedContent = content
      this.passBarcode()
    },
    /** Load the camera app to scan the qr code */
    onInit(promise) {
      promise
        .then(() => {
          this.scanerror = false
        })
        .catch((error) => {
          this.scanerror = true
          if (error.name === "NotAllowedError") {
            this.errorMessage = this.$t("TaskScreen.CAMERA_ACCESS_NOT_ALLOWED")
          } else if (error.name === "NotFoundError") {
            this.errorMessage = this.$t("TaskScreen.NO_CAMERA_FOUND")
          } else if (error.name === "NotSupportedError") {
            this.errorMessage = this.$t("TaskScreen.CAMERA_COMMON_ISSUE")
            //"Seems like this page is served in non-secure context";
          } else {
            this.errorMessage = this.$t("TaskScreen.CAMERA_COMMON_ISSUE")
          }
        })
    },
  },
}
</script>
