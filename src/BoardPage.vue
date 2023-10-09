<template>
        <div class="board">
            <!-- tags -->
            <div v-show="labels.size > 0" class="board_labels">
                <div class="board_labels_label" @click="selectedLabel = 'All'" :class="{'board_labels_label__selected': selectedLabel == 'All'}">
                    <span :class="selectedLabel == 'All' ? 'board_labels_label_name__selected' : 'board_labels_label_name'" style="margin-left: 12px;">All</span>
                    <span :class="selectedLabel == 'All' ? 'board_labels_label_counter__selected' : 'board_labels_label_counter'">{{ numberOfCards }}</span>
                </div>
                <div class="board_labels_label" v-for="[labelName, labelCounter] in labels" @click="selectedLabel = labelName" :class="{'board_labels_label__selected': selectedLabel == labelName}" style="margin-left: 8px;">
                    <span :class="selectedLabel == labelName ? 'board_labels_label_name__selected' : 'board_labels_label_name'" style="margin-left: 12px;">{{ labelName }}</span>
                    <span :class="selectedLabel == labelName ? 'board_labels_label_counter__selected' : 'board_labels_label_counter'">{{ labelCounter }}</span>
                </div>
                <div class="board_labels_label" v-for="[assigneeId, numberOfCards] in assignedCards" @click="selectAssignee(assigneeId)" :class="{'board_labels_label__selected': selectedAssignee == assigneeId}" style="margin-left: 8px;">
                    <img :src="assigneePictures.get(assigneeId)" class="rounded-full" style="margin-left: 12px; margin-right: 4px; height: 16px; width: 16px; border: 1px #EAEDEE solid" alt="assignee">
                    <span :class="selectedAssignee == assigneeId ? 'board_labels_label_name__selected' : 'board_labels_label_name'">{{ assigneeNames.get(assigneeId) }}</span>
                    <span :class="selectedAssignee == assigneeId ? 'board_labels_label_counter__selected' : 'board_labels_label_counter'">{{ numberOfCards }}</span>
                </div>
            </div>
            <!-- Lists -->
              <draggable
                  v-model="board.lists"
                  group="lists"
                  item-key="id"
                  v-bind="{disabled: listDragDisabled}"
                  class="board_lists"
                  @update="dragList"
              >
                <template #item="{element: list, index: listIndex}: {element: List, index: number}">
                  <div class="board_lists_list">
                    <div>
                      <ListDropdown class="board_lists_list_dropdown" :list="list" @convert="convertListIntoBoard(list)" @edit="showListModal(listIndex)" @delete="showDeleteListModal(listIndex)"/>
                      <div class="board_lists_list__has-bound-board" v-if="list.boundBoardId" @click="openBoard(list.boundBoardId)">
                        <p v-if="list.numberOfCardsOnBoundBoard > 0">
                          ({{list.numberOfDoneCardsOnBoundBoard}}/{{list.numberOfCardsOnBoundBoard}}) tasks completed
                        </p>
                        <p v-else>
                          Open sub-board
                        </p>
                        <svg style="margin-left: 4px" width="4" height="6" viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L3 3L1 5" stroke="currentColor" stroke-linecap="round"/>
                        </svg>
                      </div>
                      <p class="board_lists_list_name" @click="showListModal(listIndex)">{{list.name}}</p>
                    </div>
                    <ul class="board_lists_list_resources" v-if="list.resources?.length > 0">
                      <li class="board_lists_list_resources_resource" v-for="(resource) in list.resources">{{resource.name}}: {{resource.capacity}}</li>
                    </ul>
                    <draggable
                        v-model="list.cards"
                        group="cards"
                        item-key="id"
                        v-bind="{disabled: cardDragDisabled}"
                        class="flex flex-col flex-grow overflow-x-hidden overflow-y-auto gap-2 fancy-scrollbar"
                        style="margin-top: 8px; width: 230px"
                        @change="dragCard(list.id, $event)"
                    >
                      <!-- v-for="(card, cardIndex) in filterListCards(list.cards)" -->
                      <template #item="{element: card, index: cardIndex}: {element: Card, index: number}">
                        <CardComponent
                            v-if="filterListCards(list.cards).includes(card.id)"
                            :key="card.id"
                            :ref="(el) => draggableComponents.set(card.id, el)"
                            :listIndex="listIndex"
                            :cardIndex="cardIndex"
                            @editEvent="showCardModal(listIndex, cardIndex)"
                            @disableDragging="cardDragDisabled = true"
                            @enableDragging="cardDragDisabled = false"
                            @openDropdown="openCardDropdown(card, listIndex, cardIndex)"
                            :card="card"
                        />
                      </template>
                    </draggable>
                    <CardQuickCreateComponent :ref="(el: any) => cardQuickCreateComponents.set(list.id, el)" :list="list"/>
                    <button class="board_lists_list_add-card-button flex-none" @click="showCardQuickCreateComponent(list.id)" style="margin-top: 12px">+</button>
                  </div>
                </template>
                <template #footer>
                  <div class="flex gap-2">
                    <ListQuickCreateComponent :ref="(el: any) => activeListQuickCreateComponent = el" :board="board"/>
                    <button @click="showListQuickCreateComponent" class="board_lists_add-list-button">+</button>
                  </div>
                </template>
              </draggable>
              <CardDropdownActions
                  ref="cardDropdownActionsRef"
                  id="cardDropdownActions"
                  @edit="showCardModal"
                  @convert="convertCardIntoBoard"
                  @delete="showDeleteListCardModal"
              />
              <CardModal ref="cardModal" @delete="deleteListCard" @save="saveCard"/>
              <CardDeleteModal ref="deleteCardModal" @delete="deleteListCard"/>
              <ListModal ref="listModal" @delete="deleteList" @save="renderList"/>
              <ListDeleteModal ref="deleteListModal" @delete="deleteList"/>
        </div>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable'
import {Tab, useTabsStore} from "@/components/tabs/TabsStore";
const tabsStore = useTabsStore();
import {computed, inject, reactive, ref} from "vue";
import ListModal from "@/components/board/ListModal.vue";
import CardModal from "@/components/board/CardModal.vue";
import CardComponent from "@/components/board/CardComponent.vue";
import { useAuth0 } from '@auth0/auth0-vue';
const { getAccessTokenSilently, user } = useAuth0();
import { useWorkspacesStore } from "@/WorkspacesStore";
import { useWorkspaceElementsStore } from "@/WorkspaceElementsStore";
import {BordieApi, List, Card} from "@/BordieApi";
import {WorkspaceElement, WorkspaceElementType} from "@/api/BoardsAndFoldersApi"
import ListDropdown from "@/components/board/ListDropdown.vue";
import CardDeleteModal from "@/components/board/CardDeleteModal.vue";
import ListDeleteModal from "@/components/board/ListDeleteModal.vue";
import CardQuickCreateComponent from "@/components/board/CardQuickCreateComponent.vue";
import CardDropdownActions from "@/components/board/CardDropdownActions.vue";

import {createPopper} from '@popperjs/core/lib/popper-lite';
import {onClickOutside} from "@vueuse/core";
import ListQuickCreateComponent from "@/components/board/ListQuickCreateComponent.vue";
const cardDropdownPopperInstance = ref();
const cardDropdownActionsRef     = ref();
const cardDropdownButtonRef      = ref();
const cardRef                    = ref<Card>();

const props = defineProps({
  board: {
    type: WorkspaceElement,
    required: true
  }
})

function openCardDropdown(card: Card, listIndex: number, cardIndex: number) {
    cardDropdownButtonRef.value  = document.getElementById(`card-dropdown-button-${card.id}`);
    let cardDropdownActions = document.getElementById("cardDropdownActions") as HTMLElement;
    onClickOutside(cardDropdownActions, () => {
        cardDropdownActionsRef.value?.close();
    });
    cardDropdownPopperInstance.value = createPopper(
        cardDropdownButtonRef.value,
        cardDropdownActions,
        {
            placement: "bottom-start",
        }
    );

    cardRef.value = card;
    cardDropdownActionsRef.value?.open(card, listIndex, cardIndex);
    cardDropdownPopperInstance.value.forceUpdate();
}
function convertCardIntoBoard() {
    cardDropdownActionsRef.value.close();
    getAccessTokenSilently().then(token => {
        BordieApi.convertBoardListCardToBoard(
            token,
            workspacesStore.selectedWorkspace?.id || "",
            cardRef.value!.boardId,
            cardRef.value!.listId,
            cardRef.value!.id
        ).then(response => {
            console.log(response)

            const board = response.data as WorkspaceElement
            cardRef.value!.boundBoardId = board.id
            workspaceElementsStore.addWorkspaceElement(board);
            mixpanel.track('create_board_from_card', {
                "board_id": cardRef.value?.boardId || null,
                "card_id": cardRef.value?.id || null,
                "workspace_id": workspacesStore.selectedWorkspace?.id || null,
                "user_id": user.value?.sub || null
            })
        }).catch(error => {
            console.log(error)
        }).finally(() => {})
    }, error => {
        console.log(error)
    })
}

const draggableComponents = reactive(new Map<string, any>())

const workspacesStore = useWorkspacesStore();
const workspaceElementsStore = useWorkspaceElementsStore();

const mixpanel = inject('mixpanel');

function convertListIntoBoard(list: List) {
    getAccessTokenSilently().then(token => {
        BordieApi.convertBoardListToBoard(
            token,
            workspacesStore.selectedWorkspace?.id || "",
            props.board?.id || "",
            list.id
        ).then(response => {
            console.log(response)

            // TODO: Show progress window
            const board = response.data as WorkspaceElement
            list.boundBoardId = board.id
            workspaceElementsStore.addWorkspaceElement(board);
        }).catch(error => {
            console.log(error)
            // this.errored = true
        })
    }, error => {
        console.log(error)
    })
}

const listModal = ref();
function showListModal(listIndex: number = -1) {
    listModal.value.open(
        props.board!.id,
        listIndex,
        props.board!.lists[listIndex] || undefined
    );
}
function renderList(isCreateOperation: boolean, listIndex: number, list: List) {
    if (isCreateOperation) {
        props.board!.lists.push(list)
    } else {
        props.board!.lists[listIndex].name = list.name;
        props.board!.lists[listIndex].resources = list.resources;
    }
}

const deleteListModal = ref()
function showDeleteListModal(listIndex: number) {
    deleteListModal.value.open(
        listIndex,
        props.board!.lists[listIndex]
    )
}
function deleteList(listIndex: number) {
    props.board!.lists!.splice(listIndex, 1)
}

const cardModal = ref();
function showCardModal(listIndex: number, cardIndex: number = -1) {
    cardModal.value.open(
        listIndex,
        cardIndex,
        props.board!.lists[listIndex].resources.map(r => r.name),
        props.board!.id,
        props.board!.lists[listIndex].id,
        props.board!.lists[listIndex].cards[cardIndex]?.id || undefined,
        props.board!.lists[listIndex].cards[cardIndex],
        Array.from(labels.value.keys())
    );
}
function saveCard(isCreateOperation: boolean, listIndex: number, cardIndex: number, card: Card) {
    if (isCreateOperation) {
        props.board!.lists[listIndex].cards.push(card)
    } else {
        props.board!.lists[listIndex].cards[cardIndex].name = card.name
        props.board!.lists[listIndex].cards[cardIndex].description = card.description
        props.board!.lists[listIndex].cards[cardIndex].labels = card.labels
        props.board!.lists[listIndex].cards[cardIndex].resources = card.resources
        props.board!.lists[listIndex].cards[cardIndex].priority = card.priority
        props.board!.lists[listIndex].cards[cardIndex].dueDate = card.dueDate
        props.board!.lists[listIndex].cards[cardIndex].isDone = card.isDone
        props.board!.lists[listIndex].cards[cardIndex].status = card.status
        props.board!.lists[listIndex].cards[cardIndex].assignees = card.assignees
    }
}

const deleteCardModal = ref()
function showDeleteListCardModal(listIndex: number, cardIndex: number, card: Card) {
    deleteCardModal.value.open(
        listIndex,
        cardIndex,
        card
    )
}
function deleteListCard(listIndex: number, cardIndex: number) {
    props.board!.lists[listIndex].cards.splice(cardIndex, 1)
}

const selectedLabel = ref("All")
const selectedAssignee = ref("")
function filterListCards(cards: Card[]): String[] {
    if (selectedLabel.value !== "All" && selectedAssignee.value !== "") {
        // label + userId = label + userid
        return cards.filter((boardPeriodTask) => {
            const assignees = boardPeriodTask.assignees?.map(assignee => assignee.id) || [];
            return assignees.includes(selectedAssignee.value) && boardPeriodTask.labels?.includes(selectedLabel.value);
        }).map(card => card.id);;
    } else if (selectedLabel.value === "All" && selectedAssignee.value !== "") {
        // all + userId = userId
        return cards.filter((boardPeriodTask) => {
            const assignees = boardPeriodTask.assignees?.map(assignee => assignee.id) || [];
            return assignees.includes(selectedAssignee.value)
        }).map(card => card.id);;
    } else if (selectedLabel.value !== "All" && selectedAssignee.value === "") {
        // label + "" = label
        return cards.filter((boardPeriodTask) => boardPeriodTask.labels?.includes(selectedLabel.value)).map(card => card.id);;
    } else {
        // all + ""
        return cards.map(card => card.id);;
    }
}
const numberOfCards = computed((): number => {
    let numberOfCards = 0;

    props.board?.lists?.forEach(list => {
        numberOfCards += list.cards.length
    })

    return numberOfCards;
})
const labels = computed((): Map<string, number> => {
    let labels = new Map<string, number>()

    props.board?.lists?.forEach(list => {
        list.cards.forEach(card => {
            card.labels?.forEach(label => {
                if (labels.has(label)) {
                    labels.set(label, labels.get(label) + 1)
                } else {
                    labels.set(label, 1)
                }
            })
        })
    })

    return labels;
})
const assignedCards = computed((): Map<string, number> => {
    let assignedCards = new Map<string, number>()

    props.board?.lists?.forEach(list => {
        list.cards.forEach(card => {
            card.assignees?.forEach(assignee => {
                if (assignedCards.has(assignee.id)) {
                    assignedCards.set(assignee.id, assignedCards.get(assignee.id) + 1)
                } else {
                    assignedCards.set(assignee.id, 1)
                }
            })
        })
    })

    return assignedCards;
})
const assigneePictures = computed((): Map<string, string> => {
    let assigneePictures = new Map<string, string>()

    props.board?.lists?.forEach(list => {
        list.cards.forEach(card => {
            card.assignees?.forEach(assignee => {
                assigneePictures.set(assignee.id, assignee.picture)
            })
        })
    })

    return assigneePictures;
})
const assigneeNames = computed((): Map<string, string> => {
    let assigneePictures = new Map<string, string>()

    props.board?.lists?.forEach(list => {
        list.cards.forEach(card => {
            card.assignees?.forEach(assignee => {
                assigneePictures.set(assignee.id, assignee.nickname)
            })
        })
    })

    return assigneePictures;
})

function selectAssignee(assigneeId: string) {
    if (assigneeId === selectedAssignee.value) {
        selectedAssignee.value = "";
    } else {
        selectedAssignee.value = assigneeId;
    }
}

function openBoard(boardId: string) {
  tabsStore.openTab(new Tab(boardId, "", WorkspaceElementType.Board))
}

function dragList(event: any) {
  const newListIndex   = event.newIndex;
  let listToMove: List = event.item.__draggable_context.element as List;

  let placeAfterList: String  = "";
  if (newListIndex > 0) {
    placeAfterList = props.board?.lists?.at(newListIndex - 1)?.id || "";
  }

  let placeBeforeList: String = "";
  if ((props.board?.lists?.length || -1) > newListIndex) {
    placeBeforeList = props.board?.lists?.at(newListIndex + 1)?.id || "";
  }

  listDragDisabled.value = true;
  getAccessTokenSilently().then(
      token => {
        BordieApi.reorderBoardList(
            token,
            workspacesStore.selectedWorkspace?.id || "",
            props.board!.id,
            listToMove.id,
            placeAfterList,
            placeBeforeList
        ).then(response => {
          listToMove.lexorank = response.data;
        }).catch(error => {
          console.log(error)
          let moved = props.board?.lists.splice(event.newIndex, 1) || [];
          props.board?.lists.splice(event.oldIndex, 0, moved[0]);
        }).finally(
            () => {
              console.log(`place ${listToMove.name}:\n  after: ${placeAfterList}\n  before: ${placeBeforeList}`);
              listDragDisabled.value = false;
            }
        )
      },
      tokenError => {
        console.log(tokenError);
        listDragDisabled.value = false;
      }
  )
}

const listDragDisabled = ref<boolean>(false);
const cardDragDisabled = ref<boolean>(false);

function dragCard(targetListId: String, event: any) {
  if (event.added) {
    const card = event.added.element as Card;
    const newCardIndex = event.added.newIndex;

    let placeAfterElementWithId: String  = "";
    if (newCardIndex > 0) {
      props.board?.lists.forEach(list => {
        if (list.id === targetListId) {
          placeAfterElementWithId = list.cards.at(newCardIndex - 1)?.id || ""
        }
      })
    }

    let placeBeforeElementWithId: String = "";
    if ((props.board?.lists?.length || -1) > newCardIndex) {
      props.board?.lists.forEach(list => {
        if (list.id === targetListId) {
          placeBeforeElementWithId = list.cards.at(newCardIndex + 1)?.id || ""
        }
      })
    }

    cardDragDisabled.value = true;
    getAccessTokenSilently().then(token => {
      BordieApi.moveBoardListCard(
          token,
          workspacesStore.selectedWorkspace?.id || "",
          props.board!.id,
          card.listId,
          card.id,
          placeAfterElementWithId,
          placeBeforeElementWithId,
          targetListId
      ).then(response => {
        console.log(response)
        card.lexorank = response.data
      }).catch(error => {
        console.log(error)
        props.board?.lists.forEach(list => {
          if (list.id === targetListId) {
            list.cards.splice(newCardIndex, 1);
          }
          if (list.id === card.listId) {
            list.cards.push(card);
            list.cards = list.cards.sort((a, b) => {
              if (a.lexorank < b.lexorank) {
                return -1;
              } else if (a.lexorank > b.lexorank) {
                return 1;
              } else {
                return 0;
              }
            });
          }
        })
      }).finally(
          () => {
            cardDragDisabled.value = false;
          }
      )
    }, tokenError => {
      console.log(tokenError);
      cardDragDisabled.value = false;
    })
  } else if (event.moved) {
    const card = event.moved.element as Card;
    const newCardIndex = event.moved.newIndex;

    let placeAfterElementWithId: String  = "";
    if (newCardIndex > 0) {
      props.board?.lists.forEach(list => {
        if (list.id === card.listId) {
          placeAfterElementWithId = list.cards.at(newCardIndex - 1)?.id || ""
        }
      })
    }

    let placeBeforeElementWithId: String = "";
    if ((props.board?.lists?.length || -1) > newCardIndex) {
      props.board?.lists.forEach(list => {
        if (list.id === card.listId) {
          placeBeforeElementWithId = list.cards.at(newCardIndex + 1)?.id || ""
        }
      })
    }

    console.log(`move card ${card.name} inside list:\n  place after ${placeAfterElementWithId}\n  place before ${placeBeforeElementWithId}`);
    cardDragDisabled.value = true;
    getAccessTokenSilently().then(token => {
      BordieApi.moveBoardListCard(
          token,
          workspacesStore.selectedWorkspace?.id || "",
          props.board!.id,
          card.listId,
          card.id,
          placeAfterElementWithId,
          placeBeforeElementWithId,
          targetListId
      ).then(response => {
        console.log(response)
        card.lexorank = response.data
      }).catch(error => {
        console.log(error)
        props.board?.lists.forEach(list => {
          if (list.id === card.listId) {
            list.cards = list.cards.sort((a, b) => {
              if (a.lexorank < b.lexorank) {
                return -1;
              } else if (a.lexorank > b.lexorank) {
                return 1;
              } else {
                return 0;
              }
            });
          }
        })
      }).finally(
          () => {
            cardDragDisabled.value = false;
          }
      )
    }, tokenError => {
      console.log(tokenError);
      cardDragDisabled.value = false;
    })
  }
}

const cardQuickCreateComponents = reactive(new Map<string, any>())
const activeCardQuickCreateComponent = ref<any | undefined>(undefined);
function showCardQuickCreateComponent(listId: string) {
  activeCardQuickCreateComponent.value?.close();
  activeCardQuickCreateComponent.value = cardQuickCreateComponents.get(listId);
  activeCardQuickCreateComponent.value?.show();
}
const activeListQuickCreateComponent = ref<any | undefined>(undefined);
function showListQuickCreateComponent() {
  activeListQuickCreateComponent.value?.close();
  activeListQuickCreateComponent.value?.show();
}
</script>

<style scoped>
.fancy-scrollbar {
  scrollbar-width: thin;
  -webkit-transform: translateZ(0);
}

.board {
  padding: 20px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
}

.board_labels {
  display: inline-flex;
  flex-direction: row;
  flex-grow: 1;
  overflow-y: auto;
  height: 34px;
  max-height: 34px;
  min-height: 34px;
}

.board_labels_label {
  display: flex;
  height: 28px;

  white-space: nowrap;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  font-weight: 400;

  background-color: #F4F5F7;
  border-radius: 8px;
}
.board_labels_label__selected {
    background-color: #333333;
}

.board_labels_label_name {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.board_labels_label_name:hover {
  color: #FF7C5C;
}
.board_labels_label_name__selected {
  color: #FFFFFF;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.board_labels_label_counter {
  margin-left: 4px;
  margin-right: 12px;

  color: rgba(0, 0, 0, 0.5);
  font-family: Manrope;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  height: 13px;
  border-radius: 13px;
  padding-left: 4px;
  padding-right: 4px;
  background-color: rgba(57, 57, 57, 0.1);

  align-items: center;
  display: flex;
}
.board_labels_label_counter__selected {
  margin-left: 4px;
  margin-right: 12px;

  color: #FFFFFF;
  font-family: Manrope;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  height: 13px;
  border-radius: 13px;
  padding-left: 4px;
  padding-right: 4px;
  background-color: rgba(255, 255, 255, 0.2);

  align-items: center;
  display: flex;
}

.board_lists {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 16px;
}

.board_lists_list {
  width: 237px;
  height: fit-content;
  max-height: 100%;

  padding: 9px 8px 16px;
  margin-right: 8px;

  border-radius: 8px;
  background: #F4F5F7;

  display: flex;
  flex-direction: column;
}

.board_lists_list_dropdown {
  float: right;
  display: none;
  color: #737372;
}
.board_lists_list:hover .board_lists_list_dropdown {
  display: block;
}
.board_lists_list_dropdown:hover {
  color: #FF7C5C;
  cursor: pointer;
}

.board_lists_list__has-bound-board {
  color: #737372;
  font-family: Manrope;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  display: flex;
  place-items: center;
}
.board_lists_list__has-bound-board:hover {
  color: #FF7C5C;
  cursor: pointer;
}

.board_lists_list_name {
  color: #000;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.board_lists_list_name:hover {
  color: #FF7C5C;
  cursor: pointer;
}

.board_lists_list_resources {
  margin-top: 4px;

  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem/* 8px */;
}
.board_lists_list_resources_resource {
  min-height: 20px;

  color: rgba(0, 0, 0, 0.5);
  font-family: Manrope;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  border-radius: 4px;
  border: 1px #E7E7E6 solid;

  padding-left: 8px;
  padding-right: 8px;

  overflow: hidden;
  overflow-wrap: anywhere;

  display: flex;
  align-items: center;
}

.board_lists_list_add-card-button {
  width: 220px;
  height: 28px;

  border-radius: 8px;
  border: 1px solid #E9E9EE;

  color: rgba(0,0,0,0.5);
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.board_lists_list_add-card-button:hover {
  color: #FF7C5C;
}

.board_lists_add-list-button {
  width: 52px;
  height: 28px;

  color: rgba(0,0,0,0.5);
  text-align: center;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  border-radius: 4px;
  background: #F4F5F7;
}
.board_lists_add-list-button:hover {
  color: #FF7C5C;
}
</style>