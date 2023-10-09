<template>
    <transition name="modal-fade">
      <div class="modal-backdrop z-50" v-if="showModal" @click="closeModalOnClick">
        <div class="dashboard-element-delete-modal">
          <div style="text-align: center">
            <p class="dashboard-element-delete-modal_title">Delete <span class="dashboard-element-delete-modal_card-name">{{entity?.name}}</span>?</p>
          </div>
          <div v-if="!isRequestInProcess">
            <div style="margin-top: 24px;">
              <button class="dashboard-element-delete-modal_delete-button" @click="confirm">
                {{ isRequestFailed ? 'Try again' : 'Yes'}}, delete this <span class="dashboard-element-delete-modal_delete-button_card-name">{{entity?.name}}</span>
              </button>
            </div>
            <div style="margin-top: 16px; display: flex; justify-content: center">
              <button class="dashboard-element-delete-modal_close-button" @click="close">Close</button>
            </div>
          </div>
          <div v-if="isRequestInProcess" style="margin-top: 24px; display: flex; justify-content: center">
            <img style="width: 74px; height: 74px;" src="@/assets/loading.svg" alt="loading">
          </div>
        </div>
      </div>
    </transition>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import type {WorkspaceElement} from "@/api/BoardsAndFoldersApi"
import { useAuth0 } from '@auth0/auth0-vue';
const { getAccessTokenSilently } = useAuth0();
import { useWorkspacesStore } from "@/WorkspacesStore";
import { useWorkspaceElementsStore } from "@/WorkspaceElementsStore";
import type {ApiCallResult} from "@/api/BoardsAndFoldersApi";
import {BordyApi} from "@/api/BordyApi";

const workspacesStore = useWorkspacesStore();
const workspaceElementsStore = useWorkspaceElementsStore();

const isRequestInProcess = ref<boolean>(false)
const isRequestFailed    = ref<boolean>(false)

const showModal = ref(false);
const entity = ref<WorkspaceElement>();
const entityIndex = ref<number>();
function open(_entity: WorkspaceElement, _entityIndex: number) {
    showModal.value = true;
    entity.value = _entity;
    entityIndex.value = _entityIndex;
}

function close() {
    showModal.value = false
}

async function confirm() {
  isRequestInProcess.value = true;
  isRequestFailed.value    = false;

  const accessToken: string = await getAccessTokenSilently();
  const apiCallResult: ApiCallResult<void> = await BordyApi.BoardsAndFolders.deleteBoardOrFolder(
      accessToken,
      workspacesStore.selectedWorkspace?.id || "",
      entity.value!.id
  );

  if (apiCallResult.httpStatusCode !== 200) {
    isRequestFailed.value = true;
  } else {
    // TODO: [improve] Don't remove anything from dashboard when deleting from folder
    if (entity.value?.folderId === undefined || entity.value?.folderId === null) {
      workspaceElementsStore.removeWorkspaceElement(<number>entityIndex.value)
    } else {
      workspaceElementsStore.removeBoardFromFolder(entity.value!.folderId, <number>entityIndex.value)
    }
    emitDeletedEvent(entity.value!.id);
    showModal.value = false;
  }
  isRequestInProcess.value = false;
}

defineExpose({
    open
})

function closeModalOnClick(event: any) {
  if (event?.target?.className === "modal-backdrop z-50" && isRequestInProcess.value === false) {
    close();
  }
}

const emit = defineEmits<{
  (e: 'deleted', workspaceElementId: string): void
}>()
function emitDeletedEvent(workspaceElementId: string) {
  emit('deleted', workspaceElementId)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dashboard-element-delete-modal {
  background-color: #FFFFFF;
  border-radius: 8px;

  padding: 32px 32px 36px;
}
.dashboard-element-delete-modal_title {
  color: #000000;
  font-size: 16px;
  font-weight: 400;
}
.dashboard-element-delete-modal_card-name {
  color: #000000;
  font-size: 16px;
  font-weight: 700;
}

.dashboard-element-delete-modal_delete-button {
  height: 28px;
  min-width: 276px;
  display: flex;
  place-items: center;
  justify-content: center;

  color: #940B00;

  background-color: #FFEDEC;
  border-radius: 8px;
  border: 1px rgba(148, 11, 0, 0.5) solid;

  padding-left: 36px;
  padding-right: 36px;

  font-size: 14px;
  font-weight: 400;
}
.dashboard-element-delete-modal_delete-button_card-name {
  font-size: 14px;
  font-weight: 700;

  margin-left: 5px;
}
.dashboard-element-delete-modal_delete-button:hover {
  color: #FF7C5C;
  border: 1px #FF7C5C solid;
}

.dashboard-element-delete-modal_close-button {
  height: 28px;
  width: 276px;
  place-items: center;
  text-align: center;

  color: #000000;

  border: 1px #E7E7E5 solid;
  border-radius: 8px;

  font-size: 14px;
  font-weight: 400;
}
.dashboard-element-delete-modal_close-button:hover {
  color: #FF7C5C;
  border: 1px #FF7C5C solid;
}
</style>