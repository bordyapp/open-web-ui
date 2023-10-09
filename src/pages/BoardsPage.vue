<script setup lang="ts">
import SidebarMenu from "@/components/SidebarMenu.vue";
import {Pages} from "@/components/SidebarMenu";
import {useWorkspacesStore} from "@/WorkspacesStore";
import {useAuth0} from "@auth0/auth0-vue";
import {computed, inject, onMounted, reactive, ref, watch} from "vue";
import {BordyApi} from "@/api/BordyApi";
import type {Workspace} from "@/api/WorkspacesApi";
import type {WorkspaceElement, ApiCallResult} from "@/api/BoardsAndFoldersApi";
import {WorkspaceElementType} from "@/api/BoardsAndFoldersApi";
import YaffiEntityDeleteModal from "@/components/dashboard/YaffiEntityDeleteModal.vue";
import YaffiEntityModal from "@/components/dashboard/YaffiEntityModal.vue";
import NewWorkspaceElementComponent from "@/components/dashboard/NewWorkspaceElementComponent.vue";
import WorkspaceElementComponent from "@/components/dashboard/WorkspaceElementComponent.vue";
import {useWorkspaceElementsStore} from "@/WorkspaceElementsStore";
import BoardsPageSkeleton from "@/pages/BoardsPageSkeleton.vue";

const workspacesStore                  = useWorkspacesStore();
const workspaceElementsStore           = useWorkspaceElementsStore();
const { user, getAccessTokenSilently } = useAuth0();

const mixpanel = inject('mixpanel');
onMounted(async () => {
  mixpanel.track('pages_visited', {
    "page_name": "Boards",
    "workspace_id": workspacesStore.selectedWorkspace?.id || null,
    "user_id": user.value?.sub || null
  })
  await loadBoardsAndFolders(workspacesStore.selectedWorkspace!.id);
})
watch(() => workspacesStore.selectedWorkspace, async (newWorkspace: Workspace, oldWorkspace: Workspace, onCleanup) => {
  if (newWorkspace?.id != oldWorkspace?.id) {
    await loadBoardsAndFolders(newWorkspace!.id);
  }
})

const workspaceIdRef                              = ref<string>("");
const isGetBoardsAndFoldersRequestInProgressRef   = ref<boolean>(false);
const isGetBoardsAndFoldersRequestSuccessRef      = ref<boolean>(false);
const isGetBoardsAndFoldersRequestErrorMessageRef = ref<string>("");
const boardsAndFolders                            = ref<WorkspaceElement[]>([]);

async function loadBoardsAndFolders(workspaceId: string) {
  workspaceIdRef.value = workspaceId;
  isGetBoardsAndFoldersRequestInProgressRef.value = true;
  const accessToken: string = await getAccessTokenSilently();
  const apiCallResult: ApiCallResult<WorkspaceElement[]> = await BordyApi.BoardsAndFolders.getBoardsAndFolders(
      accessToken, workspaceId
  );

  isGetBoardsAndFoldersRequestInProgressRef.value = false;

  if (apiCallResult.httpStatusCode !== 200) {
    if (apiCallResult.httpStatusCode === 403) {
      isGetBoardsAndFoldersRequestErrorMessageRef.value = "You don't have access to this page";
    } else if (apiCallResult.httpStatusCode === 404) {
      isGetBoardsAndFoldersRequestErrorMessageRef.value = "Boards and folders not found";
    } else {
      isGetBoardsAndFoldersRequestErrorMessageRef.value = "Can't load boards and folders";
    }

    isGetBoardsAndFoldersRequestSuccessRef.value = false;
  } else {
    boardsAndFolders.value = apiCallResult.data || [];
    isGetBoardsAndFoldersRequestSuccessRef.value = true;
  }
}

const yaffiEntityModal = ref();
const yaffiEntityDeleteModal = ref();
function openEditModal(workspaceElement: WorkspaceElement) {
  yaffiEntityModal.value?.open(workspaceElement, undefined, workspaceElement.type, false);
}
function openDeleteModal(workspaceElement: WorkspaceElement, workspaceElementIndex: number) {
  yaffiEntityDeleteModal.value?.open(workspaceElement, workspaceElementIndex);
}

function openCreateBoardModal() {
  yaffiEntityModal.value.open(undefined, undefined, WorkspaceElementType.Board, false);
}

const renderedComponents = reactive(new Map<string, any>())
function startDrag(evt, entity, entityIndex) {
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.dataTransfer.setData('entityId', entity.id)
  evt.dataTransfer.setData('entityIndex', entityIndex)
  evt.dataTransfer.setData('entityType', entity.type)
}
async function onDrop(evt, folder) {
  const entityId = evt.dataTransfer.getData('entityId')
  const entityIndex = evt.dataTransfer.getData('entityIndex')
  const entityType = evt.dataTransfer.getData('entityType')

  if (folder.id === entityId || folder.type === WorkspaceElementType.Board || entityType === WorkspaceElementType.Folder) {
    return;
  }

  renderedComponents.get(entityId)?.showOperationOverlay("Moving board to folder");
  const accessToken: string = await getAccessTokenSilently();
  const apiCallResult: ApiCallResult<void> = await BordyApi.BoardsAndFolders.addBoardToFolder(
      accessToken,
      workspacesStore.selectedWorkspace?.id || "",
      entityId,
      folder.id
  );

  if (apiCallResult.httpStatusCode !== 200) {
    renderedComponents.get(entityId)?.showOperationErrorOverlay("Error while moving board to folder");
  } else {
    remove(entityId);
  }
  renderedComponents.get(entityId)?.closeOperationOverlay();
}

function remove(workspaceElementId: string) {
  let selfIndex = -1;
  boardsAndFolders.value?.forEach((element, index) => {
    if (element.id === workspaceElementId) {
      selfIndex = index;
    }
  });

  if (selfIndex !== -1) {
    // renderedComponents.delete(workspaceElementId);
    boardsAndFolders.value?.splice(selfIndex, 1);
  }
}

function render(workspaceElement: WorkspaceElement | undefined) {
  if (workspaceElement) {
    boardsAndFolders.value?.push(workspaceElement);
  }
}
</script>

<template>
  <main class="boards-page">
    <SidebarMenu :selected-page="Pages.boards"/>
    <BoardsPageSkeleton v-if="isGetBoardsAndFoldersRequestInProgressRef"/>
    <div v-if="!isGetBoardsAndFoldersRequestInProgressRef" class="flex flex-col grow overflow-auto">
      <div class="flex flex-wrap place-items-center" style="margin-left: 20px; margin-right: 20px; margin-top: 20px;">
        <p class="boards-page_title">Boards</p>
        <NewWorkspaceElementComponent v-if="boardsAndFolders.length > 0" actionName="New board" :workspaceElementType="WorkspaceElementType.Board" style="margin-left: 12px; margin-right: 12px" @created="render"/>
        <NewWorkspaceElementComponent v-if="boardsAndFolders.length > 0" actionName="New folder" :workspaceElementType="WorkspaceElementType.Folder" @created="render"/>
      </div>
      <div v-if="!isGetBoardsAndFoldersRequestSuccessRef" class="boards-page_body__loading">
        <div v-if="!isGetBoardsAndFoldersRequestInProgressRef && !isGetBoardsAndFoldersRequestSuccessRef">
          <button class="boards-page_body__loading_re-try-button boards-page_body__loading_text" @click="loadBoardsAndFolders(workspaceIdRef)">Retry load board and folders</button>
        </div>
      </div>
      <div v-if="!isGetBoardsAndFoldersRequestInProgressRef && isGetBoardsAndFoldersRequestSuccessRef" class="boards-page_body">
        <div v-if="boardsAndFolders.length === 0" class="boards-page_body_no-boards-and-folders">
          <img src="@/assets/boards-empty-state.png" alt="empty-state">
          <div style="margin-left: 21px">
            <div>
              <p class="boards-page_body_no-boards-and-folders_title">Welcome!</p>
              <p class="boards-page_body_no-boards-and-folders_description">Let's create the first board</p>
            </div>
            <div style="margin-top: 17px">
              <button class="boards-page_body_no-boards-and-folders_create-board-button" @click="openCreateBoardModal()">New board</button>
            </div>
          </div>
        </div>
        <div v-if="boardsAndFolders.length > 0" style="margin-top: 16px; margin-left: 20px; margin-right: 20px">
          <ul class="flex flex-wrap gap-2">
            <li v-for="(workspaceElement, entityIndex) in boardsAndFolders" class="flex">
              <WorkspaceElementComponent v-if="workspaceElement.type === WorkspaceElementType.Board"
                                         :ref="(el) => renderedComponents.set(workspaceElement.id, el)"
                                         draggable="true"
                                         @dragstart="startDrag($event, workspaceElement, entityIndex)"
                                         :entity-index="entityIndex"
                                         :entity="workspaceElement"
                                         class="draggable"
                                         @editEvent="openEditModal(workspaceElement)"
                                         @deleteEvent="openDeleteModal(workspaceElement, entityIndex)"
              />
              <WorkspaceElementComponent v-else
                                         @drop="onDrop($event, workspaceElement)"
                                         @dragover.prevent
                                         @dragenter.prevent
                                         :entity-index="entityIndex"
                                         :entity="workspaceElement"
                                         @editEvent="openEditModal(workspaceElement)"
                                         @deleteEvent="openDeleteModal(workspaceElement, entityIndex)"
              />
            </li>
          </ul>
        </div>
        <YaffiEntityModal ref="yaffiEntityModal" @created="render"/>
        <YaffiEntityDeleteModal ref="yaffiEntityDeleteModal" @deleted="remove"/>
      </div>
    </div>
  </main>
</template>

<style scoped>
.boards-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #FFF;
}

.boards-page_title {
  color: #000;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.boards-page_body__loading {
  height: 100%;
  width: 100%;
  place-items: center;

  display: flex;
  justify-content: center;
  align-items: center;
}

.boards-page_body__loading_text {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 114.286% */
}

.boards-page_body__loading_re-try-button {
  height: 28px;
  padding-left: 12px;
  padding-right: 12px;

  border-radius: 8px;
  border: 1px solid #E7E7E5;
  background: #FFF;
}
.boards-page_body__loading_re-try-button:hover {
  color: #FF7C5C;
}

.boards-page_body {
  margin-bottom: 20px;

  flex-grow: 1;
  display: flex;
}

.boards-page_body_no-boards-and-folders {
  display: flex;
  width: 100%;
  height: 100%;

  place-items: center;
  justify-content: center;
  align-items: center;
}

.boards-page_body_no-boards-and-folders_title {
  color: #000;
  font-family: Manrope;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.boards-page_body_no-boards-and-folders_description {
  color: #000;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  opacity: 0.5;
}

.boards-page_body_no-boards-and-folders_create-board-button {
  color: #000;
  font-family: Manrope;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  height: 28px;
  padding-left: 12px;
  padding-right: 12px;

  border-radius: 8px;
  border: 1px solid #E7E7E5;
  background: #FFF;
}
.boards-page_body_no-boards-and-folders_create-board-button:hover {
  color: #FF7C5C;
}
</style>