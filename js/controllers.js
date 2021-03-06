mll.controller("HomeController", ["$scope", "$cll", "ActivityRepository", function($scope, $cll, $repository){
    $scope.currentChild = null;
    $scope.activities = null;
    $scope.$watch(function(){ return $cll.current; }, function(child){
        $scope.currentChild = child;
        if(child)
            $repository.all(child, function(activities){
                $scope.activities = activities.length == 0 ? null : activities;
                $scope.$apply();
            });
    });
}]);

mll.controller("FeedingController", ["$scope", "$cll", "FeedingActivityRepository", function($scope, $cll, $repository){
    $scope.currentChild = null;
    $scope.activities = null;
    $scope.$watch(function(){ return $cll.current; }, function(child){
        $scope.currentChild = child;
        if(child)
            $repository.all(child, function(activities){
                $scope.activities = activities.length == 0 ? null : activities;
                $scope.$apply();
            });
    });
}]);

mll.controller("FeedingNewActivityController", ["$scope", function($scope){
    $scope.setType = function(type){
        $scope.type = type;
    };

    $scope.getTypePartialUrl = function(){
        return $scope.type ? "views/feeding/new-activity-" + $scope.type + ".html" : "";
    }
}]);

mll.controller("FeedingNewNursingActivityController", ["$scope", "$location", "$format", "FeedingActivityRepository", function($scope, $location, $format, $repository){

    $scope.isRunning = false;
    $scope.side = null;
    $scope.mode = 'timer';
    $scope.handler = null;
    $scope.startTime = null;
    $scope.timeElapsed = 0;
    $scope.readableTimeElapsed = $format.time($scope.timeElapsed);
    $scope.hours = null;
    $scope.minutes = null;
    $scope.manualStartTime = null;

    var updateElapsedTime = function(){

        var time = moment.duration({
            hours : $scope.hours,
            minutes : $scope.minutes
        });

        $scope.timeElapsed = time.valueOf();
    };

    var hoursWatcher = null;
    var minWatcher = null;
    var startTimeWatcher = null;

    $scope.$watch("mode", function(mode){
        if(mode == 'manual'){
            hoursWatcher = $scope.$watch("hours", updateElapsedTime);
            minWatcher = $scope.$watch("minutes", updateElapsedTime);
            startTimeWatcher = $scope.$watch("manualStartTime", function(){
                $scope.manualStartTime = $scope.manualStartTime.replace("Z", "");
                var time = moment($scope.manualStartTime);
                if(time.isValid())
                {
                    time.local();
                    $scope.startTime = time.valueOf();
                }
            });
        }else{
            if(hoursWatcher) hoursWatcher();
            if(minWatcher) minWatcher();
            if(startTimeWatcher) startTimeWatcher();
        }
    });

    $scope.setSide = function(side){
        $scope.side = side;
    };

    $scope.getSide = function(){
        return $scope.side;
    };

    $scope.toggle = function(){
        if(!$scope.isRunning){
            $scope.start();
        }else{
            $scope.stop();
        }
    };

    $scope.start = function(){
        $scope.isRunning = true;
        $scope.startTime = !$scope.startTime ? Date.now() : $scope.startTime;
        $scope.handler = setInterval(function(){
            $scope.timeElapsed = $scope.timeElapsed + 1000;
            $scope.readableTimeElapsed = $format.time($scope.timeElapsed);
            $scope.$apply();
        }, 1000);
    };

    $scope.stop = function(){
        $scope.isRunning = false;
        if($scope.handler)
            clearInterval($scope.handler);
    };

    $scope.save = function(){
        $repository.addNursing($scope.startTime, $scope.side, $scope.timeElapsed);
        $location.path("/feeding");
    };

    $scope.cancel = function(){
        history.back();
    };

    $scope.canSave = function(){
        return $scope.getSide() && ($scope.isRunning || ($scope.startTime && $scope.timeElapsed > 0));
    };

    $scope.setMode = function(mode){
        $scope.mode = mode;
    };

    $scope.getMode = function(){
        return $scope.mode;
    };
}]);

mll.controller("FeedingNewBottleActivityController", ["$scope", "$pref", "$cll", "FeedingActivityRepository", function($scope, $pref, $cll, $repository){

    $scope.message = null;
    $scope.content = null;
    $scope.quantity = null;
    $scope.unit = $pref.get("units");
    $scope.hours = [];
    $scope.minutes = [];

    for(var i=1;i<=12;i++) $scope.hours.push(i);
    for(var i=1;i<=59;i++) $scope.minutes.push(i);

    $scope.save = function(){
        if(!$scope.content || $scope.content.trim() == ""){
            $scope.message = "What did you give to " + $cll.current.name + "?";
            return;
        }

        if(!$scope.quantity || isNaN($scope.quantity)){
            $scope.message = "How much " + $scope.content + " did you give to " + $cll.current.name + "?";
            return;
        }

        $scope.time = $scope.time.replace("Z", "");

        var time = moment($scope.time);

        if(!time.isValid()){
            $scope.message = "What was the time you gave " + $scope.content + " to " + $cll.current.name + "?";
            return;
        }

        time.local();

        $repository.addBottle($scope.content, $scope.quantity, $scope.unit, time.valueOf());

        history.back();
    };

    $scope.cancel = function(){
        history.back();
    };
}]);

mll.controller("DiapersController", ["$scope", "$cll", "DiapersActivityRepository", function($scope, $cll, $repository){
    $scope.currentChild = null;
    $scope.activities = null;
    $scope.$watch(function(){ return $cll.current; }, function(child){
        $scope.currentChild = child;
        if(child)
            $repository.all(child, function(activities){
                $scope.activities = activities.length == 0 ? null : activities;
                $scope.$apply();
            });
    });
}]);


mll.controller("DiapersNewActivityController", ["$scope", "$cll", "DiapersActivityRepository", function($scope, $cll, $repository){

    $scope.wet = false;
    $scope.dirty = false;
    $scope.time = null;
    $scope.message = null;

    $scope.save = function(){

        console.log($scope.wet, $scope.dirty, $scope.time);

        if(!$scope.wet && !$scope.dirty){
            $scope.message = "Was " + $cll.current.name + " wet, dirty or both?";
            return;
        }

        $scope.time = $scope.time.replace("Z", "");

        var time = moment($scope.time);

        if(!time.isValid()){
            $scope.message = "What was the time you changed " + $cll.current.name + "?";
            return;
        }

        time.local();

        $repository.add(time.valueOf(), $scope.wet, $scope.dirty);

        history.back();
    };

    $scope.cancel = function(){
        history.back();
    };
}]);


mll.controller("SettingsController", ["$scope", "$location", "ChildRepository", "$cll", "$pref", function($scope, $location, $repository, $cll, $pref){
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
        var units = $pref.get("units");
        if(!units)
        {
            $scope.setUnit("ml");
            return "ml";
        }
        return units;
    };

    $scope.setUnit = function(unitName){
        $pref.set("units", unitName);
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

mll.controller("NavigationController", ["$scope", "$route", "$location", function($scope, $route, $location){
    $scope.is = function(name){
        return  $route.current && $route.current.$$route ? $route.current.$$route.where == name : false;
    };

    $scope.addActivity = function(){
        $location.path("/new-activity");
    };
}]);

mll.controller("NewActivityController", ["$scope", "$route", "$location", function($scope, $route, $location){


}]);