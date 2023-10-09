<template>
    <div class="workspace-dropdown">
        <div v-show="workspacesStore.isLoading" class="workspace-dropdown__loading">
            <p>Loading workspaces</p>
            <img width="25" height="25" src="../../assets/loading.svg" alt="loading">
        </div>
        <div v-show="workspacesStore.loadedWithErrors" class="workspace-dropdown__loading-error">
            <button @click="retry">Retry load workspaces</button>
        </div>
        <div v-show="workspacesStore.loadedWithoutErrors">
            <div class="workspace-dropdown_button flex" ref="dropdownButtonRef">
                <img class="flex-none" :src="workspacesStore.selectedWorkspace?.photo" alt="workspace-image" width="20" height="20" style="border-radius: 2px">
                <p class="grow" style="margin-left: 8px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{workspacesStore.selectedWorkspace?.name}}</p>
                <img class="flex-none" src="../../assets/arrow-down-icon.svg" style="margin-left: 5px; margin-right: 5px; color: #FFFFFF" alt="dropdown icon">
            </div>
            <div class="workspace-dropdown_button_actions" style="padding-top: 12px; padding-bottom: 12px" ref="dropdownRef">
                <div v-for="(workspace) in workspacesStore.workspaces" class="flex place-items-center" style="height: 32px; margin-left: 12px; margin-right: 12px; font-size: 14px; color: #000000">
                    <img class="flex-none" :src="workspace.photo" width="20" height="20" alt="avatar" style="margin-right: 5px; border-radius: 2px">
                    <p v-if="workspacesStore.selectedWorkspace?.id === workspace.id" class="grow">{{workspace.name}}</p>
                    <button :disabled="workspaceElementsStore.isLoading || workspacesStore.isLoading" @click="selectWorkspace(workspace)" class="select-workspace-button" v-else>
                        {{workspace.name}}
                    </button>
                    <img class="flex-none" v-if="workspacesStore.selectedWorkspace?.id === workspace.id" src="../../assets/selected-workspace.svg" alt="selected-workspace">
                </div>
                <hr style="margin-top: 12px; margin-bottom: 12px">
                <ul>
                    <li v-if="workspacesStore.selectedWorkspace?.ownerId === user.sub" class="flex workspace-dropdown-action place-items-center">
                        <router-link :to="{ name: 'workspace-settings', params: {workspaceId: workspacesStore.selectedWorkspace?.id}}">
                            <button>Workspace settings</button>
                        </router-link>
                    </li>
                    <li class="flex workspace-dropdown-action place-items-center">
                        <router-link :to="{ name: 'create-workspace' }">
                            <button>Create a workspace</button>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import {onMounted, ref} from 'vue'
import { onClickOutside, useEventListener } from "@vueuse/core";
import { useTabsStore } from "../tabs/TabsStore";
import { useWorkspacesStore } from "../../WorkspacesStore";
import { useWorkspaceElementsStore } from "../../WorkspaceElementsStore";

const tabsStore              = useTabsStore();
const workspacesStore        = useWorkspacesStore();
const workspaceElementsStore = useWorkspaceElementsStore();
const dropdownButtonRef      = ref();
const dropdownRef            = ref();
function showDropdown() {
    console.log("show workspaces")
    dropdownRef.value.setAttribute('data-show', '');
}
function hideDropdown() {
    console.log("hide workspaces")
    dropdownRef.value.removeAttribute('data-show');
}

const { getAccessTokenSilently, user } = useAuth0();

onMounted(() => {
    tabsStore.closeAllTabs()
    getAccessTokenSilently().then(token => {
        workspacesStore.loadWorkspaces(token)
    }, error => {
        console.log("Error: " + error)
        workspacesStore.isLoading = false
        workspacesStore.isLoadingError = true
    })
    useEventListener(dropdownButtonRef.value, 'click', showDropdown);
    onClickOutside(dropdownRef.value, hideDropdown);
})

function retry() {
    getAccessTokenSilently().then(token => {
        workspacesStore.loadWorkspaces(token)
    }, error => {
        console.log("Error: " + error)
        workspacesStore.isLoading = false
        workspacesStore.isLoadingError = true
    })
}

function selectWorkspace(workspace) {
    hideDropdown();
    workspacesStore.selectWorkspace(workspace)
    getAccessTokenSilently().then(token => {
        workspaceElementsStore.loadWorkspaceElements(token, workspace.id)
        tabsStore.closeAllTabs()
    }, error => {
        console.log("Error: " + error)
        workspaceElementsStore.isLoading = false
        workspaceElementsStore.isLoadingError = true
    })
}
</script>

<style scoped>
.workspace-dropdown {
    width: 168px;
    height: 28px;
    max-height: 28px;

    background-color: #E7E7E5;

    border: 1px solid #E7E7E5;
    border-radius: 8px;

    font-size: 14px;
    font-weight: 400;
    color: #000000;
}

.workspace-dropdown__loading {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
}

.workspace-dropdown__loading-error {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;

    color: #990B00;
}

.workspace-dropdown_button {
    padding: 3px 12px;
    max-height: 28px;

    overflow: hidden;
    cursor: pointer;
}

.workspace-dropdown {
    position: relative;
}

.workspace-dropdown_button_actions {
    background-color: #FFFFFF;
    border: 1px #DEE2E6 solid;
    border-radius: 8px;

    min-width: 308px;
    position: absolute;
    left: 0;
    display: none;
}

.workspace-dropdown_button_actions[data-show] {
    display: block;
}

.workspace-dropdown-action {
    padding-left: 12px;
    padding-right: 12px;
    font-size: 12px;
    height: 28px;
    color: rgba(0, 0, 0, 0.5);
}
.workspace-dropdown-action:hover {
    color: #FF7C5C;
    background-color: #EDEDED;
}
.workspace-dropdown-action img {
    margin-right: 10px;
}

.select-workspace-button:hover {
    color: #FF7C5C;
}
</style>