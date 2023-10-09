<script setup lang="ts">
import {BordyApi} from "@/api/BordyApi";
import {inject, onMounted, ref} from "vue";
import {useAuth0} from '@auth0/auth0-vue';
import {Pages} from "@/components/SidebarMenu";
import SidebarMenu from "@/components/SidebarMenu.vue";
import WorkspaceSettingsSection from "@/components/workspace/settings/WorkspaceSettingsSection.vue";
import type {Workspace} from "@/api/WorkspacesApi";

const {getAccessTokenSilently, user} = useAuth0();
const mixpanel = inject('mixpanel');

const props = defineProps({
  workspaceId: {
    type: String,
    required: true
  }
})

const isGetWorkspaceRequestInProgressRef   = ref<boolean>(false);
const isGetWorkspaceRequestSuccessRef      = ref<boolean>(false);
const isGetWorkspaceRequestErrorMessageRef = ref<string>("");
const workspaceRef                         = ref<Workspace | null>(null);
onMounted(async () => {
  isGetWorkspaceRequestInProgressRef.value = true;
  const accessToken: string = await getAccessTokenSilently();
  const [
      workspace,
      httpStatus,
      errorMessage
  ] = await BordyApi.Workspaces.getWorkspace(
      accessToken, props.workspaceId
  );
  isGetWorkspaceRequestInProgressRef.value = false;

  if (httpStatus !== 200) {
    if (httpStatus === 403) {
      isGetWorkspaceRequestErrorMessageRef.value = "You don't have access to this page";
    } else if (httpStatus === 404) {
      isGetWorkspaceRequestErrorMessageRef.value = "Workspace not found";
    } else {
      isGetWorkspaceRequestErrorMessageRef.value = "Can't load workspace";
    }

    isGetWorkspaceRequestSuccessRef.value = false;
  } else {
    workspaceRef.value = workspace;
    isGetWorkspaceRequestSuccessRef.value = true;
  }

  mixpanel.track('pages_visited', {
    "page_name": "Workspace Settings",
    "workspace_id": props.workspaceId || null,
    "user_id": user.value?.sub || null
  })
});
</script>

<template>
  <main class="workspace-settings-page">
    <SidebarMenu :selected-page="Pages.workspace_settings"/>
    <div class="flex flex-col grow overflow-auto">
      <div class="workspace-settings-page_title">
        Workspace settings
      </div>
      <div v-if="isGetWorkspaceRequestInProgressRef" class="workspace-settings-page__loading">
        <img src="@/assets/loading.svg" alt="loading">
      </div>
      <div v-if="isGetWorkspaceRequestSuccessRef === false" class="workspace-settings-page__loading-error">
        <span>{{isGetWorkspaceRequestErrorMessageRef}}</span>
      </div>
      <div v-if="isGetWorkspaceRequestSuccessRef" class="workspace-settings-page_body">
        <WorkspaceSettingsSection v-if="workspaceRef !== null" :workspace="workspaceRef"/>
      </div>
    </div>
  </main>
</template>

<style scoped>
.workspace-settings-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #FFF;
}

.workspace-settings-page_title {
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;

  color: #000;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.workspace-settings-page__loading {
  display: grid;
  height: 100%;
  place-items: center;
}

.workspace-settings-page__loading-error {
  display: grid;
  height: 100%;
  place-items: center;
}

.workspace-settings-page_body {

}
</style>