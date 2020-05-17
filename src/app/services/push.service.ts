import { Injectable, EventEmitter } from "@angular/core";
import {
  OneSignal,
  OSNotification,
  OSNotificationPayload,
} from "@ionic-native/onesignal/ngx";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class PushService {
  mensajes: OSNotificationPayload[] = [];
  userId: string;

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(private oneSignal: OneSignal, private storage: Storage) {
    this.cargarMensajes();
  }

  configuracionInicial() {
    this.oneSignal.startInit(
      "64d6989e-d8cc-441f-9cf7-81ff6114144a",
      "520166299224"
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.Notification
    );

    this.oneSignal.handleNotificationReceived().subscribe((notificacion) => {
      // do something when notification is received
      this.notificacionRecibida(notificacion);
    });

    this.oneSignal
      .handleNotificationOpened()
      .subscribe(async (notificacion) => {
        // do something when a notification is opened
        await this.notificacionRecibida(notificacion.notification);
      });

    this.oneSignal.getIds().then((info) => {
      this.userId = info.userId;
    });

    this.oneSignal.endInit();
  }

  async notificacionRecibida(notificacion: OSNotification) {
    await this.cargarMensajes();
    const payload = notificacion.payload;

    const existePush = this.mensajes.find(
      (mensaje) => mensaje.notificationID === payload.notificationID
    );

    if (existePush) {
      return;
    }

    this.mensajes = [payload, ...this.mensajes];
    this.pushListener.emit(payload);
    await this.guardarMensajes();
  }

  guardarMensajes() {
    this.storage.set("mensajes", this.mensajes);
  }

  async cargarMensajes() {
    this.mensajes = (await this.storage.get("mensajes")) || [];
    return this.mensajes;
  }

  async getMensajes() {
    await this.cargarMensajes();
    return this.mensajes;
  }

  async borrarMensajes() {
    await this.storage.clear();
    this.mensajes = [];
    this.guardarMensajes();
  }
}
