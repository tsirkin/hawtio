/// <reference path="camelCatalogPlugin.ts"/>
module Camin {

  _module.controller("CamelCatalogEIPs.Controller", ["$scope", "jolokia", "localStorage", "$routeParams", ($scope, jolokia, localStorage, $routeParams) => {

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
          arr.push(
            {
              title: entry.title,
              label: entry.label,
              description: entry.description
            }
          );
        }

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
      log.info("Loading EIPs");
      var query = {type: "exec", mbean: mbean, operation: 'listModelsAsJson()'};
      jolokia.request(query, onSuccess(render));
    }

    loadData();
  }]);

}
