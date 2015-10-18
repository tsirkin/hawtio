module CamelCatalog {

  //     <span style="margin-left: 10px" ng-repeat="label in labels track by $index" class="pod-label badge" title="{{label}}">{{label}}</span>

  export function labelAsBadgeClass(text:string) {
    // split labels into array
    var answer = "";
    if (!Core.isBlank(text)) {
      var labels:string[] = text.split(',');
      for (var idx in labels) {
        var label = labels[idx];
        answer += '<span class="badge">' + label + '</span>';
      }
    }
    return answer;
  }

}