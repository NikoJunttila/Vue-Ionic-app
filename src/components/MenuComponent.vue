<template>
  <ion-menu side="end" content-id="main-content">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Chat with Zyzz</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="primary" class="ion-padding">
      <div v-if="!userStore.user">
        Login to get access to zyzz bot and music
        <br />
        <IonButton color="tertiary" expand="full" @click="modalChange">Login</IonButton>
      </div>
      <div v-else>
        <div class="chat-container grid gap-2">
          <div
            class="border bg-secondary rounded"
            style="padding: 0.3rem"
            v-for="chat of generated_text"
          >
            <p
              class="font-bold"
              style="font-size: 1rem"
              v-if="chat.role !== 'user'"
            >
              Zyzz bot
            </p>
            <p>{{ chat.content }}</p>
          </div>
          <div
            class="border bg-secondary rounded flex items-center-flex"
            style="padding: 0.3rem"
            v-if="loading"
            >
            <span style="margin:0 5px;">Responding </span><ion-spinner style="transform: translateY(3px);" name="dots" color="light"></ion-spinner>
          </div>
          <div>
          
          </div>
        </div>
        <div class="grid" style="margin-top: 10px">
          <textarea
            rows="5"
            class="rounded"
            style="padding: 0.2rem;color: black;"
            placeholder="ask zyzz bot for exercise info / replacement for exercise or anything you need help with!"
            v-model="input_text"
            id="user-input"
            type="text"
            autocomplete="off"
          ></textarea>
          <ion-button color="tertiary" @click="sendText" id="sendButton"
            >Send message</ion-button
          >
          <ion-button
            color="warning"
            @click="clearText"
            style="margin-top: 15px"
            id="clear"
            >Clear chat</ion-button
          >
        </div>
      </div>
    </ion-content>
  </ion-menu>
  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar color="success">
        <ion-buttons slot="end">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <div class="w-full">
          <ion-thumbnail v-if="!userStore.user" @click="isOpen = true" class="mx-auto move-right" >
            <img
              alt="Silhouette of mountains"
              src="https://ionicframework.com/docs/img/demos/thumbnail.svg"
            />
          </ion-thumbnail>
          <ion-thumbnail v-else router-link="/tabs/profile" class="mx-auto move-right">
            <img
              alt="user"
              :src="userStore.user.photoURL"
            />
          </ion-thumbnail>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <slot></slot>
      <ModalLogin
        :isOpen="isOpen"
        @some-event="modalChange"
        :isLoggedIn="isLoggedIn"
      ></ModalLogin>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonThumbnail,
  IonSpinner
} from "@ionic/vue";
import ModalLogin from "./ModalLogin.vue";
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/userStore";
import { openai } from "../utils/openAi";
const isOpen = ref(false);
const isLoggedIn = ref(false);
const userStore = useUserStore();
const input_text = ref("");
const loading = ref(false)
const generated_text = ref([
  {
    content: "Hello how can I help you today?",
    role: "zyzz bot",
  },
]);
async function sendText() {
  loading.value = true
  const promtObj : any = {
    role: "user",
    content: input_text.value,
  };
  generated_text.value.push(promtObj);
  const prompt = input_text.value;
  const response : any = await openai.chat.completions.create({
    messages: [promtObj],
    model: "gpt-4o",
  });
  loading.value = false
  generated_text.value.push(response.choices[0].message);
  input_text.value = "";

}
function clearText() {
  generated_text.value = [
    {
      content: "Hello how can I help you today?",
      role: "zyzz bot",
    },
  ];
}
function modalChange() {
  isOpen.value = !isOpen.value;
}
const userRef = ref(null);
</script>
<style scoped>
.move-right{
  transform: translateX(25px);
}
</style>