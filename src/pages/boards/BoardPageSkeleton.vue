<script setup lang="ts">
</script>

<template>
  <div class="board-page-skeleton">
    <div class="flex flex-col gap-0.5" style="margin-left: 20px; margin-right: 20px; margin-top: 20px; background-color: #F4F5F7; border-radius: 8px; padding: 1px">
      <div class="board-page-skeleton_breadcrumbs skeleton"></div>
      <div class="board-page-skeleton_board-name skeleton"></div>
    </div>
    <div class="board-page-skeleton_body">
      <div class="board-page-skeleton_body_lists">
        <div v-for="index in 3" class="board-page-skeleton_body_lists_list">
          <div class="board-page-skeleton_body_lists_list_name skeleton"></div>
          <div class="board-page-skeleton_body_lists_cards">
            <div v-for="index in 5" class="board-page-skeleton_body_lists_cards_card skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-page-skeleton {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  height: 100%;
  background: #FFF;
}

.board-page-skeleton_breadcrumbs {
  height: 14px;
  width: 149px;

  background: #FFF;
  border-radius: 8px;
}
.board-page-skeleton_board-name {
  height: 31px;
  width: 89px;

  background: #FFF;
  border-radius: 8px;
}

.board-page-skeleton_body {
  padding: 20px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
}
.board-page-skeleton_body_tags {
  height: 34px;
  width: 100%;

  background: #F4F5F7;
  border-radius: 8px;
}

.board-page-skeleton_body_lists {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 16px;
}
.board-page-skeleton_body_lists_list {
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
.board-page-skeleton_body_lists_list_name {
  width: 70%;
  height: 22px;

  background: #FFF;
  border-radius: 8px;

  margin-bottom: 8px;
}
.board-page-skeleton_body_lists_cards {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem/* 8px */;
}
.board-page-skeleton_body_lists_cards_card {
  width: 100%;
  height: 66px;

  background: #FFF;
  border-radius: 8px;
}

.skeleton {
  animation: skeleton-loading 1s linear infinite alternate;
}
@keyframes skeleton-loading {
  0% {
    background-color: #FFF;
  }
  100% {
    background-color: #FBFBFD;
  }
}
</style>