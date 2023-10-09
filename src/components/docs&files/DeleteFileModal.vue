<script setup lang="ts">
import {ref} from "vue";
import { useAuth0 } from '@auth0/auth0-vue';
import {BordyApi} from "@/api/BordyApi";
import type {File, ApiCallResult} from "@/api/DocsAndFilesApi";

const showModal    = ref<boolean>(false);
const fileRef      = ref<File>();
const fileIndexRef = ref<number>();

function open(file: File, fileIndex: number) {
  fileRef.value = file;
  fileIndexRef.value = fileIndex;

  showModal.value = true;
}

function close() {
  showModal.value = false;
}

defineExpose({
  open
})

const isRequestInProcess = ref<boolean>(false)
const isRequestFailed    = ref<boolean>(false)

const emit = defineEmits<{
  (e: 'deleteEvent', inviteIndex: number | undefined): void
}>()

const { getAccessTokenSilently } = useAuth0();
async function deleteFile() {
  isRequestInProcess.value = true;
  isRequestFailed.value    = false;

  const accessToken: string = await getAccessTokenSilently();
  const apiCallResult: ApiCallResult<void> = await BordyApi.DocsAndFiles.deleteWorkspaceFile(
      accessToken, fileRef.value?.workspaceId || "", fileRef.value?.id || ""
  );

  if (apiCallResult.httpStatusCode === 200) {
    emit('deleteEvent', fileIndexRef.value)
    showModal.value = false;
  } else {
    isRequestFailed.value = true;
  }

  isRequestInProcess.value = false;
}

function closeModalOnClick(event: any) {
  if (event?.target?.className === "delete-file-modal_backdrop" && isRequestInProcess.value === false) {
    close();
  }
}
</script>

<template>
  <div v-show="showModal" class="delete-file-modal_backdrop" @click="closeModalOnClick">
    <div class="delete-file-modal">
      <div class="delete-file-modal_title">
        <p class="delete-file-modal_title_text">
          Delete <span class="delete-file-modal_title_text__bold">{{fileRef?.name}}</span>?
        </p>
      </div>
      <div v-if="!isRequestInProcess">
        <div style="margin-top: 24px;">
          <button class="delete-file-modal_delete-button" @click="deleteFile">
            {{ isRequestFailed ? 'Try again' : 'Yes'}}, delete <span class="delete-file-modal_delete-button_text__bold">{{fileRef?.name}}</span>
          </button>
        </div>
        <div style="margin-top: 16px; display: flex; justify-content: center">
          <button class="delete-file-modal_close-button" @click="close">Close</button>
        </div>
      </div>
      <div v-if="isRequestInProcess" style="margin-top: 24px; display: flex; justify-content: center">
        <img style="width: 74px; height: 74px;" src="../../assets/loading.svg" alt="loading">
      </div>
    </div>
  </div>
</template>

<style scoped>
.delete-file-modal {
  min-width: 340px;
  min-height: 183px;

  background-color: #FFFFFF;
  border-radius: 8px;

  padding: 32px 32px 36px;
}

.delete-file-modal_backdrop {
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

.delete-file-modal_title {
  text-align: center
}
.delete-file-modal_title_text {
  color: #000000;
  font-size: 16px;
  font-weight: 400;
}
.delete-file-modal_title_text__bold {
  color: #000000;
  font-size: 16px;
  font-weight: 700;
}

.delete-file-modal_delete-button {
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
.delete-file-modal_delete-button:hover {
  color: #FF7C5C;
  border: 1px #FF7C5C solid;
}
.delete-file-modal_delete-button_text__bold {
  font-weight: 700;
  margin-left: 5px;
}

.delete-file-modal_close-button {
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
.delete-file-modal_close-button:hover {
  color: #FF7C5C;
  border: 1px #FF7C5C solid;
}
</style>