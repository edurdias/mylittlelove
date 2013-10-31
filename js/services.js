mll.service("$cll", ["$rootScope", "ChildRepository", function($root, $repository){
    var cll = {
        current : null,
        refresh : function(){
            $repository.all(function(children){
                cll.current = children.length > 0 ? children[0] : null;
                $root.$apply();
            });
        }
    };

    cll.refresh();

    return cll;
}]);

mll.service("$format", [function(){
    return {
        time : function (duration) {
            var milliseconds = parseInt((duration%1000)/100)
                , seconds = parseInt((duration/1000)%60)
                , minutes = parseInt((duration/(1000*60))%60)
                , hours = parseInt((duration/(1000*60*60))%24);

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            return hours + ":" + minutes + ":" + seconds;
        },
        activity : function(activity){
            if(activity.type == "feeding"){
                if (activity.feedingType == "nursing")
                    return "Nursed " + moment.duration(activity.duration).humanize() + " on "  + activity.side;
            }
            return "";
        }
    };
}]);

mll.service("$pref", [function(){
    return {
        set : function(name, value){
            window.localStorage.setItem(name, value);
        },
        get : function(name){
            return window.localStorage.getItem(name);
        },
        remove : function(name){
            window.localStorage.removeItem(name);
        },
        clear : function(){
            window.localStorage.clear();
        }
    };
}]);



mll.service("$db", [function(){
    var db = window.openDatabase("mylittlelove", "1.0", "My Little Love", 5*1024*1024);
    return {
        execute : function(sql, parameters, callback){
            db.transaction(function(tx){
                tx.executeSql(sql, parameters, callback);
            });
        },
        executeAll : function(sqls, parameters, callback){
            db.transaction(function(tx){
                for(var i=0;i<sqls.length;i++)
                    tx.executeSql(sqls[i], parameters[i]);
            }, null, callback);
        }
    };
}]);

mll.service("ActivityRepository", ["$db", "$format", function ($db, $format) {
    // domain schema (reference only)
    var Activity = {
        id : "int",
        child : "int",
        type : "feeding|diapers",
        time : "timestamp"
    };

    $db.execute("create table if not exists activities (id integer primary key autoincrement, child integer, type, time, otherProperties)");

    var service = {
        schema : [Activity],
        parse : function (item) {
            item.moment = moment(item.time);
            jQuery.extend(item, JSON.parse(item.otherProperties));
            item.description = $format.activity(item);
            delete item.otherProperties;
            return item;
        },
        all : function(child, callback){
            $db.execute("select id, type, time, otherProperties from activities where child = ? order by time desc ", [child.id], function(tx, result){
                var items = [];
                for(var i=0;i<result.rows.length;i++)
                    items.push(service.parse(result.rows.item(i)));

                if(callback)
                    callback(items);
            });
        },
        add : function(activity, otherProperties){
            $db.execute("insert into activities (child, type, time, otherProperties) values (?, ?, ?, ?)", [activity.child, activity.type, activity.time, JSON.stringify(otherProperties)]);
        }
    };

    return service;
}]);

mll.service("FeedingActivityRepository", ["$db", "$cll", "ActivityRepository", function ($db, $cll, $repository) {
   //domain schema (reference only)
    var Activity = {
        id : "int",
        child : "int",
        type : "feeding|diapers",
        time : "timestamp"
    };

    var Feeding = ["Activity", {
        feedingType : "nursing|bottle"
    }];

    var Nursing = ["Feeding", {
        side : "left|right",
        duration : "int"
    }];

    var Bottle = ["Feeding", {
        content : "formula|breast milk|milk|mix",
        quantity : "int",
        unit : "ml|fl oz"
    }];

    return {
        schema : [Nursing, Bottle],
        all : function(child, callback){
            $db.execute("select id, type, time, otherProperties from activities where child = ? and type='feeding' order by time desc ", [child.id], function(tx, result){
                var items = [];
                for(var i=0;i<result.rows.length;i++)
                    items.push($repository.parse(result.rows.item(i)));

                if(callback)
                    callback(items);
            });
        },
        addNursing : function(time, side, duration){
            $repository.add({ child : $cll.current.id, type : "feeding", time : time },{ feedingType :"nursing", side : side, duration : duration});
        },
        addBottle : function(){

        }
    };
}]);


mll.service("ChildRepository", ["$db", function ($db) {
    // domain schema (reference only)
    var Child = {
        id : "int",
        name : "string",
        picture : "string"
    };

    $db.execute("create table if not exists children (id integer primary key autoincrement, name, picture)");

    return {
        schema : [Child],
        add : function(name, picture){
            $db.execute("insert into children (name, picture) values (?,?)", [name, picture]);
        },
        all : function(callback){
            $db.execute("select * from children", [], function(tx, result){
               var items = [];
               for(var i=0;i<result.rows.length;i++)
                   items.push(result.rows.item(i));
               if(callback)
                callback(items);
           });
        },
        get : function(id, callback){
            $db.execute("select * from children where id = ?", [id], function(tx, result){
                if(callback)
                    callback(result.rows.length > 0 ? result.rows.item(0) : null);
           });
        },
        delete : function(id, callback){
            $db.executeAll(["delete from children where id = ? ", "delete from activities where child = ?"], [[id],[id]], function () {
                if(callback)
                    callback();
            });
        }
    };
}]);