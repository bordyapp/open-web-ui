<script lang="ts" setup>
import { useAuth0 } from '@auth0/auth0-vue';
import {useWorkspacesStore} from "@/WorkspacesStore";
import LoadingPage from "@/LoadingPage.vue";
import {watch} from "vue";
import {BordieApi} from "@/BordieApi";
import CreateWorkspacePage from "@/CreateWorkspacePage.vue";

const {isLoading, getAccessTokenSilently, user} = useAuth0();
const workspacesStore = useWorkspacesStore();

function isAppReady(): boolean {
  return !isLoading.value && workspacesStore.loadedWithoutErrors;
}

async function loadWorkspaces() {
  const accessToken: string = await getAccessTokenSilently();
  await workspacesStore.loadWorkspaces(accessToken);
}

watch(() => isLoading.value, async (newValue: boolean, oldValue: boolean, onCleanup) => {
  if (!newValue) {
    await mySelf();
    await loadWorkspaces();
  }
});

async function mySelf() {
  try {
    const accessToken: string = await getAccessTokenSilently();
    await BordieApi.mySelf(
        accessToken, user.value.email || "", user.value.nickname || "", user.value.picture || ""
    );
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
    <LoadingPage v-if="!isAppReady()"/>
    <router-view v-if="isAppReady() && workspacesStore.userWithWorkspaces"/>
    <CreateWorkspacePage v-if="isAppReady() && workspacesStore.userWithoutWorkspaces"/>
</template>

<style scoped>
</style>
