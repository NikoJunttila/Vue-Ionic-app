<template>
  <ion-page>
    <ion-content color="primary">
      <div
        v-if="exercise"
        class="items-center-flex flex-col text-center mx-4"
      >
        <h1>{{ exercise.name }}</h1>
        <h3>{{ exercise.description }}</h3>
        <iframe
          width="95%"
          height="400"
          :src="exercise.link"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <div v-else>
        <h1>Im lazy and have not added guide for this exercise yet :<</h1>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import type { guide } from "@/utils/types";
import { info } from "@/utils/exercises";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
const route = useRoute();
const exercise = ref<guide | null>(null);
watch(() => route.params.name, findExercise, { immediate: true });

function findExercise(name: string) {
    if(!name)return
  exercise.value = info.find(
    (element: guide) => element.name.toLowerCase() === name.toLowerCase()
  );
}
</script>
