<script setup lang="ts">
</script>

<template>
  <div class="docs-and-files-page-skeleton">
    <div>
      <div class="flex flex-wrap place-items-center" style="margin-left: 20px; margin-right: 20px; margin-top: 20px;">
        <p class="docs-and-files-page-skeleton_title">Docs & Files</p>
      </div>
      <div class="docs-and-files-page-skeleton_body">
        <ul class="flex flex-wrap gap-2">
          <li v-for="index in 5" :key="index">
            <div class="docs-and-files-page-skeleton_body_element">
              <div class="docs-and-files-page-skeleton_body_element_icon skeleton">
              </div>
              <div class="flex flex-col gap-0.5">
                <div class="docs-and-files-page-skeleton_body_element_name skeleton"></div>
                <div class="docs-and-files-page-skeleton_body_element_updated-at skeleton"></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.docs-and-files-page-skeleton {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  height: 100%;
  background: #FFF;
}

.docs-and-files-page-skeleton_title {
  color: #000;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.docs-and-files-page-skeleton_body {
  margin: 16px 20px 20px;

  flex-grow: 1;
  display: flex;
}

.docs-and-files-page-skeleton_body_element {
  width: 340px;
  height: 74px;
  flex-shrink: 0;

  display: flex;

  border-radius: 8px;
  background: #F4F5F7;

  padding: 16px;
}

.docs-and-files-page-skeleton_body_element_icon {
  width: 42px;
  height: 42px;
  background: #FFF;

  border-radius: 8px;
}
.docs-and-files-page-skeleton_body_element_name {
  width: 219px;
  height: 22px;
  background: #FFF;

  border-radius: 8px;

  margin-left: 12px;
}
.docs-and-files-page-skeleton_body_element_updated-at {
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