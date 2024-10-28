<template>
  <v-card flat v-if="showTasks">
    <div
      class="title mt-2"
      :style="`color:${config.mfontcolor} !important`"
      v-if="config.taskLayout == 'Default' || config.taskLayout == 'PandG'"
    >
      {{ $t("AppScreen.TASKS_TITLE") }}
    </div>
    <v-row v-if="config.taskLayout == 'Default'">
      <v-col v-for="n in tasks" cols="12" md="4" :key="n.id">
        <v-card
          ripple
          raised
          outlined
          class="cardOutline col-xs-12"
          @click="taskRedirect(n.type, n.id)"
          :style="`border-color:${config.pcolor} !important;color:${config.pcolor} !important`"
        >
          <div class="text-center">
            <v-avatar size="100" tile class="justify-center">
              <v-icon
                v-if="n.type === C_INVITE"
                size="80"
                :style="`color:${config.mfontcolor} !important`"
                >mdi-email-open</v-icon
              >
              <v-icon
                v-if="n.type === C_QR_SCAN"
                size="80"
                :style="`color:${config.mfontcolor} !important`"
                >mdi-qrcode-scan</v-icon
              >
              <v-icon
                v-if="n.type === C_SURVEY"
                size="80"
                :style="`color:${config.mfontcolor} !important`"
                >mdi-clipboard-list</v-icon
              >
              <v-icon
                v-if="n.type === C_BILL"
                size="80"
                :style="`color:${config.mfontcolor} !important`"
                >mdi-qrcode-scan</v-icon
              >
            </v-avatar>
          </div>
          <v-card-title
            v-text="n.title"
            class="pt-0 justify-center"
          ></v-card-title>
          <v-card-subtitle
            v-text="n.subtitle"
            class="pb-0 text-center"
          ></v-card-subtitle>
          <v-card-text
            class="pb-0 subtitle-1 font-weight-bold"
            :style="`color:${config.pfontcolor} !important`"
          >
            <div class="d-flex justify-space-between">
              <div v-text="n.html"></div>
              <div v-text="getPoints(n.points)"></div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="config.taskLayout == 'PandG'">
      <v-col v-for="n in tasks" cols="12" md="4" :key="n.id">
        <v-card
          ripple
          outlined
          class="col-xs-12 cardOutline"
          @click="taskRedirect(n.type, n.id)"
          :style="`color:${config.pcolor} !important`"
        >
          <v-card-title class="pt-0 justify-center">
            <v-btn
              x-large
              rounded
              class="mt-3"
              :style="`background-image: linear-gradient(to bottom left, ${convertHex(
                config.mcolor
              )}, ${convertHex(config.mfontcolor)})`"
              v-text="n.title"
            >
            </v-btn>
          </v-card-title>
          <v-card-text
            class="pb-0 caption task-card-description"
            :style="`color:${config.pfontcolor} !important`"
          >
            <div class="d-flex justify-space-between text-justify">
              <div v-text="n.html" class="task-card-description-html"></div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card-text
      class="pa-0"
      id="task"
      v-if="config.taskLayout == 'Cocacola' || config.taskLayout == 'Cocacola2'"
    >
      <v-speed-dial
        v-model="fab"
        bottom
        :right="showFabRight"
        :left="!showFabRight"
        fixed
        direction="top"
        transition="scale-transition"
        :class="config.flexclass"
      >
        <template v-slot:activator>
          <v-btn
            v-model="fab"
            :color="`#000`"
            :style="`color:${config.mfontcolor} !important; border: 3px solid #fff;background: #1a1a1c; width: 70px; height: 70px; margin-bottom: 10px; margin-left: 10px;`"
            fab
          >
            <v-icon v-if="fab">mdi-plus</v-icon>
            <v-icon v-else>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-btn
          small
          :color="config.mcolor"
          :style="`color:${config.mfontcolor} !important;`"
          v-for="n in tasks"
          @click="taskRedirect(n.type, n.id)"
          :key="n.id"
        >
          <v-icon v-if="n.type === C_INVITE">mdi-email-open</v-icon>
          <v-icon v-if="n.type === C_QR_SCAN">mdi-qrcode-scan</v-icon>
          <v-icon v-if="n.type === C_SURVEY">mdi-clipboard-list</v-icon>
          <v-icon v-if="n.type === C_BILL">mdi-clipboard-list</v-icon>
          {{ n.title }}
        </v-btn>
      </v-speed-dial>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  SURVEY,
  INVITE,
  QR_SCAN,
  BILL,
  NO_COMPANY_FOUND,
  NO_COMPANY_TASK_FOUND,
} from "@/appConstants"
import api from "@/services/fetchapi"
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
export default {
  data() {
    return {
      tasks: [],
      model: "",
      config: {},
      fab: false,
      showTasks: false,
      C_SURVEY: SURVEY,
      C_INVITE: INVITE,
      C_QR_SCAN: QR_SCAN,
      C_BILL: BILL,
      showFabRight: false,
    }
  },
  created() {
    this.setupLayout()
    this.loadtasks()
  },
  methods: {
    openScan() {
      for (let i = 0; i < this.tasks?.length; i++) {
        if (this.tasks[i].type === "BILL") {
          // console.log(this.tasks[i].id);
          this.taskRedirect("BILL", this.tasks[i].id)
        }
      }
    },
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "pcolor", data.primary_color)
        this.$set(this.config, "pfontcolor", data.primary_font_color)
        this.$set(this.config, "taskLayout", data.taskLayout)
        if (data.taskfabposition == "left") {
          this.showFabRight = false
          this.$set(this.config, "flexclass", "alignspeeddial")
        } else {
          this.showFabRight = true
          this.$set(this.config, "flexclass", "alignspeeddialend")
        }
      }
    },
    /**
     * Label string
     */
    getPoints(val) {
      return "+ " + parseInt(val) + " " + this.$t("AppScreen.POINTS")
    },
    /**
     * Navigate to previous url
     */
    back() {
      this.$router.push("/")
    },
    /**
     * Convert Hex color to rgb
     */
    convertHex: function (color) {
      color = color.replace("#", "")
      let r = parseInt(color.substring(0, 2), 16)
      let g = parseInt(color.substring(2, 4), 16)
      let b = parseInt(color.substring(4, 6), 16)
      let result = "rgba(" + r + "," + g + "," + b + "," + 0.8 + ")"
      return result
    },
    /**
     * Redirect to the task based on its type
     * @param {string} taskType - Task type
     * @param {int} id - Task id
     */
    taskRedirect(taskType, id) {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      switch (taskType) {
        case BILL:
          this.$router.push({
            name: "receipt",
            params: { id: id },
            query: { company_name: passedCompanyId },
          })
          break
        case INVITE:
          this.$router.push({
            name: "invite",
            params: { id: id },
            query: { company_name: passedCompanyId },
          })
          break
        case QR_SCAN:
          this.$router.push({
            name: "scan",
            params: { id: id },
            query: { company_name: passedCompanyId },
          })
          break
        case SURVEY:
          this.$router.push({
            name: "feedback",
            params: { id: id },
            query: { company_name: passedCompanyId },
          })
          break
      }
    },
    /**
     * Load the tasks as vertical cards
     */
    loadtasks() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = this.$i18n.locale
      api
        .getTasks(token, passedCompanyId, lang)
        .then((result) => {
          let response = result.data
          this.tasks = response.data
          this.showTasks = true
        })
        .catch((err) => {
          this.showTasks = false
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_FOUND) {
            console.log(errormsg)
          } else if (errormsg === NO_COMPANY_TASK_FOUND) {
            console.log(errormsg)
          }
        })
    },
  },
}
</script>
<style>
.cardOutline {
  border-radius: 8px !important;
  border-width: thick !important;
}
/*
  #task {
    height: 100px;
  }

  #task .v-speed-dial {
    position: absolute;
  } */

#task .v-btn--floating {
  position: relative;
}
.alignspeeddial .v-speed-dial__list {
  align-items: initial;
}

.alignspeeddialend .v-speed-dial__list {
  align-items: flex-end !important;
}
</style>
