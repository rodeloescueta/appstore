import Vue from "vue";
import Router from "vue-router";
// import Home from './views/Home.vue'
import store from "./store";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/messenger",
      name: "messenger",
      component: () => import("./views/Messenger.vue"),
    },
    {
      path: "/qaproject",
      name: "qaproject",
      component: () => import("./views/QaProjects.vue"),
    },
    {
      path: "/departmentfilestore",
      name: "departmentfilestore",
      component: () => import("./views/DepartmentFileStore.vue"),
    },

    {
      path: "/hrddoc",
      name: "hrddoc",
      component: () => import("./views/HrdDoc.vue"),
    },

    {
      path: "/web",
      name: "web",
      component: () => import("./views/Web.vue"),
    },
    // {
    //   path: '/masterlist',
    //   name: 'masterlist',
    //   component: () => import('./views/MasterListMaintenance.vue')
    // },
    // {
    //   path: '/inactivestaff',
    //   name: 'inactivestaff',
    //   component: () => import('./views/InActiveStaff.vue')
    // },
    {
      path: "/masterlistmaintenance",
      name: "masterlistmaintenance",
      component: () => import("./views/MasterListMaintenance.vue"),
    },
    // {
    //   path: '/qa_monitoring',
    //   name: 'qa_monitoring',
    //   component: () => import('./views/QAMonitoring.vue')
    // },
    // {
    //   path: '/appstoremaintenance',
    //   name: 'appstoremaintenance',
    //   component: () => import('./views/AppstoreMaintenance.vue')
    // },
    // {
    //   path: '/staffaccessrights',
    //   name: 'staffaccessrights',
    //   component: () => import('./views/StaffAccessRights.vue')
    // },
    // {
    //   path: '/desktop',
    //   name: 'desktop',
    //   component: () => import('./views/Desktop.vue')
    // },
    // {
    //   path: '/projectlist',
    //   name: 'projectlist',
    //   component: () => import('./views/ProjectList.vue')
    // },
    {
      path: "/scheduler",
      name: "scheduler",
      component: () => import("./views/Scheduler.vue"),
    },
    {
      path: "/",
      name: "page",
      component: () => import("./views/Messenger.vue"),
    },
    {
      path: "/systemlist",
      name: "system",
      component: () => import("./views/System.vue"),
    },
    {
      path: "/request",
      name: "request",
      component: () => import("./views/Request.vue"),
    },
    {
      path: "/task",
      name: "task",
      component: () => import("./views/Task.vue"),
    },
    {
      path: "/presentation",
      name: "presentation",
      component: () => import("./views/Presentation.vue"),
    },
    {
      path: "/logs",
      name: "logs",
      component: () => import("./views/HrdLogs.vue"),
    },
    // {
    //   path: '/hrddocsreport',
    //   name: 'hrddocsreport',
    //   component: () => import('./views/HrdDocsReport.vue')
    // },
    // {
    //   path: '/mypage',
    //   name: 'mypage',
    //   component: () => import('./views/MyPage.vue')
    // },
    {
      path: "/carstemp",
      name: "carstemp",
      component: () => import("./views/CarsTemp.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path !== "/login") {
    if (store.state.userInfo !== "a") {
      next();
    } else {
      next("login");
    }
  } else {
    next();
  }
});

export default router;
