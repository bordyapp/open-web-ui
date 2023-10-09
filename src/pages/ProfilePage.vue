<script setup lang="ts">
import SidebarMenu from "@/components/SidebarMenu.vue";
import {Pages} from "@/components/SidebarMenu";
import { useAuth0 } from '@auth0/auth0-vue';

const { user } = useAuth0();
</script>

<template>
  <main class="profile-page">
    <SidebarMenu :selected-page="Pages.profile"/>
    <div class="flex flex-col grow overflow-auto">
      <div class="profile-page_title">
        Profile
      </div>
      <div class="profile-page_body">
        <div class="profile-page_body_user-photo-section">
          <p class="profile-page_body_user-photo-section_name">Photo</p>
          <img :src="user.picture" class="w-12 h-12 rounded-full" style="margin-top: 9px;"/>
          <button disabled style="margin-top: 12px" class="profile-page_body_user-photo-section_upload-button">Upload photo</button>
        </div>
        <div class="profile-page_body_username-section">
          <p class="profile-page_body_username-section_name">Preferred name</p>
          <input disabled type="text" :placeholder="user.nickname" class="profile-page_body_username-section_name_input" style="margin-top: 9px">
          <br>
          <button disabled style="margin-top: 20px" class="profile-page_body_username-section_update-button">Update</button>
        </div>
        <div class="profile-page_body_password-section">
          <p class="profile-page_body_password-section_name">Password</p>
          <input disabled type="password" placeholder="Current password" style="margin-top: 9px" class="profile-page_body_password-section_password_input">
          <br>
          <input disabled type="password" placeholder="New password" style="margin-top: 16px" class="profile-page_body_password-section_password_input">
          <div style="margin-top: 20px">
            <button disabled class="profile-page_body_password-section_update-button">Save password</button>
          </div>
        </div>
        <div style="margin-top: 32px">
          <p style="color: #000000; font-size: 14px; font-weight: bold; margin-bottom: 12px">Danger zone</p>
          <button disabled style="width: 145px; height: 28px; color: #FF4545; font-size: 14px; border: 1px #FF4545 solid; border-radius: 8px">Delete my profile</button>
        </div>
      </div>
      <hr class="profile-page_divider" style="margin-top: 32px;">
      <div class="flex flex-col flex-grow" style="padding-left: 24px; max-width: 532px; margin-top: 24px; margin-bottom: 79px">
        <ul class="grid grid-cols-2 gap-2" style="color: rgba(0,0,0,0.5); font-size: 14px;">
          <li><a target="_blank" href="https://app.bordy.io/privacy.html">Privacy</a></li>
          <!--                  <li>Legal</li>-->
          <li><a target="_blank" href="https://app.bordy.io/terms.html">Terms</a></li>
          <!--                  <li>Cookie policy</li>-->
        </ul>
        <p style="color: rgba(0,0,0,0.5); font-size: 12px; margin-top: 16px">© {{new Date().getFullYear()}} Bordy, Inc</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #FFF;
}

.profile-page_divider {
  height: 1px;
  flex-shrink: 0;
  width: 100%;

  background: #E9E9EE;
}

.profile-page_title {
  margin: 20px 20px;

  color: #000;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.profile-page_body {
  padding-left: 20px;
  padding-right: 20px;

  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.profile-page_body_user-photo-section {
}

.profile-page_body_user-photo-section_name {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.profile-page_body_user-photo-section_upload-button {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  width: 121px;
  height: 28px;
  flex-shrink: 0;

  border-radius: 8px;
  border: 1px solid #E9E9EE;
  background: #FFF;
}

.profile-page_body_username-section {
  margin-top: 32px;
}

.profile-page_body_username-section_name {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.profile-page_body_username-section_name_input {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  width: 264px;
  height: 36px;
  flex-shrink: 0;

  border-radius: 8px;
  border: 1px solid #E9E9EE;
  background: #FFF;

  padding-left: 16px;
  padding-right: 16px;
}

.profile-page_body_username-section_update-button {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  width: 121px;
  height: 28px;
  flex-shrink: 0;

  border-radius: 8px;
  border: 1px solid #E9E9EE;
  background: #FFF;
}

.profile-page_body_password-section {
  margin-top: 20px;
}

.profile-page_body_password-section_name {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.profile-page_body_password-section_password_input {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  width: 264px;
  height: 36px;
  flex-shrink: 0;

  border-radius: 8px;
  border: 1px solid #E9E9EE;
  background: #FFF;

  padding-left: 16px;
  padding-right: 16px;
}

.profile-page_body_password-section_update-button {
  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  width: 121px;
  height: 28px;
  flex-shrink: 0;

  border-radius: 8px;
  border: 1px solid #E9E9EE;
  background: #FFF;
}
</style>