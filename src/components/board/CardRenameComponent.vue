<script setup lang="ts">
import {nextTick, ref} from "vue";
import {BordieApi, Card, WriteBoardListCardDto} from "@/BordieApi";
import {useAuth0} from "@auth0/auth0-vue";
const { getAccessTokenSilently } = useAuth0();

const props = defineProps({
  card: {
    type: Card,
    required: true
  }
})

const cardNameToChangeTo = ref<string>("");
function discardChanges(event: any) {
  if (isRequestInProcess.value === false) {
    close();
  }
}

function renameCard(name: string) {
  emit('updateEvent', name)
}

const emit = defineEmits<{
  (e: 'closeEvent'): void
  (e: 'updateEvent', name: string): void
}>()

const cardNameInput = ref();
function show() {
  cardNameToChangeTo.value = props.card?.name || "";
  nextTick(() => {
    cardNameInput.value.focus();
  });
}

function close() {
  emit('closeEvent');
}
function closeOnFocusOut(e: any) {
  if (e.relatedTarget === null || e.relatedTarget === undefined) {
    if (isRequestInProcess.value === false) {
      close();
    }
  }
}

defineExpose({
  show
})

const isRequestInProcess = ref<boolean>(false)
const isRequestFailed    = ref<boolean>(false)

function rename() {
  getAccessTokenSilently().then(token => {
    isRequestInProcess.value = true;
    isRequestFailed.value    = false;

    BordieApi.updateBoardListCard(
        token,
        props.card?.workspaceId,
        props.card.boardId,
        props.card.listId,
        props.card?.id,
        new WriteBoardListCardDto(
            cardNameToChangeTo.value,
            props.card?.description,
            props.card?.priority,
            props.card?.status,
            props.card.dueDate,
            props.card?.resources,
            props.card?.labels,
            props.card?.assignees?.map(assignee => assignee.id),
            undefined,
            props.card?.isDone
        )
    ).then(response => {
      console.log(response)
      renameCard(response.data.name)
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
  <div class="card-rename" @focusout="closeOnFocusOut" tabindex="1">
    <form v-show="!isRequestInProcess" @submit.prevent="rename">
      <input required class="card-rename_text-input" type="text" ref="cardNameInput" v-model="cardNameToChangeTo"/>
      <div class="flex gap-2" style="margin-top: 16px; margin-left: 70px; margin-bottom: 16px">
        <button class="card-rename_close-button" type="button" @click="discardChanges">Close</button>
        <button class="card-rename_add-button" type="submit">
          {{ isRequestFailed ? 'Try again' : 'Rename' }}
        </button>
      </div>
    </form>
    <img v-show="isRequestInProcess" style="width: 24px; height: 24px;" src="@/assets/loading.svg" alt="loading">
  </div>
</template>

<style scoped>
.card-rename {
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

.card-rename_text-input {
  width: 100%;
  padding-left: 8px;
  padding-right: 8px;
}

.card-rename_text-input {
  width: 100%;

  outline: none;

  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.card-rename_close-button {
  height: 20px;

  border-radius: 4px;
  background: #F7F7F7;

  color: #000;
  font-family: Manrope;
  font-size: 10px;  font-style: normal;
  font-weight: 400;
  line-height: normal;

  padding-left: 12px;
  padding-right: 12px;
}
.card-rename_close-button:hover {
  color: #FF7C5C;
}

.card-rename_add-button {
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
.card-rename_add-button:hover {
  color: #FF7C5C;
}
</style>