<template>
    <ion-modal :is-open>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="$emit('someEvent')"><ion-icon :icon="arrowBackCircleOutline"></ion-icon></ion-button>
          </ion-buttons>
          <ion-title>Log in</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding" color="primary">
       <slot></slot>
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
} from '@ionic/vue';
import { arrowBackCircleOutline } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/core/components';
import { ref } from 'vue';
const props = defineProps({
  isOpen : Boolean
});
</script>
