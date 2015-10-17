/// <reference path="camelCatalogPlugin.ts"/>
module Camin {

  _module.controller("CamelCatalogComponents.Controller", ["$scope", "jolokia", "localStorage", "$routeParams", ($scope, jolokia, localStorage, $routeParams) => {

    var log:Logging.Logger = Logger.get("CamelCatalog");

    var mbean = "org.apache.camel.catalog:type=catalog,name=catalog";

    var labelTemplate = '<div class="ngCellText badge">{{row.entity.label}}</div>';

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
        cellTemplate: labelTemplate,
        width: "*",
        resizable: true
      },
      {
        field: 'scheme',
        displayName: 'Scheme',
        width: "*",
        resizable: true
      },
      {
        field: 'syntax',
        displayName: 'Syntax',
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
              scheme: entry.scheme,
              syntax: entry.syntax,
              description: entry.description
            }
          );
        }

        arr = arr.sortBy("scheme");
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
      var query = {type: "exec", mbean: mbean, operation: 'listComponentAsJson()'};
      jolokia.request(query, onSuccess(render));
    }

    loadData();
  }]);

}
