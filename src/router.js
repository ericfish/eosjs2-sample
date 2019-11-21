import Vue from "vue";
import Router from 'vue-router';


import SamplesView from "./views/SamplesView.vue";

Vue.use(Router);

export const RouteNames = {
    SAMPLES: "samples"
}


export default new Router({
    routes: [
        {
            path: "/",
            name: RouteNames.SAMPLES,
            component: SamplesView
        }
    ]
});