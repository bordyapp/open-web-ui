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
const updatedComment      = ref<string>("");
const updatedCommentInput = ref();

const emit = defineEmits<{
  (e: 'hide'): void
  (e: 'update', comment: CardComment): void
}>()

function show() {
  isRequestFailed.value = false;
  updatedComment.value  = props.comment?.text || "";
  showEditor.value      = true;
  nextTick(() => {
    updatedCommentInput.value.focus();
  });
}
function hide() {
  showEditor.value = false;
  emit('hide')
}
function update(comment: CardComment) {
  emit('update', comment);
  hide();
}

defineExpose({
  show,
  hide
})

function updateComment() {
  getAccessTokenSilently().then(token => {
    isRequestInProcess.value = true;
    isRequestFailed.value    = false;

    BordieApi.updateComment(
        token,
        props.comment?.workspaceId,
        props.comment?.cardId,
        props.comment?.id,
        updatedComment.value
    ).then(response => {
      console.log(response)
      update(response.data);
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
  <form v-show="showEditor" class="card-edit-comment_text-input" @submit.prevent="updateComment">
    <textarea required v-model="updatedComment" ref="updatedCommentInput"  class="card-edit-comment_text-input_text-input" placeholder="Write a comment..."/>
    <div v-if="isRequestInProcess === false" class="card-edit-comment_text-input_controls">
      <button style="float: right" class="card-edit-comment_text-input_controls_post-button">
        {{ isRequestFailed ? 'Try again' : 'Post' }}
      </button>
      <button style="float: right" class="card-edit-comment_text-input_controls_close-button" @click="hide" type="button">Cancel</button>
    </div>
    <div v-if="isRequestInProcess" style="display: flex; justify-content: center">
      <img style="width: 64px; height: 64px;" src="../../../assets/loading.svg" alt="loading">
    </div>
  </form>
</template>

<style scoped>
.card-edit-comment_text-input {
  height: 113px;
  width: 100%;
  border-radius: 8px;
  background: #F7F7F7;

  display: flex;
  flex-direction: column;

  padding: 12px;
}
.card-edit-comment_text-input_text-input {
  color: #000;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  flex-grow: 1;

  background-color: #F7F7F7;
  outline: none;
}

.card-edit-comment_text-input_controls {
  width: 100%;
  padding-top: 20px;
}
.card-edit-comment_text-input_controls_close-button {
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
.card-edit-comment_text-input_controls_close-button:hover {
  color: #FF7C5C;
}
.card-edit-comment_text-input_controls_post-button {
  height: 20px;
  border-radius: 4px;
  border: 1px solid #E7E7E5;
  background: #FFF;

  padding-left: 16px;
  padding-right: 16px;

  color: #000;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.card-edit-comment_text-input_controls_post-button:hover {
  color: #FF7C5C;
}
</style>