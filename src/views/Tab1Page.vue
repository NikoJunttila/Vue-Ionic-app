<template>
  <!-- <Testing message="test" title="xdd" initialCounter=1> 
</Testing>
-->
  <IonPage>
    <IonContent color="primary">
      <ion-item color="primary">
        <ion-label
          >Basic workouts for you to get started out at the gym.</ion-label>
        </ion-item>
      <IonButton expand="full" color="tertiary" v-if="userStore.user" @click="updateCustoms">Get your workouts</IonButton>
      <div v-if="workoutsCustom" class="grid-2col gap-2" style="margin: 15px">
        <ion-card
          color="secondary"
          class="flex-col border full"
          v-for="workout of workoutsCustom"
        >
          <ion-card-header>
            <ion-card-title class="b-btm text-center line-clamp-3">{{
              workout.name
            }}</ion-card-title>
            <ion-card-subtitle class="text-center"
              >Days/week: {{ workout.days }}</ion-card-subtitle
            >
          </ion-card-header>
          <ion-card-content class="line-clamp-2">
            {{ workout.description }}
          </ion-card-content>
          <ion-button
            @click="updateSingle(workout)"
            style="margin-top: auto"
            color="tertiary"
            expand="full"
            >More</ion-button
          >
        </ion-card>
      </div>
      <div v-if="workouts" class="grid-2col gap-2" style="margin: 15px">
        <ion-card
          color="secondary"
          class="flex-col border full"
          v-for="workout of workouts"
        >
          <ion-card-header>
            <ion-card-title class="b-btm text-center line-clamp-3">{{
              workout.name
            }}</ion-card-title>
            <ion-card-subtitle class="text-center"
              >Days/week: {{ workout.days }}</ion-card-subtitle
            >
          </ion-card-header>
          <ion-card-content class="line-clamp-2">
            {{ workout.description }}
          </ion-card-content>
          <ion-button
            @click="updateSingle(workout)"
            style="margin-top: auto"
            color="tertiary"
            expand="full"
            >More</ion-button
          >
        </ion-card>
      </div>
      <div v-else>Loading</div>
    </IonContent>
    <Modal :isOpen="isOpen" @some-event="modalClose">
      <div v-if="singleWorkout" class="flex-col items-center-flex">
        <h1>{{ singleWorkout.name }}</h1>
        <h2>times per week: {{ singleWorkout.days }}</h2>
        <p>{{ singleWorkout.description }}</p>
        <div class="grid-1col gap-2">
          <div
            class="flex-col items-center-flex modal-exercises"
            v-for="(plan, index) of singleWorkout?.plans"
          >
            <p>Day {{ index + 1 }}: {{ plan.day }}</p>
            <ul>
              <li v-for="(exercise, index) of plan.exercises">
                {{ index + 1 }}. {{ exercise.exercise }}
              </li>
            </ul>
            <IonButton
              router-link="/tabs/tab2"
              @click="startWorkout(plan, index)"
              color="tertiary"
              class="rounded2"
              style="width: 100%"
              >Start workout</IonButton
            >
          </div>
        </div>
      </div>
    </Modal>
  </IonPage>
</template>

<script setup lang="ts">
import { getCollection } from "../utils/fbFunctions";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
} from "@ionic/vue";
import type { Workouts } from "../utils/types";
import Modal from "@/components/Modal.vue";
import { ref, onMounted, watch } from "vue";
import { getCustomWorkoutsCollection } from "../utils/fbFunctions";
import { useUserStore } from "@/store/userStore";
const isOpen = ref(false);
const userStore = useUserStore();
const workouts = ref<Workouts[] | null>(null);
const workoutsCustom = ref<Workouts[] | null>(null);
const singleWorkout = ref<Workouts | null>(null);

async function updateCustoms(){
  if (userStore.user) {
    const customs = await getCustomWorkoutsCollection(
      userStore.user.email_lower
    );
    workoutsCustom.value = customs;
  }
}

function updateSingle(workout: Workouts) {
  isOpen.value = !isOpen.value;
  singleWorkout.value = workout;
}
function startWorkout(plan: any, index: number) {
  isOpen.value = !isOpen.value;
  plan.parentID = singleWorkout.value.id;
  plan.index = index;
  plan.madeBy = singleWorkout.value.madeBy
  const save = JSON.stringify(plan);
  localStorage.setItem("workout", save);
  localStorage.setItem("initWorkout", save);
}
function modalClose() {
  isOpen.value = !isOpen.value;
}

onMounted(async () => {
  workouts.value = await getCollection("workouts");
  workouts.value?.sort((a, b) => a.sort - b.sort);
  if (userStore.user) {
    const customs = await getCustomWorkoutsCollection(
      userStore.user.email_lower
    );
    workoutsCustom.value = customs;
  }
});
</script>

<style scoped>
.full {
  width: 100%;
  height: 100%;
  margin: 0;
}
li {
  list-style: none;
}
.rounded2 {
  border-radius: 200px;
}
.modal-exercises {
  border: 2px solid var(--ion-color-tertiary);
  border-radius: 15px;
  padding: 5px 15px;
  background-color: var(--ion-color-secondary);
}
.b-btm {
  border-bottom: 2px solid var(--border-color);
}
</style>
