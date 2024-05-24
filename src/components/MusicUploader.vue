<template>
  <ion-content>
    <div class="upload-container flex-col gap-2">
      <label
        >Select a genre:
        <select name="genre" v-model="selected">
          <option value="">--Please choose an option--</option>
          <option v-for="g of genres" :value="g">{{ g }}</option>
        </select>
      </label>
      <label>
        Artist/Band:
        <input type="text" v-model="artist" placeholder="artist" />
      </label>
      <label>
        Song name:
        <input type="text" v-model="songName" placeholder="song name" />
      </label>
      <input type="file" @change="handleFileChange" accept=".mp3" />
      <ion-button @click="uploadFile" :disabled="!file">Upload</ion-button>
      <p v-if="uploading">Uploading... {{ uploadProgress }}%</p>
      <p v-if="downloadURL">
        File available at:
        <a :href="downloadURL" target="_blank">{{ downloadURL }}</a>
      </p>
    </div>
  </ion-content>
</template>

<script setup>
import { ref } from "vue";
import { IonButton, IonContent } from "@ionic/vue";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { createDocument } from "@/utils/fbFunctions";
import { storage } from "../utils/firebase";
import { genresGlobal } from "@/utils/variables";
const genres = genresGlobal;
const selected = ref("");
const artist = ref("");
const songName = ref("")
const file = ref(null);
const uploading = ref(false);
const uploadProgress = ref(0);
const downloadURL = ref("");
const handleFileChange = (event) => {
  file.value = event.target.files[0];
};
const toSave = ref(null);
const uploadFile = () => {
  if (!file.value) return;
  if (!selected.value) return;
  if (!songName.value) return;
  const storageReference = storageRef(
    storage,
    `music/${selected.value}/${songName.value}`
  );
  const uploadTask = uploadBytesResumable(storageReference, file.value);

  uploading.value = true;

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploadProgress.value = Math.round(progress);
    },
    (error) => {
      console.error("Upload failed", error);
      uploading.value = false;
    },
    async () => {
      downloadURL.value = await getDownloadURL(uploadTask.snapshot.ref);
      uploading.value = false;
      const musicObj = {
        name: songName.value,
        artist: artist.value,
        url: downloadURL.value,
        genre: selected.value,
      };
      const trimmed = songName.value.split(" ").join("");
      createDocument("music", trimmed, musicObj);
      file.value = null;
      songName.value = ""
      artist.value = ""
    }
  );
};
function submit() {
  toSave.value.artist = artist.value;
  console.log(toSave);
}
</script>

<style scoped>
.upload-container {
  text-align: center;
  padding: 20px;
}
</style>
