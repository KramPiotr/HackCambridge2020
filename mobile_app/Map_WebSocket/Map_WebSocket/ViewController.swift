//
//  ViewController.swift
//  Map
//
//  Created by Jaafar Rammal on 1/18/20.
//  Copyright © 2020 Jaafar Rammal. All rights reserved.
//

import UIKit
import MapKit
import CoreLocation
import Foundation


class MyPointAnnotation:NSObject,MKAnnotation{
    var coordinate: CLLocationCoordinate2D
    var subtitle: String?
    var value: Double?
    var type: String?
    init(_ latitude:CLLocationDegrees,_ longitude:CLLocationDegrees, subtitle:String,value:Double, type:String){
        self.coordinate = CLLocationCoordinate2DMake(latitude, longitude)
        self.subtitle = subtitle
        self.value = value
        self.type = type
    }
}
 

class ViewController: UIViewController, CLLocationManagerDelegate, MKMapViewDelegate {
    
    static func stringify(json: Any, prettyPrinted: Bool = false) -> String {
        var options: JSONSerialization.WritingOptions = []
        if prettyPrinted {
          options = JSONSerialization.WritingOptions.prettyPrinted
        }

        do {
          let data = try JSONSerialization.data(withJSONObject: json, options: options)
          if let string = String(data: data, encoding: String.Encoding.utf8) {
            return string
          }
        } catch {
          print(error)
        }

        return ""
    }

    @IBOutlet weak var mapView: MKMapView!
    let locationManager = CLLocationManager()
    
    struct bin{
        var coordinate: CLLocationCoordinate2D = CLLocationCoordinate2D.init(latitude: 0, longitude: 0)
        var concentration: Int = 0
    }
    
    struct trash{
        var coordinate: CLLocationCoordinate2D = CLLocationCoordinate2D.init(latitude: 0, longitude: 0)
        var concentration: Int = 0
    }
    
    public enum Message {
          case data(Data)
          case string(String)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Ask for Authorisation from the User.
        self.locationManager.requestAlwaysAuthorization()

        // For use in foreground
        self.locationManager.requestWhenInUseAuthorization()

        if CLLocationManager.locationServicesEnabled() {
            locationManager.delegate = self
            locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
            locationManager.startUpdatingLocation()
        }
        
        var initialLocation = CLLocation(latitude: 21.282778, longitude: -157.829444)
        let regionRadius: CLLocationDistance = 1000
        func centerMapOnLocation(location: CLLocation) {
                   let coordinateRegion = MKCoordinateRegion(center: location.coordinate, latitudinalMeters: regionRadius, longitudinalMeters: regionRadius)
            self.mapView.setRegion(coordinateRegion, animated: true)
        }
        
        func locationManager(_ manager: CLLocationManager) {
            guard let locValue: CLLocationCoordinate2D = manager.location?.coordinate else { return }
            print("locations = \(locValue.latitude) \(locValue.longitude)")
            initialLocation = CLLocation(latitude: locValue.latitude, longitude: locValue.longitude)
        }
        
        mapView.delegate = self

        locationManager(self.locationManager)
        centerMapOnLocation(location: initialLocation)
        mapView.showsUserLocation = true
        
        
        // get data here instead of hardcode
        
        let jsonObject: [String: Any] = [
            "type": "getData",
            "leftCorner": [initialLocation.coordinate.latitude-5,initialLocation.coordinate.longitude-5],
            "rightCorner": [initialLocation.coordinate.latitude+5,initialLocation.coordinate.longitude+5]
        ]
        
        let toSend = ViewController.stringify(json: jsonObject)
        var dataStr = ""
        // DATA TEST
        let urlSession = URLSession(configuration: .default)
        let webSocketTask = urlSession.webSocketTask(with: URL(string: "ws://172.20.10.11:3000/map")!)
        webSocketTask.resume()
        
        let message = URLSessionWebSocketTask.Message.string(toSend)
        webSocketTask.send(message) { error in
          if let error = error {
            print("WebSocket couldn’t send message because: \(error)")
          }
        }
        
        webSocketTask.receive { result in
          switch result {
          case .failure(let error):
            print("Error in receiving message: \(error)")
          case .success(let message):
            switch message {
            case .string(let text):
                print("Received string 2: \(text)")
                dataStr = text
                updateMap()
            case .data(let data):
                print("Received data: \(data)")
            @unknown default:
                fatalError()
            }
            }
        }
        
        func receiveMessage() {
          webSocketTask.receive { result in
            switch result {
            case .failure(let error):
              print("Error in receiving message: \(error)")
            case .success(let message):
              switch message {
              case .string(let text):
                print("Received string 1: \(text)")
              case .data(let data):
                print("Received data: \(data)")
              @unknown default:
                fatalError()
              }
            }
          }
        }
        
        func parseJson(anyObj:AnyObject) -> Array<bin>{

            var list:Array<bin> = []

            if  anyObj is Array<AnyObject> {

                var b:bin = bin()

                for json in anyObj as! Array<AnyObject>{
                    b.coordinate.longitude = (json["longtitude"] as AnyObject? as? CLLocationDegrees) ?? 0
                    b.coordinate.latitude = (json["latitude"] as AnyObject? as? CLLocationDegrees) ?? 0
                    b.concentration  = (json["__v"]  as AnyObject? as? Int) ?? 0

                   list.append(b)
                }

            }

            return list

        }
        
        func updateMap(){

            let jsonData = dataStr.data(using: .utf8)!
            let json = try! JSONSerialization.jsonObject(with: jsonData, options: .allowFragments) as! Dictionary<String, AnyObject>
            
            // bins
            let bins = json["bin"] as! [AnyObject]
            for bin in bins {
                let pin = MyPointAnnotation(
                    bin["latitude"] as! CLLocationDegrees,
                    bin["longtitude"] as! CLLocationDegrees,
                    subtitle: String(Int(bin["full"] as! Double))+"/100",
                    value: bin["full"] as! Double,
                    type: "bin"
                )
                print("Concentration: ")
                print(bin["full"] as Any)
                print("Putting pin at:")
                print(pin.coordinate)
                mapView.addAnnotation(pin)
            }
            
            // trash
            let trashes = json["map"] as! [AnyObject]
            for trash in trashes {
                let pin = MyPointAnnotation(
                    trash["latitude"] as! CLLocationDegrees,
                    trash["longtitude"] as! CLLocationDegrees,
                    subtitle: String(Int(trash["polluted"] as! Double))+"/10",
                    value: trash["polluted"] as! Double,
                    type: "trash"
                )
                print("Concentration: ")
                print(trash["polluted"] as Any)
                print("Putting pin at:")
                print(pin.coordinate)
                mapView.addAnnotation(pin)
            }
        }
        
        receiveMessage() // could add refresh button
        
        // END

    }
    
    func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
        var annotationView = MKMarkerAnnotationView()
        guard let annotation = annotation as? MyPointAnnotation else {return nil}
        var identifier = ""
        if let dequedView = mapView.dequeueReusableAnnotationView(
            withIdentifier: identifier)
            as? MKMarkerAnnotationView {
            annotationView = dequedView
        } else{
            annotationView = MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: identifier)
        }
        annotationView.markerTintColor = UIColor.init(white: 0, alpha: 0)
        annotationView.image = UIImage(named: "trash.png")
        if(annotation.type == "bin"){
            switch Int(annotation.value!){
            case 0..<30:
                annotationView.image = UIImage(named: "green.jpeg")
            case 30..<60:
                annotationView.image = UIImage(named: "yellow.jpeg")
            default:
                annotationView.image = UIImage(named: "red.jpeg")
            }
        }
        annotationView.glyphImage = UIImage(named: "none.png")
        annotationView.clusteringIdentifier = identifier
        return annotationView
    }

}



