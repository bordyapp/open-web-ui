<script setup lang="ts">
import SidebarMenu from "@/components/SidebarMenu.vue";
import {Pages} from "@/components/SidebarMenu";
import {useWorkspacesStore} from "@/WorkspacesStore";
import {useAuth0} from "@auth0/auth0-vue";
import {computed, inject, onMounted, ref, watch} from "vue";
import {BordyApi} from "@/api/BordyApi";
import type {Workspace} from "@/api/WorkspacesApi";
import type {ApiCallResult} from "@/api/TasksApi";
import {Card, CardStatus} from "@/BordieApi";
import CardModal from "@/components/board/CardModal.vue";
import TasksGroup from "@/components/tasks/TasksGroup.vue";
import MyTasksPageSkeleton from "@/pages/MyTasksPageSkeleton.vue";

const workspacesStore = useWorkspacesStore();
const { user, getAccessTokenSilently } = useAuth0();

const mixpanel = inject('mixpanel');
onMounted(async () => {
  mixpanel.track('pages_visited', {
    "page_name": "My tasks",
    "workspace_id": workspacesStore.selectedWorkspace?.id || null,
    "user_id": user.value?.sub || null
  });
  await loadTasks(workspacesStore.selectedWorkspace!.id);
})
watch(() => workspacesStore.selectedWorkspace, async (newWorkspace: Workspace, oldWorkspace: Workspace, onCleanup) => {
  if (newWorkspace?.id != oldWorkspace?.id) {
    await loadTasks(newWorkspace!.id);
  }
})

const workspaceIdRef                     = ref<string>("");
const isGetMyTasksRequestInProgressRef   = ref<boolean>(false);
const isGetMyTasksRequestSuccessRef      = ref<boolean>(false);
const isGetMyTasksRequestErrorMessageRef = ref<string>("");
const myTasks                              = ref<Card[]>([]);
async function loadTasks(workspaceId: string) {
  workspaceIdRef.value = workspaceId;
  isGetMyTasksRequestInProgressRef.value = true;
  const accessToken: string = await getAccessTokenSilently();
  const apiCallResult: ApiCallResult<Card[]> = await BordyApi.Tasks.getMyTasks(
      accessToken, workspaceId
  );

  isGetMyTasksRequestInProgressRef.value = false;

  if (apiCallResult.httpStatusCode !== 200) {
    if (apiCallResult.httpStatusCode === 403) {
      isGetMyTasksRequestErrorMessageRef.value = "You don't have access to this page";
    } else if (apiCallResult.httpStatusCode === 404) {
      isGetMyTasksRequestErrorMessageRef.value = "Tasks not found";
    } else {
      isGetMyTasksRequestErrorMessageRef.value = "Can't load tasks";
    }

    isGetMyTasksRequestSuccessRef.value = false;
  } else {
    myTasks.value = apiCallResult.data || [];
    isGetMyTasksRequestSuccessRef.value = true;
  }
}

const myTasksNotStarted = computed((): Card[] => {
  let result = [] as Card[];
  myTasks.value.forEach(myTask => {
    if (myTask.status === CardStatus.NOT_STARTED) {
      result.push(myTask)
    }
  })

  return result
})
const myTasksInProgress = computed((): Card[] => {
  let result = [] as Card[];
  myTasks.value.forEach(myTask => {
    if (myTask.status === CardStatus.IN_PROGRESS) {
      result.push(myTask)
    }
  })

  return result
})
const myTasksDone = computed((): Card[] => {
  let result = [] as Card[];
  myTasks.value.forEach(myTask => {
    if (myTask.status === CardStatus.DONE) {
      result.push(myTask)
    }
  })

  return result
})
const myTasksClosed = computed((): Card[] => {
  let result = [] as Card[];
  myTasks.value.forEach(myTask => {
    if (myTask.status === CardStatus.CLOSED) {
      result.push(myTask)
    }
  })

  return result
})
const assignedTasksInProgress = computed((): Card[] => {
  let result = [] as Card[];
  myTasks.value.forEach(myTask => {
    const ids = myTask.assignees.map(assignee => assignee.id);
    if (myTask.status === CardStatus.IN_PROGRESS && ids.indexOf(user.value.sub || "") !== -1) {
      result.push(myTask)
    }
  })

  return result
})
const assignedTasksNotStarted = computed((): Card[] => {
  let result = [] as Card[];
  myTasks.value.forEach(myTask => {
    const ids = myTask.assignees.map(assignee => assignee.id);
    if (myTask.status === CardStatus.NOT_STARTED && ids.indexOf(user.value.sub || "") !== -1) {
      result.push(myTask)
    }
  })

  return result
})

const cardModal = ref()
function showCardModal(card: Card) {
  cardModal.value.open(
      -1,
      -1,
      card.resources,
      card.boardId,
      card.listId,
      card.id,
      card,
      card.labels
  );
}
function deleteCard(listIndex: number, cardIndex: number, cardId: string) {
  let cardToDeleteIndex:number = -1;
  for (const [i, card] of myTasks.value.entries()) {
    if (card.id === cardId) {
      cardToDeleteIndex = i;

      break;
    }
  }

  if (cardToDeleteIndex != -1) {
    myTasks.value.splice(cardToDeleteIndex, 1)
  }
}
function saveCard(isCreateOperation: boolean, listIndex: number, cardIndex: number, card: Card) {
  if (isCreateOperation) {
    console.error("wrong behaviour")
  } else {
    for (let localCard of myTasks.value) {
      if (localCard.id === card.id) {
        localCard.name = card.name
        localCard.description = card.description
        localCard.labels = card.labels
        localCard.resources = card.resources
        localCard.priority = card.priority
        localCard.isDone = card.isDone
        localCard.status = card.status
        localCard.dueDate = card.dueDate
        localCard.assignees = card.assignees

        break;
      }
    }
  }
}

function openBoard(boardId: string) {
  // TODO: implement
}

const selectedTasks = ref<String>("assigned");
</script>

<template>
  <main class="my-tasks-page">
    <SidebarMenu :selected-page="Pages.my_tasks"/>
    <MyTasksPageSkeleton v-if="isGetMyTasksRequestInProgressRef"/>
    <div v-if="!isGetMyTasksRequestInProgressRef" class="flex flex-col grow overflow-auto">
      <div class="my-tasks-page_title">
        My tasks
      </div>
      <div v-if="isGetMyTasksRequestInProgressRef || !isGetMyTasksRequestSuccessRef" class="my-tasks-page_body__loading">
        <div v-if="!isGetMyTasksRequestInProgressRef && !isGetMyTasksRequestSuccessRef">
          <button class="my-tasks-page_body__loading_re-try-button my-tasks-page_body__loading_text" @click="loadTasks(workspaceIdRef)">Retry load tasks</button>
        </div>
      </div>
      <div v-if="!isGetMyTasksRequestInProgressRef && isGetMyTasksRequestSuccessRef" class="my-tasks-page_body">
        <div v-if="myTasks.length === 0" class="my-tasks-page_body_no-tasks">
          <img src="@/assets/my-tasks-empty-state.png" alt="empty-state">
          <div style="margin-left: 21px">
            <p class="my-tasks-page_body_no-tasks_title">You don’t have any tasks</p>
            <p class="my-tasks-page_body_no-tasks_description">Tasks can be created on the board</p>
          </div>
        </div>
        <div v-if="myTasks.length > 0" class="my-tasks-page_body_tasks">
          <div class="my-tasks-page_body_tasks_mode-switch" style="margin-left: 17px; margin-right: 17px">
            <button class="my-tasks-page_body_tasks_mode-switch_button" :class="{'my-tasks-page_body_tasks_mode-switch_button__selected': selectedTasks === 'assigned'}" @click="selectedTasks = 'assigned'">Assigned</button>
            <button class="my-tasks-page_body_tasks_mode-switch_button" :class="{'my-tasks-page_body_tasks_mode-switch_button__selected': selectedTasks === 'created'}" @click="selectedTasks = 'created'">Created</button>
          </div>
          <div v-if="selectedTasks === 'created'" style="margin-top: 21px;">
            <TasksGroup :status="CardStatus.NOT_STARTED" :tasks="myTasksNotStarted" v-if="myTasksNotStarted.length > 0" @openTask="showCardModal"/>
            <TasksGroup :status="CardStatus.IN_PROGRESS" :tasks="myTasksInProgress" v-if="myTasksInProgress.length > 0" @openTask="showCardModal"/>
            <TasksGroup :status="CardStatus.DONE" :tasks="myTasksDone" v-if="myTasksDone.length > 0" @openTask="showCardModal"/>
            <TasksGroup :status="CardStatus.CLOSED" :tasks="myTasksClosed" v-if="myTasksClosed.length > 0" @openTask="showCardModal"/>
          </div>
          <div v-if="selectedTasks === 'assigned'" style="margin-top: 21px;">
            <TasksGroup :status="CardStatus.NOT_STARTED" :tasks="assignedTasksNotStarted" v-if="assignedTasksNotStarted.length > 0" @openTask="showCardModal"/>
            <TasksGroup :status="CardStatus.IN_PROGRESS" :tasks="assignedTasksInProgress" v-if="assignedTasksInProgress.length > 0" @openTask="showCardModal"/>
          </div>
          <CardModal ref="cardModal" @delete="deleteCard" @save="saveCard"/>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.my-tasks-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #FFF;
}

.my-tasks-page_title {
  margin: 20px 20px;

  color: #000;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.my-tasks-page_body__loading {
  height: 100%;
  width: 100%;
  place-items: center;

  display: flex;
  justify-content: center;
  align-items: center;
}

.my-tasks-page_body__loading_text {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 114.286% */
}

.my-tasks-page_body__loading_re-try-button {
  height: 28px;
  padding-left: 12px;
  padding-right: 12px;

  border-radius: 8px;
  border: 1px solid #E7E7E5;
  background: #FFF;
}
.my-tasks-page_body__loading_re-try-button:hover {
  color: #FF7C5C;
}

.my-tasks-page_body {
  margin-bottom: 20px;

  flex-grow: 1;
  display: flex;
}

.my-tasks-page_body_no-tasks {
  display: flex;
  width: 100%;
  height: 100%;

  place-items: center;
  justify-content: center;
  align-items: center;
}

.my-tasks-page_body_no-tasks_title {
  color: #000;
  font-family: Manrope;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.my-tasks-page_body_no-tasks_description {
  color: #000;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  opacity: 0.5;
}

.my-tasks-page_body_tasks {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.my-tasks-page_body_tasks_mode-switch {
  display: flex;
  height: 28px;

  background-color: #F3F3F2;
  border: 1px #E7E7E5 solid;
  border-radius: 8px;
  width: fit-content;
}
.my-tasks-page_body_tasks_mode-switch_button {
  color: rgb(0, 0, 0, 0.5);
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  padding-left: 16px;
  padding-right: 16px
}
.my-tasks-page_body_tasks_mode-switch_button__selected {
  color: #000;
  background-color: #FFFFFF;
  border: 1px #E7E7E5 solid;
  border-radius: 8px;
}
</style>