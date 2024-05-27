<template>
  <ion-modal :isOpen>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$emit('someEvent')"
            ><ion-icon :icon="arrowBackCircleOutline"></ion-icon
          ></ion-button>
        </ion-buttons>
        <ion-title>Log in</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" color="primary">
      <div v-if="!isLoggedIn">
        <p>
          login/sign in.
        </p>
        <ion-list>
          <ion-item>
            <ion-input
              v-model="text"
              label="Name/Email"
              label-placement="floating"
              placeholder="Enter text"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-input
              v-model="pass"
              label="Password"
              label-placement="floating"
              type="password"
              value="password"
            ></ion-input>
          </ion-item>
          <div class="grid-2col">
            <ion-button color="tertiary" @click="login">Signin</ion-button
            ><ion-button color="warning" @click="register">Create</ion-button>
          </div>
<!--           <ion-button @click="loginGoogle" expand="full" color="danger"
            ><ion-icon :icon="logoGoogle"></ion-icon
          ></ion-button> -->
        </ion-list>
      </div>
      <div v-else>
        <p>hello user</p>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts" setup>
import {
  IonButtons,
  IonIcon,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButton,
  IonItem,
  IonInput,
  IonList,
} from "@ionic/vue";
import { presentToast } from "@/utils/toasts";
import { arrowBackCircleOutline, logoGoogle } from "ionicons/icons";
import { onMounted, ref } from "vue";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { createDocument, getDocument } from "@/utils/fbFunctions";
const emit = defineEmits();
import { auth } from "../utils/firebase";
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

const text = ref("");
const pass = ref("");

async function register() {
  try {
    const data = await createUserWithEmailAndPassword(
      auth,
      text.value,
      pass.value
    );
    const userDoc = await getDocument("users", text.value.toLowerCase());
    if (userDoc) {
      emit("someEvent");
      presentToast("Welcome!");
      return;
    }
    const user = data.user;
    const emailLower = text.value.toLowerCase();
    const userObj = {
      accountType: "normie",
      displayName: emailLower,
      displayName_lower: emailLower,
      email: text.value,
      email_lower: emailLower,
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/portfolio-5756d.appspot.com/o/uploads%2F1679212379254_1367902251612x612.jpg?alt=media&token=d8828d33-d1ad-45aa-bbf7-2063923e7f6c",
    };
    const response = await createDocument("user", emailLower, userObj);
    emit("someEvent");
    presentToast("Welcome!");
  } catch (e) {
    presentToast(`${e}`);
  }
}
async function login() {
  try {
    const data = await signInWithEmailAndPassword(auth, text.value, pass.value);
    presentToast("Signed in");
    emit("someEvent");
  } catch (e) {
    presentToast(`${e}`);
  }
}
const props = defineProps({
  isOpen: Boolean,
  isLoggedIn: Boolean,
});
const signInWithGoogle = async () => {
  const result = await FirebaseAuthentication.signInWithGoogle();
  return result.user;
};
async function loginGoogle() {
  try {
    const user = await signInWithGoogle()
    checkAndCreateUserDocument(user);
    emit("someEvent");
    presentToast("Signed in");
  } catch (err) {
    presentToast(`${err}`);
  }
}

async function checkAndCreateUserDocument(user: any) {
  //@ts-ignore
  const userDoc = await getDocument("users", user.email.toLowerCase());
  if (!userDoc) {
    const userObj = {
      accountType: "normie",
      displayName: user?.displayName,
      email: user.email,
      email_lower: user.email.toLowerCase(),
      photoURL: user.photoURL,
    };
    await createDocument("user", user.email.toLowerCase(), userObj);
  }
  return
}
</script>
