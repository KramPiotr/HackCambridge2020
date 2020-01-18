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
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: this.key
      }
    });

    //Wait until the map resources are ready.
    this.map.events.add('ready', () => {
      //Create a HTML marker and add it to the map.
      this.map.markers.add(new atlas.HtmlMarker({
        color: 'DodgerBlue',
        text: '10',
        position: [10, 0]
      }));
    });
  }

}
