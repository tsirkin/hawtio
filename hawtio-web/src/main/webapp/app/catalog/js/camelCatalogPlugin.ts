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
      when('/catalog/dataformats', {templateUrl: 'app/catalog/html/dataformats.html'}).
      when('/catalog/languages', {templateUrl: 'app/catalog/html/languages.html'});
  }]);

  _module.filter('labelAsBadge', () => labelAsBadgeClass);

  _module.run(["workspace", "viewRegistry", "layoutFull", "helpRegistry", (workspace:Workspace, viewRegistry, layoutFull, helpRegistry) => {

    viewRegistry['catalog'] = 'app/catalog/html/layoutCatalogTabs.html';

    helpRegistry.addUserDoc('catalog', 'app/catalog/doc/help.md', () => {
      return workspace.treeContainsDomainAndProperties(jmxDomain);
    });

    // TODO: require Camel 2.16.1+

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
