/// <reference path="camelCatalogPlugin.ts"/>
module CamelCatalog {

  _module.controller("CamelCatalogProperties.Controller", ["$scope", "$routeParams", "workspace", "localStorage", "jolokia", ($scope, $routeParams, workspace:Workspace, localStorage:WindowLocalStorage, jolokia) => {
    var log:Logging.Logger = Logger.get("CamelCatalog");

    var mbean = "org.apache.camel.catalog:type=catalog,name=catalog";

    $scope.componentName = $routeParams["name"];

    $scope.componentIcon = null;
    $scope.componentTitle = "";
    $scope.componentDescription = "";
    $scope.componentLabels = "";

    $scope.componentData = [];
    $scope.endpointData = [];
    $scope.search = "";
    $scope.initDone = false;

    var columnDefs:any[] = [
      {
        field: 'name',
        displayName: 'Name',
        width: "*",
        resizable: true
      },
      {
        field: 'required',
        displayName: 'Required',
        width: "*",
        resizable: true
      },
      {
        field: 'javaType',
        displayName: 'Java Type',
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

    $scope.componentGridOptions = {
      data: 'componentData',
      displayFooter: false,
      displaySelectionCheckbox: false,
      canSelectRows: false,
      columnDefs: columnDefs,
      filterOptions: {
        filterText: ''
      }
    };

    $scope.endpointGridOptions = {
      data: 'endpointData',
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

        var json = JSON.parse(obj);

        $scope.componentTitle = json.component.title;
        $scope.componentDescription = json.component.description;
        $scope.componentLabels = json.component.label.split(",");
        $scope.componentIcon = Core.url("/img/icons/camel/endpoint24.png");

        var arr = [];
        angular.forEach(json.componentProperties, function (property, key) {
          arr.push({
            name: key,
            required: property["required"],
            javaType: property["javaType"],
            description: property["description"]
          })
        });
        $scope.componentData = arr;

        arr = [];
        angular.forEach(json.properties, function (property, key) {
          arr.push({
            name: key,
            required: property["required"],
            javaType: property["javaType"],
            description: property["description"]
          })
        });
        $scope.endpointData = arr;

        /*
        var tabs = {};
        tabs = Camel.buildTabsFromProperties(tabs, $scope.model.componentProperties, false, false);
        tabs = Camel.sortPropertiesTabs(tabs);
        $scope.model.tabs = tabs;
        */

        $scope.initDone = true;
        Core.$apply($scope);
      }
    }

    function loadData() {
      var query = {type: "exec", mbean: mbean, operation: 'componentJSonSchema(java.lang.String)', arguments: [$scope.componentName]};
      jolokia.request(query, onSuccess(render));
    }

    loadData();
  }]);
}



