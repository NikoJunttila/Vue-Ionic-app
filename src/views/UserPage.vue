<template>
  <ion-page>
    <ion-content>
      <h1>admin stuff</h1>
      {{ JSON.stringify(userStore.user) }}
      <ion-button @click="logout">Logout</ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent,IonButton } from "@ionic/vue";
import { useUserStore } from "../store/userStore";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

const userStore = useUserStore();
function logout() {
  signOut(auth)
    .then(() => {
      console.log("logged out");
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>
