<script setup lang="ts">
</script>

<template>
  <div class="folder-page-skeleton">
    <div class="flex flex-col gap-0.5" style="margin-left: 20px; margin-right: 20px; margin-top: 20px; background-color: #F4F5F7; border-radius: 8px; padding: 1px">
      <div class="folder-page-skeleton_breadcrumbs skeleton"></div>
      <div class="folder-page-skeleton_board-name skeleton"></div>
    </div>
    <div class="folder-page-skeleton_body">
      <ul class="flex flex-wrap gap-2">
        <li v-for="index in 5" :key="index">
          <div class="folder-page-skeleton_body_element">
            <div class="folder-page-skeleton_body_element_icon skeleton">
            </div>
            <div class="flex flex-col gap-0.5">
              <div class="folder-page-skeleton_body_element_name skeleton"></div>
              <div class="folder-page-skeleton_body_element_updated-at skeleton"></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.folder-page-skeleton {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  height: 100%;
  background: #FFF;
}

.folder-page-skeleton_breadcrumbs {
  height: 14px;
  width: 149px;

  background: #FFF;
  border-radius: 8px;
}
.folder-page-skeleton_board-name {
  height: 31px;
  width: 89px;

  background: #FFF;
  border-radius: 8px;
}

.folder-page-skeleton_body {
  margin: 16px 20px 20px;
}

.folder-page-skeleton_body_element {
  width: 340px;
  height: 74px;
  flex-shrink: 0;

  display: flex;

  border-radius: 8px;
  background: #F4F5F7;

  padding: 16px;
}

.folder-page-skeleton_body_element_icon {
  width: 42px;
  height: 42px;
  background: #FFF;

  border-radius: 8px;
}
.folder-page-skeleton_body_element_name {
  width: 219px;
  height: 22px;
  background: #FFF;

  border-radius: 8px;

  margin-left: 12px;
}
.folder-page-skeleton_body_element_updated-at {
  width: 64px;
  height: 17px;
  background: #FFF;

  border-radius: 8px;

  margin-left: 12px;
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