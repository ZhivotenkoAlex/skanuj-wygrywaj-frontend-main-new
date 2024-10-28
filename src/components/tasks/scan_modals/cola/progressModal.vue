<template>
    <v-dialog
            v-model="childVisible"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
    >
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

            <div style="height: 150px"/>

            <div class="pt-12">
                <h2 class="modalHeader" style="text-align: center; color: white; text-transform: uppercase">trwa przetwarzanie </h2>
            </div>

            <div style="height: 50px"/>

            <div class="pl-12 pr-12">
                <v-progress-linear
                        :color="config.mfontcolor"
                        indeterminate
                        rounded
                        height="6"
                ></v-progress-linear>
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
                randomQuoteNumber: 0,
            }
        },
        created() {
            this.setupLayout();
            this.randomQuoteNumber = this.randomInt(3)
        },
        methods: {
            hide () {
                this.$emit('progress-modal-hide')
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
                    this.$set(this.config, "logoPosition", data.logoPosition);
                    this.$set(this.config, "background_loyalty", data.background_loyalty);
                }
            },
            randomInt(max) {
                return Math.floor(Math.random() * Math.floor(max));
            },
        }
    }
</script>
