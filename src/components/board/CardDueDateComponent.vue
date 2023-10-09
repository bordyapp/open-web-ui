<template>
  <div v-if="card.dueDate" class="card-due-date flex place-items-center" :style="{'background-color': backgroundColor(daysAgo(new Date(card.dueDate)))}">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_297_269)">
        <path d="M6.99999 12.8333C3.77824 12.8333 1.16666 10.2217 1.16666 6.99999C1.16666 3.77824 3.77824 1.16666 6.99999 1.16666C10.2217 1.16666 12.8333 3.77824 12.8333 6.99999C12.8333 10.2217 10.2217 12.8333 6.99999 12.8333ZM6.99999 11.6667C8.23767 11.6667 9.42465 11.175 10.2998 10.2998C11.175 9.42465 11.6667 8.23767 11.6667 6.99999C11.6667 5.76231 11.175 4.57533 10.2998 3.70016C9.42465 2.82499 8.23767 2.33332 6.99999 2.33332C5.76231 2.33332 4.57533 2.82499 3.70016 3.70016C2.82499 4.57533 2.33332 5.76231 2.33332 6.99999C2.33332 8.23767 2.82499 9.42465 3.70016 10.2998C4.57533 11.175 5.76231 11.6667 6.99999 11.6667ZM7.58332 6.99999H9.91666V8.16666H6.41666V4.08332H7.58332V6.99999Z"
              :fill="textColor(daysAgo(new Date(card.dueDate)))"/>
      </g>
      <defs>
        <clipPath id="clip0_297_269">
          <rect width="14" height="14" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    <p class="card-due-date_formated-date" :style="{'color': textColor(daysAgo(new Date(card.dueDate)))}">{{formatDueDate(card.dueDate)}}</p>
  </div>
</template>

<script setup lang="ts">
import {Card} from "../../BordieApi";

const props = defineProps({
    card: {
        type: Card,
        required: true
    }
})

const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June",
  "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
];
function formatDueDate(dueDate: Date): string {
  return `${new Date(dueDate).getDate()} ${monthNames[new Date(dueDate).getMonth()]}`;
}

function backgroundColor(daysAgo: number): string {
  let color = "#D6D7DA";
  if (daysAgo === -1) {
    return "#E1D7D9";
  } else if (daysAgo > -1) {
    return "#E18F8B";
  }

  return color;
}

function textColor(daysAgo: number): string {
  let color = "#595958";
  if (daysAgo === -1) {
    return "#98150B";
  } else if (daysAgo > -1) {
    return "#800800";
  }

  return color;
}

function daysAgo(dueDate: Date): number {
  const currentDate = new Date();

  const utc1 = Date.UTC(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate(),
      dueDate.getHours(),
      dueDate.getMinutes(),
  );
  const utc2 = Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes(),
  );

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
</script>

<style scoped>
.card-due-date {
  height: 20px;
  padding: 4px 8px;
  border-radius: 4px;
}

.card-due-date_formated-date {
  margin-left: 5px;
  font-size: 10px;
  font-weight: 400;
}
</style>