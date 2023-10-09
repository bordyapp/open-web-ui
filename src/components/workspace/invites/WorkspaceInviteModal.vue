<script setup lang="ts">
import {ref} from "vue";
import { useAuth0 } from '@auth0/auth0-vue';
import {BordyApi} from "@/api/BordyApi";
import type {ApiCallResult, WorkspaceInvite} from "@/api/WorkspacesApi";

const showModal           = ref<boolean>(false);
const workspaceIdRef      = ref<string>("");
const emailRef            = ref<string>("");
const nameRef             = ref<string>("");
const roleRef             = ref<string>("");
const responsibilitiesRef = ref<string>("");

function open(workspaceId: string) {
  workspaceIdRef.value = workspaceId;
  emailRef.value = "";
  nameRef.value = "";
  roleRef.value = "";
  responsibilitiesRef.value = "";

  isRequestInProcess.value = false;
  isRequestFailed.value    = false;

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
  (e: 'saveEvent', invite: WorkspaceInvite): void
}>()

const { getAccessTokenSilently } = useAuth0();
async function invite() {
  isRequestInProcess.value = true;
  isRequestFailed.value    = false;

  const accessToken: string = await getAccessTokenSilently();
  const apiCallResult: ApiCallResult<WorkspaceInvite> = await BordyApi.Workspaces.createInvite(
      accessToken, workspaceIdRef.value, {
        email: emailRef.value,
        name: nameRef.value,
        role: roleRef.value,
        responsibilities: responsibilitiesRef.value,
      }
  )

  if (apiCallResult.httpStatusCode === 200) {
    emit('saveEvent', apiCallResult.data);
    showModal.value = false;
  } else {
    isRequestFailed.value = true;
  }
  isRequestInProcess.value = false;
}

function closeModalOnClick(event: any) {
  if (event?.target?.className === "workspace-invite-modal_backdrop" && isRequestInProcess.value === false) {
    close();
  }
}
</script>

<template>
  <div v-show="showModal" class="workspace-invite-modal_backdrop" @click="closeModalOnClick">
    <div class="workspace-invite-modal">
      <div class="workspace-invite-modal_title">
        <p class="workspace-invite-modal_title_text">Invite member</p>
      </div>
      <hr>
      <form class="workspace-invite-modal_form" @submit.prevent="invite">
        <div class="workspace-invite-modal_form_input-blocks">
          <div class="workspace-invite-modal_form_input-block">
            <label class="workspace-invite-modal_form_input-block_label">Email</label>
            <input v-model="emailRef" required class="workspace-invite-modal_form_input-block_text-input" type="email" placeholder="Example@email.com"/>
          </div>
          <div class="workspace-invite-modal_form_input-block">
            <label class="workspace-invite-modal_form_input-block_label">Name</label>
            <input v-model="nameRef" required class="workspace-invite-modal_form_input-block_text-input" type="text" placeholder="John"/>
          </div>
          <div class="workspace-invite-modal_form_input-block">
            <label class="workspace-invite-modal_form_input-block_label">Role</label>
            <input v-model="roleRef" class="workspace-invite-modal_form_input-block_text-input" type="text" placeholder="Graphic designer"/>
          </div>
          <div class="workspace-invite-modal_form_input-block">
            <label class="workspace-invite-modal_form_input-block_label">Responsibilities</label>
            <textarea v-model="responsibilitiesRef" class="workspace-invite-modal_form_input-block_textarea" placeholder="Design briefs and determine requirements"/>
          </div>
        </div>
        <div v-if="!isRequestInProcess" class="workspace-invite-modal_form_buttons" style="margin-top: 32px;">
          <button class="workspace-invite-modal_form_button">
            {{ isRequestFailed ? 'Try again' : 'Invite' }}
          </button>
          <button @click="close" type="button" class="workspace-invite-modal_form_button">
            Close
          </button>
        </div>
        <div v-if="isRequestInProcess" style="margin-top: 32px; display: flex; justify-content: center">
          <img style="width: 74px; height: 74px;" src="@/assets/loading.svg" alt="loading">
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.workspace-invite-modal {
  width: 400px;

  border-radius: 8px;

  background-color: #FFFFFF;
}

.workspace-invite-modal_title {
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.workspace-invite-modal_title_text {
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
}

.workspace-invite-modal_backdrop {
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

.workspace-invite-modal_form {
  padding: 16px 24px 42px;
}

.workspace-invite-modal_form_input-blocks {
  display: flex;
  flex-direction: column;

  gap: 1.5rem;
}

.workspace-invite-modal_form_input-block {
  display: flex;
  flex-direction: column;

  gap: 0.625rem;
}
.workspace-invite-modal_form_input-block_label {
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
}
.workspace-invite-modal_form_input-block_text-input {
  height: 36px;

  padding-left: 16px;
  padding-right: 16px;

  border: 1px #E7E7E5 solid;
  border-radius: 8px;

  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
}

.workspace-invite-modal_form_input-block_textarea {
  min-height: 52px;

  padding-left: 16px;
  padding-right: 16px;
  padding-top: 10px;

  border: 1px #E7E7E5 solid;
  border-radius: 8px;

  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
}

.workspace-invite-modal_form_buttons {
  display: flex;
  flex-direction: column;

  gap: 0.5rem;
}

.workspace-invite-modal_form_button {
  height: 28px;
  width: 352px;

  border: 1px #E7E7E5 solid;
  border-radius: 8px;

  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
}
.workspace-invite-modal_form_button:hover {
  color: #FF7C5C;
}
</style>