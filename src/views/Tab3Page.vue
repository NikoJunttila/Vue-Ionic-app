<template>
  <ion-page>
    <ExploreContainer></ExploreContainer>
    <MusicPlayer></MusicPlayer>
    <IonButton href="/tabs/admin">Admin</IonButton>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import MusicPlayer from '@/components/MusicPlayer.vue';
</script>
