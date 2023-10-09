<template>
  <header>
      <div class="flex justify-between header" style="padding: 12px 12px 12px 12px; align-items: center">
          <div class="flex" style="align-items: center">
              <div v-if="workspacesStore.userWithoutWorkspaces" class="logo-box">
                  <img src="./assets/logo.svg" alt="logo">
              </div>
              <div v-if="workspacesStore.userWithWorkspaces">
                  <router-link :to="{ name: 'home' }">
                      <button class="back-button flex place-items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5.21868 8.66667L8.79468 12.2427L7.85201 13.1853L2.66668 8L7.85201 2.81467L8.79468 3.75733L5.21868 7.33333L13.3333 7.33333L13.3333 8.66667L5.21868 8.66667Z" fill="currentColor"/>
                          </svg>
                          Back
                      </button>
                  </router-link>
              </div>
          </div>
          <div class="flex" style="align-items: center">
              <button @click="exit" class="exit-button">
                  Log out
              </button>
          </div>
      </div>
  </header>
  <main class="grid grid-cols-1 place-items-center" style="padding-top: 64px; padding-left: 12px; padding-right: 12px">
      <div style="width: 521px; height: 444px; background-color: #FFFFFF; border: 1px #DEE2E6 solid; border-radius: 8px">
          <div class="grid grid-cols-1 place-items-center">
              <p style="color: #000000; font-weight: bold; font-size: 20px; margin-top: 16px">Create workspace</p>
          </div>
          <hr style="background-color: #DEE2E6; margin-top: 16px; margin-bottom: 36px">
          <div class="grid grid-cols-1 place-items-center">
              <form class="grid grid-cols-1 place-items-center" @submit.prevent="createWorkspace" style="width: 320px">
                  <div style="width: 52px; height: 52px; background-color: #FF7C5C; border-radius: 8px"></div>
                  <button class="upload-workspace-photo-button" style="margin-top: 16px">
                      Upload photo
                  </button>
                  <div>
                      <p style="font-weight: bold; font-size: 14px; color: #000000; margin-bottom: 12px; margin-top: 24px">Workspace name</p>
                      <input required v-model="workspaceName" type="text" placeholder="Workspace name" style="background-color: #FFFFFF; border: 1px #E7E7E5 solid; border-radius: 8px; width: 320px; height: 36px; padding-left: 8px">
                      <button class="create-workspace-button" :disabled="isRequestInProcess">
                          {{isRequestInProcess ? "Creating..." : 'Create'}}
                      </button>
                  </div>
              </form>
          </div>
      </div>
  </main>
</template>

<script lang="ts" setup>
import { useAuth0 } from '@auth0/auth0-vue';
import {BordieApi} from "./BordieApi.ts";
import {inject, onMounted, ref} from "vue";
import {useRouter} from "vue-router"
const { logout, getAccessTokenSilently, user } = useAuth0();

import { useWorkspacesStore } from "./WorkspacesStore";
const workspacesStore = useWorkspacesStore();

function exit() {
    logout({ logoutParams: { returnTo: window.location.origin } });
}

const workspaceName = ref<String>("")

const isRequestInProcess = ref<boolean>(false)
const isRequestFailed    = ref<boolean>(false)

const router = useRouter()

function createWorkspace() {
    isRequestInProcess.value = true;
    isRequestFailed.value = false;

    getAccessTokenSilently().then(
        token => {
            BordieApi.createWorkspace(token, workspaceName.value).then(response => {
                console.log(response)
                // TODO: Other way to close this page
                if (workspacesStore.userWithWorkspaces) {
                    workspacesStore.workspaces.push(response.data)
                    mixpanel.track('create_workspace', {
                        "type": "extra_workspace",
                        "user_id": user.value?.sub || null
                    })
                    router.push({ name: 'home' })
                } else {
                    workspacesStore.loadWorkspaces(token)
                    mixpanel.track('create_workspace', {
                        "type": "first_workspace",
                        "user_id": user.value?.sub || null
                    })
                }
            }).catch(error => {
                console.log(error)
                isRequestFailed.value = true
            }).finally(() => isRequestInProcess.value = false)
        },
        error => {
            console.log("ERROR:")
            console.log(error)
            isRequestInProcess.value = false
            isRequestFailed.value = true
        }
    )
}

const mixpanel = inject('mixpanel');
onMounted(() => {
    mixpanel.track('pages_visited', {
        "page_name": "Create Workspace Page",
        "workspace_id": null,
        "user_id": user.value?.sub || null
    })
})
</script>

<style scoped>
.logo-box {
    text-align: center;
    border-radius: 8px;

    display: flex;
    justify-content: center;
    align-items: center;
}

.logo-box p {
    color: #000000;
    font-size: 18px;
    font-weight: bold;
}

.header {
    height: 52px;
    background-color: #FFFFFF;
}

.exit-button {
    background-color: #FFFFFF;
    width: 83px;
    height: 28px;
    border: 1px #E7E7E5 solid;
    border-radius: 8px;

    font-size: 14px;
    color: #000000;
}
.exit-button:hover {
    color: #FF7C5C
}

.upload-workspace-photo-button {
    width: 122px;
    height: 28px;
    background-color: #FFFFFF;
    border: 1px #E7E7E5 solid;
    border-radius: 8px;

    color: #000000;
    font-size: 14px;
}
.upload-workspace-photo-button:hover {
    color: #FF7C5C
}

.create-workspace-button {
    width: 320px;
    height: 32px;
    background-color: #F3F3F2;
    border: 1px #E7E7E5 solid;
    border-radius: 8px;
    color: #000000;
    font-size: 14px;
    margin-top: 34px
}
.create-workspace-button:hover {
    color: #FF7C5C
}

.back-button {
    font-size: 14px;
    font-weight: 400;
    height: 28px;
    border: 1px #E7E7E5 solid;
    border-radius: 8px;
    padding-left: 14px;
    padding-right: 16px
}
.back-button:hover {
    color: #FF7C5C
}
</style>