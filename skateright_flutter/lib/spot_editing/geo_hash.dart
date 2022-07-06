import 'package:geoflutterfire/geoflutterfire.dart';
import 'dart:developer' as dev;
import 'package:cloud_firestore/cloud_firestore.dart';

final geo = Geoflutterfire();
final firestoreInstance = FirebaseFirestore.instance;
var collectionReferencce = firestoreInstance.collection('SkateSpots');
GeoFirePoint center =
    geo.point(latitude: 42.3508929, longitude: -71.1089444); // GSU Coordinates
double radius = 5;
String field = 'geoHash';
Stream<List<DocumentSnapshot>> stream = geo
    .collection(collectionRef: collectionReferencce)
    .within(center: center, radius: radius, field: field);

// for reference

// stream.listen((List<DocumentSnapshot> docs) {
//   dev.log('Got ${docs.length} spots within $radius km');
//   for (DocumentSnapshot doc in docs) {
//     dev.log('${doc.data()}');
//   }
// });