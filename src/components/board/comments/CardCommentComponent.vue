<script setup lang="ts">
import {CardComment} from "../../../BordieApi";
import CardEditCommentComponent from "@/components/board/comments/CardEditCommentComponent.vue";
import CardDeleteCommentComponent from "@/components/board/comments/CardDeleteCommentComponent.vue";
import {ref} from "vue";
import {useAuth0} from "@auth0/auth0-vue";
const { user } = useAuth0();

const props = defineProps({
  comment: {
    type: CardComment,
    required: true
  }
});

function formatEditedAt(): string {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const _MS_PER_HOUR = 1000 * 60 * 60;
  const _MS_PER_MINUTE = 1000 * 60;
  // Discard the time and time-zone information.
  const editedAtDate = new Date(props.comment!.editedAt)
  const currentDate = new Date();
  const utc1 = Date.UTC(
      editedAtDate.getFullYear(),
      editedAtDate.getMonth(),
      editedAtDate.getDate(),
      editedAtDate.getHours(),
      editedAtDate.getMinutes(),
  );
  const utc2 = Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes(),
  );
  const daysAgo = Math.floor((utc2 - utc1) / _MS_PER_DAY);
  if (daysAgo > 0) {
    if (daysAgo === 1) {
      return '1 day ago'
    } else {
      return `${daysAgo} days ago`
    }
  }
  const hoursAgo = Math.floor((utc2 - utc1) / _MS_PER_HOUR);
  if (hoursAgo > 0) {
    if (hoursAgo === 1) {
      return '1 hour ago'
    } else {
      return `${hoursAgo} hours ago`
    }
  }
  const minutesAgo = Math.floor((utc2 - utc1) / _MS_PER_MINUTE);
  if (minutesAgo > 0) {
    if (minutesAgo === 1) {
      return '1 minute ago'
    } else {
      return `${minutesAgo} minutes ago`
    }
  }

  return 'recently'
}

const cardEditCommentComponent = ref();
const editMode = ref<boolean>(false);
function showEditor() {
  cardEditCommentComponent.value.show();
  editMode.value = true;
}
function hideEditor() {
  editMode.value = false;
}

const cardDeleteCommentComponent = ref();
const deleteMode = ref<boolean>(false);
function showDelete() {
  cardDeleteCommentComponent.value.show();
  deleteMode.value = true;
}
function hideDelete() {
  deleteMode.value = false;
}

function updateComment(comment: CardComment) {
  props.comment!.text     = comment.text;
  props.comment!.editedAt = comment.editedAt;
}

const emit = defineEmits<{
  (e: 'delete'): void
}>()
function emitDelete() {
  hideDelete();
  emit('delete');
}
</script>

<template>
  <div class="card-comment">
    <div class="card-comment_info">
      <img class="card-comment_info_user-picture rounded-full" :src="comment.creator.picture" alt="user"/>
      <div style="color: #000; font-size: 12px; font-style: normal; font-weight: 400; line-height: normal; opacity: 0.5; flex-grow: 1">
        <b>{{comment.creator.nickname}} ・</b> {{formatEditedAt()}}
      </div>
      <div class="card-comment_buttons" v-show="editMode === false && deleteMode === false && comment.creator.id === user.sub">
        <button class="card-comment_button" type="button" @click="showEditor">Edit</button>
        <button class="card-comment_button" type="button" @click="showDelete">Delete</button>
      </div>
    </div>
    <CardEditCommentComponent v-show="editMode === true && deleteMode === false" ref="cardEditCommentComponent" :comment="comment" @hide="hideEditor" @update="updateComment"/>
    <CardDeleteCommentComponent v-show="editMode === false && deleteMode === true" ref="cardDeleteCommentComponent" :comment="comment" @hide="hideDelete" @delete="emitDelete"/>
    <div class="card-comment_text" v-show="editMode === false && deleteMode === false">
      {{comment.text}}
    </div>
  </div>
</template>

<style scoped>
.card-comment {
  display: flex;
  flex-direction: column;
  gap: 0.5rem/* 8px */;
}

.card-comment_info {
  width: 340px;
  margin-left: 12px;
  display: flex;
  place-items: center;
  gap: 0.5rem/* 8px */;
}
.card-comment_info_user-picture {
  min-height: 19px;
  height: 19px;
  min-width: 19px;
  width: 19px;
  border: 1px #EAEDEE solid;
}

.card-comment_text {
  margin-left: 40px;
  display: flex;
  place-items: center;

  max-width: 304px;
  min-height: 36px;

  padding: 8px 12px;
  border-radius: 8px;
  background: #F7F7F7;

  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.card-comment:hover .card-comment_buttons {
  visibility: visible;
}
.card-comment_buttons {
  display: flex;
  place-items: center;
  gap: 0.5rem/* 8px */;
  visibility: hidden;
}
.card-comment_button {
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.card-comment_button:hover {
  color: #FF7C5C;
}
</style>