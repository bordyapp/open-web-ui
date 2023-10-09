<template>
  <main v-if="folder" style="margin-left: 12px; margin-top: 12px; margin-right: 12px;">
    <div class="flex" style="text-align: center; justify-content: left; align-items: center;">
      <button @click="createBoard" class="create-board-button">
        Create board
      </button>
      <YaffiEntityModal ref="yaffiEntityModal"/>
      <YaffiEntityDeleteModal ref="yaffiEntityDeleteModal"/>
    </div>
      <ul v-if="folder?.boards?.length > 0" class="flex flex-wrap gap-2" style="margin-top: 16px">
          <li v-for="(board, boardIndex) in folder?.boards" class="flex">
              <WorkspaceElementComponent
                  :entity-index="boardIndex"
                  :entity="board"
                  @editEvent="openEditModal(board)"
                  @deleteEvent="openDeleteModal(board, boardIndex)"
              />
          </li>
      </ul>
  </main>
  <main v-if="isLoading">
      <p>Loading board...</p>
  </main>
  <main v-if="!folder && !isLoading" style="margin-left: 12px; margin-top: 12px; margin-right: 12px;">
      <p>Board with given id not found</p>
  </main>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue"
import {BordieApi} from "./BordieApi";
import {WorkspaceElement, WorkspaceElementType} from "@/api/BoardsAndFoldersApi"
import type {ApiCallResult} from "@/api/BoardsAndFoldersApi"
import YaffiEntityModal from "@/components/dashboard/YaffiEntityModal.vue";
import YaffiEntityDeleteModal from "@/components/dashboard/YaffiEntityDeleteModal.vue";
import WorkspaceElementComponent from "@/components/dashboard/WorkspaceElementComponent.vue";

import { useAuth0 } from '@auth0/auth0-vue';
const { getAccessTokenSilently } = useAuth0();
import { useWorkspacesStore } from "./WorkspacesStore.ts";
import { useWorkspaceElementsStore } from "./WorkspaceElementsStore";
import {BordyApi} from "@/api/BordyApi";

const workspacesStore = useWorkspacesStore();
const workspaceElementsStore = useWorkspaceElementsStore();

const props = defineProps({
    folderId: {
        type: String,
        required: true
    }
})

const yaffiEntityModal = ref()
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

const isLoading = ref<boolean>(true)
const folder = ref<WorkspaceElement | undefined>(undefined)

onMounted(async () => {
  const accessToken: string = await getAccessTokenSilently();
  const apiCallResult: ApiCallResult<WorkspaceElement> = await BordyApi.BoardsAndFolders.getBoardOrFolder(
      accessToken, workspacesStore.selectedWorkspace?.id || "", props.folderId || ""
  );
  isLoading.value = false;

  if (apiCallResult.httpStatusCode !== 200) {
    // do nothing.
  } else {
    folder.value = apiCallResult.data;
    workspaceElementsStore.replaceSelf(folder.value as WorkspaceElement);
  }
})
</script>

<style scoped>
.create-board-button {
    width: 119px;
    height: 28px;
    color: #000000;
    font-size: 14px;
    border: #E7E7E5 solid 1px;
    border-radius: 8px
}
.create-board-button:hover {
    color: #FF7C5C;
}
</style>