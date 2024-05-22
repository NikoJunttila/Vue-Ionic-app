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
                login/sign in. if account hasnt been created this will create a new
                account for you
            </p>
            <ion-list>
                <ion-item>
                    <ion-input v-model="text" label="Name/Email" label-placement="floating" placeholder="Enter text"></ion-input>
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
                    <ion-button @click="login">Signin</ion-button><ion-button @click="register">Create</ion-button>
                </div>
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
import { arrowBackCircleOutline } from "ionicons/icons";
import { onMounted, ref } from "vue";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth"
import {auth} from "../utils/firebase"
const text = ref('')
const pass = ref('')
async function register(){
    try{
        const data = await createUserWithEmailAndPassword(auth, text.value,pass.value)
        console.log(`succesfull: ${data}`)
    }catch (e){
        console.log(e)
    }
}
async function login(){
    console.log("login")
    try{
        const data = await signInWithEmailAndPassword(auth, text.value,pass.value)
        console.log(`succesfull: ${data}`)
    }catch (e){
        console.log(e)
    }
}
const props = defineProps({
  isOpen: Boolean,
  isLoggedIn: Boolean
});
</script>