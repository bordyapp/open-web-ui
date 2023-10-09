<script setup lang="ts">
import SidebarMenu from "@/components/SidebarMenu.vue";
import {Pages} from "@/components/SidebarMenu";
import {useWorkspacesStore} from "@/WorkspacesStore.ts";
import {useAuth0} from "@auth0/auth0-vue";
import {inject, onMounted, ref, watch} from "vue";
import type {Workspace} from "@/api/WorkspacesApi";
import type {ApiCallResult, File} from "@/api/DocsAndFilesApi";
import {BordyApi} from "@/api/BordyApi";
import ExternalFileModal from "@/components/docs&files/ExternalFileModal.vue";
import DeleteFileModal from "@/components/docs&files/DeleteFileModal.vue";
import FileComponent from "@/components/docs&files/FileComponent.vue";
import DocsAndFilesPageSkeleton from "@/pages/DocsAndFilesPageSkeleton.vue";

const workspacesStore = useWorkspacesStore();
const { user, getAccessTokenSilently } = useAuth0();

const mixpanel = inject('mixpanel');
onMounted(async () => {
  mixpanel.track('pages_visited', {
    "page_name": "Docs & files",
    "workspace_id": workspacesStore.selectedWorkspace?.id || null,
    "user_id": user.value?.sub || null
  });
  await loadFiles(workspacesStore.selectedWorkspace!.id);
})
watch(() => workspacesStore.selectedWorkspace, async (newWorkspace: Workspace, oldWorkspace: Workspace, onCleanup) => {
  if (newWorkspace?.id != oldWorkspace?.id) {
    await loadFiles(newWorkspace!.id);
  }
})

const workspaceIdRef                            = ref<string>("");
const isGetWorkspaceFilesRequestInProgressRef   = ref<boolean>(false);
const isGetWorkspaceFilesRequestSuccessRef      = ref<boolean>(false);
const isGetWorkspaceFilesRequestErrorMessageRef = ref<string>("");
const files                                     = ref<File[]>([]);
async function loadFiles(workspaceId: string) {
  workspaceIdRef.value = workspaceId;
  isGetWorkspaceFilesRequestInProgressRef.value = true;
  const accessToken: string = await getAccessTokenSilently();
  const apiCallResult: ApiCallResult<File[]> = await BordyApi.DocsAndFiles.getWorkspaceFiles(
      accessToken, workspaceId
  );

  isGetWorkspaceFilesRequestInProgressRef.value = false;

  if (apiCallResult.httpStatusCode !== 200) {
    if (apiCallResult.httpStatusCode === 403) {
      isGetWorkspaceFilesRequestErrorMessageRef.value = "You don't have access to this page";
    } else if (apiCallResult.httpStatusCode === 404) {
      isGetWorkspaceFilesRequestErrorMessageRef.value = "Files not found";
    } else {
      isGetWorkspaceFilesRequestErrorMessageRef.value = "Can't load files";
    }

    isGetWorkspaceFilesRequestSuccessRef.value = false;
  } else {
    files.value = apiCallResult.data || [];
    isGetWorkspaceFilesRequestSuccessRef.value = true;
  }
}

function renderFile(file: File | undefined, fileIndex: number | undefined) {
  if (file) {
    if (fileIndex !== undefined) {
      files.value[fileIndex] = file;
    } else {
      files.value.push(file);
    }
  }
}
function removeFile(fileIndex: number | undefined) {
  if (fileIndex !== undefined) {
    files.value.splice(fileIndex, 1);
  }
}

const externalFileModal = ref();
const deleteFileModal   = ref();
function showExternalFileModal(file: File | undefined = undefined, fileIndex: number | undefined = undefined) {
  externalFileModal.value.open(file, fileIndex);
}
function showDeleteFileModal(file: File | undefined = undefined, fileIndex: number | undefined = undefined) {
  deleteFileModal.value.open(file, fileIndex);
}
</script>

<template>
  <main class="docs-and-files-page">
    <SidebarMenu :selected-page="Pages.docs_and_files"/>
    <DocsAndFilesPageSkeleton v-if="isGetWorkspaceFilesRequestInProgressRef"/>
    <div v-if="!isGetWorkspaceFilesRequestInProgressRef" class="flex flex-col grow overflow-auto">
      <div class="flex place-items-center" style="margin-left: 20px; margin-right: 20px; margin-top: 20px;">
        <div class="docs-and-files-page_title">
          Docs & Files
        </div>
        <button v-if="files.length > 0" style="margin-left: 12px" class="docs-and-files-page_body_no-files_create-file-button" @click="showExternalFileModal()">New file</button>
      </div>
      <div v-if="isGetWorkspaceFilesRequestInProgressRef || !isGetWorkspaceFilesRequestSuccessRef" class="docs-and-files-page_body__loading">
        <div v-if="!isGetWorkspaceFilesRequestInProgressRef && !isGetWorkspaceFilesRequestSuccessRef">
          <button class="docs-and-files-page_body__loading_text" @click="loadFiles(workspaceIdRef)">Retry load documents and files</button>
        </div>
      </div>
      <div v-if="!isGetWorkspaceFilesRequestInProgressRef && isGetWorkspaceFilesRequestSuccessRef" class="docs-and-files-page_body">
        <div v-if="files.length === 0" class="docs-and-files-page_body_no-files">
          <img src="@/assets/docs-and-files-empty-state.png" alt="empty-state">
          <div style="margin-left: 21px">
            <div>
              <p class="docs-and-files-page_body_no-files_title">Let's organize knowledge</p>
              <p class="docs-and-files-page_body_no-files_description">Links, files, and documents can be kept here and organized.</p>
            </div>
            <div style="margin-top: 17px">
              <button class="docs-and-files-page_body_no-files_create-file-button" @click="showExternalFileModal()">New file</button>
            </div>
          </div>
        </div>
        <div v-if="files.length > 0" style="margin-top: 16px; margin-left: 20px; margin-right: 20px">
          <ul class="flex flex-wrap gap-2">
            <li v-for="(file, fileIndex) in files" class="flex">
              <FileComponent :file="file" :fileIndex="fileIndex" @editEvent="showExternalFileModal(file, fileIndex)" @deleteEvent="showDeleteFileModal(file, fileIndex)"/>
            </li>
          </ul>
        </div>
      </div>
      <ExternalFileModal ref="externalFileModal" @saveEvent="renderFile"/>
      <DeleteFileModal ref="deleteFileModal" @deleteEvent="removeFile"/>
    </div>
  </main>
</template>

<style scoped>
.docs-and-files-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #FFF;
}

.docs-and-files-page_title {
  color: #000;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.docs-and-files-page_body__loading {
  height: 100%;
  width: 100%;
  place-items: center;

  display: flex;
  justify-content: center;
  align-items: center;
}

.docs-and-files-page_body__loading_text {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 114.286% */
}

.docs-and-files-page_body {
  margin-bottom: 20px;

  flex-grow: 1;
  display: flex;
}

.docs-and-files-page_body_no-files {
  display: flex;
  width: 100%;
  height: 100%;

  place-items: center;
  justify-content: center;
  align-items: center;
}

.docs-and-files-page_body_no-files_title {
  color: #000;
  font-family: Manrope;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.docs-and-files-page_body_no-files_description {
  color: #000;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  opacity: 0.5;
}

.docs-and-files-page_body_no-files_create-file-button {
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
.docs-and-files-page_body_no-files_create-file-button:hover {
  color: #FF7C5C;
}
</style>