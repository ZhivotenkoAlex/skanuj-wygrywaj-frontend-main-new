<template>
  <div class="root">
    <v-container class="content">
      <transition
        name="fade"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <template v-if="isDescriptionShown">
          <v-card>
            <v-tabs fixed-tabs>
              <v-tab
                style="border-top-left-radius: 5px"
                :style="`background-color:${
                  results.length > 0 ? config.pcolor + '4d' : config.pcolor
                };`"
                class="tabs"
                :key="1"
              >
                <div style="display: flex; flex-direction: row; gap: 5px">
                  <v-icon size="15px" color="white">mdi-barcode</v-icon>
                  <span class="tab_title">{{ $t("TaskScreen.CODE") }}</span>
                </div>
              </v-tab>
              <v-tab
                :style="`background-color:${
                  results.length > 0 ? config.pcolor + '4d' : config.pcolor
                };`"
                class="tabs"
                :key="2"
              >
                <div style="display: flex; flex-direction: row; gap: 5px">
                  <v-icon size="15px" color="white">mdi-email</v-icon>
                  <span class="tab_title">E-mail</span>
                </div>
              </v-tab>
              <v-tab
                :style="`background-color:${
                  results.length > 0 ? config.pcolor + '4d' : config.pcolor
                }; border-top-right-radius: 5px;`"
                class="tabs"
                :key="3"
                ><div style="display: flex; flex-direction: row; gap: 5px">
                  <v-icon size="15px" color="white">mdi-link</v-icon>
                  <span class="tab_title">Link</span>
                </div>
              </v-tab>
              <v-tab-item v-for="n in 3" :key="n">
                <v-card flat>
                  <v-card-text v-if="n === 1">
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        justify-content: space-around;
                        padding: 16px;
                      "
                    >
                      <div
                        style="
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                        "
                      >
                        <p
                          :style="`color:${config.mfontcolor}; font-size:16px; padding-bottom:16px;`"
                        >
                          {{ $t("TaskScreen.YOUR_INVITE_CODE") }}:
                        </p>
                        <p
                          :style="`color:${config.mfontcolor};font-weight:bold;font-size:14px;padding-bottom:16px;`"
                        >
                          {{ inviteCode }}
                        </p>
                        <v-btn
                          :style="`background-color:${config.mcolor}`"
                          class="ml-2"
                          height="25px"
                          @click="copyCodeToClipboard"
                        >
                          {{ $t("TaskScreen.COPY_INVITE_CODE") }}
                        </v-btn>
                      </div>
                    </div>
                  </v-card-text>
                  <v-card-text v-if="n === 2">
                    <div
                      :style="`color:${config.mfontcolor};display: flex;flex-direction: column;align-items: center;gap: 10px;justify-content: space-around; padding:10px;`"
                    >
                      <p style="font-size: 16px; padding-bottom: 16px">
                        {{ $t("TaskScreen.SEND_INVITE_CODE_EMAIL") }}
                      </p>
                      <v-card
                        :style="`padding: 10px; border: 1px solid ${config.mfontcolor}`"
                      >
                        <v-card-text
                          style="font-weight: 700"
                          v-html="email_subject"
                        />
                        <v-card-text v-html="email_body" />
                      </v-card>
                      <p style="text-align: center">
                        {{ $t("TaskScreen.SEND_EMAIL_DESCRIPTION") }}
                      </p>
                      <v-text-field
                        solo
                        data-test="email"
                        id="invite-email"
                        name="inviteEmail"
                        type="text"
                        autocomplete="off"
                        v-model="emailToSend"
                        style="width: 300px"
                        class="link"
                        ref="inviteEmail"
                        :placeholder="
                          $t('TaskScreen.EMAIL_PLACEHOLDER') + '...'
                        "
                        :rules="[
                          (value) => {
                            return emailRule(value)
                          },
                        ]"
                      ></v-text-field>
                      <v-btn
                        :style="`background-color:${config.mcolor}`"
                        class="ml-2"
                        height="25px"
                        @click="sendEmail"
                      >
                        {{ $t("TaskScreen.SEND") }}
                      </v-btn>
                    </div>
                  </v-card-text>
                  <v-card-text v-if="n === 3">
                    <div
                      style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                        justify-content: space-around;
                        padding: 16px;
                      "
                    >
                      <!-- <v-icon :color="config.mfontcolor"
                        >mdi-help-circle</v-icon
                      > -->
                      <p
                        :style="`color:${config.mfontcolor};font-size:16px; padding-bottom:10px;`"
                      >
                        {{ $t("TaskScreen.LINK_TO_COPY") }}:
                      </p>
                      <v-text-field
                        solo
                        data-test="link"
                        id="invite-link"
                        name="inviteLink"
                        type="text"
                        autocomplete="off"
                        v-model="inviteLink"
                        style="width: 300px"
                        class="link"
                        ref="inviteTextField"
                      ></v-text-field>
                      <v-btn
                        :style="`background-color:${config.mcolor}`"
                        class="ml-2"
                        height="25px"
                        @click="copyLinkToClipboard"
                      >
                        {{ $t("TaskScreen.COPY_INVITE_LINK") }}
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </template>
      </transition>
      <alert
        :errorMessage="errors"
        :alert="showerror"
        :errorType="errType"
        :dismissible="false"
      ></alert>
    </v-container>
  </div>
</template>

<script>
import {
  // GamificationIcons,
  GamificationType,
  // GamificationButtonTitles,
  GamificationInfo,
  GamificationRules,
} from "@/appConstants"
import api from "@/services/fetchapi"
import auth from "@/core/auth"
// import Vue from "vue"
import { lang_points } from "@/helpers/lang_points"
import companyconfig from "@/core/companyconfig"
// import Receipt from "@/views/home/tasks/receipt.vue"
import alert from "@/components/shared/errorAlert"
export default {
  components: {
    // Receipt,
    alert,
  },
  data() {
    return {
      isDescriptionShown: true,
      tab: "one",
      surveyName: "",
      results: [],
      type: this.gamification.type,
      config: {},
      GamificationType,
      inviteLink: "",
      email_body: "",
      email_subject: "",
      emailToSend: "",
      user: null,
      showerror: false,
      errors: "",
      errType: "success",
      timeoutId: null,
      isSendActive: true,
    }
  },
  props: {
    titleObject: {
      type: Object,
      required: true,
    },
    gamification: {
      type: Object,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    inviteCode: {
      type: String,
      required: false,
      default: "",
    },
  },
  async mounted() {
    await this.getUserInfo().then((res) => {
      this.generateInvitationEmail(res, this.gamification, this.inviteLink)
    })
  },
  created() {
    this.setupLayout()
    this.getLink()
  },
  computed: {
    getInfo() {
      return GamificationInfo[this.type]
    },
    getRules() {
      return GamificationRules[this.type]
    },
  },
  methods: {
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "rewardLayout", data.rewardLayout)
        this.$set(this.config, "pcolor", data.primary_color)
      }
    },
    getLink() {
      const hostname = window.location.hostname
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      const link = `https://${hostname}/signup?company_name=${passedCompanyId}&inviteCode=${this.inviteCode}`
      this.inviteLink = link
    },
    langPoints(num) {
      const result = lang_points(num, this.$t("AppScreen.POINT"))
      return `${num} ${result}`
    },
    beforeEnter(el) {
      el.style.maxHeight = "0"
    },
    enter(el, done) {
      el.style.maxHeight = el.scrollHeight * 6 + "px"
      el.style.opacity = "0"
      setTimeout(() => {
        el.style.opacity = "1"
        done()
      }, 300)
    },
    leave(el, done) {
      el.style.maxHeight = "0"
      el.style.opacity = "1"
      setTimeout(() => {
        el.style.opacity = "0"
        done()
      }, 300)
    },
    setNotification() {
      this.showerror = true
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }
      this.timeoutId = setTimeout(() => {
        this.showerror = false
        this.timeoutId = null
      }, 2000)
    },
    async copyCodeToClipboard() {
      try {
        await navigator.clipboard.writeText(this.inviteCode)
        this.errors = this.$t("TaskScreen.CODE_COPIED")
        this.errType = "success"
        this.setNotification()
      } catch (err) {
        console.error("Failed to copy: ", err)
      }
    },
    async copyLinkToClipboard() {
      try {
        await navigator.clipboard.writeText(this.inviteLink)
        this.errors = this.$t("TaskScreen.LINK_COPIED")
        this.errType = "success"
        this.setNotification()
      } catch (err) {
        this.errors = this.$t("Errors.ERROR_COPYING")
        this.errType = "error"
        this.setNotification()
      }
    },
    sendEmail() {
      if (this.isSendActive === false) {
        this.errors = this.emailRule(this.emailToSend)
        this.errType = "error"
        this.setNotification()
        return
      }
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()

      api
        .sendEmail(
          passedCompanyId,
          this.emailToSend,
          this.email_subject,
          this.email_body
        )
        .then((result) => {
          let response = result.data
          if (response.status === 200) {
            this.errors = this.$t("TaskScreen.EMAIL_SENT_SUCCESS")
            this.errType = "success"
            this.setNotification()
          } else {
            // errors from server
            // SENDING_FAILED
            // EMAIL_REQUIRED
            this.errors = this.$t(`Errors.${response.message}`)
            this.errType = "error"
            this.setNotification()
          }
        })
        .catch(() => {
          this.errors = this.$t("Errors.ERROR_SENDING_EMAIL")
          this.errType = "error"
          this.setNotification()
        })
    },
    async generateInvitationEmail(user, gamification, url, targetNew = false) {
      let company = companyconfig.getCompanyScheme()
      const placeholders = [
        "%U%", // 1. user full name
        "%P%", // 2. points for target user
        "%L%", // 3. link
        "%C%", // 4. company name
        "%T%", // 5. Type (product or points)
      ]

      let replaces

      if (gamification.product_id > 0) {
        replaces = [
          user ? user.full_name : "user", // 1.
          gamification.new_user_points, // 2.
          url
            ? `<a href="${url}"${targetNew ? ' target="_blank"' : ""}>link</a>`
            : "[LINK]", // 3.
          company.name, // 4.
          "", // 5.
        ]
      } else {
        replaces = [
          this.user ? this.user.full_name : "user", // 1.
          gamification.new_user_points, // 2.
          url
            ? `<a href="${url}"${targetNew ? ' target="_blank"' : ""}>link</a>`
            : "[LINK]", // 3.
          company.name, // 4.
          "", // 5.
        ]
      }
      const subject = this.replacePlaceholders(
        gamification.reg_email_title,
        placeholders,
        replaces
      )
      const body = this.replacePlaceholders(
        gamification.reg_email_text,
        placeholders,
        replaces
      )
      this.email_body = body
      this.email_subject = subject
      return [subject, body]
    },
    replacePlaceholders(text, placeholders, replaces) {
      let result = text
      placeholders.forEach((placeholder, index) => {
        result = result?.replace(new RegExp(placeholder, "g"), replaces[index])
      })
      return result
    },
    async getUserInfo() {
      const token = auth.getAccessToken()
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      const result = await api.getUserAddress(token, passedCompanyId)
      let response = result.data

      if (response.data) {
        let data = response.data

        this.user = data
        return data
      }
    },
    emailRule(value) {
      const regexp =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!value) {
        this.isSendActive = false
        return this.$t("LoginScreen.EMAIL_REQUIRED")
      } else if (!regexp.test(value)) {
        this.isSendActive = false
        return this.$t("LoginScreen.EMAIL_VALID")
      }
      this.isSendActive = true
      return true
    },
  },
}
</script>
<style scoped>
.root {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.icon_container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  z-index: 1;
}

p {
  margin: 0;
}

.v-card__text > p,
.v-card__text > div {
  font-size: 10px;
  margin: 0;
}

.v-card__text {
  font-size: 10px;
  padding: 0px;
}

.v-application p {
  margin-bottom: 0 !important;
}

.product-description > p {
  font-size: 10px !important;
}

.button_container {
  display: flex;
  justify-content: space-between;
}

.btn {
  box-shadow: none;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.v-slide-group {
  flex-wrap: wrap;
}

.btn:disabled {
  cursor: not-allowed;
}

.button_title {
  text-transform: capitalize;
  font-size: 14px;
  font-weight: 700;
  text-wrap: balance;
  /* max-width: 115px; */
}

.tab_title {
  white-space: nowrap;
  font-size: 10px;
  text-transform: capitalize;
}

.pkt_button_title {
  text-transform: lowercase;
  font-size: 18px;
  font-weight: 700;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  margin: 0 !important;
  padding: 0 !important;
}
.content {
  /* max-height: 450px; */
  max-width: 320px;
  overflow: hidden;
  opacity: 1;
  margin-top: 0px;
}

.top_container {
  height: 60px;
}
.tabs {
  color: white !important;
}
.v-tabs-slider {
  background-color: white !important;
}
.text-container {
  padding: 0px !important;
}

.v-tabs-bar {
  height: 55px;
}

.icon {
  color: white !important;
}

.separator {
  border-color: white !important;
}

.title {
  height: 40px;
}

.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none !important;
}
</style>
