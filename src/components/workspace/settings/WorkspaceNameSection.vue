<script setup lang="ts">
import {BordyApi} from "@/api/BordyApi";
import {useAuth0} from "@auth0/auth0-vue";
import {ref} from "vue";

const props = defineProps({
  workspaceName: {
    type: String,
    required: true
  },
  workspaceId: {
    type: String,
    required: true
  }
});

const emit = defineEmits<{
  (e: 'saveEvent', workspaceName: string): void
}>()

const workspaceNameInput = ref<string>(props.workspaceName!);

const isRequestInProcessRef = ref<boolean>(false)
const isRequestFailedRef    = ref<boolean>(false)

const { getAccessTokenSilently } = useAuth0();

async function updateWorkspaceName() {
  isRequestInProcessRef.value = true;
  const accessToken: string = await getAccessTokenSilently();
  const [httpStatus, errorMessage] = await BordyApi.Workspaces.renameWorkspace(
      accessToken, props.workspaceId!, workspaceNameInput.value
  );

  if (200 === httpStatus) {
    isRequestFailedRef.value = false;
    emit('saveEvent', workspaceNameInput.value);
  } else {
    isRequestFailedRef.value = true;
  }
  isRequestInProcessRef.value = false;
}
</script>

<template>
  <form @submit.prevent="updateWorkspaceName">
    <div class="workspace-name-section">
      <p class="workspace-name-section_name">Workspace name</p>
      <input required class="workspace-name-section_text-input" v-model="workspaceNameInput" type="text" placeholder="Workspace name">
      <div class="workspace-name-section_buttons">
        <button :disabled="isRequestInProcessRef" class="workspace-name-section_button" v-if="!isRequestFailedRef">
          {{ isRequestInProcessRef ? 'Updating' : 'Update'}}
        </button>
        <button class="workspace-name-section_button" v-if="isRequestFailedRef">
          Try again
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.workspace-name-section {
  padding-top: 32px
}

.workspace-name-section_name {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.workspace-name-section_text-input {
  margin-top: 9px;

  width: 264px;
  height: 36px;
  border: 1px #E7E7E5 solid;
  border-radius: 8px;
  padding-left: 10px;
  padding-right: 10px;

  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.workspace-name-section_buttons {
  margin-top: 20px;
}

.workspace-name-section_button {
  height: 28px;
  padding-left: 16px;
  padding-right: 16px;

  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  border: 1px #E7E7E5 solid;
  border-radius: 8px;

  text-align: center;
}

.workspace-name-section_button:hover {
  color: #FF7C5C;
}
</style>