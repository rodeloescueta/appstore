<template>
  <v-app class="myApp" id="inspire">
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      :mini-variant="drawer"
    >
      <v-divider></v-divider>
      <v-list class="pt-0" dense>
        <template v-for="item in items">
          <template v-if="item.avatar">
            <v-list-item
              :key="item.text"
              @click="changePage(item.text)"
              :to="item.to"
            >
              <v-list-item-avatar>
                <v-img @error="onEmptyProfile" :src="profile"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider :key="item.text + 'a'"></v-divider>
          </template>
          <template v-else>
            <v-list-group
              v-if="item.children"
              :key="item.text"
              v-model="item.model"
              :prepend-icon="item.model ? item.icon : item['icon-alt']"
              append-icon=""
            >
              <template v-slot:activator>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.text }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-list-item
                v-for="(child, i) in item.children"
                :key="i"
                :to="child.to"
              >
                <v-list-item-action v-if="child.icon">
                  <v-icon color="secondary">{{ child.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ child.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>

            <v-list-item
              v-else
              :key="item.text"
              @click="changePage(item.text)"
              :to="item.to"
            >
              <v-list-item-action>
                <v-icon color="secondary">{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>
        <v-list-item v-if="userInfo.department == 'QA'" :to="system.to">
          <v-list-item-action>
            <v-icon color="secondary">{{ system.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ system.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="
            userInfo.department == 'QA' &&
              userInfo.designation != 'Japanese Advisor'
          "
          :to="manage.to"
        >
          <v-list-item-action>
            <v-icon color="secondary">{{ manage.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ manage.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="task.to">
          <v-list-item-action>
            <v-icon color="secondary">{{ task.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ task.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dense flat :clipped-left="$vuetify.breakpoint.lgAndUp" app>
      <v-toolbar-title style="color: blue;">
        <!-- <v-toolbar-side-icon  @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
        <v-icon
          medium
          class="pb-2 pl-3"
          color="secondary"
          left
          @click.stop="drawer = !drawer"
          >menu</v-icon
        >
        <v-avatar size="45" class="pb-2 ml-3">
          <!-- <v-img max-width = "38" max-height = "38" :src="profilePic" ></v-img>  -->
          <img :src="hIcon" class="mr-3" />
        </v-avatar>
        <span
          style="color: #247ef2;margin-left:-10px;font-family:Lucida Sans Unicode; font-size: 28px;text-transform:capitalize;font-weight:bold"
        >
          SYSTEM
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on" @click="showinfo = true">
            Changes Information
            <v-icon color="red">mdi-alert-circle-outline</v-icon>
          </v-btn>
        </template>
        <span>View Info</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <!-- <v-btn v-on="on" icon  @click="updateMyProfile(userInfo.employeeCode)">
              <v-icon color="secondary">account_box</v-icon>
            </v-btn> -->

          <v-avatar size="36">
            <img
              @error="onEmptyProfile"
              v-on="on"
              icon
              @click="updateMyProfile(userInfo.employeeCode)"
              :src="profile"
            />
          </v-avatar>
        </template>
        <span>Update My Profile</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click="deleteInfo()">
            <v-icon color="secondary">mdi-logout</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>
    </v-app-bar>
    <template>
      <v-dialog
        v-model="dialogPersonalInfo"
        fullscreen
        persistent
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <user-info-dialog />
        </v-card>
      </v-dialog>
    </template>
    <template>
      <v-dialog v-model="showinfo" max-width="400">
        <v-card max-width="400" class="mx-auto">
          <v-app-bar dark color="info">
            <v-toolbar-title>Information</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-app-bar>

          <v-container>
            <v-row dense>
              <!-- design !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
              <v-col cols="12">
                <v-card color="#385F73" dark class="pa-2">
                  <v-card-title class="headline">System Changes</v-card-title>

                  <div>
                    This system is in Beta Stage.
                    <br />
                    Two major changes (see below)
                    <br />
                    <!-- If encounter problem with this version, we can still used the old version. -->
                    Suggestion or Problem encounter with this version, message
                    me @(i.p. @delo or in this messaging function). We can still
                    used the old version
                  </div>

                  <v-card-actions>
                    <v-btn block @click="openNewTab('http://hrdapps48:5050')"
                      >Open previous version</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- /messaging !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
              <v-col cols="12">
                <v-card color="#952175" dark class="pa-2">
                  <v-card-title class="headline"
                    >1.) Messaging Function</v-card-title
                  >

                  <div>
                    Alternative for internal usage of email account
                    <br />
                    Insert attachment but not image is still on going. (like:
                    pdf, xls)
                  </div>

                  <v-card-actions>
                    <v-btn block @click="openNewTab(messaging)">
                      Details How To Use
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <!-- /messaging !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
              <!-- design !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
              <v-col cols="12">
                <v-card color="#1F7087" dark class="pa-2">
                  <v-card-title class="headline"
                    >2.) Interface Standardization</v-card-title
                  >

                  <div>
                    Web Application created by QA@hrd team will follow 1
                    Interface design.
                    <br />
                    Like PCMS, HRD System and J.A. System
                  </div>

                  <v-card-actions>
                    <v-btn block @click="openNewTab(standardization)"
                      >Details</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- design !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </template>

    <v-content>
      <!-- App.vue dialogPersonalInfo: {{dialogPersonalInfo}} -->
      <v-divider></v-divider>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import UserInfoDialog from "@/components/UserInfoDialog.vue";

// import axios from 'axios'

export default {
  components: {
    UserInfoDialog,
  },
  mounted() {
    this.hIcon = "./img/H.png";
    if (this.userInfo != "a") {
      if (this.userInfo.department !== this.userInfo.department.toUpperCase()) {
        this.deleteInfo();
      }
    }
    this.onChangeDialogView_PersonalInfo(false);
  },
  data: () => ({
    showinfo: false,
    drawer: true,
    messaging:
      "http://hrdapps30/system_team/doku.php?id=funciton_howtouse:messaging",
    standardization:
      "http://hrdapps30/system_team/doku.php?id=interface_standardization",
    t: null,
    hIcon: "",
    items: [
      { icon: "mdi-home-account", text: "My Page", to: "messenger" },
      // { icon: 'mdi-home-account', text: 'My Page', to: 'mypage'},
      { icon: "mdi-apps-box", text: "App Store", to: "web" },
      {
        icon: "mdi-account-supervisor",
        text: "Master List",
        to: "masterlistmaintenance",
      },
      {
        text: "Documentation",
        icon: "mdi-file-document-box-multiple-outline",
        to: "hrddoc",
      },
      { icon: "mdi-calendar", text: "Scheduler", to: "scheduler" },
      { icon: "mdi-badge-account-outline", text: "HRD Logs", to: "logs" },
      // { text: 'System Request', icon: 'mdi-book-plus', to: 'request' },
      // { icon: 'mdi-message-processing-outline', text: 'Simple Message', to: 'messenger' },
      // { icon: 'mdi-file-multiple', text: 'Department Files', to: 'departmentfilestore' },
      // { icon: 'mdi-calendar-month-outline', text: 'Scheduler', to: 'scheduler' },
      // { icon: 'mdi-settings-box', text: 'QA Project', to: 'qaproject' },

      // hide for now*****************************************************
      // { icon: 'apps', text: 'App Store', to: 'web' },
      // { icon: 'people_outline', text: 'Master List', to: 'masterlistmaintenance' },
      // { text: 'Documentation', icon: 'folder_open', to: 'hrddoc' },
      // {
      //   icon: 'keyboard_arrow_up',
      //   'icon-alt': 'keyboard_arrow_down',
      //   text: 'Maintenance Access',
      //   model: false,
      //   children: [
      //     { text: 'App Store', to: 'appstoremaintenance' },
      //     { text: 'Access Rights', to: 'staffaccessrights' },
      //     // { text: 'QA Monitoring', to: 'qa_monitoring' }
      //   ]
      // },
      // hide for now*****************************************************
    ],
    task: {
      text: "Task Monitoring",
      icon: "mdi-clipboard-list-outline",
      to: "task",
    },
    system: { text: "Systems", icon: "mdi-view-list", to: "systemlist" },
    manage: {
      text: "System Presentation",
      icon: "mdi-format-list-checks",
      to: "presentation",
    },
  }),
  computed: {
    profile() {
      return `http://hrdapps48:3001/ftp/employee_pictures/0${
        this.userInfo.employeeCode
      }.jpg`;
    },
  },
  methods: {
    openNewTab(url) {
      window.open(url, "_blank");
    },

    deleteInfo: function() {
      this.ADD_INFO("a");
      this.CHANGE_PERSONAL_INFO({});
      this.$router.push("/login");
    },
  },
  props: {
    source: String,
  },
};
</script>

<style>
.second-toolbar {
  display: none;
}
.rounded-card {
  border-radius: 20px !important;
}

.v-btn:hover:before {
  background-color: transparent;
}

.scroll {
  overflow-y: auto;
}

.v-icon {
  display: inline-flex !important;
}

div.fr-wrapper > div > a {
  /* display: none !important; */
  /* position: fixed; */
  /* z-index: -99999 !important; */
  background: transparent !important;
  color: transparent !important;
  height: 0px !important;
  width: 0 !important;
  overflow: hidden !important;
}

/* width */
::-webkit-scrollbar {
  width: 3px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #455a64;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #455a64;
}
</style>
