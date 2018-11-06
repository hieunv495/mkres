// MKRES filter path parser

find = operator:operator "[" path:path "]" {return {operator,path}} 

path = [a-zA-Z0-9.]* {return text()}

operator
	= "f" {return "eq"}
	/ "f_eq" {return "eq"}
    / "f_ne" {return "ne"}
    / "f_gt" {return "gt"}
    / "f_gte" {return "gte"}
    / "f_lt" {return "lt"}
    / "f_lte" {return "lte"}
    / "f_in" {return "in"}
    / "f_nin" {return "nin"}