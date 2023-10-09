<template>
  <div class="list-modal_backdrop z-50" v-if="showModal" @click="closeModalOnClick">
    <form class="list-modal" @submit.prevent="saveList">
      <div class="list-modal_header">
        <div></div>
        <div class="justify-self-center">
          <p class="list-modal_header_title">Rename list</p>
        </div>
        <div class="justify-self-end" style="margin-right: 15px">
          <button v-if="!isRequestInProcess" class="list-modal_form_save-button">
            {{ isRequestFailed ? 'Try again' : 'Save' }}
          </button>
          <div v-if="isRequestInProcess" style="display: flex; justify-content: center">
            <img style="width: 28px; height: 28px;" src="../../assets/loading.svg" alt="loading">
          </div>
        </div>
      </div>
      <hr/>
      <div class="list-modal_form">
        <input class="list-modal_form_text-input" v-model="listName" required type="text" placeholder="Name"/>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import { useAuth0 } from '@auth0/auth0-vue';
const { getAccessTokenSilently } = useAuth0();
import {BordieApi, List, ListResource} from "@/BordieApi";

import { useWorkspacesStore } from "@/WorkspacesStore";
const workspacesStore = useWorkspacesStore();

let isCreateOperation: boolean = false
let isDeleteOperation = ref<boolean>(false)
const showModal       = ref<boolean>(false)

let listIndex: number = -1
let boardId: string = ""
let listId: string | undefined  = undefined
const listName        = ref<string>("")
const listResources   = ref<ListResource[]>([])

const isRequestInProcess = ref<boolean>(false)
const isRequestFailed    = ref<boolean>(false)

function open(_boardId: string, _listIndex: number, list?: List) {
    isCreateOperation = list === undefined
    boardId = _boardId
    listId  = list?.id

    if (isCreateOperation) {
        listName.value = ""
        listResources.value = []
    } else {
        listName.value = list!.name.slice()
        listResources.value = []
        list!.resources.forEach(resource => {
            listResources.value.push(new ListResource(resource.name, resource.capacity))
        })
    }

    listIndex = _listIndex;
    isDeleteOperation.value = false;
    isRequestFailed.value = false;
    showModal.value = true
}

function close() {
    showModal.value = false
}

const emit = defineEmits<{
    (e: 'save', isCreateOperation: boolean, periodIndex: number, list: List): void
    (e: 'delete', listIndex: number): void
}>()

function saveList() {
    isRequestFailed.value = false;
    isRequestInProcess.value = true;
    getAccessTokenSilently().then(token => {
        let requestFuture;
        if (isCreateOperation) {
            requestFuture = BordieApi.createBoardList(
                token,
                workspacesStore.selectedWorkspace?.id || "",
                boardId,
                listName.value,
                listResources.value
            )
        } else {
            requestFuture = BordieApi.updateBoardList(
                token,
                workspacesStore.selectedWorkspace?.id || "",
                boardId,
                listId || "",
                listName.value,
                listResources.value
            )
        }
        requestFuture.then(response => {
            isRequestFailed.value = false
            console.log(response)

            emit('save', isCreateOperation, listIndex, response.data as List)
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

function closeModalOnClick(event: any) {
  if (event?.target?.className === "list-modal_backdrop z-50" && isRequestInProcess.value === false) {
    close();
  }
}
</script>

<style scoped>
.list-modal_backdrop {
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

.list-modal {
  background: #FFFFFF;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  width: 652px;
}

.list-modal_header {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  justify-items: stretch;
  padding-top: 13px;
  padding-bottom: 13px
}
.list-modal_header_title {
  color: #000;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.list-modal_form {
  display: grid;
  justify-content: center;
  padding: 16px 24px 42px;
}
.list-modal_form_text-input {
  width: 588px;
  height: 36px;
  border: #E7E7E5 1px solid;
  border-radius: 8px;
  padding-left: 16px
}

.list-modal_form_save-button {
  height: 28px;
  border-radius: 8px;
  border: 1px solid #E7E7E5;
  background: #FFF;
  padding-left: 16px;
  padding-right: 16px;

  color: #000;
  text-align: right;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.list-modal_form_save-button:hover {
  color: #FF7C5C;
}
</style>