<template>
  <v-card flat tile>
    <v-list three-line v-if="tasktype === C_SURVEY && !invalidTask">
      <v-list-item>
        <v-list-item-avatar tile size="140" class="stroke">
          <v-icon size="140" :style="`color:${config.mcolor} !important`"
            >mdi-star-outline</v-icon
          >
          <div
            class="text-i-e-s"
            :style="`color:${config.mfontcolor} !important`"
            v-text="points1"
          ></div>
        </v-list-item-avatar>
        <v-list-item-content class="subtitle-1">
          {{ $t("TaskScreen.SURVEY_POINTS_YOU_GET", { point: points1 }) }}
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-avatar size="125" class="stroke">
          <v-icon size="110" :style="`color:${config.mcolor} !important`"
            >mdi-information-outline</v-icon
          >
        </v-list-item-avatar>
        <v-list-item-content
          class="subtitle-1"
          v-text="$t('TaskScreen.FILL_UP_SURVEY')"
        ></v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list three-line v-if="tasktype === C_INVITE && !invalidTask">
      <v-list-item v-if="points1 > 0">
        <v-list-item-avatar tile size="140" class="stroke">
          <v-icon size="140" :style="`color:${config.mcolor} !important`"
            >mdi-star-outline</v-icon
          >
          <div
            class="text-i-e-s"
            :style="`color:${config.mfontcolor} !important`"
            v-text="points1"
          ></div>
        </v-list-item-avatar>
        <v-list-item-content class="subtitle-1">
          {{ $t("TaskScreen.INVITE_USER", { point: points1 }) }}
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item v-if="points2 > 0">
        <v-list-item-avatar tile size="140" class="stroke">
          <v-icon size="140" :style="`color:${config.mcolor} !important`"
            >mdi-star-outline</v-icon
          >
          <div
            class="text-i-e-s"
            v-text="points2"
            :style="`color:${config.mfontcolor} !important`"
          ></div>
        </v-list-item-avatar>
        <v-list-item-content class="subtitle-1">
          {{ $t("TaskScreen.USER_REGISTERED", { point: points2 }) }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="infopages > 0">
        <v-list-item-avatar tile size="140" class="stroke">
          <v-icon size="140" :style="`color:${config.mcolor} !important`"
            >mdi-star-outline</v-icon
          >
          <div
            class="text-i-e-s"
            v-text="infopages"
            :style="`color:${config.mfontcolor} !important`"
          ></div>
        </v-list-item-avatar>
        <v-list-item-content class="subtitle-1">
          {{ $t("TaskScreen.INVITE_USER_INFOPAGE", { infopages: infopages }) }}
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list three-line v-if="tasktype === C_QR_SCAN && !invalidTask">
      <v-list-item>
        <v-list-item-avatar tile size="140" class="stroke">
          <v-icon size="140" :style="`color:${config.mcolor} !important`"
            >mdi-star-outline</v-icon
          >
          <div
            class="text-i-e-s"
            :style="`color:${config.mfontcolor} !important`"
            v-text="points1"
          ></div>
        </v-list-item-avatar>
        <v-list-item-content class="subtitle-1">
          {{ $t("TaskScreen.SCAN_QRCODE", { point: points1 }) }}
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list three-line v-if="tasktype === C_BILL && !invalidTask">
      <v-list-item>
        <v-list-item-avatar tile size="140" class="stroke">
          <v-icon size="140" :style="`color:${config.mcolor} !important`"
            >mdi-star-outline</v-icon
          >
          <div
            class="text-i-e-s"
            :style="`color:${config.mfontcolor} !important`"
            v-text="points1"
          ></div>
        </v-list-item-avatar>
        <v-list-item-content class="subtitle-1">
          {{ $t("TaskScreen.SCAN_QRCODE", { point: points1 }) }}
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-card-title
      v-text="$t('TaskScreen.INVALID_TASK')"
      class="error white--text"
      v-if="invalidTask"
    ></v-card-title>
  </v-card>
</template>
<script>
import {
  INVITE,
  SURVEY,
  QR_SCAN,
  BILL,
  NO_COMPANY_TASK_DETAILS_FOUND,
} from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
import auth from "@/core/auth"
export default {
  data() {
    return {
      config: {},
      points1: 0,
      points2: 0,
      infopages: 0,
      invalidTask: false,
      C_SURVEY: SURVEY,
      C_INVITE: INVITE,
      C_QR_SCAN: QR_SCAN,
      C_BILL: BILL,
    }
  },
  props: {
    tasktype: {
      type: String,
      default: INVITE,
    },
    taskId: String,
  },
  created() {
    this.setupLayout()
    this.getTaskInfo()
  },
  methods: {
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
    /**
     * Get the task details based on the task id
     */
    getTaskInfo() {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getTaskById(token, passedCompanyId, this.taskId)
        .then((result) => {
          let response = result.data
          if (response.data) {
            this.points1 = parseInt(response.data.points)
            if (this.tasktype === INVITE) {
              this.points2 = parseInt(response.data.new_user_points)
              this.infopages = parseInt(response.data.add_infopages_numbers)
            }
          }
        })

        .catch((err) => {
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_TASK_DETAILS_FOUND) {
            this.invalidTask = true
            let self = this
            setTimeout(() => {
              let passedCompanyId = companyconfig.getCompanyIdfromUrl()
              self.$router.push({
                name: "home",
                query: { company_name: passedCompanyId },
              })
            }, 2000)
          }
          this.console.log(err)
        })
    },
  },
}
</script>
<style>
.text-i-e-s {
  text-align: center;
  position: absolute;
  font-size: 1.5rem;
}
.stroke i {
  -webkit-text-stroke: 6px #fff;
}
</style>
