<script setup lang="ts">
import { useWorkspacesStore } from "@/WorkspacesStore.ts";
const workspacesStore = useWorkspacesStore();

import {useAuth0} from '@auth0/auth0-vue';
const {getAccessTokenSilently} = useAuth0();

async function loadWorkspaces() {
  const accessToken: string = await getAccessTokenSilently();
  await workspacesStore.loadWorkspaces(accessToken);
}
</script>

<template>
  <main v-if="workspacesStore.isLoading || workspacesStore.isLoadingError" class="workspaces-loading-screen">
    <div v-if="workspacesStore.isLoading" class="workspaces-loading-screen__loading">
      <img src="@/assets/loading.svg" alt="loading">
      <span>Loading workspaces</span>
    </div>
    <div v-if="workspacesStore.isLoadingError" class="workspaces-loading-screen__loading-error">
      <button @click="loadWorkspaces">Retry load workspaces</button>
    </div>
  </main>
</template>

<style scoped>
.workspaces-loading-screen {
  display: grid;
  height: 100%;
  width: 100%;
  place-items: center;
}

.workspaces-loading-screen__loading {
  height: 100%;
  place-items: center;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #7A7A79;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.workspaces-loading-screen__loading-error {
  height: 100%;
  place-items: center;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #7A7A79;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
</style>