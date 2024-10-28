<template>
  <v-card flat tile style="background: #fff0">
    <v-btn
      v-if="isButton"
      :style="`background-color:${config.mcolor}`"
      id="receipt-action-btn"
      @click="choose"
    >
      {{ $t("AppScreen.SCAN") }}
    </v-btn>
    <button
      v-else
      :style="`background-color:transparent`"
      class="white--text text-h6 btn"
      @click="choose"
    >
      <v-icon class="icon">mdi-check-bold</v-icon>
      <span class="button_title">{{ $t("AppScreen.BILL_TYPE") }}</span>
    </button>
    <form enctype="multipart/form-data" novalidate>
      <input
        style="display: none"
        type="file"
        id="file"
        multiple
        name="files[]"
        accept="image/jpeg,image/png,application/pdf,.pdf,.jpg,.png"
        class="input-file"
        @change="onFileChange"
      />
    </form>

    <component
      :is="progressComponent"
      v-bind="receiptProcessingStatus"
      @progress-modal-hide="progressModalHide"
      v-if="status < 0"
    >
    </component>

    <successModal
      @success-modal-hide="successModalHide"
      @open-game="openGame"
      v-if="status === 1"
      :receiptProcessingResultStatus="receiptProcessingResultStatus"
    ></successModal>
    <errorModal
      @error-modal-hide="errorModalHide"
      @send-manual-verification="sendManualVerification()"
      v-if="status === 2"
      :errorMessage="scanErrorMessage"
      :id="id"
    ></errorModal>
    <awaitingModal
      @awaiting-modal-hide="manualModalHide"
      v-if="status === 3"
    ></awaitingModal>
    <!--        <infoModal @error-modal-hide="errorModalHide" v-if="scanErrorExists && scanErrorType == 'info'" :errorMessage="scanErrorMessage"></infoModal>-->
    <!--        <rejectedModal @rejected-modal-hide="rejectedModalHide" v-if="status >= 3 && status != 6 && !scanErrorExists" :receiptProcessingResultStatus="receiptProcessingResultStatus"></rejectedModal>-->
    <!--        <correctionModal @correction-modal-hide="correctionModalHide" @correction-modal-next="correctionModalNext" @correction-modal-mark="correctionModalMark" v-if="status == 6 && !scanErrorExists"></correctionModal>-->
    <!--        <awaitingModal @awaiting-modal-hide="awaitingModalHide" v-if="status == 11 && !scanErrorExists"></awaitingModal>-->
  </v-card>
</template>
<script>
const MAX_IMAGE_SIZE = 5242880

import $ from "jquery"
// import correctionModal from "../../../components/tasks/scan_modals/correctionModal";
import errorModal from "../../../components/tasks/scan_modals/errorModal.vue"
import progressModal from "../../../components/tasks/scan_modals/progressModal.vue"
// import rejectedModal from "@/components/tasks/scan_modals/rejectedModal";
import successModal from "../../../components/tasks/scan_modals/successModal.vue"
import awaitingModal from "../../../components/tasks/scan_modals/awaitingModal.vue"

import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
import receipts_api from "@/services/receiptapi"
import auth from "@/core/auth"
import config from "@/variable"

window.$ = window.jQuery = $

export default {
  data() {
    return {
      status: 0, // -3 processing; 0 - nothing; 1 - finished with success; 2 - finished with error; 3 - marked for manual review
      is_processed: 0,
      id: 0,
      task: [],
      tabs: "tab-1",
      config: {},
      scanErrorMessage: "",
      scanErrorExists: false,
      scanErrorType: "error",
      receiptProcessingResultStatus: "",
      correctionModalVisible: false,
      errorModalVisible: false,
      progressModalVisible: false,
      rejectedModalVisible: false,
      successModalVisible: false,
      image: "",
      storageUrl: "",
      imageUrl: "",
      nip: "",
      number: "",
      date: "",
      sum: "",
      is_matched: false,
      products: [],
      incentives: [],
      original_width: 0,
      original_height: 0,
      cancel_poll: 0,
      is_finished: 0,
      upload_extension: "jpg",
      upload_content_type: "image/jpeg",
      process_percent: 0,
      process_text: "",
    }
  },
  props: {
    gamificationId: {
      type: [String, null],
      required: true,
    },
    isButton: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  components: {
    // correctionModal,
    errorModal,
    progressModal,
    // rejectedModal,
    successModal,
    awaitingModal,
  },
  created() {
    this.setupLayout()
    this.getTaskInfo()
  },

  computed: {
    progressComponent() {
      if (this.isCompanyCola()) {
        return () =>
          import(`@/components/tasks/scan_modals/cola/progressModal.vue`)
      }
      return () => import(`@/components/tasks/scan_modals/progressModal.vue`)
    },
    receiptProcessingStatus() {
      return { text: this.process_text, percent: this.process_percent }
    },
  },
  methods: {
    closeAllModals() {
      this.status = 0
    },
    correctionModalHide() {
      this.status = 0
      this.id = 0
      // TODO: fire event that correction cancelled
    },
    correctionModalNext() {
      this.status = 0
      $("#file").click()
    },
    // correctionModalMark () {
    //   this.status = -1
    //   const passedCompanyId = companyconfig.getCompanyIdfromUrl();
    //     let token = auth.getAccessToken();
    //     let self = this
    //     receipts_api
    //         .mark(token, passedCompanyId, this.id)
    //         .then(result => {
    //             let response = result.data;
    //             if (response.status == 200) {
    //                 this.status = 11;
    //                 this.id = 0
    //             }  else {
    //                 this.status = 0
    //                 this.id = 0
    //                 console.log(response)
    //                 self.showErrorModal(this.$t('TaskScreen.MANUAL_CHECK_ERROR'))
    //             }
    //         })
    //         .catch(err => {
    //             this.status = 0
    //             this.id = 0
    //             self.showErrorModal(this.$t('TaskScreen.MANUAL_CHECK_ERROR'));
    //             console.log(err)
    //         });
    // },
    correctionDone() {
      // TODO: call correction endpoint
    },
    errorModalHide(goHome = true) {
      this.scanErrorExists = false
      this.status = 0
      if (goHome) {
        this.navigatehome()
      }
    },
    showModalManualResult() {
      this.status = 3
    },
    manualModalHide(goHome = true) {
      this.scanErrorExists = false
      this.status = 0
      if (goHome) {
        this.navigatehome()
      }
    },
    awaitingModalHide() {
      this.status = 0
      this.id = 0
    },
    progressModalHide() {
      self.cancel_poll = 1
      this.status = 0
      this.id = 0
    },
    /* eslint-disable */
    successModalHide() {
      this.status = 0
      this.navigatehome()
    },
    /* eslint-enable */
    /**
     * Get the task details based on the task id
     */
    getTaskInfo() {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getTaskById(token, passedCompanyId, this.gamificationId)
        .then((result) => {
          let response = result.data
          if (response.data) {
            this.task = response.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
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
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "rewardLayout", data.rewardLayout)
      }
    },
    choose() {
      console.info("> Choose clicked.")
      $("#file").click()
    },
    onFileChange(e) {
      console.info(e)
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.status = -3
      this.createImage(files[0])
    },
    createImage(file) {
      let reader = new FileReader()
      reader.onload = (e) => {
        if (
          e.target.result.includes("data:image/jpeg") ||
          e.target.result.includes("data:image/jpg")
        ) {
          this.upload_extension = "jpg"
          this.upload_content_type = "image/jpeg"
        } else if (e.target.result.includes("data:image/png")) {
          this.upload_extension = "png"
          this.upload_content_type = "image/png"
        } else if (e.target.result.includes("data:application/pdf")) {
          this.upload_extension = "pdf"
          this.upload_content_type = "application/pdf"
        } else {
          this.status = 0
          this.showErrorModal(this.$t("TaskScreen.SCAN_WRONG_FORMAT"))
          return
        }

        if (e.target.result.length > MAX_IMAGE_SIZE) {
          this.status = 0
          this.showErrorModal(this.$t("TaskScreen.SCAN_IMAGE_TOO_MUCH"))
          return
        }

        this.image = e.target.result
        this.uploadFile()
      }

      reader.readAsDataURL(file)
    },
    hideErrorModal() {
      this.scanErrorExists = false
    },
    showErrorModal(text) {
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "receipt_scan",
          value: "scanError",
        })
      }

      this.status = 2
      this.scanErrorExists = true
      this.scanErrorType = "error"
      this.scanErrorMessage = text
    },
    showInfoModal(text) {
      this.scanErrorExists = true
      this.scanErrorType = "info"
      this.scanErrorMessage = text
    },
    uploadFile() {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let self = this
      this.billProcessCallback(10, "ROZPOCZYNANIE WYSYŁANIA...")
      receipts_api
        .storage(
          token,
          passedCompanyId,
          this.gamificationId,
          this.upload_extension
        )
        .then((result) => {
          this.billProcessCallback(30, "POBIERANIE DANYCH")
          let response = result.data
          if (response.status == 200) {
            // OK
            self.id = response.rid
            self.storageUrl = response.storage_url
            let binary = atob(self.image.split(",")[1])
            let array = []
            for (var i = 0; i < binary.length; i++) {
              array.push(binary.charCodeAt(i))
            }
            let blobData = new Blob([new Uint8Array(array)], {
              type: this.upload_content_type,
            })
            console.info("Uploading to: ", self.storageUrl)
            let dofetch = async function () {
              // const result =
              await fetch(self.storageUrl, {
                method: "PUT",
                body: blobData,
              })
              // console.log(result)
              // TODO: check result of upload
              self.startProcessing()
            }
            dofetch()
          } else {
            console.info(response)
            this.status = 0
            this.id = 0
            // TODO: move to translated texts, translate to CZK
            self.showErrorModal(this.$t("TaskScreen.SCAN_ERROR_UPLOAD"))
          }
        })
        .catch((err) => {
          console.error(err)
          let errormsg = err.data.message
          console.error(errormsg)
          self.showErrorModal(this.$t("TaskScreen.SCAN_ERROR_CANT_START"))
          // this.showError("Error while uploading.")
        })
    },
    startProcessing() {
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "receipt_scan",
          value: "start",
        })
      }
      this.billProcessCallback(60, "KOLEJKOWANIE DO PRZETWORZENIA...")
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let self = this
      receipts_api
        .process(token, passedCompanyId, this.id)
        .then((result) => {
          let response = result.data
          if (response.status == 200) {
            console.info("processing started")
            self.waitWithPoll()
          } else {
            console.info(response)
            this.status = 0
            self.showErrorModal(this.$t("TaskScreen.SCAN_ERROR_CANT_START"))
          }
        })
        .catch((err) => {
          let errormsg = err.data.message
          console.error(errormsg)
          self.showError("Error while trying to start processing.")
          console.error(err)
        })
    },
    waitWithPoll() {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let self = this

      if (this.process_percent < 97) {
        this.process_percent += 2
      }
      receipts_api
        .poll(token, passedCompanyId, this.id)
        .then((result) => {
          this.billProcessCallback(this.process_percent, "WERYFIKACJA")
          // api.createInfopage(token, passedCompanyId)
          let response = result.data
          if (self.cancel_poll > 0) {
            console.info("Cancelled poll.")
            self.cancel_poll = 0
          }
          if (response.status == 200) {
            console.info("received poll result")
            console.info(response)
            self.is_processed = parseInt(response.is_processed)
            self.is_finished = parseInt(response.is_finished)
            self.is_success = parseInt(response.is_success)
            self.nip = response.nip
            self.number = response.number
            self.date = response.date
            self.sum = response.sum
            self.products = response.products
            self.original_width = response.original_width
            self.original_height = response.original_height
            if (self.is_finished === 0) {
              if (self.is_processed === 1) {
                receipts_api
                  .finish(token, passedCompanyId, this.id)
                  .then((result) => {
                    this.billProcessCallback(100, "ZAKOŃCZONO")
                    let response = result.data
                    console.info(response)
                  })
              }
              setTimeout(self.waitWithPoll, 500)
            } else {
              if (self.is_success === 1) {
                if (typeof window.gtag !== "undefined") {
                  window.gtag("event", "NEW_LOYALTY", {
                    event_category: "receipt_scan",
                    value: "success",
                  })
                }

                this.status = 1
                api.createInfopage(token, passedCompanyId)
              } else {
                if (typeof window.gtag !== "undefined") {
                  window.gtag("event", "NEW_LOYALTY", {
                    event_category: "receipt_scan",
                    value: "scanError",
                  })
                }

                this.status = 2
                this.scanErrorMessage = response.s
              }
            }
          } else {
            console.info(response)
            // TODO: move to translated texts, translate to CZK
            this.status = 0
            // self.showErrorModal(this.$t("TaskScreen.SCAN_ERROR_NO_RESULT"))
            self.showErrorModal(response.message)
          }
        })
        .catch((err) => {
          //let errormsg = err.data.message;
          //console.log(errormsg)
          //self.showError("Error while trying to check the result.")
          this.status = 0
          console.error(err)
        })
    },
    showReceiptProcessing() {
      this.closeAllModals()
      this.status = -1
      this.progressModalVisible = true
    },
    showReceiptError_nonretriable(status) {
      this.closeAllModals()
      this.receiptProcessingResultStatus = status
      this.rejectedModalVisible = true
    },
    openGame() {
      window.location.href =
        config.baseUrl +
        "/game/index?company_name=" +
        companyconfig.getCompanyIdfromUrl() +
        "&access_token=" +
        auth.getAccessToken()
    },
    sendManualVerification() {
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "receipt_scan",
          value: "sendToManualVerification",
        })
      }

      receipts_api
        .mark(
          auth.getAccessToken(),
          companyconfig.getCompanyIdfromUrl(),
          this.id
        )
        .then((result) => {
          console.info(result)
          this.errorModalHide(false)
          this.showModalManualResult()
        })
        .catch((err) => {
          this.status = 0
          this.id = 0
          self.showErrorModal(this.$t("TaskScreen.MANUAL_CHECK_ERROR"))
          console.error(err)
        })
    },
    isCompanyCola() {
      if (
        this.config.rewardLayout == "Cocacola" ||
        config.rewardLayout == "Cocacola2"
      ) {
        return true
      }
      return false
    },
    billProcessCallback(percent, text) {
      this.process_percent = percent
      this.process_text = text
    },
  },
  mounted() {
    if (!this.gamificationId) {
      this.navigatehome()
    }
  },
}
</script>
