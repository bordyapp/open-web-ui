<template>
  <div class="card-container">
      <div style="position: relative">
          <div v-if="isAsyncOperationInProgress" class="flex card-overlay_in-progress place-items-center">
              <img width="30" height="30" src="../../assets/loading.svg" alt="loading"/>
              <p>{{asyncOperationDescription}}</p>
          </div>
          <div v-if="isAsyncOperationFailed" class="flex card-overlay_failure place-items-center">
              <p class="flex-col">{{asyncOperationErrorDescription}}</p>
              <button class="flex-col place-items-center" type="button" style="width: 60px; height: 20px; border: 1px #FFFFFF solid; border-radius: 8px;" @click="closeOperationErrorOverlay">ok</button>
          </div>
      </div>
      <CardRenameComponent :card="card" ref="cardRenameComponent" v-show="editMode" @closeEvent="hideQuickCardRename" @updateEvent="applyQuickCardRename"/>
      <div v-show="!editMode" class="card">
          <div>
              <div v-show="!editMode">
                <div style="position: absolute; z-index: 99; display: flex; background-color: #FFFFFF; margin-left: 170px; border-radius: 8px; filter: drop-shadow(0 0 2px  rgba(0, 0, 0, 0.04));">
                  <div style="margin-left: 4px" class="card_quick-rename" @click="showQuickCardRename">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="16" height="16" fill="none"/>
                      <g clip-path="url(#clip0_1211_2099)">
                        <path d="M4.7415 10.3333L10.6577 4.41717L9.83283 3.59234L3.91667 9.50851V10.3333H4.7415ZM5.22508 11.5H2.75V9.02492L9.42042 2.35451C9.52981 2.24515 9.67815 2.18372 9.83283 2.18372C9.98751 2.18372 10.1359 2.24515 10.2452 2.35451L11.8955 4.00476C12.0049 4.11415 12.0663 4.2625 12.0663 4.41717C12.0663 4.57185 12.0049 4.7202 11.8955 4.82959L5.22508 11.5ZM2.75 12.6667H13.25V13.8333H2.75V12.6667Z" fill="currentColor"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_1211_2099">
                          <rect width="14" height="14" fill="none" transform="translate(1 1)"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <button :id="`card-dropdown-button-${card.id}`" class="card_dropdown" style="margin-right: 4px" @click="openCardDropdown">
                      <svg ref="dropdownButton" class="card-dropdown_icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clip-path="url(#clip0_657_7300)">
                              <path d="M8 2C7.26667 2 6.66667 2.6 6.66667 3.33333C6.66667 4.06667 7.26667 4.66667 8 4.66667C8.73333 4.66667 9.33333 4.06667 9.33333 3.33333C9.33333 2.6 8.73333 2 8 2ZM8 11.3333C7.26667 11.3333 6.66667 11.9333 6.66667 12.6667C6.66667 13.4 7.26667 14 8 14C8.73333 14 9.33333 13.4 9.33333 12.6667C9.33333 11.9333 8.73333 11.3333 8 11.3333ZM8 6.66667C7.26667 6.66667 6.66667 7.26667 6.66667 8C6.66667 8.73333 7.26667 9.33333 8 9.33333C8.73333 9.33333 9.33333 8.73333 9.33333 8C9.33333 7.26667 8.73333 6.66667 8 6.66667Z"
                                    fill="currentColor"/>
                          </g>
                      </svg>
                  </button>
                </div>
                <div class="card__has-bound-board" v-if="card.boundBoardId" @click="openBoard(card.boundBoardId)">
                  <p v-if="card.numberOfCardsOnBoundBoard > 0">
                    ({{card.numberOfDoneCardsOnBoundBoard}}/{{card.numberOfCardsOnBoundBoard}}) tasks completed
                  </p>
                  <p v-else>
                    Open sub-board
                  </p>
                  <svg style="margin-left: 4px" width="4" height="6" viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L3 3L1 5" stroke="currentColor" stroke-linecap="round"/>
                  </svg>
                </div>
                <p class="card_name" @click="emitEditEvent">{{card.name}}</p>
              </div>
          </div>
          <div class="flex card_extra-info">
              <div class="flex flex-wrap gap-2 grow">
                <div class="card__done" v-if="card.status === CardStatus.DONE">
                  Done
                </div>
                <div v-if="card.numberOfComments > 0" style="height: 20px; background-color: #EAEDEE; display: flex; place-items: center; border-radius: 4px; padding-left: 8px; padding-right: 8px">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_635_1683)">
                      <path d="M4.25305 12.1473L1.16663 12.8333L1.85263 9.74691C1.40086 8.90188 1.16519 7.9582 1.16663 6.99999C1.16663 3.77824 3.77822 1.16666 6.99997 1.16666C10.2217 1.16666 12.8333 3.77824 12.8333 6.99999C12.8333 10.2217 10.2217 12.8333 6.99997 12.8333C6.04176 12.8348 5.09808 12.5991 4.25305 12.1473ZM4.42222 10.9147L4.80313 11.1189C5.47895 11.4801 6.2337 11.6683 6.99997 11.6667C7.92295 11.6667 8.8252 11.393 9.59263 10.8802C10.3601 10.3674 10.9582 9.63857 11.3114 8.78585C11.6646 7.93312 11.757 6.99481 11.577 6.08957C11.3969 5.18432 10.9524 4.3528 10.2998 3.70016C9.64715 3.04751 8.81563 2.60306 7.91039 2.42299C7.00514 2.24293 6.06683 2.33534 5.21411 2.68855C4.36139 3.04176 3.63255 3.6399 3.11977 4.40733C2.60699 5.17476 2.3333 6.07701 2.3333 6.99999C2.3333 7.77816 2.52288 8.52716 2.88163 9.19682L3.08522 9.57774L2.70313 11.2968L4.42222 10.9147Z" fill="#595958"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_635_1683">
                        <rect width="14" height="14" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <p style="margin-left: 4px; color: #595958; font-family: Manrope; font-size: 10px; font-style: normal; font-weight: 400; line-height: normal;">{{card.numberOfComments}}</p>
                </div>
                <CardPriorityComponent v-if="card.status !== CardStatus.DONE" class="flex-col" :card="card"/>
                <CardDueDateComponent v-if="card.dueDate" :card="card"/>
                <div v-for="(label) in card.labels" class="card_label" :style="`background-color: ${labelColor(label, false)}`">
                  <p class="card_label_name" :style="`color: ${labelColor(label)}`">{{label}}</p>
                </div>
              </div>
              <div class="flex">
                <div v-for="(assignee, assigneeIndex) in card.assignees" :style="[assigneeIndex >= 1 ? 'margin-left: -6px' : `z-index: ${assigneeIndex}`]">
                  <img class="rounded-full" :src="assignee.picture" style="min-height: 19px; height: 19px; min-width: 19px; width: 19px; border: 1px #EAEDEE solid" alt="assignee">
                </div>
              </div>
          </div>
          <div class="card_extra-info flex flex-wrap gap-2">
            <div v-for="(resource) in card.resources" v-show="resource.cost > 0" class="card_resource">
              {{resource.name}}: {{resource.cost}}
            </div>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import {Card, CardStatus} from "@/BordieApi";
import {WorkspaceElementType} from "@/api/BoardsAndFoldersApi"
import CardPriorityComponent from "@/components/board/CardPriorityComponent.vue";
import CardDueDateComponent from "@/components/board/CardDueDateComponent.vue";

import { useAuth0 } from '@auth0/auth0-vue';
const { getAccessTokenSilently, user } = useAuth0();

import { useWorkspacesStore } from "@/WorkspacesStore";
import { useWorkspaceElementsStore } from "@/WorkspaceElementsStore";
import {Tab, useTabsStore} from "@/components/tabs/TabsStore";
import {inject, ref} from "vue";
import CardRenameComponent from "@/components/board/CardRenameComponent.vue";
import {useRouter} from "vue-router";

const mixpanel = inject('mixpanel');

function openCardDropdown() {
    emit('openDropdown')
}

const workspacesStore = useWorkspacesStore();
const workspaceElementsStore = useWorkspaceElementsStore();
const tabsStore = useTabsStore();

const props = defineProps({
    card: {
        type: Card,
        required: true
    }
})

const emit = defineEmits<{
    (e: 'editEvent'): void
    (e: 'deleteEvent'): void
    (e: 'disableDragging'): void
    (e: 'enableDragging'): void
    (e: 'openDropdown'): void
}>()
function emitEditEvent() {
    emit('editEvent')
}

function emitDeleteEvent() {
    emit('deleteEvent')
}

import {useBoardBreadcrumbsStore} from "@/components/boards/BoardBreadcrumbsStore"
const boardBreadcrumbsStore = useBoardBreadcrumbsStore();
const router = useRouter();
function openBoard(boardId: string) {
  mixpanel.track('open_board_from_card', {
      "board_id": boardId,
      "workspace_id": workspacesStore.selectedWorkspace?.id || null,
      "user_id": user.value?.sub || null
  });
  boardBreadcrumbsStore.openSubBoard(boardId);
  router.push({name: 'board-page', params: {boardId: boardId}});
}

function startDrag(evt, card: Card) {
    evt.dataTransfer.dropEffect = 'move'
    evt.dataTransfer.effectAllowed = 'move'
    evt.dataTransfer.setData('cardToMoveId', card.id)
    evt.dataTransfer.setData('cardToMoveListId', card.listId)
}

const isAsyncOperationInProgress = ref<boolean>(false)
const asyncOperationDescription = ref<string>("")
const isAsyncOperationFailed = ref<boolean>(false)
const asyncOperationErrorDescription = ref<string>("")

function showOperationOverlay(operationDescription: string) {
    isAsyncOperationInProgress.value = true
    asyncOperationDescription.value  = operationDescription
}
function closeOperationOverlay() {
    isAsyncOperationInProgress.value = false
    asyncOperationDescription.value = ""
}
function showOperationErrorOverlay(errorDescription: string) {
    isAsyncOperationFailed.value         = true;
    asyncOperationErrorDescription.value = errorDescription
}
function closeOperationErrorOverlay() {
    isAsyncOperationFailed.value         = false;
    asyncOperationErrorDescription.value = ""
}

function isOperationsvailable(): boolean {
    return !isAsyncOperationInProgress.value
        && !isAsyncOperationFailed.value;
}

defineExpose({
    showOperationOverlay,
    closeOperationOverlay,
    showOperationErrorOverlay,
    closeOperationErrorOverlay
})

const editMode            = ref<boolean>(false);
const cardRenameComponent = ref();
function showQuickCardRename() {
  editMode.value = true;
  cardRenameComponent.value.show();
  emit('disableDragging');
}
function hideQuickCardRename() {
  editMode.value = false;
  emit('enableDragging');
}

function applyQuickCardRename(name: string) {
  props.card.name = name;
  editMode.value = false;
  emit('enableDragging');
}

/**
 * https://stackoverflow.com/a/21682946
 *
 * https://stackoverflow.com/users/356218/thymine
 */
function labelColor(label: string, isTextColor: boolean = true): string {
  let hash: number       = 0;
  let saturation: number = 70; // saturation is how rich you want the color
  let lightness: number; // Lightness determines the deepness, 50% is normal, 25% is dark colors, 75% is pastel
  if (isTextColor) {
    lightness = 10;
  } else {
    lightness = 85;
  }

  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%)`;
}
</script>

<style scoped>
.card-overlay_in-progress {
    font-size: 12px;
    color: #FFFFFF;
    background-color: #000000;
    position: absolute;
    width: 268px;
    max-height: 100px;

    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    padding: 16px 12px;
}
.card-overlay_failure {
    font-size: 12px;
    color: #FFFFFF;
    background-color: #F04C3F;
    position: absolute;
    width: 268px;
    max-height: 100px;

    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    padding: 16px 12px;
}

.card-container {
  min-width: 220px;
  width: 220px;
  max-width: 220px;
  z-index: 1;
}
.card-container:hover {
  z-index: 2;
}

.card {
  min-width: 220px;
  width: 220px;
  max-width: 220px;

  padding: 8px 8px 12px;

  border-radius: 8px;
  background: #FFF;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.04);
}

.card__has-bound-board {
  color: #737372;
  font-family: Manrope;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  display: flex;
  place-items: center;
}
.card__has-bound-board:hover {
    color: #FF7C5C;
    cursor: pointer;
}

.card__done {
    height: 20px;
    display: flex;
    place-items: center;

    background-color: #F0F0EF;
    border-radius: 4px;

    color: #006911;
    font-family: Manrope;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    padding-left: 8px;
    padding-right: 8px;
}

.card_dropdown {
    display: none;
    color: #737372;
}
.card:hover .card_dropdown {
    display: block;
}
.card_dropdown:hover {
    color: #FF7C5C;
    cursor: pointer;
}

.card_quick-rename {
  display: none;
  color: rgba(0, 0, 0, 0.5);
}
.card:hover .card_quick-rename {
  display: block;
}
.card_quick-rename:hover {
  color: #FF7C5C;
  cursor: pointer;
}

.card_name {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  overflow: clip;
  overflow-wrap: break-word;
}
.card_name:hover {
    color: #FF7C5C;
    cursor: pointer;
}

.card_label {
    padding-left: 8px;
    padding-right: 8px;

    min-height: 20px;

    border-radius: 4px;

    overflow: hidden;
    overflow-wrap: break-word;

    display: flex;
    align-items: center;
}

.card_label_name {
  font-family: Manrope;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.card_resource {
    padding-left: 8px;
    padding-right: 8px;

    color: #595958;
    font-family: Manrope;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    min-height: 20px;

    background-color: #EAEDEE;

    border-radius: 4px;

    overflow: hidden;
    overflow-wrap: anywhere;

    display: flex;
    align-items: center;
}

.card_extra-info {
    margin-top: 6px;
}
</style>