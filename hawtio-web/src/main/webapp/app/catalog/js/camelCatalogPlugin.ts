/**
 * Camel Catalog Plugin
 *
 * @module CamelCatalog
 * @main CamelCatalog
 */
module CamelCatalog {
  var pluginName = 'catalog';

  export var jmxDomain = 'org.apache.camel.catalog';

  export var _module = angular.module(pluginName, ['bootstrap', 'ngResource', 'ngGrid', 'hawtioCore']);

  _module.config(["$routeProvider", ($routeProvider) => {
    $routeProvider.
      when('/catalog', {templateUrl: 'app/catalog/html/summary.html'}).
      when('/catalog/summary', {templateUrl: 'app/catalog/html/summary.html'}).
      when('/catalog/eips', {templateUrl: 'app/catalog/html/eips.html'}).
      when('/catalog/components', {templateUrl: 'app/catalog/html/components.html'}).
      // TODO: should we have properties per type?
      when('/catalog/components/:name', {templateUrl: 'app/catalog/html/properties.html'}).
      when('/catalog/dataformats', {templateUrl: 'app/catalog/html/dataformats.html'}).
      when('/catalog/languages', {templateUrl: 'app/catalog/html/languages.html'}).
      when('/catalog/archetypes', {templateUrl: 'app/catalog/html/archetypes.html'});
  }]);

  _module.run(["workspace", "jolokia", "viewRegistry", "layoutFull", "helpRegistry", (workspace:Workspace, jolokia, viewRegistry, layoutFull, helpRegistry) => {

    viewRegistry['catalog'] = 'app/catalog/html/layoutCatalogTabs.html';

    helpRegistry.addUserDoc('catalog', 'app/catalog/doc/help.md', () => {
      return workspace.treeContainsDomainAndProperties(jmxDomain);
    });

    workspace.topLevelTabs.push({
      id: "catalog",
      content: "Camel Catalog",
      title: "Apache Camel Catalog",
      isValid: (workspace: Workspace) => workspace.treeContainsDomainAndProperties(jmxDomain),
      href: () => "#/catalog/summary",
      isActive: (workspace: Workspace) => workspace.isTopTabActive("catalog")
    });

  }]);

  hawtioPluginLoader.addModule(pluginName);
}
