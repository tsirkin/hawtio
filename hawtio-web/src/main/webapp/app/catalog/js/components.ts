/// <reference path="camelCatalogPlugin.ts"/>
module CamelCatalog {

  _module.controller("CamelCatalogComponents.Controller", ["$scope", "$location", "jolokia", "localStorage", "$routeParams", ($scope, $location, jolokia, localStorage, $routeParams) => {

    var log:Logging.Logger = Logger.get("CamelCatalog");

    var mbean = "org.apache.camel.catalog:type=catalog,name=catalog";

    $scope.data = [];
    $scope.search = "";
    $scope.initDone = false;

    var columnDefs:any[] = [
      {
        field: 'name',
        displayName: 'Name',
        width: "*",
        cellTemplate: '<div class="ngCellText mouse-pointer" ng-click="onViewComponent(row)" title="{{row.entity.name}}" ng-bind-html-unsafe="row.entity.name"></div>',
        resizable: true
      },
      {
        field: 'label',
        displayName: 'Labels',
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
        field: 'maven',
        displayName: 'Maven',
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

    $scope.onViewComponent = (row) => {
      $location.path('/catalog/components/' + row.entity.scheme);
    };

    function render(response) {
      var obj = response.value;
      if (obj) {
        var arr = [];
        var json = JSON.parse(obj);
        for (var key in json) {
          var entry = json[key];
          var maven:string = entry.groupId + "/" + entry.artifactId  + "/" + entry.version;
          arr.push(
            {
              // use name as title so filter will filter on the entire entity (as it filters by default only on title)
              name: entry.title,
              label: entry.label,
              scheme: entry.scheme,
              syntax: entry.syntax,
              description: entry.description,
              maven: maven
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
      log.info("Loading components");
      var query = {type: "exec", mbean: mbean, operation: 'listComponentsAsJson()'};
      jolokia.request(query, onSuccess(render));
    }

    loadData();
  }]);

}
