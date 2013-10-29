var mll = angular.module("mylittlelove", []);

mll.config(["$routeProvider", function ($route) {

    $route.when("/", { templateUrl : "views/startup.html", controller: "StartupController"});

    $route.when("/home", { templateUrl: "views/container.html", controller: "ContainerController", where : "home", resolve: { content: function ($q) {
        var d = $q.defer();
        d.resolve("views/home.html");
        return d.promise;
    }}});

    $route.when("/feeding", { templateUrl: "views/container.html", controller: "ContainerController", where : "feeding", resolve: { content: function ($q) {
        var d = $q.defer();
        d.resolve("views/feeding/index.html");
        return d.promise;
    }}});

    $route.when("/diapers", { templateUrl: "views/container.html", controller: "ContainerController", where : "diapers", resolve: { content: function ($q) {
        var d = $q.defer();
        d.resolve("views/diapers/index.html");
        return d.promise;
    }}});

    $route.when("/settings", { templateUrl: "views/container.html", controller: "ContainerController", where : "settings", resolve: { content: function ($q) {
        var d = $q.defer();
        d.resolve("views/settings/index.html");
        return d.promise;
    }}});

    $route.when("/settings/new-child", { templateUrl: "views/container.html", controller: "ContainerController", where : "settings", resolve: { content: function ($q) {
        var d = $q.defer();
        d.resolve("views/settings/newChild.html");
        return d.promise;
    }}});

    $route.otherwise({ redirectTo: '/' });

    console.log("config done");
}]);