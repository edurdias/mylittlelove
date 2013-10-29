mll.service("$db", [function(){
    return window.openDatabase("mylittlelove", "1.0", "My Little Love", 5*1024*1024);
}]);

mll.service("ChildRepository", ["$db", "$q", function($db, $q){
    // domain schema (reference only)
    var Child = {
        id : "int",
        name : "string",
        picture : "string"
    };

    $db.transaction(function(tx){
        tx.executeSql("create table if not exists children (id integer primary key autoincrement, name, picture)");
    });

    return {
        schema : Child,
        add : function(name, picture){
            $db.transaction(function(tx){
                tx.executeSql("insert into children (name, picture) values (?,?)", [name, picture]);
            });
        },
        all : function(callback){
            $db.transaction(function(tx){
               tx.executeSql("select * from children", [], function(tx, result){
                   var items = [];
                   for(var i=0;i<result.rows.length;i++)
                       items.push(result.rows.item(i));
                   if(callback)
                    callback(items);
               });
            });

        },
        get : function(id, callback){
            $db.transaction(function(tx){
               tx.executeSql("select * from children where id = ?", [id], function(tx, result){
                    if(callback)
                        callback(result.rows.length > 0 ? result.rows.item(0) : null);
               });
            });
        },
        delete : function(id, callback){
            $db.transaction(function(tx){
                tx.executeSql("delete from children where id = ? ", [id], function(tx, result){
                    if(callback)
                        callback();
                });
            });
        }
    };
}]);