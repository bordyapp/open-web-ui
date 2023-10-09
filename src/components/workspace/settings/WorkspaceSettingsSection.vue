<script setup lang="ts">
import {Workspace} from "@/BordieApi";
import WorkspaceLogoSection from "@/components/workspace/settings/WorkspaceLogoSection.vue";
import WorkspaceNameSection from "@/components/workspace/settings/WorkspaceNameSection.vue";
import WorkspaceDeleteSection from "@/components/workspace/settings/WorkspaceDeleteSection.vue";

const props = defineProps({
  workspace: {
    type: Workspace,
    required: true
  }
});

function updateWorkspaceLogo(logoUrl: string) {
  props.workspace!.photo = logoUrl;
}
function updateWorkspaceName(name: string) {
  props.workspace!.name = name;
}
</script>

<template>
  <div class="workspace-settings-section">
    <WorkspaceLogoSection :workspace="workspace" @saveEvent="updateWorkspaceLogo"/>
    <WorkspaceNameSection :workspaceName="workspace.name" :workspaceId="workspace.id" @saveEvent="updateWorkspaceName"/>
    <WorkspaceDeleteSection :workspaceId="workspace.id" :workspaceName="workspace.name"/>
  </div>
</template>

<style scoped>
.workspace-settings-section {
  margin: 20px
}
</style>