<script setup lang="ts">
</script>

<template>
  <div class="my-tasks-page-skeleton">
    <div>
      <div class="flex flex-wrap place-items-center" style="margin-left: 20px; margin-right: 20px; margin-top: 20px;">
        <p class="my-tasks-page-skeleton_title">My tasks</p>
      </div>
      <div class="my-tasks-page-skeleton_body">
        <div class="my-tasks-page-skeleton_body_tasks_mode-switch">
          <button disabled class="my-tasks-page-skeleton_body_tasks_mode-switch_button my-tasks-page-skeleton_body_tasks_mode-switch_button__selected">Assigned</button>
          <button disabled class="my-tasks-page-skeleton_body_tasks_mode-switch_button">Created</button>
        </div>
        <div style="margin-top: 21px;">
          <div class="my-tasks-page-skeleton_body_tasks">
            <div class="my-tasks-page-skeleton_body_tasks_group-name skeleton"></div>
          </div>
          <div class="my-tasks-page-skeleton_body_tasks_task" v-for="index in 5">
            <div class="my-tasks-page-skeleton_body_tasks_task_content skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-tasks-page-skeleton {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  height: 100%;
  background: #FFF;
}

.my-tasks-page-skeleton_title {
  color: #000;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.my-tasks-page-skeleton_body {
  margin-top: 20px;
  margin-bottom: 20px;

  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.my-tasks-page-skeleton_body_tasks_mode-switch {
  display: flex;
  height: 28px;

  margin-left: 16px;

  background-color: #F3F3F2;
  border: 1px #E7E7E5 solid;
  border-radius: 8px;
  width: fit-content;
}
.my-tasks-page-skeleton_body_tasks_mode-switch_button {
  color: rgb(0, 0, 0, 0.5);
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  padding-left: 16px;
  padding-right: 16px
}
.my-tasks-page-skeleton_body_tasks_mode-switch_button__selected {
  color: #000;
  background-color: #FFFFFF;
  border: 1px #E7E7E5 solid;
  border-radius: 8px;
}

.my-tasks-page-skeleton_body_tasks {
  display: flex;
  place-items: center;

  height: 32px;
  background-color: rgba(233, 233, 238, 0.5);
}
.my-tasks-page-skeleton_body_tasks_group-name {
  height: 17px;
  width: 40%;
  margin-left: 11px;
  margin-right: 17px;

  background: #FFF;
  border-radius: 8px;
}
.my-tasks-page-skeleton_body_tasks_task {
  display: flex;
  flex-wrap: wrap;
  place-items: center;

  height: 40px;
  padding-left: 11px;
  padding-right: 16px;
  border-bottom: 1px solid #E7E7E5;
  background: #F4F5F7;
}
.my-tasks-page-skeleton_body_tasks_task_content {
  height: 17px;
  width: 100%;

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