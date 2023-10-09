<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
const { getAccessTokenSilently } = useAuth0();
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router"
import {BordieApi} from "./BordieApi";

const router = useRouter()

const requestInProgress = ref<boolean>(false);
const requestError = ref<boolean>(false);

const props = defineProps({
    token: {
        type: String,
        required: true
    }
})

onMounted(() => {
    requestInProgress.value = true;

    getAccessTokenSilently().then(token => {
        BordieApi.acceptWorkspaceInvite(
            token,
            props.token || ""
        ).then(response => {
            console.log(response)

            router.push({ name: 'home' })
        }).catch(error => {
            requestError.value = true;
        }).finally(() => requestInProgress.value = false)
    }, error => {
        console.log("Error: " + error)
        requestError.value = true;
    })
})
</script>

<template>
  <div v-if="requestInProgress" class="grid h-screen place-items-center">
      <img src="./assets/loading.svg" alt="loading">
  </div>
    <div v-if="requestError" class="grid h-screen place-items-center">
        Can't accept the invitation - already taken, doesn't exist, or belongs to another user
    </div>
</template>

<style scoped>

</style>