<template>
  <ion-page>
    <ion-content color="primary">
      <section class="flex-col items-center-flex py-4 gap-4 w-full">
        <img :src="userStore.user.photoURL" class="rounded" alt="user" />
        <div v-if="workoutsDone">
          <h2>Workouts done: {{ workoutsDone.length }}</h2>
          <p>
            Total time spent aprox: {{ trainingDone.timeSpentHours }} hours and
            {{ trainingDone.timeSpentMinutes }} minutes
          </p>
          <p>Avg workout time: {{ trainingDone.avg }} minutes</p>
        </div>
        <div class="flex items-center-flex">
            <div>
                Sort:
            </div>
          <ion-button color="tertiary" @click="sortLatestFirst"
            ><ion-icon :icon="arrowUpOutline"></ion-icon></ion-button>  
          <ion-button color="tertiary" @click="sortOldestFirst"
            ><ion-icon :icon="arrowDownOutline"></ion-icon></ion-button
          >
        </div>
        <section class="flex items-center-flex" style="width: 100% !important;">      
          <div class="container grid border rounded mx-4">
            <button
              class="flex items-center-flex"
              v-for="(workout, index) of workoutsDone"
              @click="changeFocus(workout)"
            >
              <span
                class="bg-secondary min-h-full grid grid-center"
                style="width: 6ch"
              >
                {{ index + 1 }}
          </span>
              <div class="w-full text-center py-4">
                {{ workout.day }}<br />{{
                  formatDateShort(workout.date.toDate())
                }}
                <span v-if="workout.notes">**</span>
              </div>
            </button>
          </div>
          <div id="fullshow" v-if="workoutToShow" class="grid h-full mx-2 rounded border" style="overflow: hidden;">
            <div class="bg-tertiary text-center border-btm" style="padding-bottom: 10px;">
              <p style="font-size: 1.2rem;" class=" font-bold">{{ workoutToShow.day }}</p>
                {{ formatDate(workoutToShow.date.toDate()) }}<br>
              aprox: {{ workoutToShow.aproxTime }} minutes
            </div>
            <li style="padding: 5px 0;" v-for="exercise of workoutToShow.exercises">
              <span>
                {{ exercise.exercise }}
                <span v-if="exercise.weight">{{ exercise.weight }}kg</span>
                {{ exercise.setsDone }}x{{ exercise.reps }}
              </span>
            </li>
            <div class="text-center bg-tertiary" style="padding: 10px 5px;" v-if="workoutToShow.notes">
              {{ workoutToShow.notes }}
            </div>
          </div>
        </section>
        <ion-button color="warning" expand="full" @click="logout"
          >Logout</ion-button
        >
      </section>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton, IonIcon} from "@ionic/vue";
import {
arrowUpOutline,
arrowDownOutline
} from "ionicons/icons";
import { useUserStore } from "../store/userStore";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { getDoneWorkoutsCollection } from "@/utils/fbFunctions";
import { ref, watch, onMounted } from "vue";
import type { SingleWorkout } from "@/utils/types";
const trainingDone = ref({
  timeSpentHours: 0,
  timeSpentMinutes: 0,
  avg: 0,
});
const userStore = useUserStore();
const workoutsDone = ref<SingleWorkout[] | null>(null);
const workoutToShow = ref<SingleWorkout | null>(null);

onMounted(async () => {
  if (!userStore.user) return;
  const waiting = await getWorkouts();
  sortLatestFirst();
  aproxTimeAtGym();
  workoutToShow.value = workoutsDone.value[0];
});

watch(userStore.user, async () => {
  if (!userStore.user) return;
  const res: any = await getDoneWorkoutsCollection(userStore.user.email_lower);
  workoutsDone.value = res;
});
async function getWorkouts() {
  if (!userStore.user) return;
  const res: any = await getDoneWorkoutsCollection(userStore.user.email_lower);
  workoutsDone.value = res;
}
function formatDateShort(date: any) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
function formatDate(date: any) {
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function changeFocus(workout: SingleWorkout) {
  if (workoutToShow.value == workout) {
    workoutToShow.value = null;
    return;
  }
  workoutToShow.value = workout;
}
function sortLatestFirst() {
  workoutsDone.value.sort((a: any, b: any) => b.date - a.date);
}
function sortOldestFirst() {
  workoutsDone.value.sort((a: any, b: any) => a.date - b.date);
}
function logout() {
  signOut(auth)
    .then(() => {
      console.log("logged out");
    })
    .catch((error) => {
      console.log(error);
    });
}
function aproxTimeAtGym() {
  let total: number = 0;
  workoutsDone.value.forEach((element: any) => {
    total += element.aproxTime;
  });
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  const avg = Math.floor(total / workoutsDone.value.length);
  const saveObj = {
    timeSpentHours: hours,
    timeSpentMinutes: minutes,
    avg: avg,
  };
  trainingDone.value = saveObj;
}
</script>
<style scoped>
li {
  list-style: none;
}
.container {
  max-height: 40vh;
  overflow: auto;
  max-width: 55%;
}
.container > button {
  border-bottom: 1px solid black;
  color: wheat;
  font-size: 0.8rem;
}
#fullshow li:nth-child(odd){
    background-color: var(--ion-color-tertiary-shade);
}
#fullshow li:nth-child(even){
    background-color: var(--ion-color-secondary-shade);
}
.container button:nth-child(odd) .w-full {
  background-color: var(--ion-color-secondary-shade);
}
.container button:nth-child(even) .w-full {
  background-color: var(--ion-color-tertiary-shade);
}
.border-btm{
    border-bottom: 1px solid black;
}
img {
  max-width: 90vw;
  max-height: 400px;
}
</style>
