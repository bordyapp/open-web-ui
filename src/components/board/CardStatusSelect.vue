<template>
    <div class="card-status-dropdown" tabindex="0">
        <p class="flex card-status-dropdown_text place-items-center">
            <CardNotStartedStatusIcon v-if="cardStatus === CardStatus.NOT_STARTED" style="margin-right: 4px"/>
            <CardInProgressStatusIcon v-if="cardStatus === CardStatus.IN_PROGRESS" style="margin-right: 4px"/>
            <CardDoneStatusIcon v-if="cardStatus === CardStatus.DONE" style="margin-right: 4px"/>
            <CardClosedStatusIcon v-if="cardStatus === CardStatus.CLOSED" style="margin-right: 4px"/>
            {{cardPriorityName(cardStatus)}}
        </p>
        <div class="card-status-dropdown_priority-list">
            <ul style="padding-top: 8px; padding-bottom: 8px">
                <li style="height: 22px">
                    <div @click="select(CardStatus.NOT_STARTED)" class="flex place-items-center card-status-dropdown_priority" :class="{'card-status-dropdown_priority__selected': cardStatus === CardStatus.NOT_STARTED}">
                        <CardNotStartedStatusIcon style="margin-right: 4px"/>
                        <p class="grow">{{cardPriorityName(CardStatus.NOT_STARTED)}}</p>
                        <span v-if="cardStatus === CardStatus.NOT_STARTED">✓</span>
                    </div>
                </li>
                <li style="height: 22px">
                    <div @click="select(CardStatus.IN_PROGRESS)" class="flex place-items-center card-status-dropdown_priority" :class="{'card-status-dropdown_priority__selected': cardStatus === CardStatus.IN_PROGRESS}">
                        <CardInProgressStatusIcon style="margin-right: 4px"/>
                        <p class="grow">{{cardPriorityName(CardStatus.IN_PROGRESS)}}</p>
                        <span v-if="cardStatus === CardStatus.IN_PROGRESS">✓</span>
                    </div>
                </li>
                <li style="height: 22px">
                    <div @click="select(CardStatus.DONE)" class="flex place-items-center card-status-dropdown_priority" :class="{'card-status-dropdown_priority__selected': cardStatus === CardStatus.DONE}">
                        <CardDoneStatusIcon style="margin-right: 4px"/>
                        <p class="grow">{{cardPriorityName(CardStatus.DONE)}}</p>
                        <span v-if="cardStatus === CardStatus.DONE">✓</span>
                    </div>
                </li>
                <li style="height: 22px">
                    <div @click="select(CardStatus.CLOSED)" class="flex place-items-center card-status-dropdown_priority" :class="{'card-status-dropdown_priority__selected': cardStatus === CardStatus.CLOSED}">
                        <CardClosedStatusIcon style="margin-right: 4px"/>
                        <p class="grow">{{cardPriorityName(CardStatus.CLOSED)}}</p>
                        <span v-if="cardStatus === CardStatus.CLOSED">✓</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import {CardStatus} from "../../BordieApi";
import CardNotStartedStatusIcon from "../icons/CardNotStartedStatusIcon.vue";
import CardInProgressStatusIcon from "../icons/CardInProgressStatusIcon.vue";
import CardDoneStatusIcon from "../icons/CardDoneStatusIcon.vue";
import CardClosedStatusIcon from "../icons/CardClosedStatusIcon.vue";

const props = defineProps({
  cardStatus: {
    type: String,
    required: true
  }
})

function cardPriorityName(cardStatus: string): string {
  let priority: string | undefined = undefined;
  if (cardStatus === CardStatus.IN_PROGRESS) {
    priority = "In progress";
  } else if (cardStatus === CardStatus.DONE) {
    priority = "Done";
  } else if (cardStatus === CardStatus.CLOSED) {
    priority = "Closed";
  }

  if (priority) {
    return priority;
  } else {
    return "Not started";
  }
}

const emit = defineEmits<{
  (e: 'select', cardStatus: CardStatus): void
}>()
function select(cardStatus: CardStatus) {
  emit('select', cardStatus)
}
</script>

<style scoped>
.card-status-dropdown {
  position: relative;
}

.card-status-dropdown_text {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
}
.card-status-dropdown_text:hover {
  color: #FF7C5C;
  cursor: pointer;
}

.card-status-dropdown:focus-within .card-status-dropdown_priority-list {
  visibility: visible;
}

.card-status-dropdown_priority-list {
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

.card-status-dropdown_priority {
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
.card-status-dropdown_priority__selected {
  color: #000000;
}

.card-status-dropdown_priority:hover {
  color: #FF7C5C;
  cursor: pointer;

  background-color: #F7F7F6;
}
.card-status-dropdown_priority__selected:hover {
  color: #000000;
}
</style>