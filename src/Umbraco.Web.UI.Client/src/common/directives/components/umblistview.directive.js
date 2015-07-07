(function() {
  'use strict';

  function ListView(contentTypeResource, dataTypeResource, dataTypeHelper) {

    function link(scope, el, attr, ctrl) {

      scope.dataType = {};
      scope.editDataTypeSettings = false;
      scope.customListViewCreated = false;

      /* ---------- INIT ---------- */

      function activate() {

        if(scope.enableListView) {

          dataTypeResource.getByName(scope.listViewName)
            .then(function(dataType) {

              scope.dataType = dataType;

              scope.customListViewCreated = checkForCustomListView();

            });

        } else {

          scope.dataType = {};

        }

      }

      /* ----------- LIST VIEW SETTINGS --------- */

      scope.toggleEditListViewDataTypeSettings = function() {
        scope.editDataTypeSettings = !scope.editDataTypeSettings;
      };

      scope.saveListViewDataType = function() {

          var preValues = dataTypeHelper.createPreValueProps(scope.dataType.preValues);

          dataTypeResource.save(scope.dataType, preValues, false).then(function(dataType) {

              // store data type
              scope.dataType = dataType;

              // hide settings panel
              scope.editDataTypeSettings = false;

          });

      };


      /* ---------- CUSTOM LIST VIEW ---------- */

      scope.createCustomListViewDataType = function() {

          dataTypeResource.createCustomListView(scope.modelName).then(function(dataType) {

              // store data type
              scope.dataType = dataType;

              // set list view name on scope
              scope.listViewName = dataType.name;

              // change state to custom list view
              scope.customListViewCreated = true;

              // show settings panel
              scope.editDataTypeSettings = true;

          });

      };

      scope.removeCustomListDataType = function() {

          scope.editDataTypeSettings = false;

          // delete custom list view data type
          dataTypeResource.deleteById(scope.dataType.id).then(function(dataType) {

              // set list view name on scope
              scope.listViewName = "List View - Content";

              // get default data type
              dataTypeResource.getByName(scope.listViewName)
                  .then(function(dataType) {

                      // store data type
                      scope.dataType = dataType;

                      // change state to default list view
                      scope.customListViewCreated = false;

                  });
          });

      };

      /* ----------- SCOPE WATCHERS ----------- */
      scope.$watch('enableListView', function(newValue, oldValue){

        if(newValue !== undefined) {
          activate();
        }

      });

      /* ----------- METHODS ---------- */

      function checkForCustomListView() {
          return scope.dataType.name === "List View - " + scope.modelName;
      }

    }

    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/components/umb-list-view.html',
      scope: {
        enableListView: "=",
        listViewName: "=",
        modelName: "="
      },
      link: link
    };

    return directive;
  }

  angular.module('umbraco.directives').directive('umbListView', ListView);

})();
