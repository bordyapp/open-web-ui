<script setup lang="ts">
import {Pages} from "@/components/SidebarMenu";
import SidebarMenu from "@/components/SidebarMenu.vue";
import {useWorkspacesStore} from "@/WorkspacesStore";
import {useAuth0} from "@auth0/auth0-vue";
import {inject, onMounted, ref, watch} from "vue";
import type {Workspace} from "@/api/WorkspacesApi";
import {BordyApi} from "@/api/BordyApi";
import type {WorkspaceElement, ApiCallResult} from "@/api/BoardsAndFoldersApi";
import WorkspaceElementComponent from "@/components/dashboard/WorkspaceElementComponent.vue";
import {WorkspaceElementType} from "@/api/BoardsAndFoldersApi";
import YaffiEntityModal from "@/components/dashboard/YaffiEntityModal.vue";
import YaffiEntityDeleteModal from "@/components/dashboard/YaffiEntityDeleteModal.vue";
import BoardBreadcrumbs from "@/components/boards/BoardBreadcrumbs.vue";
import {useBoardBreadcrumbsStore} from "@/components/boards/BoardBreadcrumbsStore";
import FolderPageSkeleton from "@/pages/boards/FolderPageSkeleton.vue";

const workspacesStore = useWorkspacesStore();
const { user, getAccessTokenSilently } = useAuth0();

const props = defineProps({
  folderId: {
    type: String,
    required: true
  }
})

const boardBreadcrumbsStore = useBoardBreadcrumbsStore();
const mixpanel = inject('mixpanel');
onMounted(async () => {
  mixpanel.track('pages_visited', {
    "page_name": "Folder page",
    "workspace_id": workspacesStore.selectedWorkspace?.id || null,
    "user_id": user.value?.sub || null
  });
  await loadFolder(workspacesStore.selectedWorkspace!.id);
})
watch(() => workspacesStore.selectedWorkspace, async (newWorkspace: Workspace, oldWorkspace: Workspace, onCleanup) => {
  if (newWorkspace?.id != oldWorkspace?.id) {
    await loadFolder(newWorkspace!.id);
  }
})

const workspaceIdRef                    = ref<string>("");
const isGetFolderRequestInProgressRef   = ref<boolean>(false);
const isGetFolderRequestSuccessRef      = ref<boolean>(false);
const isGetFolderRequestErrorMessageRef = ref<string>("");
const folder                            = ref<WorkspaceElement>();
async function loadFolder(workspaceId: string) {
  workspaceIdRef.value = workspaceId;
  isGetFolderRequestInProgressRef.value = true;
  const accessToken: string = await getAccessTokenSilently();
  const apiCallResult: ApiCallResult<WorkspaceElement> = await BordyApi.BoardsAndFolders.getBoardOrFolder(
      accessToken, workspaceId, props.folderId
  );

  isGetFolderRequestInProgressRef.value = false;

  if (apiCallResult.httpStatusCode !== 200) {
    if (apiCallResult.httpStatusCode === 403) {
      isGetFolderRequestErrorMessageRef.value = "You don't have access to this folder";
    } else if (apiCallResult.httpStatusCode === 404) {
      isGetFolderRequestErrorMessageRef.value = "Folder not found";
    } else {
      isGetFolderRequestErrorMessageRef.value = "Can't load folder";
    }

    isGetFolderRequestSuccessRef.value = false;
  } else {
    folder.value = apiCallResult.data;
    boardBreadcrumbsStore.sync(folder.value!);
    isGetFolderRequestSuccessRef.value = true;
  }
}

const yaffiEntityModal       = ref()
const yaffiEntityDeleteModal = ref()
function createBoard() {
  yaffiEntityModal.value?.open(undefined, props.folderId, WorkspaceElementType.Board, false)
}
function openEditModal(workspaceElement: WorkspaceElement) {
  yaffiEntityModal.value?.open(workspaceElement, undefined, workspaceElement.type, false);
}
function openDeleteModal(workspaceElement: WorkspaceElement, workspaceElementIndex: number) {
  yaffiEntityDeleteModal.value?.open(workspaceElement, workspaceElementIndex);
}

function remove(workspaceElementId: string) {
  let selfIndex = -1;
  folder.value?.boards.forEach((element, index) => {
    if (element.id === workspaceElementId) {
      selfIndex = index;
    }
  });

  if (selfIndex !== -1) {
    folder.value?.boards.splice(selfIndex, 1);
  }
}

function render(workspaceElement: WorkspaceElement | undefined) {
  if (workspaceElement) {
    folder.value?.boards?.push(workspaceElement);
  }
}
</script>

<template>
  <main class="folder-page">
    <SidebarMenu :selected-page="Pages.boards"/>
    <FolderPageSkeleton v-if="isGetFolderRequestInProgressRef"/>
    <div v-if="!isGetFolderRequestInProgressRef" class="flex flex-col grow overflow-auto">
      <div v-if="!isGetFolderRequestInProgressRef && isGetFolderRequestSuccessRef" style="margin-left: 20px; margin-right: 20px; margin-top: 20px;">
        <BoardBreadcrumbs/>
        <div class="flex flex-wrap place-items-center">
          <p class="folder-page_title">{{folder?.name}}</p>
          <button v-if="!isGetFolderRequestInProgressRef && isGetFolderRequestSuccessRef && folder" @click="createBoard" class="folder-page_create-board-button" style="margin-left: 12px;">
            Create board
          </button>
        </div>
      </div>
      <div v-if="!isGetFolderRequestSuccessRef" class="folder-page_body__loading">
        <div v-if="!isGetFolderRequestInProgressRef && !isGetFolderRequestSuccessRef">
          <button class="folder-page_body__loading_re-try-button folder-page_body__loading_text" @click="loadFolder(workspaceIdRef)">Retry load folder</button>
        </div>
      </div>
      <div v-if="!isGetFolderRequestInProgressRef && isGetFolderRequestSuccessRef && folder" class="folder-page_body">
        <div v-if="folder.boards.length > 0" style="margin-top: 16px; margin-left: 20px; margin-right: 20px">
          <ul class="flex flex-wrap gap-2">
            <li v-for="(board, boardIndex) in folder?.boards">
              <WorkspaceElementComponent
                  :entity-index="boardIndex"
                  :entity="board"
                  @editEvent="openEditModal(board)"
                  @deleteEvent="openDeleteModal(board, boardIndex)"
                  @removeBoardFromFolder="remove"
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
.folder-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #FFF;
}

.folder-page_title {
  color: #000;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.folder-page_body__loading {
  height: 100%;
  width: 100%;
  place-items: center;

  display: flex;
  justify-content: center;
  align-items: center;
}

.folder-page_body__loading_text {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 114.286% */
}

.folder-page_body__loading_re-try-button {
  height: 28px;
  padding-left: 12px;
  padding-right: 12px;

  border-radius: 8px;
  border: 1px solid #E7E7E5;
  background: #FFF;
}
.folder-page_body__loading_re-try-button:hover {
  color: #FF7C5C;
}

.folder-page_body {
  margin-bottom: 20px;

  flex-grow: 1;
  display: flex;
}

.folder-page_create-board-button {
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
.folder-page_create-board-button:hover {
  color: #FF7C5C;
}
</style>