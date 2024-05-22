<!-- <template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ title }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <h2>Text Input</h2>
  <input v-model="text">
  <p>{{ text }}</p>
      <h1 :style="{ color }" :title>{{ text }}</h1>
      <h2>{{ counter }}</h2>
      <ion-button expand="full" @click="test">counter++</ion-button>
      <ion-button expand="full" @click="list.push(counter++)">push</ion-button>

      <ul v-if="list.length">
        <li v-for="item of list">{{ item }}
        <div>
            test
        </div>
        </li>
      </ul>
      <slot></slot>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/vue";
import { ref, computed } from "vue";


const props = defineProps({
  message: String,
  title: String,
  initialCounter: Number,
});

const counter = ref(props.initialCounter);
const color = ref("green");
const list = ref([1, 2, 3]);
const text = ref(props.message)
function test() {
  console.log(counter.value++);
}
</script>
 -->