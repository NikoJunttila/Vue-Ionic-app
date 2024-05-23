<template>
    <ion-content>
      <div class="music-player flex-col">
        <label>Select a genre:
            <select name="genre" v-model="selected">
                <option v-for="g of genres" :value="g">{{g}}</option>
            </select>
        </label>
        <div class="grid-3col">
          <ion-button :disabled="currentIndex === 0" @click="prevSong">Prev</ion-button>
          <ion-button @click="togglePlay">{{ isPlaying ? 'Pause' : 'Play' }}</ion-button>
          <ion-button @click="nextSong">Next</ion-button>
        </div>
          <audio ref="audio" :src="currentSong.url" @timeupdate="updateTime" @ended="onEnded"></audio>
        <div>
          <p>{{ currentTime }} / {{ duration }}</p>
          <p>Now playing:{{ currentSong.artist }} - {{ currentSong.name }}</p>
        </div>
        <div class="volume-control">
          <ion-label>Volume</ion-label>
          <ion-range min="0" max="1" step="0.01" v-model="volume" @ionChange="changeVolume"></ion-range>
        </div>
      </div>
      <ul>
        <li v-for="song of songs">
       {{ song.artist }} - {{ song.name }}
        </li>
      </ul>
    </ion-content>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onUnmounted } from 'vue';
  import { IonButton, IonContent, IonLabel, IonRange } from '@ionic/vue';
  import { fetchDocumentsWhere } from '@/utils/fbFunctions';
  
  const songs = ref([
    { name: 'Tiktok star', artist:"unknown",genre:"idk", url: 'https://firebasestorage.googleapis.com/v0/b/portfolio-5756d.appspot.com/o/music%2Ftiktokstar.mp4?alt=media&token=0b3c1fd4-7722-41b9-94d1-fd0f141b8eaf' },
    { name: 'Bubble gum',artist:"unknown",genre:"idk", url: 'https://firebasestorage.googleapis.com/v0/b/portfolio-5756d.appspot.com/o/music%2Fbubblegum%20bitch%20-%20hardstyle%20(1).mp3?alt=media&token=5e2f939d-8181-45a8-9b84-b2a06899ba0a' },
    { name: 'save me',artist:"unknown", genre:"idk", url: 'https://firebasestorage.googleapis.com/v0/b/portfolio-5756d.appspot.com/o/music%2F%F0%9D%98%9A%F0%9D%98%A2%F0%9D%98%B7%F0%9D%98%A6%20%F0%9D%98%AE%F0%9D%98%A6%20(1).mp3?alt=media&token=5a68822a-f3ab-44ee-a273-1bd990f4bcb0' },
  ]);
  const genres = [
    "Bängers",
    "Rock",
    "Hardstyle"
  ]
  const selected = ref("Rock")
  const currentIndex = ref(0);
  const currentSong = ref(songs.value[currentIndex.value]);
  
  const audio = ref(null);
  const isPlaying = ref(false);
  const currentTime = ref('0:00');
  const duration = ref('0:00');
  const volume = ref(1.0); // Default volume set to 100%
  
  function togglePlay(){
    if (!audio.value) return;
    if (isPlaying.value) {
      audio.value.pause();
    } else {
      audio.value.play();
    }
  
    isPlaying.value = !isPlaying.value;
  };
  
  function nextSong(){
    currentIndex.value = (currentIndex.value + 1) % songs.value.length;
    currentSong.value = songs.value[currentIndex.value];
  };
  function prevSong(){
    if(currentIndex.value === 0) return
    currentIndex.value = currentIndex.value - 1
    currentSong.value = songs.value[currentIndex.value];
  }
  function updateTime(){
    if (audio.value) {
      currentTime.value = formatTime(audio.value.currentTime);
      duration.value = formatTime(audio.value.duration);
    }
  };
  
  function onEnded(){
    nextSong();
  };
  
  function formatTime(time){
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  function changeVolume(){
    if (audio.value) {
      audio.value.volume = volume.value;
    }
  };
  watch(currentSong, () => {
    if (audio.value) {
    setTimeout(()=> {
        audio.value.load();
        audio.value.play();
        isPlaying.value = true;
    },100)
    }
  });

  watch(selected, async() => {
    const res = await fetchDocumentsWhere("music","genre",selected.value,100)
    if (!res.length != 0) return
    songs.value = res
    shuffle(songs.value)
    currentSong.value = songs.value[currentIndex.value];
  })
  watch(volume, changeVolume);
  onMounted(async() => {
    songs.value = await fetchDocumentsWhere("music","genre",selected.value,100)
    shuffle(songs.value)
    currentSong.value = songs.value[currentIndex.value];
    if (audio.value) {
      audio.value.addEventListener('loadedmetadata', () => {
        duration.value = formatTime(audio.value.duration);
      });
      audio.value.addEventListener('play', () => {
        isPlaying.value = true;
      });
      audio.value.addEventListener('pause', () => {
        isPlaying.value = false;
      });
      audio.value.volume = volume.value; // Initialize the volume
    }
  });
  function shuffle(array) {
  let currentIndex = array.length;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}
  onUnmounted(() => {
    if (audio.value) {
      audio.value.removeEventListener('loadedmetadata', () => {
        duration.value = formatTime(audio.value.duration);
      });
      audio.value.removeEventListener('play', () => {
        isPlaying.value = true;
      });
      audio.value.removeEventListener('pause', () => {
        isPlaying.value = false;
      });
    }
  });

  </script>
  
  <style scoped>
  .music-player {
    text-align: center;
    padding: 20px;
  }
  
  .volume-control {
    margin-top: 20px;
  }
  </style>