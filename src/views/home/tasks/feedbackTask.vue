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
            v-text="$t('TaskScreen.FILL_SURVEY')"
          ></div>
        </v-col>
        <v-col cols="4" md="2">
          <v-btn
            block
            :style="`color:${config.mfontcolor} !important`"
            :color="config.mcolor"
            @click="changeTab"
            v-text="$t('TaskScreen.START')"
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
        <taskinfo :tasktype="C_SURVEY" :taskId="id"></taskinfo>
      </v-tab-item>
      <v-tab-item value="tab2">
        <div v-if="!submitted && !alreadysubmitted">
          <v-card-text>
            <v-form v-model="feedbackform.valid">
              <frm :schema="feedbackform.schema" :value="formdata"></frm>
            </v-form>
            <alert
              :errorMessage="feedbackform.errors"
              :alert="feedbackform.showerror"
            ></alert>
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              :color="config.pcolor"
              :style="`color:${config.pfontcolor} !important`"
              @click="Saveform"
              :loading="feedbackform.loading"
              :disabled="feedbackform.loading"
              v-text="$t('TaskScreen.SUBMIT')"
            ></v-btn>
          </v-card-actions>
        </div>
        <v-layout
          align-center
          justify-center
          v-if="alreadysubmitted || noquestions"
        >
          <v-card flat class="text-center mt-6">
            <v-icon
              height="150px"
              size="60"
              :style="`color:${config.mcolor} !important`"
              >mdi-information</v-icon
            >
            <v-card-text
              v-if="alreadysubmitted"
              v-text="$t('TaskScreen.ALREADY_FILLED_SURVEY')"
              class="title"
            ></v-card-text>
            <v-card-text
              v-if="noquestions"
              v-text="$t('TaskScreen.NO_QUESTIONS')"
              class="title"
            ></v-card-text>
          </v-card>
        </v-layout>
        <v-layout align-center justify-center v-if="submitted">
          <v-card flat width="350" class="text-center mt-6">
            <v-icon
              height="150px"
              size="64"
              :color="config.mcolor"
              :style="`color:${config.mfontcolor} !important`"
              >mdi-star-face</v-icon
            >
            <v-card-title
              v-text="$t('TaskScreen.THANK_YOU')"
              :style="`color:${config.mcolor} !important`"
              class="font-weight-bold justify-center"
            ></v-card-title>
            <v-card-text
              class="pt-0 justify-center"
              :style="`color:${config.mcolor} !important`"
              >{{
                $t("TaskScreen.SURVEY_POINTS_YOU_GOT", { point: points1 })
              }}</v-card-text
            >
            <v-card-actions>
              <v-btn
                block
                :color="config.mcolor"
                :style="`color:${config.mfontcolor} !important`"
                v-text="$t('TaskScreen.GOTO_HOME')"
                @click="navigatehome"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-tab-item>
      <v-tab-item value="tab3">
        <taskhistory :tasktype="C_SURVEY"></taskhistory>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import {
  SURVEY,
  SURVEY_COMPLETED_ALREADY,
  SURVEY_COMPLETED_SUCESSFULLY,
  INVALID_DATA_SUBMITTED,
  INVALID_QUESTION_ID,
  NO_QUESTIONS,
} from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import frm from "@/components/shared/dynamicForm"
import api from "@/services/fetchapi"
import auth from "@/core/auth"
import taskinfo from "@/components/tasks/taskInfo"
import taskhistory from "@/components/tasks/taskHistory"
import alert from "@/components/shared/errorAlert"
export default {
  data() {
    return {
      id: 0,
      tabs: "tab1",
      config: {},
      submitted: false,
      noquestions: false,
      alreadysubmitted: false,
      feedbackform: {
        valid: true,
        schema: [],
        errors: "",
        showerror: false,
        loading: false,
      },
      formdata: {},
      C_SURVEY: SURVEY,
    }
  },
  components: {
    frm,
    taskinfo,
    taskhistory,
    alert,
  },
  created() {
    this.id = this.$route.params.id
    this.getSchema()
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
      }
    },
    /** Get the survey schema details */
    getSchema() {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = this.$i18n.locale
      api
        .getQuestion(token, passedCompanyId, lang)
        .then((result) => {
          let response = result.data
          let msg = response.message
          if (msg === SURVEY_COMPLETED_ALREADY) {
            this.alreadysubmitted = true
            this.submitted = false
            this.noquestions = false
          } else if (response.data) {
            this.generateSchema(response.data)
            this.showform = true
          }
        })
        .catch((err) => {
          let msg = err.data.message
          if (msg === SURVEY_COMPLETED_ALREADY) {
            this.alreadysubmitted = true
            this.submitted = false
            this.noquestions = false
          } else if (msg === NO_QUESTIONS) {
            this.alreadysubmitted = false
            this.submitted = false
            this.noquestions = true
          }
          this.console.log(err) //redirect to error page no company found
        })
    },
    /** Generate the form from schema*/
    generateSchema(data) {
      if (data.length != 0) {
        data.forEach((item, index) => {
          let obj = {}
          console.log(index)
          obj.label = item.question
          if (item.type === "OPEN") {
            obj.fieldType = "VTextField"
            obj.name = "OPEN_" + item.id
            obj.type = item.type
          } else if (item.type === "MULTI") {
            let options2 = item.options
            let filtered = options2.filter((obj1) => {
              return ![null, "null", ""].includes(obj1)
            })
            obj.options = filtered
            obj.colclass = "col-xs-4 col-md-3"
            obj.name = "MULTI_" + item.id
            obj.fieldType = "checkboxgroup"
          } else if (item.type === "SINGLE") {
            let options1 = item.options
            let filtered1 = options1.filter((obj1) => {
              return ![null, "null", ""].includes(obj1)
            })
            obj.fieldType = "VSelect"
            obj.items = filtered1
            obj.name = "SINGLE_" + item.id
          }
          obj.refId = item.id
          obj.survey_id = item.survey_id
          this.feedbackform.schema.push(obj)
        })
      }
    },
    /** Submit the survey */
    Saveform() {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = this.$i18n.locale
      let pushdata = []
      this.feedbackform.schema.forEach((item, index) => {
        let obj = {}
        console.log(index)
        let i = this.formdata
        obj.id = item.refId
        obj.value = i[item.name]
        obj.survey_id = item.survey_id
        pushdata.push(JSON.parse(JSON.stringify(obj)))
      })
      this.feedbackform.showerror = false
      this.feedbackform.loading = true
      api
        .saveQAForm(pushdata, token, passedCompanyId, lang)
        .then((result) => {
          let response = result.data
          if (response.message === SURVEY_COMPLETED_SUCESSFULLY) {
            this.submitted = true
          } else {
            this.feedbackform.showerror = true
            this.feedbackform.loading = false
            this.feedbackform.errors = this.$t("Errors.INVALID_DATA_SUBMITTED")
          }
        })
        .catch((err) => {
          let msg = err.data.message
          if (msg === INVALID_DATA_SUBMITTED) {
            this.feedbackform.showerror = true
            this.feedbackform.errors = this.$t("Errors.INVALID_DATA_SUBMITTED")
          } else if (msg === INVALID_QUESTION_ID) {
            this.feedbackform.showerror = true
            this.feedbackform.errors = this.$t("Errors.INVALID_QUESTION_ID")
          } else if (msg === SURVEY_COMPLETED_ALREADY) {
            this.alreadysubmitted = true
            this.submitted = false
            this.noquestions = false
          } else if (msg === NO_QUESTIONS) {
            this.alreadysubmitted = false
            this.submitted = false
            this.noquestions = true
          }
          this.feedbackform.loading = false
          this.console.log(err) //redirect to error page no company found
        })
    },
  },
}
</script>
<style>
.v-tabs-slider-wrapper {
  height: 4px !important;
}
</style>
