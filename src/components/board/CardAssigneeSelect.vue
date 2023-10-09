<template>
  <div>
    <ul>
      <li v-for="(cardAssignee) in cardAssignees" class="card-assignee_label flex place-items-center">
        <div class="card-assignee_label_label flex place-items-center">
          <img :src="cardAssignee.picture" class="w-4 h-4 rounded-full ring-1 ring-white" style="width: 16px; height: 16px; margin-right: 2px" alt="picture">
          <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ cardAssignee.nickname }}</p>
        </div>
      </li>
    </ul>
    <div class="card-assignee-dropdown" tabindex="0">
      <p class="flex card-assignee-dropdown_text place-items-center">
        <svg style="margin-right: 4px" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 8L5 8" stroke="#6C6F75" stroke-linecap="round"/>
          <path d="M8 11L8 5" stroke="#6C6F75" stroke-linecap="round"/>
        </svg>
        {{cardAssignees.length > 0 ? 'Edit assignees' : 'Add assignees'}}
      </p>
      <div class="card-assignee-dropdown_priority-list">
        <ul>
          <li v-for="(cardAssignee, index) in possibleAssignees()" class="card-assignee-dropdown_label flex place-items-center">
            <input type="checkbox" class="card-assignee-dropdown_label_checkbox flex-col" :value="cardAssignee" @change="select(assignees)" v-model="assignees">
            <div class="card-assignee-dropdown_label_label flex place-items-center" style="margin-left: 8px">
              <img :src="cardAssignee.picture" class="w-4 h-4 rounded-full ring-1 ring-white" style="width: 16px; height: 16px; margin-right: 2px" alt="picture">
              <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ cardAssignee.nickname }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { useWorkspacesStore } from "../../WorkspacesStore.ts";
import {CardAssignee} from "../../BordieApi";
import {ref} from "vue";
const workspacesStore = useWorkspacesStore();

const { user } = useAuth0();

const props = defineProps({
    cardAssignees: {
        type: Array<CardAssignee>,
        required: true
    }
})
const assignees = ref<CardAssignee[]>(props.cardAssignees || [])
const emit = defineEmits<{
  (e: 'select', cardAssignees: CardAssignee[]): void
}>()
function select(cardAssignees: CardAssignee[]) {
  emit('select', cardAssignees)
}

function possibleAssignees(): CardAssignee[] {
    const me = new CardAssignee(
        user.value.sub || "",
        user.value!.nickname || "",
        user.value!.picture || ""
    );

    let possibleAssignees = new Map<string, CardAssignee>();
    possibleAssignees.set(me.id, me);

    workspacesStore.selectedWorkspace?.members?.forEach(workspaceMember => {
      let possibleAssignee = new CardAssignee(
          workspaceMember.id,
          workspaceMember.nickname,
          workspaceMember.picture
      );
      if (!possibleAssignees.has(possibleAssignee.id)) {
          possibleAssignees.set(possibleAssignee.id, possibleAssignee);
      }
    });

    props.cardAssignees?.forEach(cardAssignee => {
        if (!possibleAssignees.has(cardAssignee)) {
          possibleAssignees.set(cardAssignee.id, cardAssignee);
        }
    });

    return Array.from(possibleAssignees.values());
}
</script>

<style scoped>
.card-assignee-dropdown {
  height: fit-content;
  position: relative;
}

.card-assignee-dropdown_text {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
}
.card-assignee-dropdown_text:hover {
  color: #FF7C5C;
  cursor: pointer;
}

.card-assignee-dropdown:focus-within .card-assignee-dropdown_priority-list {
  visibility: visible;
}

.card-assignee-dropdown_priority-list {
  min-width: 200px;
  max-width: 200px;
  width: 200px;

  background-color: #FFFFFF;

  border-radius: 4px;
  border: 1px #DEE2E6 solid;

  position: absolute;
  right: 0;
  visibility: hidden;

  z-index: 1;
}

.card-assignee_label {
  min-height: 28px;
  max-height: 28px;
  height: 28px;

  width: 100%;

  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  font-weight: 400;
}
.card-assignee_label_label {
  height: 20px;
  padding-left: 2px;
  padding-right: 2px;

  border-radius: 4px;

  background-color: #EAEDEE;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-assignee-dropdown_label {
  min-height: 28px;
  max-height: 28px;
  height: 28px;

  width: 100%;

  padding-left: 8px;
  padding-right: 8px;

  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  font-weight: 400;
}
.card-assignee-dropdown_label:hover {
  background-color: #F7F7F6;
}

.card-assignee-dropdown_label_checkbox {
  min-width: 16px;
  max-width: 16px;
  width: 16px;

  min-height: 16px;
  max-height: 16px;
  height: 16px;
}
.card-assignee-dropdown_label_checkbox:hover {
  cursor: pointer;
}

.card-assignee-dropdown_label_label {
  height: 20px;
  padding-left: 8px;
  padding-right: 8px;

  border-radius: 4px;

  background-color: #EAEDEE;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>