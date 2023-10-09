<template>
    <div v-if="showModal" class="workspace-element-modal_backdrop" @click="closeModalOnClick" @keydown="closeModalOnEsc">
        <form class="workspace-element-modal" @submit.prevent="save">
            <div class="workspace-element-modal_header">
                <div></div>
                <div class="justify-self-center">
                    <p class="workspace-element-modal_header_title">{{modalTitle()}}</p>
                </div>
                <div class="justify-self-end" style="margin-right: 15px">
                  <button v-if="!isRequestInProcess" class="workspace-element-modal_form_save-button">
                    {{ isRequestFailed ? 'Try again' : 'Save' }}
                  </button>
                  <div v-if="isRequestInProcess" style="display: flex; justify-content: center">
                    <img style="width: 28px; height: 28px;" src="../../assets/loading.svg" alt="loading">
                  </div>
                </div>
            </div>
            <hr/>
            <div class="workspace-element-modal_form">
                <input v-model="entityName" ref="entityNameInput" required type="text" placeholder="Name" class="workspace-element-modal_form_text-input"/>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import {inject, nextTick, ref} from "vue";
import {useTabsStore} from "../tabs/TabsStore";
import {BordyApi} from "@/api/BordyApi";
import {WorkspaceElement, WorkspaceElementType} from "@/api/BoardsAndFoldersApi"
import type {ApiCallResult} from "@/api/BoardsAndFoldersApi"
import { useAuth0 } from '@auth0/auth0-vue';
const { getAccessTokenSilently, user } = useAuth0();
import { useWorkspacesStore } from "../../WorkspacesStore";
import { useWorkspaceElementsStore } from "../../WorkspaceElementsStore";

const workspacesStore = useWorkspacesStore();
const workspaceElementsStore = useWorkspaceElementsStore();
const tabsStore = useTabsStore();

const isRequestInProcess = ref<boolean>(false)
const isRequestFailed    = ref<boolean>(false)

const showModal = ref<boolean>(false);
const entityName = ref<String>("");
const entity = ref<WorkspaceElement | undefined>(undefined);
const folderId = ref<string | undefined>(undefined);
const entityType = ref<WorkspaceElementType>();
const openBoardInNewTab = ref<boolean>(false);
function open(
    _entity: WorkspaceElement | undefined = undefined,
    _folderId: string | undefined = undefined,
    _entityType: WorkspaceElementType,
    _openBoardInNewTab: boolean = false
) {
    entityName.value = _entity?.name || "";
    entity.value = _entity;
    folderId.value = _folderId;
    entityType.value = _entityType;
    openBoardInNewTab.value = _openBoardInNewTab;

    showModal.value = true;

    nextTick(() => {
      entityNameInput.value.focus();
    });
}

function close() {
    showModal.value = false
}

const mixpanel = inject('mixpanel');
async function save() {
  const accessToken: string = await getAccessTokenSilently();

  isRequestFailed.value = false;
  isRequestInProcess.value = true;
  if (entity.value == undefined) {
    let apiCallResult: ApiCallResult<WorkspaceElement>;
    if (entityType.value === WorkspaceElementType.Board) {
      apiCallResult = await BordyApi.BoardsAndFolders.createBoardOrFolder(
          accessToken,
          workspacesStore.selectedWorkspace?.id || "",
          entityName.value,
          folderId.value,
          WorkspaceElementType.Board
      );
    } else if (entityType.value === WorkspaceElementType.Folder) {
      apiCallResult = await BordyApi.BoardsAndFolders.createBoardOrFolder(
          accessToken,
          workspacesStore.selectedWorkspace?.id || "",
          entityName.value,
          undefined,
          WorkspaceElementType.Folder
      );
    }

    if (apiCallResult.httpStatusCode !== 200) {
      isRequestFailed.value = true;
    } else {
      if (entityType.value === WorkspaceElementType.Board) {
        mixpanel.track('create_board', {
          "workspace_id": workspacesStore.selectedWorkspace?.id || null,
          "folder_id": folderId.value || null,
          "user_id": user.value?.sub || null
        })
      } else if (entityType.value === WorkspaceElementType.Folder) {
        mixpanel.track('create_folder', {
          "workspace_id": workspacesStore.selectedWorkspace?.id || null,
          "user_id": user.value?.sub || null
        })
      }

      emitCreatedEvent(apiCallResult.data);
      showModal.value = false
    }
  } else {
    const apiCallResult: ApiCallResult<void> = await BordyApi.BoardsAndFolders.renameBoardOrFolder(
        accessToken,
        workspacesStore.selectedWorkspace?.id || "",
        entity.value?.id || "",
        entityName.value
    );

    if (apiCallResult.httpStatusCode !== 200) {
      isRequestFailed.value = true;
    } else {
      entity.value!.name = entityName.value;
      showModal.value = false;
    }
  }
  isRequestInProcess.value = false;
}

function modalTitle(): String {
    if (entity.value === undefined) {
        return entityType.value === WorkspaceElementType.Board ? 'New board' : 'New folder'
    }

    return entity.value!.type === WorkspaceElementType.Board ? 'Edit board' : 'Edit folder'
}

defineExpose({
    open
})

function closeModalOnClick(event: any) {
  if (event?.target?.className === "workspace-element-modal_backdrop" && isRequestInProcess.value === false) {
    close();
  }
}

function closeModalOnEsc(event: KeyboardEvent) {
  console.log(event);
  if (event.key === "Escape") {
    close();
  }
}

const entityNameInput = ref();

const emit = defineEmits<{
  (e: 'created', workspaceElement: WorkspaceElement | undefined): void
}>()
function emitCreatedEvent(workspaceElement: WorkspaceElement | undefined) {
  emit('created', workspaceElement)
}
</script>

<style scoped>
.workspace-element-modal {
    background: #FFFFFF;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    width: 652px;
}

.workspace-element-modal_header {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    justify-items: stretch;
    padding-top: 13px;
    padding-bottom: 13px
}
.workspace-element-modal_header_title {
    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

.workspace-element-modal_form {
    display: grid;
    justify-content: center;
    padding: 16px 24px 42px;
}
.workspace-element-modal_form_text-input {
    width: 588px;
    height: 36px;
    border: #E7E7E5 1px solid;
    border-radius: 8px;
    padding-left: 16px
}

.workspace-element-modal_form_save-button {
    height: 28px;
    border-radius: 8px;
    border: 1px solid #E7E7E5;
    background: #FFF;
    padding-left: 16px;
    padding-right: 16px;

    color: #000;
    text-align: right;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}
.workspace-element-modal_form_save-button:hover {
    color: #FF7C5C;
}

.workspace-element-modal_backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
}
</style>