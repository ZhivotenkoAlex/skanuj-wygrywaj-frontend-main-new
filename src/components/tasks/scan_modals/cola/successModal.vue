<template>
    <v-dialog
            v-model="childVisible"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition">
      <v-card class="modelFullscreen"
              v-bind:style="{ backgroundImage: 'url(' + config.background_loyalty + ')' }"
              style="text-align: center; background: #0f0f0f;  background-position: center;background-repeat: no-repeat;background-size: cover;"
              align="center">
            <div class="pt-12">
                <v-img
                        :src="config.shortlogo"
                        max-height="80px"
                        contain
                        v-if="config.showLogo"
                ></v-img>
            </div>

            <div style="background-color: rgb(0 0 0 / 52%);margin: 20px;border-radius: 20px;">

              <div class="pt-12">
                <div>
                  <img src="../../../../assets/images/receipt/check.png" class="progressModalImage"/>
                </div>
              </div>

              <div class="pt-12">
                <h4 class="modalHeader white--text">{{$t('TaskScreen.MODAL_SUCCESS_TITLE')}}</h4>
              </div>

              <div class="pt-8 pl-5 pr-5">
                <h5 class="modalInfoText white--text">
                  Masz okazję zagrać w grę i wygrać nagrody. Im więcej punktów, tym więcej masz szans.
                </h5>
              </div>


              <div class="pl-5 pr-5 pb-1">
                <v-btn @click="startGame" block class="mt-10 modalNotActionBtn">
                  Zagraj teraz
                </v-btn>
                <v-btn @click="hide" block class="mt-3 modalNotActionBtn mb-12 mr-3">
                  Później
                </v-btn>
              </div>
            </div>

        </v-card>
    </v-dialog>
</template>
<script>
    import companyconfig from "@/core/companyconfig";
    export default {
        data() {
            return {
                childVisible: true,
                config: {},
            }
        },

        props: {

        },
        created() {
            this.setupLayout();
        },
        methods: {
            hide () {
              this.$emit('success-modal-hide')
            },
            startGame() {
              this.$emit('open-game')
            },
            onProductChange (value) {
                this.product = value
            },
            onIncentiveChange (value) {
                this.incentive = value
            },
            setupLayout() {
                let data = companyconfig.getCompanyScheme();
                if (data != "") {
                    this.$set(this.config, "mcolor", data.main_color);
                    this.$set(this.config, "mfontcolor", data.main_font_color);
                    this.$set(this.config, "shortlogo", data.shortLogo);
                    this.$set(this.config, "showLogo", data.showLogo);
                    this.$set(this.config, "showMenu", data.showMenu);
                    this.$set(this.config, "logoPosition", data.logoPosition);
                    this.$set(this.config, "background_loyalty", data.background_loyalty);
                }
            }
        }
    }
</script>
