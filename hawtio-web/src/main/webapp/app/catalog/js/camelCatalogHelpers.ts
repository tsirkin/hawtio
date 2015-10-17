module CamelCatalog {

  //     <span style="margin-left: 10px" ng-repeat="label in labels track by $index" class="pod-label badge" title="{{label}}">{{label}}</span>

  export function labelAsBadgeClass(text:string) {
    var lines = "";
    var labels:string[] = text.split(',');
    for (var idx in labels) {
      var label = labels[idx];
      var line = '<span class="badge">' + label + '</span>';
      lines += line;
    }

    return lines;
  }


}