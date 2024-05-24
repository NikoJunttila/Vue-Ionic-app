<!-- @ts-nocheck -->
<template>
  <ion-content>
    <div class="music-player flex-col">
      <label
        >Select genre:
        <select name="genre" v-model="selected">
          <option v-for="g of genres" :value="g">{{ g }}</option>
        </select>
      </label>
      <div class="grid-3col">
        <ion-button :disabled="currentIndex === 0" @click="prevSong"
          >Prev</ion-button
        >
        <ion-button @click="togglePlay">{{
          isPlaying ? "Pause" : "Play"
        }}</ion-button>
        <ion-button @click="nextSong">Next</ion-button>
      </div>
      <audio
        ref="audio"
        :src="currentSong.url"
        @timeupdate="updateTime"
        @ended="onEnded"
      ></audio>
      <div>
        <p>{{ currentTime }} / {{ duration }}</p>
        <p>Now playing:{{ currentSong.artist }} - {{ currentSong.name }}</p>
      </div>
      <div class="volume-control">
        <ion-label>Volume</ion-label>
        <ion-range
          :min="0"
          :max="1"
          :step="0.01"
          v-model="volume"
          @ionChange="changeVolume"
        ></ion-range>
      </div>
    </div>
      <div class="song-list-container grid-1col gap-2">
        <button class="song-list" @click="changeSong(index)" v-for="(song, index) of songs">{{ song.artist }} - {{ song.name }}</button>
      </div>
  </ion-content>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { IonButton, IonContent, IonLabel, IonRange } from "@ionic/vue";
import { fetchDocumentsWhere } from "@/utils/fbFunctions";
import { genresGlobal } from "@/utils/variables";
import type { song } from "@/utils/types";
const songs = ref([
  {
    name: "Tiktok star",
    artist: "unknown",
    genre: "idk",
    url: "https://firebasestorage.googleapis.com/v0/b/portfolio-5756d.appspot.com/o/music%2Ftiktokstar.mp4?alt=media&token=0b3c1fd4-7722-41b9-94d1-fd0f141b8eaf",
  },
  {
    name: "Bubble gum",
    artist: "unknown",
    genre: "idk",
    url: "https://firebasestorage.googleapis.com/v0/b/portfolio-5756d.appspot.com/o/music%2Fbubblegum%20bitch%20-%20hardstyle%20(1).mp3?alt=media&token=5e2f939d-8181-45a8-9b84-b2a06899ba0a",
  },
  {
    name: "save me",
    artist: "unknown",
    genre: "idk",
    url: "https://firebasestorage.googleapis.com/v0/b/portfolio-5756d.appspot.com/o/music%2F%F0%9D%98%9A%F0%9D%98%A2%F0%9D%98%B7%F0%9D%98%A6%20%F0%9D%98%AE%F0%9D%98%A6%20(1).mp3?alt=media&token=5a68822a-f3ab-44ee-a273-1bd990f4bcb0",
  },
]);
const genres = genresGlobal;
const selected = ref("Rock");
const currentIndex = ref(0);
const currentSong = ref<song>(songs.value[currentIndex.value]);

const audio = ref<any>(null);
const isPlaying = ref(false);
const currentTime = ref("0:00");
const duration = ref("0:00");
const volume = ref(0.2); // Default volume set to 20%

function changeSong(index : number){
  currentIndex.value = index;
  currentSong.value = songs.value[currentIndex.value]
}

function togglePlay() {
  if (!audio.value) return;
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }

  isPlaying.value = !isPlaying.value;
}

function nextSong() {
  currentIndex.value = (currentIndex.value + 1) % songs.value.length;
  currentSong.value = songs.value[currentIndex.value];
}
function prevSong() {
  if (currentIndex.value === 0) return;
  currentIndex.value = currentIndex.value - 1;
  currentSong.value = songs.value[currentIndex.value];
}
function updateTime() {
  if (audio.value) {
    currentTime.value = formatTime(audio.value.currentTime);
    duration.value = formatTime(audio.value.duration);
  }
}

function onEnded() {
  nextSong();
}

function formatTime(time : any) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function changeVolume() {
  if (audio.value) {
    audio.value.volume = volume.value;
  }
}
watch(currentSong, () => {
  if (audio.value) {
    setTimeout(() => {
      audio.value.load();
      audio.value.play();
      isPlaying.value = true;
    }, 100);
  }
});

watch(selected, async () => {
  const res : any = await fetchDocumentsWhere("music", "genre", selected.value, 100);
  if (res.length === 0) return;
  songs.value = res;
  shuffle(songs.value);
  currentSong.value = songs.value[currentIndex.value];
});

watch(volume, changeVolume);

onMounted(async () => {
  const res : any = await fetchDocumentsWhere("music", "genre", selected.value, 100);
  if (res.length !== 0) {
    songs.value = res;
  }
  shuffle(songs.value);
  currentSong.value = songs.value[currentIndex.value];
  if (audio.value) {
    audio.value.addEventListener("loadedmetadata", () => {
      duration.value = formatTime(audio.value.duration);
    });
    audio.value.addEventListener("play", () => {
      isPlaying.value = true;
    });
    audio.value.addEventListener("pause", () => {
      isPlaying.value = false;
    });
    audio.value.volume = volume.value; // Initialize the volume
  }
});
onUnmounted(() => {
  if (audio.value) {
    audio.value.removeEventListener("loadedmetadata", () => {
      duration.value = formatTime(audio.value.duration);
    });
    audio.value.removeEventListener("play", () => {
      isPlaying.value = true;
    });
    audio.value.removeEventListener("pause", () => {
      isPlaying.value = false;
    });
  }
});
function shuffle(array : any) {
  let currentIndex = array.length;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}
</script>

<style scoped>
.music-player {
  text-align: center;
  padding: 20px;
}
.song-list-container{
  background-color: var(--ion-color-secondary);
  padding: 10px 0;
  overflow-y: scroll; 
  height:230px;
}
.song-list{
  text-align: center;
  padding: 5px;
  margin: 0 5px;
  font-size: 1rem;
  background-color: var(--ion-color-tertiary);
  color: var(--ion-color-secondary-contrast);
  border-radius: 10px;
}
.volume-control {
  margin-top: 20px;
}
</style>
