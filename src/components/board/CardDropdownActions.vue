<template>
    <ul ref="cardDropdownActionsRef" class="card-dropdown_actions">
      <li v-if="!cardRef?.boundBoardId" class="card-dropdown_action" @click="convertEvent">Convert into board</li>
      <li class="card-dropdown_action" @click="editEvent">Edit</li>
      <li class="card-dropdown_action" @click="deleteEvent">Delete</li>
    </ul>
</template>

<script setup lang="ts">
import {Card} from "../../BordieApi";
import {ref} from "vue";

const cardRef = ref<Card>();
const listIndexRef = ref<number>();
const cardIndexRef = ref<number>();
function open(card: Card, listIndex: number, cardIndex: number) {
    console.log(`CardDropdownActions: show - ${card.name}`);
    cardRef.value = card;
    listIndexRef.value = listIndex;
    cardIndexRef.value = cardIndex;

    cardDropdownActionsRef.value.setAttribute('data-show', '');
}
const cardDropdownActionsRef = ref();
function close() {
    cardDropdownActionsRef.value.removeAttribute('data-show');
}
defineExpose({
    open,
    close
})

const emit = defineEmits<{
  (e: 'convert'): void
  (e: 'edit', listIndex: number, cardIndex: number): void
  (e: 'delete', listIndex: number, cardIndex: number, card: Card): void
}>()
function convertEvent() {
  emit('convert', )
}
function editEvent() {
  emit('edit', listIndexRef.value, cardIndexRef.value)
}
function deleteEvent() {
  emit('delete', listIndexRef.value, cardIndexRef.value, cardRef.value)
}
</script>

<style scoped>
.card-dropdown_actions[data-show] {
  display: block;
}

.card-dropdown_actions {
  min-width: 200px;
  background-color: #FFFFFF;

  border-radius: 2px;
  border: 1px #DEE2E6 solid;

  display: none;
  position: absolute;
}

.card-dropdown_action {
  height: 32px;
  font-size: 14px;
  font-weight: 400;
  color: #000000;

  padding-left: 16px;

  display: flex;
  place-items: center;

  cursor: pointer;
}
.card-dropdown_action:hover {
  color: #FF7C5C;
  background-color: #EDEDED;
}
</style>