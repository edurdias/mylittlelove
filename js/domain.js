
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

var Breastfeeding = ["Activity", {
    side : "left|right",
    duration : "int"
}];

var Bottle = ["Activity", {
    content : "formula|breast milk|milk|mix",
    quantity : "int",
    unit : "ml|fl oz"
}];

var DiaperChange = ["Activity", {
    wet : "bool",
    dirty : "bool"
}];

