<script setup lang="ts">
import {nextTick, ref} from "vue";
import {BordieApi, CardComment} from "../../../BordieApi";
import {useAuth0} from "@auth0/auth0-vue";
const { getAccessTokenSilently } = useAuth0();

const props = defineProps({
  comment: {
    type: CardComment,
    required: true
  }
});

const isRequestInProcess  = ref<boolean>(false);
const isRequestFailed     = ref<boolean>(false);
const showEditor          = ref<boolean>(false);

const emit = defineEmits<{
  (e: 'hide'): void
  (e: 'delete'): void
}>()

function show() {
  isRequestFailed.value = false;
  showEditor.value      = true;
  nextTick(() => {
    updatedCommentInput.value.focus();
  });
}
function emitHide() {
  showEditor.value = false;
  emit('hide')
}
function emitDelete() {
  emit('delete');
  emitHide();
}

defineExpose({
  show
})

function deleteComment() {
  getAccessTokenSilently().then(token => {
    isRequestInProcess.value = true;
    isRequestFailed.value    = false;

    BordieApi.deleteComment(
        token,
        props.comment?.workspaceId,
        props.comment?.cardId,
        props.comment?.id
    ).then(response => {
      console.log(response);
      emitDelete();
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
  <form v-show="showEditor" class="card-delete-comment" @submit.prevent="deleteComment">
    <div v-if="isRequestInProcess === false" class="card-delete-comment_buttons">
      <button style="float: right" class="card-delete-comment_buttons_delete-button">
        {{ isRequestFailed ? 'Try again' : 'Delete' }}
      </button>
      <button style="float: right" class="card-delete-comment_buttons_close-button" @click="emitHide" type="button">Cancel</button>
    </div>
    <div v-if="isRequestInProcess" style="display: flex; justify-content: center">
      <img style="width: 28px; height: 28px;" src="../../../assets/loading.svg" alt="loading">
    </div>
  </form>
</template>

<style scoped>
.card-delete-comment {
  height: 36px;
  width: 304px;
  border-radius: 8px;
  background: #F7F7F7;

  display: flex;
  flex-direction: column;

  padding: 12px;
  margin-left: 40px;
}

.card-delete-comment_buttons {
  width: 100%;
}

.card-delete-comment_buttons_close-button {
  height: 20px;
  border-radius: 4px;
  background: #F7F7F7;

  padding-left: 16px;
  padding-right: 16px;

  color: #000;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.card-delete-comment_buttons_close-button:hover {
  color: #FF7C5C;
}

.card-delete-comment_buttons_delete-button {
  height: 20px;
  border-radius: 4px;
  background: #F7F7F7;
  border: 1px #FF4545 solid;

  padding-left: 16px;
  padding-right: 16px;

  color: #FF4545;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.card-delete-comment_buttons_delete-button:hover {
  background-color: #FF4545;
  color: #FFFFFF;
}
</style>