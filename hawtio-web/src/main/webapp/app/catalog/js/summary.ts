/// <reference path="camelCatalogPlugin.ts"/>
module Camin {

  _module.controller("CamelCatalog.Controller", ["$scope", "jolokia", "localStorage", "$routeParams", ($scope, jolokia, localStorage, $routeParams) => {

    var log:Logging.Logger = Logger.get("CamelCatalog");

    $scope.camelVersion = "2.16.0";
    $scope.componentsCount = 123;

    var mbean = "org.apache.camel.catalog:type=catalog,name=catalog";

    function loadData() {
      var reply = jolokia.request({type: "read", mbean: mbean, attribute: ["CatalogVersion"]});
      if (reply) {
        $scope.camelSnapshot = reply.value;
      }

      // ensure web page is updated
      Core.$apply($scope);
    }

    loadData();

  }]);
}
