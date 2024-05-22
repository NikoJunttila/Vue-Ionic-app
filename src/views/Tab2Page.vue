<template>
  <ion-page>
    <MenuComponent></MenuComponent>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-button @click="modalChange" expand="block">Open</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import MenuComponent from '@/components/MenuComponent.vue';
import { ref } from 'vue';
const isOpen = ref<Boolean>(false)
function modalChange(){
  isOpen.value = !isOpen.value
}

</script>
