<template>
  <ion-page>
    <ion-content color="primary" :fullscreen="true">
      <div v-if="workoutSingle">
        <section>
          <div class="flex-col flex-items-center mx-4 gap-2">
            <div
              class="grid grid-center"
              v-if="user.length > 1 && !startedTotalTimer"
            >
              <ion-button color="secondary" @click="optionalStartTime">
                Start workout timer
              </ion-button>
            </div>
            <div
              class="rounded border"
              v-for="(workout, i) in workoutSingle.exercises"
              :key="i"
            >
              <ul>
                <div v-if="!workout.editing">
                  <li
                    style="margin-right: 10px"
                    class="grid-3col grid-center"
                    v-if="!workout.done"
                  >
                    <span>
                      {{ workout.exercise }} {{ workout.sets }}x
                      {{ workout.reps }}
                      <span v-if="workout.weight">{{ workout.weight }}kg</span>
                    </span>
                    <span>Done: {{ workout.setsDone }}/{{ workout.sets }}</span>
                    <div class="flex">
                      <ion-button
                        color="secondary"
                        @click="counterPlus(workout)"
                        v-if="workout?.sets! > workout?.setsDone!"
                      >
                        <ion-icon :icon="addCircleOutline"></ion-icon>
                      </ion-button>
                      <ion-button
                        color="secondary"
                        @click="setDone(workout)"
                        v-if="workout?.sets! <= workout?.setsDone!"
                      >
                        delete
                      </ion-button>
                      <ion-button color="secondary" @click="onExerciseEdit(i)">
                        <ion-icon :icon="createOutline"></ion-icon>
                      </ion-button>
                    </div>
                  </li>
                </div>
                <div v-else>
                  <textarea cols="14" v-model="workout.exercise"></textarea>
                  <div>
                    <span>
                      reps: <input type="text" v-model="workout.reps" />
                    </span>
                    <span>
                      sets: <input type="number" v-model="workout.sets" />
                    </span>
                  </div>
                  <span>
                    weight(kg):
                    <input
                      type="number"
                      placeholder="100"
                      v-model="workout.weight"
                    />
                  </span>
                  <ion-button color="secondary" @click="onExerciseSave(i)">
                    save
                  </ion-button>
                </div>
              </ul>
            </div>
          </div>
          <div>
            <div class="flex items-center-flex mx-6 gap-2">
              <span>Add notes or extra training done today</span>
              <ion-button color="secondary" @click="testeri">
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
          <ion-button
            color="secondary"
            v-if="user.length > 1 && showAdd"
            @click="setAsCompleted"
          >
            Save workout
          </ion-button>
          <div class="border mx-4 flex-col">
            <div class="flex items-center-flex mx-auto py-4">
              <div class="flex items-center-flex font-bold ">
                <ion-button
                  class="mx-2"
                  color="secondary"
                  v-if="playAudio === true"
                  @click="mute"
                >
                  <ion-icon :icon="volumeMediumOutline"></ion-icon>
                </ion-button>
                <ion-button
                class="mx-2"
                  color="secondary"
                  v-if="playAudio === false"
                  @click="unMute"
                >
                  <ion-icon :icon="volumeMuteOutline"></ion-icon>
                </ion-button>
                <div style="width: 4ch;font-size: 2rem;" class="mx-2" >
                  {{ minutes }}:{{ seconds }}
                </div>
              </div>
              <div>
                <ion-button class="mx-2" color="secondary" @click="addTime">
                  <ion-icon :icon="addCircleOutline"></ion-icon>
                </ion-button>
                <ion-button  color="secondary" @click="decreaseTime">
                  <ion-icon :icon="removeCircleOutline"></ion-icon>
                </ion-button>
              </div>
            </div>
            <div class="mx-auto">
              <ion-button color="secondary" @click="startTimer">
                <ion-icon :icon="playCircleOutline"></ion-icon>
              </ion-button>
              <ion-button color="secondary" @click="resetTimer">
                <ion-icon :icon="refreshCircleOutline"></ion-icon>
              </ion-button>
            </div>
          </div>
          <div class="grid mx-4 my-4">
            <ion-button color="secondary" @click="reset">
              reset workout
            </ion-button>
          </div>
          <p v-if="user.length < 2">
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
  refreshCircleOutline
} from "ionicons/icons";
import type { SingleWorkout } from "@/utils/types";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const workoutSingle = ref<SingleWorkout | null>(null);
const user = ref("testing");
const startedTotalTimer = ref(false); // your data
const showTextArea = ref(false); // your data
const showAdd = ref(false); // your data
const playAudio = ref(false); // your data
const minutes = ref(3); // your data
const seconds = ref(33); // your data
onMounted(() => {
  const jason = localStorage.getItem("exercises");
  if (jason) {
    workoutSingle.value = JSON.parse(jason);
  }
});
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath === "/tabs/tab2") {
      const jason = localStorage.getItem("exercises");
      if (jason) {
        workoutSingle.value = JSON.parse(jason);
      }
      console.log(workoutSingle.value);
    }
  }
);
function optionalStartTime() {
  // your method implementation
}

function counterPlus(workout : any) {
  // your method implementation
}

function setDone(workout:any) {
  // your method implementation
}

function onExerciseEdit(index:number) {
  // your method implementation
}

function onExerciseSave(index :number) {
  // your method implementation
}

function testeri() {
  // your method implementation
}

function setAsCompleted() {
  // your method implementation
}

function mute() {
  // your method implementation
}

function unMute() {
  // your method implementation
}

function addTime() {
  // your method implementation
}

function decreaseTime() {
  // your method implementation
}

function startTimer() {
  // your method implementation
}

function resetTimer() {
  // your method implementation
}

function reset() {
  // your method implementation
}

function goBack() {
  // your method implementation
}
</script>

<style scoped>
li {
  list-style: none;
}
</style>
