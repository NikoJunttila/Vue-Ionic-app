<template>
  <ion-page>
    <ion-content color="primary">
      <div style="background-color: red">
        <label
          >email:
          <input v-model="email" type="text" />
        </label>
        <label
          >password
          <input v-model="pass" type="text" />
        </label>
        <button
          style="width: 40px; height: 40px; background-color: aqua"
          @click="linkEmailPasswordToGoogle"
        >
          link gmail
        </button>
      </div>
      <MusicUploader></MusicUploader>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import MusicUploader from "@/components/MusicUploader.vue";
import { ref } from "vue";
import {
  signInWithPopup,
  GoogleAuthProvider,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../utils/firebase";
const email = ref("");
const pass = ref("");

async function linkEmailPasswordToGoogle() {
  var credential = EmailAuthProvider.credential(email.value, pass.value);

  const res = await linkWithCredential(auth.currentUser, credential)
    .then((usercred) => {
      var user = usercred.user;
      console.log("Email/password account linked to Google account:", user);
    })
    .catch((error) => {
      console.error("Error linking email/password accorunt:", error);
    });
}
</script>
