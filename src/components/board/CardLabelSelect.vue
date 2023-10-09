<template>
  <div>
    <ul>
      <li v-for="(label) in cardLabels" class="card-label_label flex place-items-center">
        <label class="card-label_label_label" :style="`color: ${labelColor(label, true)}; background-color: ${labelColor(label, false)}`">{{label}}</label>
      </li>
    </ul>
    <div class="card-label-dropdown" tabindex="0">
      <p class="flex card-label-dropdown_text place-items-center">
        <svg style="margin-right: 4px" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 8L5 8" stroke="#6C6F75" stroke-linecap="round"/>
          <path d="M8 11L8 5" stroke="#6C6F75" stroke-linecap="round"/>
        </svg>
        {{cardLabels.length > 0 ? 'Edit labels' : 'Add labels'}}
      </p>
      <div class="card-label-dropdown_priority-list">
        <input v-model="labelFilter" @keydown="handleTagInput($event, filterLabels(knownLabels).length > 0)" class="card-label-dropdown_label-input" placeholder="New label..." type="text">
        <hr>
        <div v-if="labelFilter.length > 0" class="flex flex-wrap place-items-center" style="min-height: 22px; padding-left: 8px; padding-right: 8px">
          <svg style="margin-right: 4px" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 8L5 8" stroke="#BFBFBF" stroke-linecap="round"/>
            <path d="M8 11L8 5" stroke="#BFBFBF" stroke-linecap="round"/>
          </svg>
          <span style="font-size: 12px; font-weight: 400; color: #BFBFBF">Create new label “</span>
          <span style="font-size: 12px; font-weight: 400; color: #000000">{{labelFilter}}</span>
          <span style="font-size: 12px; font-weight: 400; color: #BFBFBF">”</span>
        </div>
        <ul v-if="filterLabels(knownLabels).length > 0">
          <li v-for="(label) in filterLabels(knownLabels)" class="card-label-dropdown_label flex place-items-center">
            <input type="checkbox" class="card-label-dropdown_label_checkbox flex-col" :value="label" @change="select(labels)" v-model="labels">
            <label class="card-label-dropdown_label_label flex-col" style="margin-left: 8px" :style="`color: ${labelColor(label, true)}; background-color: ${labelColor(label, false)}`">{{label}}</label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const props = defineProps({
  knownLabels: {
    type: Array<string>,
    required: true
  },
  cardLabels: {
    type: Array<string>,
    required: true
  }
})
const labelFilter = ref<string>("");
const labels      = ref<string[]>(props.cardLabels)
function filterLabels(labels: string[]) {
  if (labelFilter.value === "") {
    return labels;
  }

  const result: string[] = [];
  props.knownLabels?.forEach(knownLabel => {
    if (knownLabel.toLowerCase().startsWith(labelFilter.value.toLowerCase())) {
      result.push(knownLabel);
    }
  })

  return result;
}
function handleTagInput(event, knownLabelsExists: boolean) {
  // if (knownLabelsExists) {
  //   return;
  // }

  if (event.code == "Comma" || event.code == "Enter") {
    event.preventDefault();

    const possibleLabelValue = event.target.value.trim();
    if (possibleLabelValue.length > 0) {
      props.cardLabels?.push(possibleLabelValue);
      event.target.value = '';
      labelFilter.value  = "";
    }
  }
}

const emit = defineEmits<{
  (e: 'select', cardLabels: string[]): void
}>()
function select(cardLabels: string[]) {
  emit('select', cardLabels)
}

/**
 * https://stackoverflow.com/a/21682946
 *
 * https://stackoverflow.com/users/356218/thymine
 */
function labelColor(label: string, isTextColor: boolean = true): string {
  let hash: number       = 0;
  let saturation: number = 70; // saturation is how rich you want the color
  let lightness: number; // Lightness determines the deepness, 50% is normal, 25% is dark colors, 75% is pastel
  if (isTextColor) {
    lightness = 10;
  } else {
    lightness = 85;
  }

  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%)`;
}
</script>

<style scoped>
.card-label-dropdown {
  height: fit-content;
  position: relative;
}

.card-label-dropdown_text {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
}
.card-label-dropdown_text:hover {
  color: #FF7C5C;
  cursor: pointer;
}

.card-label-dropdown:focus-within .card-label-dropdown_priority-list {
  visibility: visible;
}

.card-label-dropdown_priority-list {
  min-width: 200px;
  max-width: 200px;
  width: 200px;

  background-color: #FFFFFF;

  border-radius: 4px;
  border: 1px #DEE2E6 solid;

  position: absolute;
  right: 0;
  visibility: hidden;

  z-index: 1;
}

.card-label-dropdown_label-input {
  width: 100%;
  height: 14px;
  color: #7C7C7B;
  font-size: 12px;
  font-weight: 400;

  padding-left: 8px;
  padding-right: 8px;

  outline: none;
}
.card-label_label {
  min-height: 28px;
  max-height: 28px;
  height: 28px;

  width: 100%;

  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  font-weight: 400;
}
.card-label_label_label {
  height: 20px;
  padding-left: 8px;
  padding-right: 8px;

  border-radius: 4px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-label-dropdown_label {
  min-height: 28px;
  max-height: 28px;
  height: 28px;

  width: 100%;

  padding-left: 8px;
  padding-right: 8px;

  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  font-weight: 400;
}
.card-label-dropdown_label:hover {
  background-color: #F7F7F6;
}

.card-label-dropdown_label_checkbox {
  min-width: 16px;
  max-width: 16px;
  width: 16px;

  min-height: 16px;
  max-height: 16px;
  height: 16px;
}
.card-label-dropdown_label_checkbox:hover {
  cursor: pointer;
}

.card-label-dropdown_label_label {
  height: 20px;
  padding-left: 8px;
  padding-right: 8px;

  border-radius: 4px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>