<script setup lang="ts">
import {ref} from "vue";
import {BordyApi} from "@/api/BordyApi";
import type {ApiCallResult, File} from "@/api/DocsAndFilesApi";
import {FileType} from "@/api/DocsAndFilesApi";
import { useAuth0 } from '@auth0/auth0-vue';
const { getAccessTokenSilently } = useAuth0();
import { useWorkspacesStore } from "@/WorkspacesStore";

const showModal = ref<boolean>(false);

const id    = ref<string | undefined>(undefined);
const index = ref<number | undefined>(undefined);
const name  = ref<string>("");
const url   = ref<string>("");

function open(file: File | undefined = undefined, fileIndex: number | undefined) {
  index.value = fileIndex;
  id.value    = file?.id  || undefined;
  name.value  = file?.name || "";
  url.value   = file?.url || "";

  showModal.value = true;
}

function close() {
  showModal.value = false;
}

function closeModalOnClick(event: any) {
  if (event?.target?.className === "external-file-modal_backdrop" && isRequestInProcess.value === false) {
    close();
  }
}

defineExpose({
  open
})

const emit = defineEmits<{
  (e: 'saveEvent', file: File, fileIndex: number | undefined): void
}>()

const workspacesStore    = useWorkspacesStore();
const isRequestInProcess = ref<boolean>(false);
const isRequestFailed    = ref<boolean>(false);
async function update() {
  isRequestInProcess.value = true;
  isRequestFailed.value    = false;

  let apiCallResult: ApiCallResult;
  const accessToken: string = await getAccessTokenSilently();
  if (id.value === undefined) {
    apiCallResult = await BordyApi.DocsAndFiles.createWorkspaceFile(
        accessToken, workspacesStore.selectedWorkspace?.id || "",
        {
          name: name.value,
          type: FileType.EXTERNAL_FILE,
          url: url.value,
        }
    );
  } else {
    apiCallResult = await BordyApi.DocsAndFiles.updateWorkspaceFile(
        accessToken, workspacesStore.selectedWorkspace?.id || "", id.value,
        {
          name: name.value,
          url: url.value,
        }
    );
  }

  if (apiCallResult.httpStatusCode !== 200) {
    isRequestFailed.value = true;
  } else {
    emit('saveEvent', apiCallResult.data, index.value)
    isRequestFailed.value = false;
    showModal.value = false;
  }
  isRequestInProcess.value = false;
}
</script>

<template>
  <div v-if="showModal" class="external-file-modal_backdrop" @click="closeModalOnClick">
    <div class="external-file-modal">
      <div class="external-file-modal_title">
        <p class="external-file-modal_title_text">{{ id ? 'Update file' : 'New file'}}</p>
      </div>
      <hr>
      <form class="external-file-modal_form" @submit.prevent="update">
        <div class="external-file-modal_form_input-blocks">
          <div class="external-file-modal_form_input-block">
            <label class="external-file-modal_form_input-block_label">Name</label>
            <input v-model="name" required class="external-file-modal_form_input-block_text-input" type="text" placeholder="UI kit"/>
          </div>
          <div class="external-file-modal_form_input-block">
            <label class="external-file-modal_form_input-block_label">External url</label>
            <input v-model="url" required class="external-file-modal_form_input-block_text-input" type="url" placeholder="Figma, Notion..."/>
          </div>
        </div>
        <div  v-if="!isRequestInProcess" class="external-file-modal_form_buttons" style="margin-top: 32px;">
          <button class="external-file-modal_form_button">
            {{ isRequestFailed ? 'Try again' : 'Save' }}
          </button>
        </div>
        <div v-if="isRequestInProcess" style="margin-top: 32px; display: flex; justify-content: center">
          <img style="width: 28px; height: 28px;" src="../../assets/loading.svg" alt="loading">
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.external-file-modal {
  width: 400px;
  border-radius: 8px;
  background-color: #FFFFFF;
}

.external-file-modal_backdrop {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background-color: rgba(0, 0, 0, 0.5);

  position: fixed;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 50;
}

.external-file-modal_title {
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.external-file-modal_title_text {
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
}

.external-file-modal_form {
  padding: 16px 24px 42px;
}

.external-file-modal_form_input-blocks {
  display: flex;
  flex-direction: column;

  gap: 1.5rem;
}

.external-file-modal_form_input-block {
  display: flex;
  flex-direction: column;

  gap: 0.625rem;
}
.external-file-modal_form_input-block_label {
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
}
.external-file-modal_form_input-block_text-input {
  height: 36px;

  padding-left: 16px;
  padding-right: 16px;

  border: 1px #E7E7E5 solid;
  border-radius: 8px;

  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
}

.external-file-modal_form_buttons {
  display: flex;
  flex-direction: column;

  gap: 0.5rem;
}

.external-file-modal_form_button {
  height: 28px;
  width: 352px;

  border: 1px #E7E7E5 solid;
  border-radius: 8px;

  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
}
.external-file-modal_form_button:hover {
  color: #FF7C5C;
}
</style>