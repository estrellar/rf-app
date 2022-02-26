import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // to scan or stop
  isScanning:  boolean = false;

  // messaage for footer
  statusMessage: string;

  // list of scanned devices
  devices = [];
  private scanId: Date;

  // list of filtered devices
  peripherals = [];

  // connected peripherals
  peripheral: any = {};

  constructor(
    private ble: BLE,
    private zone: NgZone,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
  ) {
    console.log('home page init');
    
    //this.sendText = this.sendText.bind(this);
  }

  ionViewDidLoad() {
    console.log('loaded home page');
  }


  public scan() {
    console.log('scanning');
    
    this.scanId = new Date();
    this.devices= [];
    this.isScanning = true;
    // todo: add uuid for feather device service 
    this.ble.startScan([]).subscribe(
      device => this.deviceDetected( device ),
      error => this.scanError( error ),
      () => console.log('stopped scanning')
    );

    setTimeout(() => this.stopScan(), 10000);
  }

  public stopScan() {
    this.ble.stopScan().then( () => {
      this.isScanning = false;
    });
    this.removeAbsentDevices();
  }

  private removeAbsentDevices() {
    this.peripherals.filter( d => d.scanId !== this.scanId )
      .map(d  => this.removeAbsentDevice(d));
    this.peripherals = this.peripherals.filter(d => d.scanId === this.scanId);
  }

  private removeAbsentDevice(device){
    console.log("removed " + JSON.stringify( device ));
  }

  scanError(error) {
    this.setStatus("Error " + error);
    let alert = this.alertCtrl.create({
      header: 'Scanning: '+error,
      buttons : ['OK']
    });
  }

  public deviceDetected(device){
    if(device.name !== undefined){
      console.log('detected'+device.name);

      if(this.deviceAlreadySeen(device)){
        console.log('filtered'+JSON.stringify(device, null, 2));
        this.updateExistingDevice(device);
      }else{
        console.log('added'+JSON.stringify(device, null, 2));
        this.devices.push(device);
      }
    }
  }

  public deviceAlreadySeen(device) : boolean{
    let d  = this.devices.find(d => d.name === device.name);
    return d !== undefined;
  }

  public updateExistingDevice(newDevice){
    let deviceIndex = -1;

    if(this.peripherals.find(d => d.name === newDevice.name) === undefined){
      deviceIndex = this.peripherals.push(newDevice) - 1;
    }else{
      deviceIndex = this.peripherals.findIndex(d => d.id === newDevice.id);
      let oldDevice = this.devices[deviceIndex];

      newDevice.movement = this.compareRSSI(newDevice, oldDevice);
      this.peripherals[deviceIndex] = newDevice;
    }

    this.zone.run(() => {
      this.peripherals.sort((a, b) => {
        return this.compareRSSI(a, b) ? 0 : 1;
      });
    });
  }

  private compareRSSI(device1, device2) : boolean {
    let rssi1 = this.getRssiAsAbsInt(device1);
    let rssi2 = this.getRssiAsAbsInt(device2);
    return rssi1 < rssi2;
  }

  private getRssiAsAbsInt(device){
    return Math.abs(parseInt(device.rssi));
  }

  async redirectToDataPage(device){
    this.stopScan();
    this.setStatus('Connecting to '+ device.name || device.id);

    return this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDisconnected(peripheral)
    );
  }

  async onConnected(peripheral){
    let _pwd = "";

    this.zone.run(() => {
      this.setStatus("Password");
      this.peripheral = peripheral;
    });
    
    //test peripheral connection at this scope
    //console.log("PERIPHERAL:", peripheral);
    // this.peripheral.data = this.ble.startNotification(peripheral.id,  '1815', '2A58').subscribe(
    //   rx => { console.log(rx); },
    //   error => { console.log(error); }
    // )

    let navigationExtras: NavigationExtras  = {
      state:
      {
        peripheral: this.peripheral,
        ble: this.ble
      }
    };

     this.navCtrl.navigateForward('data-page', navigationExtras);
  }

  public onDisconnected(peripheral){
    let alert = this.alertCtrl.create({
      header: "The device disconnected",
      buttons: ["OK"]
    });
    //alert.present();
    this.navCtrl.navigateForward('data-page');
  }

  setStatus(message){
    console.log(message);
    this.zone.run(() => {
      this.statusMessage = message;
    });
  }

}
