  'use strict';

  var DroneFlightPlannerDataSource = (function(_) {

    var _DATASOURCE = [{
      name: 'Example 1',
      coordinates: [{
        'lat': 46.51893473140202,
        'lng': 6.567131280899048
      }, {
        'lat': 46.51773872552017,
        'lng': 6.567152738571167
      }, {
        'lat': 46.51772395985093,
        'lng': 6.569797396659851
      }, {
        'lat': 46.51893104006637,
        'lng': 6.569647192955017
      }]
    }, {
      name: 'Example 2',
      coordinates: [{
        'lat': 46.51997198679184,
        'lng': 6.566219329833984
      }, {
        'lat': 46.519887087628526,
        'lng': 6.566348075866699
      }, {
        'lat': 46.51959178515775,
        'lng': 6.566230058670044
      }, {
        'lat': 46.51928540714797,
        'lng': 6.566283702850342
      }, {
        'lat': 46.51920050691187,
        'lng': 6.566487550735474
      }, {
        'lat': 46.519204198229225,
        'lng': 6.56732976436615
      }, {
        'lat': 46.51920050691187,
        'lng': 6.5675389766693115
      }, {
        'lat': 46.519912926518366,
        'lng': 6.567512154579163
      }, {
        'lat': 46.51996460426116,
        'lng': 6.567426323890686
      }, {
        'lat': 46.52017869724344,
        'lng': 6.567453145980835
      }, {
        'lat': 46.52021560974133,
        'lng': 6.56757652759552
      }, {
        'lat': 46.5202968171484,
        'lng': 6.567608714103699
      }, {
        'lat': 46.52030050839129,
        'lng': 6.568032503128052
      }]
    }, {
      name: 'Example 3',
      coordinates: [{
        'lat': 46.51855821387109,
        'lng': 6.5627700090408325
      }, {
        'lat': 46.51844009018645,
        'lng': 6.562930941581726
      }, {
        'lat': 46.51823337312046,
        'lng': 6.563301086425781
      }, {
        'lat': 46.51836257137885,
        'lng': 6.563252806663513
      }, {
        'lat': 46.51844747292426,
        'lng': 6.563386917114258
      }, {
        'lat': 46.51852868297399,
        'lng': 6.563252806663513
      }, {
        'lat': 46.51863573239956,
        'lng': 6.563306450843811
      }, {
        'lat': 46.518680028651886,
        'lng': 6.563134789466858
      }, {
        'lat': 46.51862834968733,
        'lng': 6.562979221343994
      }, {
        'lat': 46.5187390902655,
        'lng': 6.56282901763916
      }]
    }];

    return {
      getPlans: function() {
        // here should be a proper call to some api
        // but for the sake of the example we return an array
        return new Promise(function(resolve){
          resolve(_DATASOURCE);
        });
      },
      createPlan: function(pName, pCoordinates) {
        // here should be a proper call to some api
        // that return if the create plan has been successfully created
        return new Promise(function(resolve, reject) {
          var noDuplicates = _.every(_DATASOURCE, function(dataItem) {
            return dataItem.name !== pName;
          });

          if (noDuplicates) {
            _DATASOURCE.push({
              name: pName,
              coordinates: pCoordinates
            });
            resolve();
          } else {
            reject('A plan this name already exists');
          }
        });
      },
      deletePlan: function(pName) {
        return new Promise(function(resolve) {
          _DATASOURCE = _.reject(_DATASOURCE, function(dataItem){
            return dataItem.name === pName;
          });
          resolve();
        });
      }
    };

  })(_);
