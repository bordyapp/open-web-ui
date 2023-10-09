<template>
  <div class="list-dropdown">
    <svg ref="listDropdownButtonRef" class="list-dropdown_icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_657_7300)">
        <path d="M8 2C7.26667 2 6.66667 2.6 6.66667 3.33333C6.66667 4.06667 7.26667 4.66667 8 4.66667C8.73333 4.66667 9.33333 4.06667 9.33333 3.33333C9.33333 2.6 8.73333 2 8 2ZM8 11.3333C7.26667 11.3333 6.66667 11.9333 6.66667 12.6667C6.66667 13.4 7.26667 14 8 14C8.73333 14 9.33333 13.4 9.33333 12.6667C9.33333 11.9333 8.73333 11.3333 8 11.3333ZM8 6.66667C7.26667 6.66667 6.66667 7.26667 6.66667 8C6.66667 8.73333 7.26667 9.33333 8 9.33333C8.73333 9.33333 9.33333 8.73333 9.33333 8C9.33333 7.26667 8.73333 6.66667 8 6.66667Z"
              fill="currentColor"/>
      </g>
    </svg>
    <ul ref="listDropdownRef" class="list-dropdown_actions">
      <li class="list-dropdown_action" @click="editEvent">Edit</li>
      <li class="list-dropdown_action" @click="deleteEvent">Delete</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { createPopper } from '@popperjs/core/lib/popper-lite';
import {List} from "../../BordieApi";
import {onMounted, ref} from "vue";
import {onClickOutside, useEventListener} from "@vueuse/core";

const props = defineProps({
  list: {
    type: List,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'convert'): void
  (e: 'edit'): void
  (e: 'delete'): void
}>()
function convertEvent() {
  emit('convert', )
}
function editEvent() {
  emit('edit', )
}
function deleteEvent() {
  emit('delete', )
}

const popperInstanceRef     = ref();
const listDropdownButtonRef = ref();
const listDropdownRef       = ref();
onMounted(() => {
    useEventListener(listDropdownButtonRef.value, 'click', show)
    onClickOutside(listDropdownRef.value, hide)

    popperInstanceRef.value = createPopper(listDropdownButtonRef.value, listDropdownRef.value, {
        placement: "bottom-start",
    })
})
function show () {
    listDropdownRef.value.setAttribute('data-show', '')
    popperInstanceRef.value.update()
}
function hide () {
    listDropdownRef.value.removeAttribute('data-show')
}
</script>

<style scoped>
.list-dropdown {
  position: relative;
}
.list-dropdown:hover {
  cursor: pointer;
}

.list-dropdown_icon:hover {
  color: #FF7C5C;
}

.list-dropdown_actions[data-show] {
  display: block;
}

.list-dropdown_actions {
  min-width: 200px;
  background-color: #FFFFFF;

  border-radius: 2px;
  border: 1px #DEE2E6 solid;

  z-index: 2;
  display: none;
  position: absolute;
  left: 0;
}

.list-dropdown_action {
  height: 32px;
  font-size: 14px;
  font-weight: 400;
  color: #000000;

  padding-left: 16px;

  display: flex;
  place-items: center;
}
.list-dropdown_action:hover {
  color: #FF7C5C;
  background-color: #EDEDED;
  cursor: pointer;
}
</style>