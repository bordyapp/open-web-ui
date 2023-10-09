<script setup lang="ts">
import {Pages} from "@/components/SidebarMenu";
import SidebarMenu from "@/components/SidebarMenu.vue";
import {useWorkspacesStore} from "@/WorkspacesStore";
import {useAuth0} from "@auth0/auth0-vue";
import {inject, onMounted, ref, watch} from "vue";
import type {Workspace} from "@/api/WorkspacesApi";
import {BordyApi} from "@/api/BordyApi";
import type {WorkspaceElement, ApiCallResult} from "@/api/BoardsAndFoldersApi";
import BoardPage from "@/BoardPage.vue";
import BoardBreadcrumbs from "@/components/boards/BoardBreadcrumbs.vue";
import {useBoardBreadcrumbsStore} from "@/components/boards/BoardBreadcrumbsStore"
import BoardPageSkeleton from "@/pages/boards/BoardPageSkeleton.vue";

const workspacesStore = useWorkspacesStore();
const { user, getAccessTokenSilently } = useAuth0();

const props = defineProps({
  boardId: {
    type: String,
    required: true
  }
});

const boardBreadcrumbsStore = useBoardBreadcrumbsStore();
const mixpanel = inject('mixpanel');
onMounted(async () => {
  await loadBoard(workspacesStore.selectedWorkspace!.id);
})
watch(() => workspacesStore.selectedWorkspace, async (newWorkspace: Workspace, oldWorkspace: Workspace, onCleanup) => {
  if (newWorkspace?.id != oldWorkspace?.id) {
    await loadBoard(newWorkspace!.id);
  }
})
watch(() => props.boardId, async (newBoardId: string, oldBoardId: string, onCleanup) => {
  if (newBoardId !== oldBoardId) {
    await loadBoard(workspacesStore.selectedWorkspace!.id);
  }
})

const workspaceIdRef                   = ref<string>("");
const isGetBoardRequestInProgressRef   = ref<boolean>(false);
const isGetBoardRequestSuccessRef      = ref<boolean>(false);
const isGetBoardRequestErrorMessageRef = ref<string>("");
const board                            = ref<WorkspaceElement>();
async function loadBoard(workspaceId: string) {
  workspaceIdRef.value = workspaceId;
  isGetBoardRequestInProgressRef.value = true;
  const accessToken: string = await getAccessTokenSilently();
  const apiCallResult: ApiCallResult<WorkspaceElement> = await BordyApi.BoardsAndFolders.getBoardOrFolder(
      accessToken, workspaceId, props.boardId
  );

  isGetBoardRequestInProgressRef.value = false;

  if (apiCallResult.httpStatusCode !== 200) {
    if (apiCallResult.httpStatusCode === 403) {
      isGetBoardRequestErrorMessageRef.value = "You don't have access to this board";
    } else if (apiCallResult.httpStatusCode === 404) {
      isGetBoardRequestErrorMessageRef.value = "Board not found";
    } else {
      isGetBoardRequestErrorMessageRef.value = "Can't load board";
    }

    isGetBoardRequestSuccessRef.value = false;
  } else {
    board.value = apiCallResult.data;
    isGetBoardRequestSuccessRef.value = true;
    boardBreadcrumbsStore.sync(board.value!);

    mixpanel.track('open_board', {
      "board_id": board.value?.id || null,
      "folder_id": board.value?.folderId || null,
      "workspace_id": workspacesStore.selectedWorkspace?.id || null,
      "user_id": user.value?.sub || null
    });
  }
}
</script>

<template>
  <main class="board-page">
    <SidebarMenu :selected-page="Pages.boards"/>
    <BoardPageSkeleton v-if="isGetBoardRequestInProgressRef"/>
    <div v-if="!isGetBoardRequestInProgressRef" class="flex flex-col grow overflow-auto">
      <div v-if="!isGetBoardRequestInProgressRef && isGetBoardRequestSuccessRef" style="margin-left: 20px; margin-right: 20px; margin-top: 20px;">
        <BoardBreadcrumbs/>
        <div class="board-page_title">
          {{board?.name}}
        </div>
      </div>
      <div v-if="!isGetBoardRequestSuccessRef" class="board-page_body__loading">
        <div v-if="!isGetBoardRequestInProgressRef && !isGetBoardRequestSuccessRef">
          <button class="board-page_body__loading_re-try-button board-page_body__loading_text" @click="loadBoard(workspaceIdRef)">Retry load tasks</button>
        </div>
      </div>
      <BoardPage v-if="board && !isGetBoardRequestInProgressRef && isGetBoardRequestSuccessRef" :board="board"/>
    </div>
  </main>
</template>

<style scoped>
.board-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #FFF;
}

.board-page_title {
  color: #000;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.board-page_body__loading {
  height: 100%;
  width: 100%;
  place-items: center;

  display: flex;
  justify-content: center;
  align-items: center;
}

.board-page_body__loading_text {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 114.286% */
}

.board-page_body__loading_re-try-button {
  height: 28px;
  padding-left: 12px;
  padding-right: 12px;

  border-radius: 8px;
  border: 1px solid #E7E7E5;
  background: #FFF;
}
.board-page_body__loading_re-try-button:hover {
  color: #FF7C5C;
}
</style>