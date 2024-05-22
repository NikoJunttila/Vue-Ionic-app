<template>
  <ion-menu side="end" content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Side bar</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div v-if="!isLoggedIn">
        Login to get access to zyzz bot and music
        <br>
        <IonButton expand="full" @click="modalChange">Login</IonButton>
      </div>
      <div v-else>
        zyzz bot activated soon
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
import {onAuthStateChanged} from "firebase/auth"
import {auth} from "../utils/firebase"
import { ref, onMounted } from "vue";
const isOpen = ref<Boolean>(false);
const isLoggedIn = ref(false)
function modalChange() {
  console.log(isOpen.value)
  isOpen.value = !isOpen.value;
}
onMounted(()=> {
    onAuthStateChanged(auth, (user) => {
        console.log(user)
        if (user){
            isLoggedIn.value = true
        } else {
            isLoggedIn.value = false
        }
    })
})
</script>
