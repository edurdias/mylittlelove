
var Child = {
    id : "int",
    name : "string",
    picture : "string"
};

var Activity = {
    id : "int",
    child : "int",
    type : "feeding|diapers",
    time : "timestamp"
};

var Feeding = ["Activity", {
    feedingType : "nursing|bottle"
}];

var Breastfeeding = ["Feeding", {
    side : "left|right",
    duration : "int"
}];

var Bottle = ["Feeding", {
    content : "string",
    quantity : "int",
    unit : "ml|fl oz"
}];

var DiaperChange = ["Activity", {
    wet : "bool",
    dirty : "bool"
}];

