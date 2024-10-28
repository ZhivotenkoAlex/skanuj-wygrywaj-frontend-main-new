<template>
  <v-card flat :style="`background-color:${config.innercolor} !important`">
    <v-card-text
      class="py-2 text-center"
      v-text="`$t('RewardsScreen.ASK_STAFF_TO_ENTER_PIN')`"
    ></v-card-text>
    <v-text-field
      autocomplete="off"
      filled
      dense
      class="form"
      :placeholder="'PIN'"
      name="pin"
      prepend-icon="mdi-home-map-marker"
      type="password"
      v-model="acceptance.pin"
      validate-on-blur
      :rules="[
        (value) => {
          return pinAcceptanceRule(value)
        },
      ]"
    ></v-text-field>
  </v-card>
</template>
<script>
// import alert from "@/components/shared/errorAlert"
import { AcceptanceType } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
export default {
  props: {
    pin: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      acceptance: {
        pin: "",
      },
      AcceptanceType,
      config: {
        innercolor: "",
        outercolor: "",
      },
    }
  },

  created() {
    this.id = this.$route.params.id
    this.setupLayout()
  },
  methods: {
    pinAcceptanceRule(value) {
      if (!value) {
        return this.$t("Errors.PIN_REQUIRED")
      } else if (value !== this.reward.pin) {
        return this.$t("Errors.INVALID_PIN")
      }
      return true
    },
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "innercolor", data.layout_background_color_inner)
        this.$set(this.config, "outercolor", data.layout_background_color_outer)
      }
    },
  },
  components: {
    // alert,
  },
}
</script>

<style>
.v-text-field--filled:not(.v-text-field--single-line) input {
  margin-top: 10px;
}

.v-application i.primary-text.theme--light {
  color: black;
}

input {
  font-size: 16px;
}

.acceptance-warning {
  color: red;
  text-align: center;
  font-weight: 500;
}

.hidden {
  display: none;
}

.form {
  padding: 10px 10px 5px 10px !important;
  background: white;
  margin: 0;
}
</style>
