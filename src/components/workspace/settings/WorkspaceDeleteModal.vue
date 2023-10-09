<script setup lang="ts">
import {ref} from "vue";
import { useAuth0 } from '@auth0/auth0-vue';
import {BordyApi} from "@/api/BordyApi";

const showModal     = ref<boolean>(false);
const workspaceId   = ref<string>();
const workspaceName = ref<string>();

function open(_workspaceId: string, _workspaceName: string) {
  workspaceId.value = _workspaceId;
  workspaceName.value = _workspaceName;
  showModal.value = true;
}

function close() {
  showModal.value = false;
}

defineExpose({
  open
})

const isRequestInProcessRef = ref<boolean>(false)
const isRequestFailedRef    = ref<boolean>(false)

const emit = defineEmits<{
  (e: 'deleteEvent'): void
}>()

const { getAccessTokenSilently } = useAuth0();
async function deleteWorkspace() {
  isRequestInProcessRef.value = true;
  const accessToken: string = await getAccessTokenSilently();
  const [httpStatus, errorMessage] = await BordyApi.Workspaces.deleteWorkspace(
      accessToken, workspaceId.value || ""
  );

  if (200 === httpStatus) {
    isRequestFailedRef.value = false;
    emit('deleteEvent');
  } else {
    isRequestFailedRef.value = true;
  }
  isRequestInProcessRef.value = false;
}

function closeModalOnClick(event: any) {
  if (event?.target?.className === "workspace-delete-modal_backdrop" && isRequestInProcessRef.value === false) {
    close();
  }
}
</script>

<template>
  <div v-show="showModal" class="workspace-delete-modal_backdrop" @click="closeModalOnClick">
    <div class="workspace-delete-modal">
      <div class="workspace-delete-modal_title">
        <p class="workspace-delete-modal_title_text">
          Delete <span class="workspace-delete-modal_title_text__bold">{{workspaceName}}</span>?
        </p>
      </div>
      <div v-if="!isRequestInProcessRef">
        <div style="margin-top: 24px;">
          <button class="workspace-delete-modal_delete-button" @click="deleteWorkspace">
            {{ isRequestFailedRef ? 'Try again' : 'Yes'}}, delete <span class="workspace-delete-modal_delete-button_text__bold">{{workspaceName}}</span>
          </button>
        </div>
        <div style="margin-top: 16px; display: flex; justify-content: center">
          <button class="workspace-delete-modal_close-button" @click="close">Close</button>
        </div>
      </div>
      <div v-if="isRequestInProcessRef" style="margin-top: 24px; display: flex; justify-content: center">
        <img style="width: 74px; height: 74px;" src="@/assets/loading.svg" alt="loading">
      </div>
    </div>
  </div>
</template>

<style scoped>
.workspace-delete-modal {

}

.workspace-delete-modal {
  min-width: 340px;
  min-height: 183px;

  background-color: #FFFFFF;
  border-radius: 8px;

  padding: 32px 32px 36px;
}

.workspace-delete-modal_backdrop {
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

.workspace-delete-modal_title {
  text-align: center
}
.workspace-delete-modal_title_text {
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  font-family: Manrope;
}
.workspace-delete-modal_title_text__bold {
  color: #000000;
  font-size: 16px;
  font-weight: 700;
  font-family: Manrope;
}

.workspace-delete-modal_delete-button {
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
  font-family: Manrope;
}
.workspace-delete-modal_delete-button:hover {
  color: #FF7C5C;
  border: 1px #FF7C5C solid;
}
.workspace-delete-modal_delete-button_text__bold {
  font-weight: 700;
  margin-left: 5px;
  font-family: Manrope;
}

.workspace-delete-modal_close-button {
  height: 28px;
  width: 276px;
  place-items: center;
  text-align: center;

  color: #000000;

  border: 1px #E7E7E5 solid;
  border-radius: 8px;

  font-size: 14px;
  font-weight: 400;
  font-family: Manrope;
}
.workspace-delete-modal_close-button:hover {
  color: #FF7C5C;
  border: 1px #FF7C5C solid;
}
</style>