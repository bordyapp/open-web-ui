<script setup lang="ts">
import {WorkspaceInvite} from "@/api/WorkspacesApi";

const props = defineProps({
  invite: {
    type: WorkspaceInvite,
    required: true
  }
});

const emit = defineEmits<{
  (e: 'deleteEvent'): void
}>()

function emitDeleteEvent() {
  emit('deleteEvent')
}

function copyInvitation(invitation: string) {
  navigator.clipboard.writeText(`https://app.bordy.io/#/invite${invitation}`);
}
</script>

<template>
  <div class="workspace-invite">
    <img class="workspace-invite_photo" src="@/assets/invited-user-photo.png" alt="invited-user-photo">
    <div class="workspace-invite_info">
      <p class="workspace-invite_info_email">{{invite.email}} <span v-if="invite.role" class="workspace-invite_info_role">({{invite.role}})</span></p>
      <span class="workspace-invite_badge">Invited</span>
    </div>
    <div class="flex gap-4">
      <button @click="copyInvitation(invite.id)" type="button" class="workspace-invite_button">Copy invite link</button>
      <button @click="emitDeleteEvent" type="button" class="workspace-invite_delete-button">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.workspace-invite {
  height: 60px;

  display: flex;
  place-items: center;
}

.workspace-invite_photo {
  width: 36px;
  height: 36px;
  flex: none;
}

.workspace-invite_info {
  display: flex;
  place-items: center;
  flex-grow: 1;
  margin-left: 12px;
}

.workspace-invite_info_email {
  color: #000;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px; /* 100% */
}

.workspace-invite_info_role {
  color: #808080;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
}

.workspace-invite_badge {
  height: 20px;
  padding-left: 8px;
  padding-right: 8px;

  color: #595958;
  font-size: 10px;
  font-weight: 400;

  background-color: #EAEDEE;
  border-radius: 4px;

  margin-left: 4px;

  display: flex;
  place-items: center;
}

.workspace-invite:hover .workspace-invite_button {
  visibility: visible;
}
.workspace-invite:hover .workspace-invite_delete-button {
  visibility: visible;
}
.workspace-invite_button {
  flex: none;

  height: 36px;
  padding-left: 16px;
  padding-right: 16px;

  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  border-radius: 4px;
  border: 1px solid #E9E9EE;
  background: #FFF;

  visibility: hidden;
}
.workspace-invite_button:hover {
  color: #FF7C5C;
}

.workspace-invite_delete-button {
  flex: none;

  height: 36px;
  padding-left: 16px;
  padding-right: 16px;

  color: #CE0000;
  text-align: center;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  border-radius: 4px;
  border: 1px solid #E9E9EE;
  background: #FFF;

  visibility: hidden;
}
.workspace-invite_delete-button:hover {
  background-color: #FF4545;
  color: #FFFFFF;
}
</style>