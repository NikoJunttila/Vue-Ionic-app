import {toastController} from "@ionic/vue";
export async function presentToast(message : string){
    const toast = await toastController.create({
      message: message,
      duration: 1500,
      position: "top",
    });
    await toast.present();
  }