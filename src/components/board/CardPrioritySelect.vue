<template>
    <div class="card-priority-dropdown" tabindex="0">
        <p v-if="cardPriority === CardPriority.NO_PRIORITY" class="card-priority_value" style="color: #595958; font-size: 10px; font-weight: 400">No priority</p>
        <p v-if="cardPriority === CardPriority.MEDIUM" class="card-priority_value" style="color: #F49300; font-size: 10px; font-weight: 400">Medium</p>
        <p v-if="cardPriority === CardPriority.HIGH" class="card-priority_value" style="color: #CE0000; font-size: 10px; font-weight: 400">High</p>
        <div class="card-priority-dropdown_priority-list" role="menu">
            <ul style="padding-top: 8px; padding-bottom: 8px">
                <li style="height: 22px">
                    <div @click="select(CardPriority.NO_PRIORITY)" class="place-items-center card-priority-dropdown_priority" :class="{'card-priority-dropdown_priority__selected': cardPriority === CardPriority.NO_PRIORITY}">
                        <span style="float: right" v-if="cardPriority === CardPriority.NO_PRIORITY">✓</span>
                        <p class="card-priority_value" style="color: #595958; font-size: 10px; font-weight: 400">No priority</p>
                    </div>
                </li>
                <li style="height: 22px">
                    <div @click="select(CardPriority.MEDIUM)" class="place-items-center card-priority-dropdown_priority" :class="{'card-priority-dropdown_priority__selected': cardPriority === CardPriority.MEDIUM}">
                        <span style="float: right" v-if="cardPriority === CardPriority.MEDIUM">✓</span>
                        <p class="card-priority_value" style="color: #F49300; font-size: 10px; font-weight: 400">Medium</p>
                    </div>
                </li>
                <li style="height: 22px">
                    <div @click="select(CardPriority.HIGH)" class="place-items-center card-priority-dropdown_priority" :class="{'card-priority-dropdown_priority__selected': cardPriority === CardPriority.HIGH}">
                        <span style="float: right" v-if="cardPriority === CardPriority.HIGH">✓</span>
                        <p class="card-priority_value" style="color: #CE0000; font-size: 10px; font-weight: 400">High</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import {CardPriority} from "../../BordieApi";

const props = defineProps({
  cardPriority: {
    type: String,
    required: true
  }
})

function cardPriorityName(cardPriority: string): string {
  let priority: string | undefined = undefined;
  if (cardPriority === CardPriority.LOW) {
    priority = "Low";
  } else if (cardPriority === CardPriority.MEDIUM) {
    priority = "Medium";
  } else if (cardPriority === CardPriority.HIGH) {
    priority = "High";
  } else if (cardPriority === CardPriority.URGENT) {
    priority = "Urgent";
  }

  if (priority) {
    return priority;
  } else {
    return "No priority";
  }
}

const emit = defineEmits<{
  (e: 'select', cardPriority: CardPriority): void
}>()
function select(cardPriority: CardPriority) {
  emit('select', cardPriority)
}
</script>

<style scoped>
.card-priority-dropdown {
  position: relative;
}

.card-priority-dropdown_text {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
}
.card-priority-dropdown_text:hover {
  color: #FF7C5C;
  cursor: pointer;
}

.card-priority-dropdown:focus-within .card-priority-dropdown_priority-list {
  visibility: visible;
}

.card-priority-dropdown_priority-list {
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

.card-priority-dropdown_priority {
  min-height: 22px;
  max-height: 22px;
  height: 22px;

  width: 100%;

  padding-left: 8px;
  padding-right: 8px;

  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  font-weight: 400;
}
.card-priority-dropdown_priority__selected {
  color: #000000;
}

.card-priority-dropdown_priority:hover {
  color: #FF7C5C;
  cursor: pointer;

  background-color: #F7F7F6;
}
.card-priority-dropdown_priority__selected:hover {
  color: #000000;
}

.card-priority_value {
  height: 20px;
  width: fit-content;

  background-color: #EAEDEE;
  border-radius: 4px;

  /* in case of 16x16 */
  padding: 2px 8px;
}
.card-priority_value:hover {
    cursor: pointer;
}
</style>