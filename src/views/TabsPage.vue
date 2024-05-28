<template>
  <ion-page>
    <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar color="success" slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon color="light" aria-hidden="true" :icon="libraryOutline" />
          <ion-label color="light">Workouts</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon color="light" aria-hidden="true" :icon="thumbsUpOutline" />
          <ion-label color="light">Active</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon color="light" aria-hidden="true" :icon="musicalNotesOutline" />
          <ion-label color="light">Music</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { musicalNotesOutline, thumbsUpOutline, libraryOutline } from 'ionicons/icons';
</script>
