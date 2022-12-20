import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:skateright_flutter/entities/spot.dart';
import 'package:skateright_flutter/state_control/spot_holder.dart';
import 'package:provider/provider.dart';

import '../entities/obstacles.dart';

class ObstacleSelection extends StatelessWidget {
  ObstacleSelection({
    Key? key,
  }) : super(key: key);
  final obSelects = {};

  // Converts options list into a map... note: bad for desired stair implementation

  void _initSelections(List<String> selectedObstacles) {
    // obSelects ??= {};

    for (var opt in validObstacles) {
      if (!obSelects.containsKey(opt)) {
        obSelects[opt] = 0;
      }
    }

    for (var ob in selectedObstacles ?? []) {
      log('$ob');
      obSelects[ob] = 1;
    }
  }

  @override
  Widget build(BuildContext context) {
    Obstacles obby = Obstacles();
    // _initSelections();
    Spot spot = Provider.of<SpotHolder>(context).currentSpot!;
    _initSelections(spot.obstacles);

    var size = MediaQuery.of(context).size;

    return StatefulBuilder(
      builder: ((context, setState) {
        return GridView.count(
          childAspectRatio: MediaQuery.of(context).size.width /
              (MediaQuery.of(context).size.height / 1.8),
          mainAxisSpacing: 30,
          crossAxisCount: 3,
          physics: NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          children: obSelects.keys.map((key) {
            return GestureDetector(
              onTap: () =>
                  setState(() => obSelects[key] = ((obSelects[key] + 1) % 2)),
              child: Container(
                width: size.width / 7,
                child: Stack(
                  children: [
                    Align(
                      alignment: Alignment.topCenter,
                      child: obby.loadObstacle(key),
                    ),
                    Align(
                      alignment: Alignment.bottomCenter,
                      child: Icon(
                          (obSelects[key] == 0)
                              ? Icons.circle_outlined
                              : Icons.circle,
                          color: Theme.of(context).accentColor),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        );
      }),
    );
  }
}
