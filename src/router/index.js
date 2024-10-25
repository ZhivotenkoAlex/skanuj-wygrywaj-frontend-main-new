import { createRouter, createWebHistory } from 'vue-router';
import appauth from "@/core/auth.js";
// import rules from "@/views/home/companyrules";
import companyconfig from "@/core/companyconfig";
// import signinorregister from "@/views/signinorregister";
// import sociallogin from "@/views/sociallogin";
// import forgotpassword from "@/views/forgotpassword";
// import notFound from "@/components/shared/notFound";
// import welcome from "@/views/welcome";
// import layout from "@/views/home/layout";
// import home from "@/views/home/home";
// import reward from "@/views/home/reward/rewarddetails";
// import buyreward from "@/views/home/reward/purchasereward";
// import scan from "@/views/home/tasks/scancode";
// import receipt from "@/views/home/tasks/receipt";
// import invite from "@/views/home/tasks/invitefriend";
// import feedback from "@/views/home/tasks/feedback";
// import history from "@/views/history";
import { loadedLanguages } from "@/plugins/i18n";
// import cashback from "@/views/home/cashback/cashback";
// import signupsms from "@/views/signupsms";
// import forgotphonepassword from "@/views/forgotphonepassword";
// import scoreboard from "@/views/home/optional/scoreboard";
// import notifications from "@/views/home/optional/notifications";
// import personaldata from "@/views/home/optional/personal_data";
// import accounthistory from "@/views/accounthistory";
// import uvpredirect from "@/components/shared/uvpRedirect";
// import surveys from "@/views/home/surveys";
// import gamification from "@/views/home/gamifications/gamification";
// import purchaseresult from "@/views/home/reward/purchaseresult";
// import applyreservation from "@/views/home/reward/applyreservation";
// import reservationresult from "@/views/home/reward/reservationresult";
import { hasRules } from "@/helpers/hasRules";

import welcome from "@/components/welcome.vue";

const routes = [
    // {
    //     path: "/:catchAll(.*)",
    //     component: notFound
    // },
    // {
    //     path: "/blm",
    //     name: "blm",
    //     component: uvpredirect
    // },
    {
        path: "/",
        name: "welcome",
        component: welcome
    },
    // {
    //     path: "/login",
    //     name: "login",
    //     component: sociallogin
    // },
    // {
    //     path: "/signup",
    //     name: "signup",
    //     component: signinorregister
    // },
    // {
    //     path: "/signupsms",
    //     name: "signupsms",
    //     component: signupsms
    // },
    // {
    //     path: "/forgotpassword",
    //     name: "forgotpassword",
    //     component: forgotpassword
    // },
    // {
    //     path: "/forgotphonepassword",
    //     name: "forgotphonepassword",
    //     component: forgotphonepassword
    // },
    // {
    //     path: "/history",
    //     name: "history",
    //     component: history
    // },
    // {
    //     path: "/home",
    //     name: "homelayout",
    //     component: layout,
    //     children: [
    //         {
    //             path: "rules",
    //             name: "rules",
    //             component: rules
    //         },
    //         {
    //             path: "/index",
    //             name: "home",
    //             component: home
    //         },
    //         {
    //             path: "/rewards/:type/:id",
    //             name: "rewardinfo",
    //             component: reward
    //         },
    //         {
    //             path: "/buyrewards/:id",
    //             name: "buyreward",
    //             component: buyreward
    //         },
    //         {
    //             path: "/result",
    //             name: "result",
    //             component: purchaseresult
    //         },
    //         {
    //             path: "/reservation-result",
    //             name: "reservationresult",
    //             component: reservationresult
    //         },
    //         {
    //             path: "/applyreservation",
    //             name: "applyreservation",
    //             component: applyreservation
    //         },
    //         {
    //             path: "/feedback/:id",
    //             name: "feedback",
    //             component: feedback
    //         },
    //         {
    //             path: "/invite/:id",
    //             name: "invite",
    //             component: invite
    //         },
    //         {
    //             path: "/scan/:id",
    //             name: "scan",
    //             component: scan
    //         },
    //         {
    //             path: "/receipt/",
    //             name: "receipt",
    //             component: receipt
    //         },
    //         {
    //             path: "/scoreboard/",
    //             name: "scoreboard",
    //             component: scoreboard
    //         },
    //         {
    //             path: "/cashback",
    //             name: 'cashback',
    //             component: cashback
    //         },
    //         {
    //             path: "/notifications",
    //             name: 'notifications',
    //             component: notifications
    //         },
    //         {
    //             path: "/personaldata",
    //             name: 'personaldata',
    //             component: personaldata
    //         },
    //         {
    //             path: "/personalhistory",
    //             name: "personalhistory",
    //             component: accounthistory
    //         },
    //         {
    //             path: "/surveys",
    //             name: "surveys",
    //             component: surveys
    //         },
    //         {
    //             path: "/gamification",
    //             name: "gamification",
    //             component: gamification
    //         }
    //     ],
    //     meta: {
    //         requiresAuth: true
    //     }
    // }
];

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        };
    },
    routes
});

router.beforeEach(async (to, from, next) => {
    try {
        if (to.matched.length === 0) {
            next();
        } else if (to.matched.some(record => record.meta.requiresAuth)) {
            const loggedIn = appauth.isLoggedIn();
            let passedCompanyId = companyconfig.getCompanyIdfromUrl();
            if (!loggedIn) {
                return next({
                    name: "welcome",
                    query: {
                        company_name: passedCompanyId
                    }
                });
            } else {
                const hasMandatoryRules = await hasRules();
                if (hasMandatoryRules === true && router.currentRoute.path !== '/signup') {
                    return
                } else {
                    return next();
                }
            }
        } else if (
            (!companyconfig.isCompanySchemeSet() || loadedLanguages.length === 0) &&
            to.name != "welcome"
        ) {
            let passedCompanyId = companyconfig.getCompanyIdfromUrl();
            if (to.name === 'blm' && !appauth.isLoggedIn()) {
                window.location = "https://demo.2take.it/uvp/?cn=" + passedCompanyId;
            } else {
                return next({
                    name: "welcome",
                    query: {
                        company_name: passedCompanyId,
                        inviteCode: to.query.inviteCode
                    }
                });
            }
        } else {
            return next();
        }
    } catch (error) {
        console.error("Navigation guard error:", error);
        next(error);
    }
});

export default router;
