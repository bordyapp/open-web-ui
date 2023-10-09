<script setup lang="ts">
import {inject, nextTick, ref} from "vue";
import {BordieApi, List} from "@/BordieApi";
import {useAuth0} from "@auth0/auth0-vue";
import {WorkspaceElement} from "@/api/BoardsAndFoldersApi";

const { getAccessTokenSilently, user } = useAuth0();

const props = defineProps({
  board: {
    type: WorkspaceElement,
    required: true
  }
})

const listName = ref<string>("");
function createList(list: List) {
  listName.value = "";
  props.board?.lists?.push(list);
  nextTick(() => {
    listNameInput.value.focus();
  });
}

const isShow        = ref<boolean>(false);
const listNameInput = ref();
function show() {
  listName.value = "";
  isShow.value = true;
  nextTick(() => {
    listNameInput.value.focus();
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

    BordieApi.createBoardList(
        token,
        props.board?.workspaceId,
        props.board?.id,
        listName.value,
        []
    ).then(response => {
      console.log(response)
      createList(response.data)
      mixpanel.track('create_list', {
          "list_id": response.data?.id || null,
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
  <div v-if="isShow" class="list-quick-create" @focusout="closeOnFocusOut" tabindex="1" draggable="true" ondragstart="event.preventDefault(); event.stopPropagation();">
    <form v-show="!isRequestInProcess" @submit.prevent="create">
      <input required class="list-quick-create_text-input" ref="listNameInput" type="text" placeholder="Type a name..." v-model="listName"/>
      <div class="flex gap-2" style="margin-top: 29px; margin-left: 87px; margin-bottom: 16px">
        <button class="list-quick-create_close-button" type="button" @click="close">Close</button>
        <button class="list-quick-create_add-button" type="submit">
          {{ isRequestFailed ? 'Try again' : 'Add list' }}
        </button>
      </div>
    </form>
    <div class="grid place-items-center">
      <img v-show="isRequestInProcess" style="width: 48px; height: 48px;" src="@/assets/loading.svg" alt="loading">
    </div>
  </div>
</template>

<style scoped>
.list-quick-create {
  min-width: 237px;
  max-width: 237px;
  width: 237px;

  min-height: 95px;
  max-height: 95px;
  height: 95px;
  background: #F4F5F7;

  border-radius: 8px;
  padding: 10px 12px;
}

.list-quick-create_text-input {
  width: 100%;

  outline: none;

  color: #000;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  background: transparent;
}

.list-quick-create_close-button {
  height: 20px;

  border-radius: 4px;
  background: #E9E9EE;

  color: #000;
  font-family: Manrope;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  padding-left: 12px;
  padding-right: 12px;
}
.list-quick-create_close-button:hover {
  color: #FF7C5C;
}

.list-quick-create_add-button {
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
.list-quick-create_add-button:hover {
  color: #FF7C5C;
}
</style>