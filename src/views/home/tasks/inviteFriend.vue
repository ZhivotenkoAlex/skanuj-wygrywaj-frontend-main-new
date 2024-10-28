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
            v-text="$t('TaskScreen.INVITE_FRIEND')"
          ></div>
        </v-col>
        <v-col cols="4" md="2">
          <v-btn
            block
            :style="`color:${config.mfontcolor} !important`"
            :color="config.mcolor"
            @click="changeTab"
            v-text="$t('TaskScreen.INVITE')"
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
        class="fontsize7"
        v-text="$t('TaskScreen.WHAT_YOU_GET')"
        :style="`color:${config.mfontcolor} !important`"
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
        <taskinfo :tasktype="C_INVITE" :taskId="id"></taskinfo>
      </v-tab-item>
      <v-tab-item value="tab2">
        <v-container v-if="showInvite" class="text-center">
          <div
            class="font-weight-light title ma-10"
            :style="`color:${config.mfontcolor} !important`"
            v-text="$t('TaskScreen.YOUR_INVITE_CODE')"
          ></div>
          <h2
            v-text="inviteCode"
            :style="`color:${config.mfontcolor} !important`"
            class="mb-12"
          ></h2>
          <v-btn
            icon
            class="mb-12"
            ripple
            v-clipboard:copy="inviteCode"
            v-clipboard:success="copied"
          >
            <v-icon size="60" :color="config.mfontcolor"
              >mdi-information</v-icon
            >
          </v-btn>
          <v-card
            dense
            v-if="isCopied"
            flat
            max-width="250"
            class="mx-auto mb-2 subtitle-2 text-center grey darken-3 white--text"
          >
            <span v-text="$t('TaskScreen.INVITE_CODE_COPIED')"></span>
          </v-card>
          <div
            class="font-weight subtitle-2"
            :style="`color:${config.mfontcolor} !important`"
            v-text="$t('TaskScreen.COPY_INVITE_CODE')"
          ></div>
        </v-container>
        <v-container v-if="!showInvite" class="text-center">
          <h4
            v-text="$t('TaskScreen.NO_INVITE_CODE')"
            class="error white--text mb-12"
          ></h4>
        </v-container>
      </v-tab-item>
      <v-tab-item value="tab3">
        <taskhistory :tasktype="C_INVITE"></taskhistory>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import { INVITE, NO_INVITE_CODE } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
import auth from "@/core/auth"
import taskinfo from "@/components/tasks/taskInfo"
import taskhistory from "@/components/tasks/taskHistory"
export default {
  data() {
    return {
      id: 0,
      tabs: "tab-1",
      config: {},
      inviteCode: "",
      showInvite: false,
      isCopied: false,
      C_INVITE: INVITE,
    }
  },
  components: {
    taskinfo,
    taskhistory,
  },
  created() {
    this.id = this.$route.params.id
    this.setupLayout()
    this.getInviteCode()
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
    /** Copy the invite code */
    copied() {
      this.isCopied = true
      let self = this
      setTimeout(() => {
        self.isCopied = false
      }, 3000)
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
    /** Load the invite code */
    getInviteCode() {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getInviteCode(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          if (response) {
            this.inviteCode = response.inviteCode
            this.showInvite = true
          }
        })
        .catch((err) => {
          let errmsg = err.data.message
          this.showInvite = false
          if (errmsg === NO_INVITE_CODE) {
            console.log(err)
          }
        })
    },
  },
}
</script>
<style>
.fontsize7 {
  font-size: 0.775rem !important;
}
</style>
