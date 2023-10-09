<script setup lang="ts">
import {WorkspaceMember} from "@/api/WorkspacesApi";

const props = defineProps({
  member: {
    type: WorkspaceMember,
    required: true
  },
  isOwner: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (e: 'editEvent'): void
  (e: 'deleteEvent'): void
}>()
function emitEditEvent() {
  emit('editEvent')
}

function emitDeleteEvent() {
  emit('deleteEvent')
}
</script>

<template>
  <div class="workspace-member">
    <img class="workspace-member_photo rounded-full" :src="member.picture" alt="member-photo">
    <div class="workspace-member_info">
      <p class="workspace-member_info_nickname">{{member.nickname}} <span v-if="member.role" class="workspace-member_info_role">({{member.role}})</span></p>
      <p class="workspace-member_info_email">{{member.email}}</p>
    </div>
    <div class="workspace-member_buttons">
      <button v-if="isOwner" @click="emitEditEvent" type="button" class="workspace-member_button">Edit</button>
      <button v-if="isOwner" @click="emitDeleteEvent" type="button" class="workspace-member_button">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.workspace-member {
  height: 60px;

  display: flex;
  place-items: center;
}

.workspace-member_photo {
  width: 36px;
  height: 36px;
  flex: none;
}

.workspace-member_info {
  flex-grow: 1;
  margin-left: 12px;
}

.workspace-member_info_nickname {
  color: #000;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px; /* 100% */
}

.workspace-member_info_role {
  color: #808080;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
}

.workspace-member_info_email {
  color: rgba(0, 0, 0, 0.50);
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 114.286% */
}

.workspace-member_buttons {
  display: flex;
  visibility: hidden;

  gap: 1rem;
}

.workspace-member:hover .workspace-member_buttons {
  visibility: visible;
}
.workspace-member_button {
  flex: none;

  height: 36px;
  padding-left: 16px;
  padding-right: 16px;

  color: #000000;
  font-size: 14px;
  font-weight: 400;

  border: 1px #E7E7E5 solid;
  border-radius: 8px;
}

.workspace-member_button:hover {
  color: #FF7C5C;
}
</style>