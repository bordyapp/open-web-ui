<script setup lang="ts">
import {inject, nextTick, ref} from "vue";
import {BordieApi, Card, CardPriority, CardStatus, List, WriteBoardListCardDto} from "../../BordieApi";
import {useAuth0} from "@auth0/auth0-vue";

const { getAccessTokenSilently, user } = useAuth0();

const props = defineProps({
  list: {
    type: List,
    required: true
  }
})

const cardName = ref<string>("");
function createCard(card: Card) {
  cardName.value = "";
  props.list?.cards?.push(card);
  nextTick(() => {
    cardNameInput.value.focus();
  });
}

const isShow        = ref<boolean>(false);
const cardNameInput = ref();
function show() {
  cardName.value = "";
  isShow.value = true;
  nextTick(() => {
    cardNameInput.value.focus();
  });
}

function close() {
  isShow.value = false;
}
function closeOnFocusOut(e: any) {
  if (e.relatedTarget === null || e.relatedTarget === undefined) {
    if (isRequestInProcess.value === false) {
      close();
    }
  }
}

defineExpose({
  show,
  close
})

const isRequestInProcess = ref<boolean>(false)
const isRequestFailed    = ref<boolean>(false)

const mixpanel = inject('mixpanel');

function create() {
  getAccessTokenSilently().then(token => {
    isRequestInProcess.value = true;
    isRequestFailed.value    = false;

    BordieApi.createBoardListCard(
        token,
        props.list?.workspaceId,
        props.list.boardId,
        props.list.id,
        new WriteBoardListCardDto(
            cardName.value,
            "",
            CardPriority.NO_PRIORITY,
            CardStatus.NOT_STARTED,
            undefined,
            [],
            [],
            [],
            undefined,
            false
        )
    ).then(response => {
      console.log(response)
      createCard(response.data)
      mixpanel.track('create_card', {
          "card_id": response.data?.id || null,
          "workspace_id": response.data?.workspaceId || null,
          "user_id": user.value?.sub || null
      })
    }).catch(error => {
      console.log(error)
      isRequestFailed.value = true;
    }).finally(
        () => isRequestInProcess.value = false
    )
  }, error => {
    console.log(error)
  })
}
</script>

<template>
  <div v-if="isShow" class="card-quick-create" @focusout="closeOnFocusOut" tabindex="1" draggable="true" ondragstart="event.preventDefault(); event.stopPropagation();">
    <form v-show="!isRequestInProcess" @submit.prevent="create">
      <input required class="card-quick-create_text-input" ref="cardNameInput" type="text" placeholder="Type a name..." v-model="cardName"/>
      <div class="flex gap-2" style="margin-top: 16px; margin-left: 70px; margin-bottom: 16px">
        <button class="card-quick-create_close-button" type="button" @click="close">Close</button>
        <button class="card-quick-create_add-button" type="submit">
          {{ isRequestFailed ? 'Try again' : 'Add card' }}
        </button>
      </div>
    </form>
    <div class="grid place-items-center">
      <img v-show="isRequestInProcess" style="width: 48px; height: 48px;" src="@/assets/loading.svg" alt="loading">
    </div>
  </div>
</template>

<style scoped>
.card-quick-create {
  min-width: 220px;
  max-width: 220px;
  width: 220px;

  min-height: 82px;
  max-height: 82px;
  height: 82px;
  background-color: #FFFFFF;

  margin-top: 8px;

  border-radius: 12px;
  padding: 10px 12px;

  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.04));
}

.card-quick-create_text-input {
  width: 100%;

  outline: none;

  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.card-quick-create_close-button {
  height: 20px;

  border-radius: 4px;
  background: #F7F7F7;

  color: #000;
  font-family: Manrope;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  padding-left: 12px;
  padding-right: 12px;
}
.card-quick-create_close-button:hover {
  color: #FF7C5C;
}

.card-quick-create_add-button {
  height: 20px;

  border-radius: 4px;
  border: 1px solid #E7E7E5;
  background: #FFF;

  color: #000;
  font-family: Manrope;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  padding-left: 12px;
  padding-right: 12px;
}
.card-quick-create_add-button:hover {
  color: #FF7C5C;
}
</style>