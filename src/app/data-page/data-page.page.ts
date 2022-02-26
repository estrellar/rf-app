import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { AlertController, NavController, NavParams } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

type RfArray = Array<{lat: number, long: number, rf_signal: number, device_id: number}>;

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.page.html',
  styleUrls: ['./data-page.page.scss'],
  providers: [NavParams]
})

export class DataPagePage implements OnInit {

  public isScanning: boolean = false;
  public isConnected: boolean = false;

  private peripheral;

  constructor(
    private http: HttpClient,
    private geo: Geolocation,
    public navCtrl: NavController,
    public navParams: NavParams,
    private zone: NgZone,
    private ble: BLE,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    public dataArray: RfArray
  ) {
    this.route.queryParams.subscribe(_p => {
      const navParams = this.router.getCurrentNavigation().extras.state
      if(navParams)
        this.peripheral = navParams.peripheral
        this.ble.startNotification(this.peripheral.id, '1815', '2A58').subscribe(
          rx => this.receive(rx),
          error => this.receiveError(error)
        );

    });

  }

  receive(rxPacket){
    console.log('rx', rxPacket)
  }

  receiveError(error){

    while(true){
      let data = {lat: 0, long: 0, rf_signal: 0, device_id: 1};
      data.rf_signal = 4.3;
      this.geo.getCurrentPosition().then((resp) => {
        data.lat = resp.coords.latitude;
        data.long = resp.coords.longitude;
      }).catch((error) =>{
        console.log(error);
      })
      //TODO handle post
      this.http.post( "https://eee.rxestrella.com/api/rf/post", data, {
        headers: {Authorization: "Bearer 1|SoaCaOesWtatSgB38RXw4p4eqXpKP22ImETdCY"}
      });

      this.dataArray.push(data);

    }
    console.log('err receive', error)
  }

  handlePost(){

  }


  ngOnInit() {
  }

}
