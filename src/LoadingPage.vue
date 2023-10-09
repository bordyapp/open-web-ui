<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import {useWorkspacesStore} from "@/WorkspacesStore";

const { isLoading, getAccessTokenSilently } = useAuth0();
const workspacesStore = useWorkspacesStore();

async function loadWorkspaces() {
  const accessToken: string = await getAccessTokenSilently();
  await workspacesStore.loadWorkspaces(accessToken);
}
</script>

<template>
<main class="loading-page">
  <div v-if="isLoading" class="loading-page__loading">
    <img src="@/assets/loading.svg" alt="loading">
    <span class="loading-page__loading_text">Logging in</span>
  </div>
  <div v-if="isLoading === false && (workspacesStore.isLoading || workspacesStore.isLoadingError)" class="loading-page__loading">
    <div v-if="workspacesStore.isLoading" class="loading-page__loading">
      <img src="@/assets/loading.svg" alt="loading">
      <span class="loading-page__loading_text">Loading workspaces</span>
    </div>
    <div v-if="workspacesStore.isLoadingError" class="loading-page__loading">
      <button @click="loadWorkspaces" class="loading-page__loading_text">Retry load workspaces</button>
    </div>
  </div>
</main>
</template>

<style scoped>
.loading-page {
  height: 100%;
  width: 100%;
  place-items: center;

  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-page__loading {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  place-items: center;
  justify-content: center;
  align-items: center;
}

.loading-page__loading_text {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 114.286% */
}
</style>