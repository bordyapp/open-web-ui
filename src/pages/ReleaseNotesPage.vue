<script setup lang="ts">
import SidebarMenu from "@/components/SidebarMenu.vue";
import {Pages} from "@/components/SidebarMenu";
import { useAuth0 } from '@auth0/auth0-vue';

const { user } = useAuth0();
</script>

<template>
  <main class="release-notes-page">
    <SidebarMenu :selected-page="Pages.release_notes"/>
    <div class="flex flex-col grow overflow-auto">
      <div class="release-notes-page_title">
        Release notes
      </div>
      <div class="release-notes-page_body">
        <div class="release-notes-page_body_release-notes">
          <div class="release-notes-page_body_release-notes_release-note">
            <p class="release-notes-page_body_release-notes_release-note_name grow">2.0 (<span class="release-notes-page_body_release-notes_release-note_date">13.08.2023</span>)</p>
            <button class="release-notes-page_body_release-notes_release-note_details-button">
              <a href="https://medium.com/@bordyapp/bordy-2-0-95c1036d8b6f" target="_blank">Open on Medium</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.release-notes-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #FFF;
}

.release-notes-page_title {
  margin: 20px 20px;

  color: #000;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.release-notes-page_body {
  padding-left: 20px;
  padding-right: 20px;

  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.release-notes-page_body_release-notes {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.release-notes-page_body_release-notes_release-note {
  height: 60px;

  display: flex;
  place-items: center;

  background: #FFF;
  box-shadow: 0 1px 0 0 #E9E9EE;
}

.release-notes-page_body_release-notes_release-note_name {
  color: #000;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px; /* 100% */
}

.release-notes-page_body_release-notes_release-note_date {
  color: rgba(0, 0, 0, 0.50);
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
}

.release-notes-page_body_release-notes_release-note_details-button {
  width: 143px;
  height: 36px;
  flex-shrink: 0;

  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  border-radius: 4px;
  border: 1px solid #E9E9EE;
  background: #FFF;
}
.release-notes-page_body_release-notes_release-note_details-button:hover {
  color: #FF7C5C;
}
</style>