<script setup lang="ts">
</script>

<template>
  <div class="boards-page-skeleton">
    <div>
      <div class="flex flex-wrap place-items-center" style="margin-left: 20px; margin-right: 20px; margin-top: 20px;">
        <p class="boards-page-skeleton_title">Boards</p>
      </div>
      <div class="boards-page-skeleton_body">
        <ul class="flex flex-wrap gap-2">
          <li v-for="index in 5" :key="index">
            <div class="boards-page-skeleton_body_element">
              <div class="boards-page-skeleton_body_element_icon skeleton">
              </div>
              <div class="flex flex-col gap-0.5">
                <div class="boards-page-skeleton_body_element_name skeleton"></div>
                <div class="boards-page-skeleton_body_element_updated-at skeleton"></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.boards-page-skeleton {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  height: 100%;
  background: #FFF;
}

.boards-page-skeleton_title {
  color: #000;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.boards-page-skeleton_body {
  margin: 16px 20px 20px;

  flex-grow: 1;
  display: flex;
}

.boards-page-skeleton_body_element {
  width: 340px;
  height: 74px;
  flex-shrink: 0;

  display: flex;

  border-radius: 8px;
  background: #F4F5F7;

  padding: 16px;
}

.boards-page-skeleton_body_element_icon {
  width: 42px;
  height: 42px;
  background: #FFF;

  border-radius: 8px;
}
.boards-page-skeleton_body_element_name {
  width: 219px;
  height: 22px;
  background: #FFF;

  border-radius: 8px;

  margin-left: 12px;
}
.boards-page-skeleton_body_element_updated-at {
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