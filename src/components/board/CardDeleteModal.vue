<template>
  <transition name="modal-fade">
    <div class="modal-backdrop z-50" v-if="showModal" @click="closeModalOnClick">
      <div class="card-delete-modal">
        <div style="text-align: center">
          <p class="card-delete-modal_title">Delete <span class="card-delete-modal_card-name">{{card?.name}}</span>?</p>
        </div>
        <div v-if="!isRequestInProcess">
          <div style="margin-top: 24px;">
            <button class="card-delete-modal_delete-button" @click="deleteCard">
              {{ isRequestFailed ? 'Try again' : 'Yes'}}, delete this <span class="card-delete-modal_delete-button_card-name">{{card?.name}}</span>
            </button>
          </div>
          <div style="margin-top: 16px; display: flex; justify-content: center">
            <button class="card-delete-modal_close-button" @click="close">Close</button>
          </div>
        </div>
        <div v-if="isRequestInProcess" style="margin-top: 24px; display: flex; justify-content: center">
          <img style="width: 74px; height: 74px;" src="../../assets/loading.svg" alt="loading">
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {BordieApi, Card} from "../../BordieApi";
import {ref} from "vue";
import {useAuth0} from '@auth0/auth0-vue';
import {useWorkspacesStore} from "../../WorkspacesStore";
const workspacesStore = useWorkspacesStore();
const {getAccessTokenSilently} = useAuth0();

const showModal = ref<boolean>(false);
const listIndex = ref<number>();
const cardIndex = ref<number>();
const card = ref<Card>();

function open(_listIndex: number, _cardIndex: number, _card: Card) {
  isRequestInProcess.value = false;
  isRequestFailed.value = false;

  showModal.value = true;

  listIndex.value = _listIndex;
  cardIndex.value = _cardIndex;
  card.value = _card;
}

function close() {
  showModal.value = false;
}

defineExpose({
  open
})

const emit = defineEmits<{
  (e: 'delete', listIndex: number, cardIndex: number): void
}>()

const isRequestInProcess = ref<boolean>(false)
const isRequestFailed    = ref<boolean>(false)
function deleteCard() {
  isRequestFailed.value = false;
  isRequestInProcess.value = true;
  getAccessTokenSilently().then(token => {
    BordieApi.deleteBoardListCard(
        token,
        workspacesStore.selectedWorkspace?.id || "",
        card.value?.boardId,
        card.value?.listId,
        card.value?.id
    ).then(response => {
      isRequestFailed.value = false
      console.log(response)

      emit('delete', listIndex.value, cardIndex.value)
      showModal.value = false
    }).catch(error => {
      console.log(error)
      isRequestFailed.value = true;
    }).finally(
        () => isRequestInProcess.value = false)
  }, error => {
    console.log(error)
    isRequestFailed.value = true;
  }).finally(() => {
    isRequestInProcess.value = false
  })
}

function closeModalOnClick(event: any) {
  if (event?.target?.className === "modal-backdrop z-50" && isRequestInProcess.value === false) {
    close();
  }
}
</script>

<style scoped>
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

.card-delete-modal {
  background-color: #FFFFFF;
  border-radius: 8px;

  padding: 32px 32px 36px;
}
.card-delete-modal_title {
  color: #000000;
  font-size: 16px;
  font-weight: 400;
}
.card-delete-modal_card-name {
  color: #000000;
  font-size: 16px;
  font-weight: 700;
}

.card-delete-modal_delete-button {
  height: 28px;
  min-width: 276px;
  display: flex;
  place-items: center;
  justify-content: center;

  color: #940B00;

  background-color: #FFEDEC;
  border-radius: 8px;
  border: 1px rgba(148, 11, 0, 0.5) solid;

  padding-left: 36px;
  padding-right: 36px;

  font-size: 14px;
  font-weight: 400;
}
.card-delete-modal_delete-button_card-name {
  font-size: 14px;
  font-weight: 700;

  margin-left: 5px;
}
.card-delete-modal_delete-button:hover {
  color: #FF7C5C;
  border: 1px #FF7C5C solid;
}

.card-delete-modal_close-button {
  height: 28px;
  width: 276px;
  place-items: center;
  text-align: center;

  color: #000000;

  border: 1px #E7E7E5 solid;
  border-radius: 8px;

  font-size: 14px;
  font-weight: 400;
}
.card-delete-modal_close-button:hover {
  color: #FF7C5C;
  border: 1px #FF7C5C solid;
}
</style>