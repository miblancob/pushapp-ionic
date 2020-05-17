import { Component, OnInit } from "@angular/core";
import { PushService } from "../services/push.service";
import { OSNotificationPayload } from "@ionic-native/onesignal/ngx";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  mensajes: OSNotificationPayload[] = [];

  constructor(private pushService: PushService) {}

  ngOnInit(): void {
    this.pushService.pushListener.subscribe((notificacion) => {
      this.mensajes = [notificacion, ...this.mensajes];
    });
  }

  getMensajes() {
    return this.pushService.mensajes;
  }

  async ionViewWillEnter() {
    this.mensajes = await this.pushService.getMensajes();
  }

  getUserId() {
    return this.pushService.userId;
  }

  async borrarMensajes() {
    await this.pushService.borrarMensajes();
    this.mensajes = [];
  }
}
