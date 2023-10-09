<template>
    <div v-if="isAsyncOperationInProgress || isAsyncOperationFailed">
        <div v-if="isAsyncOperationInProgress" class="flex yaffi-entity-component-action-in-progress-overlay">
            <img width="50" height="50" src="../../assets/loading.svg" alt="loading"/>
            <p>{{asyncOperationDescription}}</p>
        </div>
        <div v-if="isAsyncOperationFailed" class="yaffi-entity-component-action-failed-overlay place-items-center">
            <p>{{asyncOperationErrorDescription}}</p>
            <button type="button" style="width: 58px; height: 28px; border: 1px #FFFFFF solid; border-radius: 8px" @click="closeOperationErrorOverlay">ok</button>
        </div>
    </div>
    <div v-else class="workspace-element">
        <div v-if="!isAsyncOperationInProgress" style="float: right; margin-top: -12px; margin-right: -8px">
            <div class="workspace-element_dropdown">
                <svg ref="dropdownButtonRef" class="workspace-element_dropdown_button" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_657_7300)">
                    <path d="M8 2C7.26667 2 6.66667 2.6 6.66667 3.33333C6.66667 4.06667 7.26667 4.66667 8 4.66667C8.73333 4.66667 9.33333 4.06667 9.33333 3.33333C9.33333 2.6 8.73333 2 8 2ZM8 11.3333C7.26667 11.3333 6.66667 11.9333 6.66667 12.6667C6.66667 13.4 7.26667 14 8 14C8.73333 14 9.33333 13.4 9.33333 12.6667C9.33333 11.9333 8.73333 11.3333 8 11.3333ZM8 6.66667C7.26667 6.66667 6.66667 7.26667 6.66667 8C6.66667 8.73333 7.26667 9.33333 8 9.33333C8.73333 9.33333 9.33333 8.73333 9.33333 8C9.33333 7.26667 8.73333 6.66667 8 6.66667Z"
                          fill="currentColor"/>
                  </g>
                </svg>
                <div ref="dropdownRef" class="workspace-element_dropdown_button_actions">
                    <ul>
                        <li class="workspace-element_dropdown_button_action"><button @click="emitEditEvent">Rename</button></li>
                        <li v-show="entity.type === WorkspaceElementType.Board && entity.folderId != undefined" class="workspace-element_dropdown_button_action"><button @click="removeFromFolder">Remove from folder</button></li>
                        <li class="workspace-element_dropdown_button_action workspace-element_dropdown_button_action__danger"><button @click="emitDeleteEvent">Delete</button></li>
                    </ul>
                </div>
            </div>
        </div>
        <div style="display: flex">
            <div class="workspace-element_icon" v-show="entity.type === WorkspaceElementType.Folder">
                <img src="@/assets/folder-icon.svg" alt="folder icon"/>
            </div>
            <div class="workspace-element_icon" v-show="entity.type === WorkspaceElementType.Board">
              <img src="@/assets/board-icon.svg" alt="board icon"/>
            </div>
            <div>
                <router-link v-if="entity.type === WorkspaceElementType.Folder" :to="{name: 'folder-page', params: {folderId: entity.id}}" @click="handleBreadcrumb(entity)">
                  <p class="workspace-element_name">{{entity.name}}</p>
                </router-link>
                <router-link v-if="entity.type === WorkspaceElementType.Board" :to="{name: 'board-page', params: {boardId: entity.id}}" @click="handleBreadcrumb(entity)">
                  <p class="workspace-element_name">{{entity.name}}</p>
                </router-link>
                <p class="workspace-element_editedAt">{{workspaceElementEditedAt()}}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type {ApiCallResult} from "@/api/BoardsAndFoldersApi"
import {WorkspaceElement, WorkspaceElementType} from "@/api/BoardsAndFoldersApi"
import {useTabsStore} from "../tabs/TabsStore";
import {useAuth0} from '@auth0/auth0-vue';
import {useWorkspacesStore} from "@/WorkspacesStore";
import {useWorkspaceElementsStore} from "@/WorkspaceElementsStore";
import {onMounted, ref} from 'vue'
import {onClickOutside, useEventListener} from "@vueuse/core";
import {BordyApi} from "@/api/BordyApi";

const { getAccessTokenSilently } = useAuth0();

const workspacesStore = useWorkspacesStore();
const workspaceElementsStore = useWorkspaceElementsStore();

const tabsStore = useTabsStore();

const props = defineProps({
    entity: {
        type: WorkspaceElement,
        required: true
    },
    entityIndex: {
        type: Number,
        required: true
    }
})

const isAsyncOperationInProgress = ref<boolean>(false)
const asyncOperationDescription = ref<string>("")
const isAsyncOperationFailed = ref<boolean>(false)
const asyncOperationErrorDescription = ref<string>("")
async function removeFromFolder() {
    showOperationOverlay("Removing from folder");

    const accessToken: string = await getAccessTokenSilently();
    const apiCallResult: ApiCallResult<void> = await BordyApi.BoardsAndFolders.removeBoardFromFolder(
        accessToken,
        workspacesStore.selectedWorkspace?.id || "",
        props.entity?.id || ""
    );

    if (apiCallResult.httpStatusCode !== 200) {
      showOperationErrorOverlay("Error while removing from folder");
    } else {
      emitRemoveBoardFromFolderEvent(props.entity!.id);
    }
    closeOperationOverlay();
}

function showOperationOverlay(operationDescription: string) {
    isAsyncOperationInProgress.value = true
    asyncOperationDescription.value  = operationDescription
}
function closeOperationOverlay() {
    isAsyncOperationInProgress.value = false
    asyncOperationDescription.value = ""
}
function showOperationErrorOverlay(errorDescription: string) {
    isAsyncOperationFailed.value         = true;
    asyncOperationErrorDescription.value = errorDescription
}
function closeOperationErrorOverlay() {
    isAsyncOperationFailed.value         = false;
    asyncOperationErrorDescription.value = ""
}

function workspaceElementEditedAt(): string {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const _MS_PER_HOUR = 1000 * 60 * 60;
    const _MS_PER_MINUTE = 1000 * 60;
    // Discard the time and time-zone information.
    const editedAtDate = new Date(props.entity!.editedAt)
    const currentDate = new Date();
    const utc1 = Date.UTC(
        editedAtDate.getFullYear(),
        editedAtDate.getMonth(),
        editedAtDate.getDate(),
        editedAtDate.getHours(),
        editedAtDate.getMinutes(),
    );
    const utc2 = Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes(),
    );
    const daysAgo = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    if (daysAgo > 0) {
        if (daysAgo === 1) {
            return '1 day ago'
        } else {
            return `${daysAgo} days ago`
        }
    }
    const hoursAgo = Math.floor((utc2 - utc1) / _MS_PER_HOUR);
    if (hoursAgo > 0) {
        if (hoursAgo === 1) {
            return '1 hour ago'
        } else {
            return `${hoursAgo} hours ago`
        }
    }
    const minutesAgo = Math.floor((utc2 - utc1) / _MS_PER_MINUTE);
    if (minutesAgo > 0) {
        if (minutesAgo === 1) {
            return '1 minute ago'
        } else {
            return `${minutesAgo} minutes ago`
        }
    }

    return 'recently'
}

defineExpose({
    showOperationOverlay,
    closeOperationOverlay,
    showOperationErrorOverlay,
    closeOperationErrorOverlay
})


const emit = defineEmits<{
  (e: 'editEvent'): void
  (e: 'deleteEvent'): void
  (e: 'removeBoardFromFolder', boardId: string): void
}>()
function emitEditEvent() {
  emit('editEvent')
}

function emitDeleteEvent() {
  emit('deleteEvent')
}

function emitRemoveBoardFromFolderEvent(boardId: string) {
  emit('removeBoardFromFolder', boardId)
}

const dropdownButtonRef = ref();
const dropdownRef       = ref();
onMounted(() => {
  useEventListener(dropdownButtonRef.value, 'click', showDropdown);
  onClickOutside(dropdownRef.value, hideDropdown);
});
function showDropdown() {
  dropdownRef.value.setAttribute('data-show', '');
}
function hideDropdown() {
  dropdownRef.value.removeAttribute('data-show');
}

import {useBoardBreadcrumbsStore} from "@/components/boards/BoardBreadcrumbsStore"
const boardBreadcrumbsStore = useBoardBreadcrumbsStore();
function handleBreadcrumb(workspaceElement: WorkspaceElement) {
  boardBreadcrumbsStore.open(workspaceElement);
}
</script>

<style scoped>
.workspace-element {
    min-width: 340px;
    max-width: 340px;
    width: 340px;

    min-height: 74px;
    max-height: 74px;
    height: 74px;

    background-color: #FFFFFF;

    border: 1px #E7E7E5 solid;
    border-radius: 8px;
    padding: 16px;
}

.workspace-element_icon {
    min-width: 42px;
    width: 42px;
    min-height: 42px;
    height: 42px;

    border: #E7E7E5 1px solid;
    border-radius: 8px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;

    margin-right: 12px
}

.workspace-element_name {
    color: #000;
    font-family: Manrope;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.workspace-element_name:hover {
    color: #FF7C5C;
    cursor: pointer;
}

.workspace-element_editedAt {
    color: rgba(0,0,0,0.5);
    font-family: Manrope;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}

.yaffi-entity-component-action-in-progress-overlay {
    width: 340px;
    height: 74px;
    background-color: #000000;
    border-radius: 8px;
    padding-left: 18px;
    padding-right: 9px;

    /*opacity: 0.8;
    position: absolute;*/
    color: #FFFFFF;
    text-align: center;
    justify-content: center;
    align-items: center;
}
.yaffi-entity-component-action-failed-overlay {
    width: 340px;
    height: 74px;
    background-color: #FF0000;
    border-radius: 8px;
    padding-left: 18px;
    padding-right: 9px;

    /*opacity: 0.9;
    position: absolute;*/
    color: #FFFFFF;
    text-align: center;
    justify-content: center;
    align-items: center;
}

.workspace-element_dropdown {
    position: relative;
    display: none;
    cursor: pointer;
}

.workspace-element_dropdown_button {
    cursor: pointer;
}

.workspace-element_dropdown_button:hover {
    color: #FF7C5C;
}

.workspace-element:hover .workspace-element_dropdown {
    display: inline-block;
}

.workspace-element_dropdown_button_actions {
    display: none;
    position: absolute;
    background-color: #FFFFFF;
    min-width: 198px;
    border: 1px solid #DEE2E6;
    border-radius: 4px;
    z-index: 1;
}

.workspace-element_dropdown_button_actions[data-show] {
    display: block;
}

.workspace-element_dropdown:hover .workspace-element_dropdown_button {
    color: #FF7C5C;
}

.workspace-element_dropdown_button_action {
    height: 32px;
    color: #000;
    font-family: Manrope;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    padding-left: 16px;

    display: flex;
    place-items: center;
}
.workspace-element_dropdown_button_action:hover {
    color: #FF7C5C;
    background-color: #EDEDED;
}
</style>