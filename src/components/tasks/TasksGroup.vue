<script setup lang="ts">
import {Card, CardStatus} from "@/BordieApi";
import {computed} from "vue";
import CardDueDateComponent from "@/components/board/CardDueDateComponent.vue";
import CardPriorityComponent from "@/components/board/CardPriorityComponent.vue";
import {useRouter} from "vue-router";

const props = defineProps({
  status: {
    required: true,
    type: String
  },
  tasks: {
    required: true,
    type: Array<Card>
  },
});

const groupName = computed((): string => {
  switch (props.status || "") {
    case CardStatus.NOT_STARTED: return "Not Started"
    case CardStatus.IN_PROGRESS: return "In progress"
    case CardStatus.DONE: return "Done"
    case CardStatus.CLOSED: return "Closed"
    default: return "Unknown"
  }
})

const emit = defineEmits<{
  (e: 'openTask', task: Card): void,
  (e: 'openTaskBoard', boardId: string): void
}>()
function emitOpenTask(task: Card) {
  emit('openTask', task)
}

const router = useRouter();
function openTaskBoard(boardId: string) {
  router.push({name: 'board-page', params: {boardId: boardId}});
}
</script>

<template>
  <div class="tasks-group">
    <div class="tasks-group_title">
      <svg v-if="status === CardStatus.NOT_STARTED" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="16" height="16" fill="none"/>
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M7 2.9284C7 2.41566 7.41566 2 7.9284 2H8.0716C8.58434 2 9 2.41566 9 2.9284V3.11544C9 3.62735 8.51191 4 8 4C7.48809 4 7 3.62735 7 3.11544V2.9284ZM8 12C8.51191 12 9 12.3727 9 12.8846V13.0716C9 13.5843 8.58434 14 8.0716 14H7.9284C7.41566 14 7 13.5843 7 13.0716V12.8846C7 12.3727 7.48809 12 8 12ZM12.2931 10.8789C12.6558 11.2415 12.6558 11.8295 12.2931 12.1922L12.1922 12.2931C11.8295 12.6557 11.2415 12.6557 10.8789 12.2931L10.7466 12.1608C10.3846 11.7988 10.4664 11.1904 10.8284 10.8284C11.1904 10.4664 11.7988 10.3846 12.1608 10.7466L12.2931 10.8789ZM5.25343 3.83921C5.61545 4.20123 5.53359 4.80956 5.17158 5.17157C4.80956 5.53359 4.20123 5.61544 3.83922 5.25343L3.70693 5.12114C3.34426 4.75847 3.34426 4.17047 3.70693 3.8078L3.80781 3.70692C4.17048 3.34426 4.75848 3.34426 5.12115 3.70692L5.25343 3.83921ZM12.8846 9C12.3727 9 12 8.51191 12 8C12 7.48809 12.3727 7 12.8846 7H13.0716C13.5843 7 14 7.41566 14 7.9284V8.0716C14 8.58434 13.5843 9 13.0716 9H12.8846ZM4 8C4 8.51191 3.62735 9 3.11544 9H2.9284C2.41566 9 2 8.58434 2 8.0716V7.9284C2 7.41566 2.41566 7 2.9284 7H3.11544C3.62735 7 4 7.48809 4 8ZM5.07238 12.2413C4.70889 12.6048 4.11954 12.6048 3.75605 12.2413L3.65543 12.1407C3.29345 11.7787 3.29345 11.1918 3.65543 10.8299L3.78871 10.6966C4.15491 10.3304 4.7725 10.4191 5.13378 10.7901C5.48675 11.1527 5.56196 11.7517 5.20417 12.1095L5.07238 12.2413ZM12.1095 5.20416C11.7518 5.56196 11.1527 5.48675 10.7901 5.13377C10.4191 4.7725 10.3304 4.15491 10.6966 3.78871L10.8299 3.65543C11.1918 3.29344 11.7787 3.29344 12.1407 3.65543L12.2413 3.75605C12.6048 4.11954 12.6048 4.70888 12.2413 5.07238L12.1095 5.20416Z"
              fill="#6C6F75"/>
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M7 2.9284C7 2.41566 7.41566 2 7.9284 2H8.0716C8.58434 2 9 2.41566 9 2.9284V3.11544C9 3.62735 8.51191 4 8 4C7.48809 4 7 3.62735 7 3.11544V2.9284ZM8 12C8.51191 12 9 12.3727 9 12.8846V13.0716C9 13.5843 8.58434 14 8.0716 14H7.9284C7.41566 14 7 13.5843 7 13.0716V12.8846C7 12.3727 7.48809 12 8 12ZM12.2931 10.8789C12.6558 11.2415 12.6558 11.8295 12.2931 12.1922L12.1922 12.2931C11.8295 12.6557 11.2415 12.6557 10.8789 12.2931L10.7466 12.1608C10.3846 11.7988 10.4664 11.1904 10.8284 10.8284C11.1904 10.4664 11.7988 10.3846 12.1608 10.7466L12.2931 10.8789ZM5.25343 3.83921C5.61545 4.20123 5.53359 4.80956 5.17158 5.17157C4.80956 5.53359 4.20123 5.61544 3.83922 5.25343L3.70693 5.12114C3.34426 4.75847 3.34426 4.17047 3.70693 3.8078L3.80781 3.70692C4.17048 3.34426 4.75848 3.34426 5.12115 3.70692L5.25343 3.83921ZM12.8846 9C12.3727 9 12 8.51191 12 8C12 7.48809 12.3727 7 12.8846 7H13.0716C13.5843 7 14 7.41566 14 7.9284V8.0716C14 8.58434 13.5843 9 13.0716 9H12.8846ZM4 8C4 8.51191 3.62735 9 3.11544 9H2.9284C2.41566 9 2 8.58434 2 8.0716V7.9284C2 7.41566 2.41566 7 2.9284 7H3.11544C3.62735 7 4 7.48809 4 8ZM5.07238 12.2413C4.70889 12.6048 4.11954 12.6048 3.75605 12.2413L3.65543 12.1407C3.29345 11.7787 3.29345 11.1918 3.65543 10.8299L3.78871 10.6966C4.15491 10.3304 4.7725 10.4191 5.13378 10.7901C5.48675 11.1527 5.56196 11.7517 5.20417 12.1095L5.07238 12.2413ZM12.1095 5.20416C11.7518 5.56196 11.1527 5.48675 10.7901 5.13377C10.4191 4.7725 10.3304 4.15491 10.6966 3.78871L10.8299 3.65543C11.1918 3.29344 11.7787 3.29344 12.1407 3.65543L12.2413 3.75605C12.6048 4.11954 12.6048 4.70888 12.2413 5.07238L12.1095 5.20416Z"
              fill="#6C6F75"/>
      </svg>
      <svg v-if="status === CardStatus.IN_PROGRESS" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="16" height="16" fill="none"/>
        <rect x="2.5" y="2.5" width="11" height="11" rx="5.5" fill="none" fill-opacity="0.5" stroke="#6C6F75"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4V12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4Z"
              fill="#6C6F75"/>
      </svg>
      <svg v-if="status === CardStatus.DONE" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="16" height="16" fill="none"/>
        <path d="M6.99938 9.58588L11.5954 4.98938L12.3029 5.69638L6.99938 10.9999L3.81738 7.81788L4.52438 7.11088L6.99938 9.58588Z"
              fill="#6C6F75"/>
      </svg>
      <svg v-if="status === CardStatus.CLOSED" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="16" height="16" fill="none"/>
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8ZM10.4749 5.52513C10.6701 5.72039 10.6701 6.03697 10.4749 6.23223L8.70709 8L10.4749 9.76777C10.6701 9.96303 10.6701 10.2796 10.4749 10.4749C10.2796 10.6701 9.96302 10.6701 9.76775 10.4749L7.99999 8.70711L6.23222 10.4749C6.03696 10.6701 5.72038 10.6701 5.52511 10.4749C5.32985 10.2796 5.32985 9.96303 5.52511 9.76777L7.29288 8L5.52511 6.23223C5.32985 6.03697 5.32985 5.72039 5.52511 5.52513C5.72038 5.32986 6.03696 5.32986 6.23222 5.52513L7.99999 7.29289L9.76775 5.52513C9.96302 5.32986 10.2796 5.32986 10.4749 5.52513Z"
              fill="#6C6F75"/>
      </svg>
      <p class="tasks-group_title_name">{{groupName}}</p>
      <div class="tasks-group_title_number-of-tasks">{{tasks.length}}</div>
    </div>
    <div class="tasks-group_task" v-for="(card, cardIndex) in tasks">
      <CardPriorityComponent :card="card" style="float: left; margin-right: 10px"/>
      <p class="tasks-group_task_name" @click="emitOpenTask(card)">{{card.name}}</p>
      <CardDueDateComponent style="margin-right: 8px" class="flex-none tasks-group_task_hide-element-on-hover" :card="card"/>
      <img v-for="(assignee) in card.assignees" class="flex-none rounded-full hide-on-task-hover" style="width: 20px; height: 20px; margin-left: 1px" :src="assignee.picture" alt="author picture">
      <div class="tasks-group_task_buttons">
        <button class="tasks-group_task_buttons_button" @click="openTaskBoard(card.boardId)">Open the board</button>
        <button v-if="card.boundBoardId" class="tasks-group_task_buttons_button" @click="openTaskBoard(card.boundBoardId)">Open bound board</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tasks-group {
}

.tasks-group_title {
  padding-left: 15px;

  display: flex;
  place-items: center;

  height: 32px;
  background-color: rgba(233, 233, 238, 0.5);
}

.tasks-group_title_name {
  color: #808080;
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  margin-left: 4px;
  margin-right: 4px;
}

.tasks-group_title_number-of-tasks {
  height: 13px;

  color: rgba(0, 0, 0, 0.5);
  font-family: Manrope;
  font-size: 10px;
  font-weight: 400;
  font-style: normal;
  line-height: normal;

  background-color: rgba(57, 57, 57, 0.1);
  border-radius: 13px;

  padding-left: 4px;
  padding-right: 4px;

  align-items: center;
  display: flex;
}

.tasks-group_task {
  display: flex;
  flex-wrap: wrap;
  place-items: center;

  height: 40px;
  padding-left: 11px;
  padding-right: 16px;
  border-bottom: 1px solid #E7E7E5;
}

.tasks-group_task_name {
  flex-grow: 1;

  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 114.286% */
}
.tasks-group_task_name:hover {
  cursor: pointer;
  color: #FF7C5C;
}

.tasks-group_task_buttons {
  margin-left: 8px;

  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem/* 8px */;
}
.tasks-group_task_buttons_button {
  height: 28px;
  flex-shrink: 0;

  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  border-radius: 8px;
  border: 1px solid #E7E7E5;
  background: #FFF;

  padding-left: 16px;
  padding-right: 16px;

  float: right;

  display: none;
}
.tasks-group_task_buttons_button:hover {
  color: #FF7C5C;
}

.tasks-group_task:hover .tasks-group_task_hide-element-on-hover {
  visibility: hidden;
}
.tasks-group_task:hover .tasks-group_task_buttons_button {
  display: block;
}
</style>