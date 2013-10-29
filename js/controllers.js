mll.controller("HomeController", ["$scope", function($scope){

}]);

mll.controller("FeedingController", ["$scope", function($scope){

}]);

mll.controller("DiapersController", ["$scope", function($scope){

}]);

mll.controller("SettingsController", ["$scope", "$location", "ChildRepository", "$cll", function($scope, $location, $repository, $cll){
    $scope.children = null;

    var loadChildren = function(){
        $repository.all(function(children){
            $scope.children = children;
            $scope.$apply();
        });
    };

    loadChildren();

    $scope.deleteChild = function(child){
        if(confirm("Are you sure that you want to delete this little love? All data associated will be deleted!")){
            $repository.delete(child.id, function(){
                loadChildren();
                $cll.refresh();
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

mll.controller("SettingsNewChildController", ["$scope", "$location", "ChildRepository", "$cll", function($scope, $location, $repository, $cll){

    $scope.message = null;

    $scope.add = function(){
        if($scope.name == undefined || $scope.name.trim() == "")
        {
            $scope.message = "Please enter the name of your little love.";
            return;
        }
        $repository.add($scope.name, "");
        $cll.refresh();
        $location.path("/settings");
    };

    $scope.cancel = function(){
        history.back();
    }
}]);

mll.controller("HeaderController", ["$scope", "$location", "$cll", function($scope, $location, $cll){

    $scope.currentChild = null;

    $scope.$watch(function(){ return $cll.current; }, function(child){
        $scope.currentChild = child;
    });

    $scope.goToNewChild = function(){
        $location.path("/settings/new-child");
    }
}]);

mll.controller("NavigationController", ["$scope", "$route", function($scope, $route){
    $scope.is = function(name){
        return  $route.current && $route.current.$$route ? $route.current.$$route.where == name : false;
    };
}]);