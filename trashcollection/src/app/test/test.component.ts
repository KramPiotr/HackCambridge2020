import { Component, OnInit } from '@angular/core';
import * as atlas from 'azure-maps-control';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  // Azure Active Directory Authentication Client ID
  // or Shared Key Authentication KEY
  // get it from portal.azure.com
  key: string = 'FYDOOBMiyhaocurVqYOvNAvMTGqTgisUl_hkwXFO6DU';
  map: any;

  constructor(
  ) {
  }

  ngOnInit() {
    //Initialize a map instance.
    this.map = new atlas.Map('mapContainer', {
      center: [ 0.119280, 52.204939],
      zoom: 15,
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: this.key
      }
    });


    //Wait until the map resources are ready.
    this.map.events.add('ready', () => {
      //Create a HTML marker and add it to the map.
      let markers = [[0.111072, 52.206758],
            [0.113701, 52.206672],
            [0.111148, 52.208717],
            [0.118490, 52.208438],
            [0.119734, 52.204777],
            [0.119394, 52.205148],
            [0.118851, 52.204852]];
      let colors = ["Red","Orange", "Yellow" ];
      let val = [9, 6, 3];
      for(let marker of markers){
        var num = Math.floor(Math.random() * colors.length)
        var rand = colors[num];
        this.map.markers.add(new atlas.HtmlMarker({
          color: rand,
          text: Math.ceil(Math.max(1, val[num]-3+Math.random()*3)).toString(),
          position: marker
        }));
      }
      
      // this.map.markers.add(new atlas.HtmlMarker({
      //   color: 'Red',
      //   text: '15',
      //   position: [100, 0]
      // })
    });
  }

}
