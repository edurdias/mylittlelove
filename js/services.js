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

mll.service("$db", [function(){
    var db = window.openDatabase("mylittlelove", "1.0", "My Little Love", 5*1024*1024);
    return {
        execute : function(sql, parameters, callback){
            db.transaction(function(tx){
                tx.executeSql(sql, parameters, callback);
            });
        }
    };
}]);

mll.service("ActivityRepository", ["$db", function ($db) {
    // domain schema (reference only)
    var Activity = {
        id : "int",
        child : "int",
        type : "string",
        time : "timestamp"
    };

    $db.execute("create table if not exists activity (id integer primary key autoincrement, child integer, type, time, otherProperties)");

    return {
        schema : Activity,
        all : function(child, callback){
            $db.execute("select id, type, time from activity where child = ? ", [child], function(tx, result){
                var items = [];
                for(var i=0;i<result.rows.length;i++)
                    items.push(result.rows.item(i));
                if(callback)
                    callback(items);
            });
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
        schema : Child,
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
            $db.execute("delete from children where id = ? ", [id], function () {
                if(callback)
                    callback();
            });
        }
    };
}]);