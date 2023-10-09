<script setup lang="ts">
import {Workspace} from "@/BordieApi";
import {BordyApi} from "@/api/BordyApi";
import {useAuth0} from "@auth0/auth0-vue";
import {ref} from "vue";

const props = defineProps({
  workspace: {
    type: Workspace,
    required: true
  }
});

const emit = defineEmits<{
  (e: 'saveEvent', logoUrl: string): void
}>()

const isRequestInProcessRef = ref<boolean>(false)
const isRequestFailedRef    = ref<boolean>(false)

const { getAccessTokenSilently, user } = useAuth0();
async function uploadWorkspaceLogo(event) {
  isRequestInProcessRef.value = true;
  const accessToken: string = await getAccessTokenSilently();
  const [httpStatus, errorMessage] = await BordyApi.Workspaces.uploadWorkspacePhoto(
      accessToken, props.workspace?.id, event.target.files[0]
  );

  if (200 === httpStatus) {
    isRequestFailedRef.value = false;
    emit('saveEvent', URL.createObjectURL(event.target.files[0]));
  } else {
    isRequestFailedRef.value = true;
  }
  isRequestInProcessRef.value = false;
}
</script>

<template>
  <div class="workspace-logo-section">
    <p class="workspace-logo-section_name">Logo</p>
    <div v-if="workspace?.photo === undefined || workspace?.photo === null || workspace?.photo === ''" class="workspace-logo-section_photo-placeholder">
      {{workspace.name.substring(0, 2).toUpperCase()}}
    </div>
    <img v-else class="workspace-logo-section_photo" :src="workspace.photo" alt="workspace photo">
    <div>
      <span class="workspace-logo-section_logo_cache-hint">Because of cache, photo will be updated in 5 minutes</span>
      <br>
      <input :disabled="isRequestInProcessRef" name="workspacePhoto" class="workspace-logo-section_file-input" type="file" id="workspacePhotoToUpload" @change="uploadWorkspaceLogo" accept="image/*">
      <label v-if="!isRequestFailedRef" class="workspace-logo-section_file-input_label" for="workspacePhotoToUpload">
        {{ isRequestInProcessRef ? 'Uploading photo' : 'Upload photo'}}
      </label>
      <label v-if="isRequestFailedRef" class="workspace-logo-section_file-input_label" for="workspacePhotoToUpload">
        Re-upload photo
      </label>
    </div>
  </div>
</template>

<style scoped>
.workspace-logo-section {
}

.workspace-logo-section_name {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.workspace-logo-section_photo-placeholder {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 2px;
  background: #42526E;

  margin-top: 9px;
  margin-bottom: 9px;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #FFF;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
}

.workspace-logo-section_photo {
  border-radius: 8px;
  width: 52px;
  height: 52px;

  margin-top: 9px;
  margin-bottom: 9px;
}

.workspace-logo-section_logo_cache-hint {
  color: rgba(0, 0, 0, 0.5);
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.workspace-logo-section_file-input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.workspace-logo-section_file-input_label {
  height: 28px;
  padding-left: 16px;
  padding-right: 16px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  border: 1px #E7E7E5 solid;
  border-radius: 8px;

  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.workspace-logo-section_file-input_label:hover {
  color: #FF7C5C;
}
</style>