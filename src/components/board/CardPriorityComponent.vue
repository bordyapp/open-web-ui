<template>
    <div class="card-priority" v-if="card.priority !== CardPriority.NO_PRIORITY">
      <p v-if="card.priority === CardPriority.LOW" style="color: #595958; font-size: 10px; font-weight: 400">Low</p>
      <p v-if="card.priority === CardPriority.MEDIUM" style="color: #F49300; font-size: 10px; font-weight: 400">Medium</p>
      <p v-if="card.priority === CardPriority.HIGH" style="color: #CE0000; font-size: 10px; font-weight: 400">High</p>
      <p v-if="card.priority === CardPriority.URGENT" style="color: #CE0000; font-size: 10px; font-weight: 400">Urgent</p>
    </div>
</template>

<script setup lang="ts">
import {Card, CardPriority} from "../../BordieApi";

const props = defineProps({
    card: {
        type: Card,
        required: true
    }
})
</script>

<style scoped>
.card-priority {
    height: 20px;

    background-color: #EAEDEE;
    border-radius: 4px;

    /* in case of 16x16 */
    padding: 2px 8px;
}
</style>