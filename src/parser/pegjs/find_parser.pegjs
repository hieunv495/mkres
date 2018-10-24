// MKRES find parser

op3 
	= left:op2 type:and right:op3 { return {type,left,right}} 
    / left:op2 type:or right:op3 { return {type,left,right}} 
    / op2

op2 
	= begin_round op:op3 end_round { return op }
    / op

op 
	= left:path type:eq right:value { return {type,left,right}}
    / left:path type:ne right:value { return {type,left,right}}
    / left:path type:gt right:value { return {type,left,right}}
    / left:path type:lt right:value { return {type,left,right}}
    / left:path type:gte right:value { return {type,left,right}}
    / left:path type:lte right:value { return {type,left,right}}
	/ left:path type:in right:array { return {type,left,right}}
path
	= name ("." name)* { return text() }
    
name 
	= [a-zA-Z0-9]+ {return text()}
  
and = ws "and" ws { return "and" }
or = ws "or" ws { return "or" }
  
eq = ws "=" ws { return "=" }
ne = ws "!=" ws { return "!=" }
gt = ws ">" ws { return ">" }
lt = ws "<" ws { return "<" }
gte = ws ">=" ws { return ">=" }
lte = ws "<=" ws { return "<=" }
in = ws "in" ws { return "in" }

begin_array     = ws "[" ws
begin_object    = ws "{" ws
end_array       = ws "]" ws
end_object      = ws "}" ws
begin_round		= ws "(" ws
end_round		= ws ")" ws
name_separator  = ws ":" ws
value_separator = ws "," ws

ws "whitespace" = [ \t\n\r]*


// ----- 3. Values -----

value
  = false
  / null
  / true
  / object
  / array
  / number
  / string

false = "false" { return false; }
null  = "null"  { return null;  }
true  = "true"  { return true;  }

// ----- 4. Objects -----

object
  = begin_object
    members:(
      head:member
      tail:(value_separator m:member { return m; })*
      {
        var result = {};

        [head].concat(tail).forEach(function(element) {
          result[element.name] = element.value;
        });

        return result;
      }
    )?
    end_object
    { return members !== null ? members: {}; }

member
  = name:string name_separator value:value {
      return { name: name, value: value };
    }

// ----- 5. Arrays -----

array
  = begin_array
    values:(
      head:value
      tail:(value_separator v:value { return v; })*
      { return [head].concat(tail); }
    )?
    end_array
    { return values !== null ? values : []; }

// ----- 6. Numbers -----

number "number"
  = minus? int frac? exp? { return parseFloat(text()); }

decimal_point
  = "."

digit1_9
  = [1-9]

e
  = [eE]

exp
  = e (minus / plus)? DIGIT+

frac
  = decimal_point DIGIT+

int
  = zero / (digit1_9 DIGIT*)

minus
  = "-"

plus
  = "+"

zero
  = "0"
  
// ----- 7. Strings -----

string "string"
  = quotation_mark chars:char* quotation_mark { return chars.join(""); }

char
  = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

escape
  = "\\"

quotation_mark
  = '"'

unescaped
  = [^\0-\x1F\x22\x5C]
  
 // See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i