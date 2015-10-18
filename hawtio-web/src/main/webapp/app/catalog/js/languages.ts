/// <reference path="camelCatalogPlugin.ts"/>
module Camin {

  _module.controller("CamelCatalogLanguages.Controller", ["$scope", "jolokia", "localStorage", "$routeParams", ($scope, jolokia, localStorage, $routeParams) => {

    var log:Logging.Logger = Logger.get("CamelCatalog");

    var mbean = "org.apache.camel.catalog:type=catalog,name=catalog";

    $scope.data = [];
    $scope.search = "";
    $scope.initDone = false;

    var columnDefs:any[] = [
      {
        field: 'title',
        displayName: 'Name',
        width: "*",
        resizable: true
      },
      {
        field: 'label',
        displayName: 'Labels',
        width: "*",
        resizable: true
      },
      {
        field: 'description',
        displayName: 'Description',
        width: "*",
        resizable: true
      }
    ];

    $scope.gridOptions = {
      data: 'data',
      displayFooter: false,
      displaySelectionCheckbox: false,
      canSelectRows: false,
      columnDefs: columnDefs,
      filterOptions: {
        filterText: ''
      }
    };

    function render(response) {
      var obj = response.value;
      if (obj) {
        var arr = [];
        var json = JSON.parse(obj);
        for (var key in json) {
          var entry = json[key];

          // remove language in labels as that is implied
          var label:string = entry.label;
          if (label.startsWith("language")) {
            label = label.substr(8);
            if (label.startsWith(",")) {
              label = label.substr(1);
            }
          }

          arr.push(
            {
              title: entry.title,
              label: entry.label,
              description: entry.description
            }
          );
        }

        arr = arr.sortBy("title");
        $scope.data = arr;
      } else {
        // clear data
        $scope.data = [];
      }

      $scope.initDone = "true";

      // ensure web page is updated
      Core.$apply($scope);
    }

    function loadData() {
      log.info("Loading components");
      var query = {type: "exec", mbean: mbean, operation: 'listLanguagesAsJson()'};
      jolokia.request(query, onSuccess(render));
    }

    loadData();
  }]);

}
