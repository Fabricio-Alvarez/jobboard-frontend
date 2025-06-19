import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/register",
    component: () => import("@/views/RegisterUser.vue"),
  },
  {
    path: "/dashboard-candidatos",
    component: () => import("@/views/CandidatesDashboard.vue"),
  },
  {
    path: "/somos",
    component: () => import("@/views/AboutUs.vue"),
  },
  {
    path: "/dashboard-reclutadores",
    component: () => import("@/views/RecruitersDashboard.vue"),
  },
  {
    path: "/oferta",
    component: () => import("@/views/RegisterOffer.vue"),
  },
  {
    path: "/candidates-profile",
    component: () => import("@/views/CandidatesProfile.vue"),
  },
  {
    path: "/historial-ofertas",
    component: () => import("@/views/HistoryOffers.vue"),
  },
  {
    path: "/historial-empleos",
    component: () => import("@/views/AvailableJobs.vue"),
  },
  {
    path: "/postulacionesHistorial",
    component: () => import("@/views/ApplicationHistory.vue"),
  },

  {
    path: "/actualizar-perfil",
    name: "EditarPerfilCandidato",
    component: () => import("@/views/EditRecruiterProfile.vue"),
  },
  {
    path: "/job-offers/:offerId/applications",
    name: "ListJobApplicationsForOffer",
    component: () => import("@/views/ListJobApplicationForOffer.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
