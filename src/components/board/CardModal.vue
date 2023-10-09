<template>
    <transition name="modal-fade">
        <div class="modal-backdrop z-50" v-if="showModal" @click="closeModalOnClick">
            <form class="card-form" @submit.prevent="saveCard">
                <div v-if="isDeleteOperation" class="card-form_header__danger grid grid-cols-3 place-items-center">
                    <div></div>
                    <div class="justify-self-center">
                        <p v-if="isRequestInProcess">
                            Deleting card...
                        </p>
                        <p v-else-if="isRequestFailed">
                            Error while deleting card
                        </p>
                        <p v-else>
                            Delete this card?
                        </p>
                    </div>
                    <div class="justify-self-end" style="margin-right: 10px">
                        <button :disabled="isRequestInProcess" type="button" @click="deleteCard" class="card-form_header_confirm-delete-button" style="margin-right: 8px">
                            Yes
                        </button>
                        <button :disabled="isRequestInProcess" type="button" @click="rejectCardDeletion" class="card-form_header_reject-delete-button">
                            No
                        </button>
                    </div>
                </div>
                <div v-else class="card-form_header grid grid-cols-3 place-items-center">
                    <div>
                    </div>
                    <div class="justify-self-center">
                        <p v-if="isRequestInProcess" style="color: #000000; font-size: 14px; font-weight: 400">
                            Saving card...
                        </p>
                        <p v-else-if="isRequestFailed" style="color: #000000; font-size: 14px; font-weight: 400">
                            Error while saving card
                        </p>
                        <p v-else style="color: #000000; font-size: 14px; font-weight: 400">
                            {{isCreateOperation ? 'New card' : 'Edit card'}}
                        </p>
                    </div>
                    <div class="justify-self-end" style="margin-right: 10px">
                        <button :disabled="isRequestInProcess" class="card-form_header_save-button">
                            Save
                        </button>
                    </div>
                </div>
                <hr/>
                <div class="card-form_body flex">
                    <div class="card-form_body_name-and-description">
                        <input required v-model="cardName" type="text" placeholder="Name" class="card-name-input w-full"/>
                        <textarea v-model="cardDescription" placeholder="Add description..." class="card-description-input w-full" style="margin-top: 8px; height: 400px">
                        </textarea>
                        <CardCommentsComponent :cardId="cardId" :workspaceId="workspacesStore.selectedWorkspace?.id" @delete="decreaseNumberOfComments" @create="increaseNumberOfComments"/>
                    </div>
                    <div class="card-form_body_properties">
                        <div class="card-form_body_properties_section">
                            <p class="card-form_body_properties_section_name">Details</p>
                            <div class="flex justify-between place-items-center" style="margin-top: 8px">
                                <div style="min-width: 79px; width: 79px; max-width: 79px;">
                                  <p class="card-form_body_property_name flex-col">Priority</p>
                                </div>
                                <div class="flex-col" style="min-width: 121px; width: 121px; max-width: 121px;">
                                    <CardPrioritySelect :cardPriority="cardPriority" @select="(e: CardPriority) => {cardPriority = e}"/>
                                </div>
                            </div>
                            <div class="flex justify-between place-items-center" style="margin-top: 8px">
                              <div style="min-width: 79px; width: 79px; max-width: 79px;">
                                <p class="card-form_body_property_name flex-col">
                                  Due date
                                </p>
                              </div>
                              <div class="flex-col" style="min-width: 121px; width: 121px; max-width: 121px;">
                                <div class="flex place-items-center">
                                  <input v-model="cardDueDate" type="date" style="color: rgba(0, 0, 0, 0.5); font-size: 12px; font-weight: 400">
                                  <svg @click="resetDueDate" class="card-form_reset-due-date" v-show="cardDueDate" style="margin-left: 8px" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5ZM2.64645 2.64645C2.84171 2.45118 3.15829 2.45118 3.35355 2.64645L5 4.29289L6.64645 2.64645C6.84171 2.45118 7.15829 2.45118 7.35355 2.64645C7.54882 2.84171 7.54882 3.15829 7.35355 3.35355L5.70711 5L7.35355 6.64645C7.54882 6.84171 7.54882 7.15829 7.35355 7.35355C7.15829 7.54882 6.84171 7.54882 6.64645 7.35355L5 5.70711L3.35355 7.35355C3.15829 7.54882 2.84171 7.54882 2.64645 7.35355C2.45118 7.15829 2.45118 6.84171 2.64645 6.64645L4.29289 5L2.64645 3.35355C2.45118 3.15829 2.45118 2.84171 2.64645 2.64645Z"
                                          fill="currentColor"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div class="flex justify-between" style="margin-top: 8px">
                              <div class="flex-col" style="min-width: 79px; width: 79px; max-width: 79px;">
                                <p class="card-form_body_property_name flex-col">
                                  Labels
                                </p>
                              </div>
                              <div class="flex-col" style="min-width: 121px; width: 121px; max-width: 121px;">
                                <CardLabelSelect :knownLabels="boardLabels" :cardLabels="cardLabels" @select="(e: string[]) => {cardLabels = e}"/>
                              </div>
                            </div>
                          <div class="flex justify-between place-items-center" style="margin-top: 8px">
                            <div style="min-width: 79px; width: 79px; max-width: 79px;">
                              <p class="card-form_body_property_name flex-col">Status</p>
                            </div>
                            <div class="flex-col" style="min-width: 121px; width: 121px; max-width: 121px;">
                              <CardStatusSelect :cardStatus="cardStatus" @select="(e: CardStatus) => {cardStatus = e}"/>
                            </div>
                          </div>
                            <div class="flex justify-between" style="margin-top: 8px">
                              <div class="flex-col" style="min-width: 79px; width: 79px; max-width: 79px;">
                                <p class="card-form_body_property_name flex-col">
                                  Assignees
                                </p>
                              </div>
                              <div class="flex-col" style="min-width: 121px; width: 121px; max-width: 121px;">
                                <CardAssigneeSelect :cardAssignees="cardAssignees" @select="(e: CardAssignee[]) => {cardAssignees = e}"/>
                              </div>
                            </div>
                        </div>
                        <hr v-if="cardResources.length > 0" class="card-form_body_properties_section-divider">
                        <div v-if="cardResources.length > 0" class="card-form_body_properties_section">
                            <p class="card-form_body_properties_section_name">Resources</p>
                            <div class="flex justify-between" style="margin-top: 8px" v-for="(cardResource) in cardResources">
                                <p class="card-form_body_property_name flex-col">{{cardResource.name}}</p>
                                <input class="flex-col" v-model="cardResource.cost" type="number" style="max-width: 60px; font-size: 12px; font-weight: 400;"/>
                            </div>
                        </div>
                        <hr class="card-form_body_properties_section-divider">
                        <div class="card-form_body_properties_section">
                          <p class="card-form_body_properties_section_name">Actions</p>
                          <button v-if="!isCreateOperation" :disabled="isRequestInProcess" type="button" @click="requestCardDeletion" class="card-form_delete-button" style="margin-top: 8px">
                            Delete
                          </button>
                          <button :disabled="isRequestInProcess" type="button" @click="close" class="card-form_close-button" style="margin-top: 8px">
                            Cancel
                          </button>
                        </div>
<!--                        <hr class="card-form_body_properties_section-divider">-->
<!--                        <div class="card-form_body_properties_section">-->
<!--                            <p class="card-form_body_properties_section_name">Extra</p>-->
<!--                            <div class="flex justify-between" style="margin-top: 8px; font-size: 12px; font-weight: 400;">-->
<!--                                <p class="flex-col">Task tracker</p>-->
<!--                                <input class="flex-col" type="url" placeholder="Link to task" style="height: 22px; width: 125px; background-color: #F3F3F2; border-radius: 24px; padding-left: 10px; padding-right: 10px;"/>-->
<!--                            </div>-->
<!--                        </div>-->
                    </div>
                </div>
            </form>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import {useAuth0} from '@auth0/auth0-vue';
import {
  BordieApi,
  Card, CardAssignee,
  CardPriority,
  CardResource,
  CardStatus,
  WriteBoardListCardDto
} from "../../BordieApi.ts";

import {useWorkspacesStore} from "../../WorkspacesStore.ts";
import CardAssigneeSelect from "@/components/board/CardAssigneeSelect.vue";
import CardPrioritySelect from "@/components/board/CardPrioritySelect.vue";
import CardLabelSelect from "@/components/board/CardLabelSelect.vue";
import CardStatusSelect from "@/components/board/CardStatusSelect.vue";
import CardCommentsComponent from "@/components/board/comments/CardCommentsComponent.vue";

const { getAccessTokenSilently } = useAuth0();
const workspacesStore = useWorkspacesStore();

let isCreateOperation:boolean = false;
let listIndex:number          = -1;
let cardIndex:number          = -1;
let boardId:string            = ""
let listId:string             = ""
let cardId:string | undefined = ""

const cardRef         = ref<Card | undefined>(undefined);
const cardName        = ref<string>("")
const cardDescription = ref<string>("")
const cardPriority    = ref<CardPriority>(CardPriority.NO_PRIORITY)
const cardStatus      = ref<CardStatus>(CardStatus.NOT_STARTED)
const cardDueDate     = ref<string>("")
const cardResources   = ref<CardResource[]>([])
const cardLabels      = ref<string[]>([])
const boardLabels      = ref<string[]>([])
const cardAssignees   = ref<CardAssignee[]>([])
const cardIsDone          = ref<boolean>(false)

const isRequestInProcess = ref<boolean>(false)
const isRequestFailed    = ref<boolean>(false)

const showModal = ref<boolean>(false)
const isDeleteOperation = ref<boolean>(false)

function currentDateAsString(date: Date): string {
  let yourDate = date;
  const offset = yourDate.getTimezoneOffset()
  yourDate = new Date(yourDate.getTime() - (offset*60*1000))
  return yourDate.toISOString().split('T')[0]
}

function open(_listIndex: number, _cardIndex: number, _knownResources: string[], _boardId: string, _listId: string, _cardId?: string, card?: Card, _boardLabels: string[] = []) {
    isCreateOperation = card == undefined
    cardRef.value         = card
    if (isCreateOperation) {
        cardName.value = "";
        cardDescription.value = "";
        cardResources.value = [];
        cardLabels.value = [];
        cardIsDone.value = false;
        cardAssignees.value = [];

        cardPriority.value = CardPriority.NO_PRIORITY;
        cardStatus.value = CardStatus.NOT_STARTED;
        cardDueDate.value = "";
        _knownResources.forEach(knownResource => cardResources.value.push(new CardResource(knownResource, 0)))
    } else {
        cardName.value = card!.name.slice();
        cardDescription.value = card!.description.slice();
        cardResources.value = [];
        if (card!.resources.length === 0) {
            _knownResources.forEach(knownResource => cardResources.value.push(new CardResource(knownResource, 0)))
        }
        card!.resources.forEach(resource => cardResources.value.push(new CardResource(resource.name, resource.cost)))

        console.log("card?.priority: ")
        console.log(card?.priority)
        console.log(card)
        cardPriority.value = card?.priority || CardPriority.NO_PRIORITY
        cardStatus.value = card?.status || CardStatus.NOT_STARTED;
        cardLabels.value = [...card?.labels || []];
        cardIsDone.value = card?.isDone || false;
        cardAssignees.value = [...card?.assignees || []];
        if (card?.dueDate) {
          cardDueDate.value = currentDateAsString(new Date(card.dueDate));
        } else {
          cardDueDate.value = "";
        }
    }

    listIndex = _listIndex;
    cardIndex = _cardIndex;
    boardId   = _boardId;
    listId    = _listId;
    cardId    = _cardId;
    isDeleteOperation.value = false;
    boardLabels.value = _boardLabels;
    showModal.value = true
}

function requestCardDeletion() {
    isRequestFailed.value = false;
    isDeleteOperation.value = true;
}
function rejectCardDeletion() {
    isRequestFailed.value = false;
    isDeleteOperation.value = false;
}

function deleteCard() {
    isRequestFailed.value = false;
    isRequestInProcess.value = true;
    getAccessTokenSilently().then(token => {
        BordieApi.deleteBoardListCard(
            token,
            workspacesStore.selectedWorkspace?.id || "",
            boardId,
            listId!,
            cardId!
        ).then(response => {
            isRequestFailed.value = false
            console.log(response)

            emit('delete', listIndex, cardIndex, cardId!)
            showModal.value = false
        }).catch(error => {
            console.log(error)
            isRequestFailed.value = true;
        }).finally(
            () => isRequestInProcess.value = false)
    }, error => {
        console.log(error)
        isRequestFailed.value = true;
    })
}

function close() {
    showModal.value = false;
}

const emit = defineEmits<{
    (e: 'save', isCreateOperation: boolean, listIndex: number, cardIndex: number, card: Card): void
    (e: 'delete', listIndex: number, cardIndex: number, cardId: string): void
}>()

function saveCard() {
    getAccessTokenSilently().then(token => {
        let requestFuture;
        let assignees = [];
        for (let assignee of cardAssignees.value) {
            assignees.push(assignee.id)
        }

        let dueDate: Date | undefined = undefined;
        if (cardDueDate.value !== "") {
          dueDate = new Date(cardDueDate.value);
        }
        if (isCreateOperation) {
            requestFuture = BordieApi.createBoardListCard(
                token,
                workspacesStore.selectedWorkspace?.id || "",
                boardId,
                listId,
                new WriteBoardListCardDto(
                    cardName.value,
                    cardDescription.value,
                    cardPriority.value,
                    cardStatus.value,
                    dueDate,
                    cardResources.value,
                    cardLabels.value,
                    assignees,
                    undefined,
                    false
                )
            )
        } else {
            requestFuture = BordieApi.updateBoardListCard(
                token,
                workspacesStore.selectedWorkspace?.id || "",
                boardId,
                listId,
                cardId || "",
                new WriteBoardListCardDto(
                    cardName.value,
                    cardDescription.value,
                    cardPriority.value,
                    cardStatus.value,
                    dueDate,
                    cardResources.value,
                    cardLabels.value,
                    assignees,
                    undefined,
                    cardIsDone.value
                )
            )
        }
        isRequestInProcess.value = true;
        requestFuture.then(response => {
            isRequestFailed.value = false
            console.log(response)

            emit('save', isCreateOperation, listIndex, cardIndex, response.data as Card)
            showModal.value = false
        }).catch(error => {
            console.log(error)
            isRequestFailed.value = true;
        }).finally(
            () => isRequestInProcess.value = false)
    }, error => {
        console.log(error)
        isRequestFailed.value = true;
    })
}

defineExpose({
    open
})

function resetDueDate() {
  cardDueDate.value = "";
}

function closeModalOnClick(event: any) {
  if (event?.target?.className === "modal-backdrop z-50" && isRequestInProcess.value === false) {
    close();
  }
}

function decreaseNumberOfComments() {
  if (cardRef.value) {
    cardRef.value!.numberOfComments -= 1;
  }
}
function increaseNumberOfComments() {
  if (cardRef.value) {
    cardRef.value!.numberOfComments += 1;
  }
}
</script>

<style scoped>
.card-form {
    width: 652px;
    height: 536px;
    max-height: 536px;
    border-radius: 8px;

    background: #FFFFFF;
}

.card-form_header {
    height: 42px;
}
.card-form_header__danger {
    height: 42px;

    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    color: #842029;
    background-color: #F8D7DA;
}

.card-form_header_save-button {
    height: 30px;
    padding-left: 16px;
    padding-right: 16px;
    color: #000000;
    font-size: 14px;
    font-weight: 400;
    border: 1px #E7E7E5 solid;
    border-radius: 8px
}
.card-form_header_save-button:hover {
    color: #FF7C5C;
    border: 1px #FF7C5C solid;
    cursor: pointer;
}

.card-form_close-button {
  height: 22px;
  width: 200px;

  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  font-weight: 400;
  background-color: #F7F7F6;
  border-radius: 4px;
}
.card-form_close-button:hover {
    color: #FF7C5C;
    border: 1px #FF7C5C solid;
    border-radius: 4px;
    cursor: pointer;
}

.card-form_delete-button {
    height: 22px;
    width: 200px;

    color: rgba(0, 0, 0, 0.5);
    font-size: 12px;
    font-weight: 400;
    background-color: #F7F7F6;
    border-radius: 4px;
}
.card-form_delete-button:hover {
    color: #FF0000;
    border: 1px #FF0000 solid;
    border-radius: 4px;
    cursor: pointer;
}

.card-form_header_confirm-delete-button {
    height: 30px;
    padding-left: 16px;
    padding-right: 16px;
    color: rgba(0, 0, 0, 0.5);
}
.card-form_header_confirm-delete-button:hover {
    color: #FF0000;
    border: 1px #FF0000 solid;
    border-radius: 8px;
    cursor: pointer;
}

.card-form_header_reject-delete-button {
    height: 30px;
    padding-left: 16px;
    padding-right: 16px;
    color: rgba(0, 0, 0, 0.5);
}
.card-form_header_reject-delete-button:hover {
    color: #FF7C5C;
    border: 1px #FF7C5C solid;
    border-radius: 8px;
    cursor: pointer;
}

.card-form_body {
    height: 484px;
}

.card-form_body_name-and-description {
    height: 100%;
    overflow: auto;
    width: 432px;
    padding-left: 24px;
    padding-right: 20px;
    padding-top: 16px
}

.card-form_body_properties {
    width: 235px;
    border-left: 1px #E7E7E5 solid;

    overflow-y: auto;
}

.card-form_body_properties_section {
    padding: 12px 16px 12px 12px;
}

.card-form_body_property_name {
    color: rgba(0, 0, 0, 0.5);
    font-size: 12px;
    font-weight: 400;
}

.card-form_body_properties_section-divider {
    margin-left: 12px;
    margin-right: 16px;
}

.card-form_body_properties_section_name {
    color: rgba(0, 0, 0, 0.5);
    font-weight: 700;
    font-size: 12px;
}

.card-name-input {
    height: 30px;
    color: #000000;
    font-size: 16px;
    font-weight: bold;

    outline: none;
}

.card-description-input {
    color: #000000;
    font-size: 14px;

    height: 189px;
    max-height: 189px;
    outline: none;
    resize: none;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.card-form_reset-due-date {
  color: rgba(0, 0, 0, 0.5);
}
.card-form_reset-due-date:hover {
  cursor: pointer;
  color: #FF7C5C;
}
</style>