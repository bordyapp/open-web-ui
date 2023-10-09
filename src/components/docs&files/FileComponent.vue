<script setup lang="ts">
import {File, FileType} from "@/api/DocsAndFilesApi";

const props = defineProps({
  file: {
    type: File,
    required: true
  },
  fileIndex: {
    type: Number,
    required: true
  }
})

function editedAt(): string {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const _MS_PER_HOUR = 1000 * 60 * 60;
  const _MS_PER_MINUTE = 1000 * 60;
  // Discard the time and time-zone information.
  const editedAtDate = new Date(props.file!.editedAt)
  const currentDate = new Date();
  const utc1 = Date.UTC(
      editedAtDate.getFullYear(),
      editedAtDate.getMonth(),
      editedAtDate.getDate(),
      editedAtDate.getHours(),
      editedAtDate.getMinutes(),
  );
  const utc2 = Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes(),
  );
  const daysAgo = Math.floor((utc2 - utc1) / _MS_PER_DAY);
  if (daysAgo > 0) {
    if (daysAgo === 1) {
      return '1 day ago'
    } else {
      return `${daysAgo} days ago`
    }
  }
  const hoursAgo = Math.floor((utc2 - utc1) / _MS_PER_HOUR);
  if (hoursAgo > 0) {
    if (hoursAgo === 1) {
      return '1 hour ago'
    } else {
      return `${hoursAgo} hours ago`
    }
  }
  const minutesAgo = Math.floor((utc2 - utc1) / _MS_PER_MINUTE);
  if (minutesAgo > 0) {
    if (minutesAgo === 1) {
      return '1 minute ago'
    } else {
      return `${minutesAgo} minutes ago`
    }
  }

  return 'recently'
}

const emit = defineEmits<{
  (e: 'editEvent'): void
  (e: 'deleteEvent'): void
}>()
function emitEditEvent() {
  emit('editEvent')
}

function emitDeleteEvent() {
  emit('deleteEvent')
}

import folderIcon from "@/assets/file-icons/Folder.svg";
import linkIcon from "@/assets/file-icons/Link.svg";
import figmaIcon from "@/assets/file-icons/integration/Figma.svg";
import loomIcon from "@/assets/file-icons/integration/Loom.svg";
import notionIcon from "@/assets/file-icons/integration/Notion.svg";
import sheetsIcon from "@/assets/file-icons/integration/Sheets.svg";
function defineFileIcon(file: File) {
  if (FileType.FOLDER === file.type) {
    return folderIcon;
  } else if (FileType.EXTERNAL_FILE === file.type) {
    const url = new URL(file.url);

    if (url.hostname.endsWith("loom.com")) {
      return loomIcon;
    }

    if (url.hostname.endsWith("figma.com")) {
      return figmaIcon;
    }

    if (url.hostname.endsWith(".notion.site")) {
      return notionIcon;
    }

    if (url.hostname === "docs.google.com" && url.pathname.startsWith("/spreadsheets")) {
      return sheetsIcon;
    }

    return linkIcon;
  }
}
</script>

<template>
  <div class="file">
    <div style="float: right; margin-top: -12px; margin-right: -8px">
      <div class="file_dropdown">
        <svg class="file_dropdown_button" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_657_7300)">
            <path d="M8 2C7.26667 2 6.66667 2.6 6.66667 3.33333C6.66667 4.06667 7.26667 4.66667 8 4.66667C8.73333 4.66667 9.33333 4.06667 9.33333 3.33333C9.33333 2.6 8.73333 2 8 2ZM8 11.3333C7.26667 11.3333 6.66667 11.9333 6.66667 12.6667C6.66667 13.4 7.26667 14 8 14C8.73333 14 9.33333 13.4 9.33333 12.6667C9.33333 11.9333 8.73333 11.3333 8 11.3333ZM8 6.66667C7.26667 6.66667 6.66667 7.26667 6.66667 8C6.66667 8.73333 7.26667 9.33333 8 9.33333C8.73333 9.33333 9.33333 8.73333 9.33333 8C9.33333 7.26667 8.73333 6.66667 8 6.66667Z"
                  fill="currentColor"/>
          </g>
        </svg>
        <div class="file_dropdown_button_actions">
          <ul>
            <li class="file_dropdown_button_action"><button @click="emitEditEvent">Edit</button></li>
            <li class="file_dropdown_button_action file_dropdown_button_action__danger"><button @click="emitDeleteEvent">Delete</button></li>
          </ul>
        </div>
      </div>
    </div>
    <div style="display: flex">
      <div class="file_icon">
        <img :src="defineFileIcon(file)" alt="board icon"/>
      </div>
      <div>
        <a :href="file.url" target="_blank"><p class="file_name">{{file.name}}</p></a>
        <p class="file_editedAt">{{editedAt()}}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file {
  min-width: 340px;
  max-width: 340px;
  width: 340px;

  min-height: 74px;
  max-height: 74px;
  height: 74px;

  background-color: #FFFFFF;

  border: 1px #E7E7E5 solid;
  border-radius: 8px;
  padding: 16px;
}

.file_icon {
  min-width: 42px;
  width: 42px;
  min-height: 42px;
  height: 42px;

  border: #E7E7E5 1px solid;
  border-radius: 8px;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;

  margin-right: 12px
}

.file_name {
  color: #000000;
  font-size: 16px;
  max-width: 254px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.file_name:hover {
  color: #FF7C5C;
  cursor: pointer;
}

.file_editedAt {
  color: rgba(0,0,0,0.5);
  font-size: 12px
}

.file_dropdown {
  position: relative;
  display: none;
  cursor: pointer;
}

.file_dropdown_button {
  cursor: pointer;
}

.file_dropdown_button:hover {
  color: #FF7C5C;
}

.file:hover .file_dropdown {
  display: inline-block;
}

.file_dropdown_button_actions {
  display: none;
  position: absolute;
  background-color: #FFFFFF;
  min-width: 198px;
  border: 1px solid #DEE2E6;
  border-radius: 4px;
  z-index: 1;
}

.file_dropdown:hover .file_dropdown_button_actions {
  display: block;
}

.file_dropdown:hover .file_dropdown_button {
  color: #FF7C5C;
}

.file_dropdown_button_action {
  height: 32px;
  font-size: 14px;
  font-weight: 400;
  color: #000000;

  padding-left: 16px;

  display: flex;
  place-items: center;
}
.file_dropdown_button_action:hover {
  color: #FF7C5C;
  background-color: #EDEDED;
}
</style>