<template>
  <div>
      <button class="new-workspace-element_button" @click="openWorkspaceElementModal()">{{actionName}}</button>
      <YaffiEntityModal ref="workspaceElementModal" @created="emitCreatedEvent"/>
  </div>
</template>

<script lang="ts" setup>
import YaffiEntityModal from "@/components/dashboard/YaffiEntityModal.vue";
import {ref} from "vue";
import type {WorkspaceElement} from "@/api/BoardsAndFoldersApi";

const workspaceElementModal = ref();
const props = defineProps({
    actionName: {
        type: String,
        required: true
    },
    workspaceElementType: {
        type: String,
        required: true
    }
})

function openWorkspaceElementModal() {
    workspaceElementModal.value.open(undefined, undefined, props.workspaceElementType, false);
}

const emit = defineEmits<{
  (e: 'created', workspaceElement: WorkspaceElement | undefined): void
}>()
function emitCreatedEvent(workspaceElement: WorkspaceElement | undefined) {
  emit('created', workspaceElement)
}
</script>

<style scoped>
.new-workspace-element_button {
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
.new-workspace-element_button:hover {
  color: #FF7C5C;
}
</style>