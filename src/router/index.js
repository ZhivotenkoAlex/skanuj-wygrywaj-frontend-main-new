import { createRouter, createWebHistory } from 'vue-router';
import appauth from "@/core/auth.js";
import rules from "@/views/home/companyRules";
import companyconfig from "@/core/companyconfig";
import signinorregister from "@/views/signinOrRegister";
import sociallogin from "@/views/socialLogin.vue";
import forgotpassword from "@/views/forgotPassword";
import notFound from "@/components/shared/notFound";
import welcome from "@/views/welcomeComponent";
import layout from "@/views/home/layoutComponent";
import home from "@/views/home/homeComponent";
import reward from "@/views/home/reward/rewardDetails";
import buyreward from "@/views/home/reward/purchaseReward";
import scan from "@/views/home/tasks/scanCode";
import receipt from "@/views/home/tasks/receiptTask.vue";
import invite from "@/views/home/tasks/inviteFriend";
import feedback from "@/views/home/tasks/feedbackTask";
import history from "@/views/historyComponent";
import { loadedLanguages } from "@/plugins/i18n";
import cashback from "@/views/home/cashback/cashbackComponent";
import signupsms from "@/views/signupSms";
import forgotphonepassword from "@/views/forgotPhonePassword";
import scoreboard from "@/views/home/optional/scoreboardComponent";
import notifications from "@/views/home/optional/notificationsComponent";
import personaldata from "@/views/home/optional/personalData";
import accounthistory from "@/views/accountHistory.vue";
import uvpredirect from "@/components/shared/uvpRedirect";
import surveys from "@/views/home/surveysComponent";
import gamification from "@/views/home/gamifications/gamificationComponent.vue";
import purchaseresult from "@/views/home/reward/purchaseResult";
import applyreservation from "@/views/home/reward/applyReservation";
import reservationresult from "@/views/home/reward/reservationResult";
import { hasRules } from "@/helpers/hasRules";

const routes = [
    {
        path: "/:catchAll(.*)",
        component: notFound
    },
    {
        path: "/blm",
        name: "blm",
        component: uvpredirect
    },
    {
        path: "/",
        name: "welcome",
        component: welcome
    },
    {
        path: "/login",
        name: "login",
        component: sociallogin
    },
    {
        path: "/signup",
        name: "signup",
        component: signinorregister
    },
    {
        path: "/signupsms",
        name: "signupsms",
        component: signupsms
    },
    {
        path: "/forgotpassword",
        name: "forgotpassword",
        component: forgotpassword
    },
    {
        path: "/forgotphonepassword",
        name: "forgotphonepassword",
        component: forgotphonepassword
    },
    {
        path: "/history",
        name: "history",
        component: history
    },
    {
        path: "/home",
        name: "homelayout",
        component: layout,
        children: [
            {
                path: "rules",
                name: "rules",
                component: rules
            },
            {
                path: "/index",
                name: "home",
                component: home
            },
            {
                path: "/rewards/:type/:id",
                name: "rewardinfo",
                component: reward
            },
            {
                path: "/buyrewards/:id",
                name: "buyreward",
                component: buyreward
            },
            {
                path: "/result",
                name: "result",
                component: purchaseresult
            },
            {
                path: "/reservation-result",
                name: "reservationresult",
                component: reservationresult
            },
            {
                path: "/applyreservation",
                name: "applyreservation",
                component: applyreservation
            },
            {
                path: "/feedback/:id",
                name: "feedback",
                component: feedback
            },
            {
                path: "/invite/:id",
                name: "invite",
                component: invite
            },
            {
                path: "/scan/:id",
                name: "scan",
                component: scan
            },
            {
                path: "/receipt/",
                name: "receipt",
                component: receipt
            },
            {
                path: "/scoreboard/",
                name: "scoreboard",
                component: scoreboard
            },
            {
                path: "/cashback",
                name: 'cashback',
                component: cashback
            },
            {
                path: "/notifications",
                name: 'notifications',
                component: notifications
            },
            {
                path: "/personaldata",
                name: 'personaldata',
                component: personaldata
            },
            {
                path: "/personalhistory",
                name: "personalhistory",
                component: accounthistory
            },
            {
                path: "/surveys",
                name: "surveys",
                component: surveys
            },
            {
                path: "/gamification",
                name: "gamification",
                component: gamification
            }
        ],
        meta: {
            requiresAuth: true
        }
    }
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
                const isNotSignUp = router.currentRoute.value.path !== '/signup'

                if (hasMandatoryRules === true && isNotSignUp) {
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
