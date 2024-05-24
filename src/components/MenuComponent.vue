<template>
  <ion-menu side="end" content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Side bar</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      {{ JSON.stringify(userStore.user) }}
      <div v-if="!userStore.user">
        Login to get access to zyzz bot and music
        <br>
        <IonButton expand="full" @click="modalChange">Login</IonButton>
      </div>
      <div v-else>
        zyzz bot activated soon
        <ion-button @click="logout">Logout</ion-button>
      </div>
    </ion-content>
  </ion-menu>
  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <slot></slot>
      <ModalLogin :isOpen="isOpen" @some-event="modalChange" :isLoggedIn="isLoggedIn"></ModalLogin>
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
  IonButton
} from "@ionic/vue";
import ModalLogin from "./ModalLogin.vue";
import {signOut} from "firebase/auth"
import {auth} from "../utils/firebase"
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/userStore";
const isOpen = ref(false);
const isLoggedIn = ref(false)
const userStore = useUserStore();
function modalChange() {
  isOpen.value = !isOpen.value;
}
function logout(){
  signOut(auth).then(() => {
  console.log("logged out")
}).catch((error) => {
  console.log(error)
});
}
const userRef = ref(null)
</script>
