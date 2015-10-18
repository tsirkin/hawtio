/// <reference path="camelCatalogPlugin.ts"/>
module CamelCatalog {

  // TODO: Should properly render this as a table instead of form as its for documentation purpose
  // TODO: list both component and endpoint properties in two different set of tables

  _module.controller("CamelCatalogPropertiesForm.Controller", ["$scope", "$routeParams", "workspace", "localStorage", "jolokia", ($scope, $routeParams, workspace:Workspace, localStorage:WindowLocalStorage, jolokia) => {
    var log:Logging.Logger = Logger.get("CamelCatalog");

    var mbean = "org.apache.camel.catalog:type=catalog,name=catalog";

    $scope.viewTemplate = null;
    $scope.schema = null;
    $scope.model = null;
    $scope.labels = [];
    $scope.nodeData = {};
    $scope.icon = null;
    $scope.componentName = $routeParams["name"];

    $scope.showEntity = function (id) {
      return true;
    };

    function render(response) {
      var data = response.value;
      if (data) {
        // the model is json object from the string data
        $scope.model = JSON.parse(data);
        // set title and description
        $scope.model.title = $scope.componentName;
        $scope.model.description = $scope.model.component.description;
        // TODO: look for specific component icon,
        $scope.icon = Core.url("/img/icons/camel/endpoint24.png");

        var tabs = {};
        tabs = Camel.buildTabsFromProperties(tabs, $scope.model.componentProperties, false, false);
        tabs = Camel.sortPropertiesTabs(tabs);
        $scope.model.tabs = tabs;

        // must be named properties as that is what the form expects
        $scope.model.properties = $scope.model.componentProperties;

        angular.forEach($scope.model.componentProperties, function (property, key) {
          // does it have a value or fallback to use a default value
          var value = property["value"] || property["defaultValue"];
          if (angular.isDefined(value) && value !== null) {
            $scope.nodeData[key] = value;
          }

          // remove label as that causes the UI to render the label instead of the key as title
          // we should later group the table into labels (eg consumer vs producer)
          delete property["label"];
        });

        var labels = [];
        if ($scope.model.component.label) {
          labels = $scope.model.component.label.split(",");
        }
        $scope.labels = labels;

        $scope.viewTemplate = "app/catalog/html/nodePropertiesView.html";

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



