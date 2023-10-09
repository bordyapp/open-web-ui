<script setup lang="ts">
import SidebarMenu from "@/components/SidebarMenu.vue";
import {Pages} from "@/components/SidebarMenu";
import { useWorkspacesStore } from "@/WorkspacesStore.ts";
import WorkspacesLoadingScreen from "@/components/WorkspacesLoadingScreen.vue";
import {
  UpdateMemberDto,
  WorkspaceInvite as Invite,
  WorkspaceMember as Member
} from "@/api/WorkspacesApi";
import {useAuth0} from "@auth0/auth0-vue";
import WorkspaceInviteModal from "@/components/workspace/invites/WorkspaceInviteModal.vue";
import WorkspaceInvite from "@/components/workspace/invites/WorkspaceInvite.vue";
import DeleteWorkspaceInviteModal from "@/components/workspace/invites/DeleteWorkspaceInviteModal.vue";
import WorkspaceMember from "@/components/workspace/members/WorkspaceMember.vue";
import DeleteWorkspaceMemberModal from "@/components/workspace/members/DeleteWorkspaceMemberModal.vue";
import WorkspaceMemberModal from "@/components/workspace/members/WorkspaceMemberModal.vue";
import {computed, inject, onMounted, ref} from "vue";

const workspacesStore = useWorkspacesStore();
const { user } = useAuth0();

const mixpanel = inject('mixpanel');
onMounted(() => {
  mixpanel.track('pages_visited', {
    "page_name": "Team",
    "workspace_id": workspacesStore.selectedWorkspace?.id || null,
    "user_id": user.value?.sub || null
  })
})

function createSelf() {
  return new Member(
      user.value.sub || '',
      user.value.email || '',
      user.value.nickname || '',
      '',
      '',
      user.value.picture || ''
  );
}

const workspaceInviteModal = ref();
function showWorkspaceInviteModal() {
  workspaceInviteModal.value.open(workspacesStore.selectedWorkspace?.id);
}

const deleteWorkspaceInviteModal = ref();
function showDeleteWorkspaceInviteModal(invite: Invite, inviteIndex: number) {
  deleteWorkspaceInviteModal.value.open(invite, inviteIndex);
}

const workspaceMemberModal = ref();
function showWorkspaceMemberModal(member: Member, workspaceId: string, memberIndex: number) {
  workspaceMemberModal.value.open(member, workspaceId, memberIndex);
}

const deleteWorkspaceMemberModal = ref();
function showDeleteWorkspaceMemberModal(member: Member, memberIndex: number) {
  deleteWorkspaceMemberModal.value.open(workspacesStore.selectedWorkspace!.id, member, memberIndex);
}

function removeInvite(inviteIndex: number | undefined) {
  if (inviteIndex !== undefined) {
    workspacesStore.selectedWorkspace?.invites?.splice(inviteIndex, 1);
  }
}
function addInvite(invite: Invite) {
  workspacesStore.selectedWorkspace?.invites?.push(invite);
}

function removeMember(memberIndex: number | undefined) {
  if (memberIndex !== undefined) {
    workspacesStore.selectedWorkspace?.members?.splice(memberIndex, 1);
  }
}

function updateMember(memberIndex: number | undefined, update: UpdateMemberDto) {
  console.log(memberIndex)
  if (memberIndex !== undefined) {
    workspacesStore.selectedWorkspace!.members!.at(memberIndex).nickname = update.name;
    workspacesStore.selectedWorkspace!.members!.at(memberIndex).role = update.role;
    workspacesStore.selectedWorkspace!.members!.at(memberIndex).responsibilities = update.responsibilities;
  }
}

const isWorkspaceAdmin = computed((): boolean => {
  return workspacesStore.selectedWorkspace?.ownerId === user.value?.sub;
})

const workspaceMembers = computed((): Member[] => {
  let workspaceMembers: Member[] = [];
  workspacesStore.selectedWorkspace?.members?.forEach((workspaceMember: Member) => {
    if (workspaceMember.id !== user.value?.sub) {
      workspaceMembers.push(workspaceMember);
    }
  });

  // TODO: return workspace owner
  return workspaceMembers;
})
</script>

<template>
  <main class="team-page">
    <SidebarMenu :selected-page="Pages.team"/>
    <WorkspacesLoadingScreen/>
    <div v-if="workspacesStore.loadedWithoutErrors" class="flex flex-col grow overflow-auto">
      <div class="team-page_title">
        Team
      </div>
      <div v-if="workspacesStore.selectedWorkspace" class="team-page_body">
        <ul class="team-page_body_members">
          <li style="border-bottom: 1px #E7E7E5 solid">
            <WorkspaceMember
                :member="createSelf()"
                :isOwner="false"
            />
          </li>
          <li v-for="(member, memberIndex) in workspaceMembers" style="border-bottom: 1px #E7E7E5 solid">
            <WorkspaceMember
                :member="member"
                :isOwner="isWorkspaceAdmin"
                @editEvent="showWorkspaceMemberModal(member, workspacesStore.selectedWorkspace.id, memberIndex)"
                @deleteEvent="showDeleteWorkspaceMemberModal(member, memberIndex)"
            />
          </li>
        </ul>
        <ul v-if="isWorkspaceAdmin && workspacesStore.selectedWorkspace.invites?.length > 0" class="team-page_body_invites">
          <li v-for="(invite, inviteIndex) in workspacesStore.selectedWorkspace.invites" style="border-bottom: 1px #E7E7E5 solid">
            <WorkspaceInvite
                :invite="invite"
                @deleteEvent="showDeleteWorkspaceInviteModal(invite, inviteIndex)"
            />
          </li>
        </ul>
        <div v-if="isWorkspaceAdmin" class="team-page_body_invite">
          <button type="button" @click="showWorkspaceInviteModal" class="team-page_body_invite-button">
            <svg style="margin-right: 8px" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M9.33332 9.50129V10.8946C8.72994 10.6813 8.08417 10.6159 7.45026 10.7038C6.81635 10.7918 6.21279 11.0306 5.69028 11.4001C5.16777 11.7696 4.74155 12.2592 4.44743 12.8276C4.15331 13.396 3.99987 14.0266 3.99999 14.6666L2.66666 14.666C2.66645 13.8519 2.8526 13.0486 3.21086 12.3176C3.56911 11.5865 4.08995 10.9472 4.73347 10.4486C5.37699 9.95005 6.12611 9.60538 6.92343 9.44106C7.72074 9.27673 8.5451 9.29711 9.33332 9.50063V9.50129ZM7.99999 8.66663C5.78999 8.66663 3.99999 6.87663 3.99999 4.66663C3.99999 2.45663 5.78999 0.666626 7.99999 0.666626C10.21 0.666626 12 2.45663 12 4.66663C12 6.87663 10.21 8.66663 7.99999 8.66663ZM7.99999 7.33329C9.47332 7.33329 10.6667 6.13996 10.6667 4.66663C10.6667 3.19329 9.47332 1.99996 7.99999 1.99996C6.52666 1.99996 5.33332 3.19329 5.33332 4.66663C5.33332 6.13996 6.52666 7.33329 7.99999 7.33329ZM12 11.3333V9.33329H13.3333V11.3333H15.3333V12.6666H13.3333V14.6666H12V12.6666H9.99999V11.3333H12Z" fill="currentColor"/>
            </svg>
            Invite member
          </button>
        </div>
        <WorkspaceInviteModal ref="workspaceInviteModal" @saveEvent="addInvite"/>
        <DeleteWorkspaceInviteModal ref="deleteWorkspaceInviteModal" @deleteEvent="removeInvite"/>
        <WorkspaceMemberModal ref="workspaceMemberModal" @saveEvent="updateMember"/>
        <DeleteWorkspaceMemberModal ref="deleteWorkspaceMemberModal" @deleteEvent="removeMember"/>
      </div>
    </div>
  </main>
</template>

<style scoped>
.team-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #FFF;
}

.team-page_title {
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;

  color: #000;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.team-page_body {
  margin-top: 16px;
}

.team-page_body_members {
  display: flex;
  flex-direction: column;
  gap: 0.25rem/* 4px */;

  padding-left: 20px;
  padding-right: 20px;
}
.team-page_body_invites {
  display: flex;
  flex-direction: column;
  gap: 0.25rem/* 4px */;

  padding-left: 20px;
  padding-right: 20px;
}

.team-page_body_invite {
  margin: 20px;
}
.team-page_body_invite-button {
  height: 28px;
  padding-left: 12px;
  padding-right: 16px;

  display: flex;
  place-items: center;

  border-radius: 8px;
  border: 1px solid #E9E9EE;
  background: #FFF;

  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.team-page_body_invite-button:hover {
  color: #FF7C5C;
}
</style>