/// <reference path="camelCatalogPlugin.ts"/>
module Camin {

  _module.controller("CamelCatalogMavenArchetypes.Controller", ["$scope", "jolokia", "localStorage", "$routeParams", ($scope, jolokia, localStorage, $routeParams) => {

    var log:Logging.Logger = Logger.get("CamelCatalog");

    var mbean = "org.apache.camel.catalog:type=catalog,name=catalog";

    $scope.data = [];
    $scope.search = "";
    $scope.initDone = false;

    var columnDefs:any[] = [
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

    function render(response) {
      var obj = response.value;
      if (obj) {
        var arr = [];
        var doc = $.parseXML(obj);

        var archetypes = $(doc).find("archetype");

        archetypes.each((idx, entry) => {
          var desc:string = entry.getElementsByTagName("description").item(0).textContent;
          var maven:string = entry.getElementsByTagName("groupId").item(0).textContent
            + "/" + entry.getElementsByTagName("artifactId").item(0).textContent
            + "/" + entry.getElementsByTagName("version").item(0).textContent;
          arr.push(
            {
              description: desc,
              maven: maven
            }
          )
        });

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
      log.info("Loading Maven Archetypes");
      var query = {type: "exec", mbean: mbean, operation: 'archetypeCatalogAsXml()'};
      jolokia.request(query, onSuccess(render));
    }

    loadData();
  }]);

}
