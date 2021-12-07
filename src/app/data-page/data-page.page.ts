import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, NavController, NavParams } from '@ionic/angular';
import { Settings } from 'http2';

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.page.html',
  styleUrls: ['./data-page.page.scss'],
})
export class DataPagePage implements OnInit {
  public isScanning: boolean = false;
  public isConnected: boolean = false;

  private peripheral;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private zone: NgZone,
    public settings: Settings,
    private alertCtrl: AlertController,
  ) { 

    console.log('data-page constructor');

    this.peripheral = navParams.get('state');
    console.log('state key', this.peripheral);
    this.peripheral = navParams.get('peripheral');
    console.log('peripheral', this.peripheral);
  }

  ngOnInit() {
  }

}
