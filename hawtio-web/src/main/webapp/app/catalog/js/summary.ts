/// <reference path="camelCatalogPlugin.ts"/>
module Camin {

  _module.controller("CamelCatalog.Controller", ["$scope", "jolokia", "localStorage", "$routeParams", ($scope, jolokia, localStorage, $routeParams) => {

    var log:Logging.Logger = Logger.get("CamelCatalog");

    $scope.initDone = false;

    $scope.catalogVersion = "0.0.0";
    $scope.eipsCount = 0;
    $scope.componentsCount = 0;
    $scope.dataformatsCount = 0;
    $scope.languagesCount = 0;
    $scope.archetypesCount = 0;

    var mbean = "org.apache.camel.catalog:type=catalog,name=catalog";

    function render(response) {
      var obj = response.value;
      if (obj) {
        var json = JSON.parse(obj);
        $scope.catalogVersion = json.version;
        $scope.eipsCount = json.eips;
        $scope.componentsCount = json.components;
        $scope.dataformatsCount = json.dataformats;
        $scope.languagesCount = json.languages;
        $scope.archetypesCount = json.archetypes;
      }

      $scope.initDone = "true";

      // ensure web page is updated
      Core.$apply($scope);
    }

    function loadData() {
      log.info("Loading summary");
      var query = {type: "exec", mbean: mbean, operation: 'summaryAsJson()'};
      jolokia.request(query, onSuccess(render));
    }

    loadData();

  }]);
}
