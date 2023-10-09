<script setup lang="ts">
import {onMounted, ref} from "vue";
import { onClickOutside, useEventListener } from "@vueuse/core";

import {useAuth0} from '@auth0/auth0-vue';
import {useWorkspacesStore} from "@/WorkspacesStore";
import type {Workspace} from "@/BordieApi";
const {getAccessTokenSilently} = useAuth0();

const workspacesStore = useWorkspacesStore();
onMounted(async () => {
  await loadWorkspaces();
  useEventListener(workspacesDropdownRef.value, 'click', showDropdown);
  onClickOutside(workspacesDropdownSelectRef.value, hideDropdown);
})

async function loadWorkspaces() {
  const accessToken: string = await getAccessTokenSilently();
  await workspacesStore.loadWorkspaces(accessToken);
}

function selectWorkspace(workspace: Workspace) {
  workspacesStore.selectWorkspace(workspace);
  hideDropdown();
}

const workspacesDropdownRef       = ref()
const workspacesDropdownSelectRef = ref()
function showDropdown() {
  console.log("show workspaces")
  workspacesDropdownSelectRef.value?.setAttribute('data-show', '');
}
function hideDropdown() {
  console.log("hide workspaces")
  workspacesDropdownSelectRef.value?.removeAttribute('data-show');
}
</script>

<template>
  <div class="workspaces-dropdown">
    <div v-if="workspacesStore.isLoading" class="workspaces-dropdown__loading">
      <span class="workspaces-dropdown__loading_text">loading workspaces</span>
      <img class="workspaces-dropdown__loading_icon" src="@/assets/loading.svg" alt="loading">
    </div>
    <div v-if="workspacesStore.loadedWithErrors" class="workspaces-dropdown__loading-error">
      <button @click="loadWorkspaces">Retry load workspaces</button>
    </div>
    <div v-if="workspacesStore.loadedWithoutErrors" class="workspaces-dropdown__loading-success">
      <div v-if="workspacesStore.selectedWorkspace?.photo === undefined || workspacesStore.selectedWorkspace?.photo === null || workspacesStore.selectedWorkspace?.photo === ''" class="workspaces-dropdown_selected-workspace_placeholder-photo flex-none">
        {{workspacesStore.selectedWorkspace?.name?.substring(0, 2).toUpperCase()}}
      </div>
      <img v-else class="workspaces-dropdown_selected-workspace_photo flex-none" :src="workspacesStore.selectedWorkspace?.photo" alt="workspace-image">
      <span class="workspaces-dropdown_selected-workspace_name flex-grow">{{workspacesStore.selectedWorkspace?.name}}</span>
      <button class="flex-none" ref="workspacesDropdownRef">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8.00001 8.78145L11.3 5.48145L12.2427 6.42411L8.00001 10.6668L3.75734 6.42411L4.70001 5.48145L8.00001 8.78145Z" fill="#737372"/>
        </svg>
      </button>
    </div>
    <div v-if="workspacesStore.loadedWithoutErrors" class="workspaces-dropdown_select" ref="workspacesDropdownSelectRef">
      <ul class="workspaces-dropdown_select_workspaces">
        <li v-for="(workspace) in workspacesStore.workspaces" class="workspaces-dropdown_select_workspaces_workspace">
          <div v-if="workspace.photo === undefined || workspace.photo === null || workspace.photo === ''" class="workspaces-dropdown_select_workspaces_workspace_placeholder-photo flex-none">
            {{workspace.name.substring(0, 2).toUpperCase()}}
          </div>
          <img v-else class="workspaces-dropdown_select_workspaces_workspace_photo flex-none" :src="workspace.photo" alt="workspace-image">
          <span v-if="workspacesStore.selectedWorkspace?.id === workspace.id" class="workspaces-dropdown_select_workspaces_workspace_name__selected flex-grow pl-2">{{workspace.name}}</span>
          <button v-else :disabled="workspacesStore.isLoading" @click="selectWorkspace(workspace)" class="workspaces-dropdown_select_workspaces_workspace_name pl-2">
            {{workspace.name}}
          </button>
          <svg v-if="workspacesStore.selectedWorkspace?.id === workspace.id" width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.179332 4.40625L0.935014 3.63068L3.56001 6.21591L8.98899 0.806818L9.76456 1.58239L3.56001 7.76705L0.179332 4.40625Z"
                  fill="black"/>
          </svg>
        </li>
      </ul>
      <hr style="height: 1px; background: #E9E9EE; margin-top: 4px; margin-bottom: 4px">
      <ul class="workspaces-dropdown_select_actions">
        <router-link :to="{ name: 'workspace-settings', params: {workspaceId: workspacesStore.selectedWorkspace?.id}}">
          <li class="workspaces-dropdown_select_actions_action">
            Workspace settings
          </li>
        </router-link>
        <router-link :to="{ name: 'create-workspace' }">
          <li class="workspaces-dropdown_select_actions_action">
            Create a workspace
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.workspaces-dropdown {
  margin: 16px 8px;
  width: 204px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid #E9E9EE;
  background: #E9E9EE;

  display: flex;
  place-items: center;
}

.workspaces-dropdown__loading {
  display: flex;
  place-items: center;
}

.workspaces-dropdown__loading_text {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  padding-left: 9px;
}

.workspaces-dropdown__loading_icon {
  width: 25px;
  height: 25px;
}

.workspaces-dropdown__loading-error {
  display: flex;
  place-items: center;

  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  padding-left: 9px;
}

.workspaces-dropdown__loading-success {
  display: flex;
  place-items: center;
  width: 100%;

  padding-left: 9px;
  padding-right: 9px;

  gap: 0.5rem/* 8px */;
}

.workspaces-dropdown_selected-workspace_placeholder-photo {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 2px;
  background: #42526E;

  display: flex;
  place-items: center;
  padding-left: 3px;

  color: #FFF;
  font-family: Manrope;
  font-size: 8px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.workspaces-dropdown_selected-workspace_photo {
  width: 18px;
  height: 18px;
  border-radius: 2px;
}

.workspaces-dropdown_selected-workspace_name {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.workspaces-dropdown_select {
  width: 308px;
  position: absolute;
  left: 8px;
  top: 58px;
  display: none;

  border-radius: 4px;
  border: 1px solid #E9E9EE;
  background: #FFF;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.10);

  padding-top: 8px;
  padding-bottom: 8px;
}

.workspaces-dropdown_select[data-show] {
  display: block;
}

.workspaces-dropdown_select_workspaces {
  display: flex;
  flex-direction: column;
  gap: 0.125rem/* 2px */;

  padding-left: 16px;
  padding-right: 7px;
}

.workspaces-dropdown_select_workspaces_workspace {
  height: 32px;
  display: inline-flex;
  align-items: center;
}

.workspaces-dropdown_select_workspaces_workspace_placeholder-photo {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 2px;
  background: #42526E;

  display: flex;
  place-items: center;
  padding-left: 4px;

  color: #FFF;
  font-family: Manrope;
  font-size: 8px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.workspaces-dropdown_select_workspaces_workspace_photo {
  width: 20px;
  height: 20px;
  border-radius: 2px;
}

.workspaces-dropdown_select_workspaces_workspace_name {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 114.286% */

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.workspaces-dropdown_select_workspaces_workspace_name:hover {
  color: #FF7C5C;
}
.workspaces-dropdown_select_workspaces_workspace_name__selected {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.workspaces-dropdown_select_actions {
  display: flex;
  flex-direction: column;
  gap: 0.125rem/* 2px */;

  padding-left: 16px;
  padding-right: 7px;
}

.workspaces-dropdown_select_actions_action {
  height: 28px;
  display: inline-flex;
  align-items: center;

  color: rgba(0, 0, 0, 0.50);
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 133.333% */
}

.workspaces-dropdown_select_actions_action:hover {
  color: #FF7C5C;
}
</style>