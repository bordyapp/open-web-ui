<script setup lang="ts">
import {BoardBreadcrumb, useBoardBreadcrumbsStore} from "@/components/boards/BoardBreadcrumbsStore"
import {WorkspaceElementType} from "@/api/BoardsAndFoldersApi";

const boardBreadcrumbsStore = useBoardBreadcrumbsStore();
function openBreadcrumb(breadcrumb: BoardBreadcrumb) {
  boardBreadcrumbsStore.select(breadcrumb);
}
</script>

<template>
  <div class="board-breadcrumbs">
    <span class="board-breadcrumbs_breadcrumb-name">
      <router-link to="/">Boards</router-link>
    </span>
    <span class="board-breadcrumbs_breadcrumb-divider">/</span>
    <span class="board-breadcrumbs" v-for="(breadcrumb, breadcrumbIndex) in boardBreadcrumbsStore.breadcrumbs">
      <span class="board-breadcrumbs_breadcrumb-name" :class="{'board-breadcrumbs_breadcrumb-name__selected': boardBreadcrumbsStore.selectedBreadcrumb === breadcrumb.id}">
        <span v-if="boardBreadcrumbsStore.selectedBreadcrumb !== breadcrumb.id">
          <router-link v-if="breadcrumb.type === WorkspaceElementType.Folder" :to="{name: 'folder-page', params: {folderId: breadcrumb.id}}" @click="openBreadcrumb(breadcrumb)">
            {{breadcrumb.name}}
          </router-link>
          <router-link v-if="breadcrumb.type === WorkspaceElementType.Board" :to="{name: 'board-page', params: {boardId: breadcrumb.id}}" @click="openBreadcrumb(breadcrumb)">
            {{breadcrumb.name}}
          </router-link>
        </span>
        <span v-else>
          {{breadcrumb.name}}
        </span>
      </span>
      <span class="board-breadcrumbs_breadcrumb-divider" v-if="breadcrumbIndex + 1 !== boardBreadcrumbsStore.breadcrumbs.length">/</span>
    </span>
  </div>
</template>

<style scoped>
.board-breadcrumbs {
  color: #7A7A79;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 114.286% */
}

.board-breadcrumbs_breadcrumb-name:hover {
  color: #FF7C5C;
  cursor: pointer;
}

.board-breadcrumbs_breadcrumb-name__selected {
  color: #000;
}
.board-breadcrumbs_breadcrumb-name__selected:hover {
  color: #000;
  cursor: auto;
}

.board-breadcrumbs_breadcrumb-divider {
  margin-left: 8px;
  margin-right: 8px;
}
</style>