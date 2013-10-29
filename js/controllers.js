mll.controller("StartupController", ["$scope", "$location", "$timeout", function($scope, $location, $timeout){
    console.log("startup done");

        $location.path("/home");

}]);
//
mll.controller("ContainerController", ["$scope", "content", function($scope, content){
    $scope.content = content;
}]);
//
//
//mll.controller("HomeController", ["$scope", function($scope){
//
//}]);
//
//mll.controller("FeedingController", ["$scope", function($scope){
//
//}]);
//
//mll.controller("DiapersController", ["$scope", function($scope){
//
//}]);
//
mll.controller("SettingsController", ["$scope", "$location", "ChildRepository", function($scope, $location, $childRepository){
    $scope.children = null;

    var loadChildren = function(){
        $childRepository.all(function(children){
            $scope.children = children;
            $scope.$apply();
        });
    };

    loadChildren();

    $scope.deleteChild = function(child){
        if(confirm("Are you sure that you want to delete this little love? All data associated will be deleted!")){
            $childRepository.delete(child.id, function(){
                loadChildren();
            });
        }
    };

    $scope.addNewChild = function(){
        $location.path("/settings/new-child");
    };

    $scope.getUnit = function(){
        var units = window.localStorage.getItem("units");
        if(!units)
        {
            $scope.setUnit("metric");
            return "metric";
        }
        return units;
    };

    $scope.setUnit = function(unitName){
        window.localStorage.setItem("units", unitName);
    };

}]);

mll.controller("SettingsNewChildController", ["$scope", "$location", "ChildRepository", function($scope, $location, $childRepository){

    $scope.message = null;

    $scope.add = function(){
        if($scope.name == undefined || $scope.name.trim() == "")
        {
            $scope.message = "Please enter the name of your little love.";
            return;
        }
        $childRepository.add($scope.name, "");
        $location.path("/settings");
    };

    $scope.cancel = function(){
        history.back();
    }
}]);

mll.controller("HeaderController", ["$scope", "ChildRepository", function($scope, $childRepository){
    $scope.currentLittleLove = null;

    $childRepository.all(function(children){
        $scope.currentLittleLove = children.length > 0 ? children[0] : null;
        $scope.$apply();
    });

}]);

mll.controller("NavigationController", ["$scope", "$route", function($scope, $route){
    $scope.is = function(name){
        return $route.current.$$route.where == name;
    };
}]);