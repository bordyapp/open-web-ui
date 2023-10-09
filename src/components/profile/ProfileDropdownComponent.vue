<template>
    <div class="account-dropdown">
        <button class="account-button" style="padding-left: 12px; padding-right: 16px">
            <img :src="user.picture" alt="avatar" class="w-4 h-4 rounded-full ring-1 ring-white" style="margin-right: 8px">
            {{ user.nickname }}
        </button>
        <div class="flex account-dropdown-actions">
            <div class="flex place-items-center" style="height: 28px; margin-left: 12px; margin-right: 12px; font-size: 14px; color: rgba(0,0,0,0.5)">
                <img :src="user.picture" alt="avatar" class="w-4 h-4 rounded-full ring-1 ring-white" style="margin-right: 5px">
                {{ user.email }}
            </div>
            <ul>
                <li class="flex account-dropdown-action">
                    <img style="width: 16px; height: 16px" src="../../assets/settings-icon.svg" alt="settings-icon">
                    <router-link :to="{ name: 'settings'}">
                        <button>Settings</button>
                    </router-link>
                </li>
<!--                <li class="flex account-dropdown-action">-->
<!--                    <img style="width: 16px; height: 16px" src="../../assets/upgrade-icon.svg" alt="upgrade-icon">-->
<!--                    <button>Upgrade</button>-->
<!--                </li>-->
<!--                <li class="flex account-dropdown-action">-->
<!--                    <img style="width: 16px; height: 16px" src="../../assets/feature-request-icon.svg" alt="feature-request-icon">-->
<!--                    <button>-->
<!--                        <a href="https://yaffi.canny.io/feature-requests" target="_blank">Feature requests</a>-->
<!--                    </button>-->
<!--                </li>-->
                <li class="flex account-dropdown-action">
                    <img style="width: 14px; height: 14px" src="../../assets/contact-us-icon.svg" alt="contact-us-icon">
                    <button>
                        <a href="mailto:pavelbodyachevskiy@gmail.com?subject=Bordy feedback" target="_blank">Contact us</a>
                    </button>
                </li>
                <li class="flex account-dropdown-action">
                    <img style="width: 14px; height: 14px" src="../../assets/discord-icon.svg" alt="discord">
                    <button>
                        <a href="https://discord.gg/gFAxfmkC" target="_blank">Discord</a>
                    </button>
                </li>
                <li class="flex account-dropdown-action">
                    <img style="width: 16px; height: 16px" src="../../assets/exit-icon.svg" alt="exit-icon">
                    <button @click="exit">Log out</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import {onMounted} from "vue";
import {BordieApi} from "../../BordieApi";
const { logout, user, getAccessTokenSilently } = useAuth0();

function exit() {
    logout({ logoutParams: { returnTo: window.location.origin } });
}

onMounted(() => {
    getAccessTokenSilently().then(token => {
        BordieApi.mySelf(token, user.value.email || "", user.value.nickname || "", user.value.picture || "").then(response => {
            console.log(response)
        }).catch(error => {
            console.log(error)
        }).finally(() => {})
    }, error => {
        console.log("Error: " + error)
    })
})
</script>

<style scoped>
.account-button {
    height: 28px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    font-size: 14px;
    color: #FFF;

    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
}

.account-dropdown {
    position: relative;
}

.account-dropdown-actions {
    background-color: #FFFFFF;
    border: 1px #DEE2E6 solid;
    border-radius: 8px;

    min-width: 308px;

    position: absolute;
    right: 0;
    display: none;
}

.account-dropdown:hover .account-dropdown-actions {
    display: block;
}

.account-dropdown-action {
    padding-left: 12px;
    padding-right: 12px;
    font-size: 14px;

    height: 28px;

    display: flex;
    text-align: center;
    align-items: center;
}
.account-dropdown-action:hover {
    color: #FF7C5C;
    background-color: #EDEDED;
}
.account-dropdown-action img {
    margin-right: 10px;
}
</style>