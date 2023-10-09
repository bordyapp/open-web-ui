<script setup lang="ts">
import {useAuth0} from "@auth0/auth0-vue";
import {nextTick, onMounted, ref} from "vue";
import {BordieApi, CardComment} from "../../../BordieApi";
import CardCommentComponent from "@/components/board/comments/CardCommentComponent.vue";

const { getAccessTokenSilently, user } = useAuth0();

const isShowInput = ref<boolean>(false);
function showInput() {
  isShowInput.value = true;
  comment.value     = "";
  nextTick(() => {
    commentInput.value.focus();
  });
}
function hideInput() {
  isShowInput.value = false;
}

const commentInput = ref();
const comment      = ref<string>("");

const props = defineProps({
  cardId: {
    type: String,
    required: true
  },
  workspaceId: {
    type: String,
    required: true
  }
});

onMounted(() => {
  getComments();
})

const isLoadingComments      = ref<boolean>(false)
const isLoadingCommentsError = ref<boolean>(false)
const comments               = ref<CardComment[]>([]);
function getComments() {
  getAccessTokenSilently().then(token => {
    isLoadingComments.value = true;
    isLoadingCommentsError.value    = false;

    BordieApi.getComments(
        token,
        props.workspaceId,
        props.cardId,
    ).then(response => {
      console.log(response)
      comments.value = response.data
    }).catch(error => {
      console.log(error)
      isLoadingCommentsError.value = true;
    }).finally(
        () => isLoadingComments.value = false
    )
  }, error => {
    console.log(error)
  })
}

const isRequestInProcess = ref<boolean>(false)
const isRequestFailed    = ref<boolean>(false)
function writeComment() {
  getAccessTokenSilently().then(token => {
    isRequestInProcess.value = true;
    isRequestFailed.value    = false;

    BordieApi.writeComment(
        token,
        props.workspaceId,
        props.cardId,
        comment.value
    ).then(response => {
      console.log(response)
      comments.value.push(response.data)
      comment.value = "";
      addComment();
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

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'create'): void
}>()
function removeComment(index: number) {
  comments.value?.splice(index, 1);
  emit('delete');
}
function addComment() {
  emit('create');
}
</script>

<template>
  <div class="card-comments" style="margin-top: 24px">
    <p class="card-comments_section-name">Comments</p>
    <div v-if="isLoadingComments" style="padding-top: 12px; padding-bottom: 12px">
      <img style="width: 64px; height: 64px;" src="../../../assets/loading.svg" alt="loading">
    </div>
    <div v-if="isLoadingCommentsError" style="font-size: 14px;">
      Can't load comments
    </div>
    <div v-if="isLoadingComments === false && isLoadingCommentsError === false" style="padding-top: 12px; padding-bottom: 12px">
      <!-- input -->
      <div v-show="isShowInput === false" class="card-comments_text-input-placeholder" @click="showInput">
        <img class="card-comments_text-input-placeholder_user-picture" :src="user.picture" alt="user"/>
        <p class="card-comments_text-input-placeholder_text">Write a comment...</p>
      </div>
      <form v-show="isShowInput" class="card-comments_text-input" @submit.prevent="writeComment">
        <textarea required v-model="comment" ref="commentInput"  class="card-comments_text-input_text-input" placeholder="Write a comment..."/>
        <div v-if="isRequestInProcess === false" class="card-comments_text-input_controls">
          <button style="float: right" class="card-comments_text-input_controls_post-button">
            {{ isRequestFailed ? 'Try again' : 'Post' }}
          </button>
          <button style="float: right" class="card-comments_text-input_controls_close-button" @click="hideInput" type="button">Cancel</button>
        </div>
        <div v-if="isRequestInProcess" style="display: flex; justify-content: center">
          <img style="width: 64px; height: 64px;" src="../../../assets/loading.svg" alt="loading">
        </div>
      </form>
      <!-- Comments -->
      <div style="width: 100%; margin-top: 20px; display: flex; flex-direction: column; gap: 0.5rem">
        <CardCommentComponent v-for="(comment, commentIndex) in comments" :comment="comment" @delete="removeComment(commentIndex)"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-comments_section-name {
  color: rgba(0, 0, 0, 0.50);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.card-comments_text-input-placeholder {
  width: 100%;
  border-radius: 8px;
  background: #F7F7F7;
  height: 36px;
  display: flex;
  place-items: center;
  gap: 0.5rem/* 8px */;
  padding-left: 12px;
  padding-right: 12px;
}
.card-comments_text-input-placeholder_user-picture {
  border-radius: 9999px;
  min-height: 19px;
  height: 19px;
  min-width: 19px;
  width: 19px;
  border: 1px #EAEDEE solid;
}
.card-comments_text-input-placeholder_text {
  color: #000;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  opacity: 0.30000001192092896;
}

.card-comments_text-input {
  height: 113px;
  width: 100%;
  border-radius: 8px;
  background: #F7F7F7;

  display: flex;
  flex-direction: column;

  padding: 12px;
}
.card-comments_text-input_text-input {
  color: #000;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  flex-grow: 1;

  background-color: #F7F7F7;
  outline: none;
}

.card-comments_text-input_controls {
  width: 100%;
  padding-top: 20px;
}
.card-comments_text-input_controls_close-button {
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
.card-comments_text-input_controls_close-button:hover {
  color: #FF7C5C;
}
.card-comments_text-input_controls_post-button {
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
.card-comments_text-input_controls_post-button:hover {
  color: #FF7C5C;
}
</style>