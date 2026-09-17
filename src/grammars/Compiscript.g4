grammar Compiscript;

// -----------------------------------------------------------------------------
// Reglas sintácticas
// -----------------------------------------------------------------------------

program
    : statement* EOF
    ;

statement
    : variableDeclaration
    | constantDeclaration
    | functionDeclaration
    | classDeclaration
    | printStatement
    | block
    | ifStatement
    | whileStatement
    | doWhileStatement
    | forStatement
    | foreachStatement
    | tryCatchStatement
    | switchStatement
    | breakStatement
    | continueStatement
    | returnStatement
    | expressionStatement
    ;

block
    : LBRACE statement* RBRACE
    ;

variableDeclaration
    : (LET | VAR) Identifier typeAnnotation? initializer? SEMI
    ;

constantDeclaration
    : CONST Identifier typeAnnotation? ASSIGN expression SEMI
    ;

typeAnnotation
    : COLON type
    ;

initializer
    : ASSIGN expression
    ;

expressionStatement
    : expression SEMI
    ;

printStatement
    : PRINT LPAREN expression RPAREN SEMI
    ;

ifStatement
    : IF LPAREN expression RPAREN block (ELSE block)?
    ;

whileStatement
    : WHILE LPAREN expression RPAREN block
    ;

doWhileStatement
    : DO block WHILE LPAREN expression RPAREN SEMI
    ;

forStatement
    : FOR LPAREN forInitializer? SEMI expression? SEMI expression? RPAREN block
    ;

forInitializer
    : (LET | VAR) Identifier typeAnnotation? initializer?
    | expression
    ;

foreachStatement
    : FOREACH LPAREN Identifier IN expression RPAREN block
    ;

breakStatement
    : BREAK SEMI
    ;

continueStatement
    : CONTINUE SEMI
    ;

returnStatement
    : RETURN expression? SEMI
    ;

tryCatchStatement
    : TRY block CATCH LPAREN Identifier RPAREN block
    ;

switchStatement
    : SWITCH LPAREN expression RPAREN LBRACE switchCase* defaultCase? RBRACE
    ;

switchCase
    : CASE expression COLON statement*
    ;

defaultCase
    : DEFAULT COLON statement*
    ;

functionDeclaration
    : FUNCTION Identifier LPAREN parameters? RPAREN (COLON type)? block
    ;

parameters
    : parameter (COMMA parameter)*
    ;

parameter
    : Identifier typeAnnotation?
    ;

classDeclaration
    : CLASS Identifier (COLON Identifier)? LBRACE classMember* RBRACE
    ;

classMember
    : functionDeclaration
    | variableDeclaration
    | constantDeclaration
    ;

// -----------------------------------------------------------------------------
// Expresiones, de menor a mayor precedencia
// -----------------------------------------------------------------------------

expression
    : assignmentExpression
    ;

assignmentExpression
    : leftHandSide ASSIGN assignmentExpression
    | conditionalExpression
    ;

conditionalExpression
    : logicalOrExpression (QUESTION expression COLON expression)?
    ;

logicalOrExpression
    : logicalAndExpression (OR logicalAndExpression)*
    ;

logicalAndExpression
    : equalityExpression (AND equalityExpression)*
    ;

equalityExpression
    : relationalExpression ((EQUAL | NOT_EQUAL) relationalExpression)*
    ;

relationalExpression
    : additiveExpression ((LT | LTE | GT | GTE) additiveExpression)*
    ;

additiveExpression
    : multiplicativeExpression ((PLUS | MINUS) multiplicativeExpression)*
    ;

multiplicativeExpression
    : unaryExpression ((STAR | SLASH | PERCENT) unaryExpression)*
    ;

unaryExpression
    : (MINUS | NOT) unaryExpression
    | primaryExpression
    ;

primaryExpression
    : literalExpression
    | leftHandSide
    | LPAREN expression RPAREN
    ;

literalExpression
    : IntegerLiteral
    | FloatLiteral
    | StringLiteral
    | TRUE
    | FALSE
    | NULL
    | arrayLiteral
    ;

leftHandSide
    : primaryAtom suffixOperator*
    ;

primaryAtom
    : Identifier
    | NEW Identifier LPAREN arguments? RPAREN
    | THIS
    ;

suffixOperator
    : LPAREN arguments? RPAREN
    | LBRACKET expression RBRACKET
    | DOT Identifier
    ;

arguments
    : expression (COMMA expression)*
    ;

arrayLiteral
    : LBRACKET (expression (COMMA expression)*)? RBRACKET
    ;

type
    : baseType (LBRACKET RBRACKET)*
    ;

baseType
    : BOOLEAN_TYPE
    | INTEGER_TYPE
    | FLOAT_TYPE
    | STRING_TYPE
    | Identifier
    ;

// -----------------------------------------------------------------------------
// Reglas léxicas. Las palabras reservadas preceden a Identifier.
// -----------------------------------------------------------------------------

LET          : 'let';
VAR          : 'var';
CONST        : 'const';
FUNCTION     : 'function';
CLASS        : 'class';
PRINT        : 'print';
IF           : 'if';
ELSE         : 'else';
WHILE        : 'while';
DO           : 'do';
FOR          : 'for';
FOREACH      : 'foreach';
IN           : 'in';
BREAK        : 'break';
CONTINUE     : 'continue';
RETURN       : 'return';
TRY          : 'try';
CATCH        : 'catch';
SWITCH       : 'switch';
CASE         : 'case';
DEFAULT      : 'default';
NEW          : 'new';
THIS         : 'this';
TRUE         : 'true';
FALSE        : 'false';
NULL         : 'null';
BOOLEAN_TYPE : 'boolean';
INTEGER_TYPE : 'integer';
FLOAT_TYPE   : 'float';
STRING_TYPE  : 'string';

OR        : '||';
AND       : '&&';
EQUAL     : '==';
NOT_EQUAL : '!=';
LTE       : '<=';
GTE       : '>=';
ASSIGN    : '=';
LT        : '<';
GT        : '>';
PLUS      : '+';
MINUS     : '-';
STAR      : '*';
SLASH     : '/';
PERCENT   : '%';
NOT       : '!';
QUESTION  : '?';
COLON     : ':';
DOT       : '.';
COMMA     : ',';
SEMI      : ';';
LPAREN    : '(';
RPAREN    : ')';
LBRACE    : '{';
RBRACE    : '}';
LBRACKET  : '[';
RBRACKET  : ']';

FloatLiteral
    : [0-9]+ '.' [0-9]+
    ;

IntegerLiteral
    : [0-9]+
    ;

StringLiteral
    : '"' (EscapeSequence | ~["\\\r\n])* '"'
    ;

Identifier
    : [a-zA-Z_] [a-zA-Z0-9_]*
    ;

WS
    : [ \t\r\n]+ -> skip
    ;

COMMENT
    : '//' ~[\r\n]* -> skip
    ;

MULTILINE_COMMENT
    : '/*' .*? '*/' -> skip
    ;

fragment EscapeSequence
    : '\\' ["\\nrt]
    ;
