<template>
  <ion-menu side="end" content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Side bar</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">Login to get access to zyzz bot and music
      <br>
      <IonButton expand="full" @click="modalChange">Login</IonButton>

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
      <ModalLogin :isOpen="isOpen" @some-event="modalChange"></ModalLogin>
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
/* import { defineComponent } from "vue"; */
import { ref } from "vue";
const isOpen = ref<Boolean>(false);
function modalChange() {
  console.log(isOpen.value)
  isOpen.value = !isOpen.value;
}
</script>
