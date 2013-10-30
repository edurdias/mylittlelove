var mll = angular.module("mylittlelove", []);

mll.config(["$routeProvider", function ($route) {

    $route.when("/home", {
        templateUrl: "views/home.html",
        controller: "HomeController",
        where : "home"
    });

    $route.when("/feeding", {
        templateUrl: "views/feeding/index.html",
        controller: "FeedingController",
        where : "feeding"
    });

    $route.when("/feeding/new-activity", {
        templateUrl: "views/feeding/new-activity.html",
        controller: "FeedingNewActivityController",
        where : "feeding"
    });

    $route.when("/diapers", {
        templateUrl: "views/diapers/index.html",
        controller: "DiapersController",
        where : "diapers"
    });

    $route.when("/diapers/new-activity", {
        templateUrl: "views/diapers/new-activity.html",
        controller: "DiapersNewActivityController",
        where : "diapers"
    });

    $route.when("/settings", {
        templateUrl: "views/settings/index.html",
        controller: "SettingsController",
        where : "settings"
    });

    $route.when("/settings/new-child", {
        templateUrl: "views/settings/newChild.html",
        controller: "SettingsNewChildController",
        where : "settings"
    });

    $route.otherwise({ redirectTo: '/home' });

    console.log("config done");
}]);