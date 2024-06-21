<template>
  <ion-page>
    <ion-content color="primary" :fullscreen="true">
      <div v-if="workoutSingle" class="py-4 h-full">
        <section class="flex-col h-full" style="padding-top: 15px;">
          <div class="flex-col flex-items-center mx-4 gap-2">
            <div
              class="grid grid-center"
              v-if="userStore.user && !startedTotalTimer"
            >
              <ion-button color="tertiary" @click="optionalStartTime">
                Start workout timer
              </ion-button>
            </div>
            <div
              class="mx-6"
              v-for="(workout, i) in workoutSingle.exercises"
              :key="i"
            >
              <div
                v-if="!workout.done"
                class="overflow-hidden rounded border "
                :class="workout.setsDone === 0 ? 'bg-secondary': workout.sets == workout.setsDone ? 'done':'started'"
              >
                <div
                  v-if="!workout.editing"
                  style="padding: 5px"
                  class="grid-3col grid-center"
                >
                  <router-link :to="{ path: '/tabs/exercises/' + workout.exercise }" style="color: wheat;">
                    {{ workout.exercise }} {{ workout.sets }}x{{ workout.reps }}
                    <span v-if="workout.weight">{{ workout.weight }}kg</span>
                  </router-link>
                  <span>Done: {{ workout.setsDone }}/{{ workout.sets }}</span>
                  <div class="flex">
                    <ion-button
                      color="tertiary"
                      @click="counterPlus(workout)"
                      v-if="workout.sets > workout.setsDone"
                    >
                      <ion-icon :icon="addCircleOutline"></ion-icon>
                    </ion-button>
                    <ion-button
                      color="tertiary"
                      @click="setDone(workout)"
                      v-if="workout?.sets! <= workout?.setsDone!"
                    >
                      <ion-icon :icon="closeCircleOutline"></ion-icon>
                    </ion-button>
                    <ion-button color="tertiary" @click="onExerciseEdit(i)">
                      <ion-icon :icon="createOutline"></ion-icon>
                    </ion-button>
                  </div>
                </div>
                <div v-else class="grid grid-center py-4">
                  <label
                    >Exercise
                    <textarea cols="14" v-model="workout.exercise"></textarea>
                  </label>
                  <label>
                    reps <input type="text" v-model="workout.reps" />
                  </label>
                  <label>
                    sets <input type="number" v-model="workout.sets" />
                  </label>
                  <label>
                    weight
                    <input
                      type="number"
                      placeholder="100"
                      v-model="workout.weight"
                    />
                  </label>
                  <ion-button color="tertiary" @click="onExerciseSave(i)">
                    save
                  </ion-button>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-center py-4 w-full">
            <div class="flex items-center-flex gap-2">
              <span>Add notes or extra training done today</span>
              <ion-button color="tertiary" @click="notes">
                <ion-icon :icon="documentTextOutline"></ion-icon>
              </ion-button>
            </div>
            <textarea
              v-if="showTextArea"
              placeholder="notes"
              rows="3"
              cols="40"
              v-model="workoutSingle.notes"
            >
            </textarea>
          </div>
          <div class="grid mx-6 py-4">
            <ion-button
              color="medium"
              class="py-4"
              v-if="userStore.user && exercisesDoneBtn"
              @click="saveTofirebase"
            >
              Save workout
            </ion-button>
          </div>
          <div style="margin-top: auto !important;">
            <div class="border mx-4 flex-col bg-secondary" >
              <div class="flex py-4 flex-end">
                <div
                class="flex items-center-flex font-bold"
                style="margin-right: 1rem"
                >
                <ion-button
                class="mx-2"
                color="tertiary"
                v-if="playAudio === true"
                @click="mute"
                >
                <ion-icon :icon="volumeMediumOutline"></ion-icon>
              </ion-button>
              <ion-button
              class="mx-2"
              color="tertiary"
              v-if="playAudio === false"
              @click="unMute"
              >
              <ion-icon :icon="volumeMuteOutline"></ion-icon>
            </ion-button>
            <div
            style="width: 4ch; font-size: 2.5rem; margin-left: 1rem"
            class="mx-2"
            >
            {{ minutes }}:{{ seconds }}
                </div>
              </div>
              <div style="margin-right: 1rem">
                <ion-button class="mx-2" color="tertiary" @click="addTime">
                  <ion-icon :icon="addCircleOutline"></ion-icon>
                </ion-button>
                <ion-button color="tertiary" @click="decreaseTime">
                  <ion-icon :icon="removeCircleOutline"></ion-icon>
                </ion-button>
              </div>
            </div>
            <div class="mx-auto">
              <ion-button color="tertiary" @click="startTimer">
                <ion-icon :icon="playCircleOutline"></ion-icon>
              </ion-button>
              <ion-button color="tertiary" @click="resetTimer">
                <ion-icon :icon="refreshCircleOutline"></ion-icon>
              </ion-button>
            </div>
          </div>
          <div class="grid mx-4 my-4">
            <ion-button color="warning" @click="reset">
              reset workout
            </ion-button>
            <div style="min-height: 50px;">
            </div>
          </div>
        </div>
          <p v-if="!userStore.user">
            btw: if you login you can save workouts and track your progress
            better
          </p>
        </section>
      </div>
      <div v-else>no workout started</div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import {
  addCircleOutline,
  createOutline,
  documentTextOutline,
  volumeMediumOutline,
  volumeMuteOutline,
  removeCircleOutline,
  playCircleOutline,
  refreshCircleOutline,
  closeCircleOutline,
} from "ionicons/icons";
import type { SingleWorkout } from "@/utils/types";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../store/userStore";
import { addCompletedWorkout, getDocument, updateWorkouts } from "../utils/fbFunctions";
import { presentToast } from "@/utils/toasts";
import lightweight from "../../assets/lightweight.mp3"

const route = useRoute();
const workoutSingle = ref<SingleWorkout | null>(null);
const startedTotalTimer = ref(false);
const showTextArea = ref(false);
const exercisesDoneBtn = ref(false);
const playAudio = ref(false);
const timeLeft = ref(180);
const newTime = ref(180);
const minutes = ref(3);
const seconds = ref<any>("00");
let interval: any;
const userStore = useUserStore();
onMounted(() => {
  const jason = localStorage.getItem("workout");
  if (jason) {
    workoutSingle.value = JSON.parse(jason);
  }
  const jason2 = localStorage.getItem("workoutStartDate");
  if (jason2) {
    startedTotalTimer.value = true;
  }
  const jason3 = localStorage.getItem("audio");
  if (jason3) {
    const ihatetypescript = JSON.parse(jason3);
    if (ihatetypescript == true) playAudio.value = true;
  }
  loopReps()
});
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath === "/tabs/tab2") {
      const jason = localStorage.getItem("workout");
      if (jason) {
        workoutSingle.value = JSON.parse(jason);
      }
      const jason2 = localStorage.getItem("workoutStartDate");
      if (jason2) {
        startedTotalTimer.value = true;
      }
    }
  }
);
function optionalStartTime() {
  const currentDate = new Date();
  localStorage.setItem("workoutStartDate", JSON.stringify(currentDate));
  startedTotalTimer.value = true;
}

function counterPlus(workout: any) {
  if (!startedTotalTimer.value) {
    const currentDate = new Date();
    localStorage.setItem("workoutStartDate", JSON.stringify(currentDate));
    startedTotalTimer.value = true;
  }
  if (workout.setsDone !== undefined) {
    workout.setsDone++;
    localStorage.setItem("workout", JSON.stringify(workoutSingle.value));
    loopReps();
    if (workout.setsDone === workout.sets) {
      resetTimer();
    } else {
      resetTimer();
      startTimer();
    }
  }
}

function setDone(workout: any) {
  if (workout.done !== undefined) {
    workout.done = true;
  }
  localStorage.setItem("workout", JSON.stringify(workoutSingle.value));
}

function onExerciseEdit(index: number) {
  workoutSingle.value.exercises[index].editing = true;
}

function onExerciseSave(index: number) {
  workoutSingle.value.exercises[index].editing = false;
  localStorage.setItem("workout", JSON.stringify(workoutSingle.value));
}

function notes() {
  showTextArea.value = !showTextArea.value;
}

async function saveTofirebase() {
  const date = new Date();
  workoutSingle.value.date = date;
  const startedTime = new Date(
    JSON.parse(localStorage.getItem("workoutStartDate"))
  );
  // @ts-ignore
  const diffInMs = Math.abs(startedTime - date);
  const diffInMinutes = Math.floor(diffInMs / 60000);
  if (20 <= diffInMinutes && diffInMinutes < 240) {
    workoutSingle.value.aproxTime = diffInMinutes + 10;
  }
  const res = await addCompletedWorkout(
    userStore.user.email_lower,
    workoutSingle.value
  );
  // @ts-ignore
  if(workoutSingle.value.madeBy === userStore.user.email_lower){
    let updateExercises : SingleWorkout = workoutSingle.value
    updateExercises.exercises = updateExercises.exercises.map((exercise : any) => ({
         ...exercise,
         done: false,
         setsDone: 0
        }));
        // @ts-ignore
        const toUpdate : any = await getDocument("workoutsPersonal",`${updateExercises.parentID}`)
        const updatedObject : any = {
            ...toUpdate,
            plans: [
              // @ts-ignore
              ...toUpdate.plans.slice(0, updateExercises.index), // Copy the plans before the desired index
              updateExercises, // Update the plan at the desired index
              // @ts-ignore
              ...toUpdate.plans.slice(updateExercises.index + 1) // Copy the plans after the desired index
            ]
          };
    await updateWorkouts(updatedObject, userStore.user.email_lower)
  }
  presentToast("Workout saved!")
  reset();
}

function mute(){
  localStorage.setItem("audio", "false");
  playAudio.value = false;
}

function unMute() {
  localStorage.setItem("audio", "true");
  playAudio.value = true;
}

function addTime() {
  timeLeft.value = timeLeft.value + 15;
  minutes.value = Math.floor(timeLeft.value / 60);
  seconds.value = timeLeft.value % 60;
  seconds.value = seconds.value < 10 ? "0" + seconds.value : seconds.value;
  newTime.value = roundToNearest15(timeLeft.value);
}

function decreaseTime() {
  timeLeft.value = timeLeft.value - 15;
  minutes.value = Math.floor(timeLeft.value / 60);
  seconds.value = timeLeft.value % 60;
  seconds.value = seconds.value < 10 ? "0" + seconds.value : seconds.value;
  newTime.value = roundToNearest15(timeLeft.value);
}
function roundToNearest15(number: number) {
  return Math.ceil(number / 15) * 15;
}
function playAudiofunc(){
  const audio = new Audio();
  audio.src = lightweight;
  audio.volume = 0.5
  audio.play();
}
function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
      minutes.value = Math.floor(timeLeft.value / 60);
      seconds.value = timeLeft.value % 60;
      seconds.value = seconds.value < 10 ? "0" + seconds.value : seconds.value;
    } else {
      clearInterval(interval);
      if (playAudio.value === true) {
        playAudiofunc()
      }
    }
  }, 1000);
}

function resetTimer() {
  timeLeft.value = newTime.value;
  clearInterval(interval);
  minutes.value = Math.floor(timeLeft.value / 60);
  seconds.value = timeLeft.value % 60;
  seconds.value = seconds.value < 10 ? "0" + seconds.value : seconds.value;
}

function reset() {
  resetTimer();
  workoutSingle.value = JSON.parse(localStorage.getItem("initWorkout") || "{}");
  localStorage.setItem("workout", JSON.stringify(workoutSingle.value));
  exercisesDoneBtn.value = false;
  startedTotalTimer.value = false;
  localStorage.removeItem("workoutStartDate");
}
function loopReps() {
  let total: number = 0;
  workoutSingle.value.exercises.forEach((element: any) => {
    total += element.sets - element.setsDone;
  });
  if (total < 2) {
    exercisesDoneBtn.value = true;
  }
}
</script>

<style scoped>
.done{
  background-color: rgb(13, 126, 13);
}
.started{
  background-color: rgb(202, 135, 10);
  color:black;
}
label {
  display: grid;
  place-items: center;
}

.move-right {
  transform: translateX(40);
}
</style>
