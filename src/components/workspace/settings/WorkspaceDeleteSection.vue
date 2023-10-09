<script setup lang="ts">
import WorkspaceDeleteModal from "@/components/workspace/settings/WorkspaceDeleteModal.vue";
import {ref} from "vue";
import {useRouter} from "vue-router"
import {useWorkspacesStore} from "@/WorkspacesStore";

const router = useRouter()
const workspacesStore = useWorkspacesStore();

const props = defineProps({
  workspaceId: {
    type: String,
    required: true
  },
  workspaceName: {
    type: String,
    required: true
  }
});

const workspaceDeleteModal = ref();
function showWorkspaceDeleteModal() {
  console.log("Delete workspace");
  workspaceDeleteModal.value.open(props.workspaceId, props.workspaceName)
}

function redirectToHome() {
  removeWorkspace();
  router.push({ name: 'home' })
}

function removeWorkspace() {
  let selfIndex = -1;
  workspacesStore.workspaces.forEach((element, index) => {
    if (element.id === props.workspaceId) {
      selfIndex = index;
    }
  });

  if (selfIndex !== -1) {
    workspacesStore.workspaces.splice(selfIndex, 1);
  }

  workspacesStore.selectWorkspace(workspacesStore.workspaces.at(0));
}
</script>

<template>
  <div class="workspace-delete-section">
    <p class="workspace-delete-section_name">Danger zone</p>
    <button class="workspace-delete-section_delete-button" @click="showWorkspaceDeleteModal">Delete workspace</button>
    <WorkspaceDeleteModal ref="workspaceDeleteModal" @deleteEvent="redirectToHome"/>
  </div>
</template>

<style scoped>
.workspace-delete-section {
  margin-top: 32px
}

.workspace-delete-section_name {
  margin-bottom: 12px;

  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.workspace-delete-section_delete-button {
  width: 145px;
  height: 28px;
  color: #FF4545;
  border: 1px #FF4545 solid;
  border-radius: 8px;

  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.workspace-delete-section_delete-button:hover {
  background-color: #FF4545;
  color: #FFFFFF;
}
</style>