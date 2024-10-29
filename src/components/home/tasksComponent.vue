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
      <v-col v-for="n in tasks" :cols="12" :md="4" :key="n.id">
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
      <v-col v-for="n in tasks" :cols="12" :md="4" :key="n.id">
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
import { ref, reactive, onMounted } from "vue"
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
import { i18n } from "@/plugins/i18n"

export default {
  setup() {
    const tasks = ref([])
    const model = ref("")
    const config = reactive({})
    const fab = ref(false)
    const showTasks = ref(false)
    const C_SURVEY = SURVEY
    const C_INVITE = INVITE
    const C_QR_SCAN = QR_SCAN
    const C_BILL = BILL
    const showFabRight = ref(false)

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        config.mcolor = data.main_color
        config.mfontcolor = data.main_font_color
        config.pcolor = data.primary_color
        config.pfontcolor = data.primary_font_color
        config.taskLayout = data.taskLayout
        if (data.taskfabposition == "left") {
          showFabRight.value = false
          config.flexclass = "alignspeeddial"
        } else {
          showFabRight.value = true
          config.flexclass = "alignspeeddialend"
        }
      }
    }

    const getPoints = (val) => {
      return "+ " + parseInt(val) + " " + this.$t("AppScreen.POINTS")
    }

    const taskRedirect = (taskType, id) => {
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
    }

    const loadtasks = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = i18n.global.locale
      api
        .getTasks(token, passedCompanyId, lang)
        .then((result) => {
          let response = result.data
          tasks.value = response.data
          showTasks.value = true
        })
        .catch((err) => {
          showTasks.value = false
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_FOUND) {
            console.log(errormsg)
          } else if (errormsg === NO_COMPANY_TASK_FOUND) {
            console.log(errormsg)
          }
        })
    }

    onMounted(() => {
      setupLayout()
      loadtasks()
    })

    return {
      tasks,
      model,
      config,
      fab,
      showTasks,
      C_SURVEY,
      C_INVITE,
      C_QR_SCAN,
      C_BILL,
      showFabRight,
      setupLayout,
      getPoints,
      taskRedirect,
      loadtasks,
    }
  },
}
</script>

<style>
.cardOutline {
  border-radius: 8px !important;
  border-width: thick !important;
}

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
