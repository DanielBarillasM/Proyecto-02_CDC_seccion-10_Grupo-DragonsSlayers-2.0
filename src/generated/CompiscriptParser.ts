// Generated from src/grammars/Compiscript.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { CompiscriptVisitor } from "./CompiscriptVisitor";


export class CompiscriptParser extends Parser {
	public static readonly LET = 1;
	public static readonly VAR = 2;
	public static readonly CONST = 3;
	public static readonly FUNCTION = 4;
	public static readonly CLASS = 5;
	public static readonly PRINT = 6;
	public static readonly IF = 7;
	public static readonly ELSE = 8;
	public static readonly WHILE = 9;
	public static readonly DO = 10;
	public static readonly FOR = 11;
	public static readonly FOREACH = 12;
	public static readonly IN = 13;
	public static readonly BREAK = 14;
	public static readonly CONTINUE = 15;
	public static readonly RETURN = 16;
	public static readonly TRY = 17;
	public static readonly CATCH = 18;
	public static readonly SWITCH = 19;
	public static readonly CASE = 20;
	public static readonly DEFAULT = 21;
	public static readonly NEW = 22;
	public static readonly THIS = 23;
	public static readonly TRUE = 24;
	public static readonly FALSE = 25;
	public static readonly NULL = 26;
	public static readonly BOOLEAN_TYPE = 27;
	public static readonly INTEGER_TYPE = 28;
	public static readonly FLOAT_TYPE = 29;
	public static readonly STRING_TYPE = 30;
	public static readonly OR = 31;
	public static readonly AND = 32;
	public static readonly EQUAL = 33;
	public static readonly NOT_EQUAL = 34;
	public static readonly LTE = 35;
	public static readonly GTE = 36;
	public static readonly ASSIGN = 37;
	public static readonly LT = 38;
	public static readonly GT = 39;
	public static readonly PLUS = 40;
	public static readonly MINUS = 41;
	public static readonly STAR = 42;
	public static readonly SLASH = 43;
	public static readonly PERCENT = 44;
	public static readonly NOT = 45;
	public static readonly QUESTION = 46;
	public static readonly COLON = 47;
	public static readonly DOT = 48;
	public static readonly COMMA = 49;
	public static readonly SEMI = 50;
	public static readonly LPAREN = 51;
	public static readonly RPAREN = 52;
	public static readonly LBRACE = 53;
	public static readonly RBRACE = 54;
	public static readonly LBRACKET = 55;
	public static readonly RBRACKET = 56;
	public static readonly FloatLiteral = 57;
	public static readonly IntegerLiteral = 58;
	public static readonly StringLiteral = 59;
	public static readonly Identifier = 60;
	public static readonly WS = 61;
	public static readonly COMMENT = 62;
	public static readonly MULTILINE_COMMENT = 63;
	public static readonly RULE_program = 0;
	public static readonly RULE_statement = 1;
	public static readonly RULE_block = 2;
	public static readonly RULE_variableDeclaration = 3;
	public static readonly RULE_constantDeclaration = 4;
	public static readonly RULE_typeAnnotation = 5;
	public static readonly RULE_initializer = 6;
	public static readonly RULE_expressionStatement = 7;
	public static readonly RULE_printStatement = 8;
	public static readonly RULE_ifStatement = 9;
	public static readonly RULE_whileStatement = 10;
	public static readonly RULE_doWhileStatement = 11;
	public static readonly RULE_forStatement = 12;
	public static readonly RULE_forInitializer = 13;
	public static readonly RULE_foreachStatement = 14;
	public static readonly RULE_breakStatement = 15;
	public static readonly RULE_continueStatement = 16;
	public static readonly RULE_returnStatement = 17;
	public static readonly RULE_tryCatchStatement = 18;
	public static readonly RULE_switchStatement = 19;
	public static readonly RULE_switchCase = 20;
	public static readonly RULE_defaultCase = 21;
	public static readonly RULE_functionDeclaration = 22;
	public static readonly RULE_parameters = 23;
	public static readonly RULE_parameter = 24;
	public static readonly RULE_classDeclaration = 25;
	public static readonly RULE_classMember = 26;
	public static readonly RULE_expression = 27;
	public static readonly RULE_assignmentExpression = 28;
	public static readonly RULE_conditionalExpression = 29;
	public static readonly RULE_logicalOrExpression = 30;
	public static readonly RULE_logicalAndExpression = 31;
	public static readonly RULE_equalityExpression = 32;
	public static readonly RULE_relationalExpression = 33;
	public static readonly RULE_additiveExpression = 34;
	public static readonly RULE_multiplicativeExpression = 35;
	public static readonly RULE_unaryExpression = 36;
	public static readonly RULE_primaryExpression = 37;
	public static readonly RULE_literalExpression = 38;
	public static readonly RULE_leftHandSide = 39;
	public static readonly RULE_primaryAtom = 40;
	public static readonly RULE_suffixOperator = 41;
	public static readonly RULE_arguments = 42;
	public static readonly RULE_arrayLiteral = 43;
	public static readonly RULE_type = 44;
	public static readonly RULE_baseType = 45;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"program", "statement", "block", "variableDeclaration", "constantDeclaration", 
		"typeAnnotation", "initializer", "expressionStatement", "printStatement", 
		"ifStatement", "whileStatement", "doWhileStatement", "forStatement", "forInitializer", 
		"foreachStatement", "breakStatement", "continueStatement", "returnStatement", 
		"tryCatchStatement", "switchStatement", "switchCase", "defaultCase", "functionDeclaration", 
		"parameters", "parameter", "classDeclaration", "classMember", "expression", 
		"assignmentExpression", "conditionalExpression", "logicalOrExpression", 
		"logicalAndExpression", "equalityExpression", "relationalExpression", 
		"additiveExpression", "multiplicativeExpression", "unaryExpression", "primaryExpression", 
		"literalExpression", "leftHandSide", "primaryAtom", "suffixOperator", 
		"arguments", "arrayLiteral", "type", "baseType",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'let'", "'var'", "'const'", "'function'", "'class'", "'print'", 
		"'if'", "'else'", "'while'", "'do'", "'for'", "'foreach'", "'in'", "'break'", 
		"'continue'", "'return'", "'try'", "'catch'", "'switch'", "'case'", "'default'", 
		"'new'", "'this'", "'true'", "'false'", "'null'", "'boolean'", "'integer'", 
		"'float'", "'string'", "'||'", "'&&'", "'=='", "'!='", "'<='", "'>='", 
		"'='", "'<'", "'>'", "'+'", "'-'", "'*'", "'/'", "'%'", "'!'", "'?'", 
		"':'", "'.'", "','", "';'", "'('", "')'", "'{'", "'}'", "'['", "']'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "LET", "VAR", "CONST", "FUNCTION", "CLASS", "PRINT", "IF", 
		"ELSE", "WHILE", "DO", "FOR", "FOREACH", "IN", "BREAK", "CONTINUE", "RETURN", 
		"TRY", "CATCH", "SWITCH", "CASE", "DEFAULT", "NEW", "THIS", "TRUE", "FALSE", 
		"NULL", "BOOLEAN_TYPE", "INTEGER_TYPE", "FLOAT_TYPE", "STRING_TYPE", "OR", 
		"AND", "EQUAL", "NOT_EQUAL", "LTE", "GTE", "ASSIGN", "LT", "GT", "PLUS", 
		"MINUS", "STAR", "SLASH", "PERCENT", "NOT", "QUESTION", "COLON", "DOT", 
		"COMMA", "SEMI", "LPAREN", "RPAREN", "LBRACE", "RBRACE", "LBRACKET", "RBRACKET", 
		"FloatLiteral", "IntegerLiteral", "StringLiteral", "Identifier", "WS", 
		"COMMENT", "MULTILINE_COMMENT",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(CompiscriptParser._LITERAL_NAMES, CompiscriptParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return CompiscriptParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Compiscript.g4"; }

	// @Override
	public get ruleNames(): string[] { return CompiscriptParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return CompiscriptParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(CompiscriptParser._ATN, this);
	}
	// @RuleVersion(0)
	public program(): ProgramContext {
		let _localctx: ProgramContext = new ProgramContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, CompiscriptParser.RULE_program);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 95;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.LET) | (1 << CompiscriptParser.VAR) | (1 << CompiscriptParser.CONST) | (1 << CompiscriptParser.FUNCTION) | (1 << CompiscriptParser.CLASS) | (1 << CompiscriptParser.PRINT) | (1 << CompiscriptParser.IF) | (1 << CompiscriptParser.WHILE) | (1 << CompiscriptParser.DO) | (1 << CompiscriptParser.FOR) | (1 << CompiscriptParser.FOREACH) | (1 << CompiscriptParser.BREAK) | (1 << CompiscriptParser.CONTINUE) | (1 << CompiscriptParser.RETURN) | (1 << CompiscriptParser.TRY) | (1 << CompiscriptParser.SWITCH) | (1 << CompiscriptParser.NEW) | (1 << CompiscriptParser.THIS) | (1 << CompiscriptParser.TRUE) | (1 << CompiscriptParser.FALSE) | (1 << CompiscriptParser.NULL))) !== 0) || ((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & ((1 << (CompiscriptParser.MINUS - 41)) | (1 << (CompiscriptParser.NOT - 41)) | (1 << (CompiscriptParser.LPAREN - 41)) | (1 << (CompiscriptParser.LBRACE - 41)) | (1 << (CompiscriptParser.LBRACKET - 41)) | (1 << (CompiscriptParser.FloatLiteral - 41)) | (1 << (CompiscriptParser.IntegerLiteral - 41)) | (1 << (CompiscriptParser.StringLiteral - 41)) | (1 << (CompiscriptParser.Identifier - 41)))) !== 0)) {
				{
				{
				this.state = 92;
				this.statement();
				}
				}
				this.state = 97;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 98;
			this.match(CompiscriptParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public statement(): StatementContext {
		let _localctx: StatementContext = new StatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, CompiscriptParser.RULE_statement);
		try {
			this.state = 117;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CompiscriptParser.LET:
			case CompiscriptParser.VAR:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 100;
				this.variableDeclaration();
				}
				break;
			case CompiscriptParser.CONST:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 101;
				this.constantDeclaration();
				}
				break;
			case CompiscriptParser.FUNCTION:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 102;
				this.functionDeclaration();
				}
				break;
			case CompiscriptParser.CLASS:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 103;
				this.classDeclaration();
				}
				break;
			case CompiscriptParser.PRINT:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 104;
				this.printStatement();
				}
				break;
			case CompiscriptParser.LBRACE:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 105;
				this.block();
				}
				break;
			case CompiscriptParser.IF:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 106;
				this.ifStatement();
				}
				break;
			case CompiscriptParser.WHILE:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 107;
				this.whileStatement();
				}
				break;
			case CompiscriptParser.DO:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 108;
				this.doWhileStatement();
				}
				break;
			case CompiscriptParser.FOR:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 109;
				this.forStatement();
				}
				break;
			case CompiscriptParser.FOREACH:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 110;
				this.foreachStatement();
				}
				break;
			case CompiscriptParser.TRY:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 111;
				this.tryCatchStatement();
				}
				break;
			case CompiscriptParser.SWITCH:
				this.enterOuterAlt(_localctx, 13);
				{
				this.state = 112;
				this.switchStatement();
				}
				break;
			case CompiscriptParser.BREAK:
				this.enterOuterAlt(_localctx, 14);
				{
				this.state = 113;
				this.breakStatement();
				}
				break;
			case CompiscriptParser.CONTINUE:
				this.enterOuterAlt(_localctx, 15);
				{
				this.state = 114;
				this.continueStatement();
				}
				break;
			case CompiscriptParser.RETURN:
				this.enterOuterAlt(_localctx, 16);
				{
				this.state = 115;
				this.returnStatement();
				}
				break;
			case CompiscriptParser.NEW:
			case CompiscriptParser.THIS:
			case CompiscriptParser.TRUE:
			case CompiscriptParser.FALSE:
			case CompiscriptParser.NULL:
			case CompiscriptParser.MINUS:
			case CompiscriptParser.NOT:
			case CompiscriptParser.LPAREN:
			case CompiscriptParser.LBRACKET:
			case CompiscriptParser.FloatLiteral:
			case CompiscriptParser.IntegerLiteral:
			case CompiscriptParser.StringLiteral:
			case CompiscriptParser.Identifier:
				this.enterOuterAlt(_localctx, 17);
				{
				this.state = 116;
				this.expressionStatement();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public block(): BlockContext {
		let _localctx: BlockContext = new BlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, CompiscriptParser.RULE_block);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 119;
			this.match(CompiscriptParser.LBRACE);
			this.state = 123;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.LET) | (1 << CompiscriptParser.VAR) | (1 << CompiscriptParser.CONST) | (1 << CompiscriptParser.FUNCTION) | (1 << CompiscriptParser.CLASS) | (1 << CompiscriptParser.PRINT) | (1 << CompiscriptParser.IF) | (1 << CompiscriptParser.WHILE) | (1 << CompiscriptParser.DO) | (1 << CompiscriptParser.FOR) | (1 << CompiscriptParser.FOREACH) | (1 << CompiscriptParser.BREAK) | (1 << CompiscriptParser.CONTINUE) | (1 << CompiscriptParser.RETURN) | (1 << CompiscriptParser.TRY) | (1 << CompiscriptParser.SWITCH) | (1 << CompiscriptParser.NEW) | (1 << CompiscriptParser.THIS) | (1 << CompiscriptParser.TRUE) | (1 << CompiscriptParser.FALSE) | (1 << CompiscriptParser.NULL))) !== 0) || ((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & ((1 << (CompiscriptParser.MINUS - 41)) | (1 << (CompiscriptParser.NOT - 41)) | (1 << (CompiscriptParser.LPAREN - 41)) | (1 << (CompiscriptParser.LBRACE - 41)) | (1 << (CompiscriptParser.LBRACKET - 41)) | (1 << (CompiscriptParser.FloatLiteral - 41)) | (1 << (CompiscriptParser.IntegerLiteral - 41)) | (1 << (CompiscriptParser.StringLiteral - 41)) | (1 << (CompiscriptParser.Identifier - 41)))) !== 0)) {
				{
				{
				this.state = 120;
				this.statement();
				}
				}
				this.state = 125;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 126;
			this.match(CompiscriptParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public variableDeclaration(): VariableDeclarationContext {
		let _localctx: VariableDeclarationContext = new VariableDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, CompiscriptParser.RULE_variableDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 128;
			_la = this._input.LA(1);
			if (!(_la === CompiscriptParser.LET || _la === CompiscriptParser.VAR)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 129;
			this.match(CompiscriptParser.Identifier);
			this.state = 131;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CompiscriptParser.COLON) {
				{
				this.state = 130;
				this.typeAnnotation();
				}
			}

			this.state = 134;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CompiscriptParser.ASSIGN) {
				{
				this.state = 133;
				this.initializer();
				}
			}

			this.state = 136;
			this.match(CompiscriptParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public constantDeclaration(): ConstantDeclarationContext {
		let _localctx: ConstantDeclarationContext = new ConstantDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, CompiscriptParser.RULE_constantDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 138;
			this.match(CompiscriptParser.CONST);
			this.state = 139;
			this.match(CompiscriptParser.Identifier);
			this.state = 141;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CompiscriptParser.COLON) {
				{
				this.state = 140;
				this.typeAnnotation();
				}
			}

			this.state = 143;
			this.match(CompiscriptParser.ASSIGN);
			this.state = 144;
			this.expression();
			this.state = 145;
			this.match(CompiscriptParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeAnnotation(): TypeAnnotationContext {
		let _localctx: TypeAnnotationContext = new TypeAnnotationContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, CompiscriptParser.RULE_typeAnnotation);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 147;
			this.match(CompiscriptParser.COLON);
			this.state = 148;
			this.type();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public initializer(): InitializerContext {
		let _localctx: InitializerContext = new InitializerContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, CompiscriptParser.RULE_initializer);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 150;
			this.match(CompiscriptParser.ASSIGN);
			this.state = 151;
			this.expression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expressionStatement(): ExpressionStatementContext {
		let _localctx: ExpressionStatementContext = new ExpressionStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, CompiscriptParser.RULE_expressionStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 153;
			this.expression();
			this.state = 154;
			this.match(CompiscriptParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public printStatement(): PrintStatementContext {
		let _localctx: PrintStatementContext = new PrintStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, CompiscriptParser.RULE_printStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 156;
			this.match(CompiscriptParser.PRINT);
			this.state = 157;
			this.match(CompiscriptParser.LPAREN);
			this.state = 158;
			this.expression();
			this.state = 159;
			this.match(CompiscriptParser.RPAREN);
			this.state = 160;
			this.match(CompiscriptParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public ifStatement(): IfStatementContext {
		let _localctx: IfStatementContext = new IfStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, CompiscriptParser.RULE_ifStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 162;
			this.match(CompiscriptParser.IF);
			this.state = 163;
			this.match(CompiscriptParser.LPAREN);
			this.state = 164;
			this.expression();
			this.state = 165;
			this.match(CompiscriptParser.RPAREN);
			this.state = 166;
			this.block();
			this.state = 169;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CompiscriptParser.ELSE) {
				{
				this.state = 167;
				this.match(CompiscriptParser.ELSE);
				this.state = 168;
				this.block();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public whileStatement(): WhileStatementContext {
		let _localctx: WhileStatementContext = new WhileStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, CompiscriptParser.RULE_whileStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 171;
			this.match(CompiscriptParser.WHILE);
			this.state = 172;
			this.match(CompiscriptParser.LPAREN);
			this.state = 173;
			this.expression();
			this.state = 174;
			this.match(CompiscriptParser.RPAREN);
			this.state = 175;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public doWhileStatement(): DoWhileStatementContext {
		let _localctx: DoWhileStatementContext = new DoWhileStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, CompiscriptParser.RULE_doWhileStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 177;
			this.match(CompiscriptParser.DO);
			this.state = 178;
			this.block();
			this.state = 179;
			this.match(CompiscriptParser.WHILE);
			this.state = 180;
			this.match(CompiscriptParser.LPAREN);
			this.state = 181;
			this.expression();
			this.state = 182;
			this.match(CompiscriptParser.RPAREN);
			this.state = 183;
			this.match(CompiscriptParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public forStatement(): ForStatementContext {
		let _localctx: ForStatementContext = new ForStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, CompiscriptParser.RULE_forStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 185;
			this.match(CompiscriptParser.FOR);
			this.state = 186;
			this.match(CompiscriptParser.LPAREN);
			this.state = 188;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.LET) | (1 << CompiscriptParser.VAR) | (1 << CompiscriptParser.NEW) | (1 << CompiscriptParser.THIS) | (1 << CompiscriptParser.TRUE) | (1 << CompiscriptParser.FALSE) | (1 << CompiscriptParser.NULL))) !== 0) || ((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & ((1 << (CompiscriptParser.MINUS - 41)) | (1 << (CompiscriptParser.NOT - 41)) | (1 << (CompiscriptParser.LPAREN - 41)) | (1 << (CompiscriptParser.LBRACKET - 41)) | (1 << (CompiscriptParser.FloatLiteral - 41)) | (1 << (CompiscriptParser.IntegerLiteral - 41)) | (1 << (CompiscriptParser.StringLiteral - 41)) | (1 << (CompiscriptParser.Identifier - 41)))) !== 0)) {
				{
				this.state = 187;
				this.forInitializer();
				}
			}

			this.state = 190;
			this.match(CompiscriptParser.SEMI);
			this.state = 192;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.NEW) | (1 << CompiscriptParser.THIS) | (1 << CompiscriptParser.TRUE) | (1 << CompiscriptParser.FALSE) | (1 << CompiscriptParser.NULL))) !== 0) || ((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & ((1 << (CompiscriptParser.MINUS - 41)) | (1 << (CompiscriptParser.NOT - 41)) | (1 << (CompiscriptParser.LPAREN - 41)) | (1 << (CompiscriptParser.LBRACKET - 41)) | (1 << (CompiscriptParser.FloatLiteral - 41)) | (1 << (CompiscriptParser.IntegerLiteral - 41)) | (1 << (CompiscriptParser.StringLiteral - 41)) | (1 << (CompiscriptParser.Identifier - 41)))) !== 0)) {
				{
				this.state = 191;
				this.expression();
				}
			}

			this.state = 194;
			this.match(CompiscriptParser.SEMI);
			this.state = 196;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.NEW) | (1 << CompiscriptParser.THIS) | (1 << CompiscriptParser.TRUE) | (1 << CompiscriptParser.FALSE) | (1 << CompiscriptParser.NULL))) !== 0) || ((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & ((1 << (CompiscriptParser.MINUS - 41)) | (1 << (CompiscriptParser.NOT - 41)) | (1 << (CompiscriptParser.LPAREN - 41)) | (1 << (CompiscriptParser.LBRACKET - 41)) | (1 << (CompiscriptParser.FloatLiteral - 41)) | (1 << (CompiscriptParser.IntegerLiteral - 41)) | (1 << (CompiscriptParser.StringLiteral - 41)) | (1 << (CompiscriptParser.Identifier - 41)))) !== 0)) {
				{
				this.state = 195;
				this.expression();
				}
			}

			this.state = 198;
			this.match(CompiscriptParser.RPAREN);
			this.state = 199;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public forInitializer(): ForInitializerContext {
		let _localctx: ForInitializerContext = new ForInitializerContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, CompiscriptParser.RULE_forInitializer);
		let _la: number;
		try {
			this.state = 210;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CompiscriptParser.LET:
			case CompiscriptParser.VAR:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 201;
				_la = this._input.LA(1);
				if (!(_la === CompiscriptParser.LET || _la === CompiscriptParser.VAR)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 202;
				this.match(CompiscriptParser.Identifier);
				this.state = 204;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CompiscriptParser.COLON) {
					{
					this.state = 203;
					this.typeAnnotation();
					}
				}

				this.state = 207;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === CompiscriptParser.ASSIGN) {
					{
					this.state = 206;
					this.initializer();
					}
				}

				}
				break;
			case CompiscriptParser.NEW:
			case CompiscriptParser.THIS:
			case CompiscriptParser.TRUE:
			case CompiscriptParser.FALSE:
			case CompiscriptParser.NULL:
			case CompiscriptParser.MINUS:
			case CompiscriptParser.NOT:
			case CompiscriptParser.LPAREN:
			case CompiscriptParser.LBRACKET:
			case CompiscriptParser.FloatLiteral:
			case CompiscriptParser.IntegerLiteral:
			case CompiscriptParser.StringLiteral:
			case CompiscriptParser.Identifier:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 209;
				this.expression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public foreachStatement(): ForeachStatementContext {
		let _localctx: ForeachStatementContext = new ForeachStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, CompiscriptParser.RULE_foreachStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 212;
			this.match(CompiscriptParser.FOREACH);
			this.state = 213;
			this.match(CompiscriptParser.LPAREN);
			this.state = 214;
			this.match(CompiscriptParser.Identifier);
			this.state = 215;
			this.match(CompiscriptParser.IN);
			this.state = 216;
			this.expression();
			this.state = 217;
			this.match(CompiscriptParser.RPAREN);
			this.state = 218;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public breakStatement(): BreakStatementContext {
		let _localctx: BreakStatementContext = new BreakStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, CompiscriptParser.RULE_breakStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 220;
			this.match(CompiscriptParser.BREAK);
			this.state = 221;
			this.match(CompiscriptParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public continueStatement(): ContinueStatementContext {
		let _localctx: ContinueStatementContext = new ContinueStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, CompiscriptParser.RULE_continueStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 223;
			this.match(CompiscriptParser.CONTINUE);
			this.state = 224;
			this.match(CompiscriptParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public returnStatement(): ReturnStatementContext {
		let _localctx: ReturnStatementContext = new ReturnStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, CompiscriptParser.RULE_returnStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 226;
			this.match(CompiscriptParser.RETURN);
			this.state = 228;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.NEW) | (1 << CompiscriptParser.THIS) | (1 << CompiscriptParser.TRUE) | (1 << CompiscriptParser.FALSE) | (1 << CompiscriptParser.NULL))) !== 0) || ((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & ((1 << (CompiscriptParser.MINUS - 41)) | (1 << (CompiscriptParser.NOT - 41)) | (1 << (CompiscriptParser.LPAREN - 41)) | (1 << (CompiscriptParser.LBRACKET - 41)) | (1 << (CompiscriptParser.FloatLiteral - 41)) | (1 << (CompiscriptParser.IntegerLiteral - 41)) | (1 << (CompiscriptParser.StringLiteral - 41)) | (1 << (CompiscriptParser.Identifier - 41)))) !== 0)) {
				{
				this.state = 227;
				this.expression();
				}
			}

			this.state = 230;
			this.match(CompiscriptParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public tryCatchStatement(): TryCatchStatementContext {
		let _localctx: TryCatchStatementContext = new TryCatchStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, CompiscriptParser.RULE_tryCatchStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 232;
			this.match(CompiscriptParser.TRY);
			this.state = 233;
			this.block();
			this.state = 234;
			this.match(CompiscriptParser.CATCH);
			this.state = 235;
			this.match(CompiscriptParser.LPAREN);
			this.state = 236;
			this.match(CompiscriptParser.Identifier);
			this.state = 237;
			this.match(CompiscriptParser.RPAREN);
			this.state = 238;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public switchStatement(): SwitchStatementContext {
		let _localctx: SwitchStatementContext = new SwitchStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, CompiscriptParser.RULE_switchStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 240;
			this.match(CompiscriptParser.SWITCH);
			this.state = 241;
			this.match(CompiscriptParser.LPAREN);
			this.state = 242;
			this.expression();
			this.state = 243;
			this.match(CompiscriptParser.RPAREN);
			this.state = 244;
			this.match(CompiscriptParser.LBRACE);
			this.state = 248;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CompiscriptParser.CASE) {
				{
				{
				this.state = 245;
				this.switchCase();
				}
				}
				this.state = 250;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 252;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CompiscriptParser.DEFAULT) {
				{
				this.state = 251;
				this.defaultCase();
				}
			}

			this.state = 254;
			this.match(CompiscriptParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public switchCase(): SwitchCaseContext {
		let _localctx: SwitchCaseContext = new SwitchCaseContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, CompiscriptParser.RULE_switchCase);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 256;
			this.match(CompiscriptParser.CASE);
			this.state = 257;
			this.expression();
			this.state = 258;
			this.match(CompiscriptParser.COLON);
			this.state = 262;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.LET) | (1 << CompiscriptParser.VAR) | (1 << CompiscriptParser.CONST) | (1 << CompiscriptParser.FUNCTION) | (1 << CompiscriptParser.CLASS) | (1 << CompiscriptParser.PRINT) | (1 << CompiscriptParser.IF) | (1 << CompiscriptParser.WHILE) | (1 << CompiscriptParser.DO) | (1 << CompiscriptParser.FOR) | (1 << CompiscriptParser.FOREACH) | (1 << CompiscriptParser.BREAK) | (1 << CompiscriptParser.CONTINUE) | (1 << CompiscriptParser.RETURN) | (1 << CompiscriptParser.TRY) | (1 << CompiscriptParser.SWITCH) | (1 << CompiscriptParser.NEW) | (1 << CompiscriptParser.THIS) | (1 << CompiscriptParser.TRUE) | (1 << CompiscriptParser.FALSE) | (1 << CompiscriptParser.NULL))) !== 0) || ((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & ((1 << (CompiscriptParser.MINUS - 41)) | (1 << (CompiscriptParser.NOT - 41)) | (1 << (CompiscriptParser.LPAREN - 41)) | (1 << (CompiscriptParser.LBRACE - 41)) | (1 << (CompiscriptParser.LBRACKET - 41)) | (1 << (CompiscriptParser.FloatLiteral - 41)) | (1 << (CompiscriptParser.IntegerLiteral - 41)) | (1 << (CompiscriptParser.StringLiteral - 41)) | (1 << (CompiscriptParser.Identifier - 41)))) !== 0)) {
				{
				{
				this.state = 259;
				this.statement();
				}
				}
				this.state = 264;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public defaultCase(): DefaultCaseContext {
		let _localctx: DefaultCaseContext = new DefaultCaseContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, CompiscriptParser.RULE_defaultCase);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 265;
			this.match(CompiscriptParser.DEFAULT);
			this.state = 266;
			this.match(CompiscriptParser.COLON);
			this.state = 270;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.LET) | (1 << CompiscriptParser.VAR) | (1 << CompiscriptParser.CONST) | (1 << CompiscriptParser.FUNCTION) | (1 << CompiscriptParser.CLASS) | (1 << CompiscriptParser.PRINT) | (1 << CompiscriptParser.IF) | (1 << CompiscriptParser.WHILE) | (1 << CompiscriptParser.DO) | (1 << CompiscriptParser.FOR) | (1 << CompiscriptParser.FOREACH) | (1 << CompiscriptParser.BREAK) | (1 << CompiscriptParser.CONTINUE) | (1 << CompiscriptParser.RETURN) | (1 << CompiscriptParser.TRY) | (1 << CompiscriptParser.SWITCH) | (1 << CompiscriptParser.NEW) | (1 << CompiscriptParser.THIS) | (1 << CompiscriptParser.TRUE) | (1 << CompiscriptParser.FALSE) | (1 << CompiscriptParser.NULL))) !== 0) || ((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & ((1 << (CompiscriptParser.MINUS - 41)) | (1 << (CompiscriptParser.NOT - 41)) | (1 << (CompiscriptParser.LPAREN - 41)) | (1 << (CompiscriptParser.LBRACE - 41)) | (1 << (CompiscriptParser.LBRACKET - 41)) | (1 << (CompiscriptParser.FloatLiteral - 41)) | (1 << (CompiscriptParser.IntegerLiteral - 41)) | (1 << (CompiscriptParser.StringLiteral - 41)) | (1 << (CompiscriptParser.Identifier - 41)))) !== 0)) {
				{
				{
				this.state = 267;
				this.statement();
				}
				}
				this.state = 272;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionDeclaration(): FunctionDeclarationContext {
		let _localctx: FunctionDeclarationContext = new FunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, CompiscriptParser.RULE_functionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 273;
			this.match(CompiscriptParser.FUNCTION);
			this.state = 274;
			this.match(CompiscriptParser.Identifier);
			this.state = 275;
			this.match(CompiscriptParser.LPAREN);
			this.state = 277;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CompiscriptParser.Identifier) {
				{
				this.state = 276;
				this.parameters();
				}
			}

			this.state = 279;
			this.match(CompiscriptParser.RPAREN);
			this.state = 282;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CompiscriptParser.COLON) {
				{
				this.state = 280;
				this.match(CompiscriptParser.COLON);
				this.state = 281;
				this.type();
				}
			}

			this.state = 284;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameters(): ParametersContext {
		let _localctx: ParametersContext = new ParametersContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, CompiscriptParser.RULE_parameters);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 286;
			this.parameter();
			this.state = 291;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CompiscriptParser.COMMA) {
				{
				{
				this.state = 287;
				this.match(CompiscriptParser.COMMA);
				this.state = 288;
				this.parameter();
				}
				}
				this.state = 293;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameter(): ParameterContext {
		let _localctx: ParameterContext = new ParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, CompiscriptParser.RULE_parameter);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 294;
			this.match(CompiscriptParser.Identifier);
			this.state = 296;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CompiscriptParser.COLON) {
				{
				this.state = 295;
				this.typeAnnotation();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public classDeclaration(): ClassDeclarationContext {
		let _localctx: ClassDeclarationContext = new ClassDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, CompiscriptParser.RULE_classDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 298;
			this.match(CompiscriptParser.CLASS);
			this.state = 299;
			this.match(CompiscriptParser.Identifier);
			this.state = 302;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CompiscriptParser.COLON) {
				{
				this.state = 300;
				this.match(CompiscriptParser.COLON);
				this.state = 301;
				this.match(CompiscriptParser.Identifier);
				}
			}

			this.state = 304;
			this.match(CompiscriptParser.LBRACE);
			this.state = 308;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.LET) | (1 << CompiscriptParser.VAR) | (1 << CompiscriptParser.CONST) | (1 << CompiscriptParser.FUNCTION))) !== 0)) {
				{
				{
				this.state = 305;
				this.classMember();
				}
				}
				this.state = 310;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 311;
			this.match(CompiscriptParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public classMember(): ClassMemberContext {
		let _localctx: ClassMemberContext = new ClassMemberContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, CompiscriptParser.RULE_classMember);
		try {
			this.state = 316;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CompiscriptParser.FUNCTION:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 313;
				this.functionDeclaration();
				}
				break;
			case CompiscriptParser.LET:
			case CompiscriptParser.VAR:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 314;
				this.variableDeclaration();
				}
				break;
			case CompiscriptParser.CONST:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 315;
				this.constantDeclaration();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expression(): ExpressionContext {
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, CompiscriptParser.RULE_expression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 318;
			this.assignmentExpression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public assignmentExpression(): AssignmentExpressionContext {
		let _localctx: AssignmentExpressionContext = new AssignmentExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, CompiscriptParser.RULE_assignmentExpression);
		try {
			this.state = 325;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 25, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 320;
				this.leftHandSide();
				this.state = 321;
				this.match(CompiscriptParser.ASSIGN);
				this.state = 322;
				this.assignmentExpression();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 324;
				this.conditionalExpression();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public conditionalExpression(): ConditionalExpressionContext {
		let _localctx: ConditionalExpressionContext = new ConditionalExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, CompiscriptParser.RULE_conditionalExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 327;
			this.logicalOrExpression();
			this.state = 333;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CompiscriptParser.QUESTION) {
				{
				this.state = 328;
				this.match(CompiscriptParser.QUESTION);
				this.state = 329;
				this.expression();
				this.state = 330;
				this.match(CompiscriptParser.COLON);
				this.state = 331;
				this.expression();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public logicalOrExpression(): LogicalOrExpressionContext {
		let _localctx: LogicalOrExpressionContext = new LogicalOrExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, CompiscriptParser.RULE_logicalOrExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 335;
			this.logicalAndExpression();
			this.state = 340;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CompiscriptParser.OR) {
				{
				{
				this.state = 336;
				this.match(CompiscriptParser.OR);
				this.state = 337;
				this.logicalAndExpression();
				}
				}
				this.state = 342;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public logicalAndExpression(): LogicalAndExpressionContext {
		let _localctx: LogicalAndExpressionContext = new LogicalAndExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, CompiscriptParser.RULE_logicalAndExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 343;
			this.equalityExpression();
			this.state = 348;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CompiscriptParser.AND) {
				{
				{
				this.state = 344;
				this.match(CompiscriptParser.AND);
				this.state = 345;
				this.equalityExpression();
				}
				}
				this.state = 350;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public equalityExpression(): EqualityExpressionContext {
		let _localctx: EqualityExpressionContext = new EqualityExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, CompiscriptParser.RULE_equalityExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 351;
			this.relationalExpression();
			this.state = 356;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CompiscriptParser.EQUAL || _la === CompiscriptParser.NOT_EQUAL) {
				{
				{
				this.state = 352;
				_la = this._input.LA(1);
				if (!(_la === CompiscriptParser.EQUAL || _la === CompiscriptParser.NOT_EQUAL)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 353;
				this.relationalExpression();
				}
				}
				this.state = 358;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public relationalExpression(): RelationalExpressionContext {
		let _localctx: RelationalExpressionContext = new RelationalExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, CompiscriptParser.RULE_relationalExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 359;
			this.additiveExpression();
			this.state = 364;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 35)) & ~0x1F) === 0 && ((1 << (_la - 35)) & ((1 << (CompiscriptParser.LTE - 35)) | (1 << (CompiscriptParser.GTE - 35)) | (1 << (CompiscriptParser.LT - 35)) | (1 << (CompiscriptParser.GT - 35)))) !== 0)) {
				{
				{
				this.state = 360;
				_la = this._input.LA(1);
				if (!(((((_la - 35)) & ~0x1F) === 0 && ((1 << (_la - 35)) & ((1 << (CompiscriptParser.LTE - 35)) | (1 << (CompiscriptParser.GTE - 35)) | (1 << (CompiscriptParser.LT - 35)) | (1 << (CompiscriptParser.GT - 35)))) !== 0))) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 361;
				this.additiveExpression();
				}
				}
				this.state = 366;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public additiveExpression(): AdditiveExpressionContext {
		let _localctx: AdditiveExpressionContext = new AdditiveExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, CompiscriptParser.RULE_additiveExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 367;
			this.multiplicativeExpression();
			this.state = 372;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CompiscriptParser.PLUS || _la === CompiscriptParser.MINUS) {
				{
				{
				this.state = 368;
				_la = this._input.LA(1);
				if (!(_la === CompiscriptParser.PLUS || _la === CompiscriptParser.MINUS)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 369;
				this.multiplicativeExpression();
				}
				}
				this.state = 374;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public multiplicativeExpression(): MultiplicativeExpressionContext {
		let _localctx: MultiplicativeExpressionContext = new MultiplicativeExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, CompiscriptParser.RULE_multiplicativeExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 375;
			this.unaryExpression();
			this.state = 380;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 42)) & ~0x1F) === 0 && ((1 << (_la - 42)) & ((1 << (CompiscriptParser.STAR - 42)) | (1 << (CompiscriptParser.SLASH - 42)) | (1 << (CompiscriptParser.PERCENT - 42)))) !== 0)) {
				{
				{
				this.state = 376;
				_la = this._input.LA(1);
				if (!(((((_la - 42)) & ~0x1F) === 0 && ((1 << (_la - 42)) & ((1 << (CompiscriptParser.STAR - 42)) | (1 << (CompiscriptParser.SLASH - 42)) | (1 << (CompiscriptParser.PERCENT - 42)))) !== 0))) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 377;
				this.unaryExpression();
				}
				}
				this.state = 382;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public unaryExpression(): UnaryExpressionContext {
		let _localctx: UnaryExpressionContext = new UnaryExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, CompiscriptParser.RULE_unaryExpression);
		let _la: number;
		try {
			this.state = 386;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CompiscriptParser.MINUS:
			case CompiscriptParser.NOT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 383;
				_la = this._input.LA(1);
				if (!(_la === CompiscriptParser.MINUS || _la === CompiscriptParser.NOT)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 384;
				this.unaryExpression();
				}
				break;
			case CompiscriptParser.NEW:
			case CompiscriptParser.THIS:
			case CompiscriptParser.TRUE:
			case CompiscriptParser.FALSE:
			case CompiscriptParser.NULL:
			case CompiscriptParser.LPAREN:
			case CompiscriptParser.LBRACKET:
			case CompiscriptParser.FloatLiteral:
			case CompiscriptParser.IntegerLiteral:
			case CompiscriptParser.StringLiteral:
			case CompiscriptParser.Identifier:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 385;
				this.primaryExpression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public primaryExpression(): PrimaryExpressionContext {
		let _localctx: PrimaryExpressionContext = new PrimaryExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 74, CompiscriptParser.RULE_primaryExpression);
		try {
			this.state = 394;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CompiscriptParser.TRUE:
			case CompiscriptParser.FALSE:
			case CompiscriptParser.NULL:
			case CompiscriptParser.LBRACKET:
			case CompiscriptParser.FloatLiteral:
			case CompiscriptParser.IntegerLiteral:
			case CompiscriptParser.StringLiteral:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 388;
				this.literalExpression();
				}
				break;
			case CompiscriptParser.NEW:
			case CompiscriptParser.THIS:
			case CompiscriptParser.Identifier:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 389;
				this.leftHandSide();
				}
				break;
			case CompiscriptParser.LPAREN:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 390;
				this.match(CompiscriptParser.LPAREN);
				this.state = 391;
				this.expression();
				this.state = 392;
				this.match(CompiscriptParser.RPAREN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public literalExpression(): LiteralExpressionContext {
		let _localctx: LiteralExpressionContext = new LiteralExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 76, CompiscriptParser.RULE_literalExpression);
		try {
			this.state = 403;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CompiscriptParser.IntegerLiteral:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 396;
				this.match(CompiscriptParser.IntegerLiteral);
				}
				break;
			case CompiscriptParser.FloatLiteral:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 397;
				this.match(CompiscriptParser.FloatLiteral);
				}
				break;
			case CompiscriptParser.StringLiteral:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 398;
				this.match(CompiscriptParser.StringLiteral);
				}
				break;
			case CompiscriptParser.TRUE:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 399;
				this.match(CompiscriptParser.TRUE);
				}
				break;
			case CompiscriptParser.FALSE:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 400;
				this.match(CompiscriptParser.FALSE);
				}
				break;
			case CompiscriptParser.NULL:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 401;
				this.match(CompiscriptParser.NULL);
				}
				break;
			case CompiscriptParser.LBRACKET:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 402;
				this.arrayLiteral();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public leftHandSide(): LeftHandSideContext {
		let _localctx: LeftHandSideContext = new LeftHandSideContext(this._ctx, this.state);
		this.enterRule(_localctx, 78, CompiscriptParser.RULE_leftHandSide);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 405;
			this.primaryAtom();
			this.state = 409;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 48)) & ~0x1F) === 0 && ((1 << (_la - 48)) & ((1 << (CompiscriptParser.DOT - 48)) | (1 << (CompiscriptParser.LPAREN - 48)) | (1 << (CompiscriptParser.LBRACKET - 48)))) !== 0)) {
				{
				{
				this.state = 406;
				this.suffixOperator();
				}
				}
				this.state = 411;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public primaryAtom(): PrimaryAtomContext {
		let _localctx: PrimaryAtomContext = new PrimaryAtomContext(this._ctx, this.state);
		this.enterRule(_localctx, 80, CompiscriptParser.RULE_primaryAtom);
		let _la: number;
		try {
			this.state = 421;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CompiscriptParser.Identifier:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 412;
				this.match(CompiscriptParser.Identifier);
				}
				break;
			case CompiscriptParser.NEW:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 413;
				this.match(CompiscriptParser.NEW);
				this.state = 414;
				this.match(CompiscriptParser.Identifier);
				this.state = 415;
				this.match(CompiscriptParser.LPAREN);
				this.state = 417;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.NEW) | (1 << CompiscriptParser.THIS) | (1 << CompiscriptParser.TRUE) | (1 << CompiscriptParser.FALSE) | (1 << CompiscriptParser.NULL))) !== 0) || ((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & ((1 << (CompiscriptParser.MINUS - 41)) | (1 << (CompiscriptParser.NOT - 41)) | (1 << (CompiscriptParser.LPAREN - 41)) | (1 << (CompiscriptParser.LBRACKET - 41)) | (1 << (CompiscriptParser.FloatLiteral - 41)) | (1 << (CompiscriptParser.IntegerLiteral - 41)) | (1 << (CompiscriptParser.StringLiteral - 41)) | (1 << (CompiscriptParser.Identifier - 41)))) !== 0)) {
					{
					this.state = 416;
					this.arguments();
					}
				}

				this.state = 419;
				this.match(CompiscriptParser.RPAREN);
				}
				break;
			case CompiscriptParser.THIS:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 420;
				this.match(CompiscriptParser.THIS);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public suffixOperator(): SuffixOperatorContext {
		let _localctx: SuffixOperatorContext = new SuffixOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 82, CompiscriptParser.RULE_suffixOperator);
		let _la: number;
		try {
			this.state = 434;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CompiscriptParser.LPAREN:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 423;
				this.match(CompiscriptParser.LPAREN);
				this.state = 425;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.NEW) | (1 << CompiscriptParser.THIS) | (1 << CompiscriptParser.TRUE) | (1 << CompiscriptParser.FALSE) | (1 << CompiscriptParser.NULL))) !== 0) || ((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & ((1 << (CompiscriptParser.MINUS - 41)) | (1 << (CompiscriptParser.NOT - 41)) | (1 << (CompiscriptParser.LPAREN - 41)) | (1 << (CompiscriptParser.LBRACKET - 41)) | (1 << (CompiscriptParser.FloatLiteral - 41)) | (1 << (CompiscriptParser.IntegerLiteral - 41)) | (1 << (CompiscriptParser.StringLiteral - 41)) | (1 << (CompiscriptParser.Identifier - 41)))) !== 0)) {
					{
					this.state = 424;
					this.arguments();
					}
				}

				this.state = 427;
				this.match(CompiscriptParser.RPAREN);
				}
				break;
			case CompiscriptParser.LBRACKET:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 428;
				this.match(CompiscriptParser.LBRACKET);
				this.state = 429;
				this.expression();
				this.state = 430;
				this.match(CompiscriptParser.RBRACKET);
				}
				break;
			case CompiscriptParser.DOT:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 432;
				this.match(CompiscriptParser.DOT);
				this.state = 433;
				this.match(CompiscriptParser.Identifier);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public arguments(): ArgumentsContext {
		let _localctx: ArgumentsContext = new ArgumentsContext(this._ctx, this.state);
		this.enterRule(_localctx, 84, CompiscriptParser.RULE_arguments);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 436;
			this.expression();
			this.state = 441;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CompiscriptParser.COMMA) {
				{
				{
				this.state = 437;
				this.match(CompiscriptParser.COMMA);
				this.state = 438;
				this.expression();
				}
				}
				this.state = 443;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public arrayLiteral(): ArrayLiteralContext {
		let _localctx: ArrayLiteralContext = new ArrayLiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 86, CompiscriptParser.RULE_arrayLiteral);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 444;
			this.match(CompiscriptParser.LBRACKET);
			this.state = 453;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.NEW) | (1 << CompiscriptParser.THIS) | (1 << CompiscriptParser.TRUE) | (1 << CompiscriptParser.FALSE) | (1 << CompiscriptParser.NULL))) !== 0) || ((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & ((1 << (CompiscriptParser.MINUS - 41)) | (1 << (CompiscriptParser.NOT - 41)) | (1 << (CompiscriptParser.LPAREN - 41)) | (1 << (CompiscriptParser.LBRACKET - 41)) | (1 << (CompiscriptParser.FloatLiteral - 41)) | (1 << (CompiscriptParser.IntegerLiteral - 41)) | (1 << (CompiscriptParser.StringLiteral - 41)) | (1 << (CompiscriptParser.Identifier - 41)))) !== 0)) {
				{
				this.state = 445;
				this.expression();
				this.state = 450;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === CompiscriptParser.COMMA) {
					{
					{
					this.state = 446;
					this.match(CompiscriptParser.COMMA);
					this.state = 447;
					this.expression();
					}
					}
					this.state = 452;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 455;
			this.match(CompiscriptParser.RBRACKET);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public type(): TypeContext {
		let _localctx: TypeContext = new TypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 88, CompiscriptParser.RULE_type);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 457;
			this.baseType();
			this.state = 462;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CompiscriptParser.LBRACKET) {
				{
				{
				this.state = 458;
				this.match(CompiscriptParser.LBRACKET);
				this.state = 459;
				this.match(CompiscriptParser.RBRACKET);
				}
				}
				this.state = 464;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public baseType(): BaseTypeContext {
		let _localctx: BaseTypeContext = new BaseTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 90, CompiscriptParser.RULE_baseType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 465;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CompiscriptParser.BOOLEAN_TYPE) | (1 << CompiscriptParser.INTEGER_TYPE) | (1 << CompiscriptParser.FLOAT_TYPE) | (1 << CompiscriptParser.STRING_TYPE))) !== 0) || _la === CompiscriptParser.Identifier)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03A\u01D6\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04" +
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04#" +
		"\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04+\t+" +
		"\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x03\x02\x07\x02`\n\x02\f\x02\x0E\x02" +
		"c\v\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x05\x03x\n\x03\x03\x04\x03\x04\x07\x04|\n\x04\f\x04\x0E" +
		"\x04\x7F\v\x04\x03\x04\x03\x04\x03\x05\x03\x05\x03\x05\x05\x05\x86\n\x05" +
		"\x03\x05\x05\x05\x89\n\x05\x03\x05\x03\x05\x03\x06\x03\x06\x03\x06\x05" +
		"\x06\x90\n\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x07\x03\x07\x03\x07" +
		"\x03\b\x03\b\x03\b\x03\t\x03\t\x03\t\x03\n\x03\n\x03\n\x03\n\x03\n\x03" +
		"\n\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x05\v\xAC\n\v\x03\f\x03\f" +
		"\x03\f\x03\f\x03\f\x03\f\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03" +
		"\r\x03\x0E\x03\x0E\x03\x0E\x05\x0E\xBF\n\x0E\x03\x0E\x03\x0E\x05\x0E\xC3" +
		"\n\x0E\x03\x0E\x03\x0E\x05\x0E\xC7\n\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0F" +
		"\x03\x0F\x03\x0F\x05\x0F\xCF\n\x0F\x03\x0F\x05\x0F\xD2\n\x0F\x03\x0F\x05" +
		"\x0F\xD5\n\x0F\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10" +
		"\x03\x10\x03\x11\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12\x03\x13\x03\x13" +
		"\x05\x13\xE7\n\x13\x03\x13\x03\x13\x03\x14\x03\x14\x03\x14\x03\x14\x03" +
		"\x14\x03\x14\x03\x14\x03\x14\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03" +
		"\x15\x07\x15\xF9\n\x15\f\x15\x0E\x15\xFC\v\x15\x03\x15\x05\x15\xFF\n\x15" +
		"\x03\x15\x03\x15\x03\x16\x03\x16\x03\x16\x03\x16\x07\x16\u0107\n\x16\f" +
		"\x16\x0E\x16\u010A\v\x16\x03\x17\x03\x17\x03\x17\x07\x17\u010F\n\x17\f" +
		"\x17\x0E\x17\u0112\v\x17\x03\x18\x03\x18\x03\x18\x03\x18\x05\x18\u0118" +
		"\n\x18\x03\x18\x03\x18\x03\x18\x05\x18\u011D\n\x18\x03\x18\x03\x18\x03" +
		"\x19\x03\x19\x03\x19\x07\x19\u0124\n\x19\f\x19\x0E\x19\u0127\v\x19\x03" +
		"\x1A\x03\x1A\x05\x1A\u012B\n\x1A\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x05\x1B" +
		"\u0131\n\x1B\x03\x1B\x03\x1B\x07\x1B\u0135\n\x1B\f\x1B\x0E\x1B\u0138\v" +
		"\x1B\x03\x1B\x03\x1B\x03\x1C\x03\x1C\x03\x1C\x05\x1C\u013F\n\x1C\x03\x1D" +
		"\x03\x1D\x03\x1E\x03\x1E\x03\x1E\x03\x1E\x03\x1E\x05\x1E\u0148\n\x1E\x03" +
		"\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x05\x1F\u0150\n\x1F\x03 " +
		"\x03 \x03 \x07 \u0155\n \f \x0E \u0158\v \x03!\x03!\x03!\x07!\u015D\n" +
		"!\f!\x0E!\u0160\v!\x03\"\x03\"\x03\"\x07\"\u0165\n\"\f\"\x0E\"\u0168\v" +
		"\"\x03#\x03#\x03#\x07#\u016D\n#\f#\x0E#\u0170\v#\x03$\x03$\x03$\x07$\u0175" +
		"\n$\f$\x0E$\u0178\v$\x03%\x03%\x03%\x07%\u017D\n%\f%\x0E%\u0180\v%\x03" +
		"&\x03&\x03&\x05&\u0185\n&\x03\'\x03\'\x03\'\x03\'\x03\'\x03\'\x05\'\u018D" +
		"\n\'\x03(\x03(\x03(\x03(\x03(\x03(\x03(\x05(\u0196\n(\x03)\x03)\x07)\u019A" +
		"\n)\f)\x0E)\u019D\v)\x03*\x03*\x03*\x03*\x03*\x05*\u01A4\n*\x03*\x03*" +
		"\x05*\u01A8\n*\x03+\x03+\x05+\u01AC\n+\x03+\x03+\x03+\x03+\x03+\x03+\x03" +
		"+\x05+\u01B5\n+\x03,\x03,\x03,\x07,\u01BA\n,\f,\x0E,\u01BD\v,\x03-\x03" +
		"-\x03-\x03-\x07-\u01C3\n-\f-\x0E-\u01C6\v-\x05-\u01C8\n-\x03-\x03-\x03" +
		".\x03.\x03.\x07.\u01CF\n.\f.\x0E.\u01D2\v.\x03/\x03/\x03/\x02\x02\x02" +
		"0\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14" +
		"\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02&\x02(\x02" +
		"*\x02,\x02.\x020\x022\x024\x026\x028\x02:\x02<\x02>\x02@\x02B\x02D\x02" +
		"F\x02H\x02J\x02L\x02N\x02P\x02R\x02T\x02V\x02X\x02Z\x02\\\x02\x02\t\x03" +
		"\x02\x03\x04\x03\x02#$\x04\x02%&()\x03\x02*+\x03\x02,.\x04\x02++//\x04" +
		"\x02\x1D >>\x02\u01EC\x02a\x03\x02\x02\x02\x04w\x03\x02\x02\x02\x06y\x03" +
		"\x02\x02\x02\b\x82\x03\x02\x02\x02\n\x8C\x03\x02\x02\x02\f\x95\x03\x02" +
		"\x02\x02\x0E\x98\x03\x02\x02\x02\x10\x9B\x03\x02\x02\x02\x12\x9E\x03\x02" +
		"\x02\x02\x14\xA4\x03\x02\x02\x02\x16\xAD\x03\x02\x02\x02\x18\xB3\x03\x02" +
		"\x02\x02\x1A\xBB\x03\x02\x02\x02\x1C\xD4\x03\x02\x02\x02\x1E\xD6\x03\x02" +
		"\x02\x02 \xDE\x03\x02\x02\x02\"\xE1\x03\x02\x02\x02$\xE4\x03\x02\x02\x02" +
		"&\xEA\x03\x02\x02\x02(\xF2\x03\x02\x02\x02*\u0102\x03\x02\x02\x02,\u010B" +
		"\x03\x02\x02\x02.\u0113\x03\x02\x02\x020\u0120\x03\x02\x02\x022\u0128" +
		"\x03\x02\x02\x024\u012C\x03\x02\x02\x026\u013E\x03\x02\x02\x028\u0140" +
		"\x03\x02\x02\x02:\u0147\x03\x02\x02\x02<\u0149\x03\x02\x02\x02>\u0151" +
		"\x03\x02\x02\x02@\u0159\x03\x02\x02\x02B\u0161\x03\x02\x02\x02D\u0169" +
		"\x03\x02\x02\x02F\u0171\x03\x02\x02\x02H\u0179\x03\x02\x02\x02J\u0184" +
		"\x03\x02\x02\x02L\u018C\x03\x02\x02\x02N\u0195\x03\x02\x02\x02P\u0197" +
		"\x03\x02\x02\x02R\u01A7\x03\x02\x02\x02T\u01B4\x03\x02\x02\x02V\u01B6" +
		"\x03\x02\x02\x02X\u01BE\x03\x02\x02\x02Z\u01CB\x03\x02\x02\x02\\\u01D3" +
		"\x03\x02\x02\x02^`\x05\x04\x03\x02_^\x03\x02\x02\x02`c\x03\x02\x02\x02" +
		"a_\x03\x02\x02\x02ab\x03\x02\x02\x02bd\x03\x02\x02\x02ca\x03\x02\x02\x02" +
		"de\x07\x02\x02\x03e\x03\x03\x02\x02\x02fx\x05\b\x05\x02gx\x05\n\x06\x02" +
		"hx\x05.\x18\x02ix\x054\x1B\x02jx\x05\x12\n\x02kx\x05\x06\x04\x02lx\x05" +
		"\x14\v\x02mx\x05\x16\f\x02nx\x05\x18\r\x02ox\x05\x1A\x0E\x02px\x05\x1E" +
		"\x10\x02qx\x05&\x14\x02rx\x05(\x15\x02sx\x05 \x11\x02tx\x05\"\x12\x02" +
		"ux\x05$\x13\x02vx\x05\x10\t\x02wf\x03\x02\x02\x02wg\x03\x02\x02\x02wh" +
		"\x03\x02\x02\x02wi\x03\x02\x02\x02wj\x03\x02\x02\x02wk\x03\x02\x02\x02" +
		"wl\x03\x02\x02\x02wm\x03\x02\x02\x02wn\x03\x02\x02\x02wo\x03\x02\x02\x02" +
		"wp\x03\x02\x02\x02wq\x03\x02\x02\x02wr\x03\x02\x02\x02ws\x03\x02\x02\x02" +
		"wt\x03\x02\x02\x02wu\x03\x02\x02\x02wv\x03\x02\x02\x02x\x05\x03\x02\x02" +
		"\x02y}\x077\x02\x02z|\x05\x04\x03\x02{z\x03\x02\x02\x02|\x7F\x03\x02\x02" +
		"\x02}{\x03\x02\x02\x02}~\x03\x02\x02\x02~\x80\x03\x02\x02\x02\x7F}\x03" +
		"\x02\x02\x02\x80\x81\x078\x02\x02\x81\x07\x03\x02\x02\x02\x82\x83\t\x02" +
		"\x02\x02\x83\x85\x07>\x02\x02\x84\x86\x05\f\x07\x02\x85\x84\x03\x02\x02" +
		"\x02\x85\x86\x03\x02\x02\x02\x86\x88\x03\x02\x02\x02\x87\x89\x05\x0E\b" +
		"\x02\x88\x87\x03\x02\x02\x02\x88\x89\x03\x02\x02\x02\x89\x8A\x03\x02\x02" +
		"\x02\x8A\x8B\x074\x02\x02\x8B\t\x03\x02\x02\x02\x8C\x8D\x07\x05\x02\x02" +
		"\x8D\x8F\x07>\x02\x02\x8E\x90\x05\f\x07\x02\x8F\x8E\x03\x02\x02\x02\x8F" +
		"\x90\x03\x02\x02\x02\x90\x91\x03\x02\x02\x02\x91\x92\x07\'\x02\x02\x92" +
		"\x93\x058\x1D\x02\x93\x94\x074\x02\x02\x94\v\x03\x02\x02\x02\x95\x96\x07" +
		"1\x02\x02\x96\x97\x05Z.\x02\x97\r\x03\x02\x02\x02\x98\x99\x07\'\x02\x02" +
		"\x99\x9A\x058\x1D\x02\x9A\x0F\x03\x02\x02\x02\x9B\x9C\x058\x1D\x02\x9C" +
		"\x9D\x074\x02\x02\x9D\x11\x03\x02\x02\x02\x9E\x9F\x07\b\x02\x02\x9F\xA0" +
		"\x075\x02\x02\xA0\xA1\x058\x1D\x02\xA1\xA2\x076\x02\x02\xA2\xA3\x074\x02" +
		"\x02\xA3\x13\x03\x02\x02\x02\xA4\xA5\x07\t\x02\x02\xA5\xA6\x075\x02\x02" +
		"\xA6\xA7\x058\x1D\x02\xA7\xA8\x076\x02\x02\xA8\xAB\x05\x06\x04\x02\xA9" +
		"\xAA\x07\n\x02\x02\xAA\xAC\x05\x06\x04\x02\xAB\xA9\x03\x02\x02\x02\xAB" +
		"\xAC\x03\x02\x02\x02\xAC\x15\x03\x02\x02\x02\xAD\xAE\x07\v\x02\x02\xAE" +
		"\xAF\x075\x02\x02\xAF\xB0\x058\x1D\x02\xB0\xB1\x076\x02\x02\xB1\xB2\x05" +
		"\x06\x04\x02\xB2\x17\x03\x02\x02\x02\xB3\xB4\x07\f\x02\x02\xB4\xB5\x05" +
		"\x06\x04\x02\xB5\xB6\x07\v\x02\x02\xB6\xB7\x075\x02\x02\xB7\xB8\x058\x1D" +
		"\x02\xB8\xB9\x076\x02\x02\xB9\xBA\x074\x02\x02\xBA\x19\x03\x02\x02\x02" +
		"\xBB\xBC\x07\r\x02\x02\xBC\xBE\x075\x02\x02\xBD\xBF\x05\x1C\x0F\x02\xBE" +
		"\xBD\x03\x02\x02\x02\xBE\xBF\x03\x02\x02\x02\xBF\xC0\x03\x02\x02\x02\xC0" +
		"\xC2\x074\x02\x02\xC1\xC3\x058\x1D\x02\xC2\xC1\x03\x02\x02\x02\xC2\xC3" +
		"\x03\x02\x02\x02\xC3\xC4\x03\x02\x02\x02\xC4\xC6\x074\x02\x02\xC5\xC7" +
		"\x058\x1D\x02\xC6\xC5\x03\x02\x02\x02\xC6\xC7\x03\x02\x02\x02\xC7\xC8" +
		"\x03\x02\x02\x02\xC8\xC9\x076\x02\x02\xC9\xCA\x05\x06\x04\x02\xCA\x1B" +
		"\x03\x02\x02\x02\xCB\xCC\t\x02\x02\x02\xCC\xCE\x07>\x02\x02\xCD\xCF\x05" +
		"\f\x07\x02\xCE\xCD\x03\x02\x02\x02\xCE\xCF\x03\x02\x02\x02\xCF\xD1\x03" +
		"\x02\x02\x02\xD0\xD2\x05\x0E\b\x02\xD1\xD0\x03\x02\x02\x02\xD1\xD2\x03" +
		"\x02\x02\x02\xD2\xD5\x03\x02\x02\x02\xD3\xD5\x058\x1D\x02\xD4\xCB\x03" +
		"\x02\x02\x02\xD4\xD3\x03\x02\x02\x02\xD5\x1D\x03\x02\x02\x02\xD6\xD7\x07" +
		"\x0E\x02\x02\xD7\xD8\x075\x02\x02\xD8\xD9\x07>\x02\x02\xD9\xDA\x07\x0F" +
		"\x02\x02\xDA\xDB\x058\x1D\x02\xDB\xDC\x076\x02\x02\xDC\xDD\x05\x06\x04" +
		"\x02\xDD\x1F\x03\x02\x02\x02\xDE\xDF\x07\x10\x02\x02\xDF\xE0\x074\x02" +
		"\x02\xE0!\x03\x02\x02\x02\xE1\xE2\x07\x11\x02\x02\xE2\xE3\x074\x02\x02" +
		"\xE3#\x03\x02\x02\x02\xE4\xE6\x07\x12\x02\x02\xE5\xE7\x058\x1D\x02\xE6" +
		"\xE5\x03\x02\x02\x02\xE6\xE7\x03\x02\x02\x02\xE7\xE8\x03\x02\x02\x02\xE8" +
		"\xE9\x074\x02\x02\xE9%\x03\x02\x02\x02\xEA\xEB\x07\x13\x02\x02\xEB\xEC" +
		"\x05\x06\x04\x02\xEC\xED\x07\x14\x02\x02\xED\xEE\x075\x02\x02\xEE\xEF" +
		"\x07>\x02\x02\xEF\xF0\x076\x02\x02\xF0\xF1\x05\x06\x04\x02\xF1\'\x03\x02" +
		"\x02\x02\xF2\xF3\x07\x15\x02\x02\xF3\xF4\x075\x02\x02\xF4\xF5\x058\x1D" +
		"\x02\xF5\xF6\x076\x02\x02\xF6\xFA\x077\x02\x02\xF7\xF9\x05*\x16\x02\xF8" +
		"\xF7\x03\x02\x02\x02\xF9\xFC\x03\x02\x02\x02\xFA\xF8\x03\x02\x02\x02\xFA" +
		"\xFB\x03\x02\x02\x02\xFB\xFE\x03\x02\x02\x02\xFC\xFA\x03\x02\x02\x02\xFD" +
		"\xFF\x05,\x17\x02\xFE\xFD\x03\x02\x02\x02\xFE\xFF\x03\x02\x02\x02\xFF" +
		"\u0100\x03\x02\x02\x02\u0100\u0101\x078\x02\x02\u0101)\x03\x02\x02\x02" +
		"\u0102\u0103\x07\x16\x02\x02\u0103\u0104\x058\x1D\x02\u0104\u0108\x07" +
		"1\x02\x02\u0105\u0107\x05\x04\x03\x02\u0106\u0105\x03\x02\x02\x02\u0107" +
		"\u010A\x03\x02\x02\x02\u0108\u0106\x03\x02\x02\x02\u0108\u0109\x03\x02" +
		"\x02\x02\u0109+\x03\x02\x02\x02\u010A\u0108\x03\x02\x02\x02\u010B\u010C" +
		"\x07\x17\x02\x02\u010C\u0110\x071\x02\x02\u010D\u010F\x05\x04\x03\x02" +
		"\u010E\u010D\x03\x02\x02\x02\u010F\u0112\x03\x02\x02\x02\u0110\u010E\x03" +
		"\x02\x02\x02\u0110\u0111\x03\x02\x02\x02\u0111-\x03\x02\x02\x02\u0112" +
		"\u0110\x03\x02\x02\x02\u0113\u0114\x07\x06\x02\x02\u0114\u0115\x07>\x02" +
		"\x02\u0115\u0117\x075\x02\x02\u0116\u0118\x050\x19\x02\u0117\u0116\x03" +
		"\x02\x02\x02\u0117\u0118\x03\x02\x02\x02\u0118\u0119\x03\x02\x02\x02\u0119" +
		"\u011C\x076\x02\x02\u011A\u011B\x071\x02\x02\u011B\u011D\x05Z.\x02\u011C" +
		"\u011A\x03\x02\x02\x02\u011C\u011D\x03\x02\x02\x02\u011D\u011E\x03\x02" +
		"\x02\x02\u011E\u011F\x05\x06\x04\x02\u011F/\x03\x02\x02\x02\u0120\u0125" +
		"\x052\x1A\x02\u0121\u0122\x073\x02\x02\u0122\u0124\x052\x1A\x02\u0123" +
		"\u0121\x03\x02\x02\x02\u0124\u0127\x03\x02\x02\x02\u0125\u0123\x03\x02" +
		"\x02\x02\u0125\u0126\x03\x02\x02\x02\u01261\x03\x02\x02\x02\u0127\u0125" +
		"\x03\x02\x02\x02\u0128\u012A\x07>\x02\x02\u0129\u012B\x05\f\x07\x02\u012A" +
		"\u0129\x03\x02\x02\x02\u012A\u012B\x03\x02\x02\x02\u012B3\x03\x02\x02" +
		"\x02\u012C\u012D\x07\x07\x02\x02\u012D\u0130\x07>\x02\x02\u012E\u012F" +
		"\x071\x02\x02\u012F\u0131\x07>\x02\x02\u0130\u012E\x03\x02\x02\x02\u0130" +
		"\u0131\x03\x02\x02\x02\u0131\u0132\x03\x02\x02\x02\u0132\u0136\x077\x02" +
		"\x02\u0133\u0135\x056\x1C\x02\u0134\u0133\x03\x02\x02\x02\u0135\u0138" +
		"\x03\x02\x02\x02\u0136\u0134\x03\x02\x02\x02\u0136\u0137\x03\x02\x02\x02" +
		"\u0137\u0139\x03\x02\x02\x02\u0138\u0136\x03\x02\x02\x02\u0139\u013A\x07" +
		"8\x02\x02\u013A5\x03\x02\x02\x02\u013B\u013F\x05.\x18\x02\u013C\u013F" +
		"\x05\b\x05\x02\u013D\u013F\x05\n\x06\x02\u013E\u013B\x03\x02\x02\x02\u013E" +
		"\u013C\x03\x02\x02\x02\u013E\u013D\x03\x02\x02\x02\u013F7\x03\x02\x02" +
		"\x02\u0140\u0141\x05:\x1E\x02\u01419\x03\x02\x02\x02\u0142\u0143\x05P" +
		")\x02\u0143\u0144\x07\'\x02\x02\u0144\u0145\x05:\x1E\x02\u0145\u0148\x03" +
		"\x02\x02\x02\u0146\u0148\x05<\x1F\x02\u0147\u0142\x03\x02\x02\x02\u0147" +
		"\u0146\x03\x02\x02\x02\u0148;\x03\x02\x02\x02\u0149\u014F\x05> \x02\u014A" +
		"\u014B\x070\x02\x02\u014B\u014C\x058\x1D\x02\u014C\u014D\x071\x02\x02" +
		"\u014D\u014E\x058\x1D\x02\u014E\u0150\x03\x02\x02\x02\u014F\u014A\x03" +
		"\x02\x02\x02\u014F\u0150\x03\x02\x02\x02\u0150=\x03\x02\x02\x02\u0151" +
		"\u0156\x05@!\x02\u0152\u0153\x07!\x02\x02\u0153\u0155\x05@!\x02\u0154" +
		"\u0152\x03\x02\x02\x02\u0155\u0158\x03\x02\x02\x02\u0156\u0154\x03\x02" +
		"\x02\x02\u0156\u0157\x03\x02\x02\x02\u0157?\x03\x02\x02\x02\u0158\u0156" +
		"\x03\x02\x02\x02\u0159\u015E\x05B\"\x02\u015A\u015B\x07\"\x02\x02\u015B" +
		"\u015D\x05B\"\x02\u015C\u015A\x03\x02\x02\x02\u015D\u0160\x03\x02\x02" +
		"\x02\u015E\u015C\x03\x02\x02\x02\u015E\u015F\x03\x02\x02\x02\u015FA\x03" +
		"\x02\x02\x02\u0160\u015E\x03\x02\x02\x02\u0161\u0166\x05D#\x02\u0162\u0163" +
		"\t\x03\x02\x02\u0163\u0165\x05D#\x02\u0164\u0162\x03\x02\x02\x02\u0165" +
		"\u0168\x03\x02\x02\x02\u0166\u0164\x03\x02\x02\x02\u0166\u0167\x03\x02" +
		"\x02\x02\u0167C\x03\x02\x02\x02\u0168\u0166\x03\x02\x02\x02\u0169\u016E" +
		"\x05F$\x02\u016A\u016B\t\x04\x02\x02\u016B\u016D\x05F$\x02\u016C\u016A" +
		"\x03\x02\x02\x02\u016D\u0170\x03\x02\x02\x02\u016E\u016C\x03\x02\x02\x02" +
		"\u016E\u016F\x03\x02\x02\x02\u016FE\x03\x02\x02\x02\u0170\u016E\x03\x02" +
		"\x02\x02\u0171\u0176\x05H%\x02\u0172\u0173\t\x05\x02\x02\u0173\u0175\x05" +
		"H%\x02\u0174\u0172\x03\x02\x02\x02\u0175\u0178\x03\x02\x02\x02\u0176\u0174" +
		"\x03\x02\x02\x02\u0176\u0177\x03\x02\x02\x02\u0177G\x03\x02\x02\x02\u0178" +
		"\u0176\x03\x02\x02\x02\u0179\u017E\x05J&\x02\u017A\u017B\t\x06\x02\x02" +
		"\u017B\u017D\x05J&\x02\u017C\u017A\x03\x02\x02\x02\u017D\u0180\x03\x02" +
		"\x02\x02\u017E\u017C\x03\x02\x02\x02\u017E\u017F\x03\x02\x02\x02\u017F" +
		"I\x03\x02\x02\x02\u0180\u017E\x03\x02\x02\x02\u0181\u0182\t\x07\x02\x02" +
		"\u0182\u0185\x05J&\x02\u0183\u0185\x05L\'\x02\u0184\u0181\x03\x02\x02" +
		"\x02\u0184\u0183\x03\x02\x02\x02\u0185K\x03\x02\x02\x02\u0186\u018D\x05" +
		"N(\x02\u0187\u018D\x05P)\x02\u0188\u0189\x075\x02\x02\u0189\u018A\x05" +
		"8\x1D\x02\u018A\u018B\x076\x02\x02\u018B\u018D\x03\x02\x02\x02\u018C\u0186" +
		"\x03\x02\x02\x02\u018C\u0187\x03\x02\x02\x02\u018C\u0188\x03\x02\x02\x02" +
		"\u018DM\x03\x02\x02\x02\u018E\u0196\x07<\x02\x02\u018F\u0196\x07;\x02" +
		"\x02\u0190\u0196\x07=\x02\x02\u0191\u0196\x07\x1A\x02\x02\u0192\u0196" +
		"\x07\x1B\x02\x02\u0193\u0196\x07\x1C\x02\x02\u0194\u0196\x05X-\x02\u0195" +
		"\u018E\x03\x02\x02\x02\u0195\u018F\x03\x02\x02\x02\u0195\u0190\x03\x02" +
		"\x02\x02\u0195\u0191\x03\x02\x02\x02\u0195\u0192\x03\x02\x02\x02\u0195" +
		"\u0193\x03\x02\x02\x02\u0195\u0194\x03\x02\x02\x02\u0196O\x03\x02\x02" +
		"\x02\u0197\u019B\x05R*\x02\u0198\u019A\x05T+\x02\u0199\u0198\x03\x02\x02" +
		"\x02\u019A\u019D\x03\x02\x02\x02\u019B\u0199\x03\x02\x02\x02\u019B\u019C" +
		"\x03\x02\x02\x02\u019CQ\x03\x02\x02\x02\u019D\u019B\x03\x02\x02\x02\u019E" +
		"\u01A8\x07>\x02\x02\u019F\u01A0\x07\x18\x02\x02\u01A0\u01A1\x07>\x02\x02" +
		"\u01A1\u01A3\x075\x02\x02\u01A2\u01A4\x05V,\x02\u01A3\u01A2\x03\x02\x02" +
		"\x02\u01A3\u01A4\x03\x02\x02\x02\u01A4\u01A5\x03\x02\x02\x02\u01A5\u01A8" +
		"\x076\x02\x02\u01A6\u01A8\x07\x19\x02\x02\u01A7\u019E\x03\x02\x02\x02" +
		"\u01A7\u019F\x03\x02\x02\x02\u01A7\u01A6\x03\x02\x02\x02\u01A8S\x03\x02" +
		"\x02\x02\u01A9\u01AB\x075\x02\x02\u01AA\u01AC\x05V,\x02\u01AB\u01AA\x03" +
		"\x02\x02\x02\u01AB\u01AC\x03\x02\x02\x02\u01AC\u01AD\x03\x02\x02\x02\u01AD" +
		"\u01B5\x076\x02\x02\u01AE\u01AF\x079\x02\x02\u01AF\u01B0\x058\x1D\x02" +
		"\u01B0\u01B1\x07:\x02\x02\u01B1\u01B5\x03\x02\x02\x02\u01B2\u01B3\x07" +
		"2\x02\x02\u01B3\u01B5\x07>\x02\x02\u01B4\u01A9\x03\x02\x02\x02\u01B4\u01AE" +
		"\x03\x02\x02\x02\u01B4\u01B2\x03\x02\x02\x02\u01B5U\x03\x02\x02\x02\u01B6" +
		"\u01BB\x058\x1D\x02\u01B7\u01B8\x073\x02\x02\u01B8\u01BA\x058\x1D\x02" +
		"\u01B9\u01B7\x03\x02\x02\x02\u01BA\u01BD\x03\x02\x02\x02\u01BB\u01B9\x03" +
		"\x02\x02\x02\u01BB\u01BC\x03\x02\x02\x02\u01BCW\x03\x02\x02\x02\u01BD" +
		"\u01BB\x03\x02\x02\x02\u01BE\u01C7\x079\x02\x02\u01BF\u01C4\x058\x1D\x02" +
		"\u01C0\u01C1\x073\x02\x02\u01C1\u01C3\x058\x1D\x02\u01C2\u01C0\x03\x02" +
		"\x02\x02\u01C3\u01C6\x03\x02\x02\x02\u01C4\u01C2\x03\x02\x02\x02\u01C4" +
		"\u01C5\x03\x02\x02\x02\u01C5\u01C8\x03\x02\x02\x02\u01C6\u01C4\x03\x02" +
		"\x02\x02\u01C7\u01BF\x03\x02\x02\x02\u01C7\u01C8\x03\x02\x02\x02\u01C8" +
		"\u01C9\x03\x02\x02\x02\u01C9\u01CA\x07:\x02\x02\u01CAY\x03\x02\x02\x02" +
		"\u01CB\u01D0\x05\\/\x02\u01CC\u01CD\x079\x02\x02\u01CD\u01CF\x07:\x02" +
		"\x02\u01CE\u01CC\x03\x02\x02\x02\u01CF\u01D2\x03\x02\x02\x02\u01D0\u01CE" +
		"\x03\x02\x02\x02\u01D0\u01D1\x03\x02\x02\x02\u01D1[\x03\x02\x02\x02\u01D2" +
		"\u01D0\x03\x02\x02\x02\u01D3\u01D4\t\b\x02\x02\u01D4]\x03\x02\x02\x02" +
		"/aw}\x85\x88\x8F\xAB\xBE\xC2\xC6\xCE\xD1\xD4\xE6\xFA\xFE\u0108\u0110\u0117" +
		"\u011C\u0125\u012A\u0130\u0136\u013E\u0147\u014F\u0156\u015E\u0166\u016E" +
		"\u0176\u017E\u0184\u018C\u0195\u019B\u01A3\u01A7\u01AB\u01B4\u01BB\u01C4" +
		"\u01C7\u01D0";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!CompiscriptParser.__ATN) {
			CompiscriptParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(CompiscriptParser._serializedATN));
		}

		return CompiscriptParser.__ATN;
	}

}

export class ProgramContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(CompiscriptParser.EOF, 0); }
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_program; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitProgram) {
			return visitor.visitProgram(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementContext extends ParserRuleContext {
	public variableDeclaration(): VariableDeclarationContext | undefined {
		return this.tryGetRuleContext(0, VariableDeclarationContext);
	}
	public constantDeclaration(): ConstantDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ConstantDeclarationContext);
	}
	public functionDeclaration(): FunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, FunctionDeclarationContext);
	}
	public classDeclaration(): ClassDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ClassDeclarationContext);
	}
	public printStatement(): PrintStatementContext | undefined {
		return this.tryGetRuleContext(0, PrintStatementContext);
	}
	public block(): BlockContext | undefined {
		return this.tryGetRuleContext(0, BlockContext);
	}
	public ifStatement(): IfStatementContext | undefined {
		return this.tryGetRuleContext(0, IfStatementContext);
	}
	public whileStatement(): WhileStatementContext | undefined {
		return this.tryGetRuleContext(0, WhileStatementContext);
	}
	public doWhileStatement(): DoWhileStatementContext | undefined {
		return this.tryGetRuleContext(0, DoWhileStatementContext);
	}
	public forStatement(): ForStatementContext | undefined {
		return this.tryGetRuleContext(0, ForStatementContext);
	}
	public foreachStatement(): ForeachStatementContext | undefined {
		return this.tryGetRuleContext(0, ForeachStatementContext);
	}
	public tryCatchStatement(): TryCatchStatementContext | undefined {
		return this.tryGetRuleContext(0, TryCatchStatementContext);
	}
	public switchStatement(): SwitchStatementContext | undefined {
		return this.tryGetRuleContext(0, SwitchStatementContext);
	}
	public breakStatement(): BreakStatementContext | undefined {
		return this.tryGetRuleContext(0, BreakStatementContext);
	}
	public continueStatement(): ContinueStatementContext | undefined {
		return this.tryGetRuleContext(0, ContinueStatementContext);
	}
	public returnStatement(): ReturnStatementContext | undefined {
		return this.tryGetRuleContext(0, ReturnStatementContext);
	}
	public expressionStatement(): ExpressionStatementContext | undefined {
		return this.tryGetRuleContext(0, ExpressionStatementContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_statement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitStatement) {
			return visitor.visitStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(CompiscriptParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(CompiscriptParser.RBRACE, 0); }
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_block; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitBlock) {
			return visitor.visitBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableDeclarationContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(CompiscriptParser.Identifier, 0); }
	public SEMI(): TerminalNode { return this.getToken(CompiscriptParser.SEMI, 0); }
	public LET(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.LET, 0); }
	public VAR(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.VAR, 0); }
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	public initializer(): InitializerContext | undefined {
		return this.tryGetRuleContext(0, InitializerContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_variableDeclaration; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitVariableDeclaration) {
			return visitor.visitVariableDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstantDeclarationContext extends ParserRuleContext {
	public CONST(): TerminalNode { return this.getToken(CompiscriptParser.CONST, 0); }
	public Identifier(): TerminalNode { return this.getToken(CompiscriptParser.Identifier, 0); }
	public ASSIGN(): TerminalNode { return this.getToken(CompiscriptParser.ASSIGN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public SEMI(): TerminalNode { return this.getToken(CompiscriptParser.SEMI, 0); }
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_constantDeclaration; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitConstantDeclaration) {
			return visitor.visitConstantDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeAnnotationContext extends ParserRuleContext {
	public COLON(): TerminalNode { return this.getToken(CompiscriptParser.COLON, 0); }
	public type(): TypeContext {
		return this.getRuleContext(0, TypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_typeAnnotation; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitTypeAnnotation) {
			return visitor.visitTypeAnnotation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InitializerContext extends ParserRuleContext {
	public ASSIGN(): TerminalNode { return this.getToken(CompiscriptParser.ASSIGN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_initializer; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitInitializer) {
			return visitor.visitInitializer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionStatementContext extends ParserRuleContext {
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public SEMI(): TerminalNode { return this.getToken(CompiscriptParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_expressionStatement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitExpressionStatement) {
			return visitor.visitExpressionStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrintStatementContext extends ParserRuleContext {
	public PRINT(): TerminalNode { return this.getToken(CompiscriptParser.PRINT, 0); }
	public LPAREN(): TerminalNode { return this.getToken(CompiscriptParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(CompiscriptParser.RPAREN, 0); }
	public SEMI(): TerminalNode { return this.getToken(CompiscriptParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_printStatement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitPrintStatement) {
			return visitor.visitPrintStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IfStatementContext extends ParserRuleContext {
	public IF(): TerminalNode { return this.getToken(CompiscriptParser.IF, 0); }
	public LPAREN(): TerminalNode { return this.getToken(CompiscriptParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(CompiscriptParser.RPAREN, 0); }
	public block(): BlockContext[];
	public block(i: number): BlockContext;
	public block(i?: number): BlockContext | BlockContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BlockContext);
		} else {
			return this.getRuleContext(i, BlockContext);
		}
	}
	public ELSE(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.ELSE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_ifStatement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitIfStatement) {
			return visitor.visitIfStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class WhileStatementContext extends ParserRuleContext {
	public WHILE(): TerminalNode { return this.getToken(CompiscriptParser.WHILE, 0); }
	public LPAREN(): TerminalNode { return this.getToken(CompiscriptParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(CompiscriptParser.RPAREN, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_whileStatement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitWhileStatement) {
			return visitor.visitWhileStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DoWhileStatementContext extends ParserRuleContext {
	public DO(): TerminalNode { return this.getToken(CompiscriptParser.DO, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public WHILE(): TerminalNode { return this.getToken(CompiscriptParser.WHILE, 0); }
	public LPAREN(): TerminalNode { return this.getToken(CompiscriptParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(CompiscriptParser.RPAREN, 0); }
	public SEMI(): TerminalNode { return this.getToken(CompiscriptParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_doWhileStatement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitDoWhileStatement) {
			return visitor.visitDoWhileStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForStatementContext extends ParserRuleContext {
	public FOR(): TerminalNode { return this.getToken(CompiscriptParser.FOR, 0); }
	public LPAREN(): TerminalNode { return this.getToken(CompiscriptParser.LPAREN, 0); }
	public SEMI(): TerminalNode[];
	public SEMI(i: number): TerminalNode;
	public SEMI(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.SEMI);
		} else {
			return this.getToken(CompiscriptParser.SEMI, i);
		}
	}
	public RPAREN(): TerminalNode { return this.getToken(CompiscriptParser.RPAREN, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public forInitializer(): ForInitializerContext | undefined {
		return this.tryGetRuleContext(0, ForInitializerContext);
	}
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_forStatement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitForStatement) {
			return visitor.visitForStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForInitializerContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.Identifier, 0); }
	public LET(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.LET, 0); }
	public VAR(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.VAR, 0); }
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	public initializer(): InitializerContext | undefined {
		return this.tryGetRuleContext(0, InitializerContext);
	}
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_forInitializer; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitForInitializer) {
			return visitor.visitForInitializer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForeachStatementContext extends ParserRuleContext {
	public FOREACH(): TerminalNode { return this.getToken(CompiscriptParser.FOREACH, 0); }
	public LPAREN(): TerminalNode { return this.getToken(CompiscriptParser.LPAREN, 0); }
	public Identifier(): TerminalNode { return this.getToken(CompiscriptParser.Identifier, 0); }
	public IN(): TerminalNode { return this.getToken(CompiscriptParser.IN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(CompiscriptParser.RPAREN, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_foreachStatement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitForeachStatement) {
			return visitor.visitForeachStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BreakStatementContext extends ParserRuleContext {
	public BREAK(): TerminalNode { return this.getToken(CompiscriptParser.BREAK, 0); }
	public SEMI(): TerminalNode { return this.getToken(CompiscriptParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_breakStatement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitBreakStatement) {
			return visitor.visitBreakStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ContinueStatementContext extends ParserRuleContext {
	public CONTINUE(): TerminalNode { return this.getToken(CompiscriptParser.CONTINUE, 0); }
	public SEMI(): TerminalNode { return this.getToken(CompiscriptParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_continueStatement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitContinueStatement) {
			return visitor.visitContinueStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReturnStatementContext extends ParserRuleContext {
	public RETURN(): TerminalNode { return this.getToken(CompiscriptParser.RETURN, 0); }
	public SEMI(): TerminalNode { return this.getToken(CompiscriptParser.SEMI, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_returnStatement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitReturnStatement) {
			return visitor.visitReturnStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TryCatchStatementContext extends ParserRuleContext {
	public TRY(): TerminalNode { return this.getToken(CompiscriptParser.TRY, 0); }
	public block(): BlockContext[];
	public block(i: number): BlockContext;
	public block(i?: number): BlockContext | BlockContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BlockContext);
		} else {
			return this.getRuleContext(i, BlockContext);
		}
	}
	public CATCH(): TerminalNode { return this.getToken(CompiscriptParser.CATCH, 0); }
	public LPAREN(): TerminalNode { return this.getToken(CompiscriptParser.LPAREN, 0); }
	public Identifier(): TerminalNode { return this.getToken(CompiscriptParser.Identifier, 0); }
	public RPAREN(): TerminalNode { return this.getToken(CompiscriptParser.RPAREN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_tryCatchStatement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitTryCatchStatement) {
			return visitor.visitTryCatchStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SwitchStatementContext extends ParserRuleContext {
	public SWITCH(): TerminalNode { return this.getToken(CompiscriptParser.SWITCH, 0); }
	public LPAREN(): TerminalNode { return this.getToken(CompiscriptParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(CompiscriptParser.RPAREN, 0); }
	public LBRACE(): TerminalNode { return this.getToken(CompiscriptParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(CompiscriptParser.RBRACE, 0); }
	public switchCase(): SwitchCaseContext[];
	public switchCase(i: number): SwitchCaseContext;
	public switchCase(i?: number): SwitchCaseContext | SwitchCaseContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SwitchCaseContext);
		} else {
			return this.getRuleContext(i, SwitchCaseContext);
		}
	}
	public defaultCase(): DefaultCaseContext | undefined {
		return this.tryGetRuleContext(0, DefaultCaseContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_switchStatement; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitSwitchStatement) {
			return visitor.visitSwitchStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SwitchCaseContext extends ParserRuleContext {
	public CASE(): TerminalNode { return this.getToken(CompiscriptParser.CASE, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public COLON(): TerminalNode { return this.getToken(CompiscriptParser.COLON, 0); }
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_switchCase; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitSwitchCase) {
			return visitor.visitSwitchCase(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DefaultCaseContext extends ParserRuleContext {
	public DEFAULT(): TerminalNode { return this.getToken(CompiscriptParser.DEFAULT, 0); }
	public COLON(): TerminalNode { return this.getToken(CompiscriptParser.COLON, 0); }
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_defaultCase; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitDefaultCase) {
			return visitor.visitDefaultCase(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionDeclarationContext extends ParserRuleContext {
	public FUNCTION(): TerminalNode { return this.getToken(CompiscriptParser.FUNCTION, 0); }
	public Identifier(): TerminalNode { return this.getToken(CompiscriptParser.Identifier, 0); }
	public LPAREN(): TerminalNode { return this.getToken(CompiscriptParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(CompiscriptParser.RPAREN, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public parameters(): ParametersContext | undefined {
		return this.tryGetRuleContext(0, ParametersContext);
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.COLON, 0); }
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_functionDeclaration; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitFunctionDeclaration) {
			return visitor.visitFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParametersContext extends ParserRuleContext {
	public parameter(): ParameterContext[];
	public parameter(i: number): ParameterContext;
	public parameter(i?: number): ParameterContext | ParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ParameterContext);
		} else {
			return this.getRuleContext(i, ParameterContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.COMMA);
		} else {
			return this.getToken(CompiscriptParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_parameters; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitParameters) {
			return visitor.visitParameters(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(CompiscriptParser.Identifier, 0); }
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_parameter; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitParameter) {
			return visitor.visitParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassDeclarationContext extends ParserRuleContext {
	public CLASS(): TerminalNode { return this.getToken(CompiscriptParser.CLASS, 0); }
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.Identifier);
		} else {
			return this.getToken(CompiscriptParser.Identifier, i);
		}
	}
	public LBRACE(): TerminalNode { return this.getToken(CompiscriptParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(CompiscriptParser.RBRACE, 0); }
	public COLON(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.COLON, 0); }
	public classMember(): ClassMemberContext[];
	public classMember(i: number): ClassMemberContext;
	public classMember(i?: number): ClassMemberContext | ClassMemberContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassMemberContext);
		} else {
			return this.getRuleContext(i, ClassMemberContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_classDeclaration; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitClassDeclaration) {
			return visitor.visitClassDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassMemberContext extends ParserRuleContext {
	public functionDeclaration(): FunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, FunctionDeclarationContext);
	}
	public variableDeclaration(): VariableDeclarationContext | undefined {
		return this.tryGetRuleContext(0, VariableDeclarationContext);
	}
	public constantDeclaration(): ConstantDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ConstantDeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_classMember; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitClassMember) {
			return visitor.visitClassMember(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	public assignmentExpression(): AssignmentExpressionContext {
		return this.getRuleContext(0, AssignmentExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_expression; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentExpressionContext extends ParserRuleContext {
	public leftHandSide(): LeftHandSideContext | undefined {
		return this.tryGetRuleContext(0, LeftHandSideContext);
	}
	public ASSIGN(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.ASSIGN, 0); }
	public assignmentExpression(): AssignmentExpressionContext | undefined {
		return this.tryGetRuleContext(0, AssignmentExpressionContext);
	}
	public conditionalExpression(): ConditionalExpressionContext | undefined {
		return this.tryGetRuleContext(0, ConditionalExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_assignmentExpression; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitAssignmentExpression) {
			return visitor.visitAssignmentExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConditionalExpressionContext extends ParserRuleContext {
	public logicalOrExpression(): LogicalOrExpressionContext {
		return this.getRuleContext(0, LogicalOrExpressionContext);
	}
	public QUESTION(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.QUESTION, 0); }
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.COLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_conditionalExpression; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitConditionalExpression) {
			return visitor.visitConditionalExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicalOrExpressionContext extends ParserRuleContext {
	public logicalAndExpression(): LogicalAndExpressionContext[];
	public logicalAndExpression(i: number): LogicalAndExpressionContext;
	public logicalAndExpression(i?: number): LogicalAndExpressionContext | LogicalAndExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LogicalAndExpressionContext);
		} else {
			return this.getRuleContext(i, LogicalAndExpressionContext);
		}
	}
	public OR(): TerminalNode[];
	public OR(i: number): TerminalNode;
	public OR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.OR);
		} else {
			return this.getToken(CompiscriptParser.OR, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_logicalOrExpression; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitLogicalOrExpression) {
			return visitor.visitLogicalOrExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicalAndExpressionContext extends ParserRuleContext {
	public equalityExpression(): EqualityExpressionContext[];
	public equalityExpression(i: number): EqualityExpressionContext;
	public equalityExpression(i?: number): EqualityExpressionContext | EqualityExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(EqualityExpressionContext);
		} else {
			return this.getRuleContext(i, EqualityExpressionContext);
		}
	}
	public AND(): TerminalNode[];
	public AND(i: number): TerminalNode;
	public AND(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.AND);
		} else {
			return this.getToken(CompiscriptParser.AND, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_logicalAndExpression; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitLogicalAndExpression) {
			return visitor.visitLogicalAndExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EqualityExpressionContext extends ParserRuleContext {
	public relationalExpression(): RelationalExpressionContext[];
	public relationalExpression(i: number): RelationalExpressionContext;
	public relationalExpression(i?: number): RelationalExpressionContext | RelationalExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RelationalExpressionContext);
		} else {
			return this.getRuleContext(i, RelationalExpressionContext);
		}
	}
	public EQUAL(): TerminalNode[];
	public EQUAL(i: number): TerminalNode;
	public EQUAL(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.EQUAL);
		} else {
			return this.getToken(CompiscriptParser.EQUAL, i);
		}
	}
	public NOT_EQUAL(): TerminalNode[];
	public NOT_EQUAL(i: number): TerminalNode;
	public NOT_EQUAL(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.NOT_EQUAL);
		} else {
			return this.getToken(CompiscriptParser.NOT_EQUAL, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_equalityExpression; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitEqualityExpression) {
			return visitor.visitEqualityExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RelationalExpressionContext extends ParserRuleContext {
	public additiveExpression(): AdditiveExpressionContext[];
	public additiveExpression(i: number): AdditiveExpressionContext;
	public additiveExpression(i?: number): AdditiveExpressionContext | AdditiveExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AdditiveExpressionContext);
		} else {
			return this.getRuleContext(i, AdditiveExpressionContext);
		}
	}
	public LT(): TerminalNode[];
	public LT(i: number): TerminalNode;
	public LT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.LT);
		} else {
			return this.getToken(CompiscriptParser.LT, i);
		}
	}
	public LTE(): TerminalNode[];
	public LTE(i: number): TerminalNode;
	public LTE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.LTE);
		} else {
			return this.getToken(CompiscriptParser.LTE, i);
		}
	}
	public GT(): TerminalNode[];
	public GT(i: number): TerminalNode;
	public GT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.GT);
		} else {
			return this.getToken(CompiscriptParser.GT, i);
		}
	}
	public GTE(): TerminalNode[];
	public GTE(i: number): TerminalNode;
	public GTE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.GTE);
		} else {
			return this.getToken(CompiscriptParser.GTE, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_relationalExpression; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitRelationalExpression) {
			return visitor.visitRelationalExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AdditiveExpressionContext extends ParserRuleContext {
	public multiplicativeExpression(): MultiplicativeExpressionContext[];
	public multiplicativeExpression(i: number): MultiplicativeExpressionContext;
	public multiplicativeExpression(i?: number): MultiplicativeExpressionContext | MultiplicativeExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(MultiplicativeExpressionContext);
		} else {
			return this.getRuleContext(i, MultiplicativeExpressionContext);
		}
	}
	public PLUS(): TerminalNode[];
	public PLUS(i: number): TerminalNode;
	public PLUS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.PLUS);
		} else {
			return this.getToken(CompiscriptParser.PLUS, i);
		}
	}
	public MINUS(): TerminalNode[];
	public MINUS(i: number): TerminalNode;
	public MINUS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.MINUS);
		} else {
			return this.getToken(CompiscriptParser.MINUS, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_additiveExpression; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitAdditiveExpression) {
			return visitor.visitAdditiveExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiplicativeExpressionContext extends ParserRuleContext {
	public unaryExpression(): UnaryExpressionContext[];
	public unaryExpression(i: number): UnaryExpressionContext;
	public unaryExpression(i?: number): UnaryExpressionContext | UnaryExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(UnaryExpressionContext);
		} else {
			return this.getRuleContext(i, UnaryExpressionContext);
		}
	}
	public STAR(): TerminalNode[];
	public STAR(i: number): TerminalNode;
	public STAR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.STAR);
		} else {
			return this.getToken(CompiscriptParser.STAR, i);
		}
	}
	public SLASH(): TerminalNode[];
	public SLASH(i: number): TerminalNode;
	public SLASH(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.SLASH);
		} else {
			return this.getToken(CompiscriptParser.SLASH, i);
		}
	}
	public PERCENT(): TerminalNode[];
	public PERCENT(i: number): TerminalNode;
	public PERCENT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.PERCENT);
		} else {
			return this.getToken(CompiscriptParser.PERCENT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_multiplicativeExpression; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitMultiplicativeExpression) {
			return visitor.visitMultiplicativeExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnaryExpressionContext extends ParserRuleContext {
	public unaryExpression(): UnaryExpressionContext | undefined {
		return this.tryGetRuleContext(0, UnaryExpressionContext);
	}
	public MINUS(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.MINUS, 0); }
	public NOT(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.NOT, 0); }
	public primaryExpression(): PrimaryExpressionContext | undefined {
		return this.tryGetRuleContext(0, PrimaryExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_unaryExpression; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitUnaryExpression) {
			return visitor.visitUnaryExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrimaryExpressionContext extends ParserRuleContext {
	public literalExpression(): LiteralExpressionContext | undefined {
		return this.tryGetRuleContext(0, LiteralExpressionContext);
	}
	public leftHandSide(): LeftHandSideContext | undefined {
		return this.tryGetRuleContext(0, LeftHandSideContext);
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.LPAREN, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.RPAREN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_primaryExpression; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitPrimaryExpression) {
			return visitor.visitPrimaryExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LiteralExpressionContext extends ParserRuleContext {
	public IntegerLiteral(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.IntegerLiteral, 0); }
	public FloatLiteral(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.FloatLiteral, 0); }
	public StringLiteral(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.StringLiteral, 0); }
	public TRUE(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.TRUE, 0); }
	public FALSE(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.FALSE, 0); }
	public NULL(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.NULL, 0); }
	public arrayLiteral(): ArrayLiteralContext | undefined {
		return this.tryGetRuleContext(0, ArrayLiteralContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_literalExpression; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitLiteralExpression) {
			return visitor.visitLiteralExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LeftHandSideContext extends ParserRuleContext {
	public primaryAtom(): PrimaryAtomContext {
		return this.getRuleContext(0, PrimaryAtomContext);
	}
	public suffixOperator(): SuffixOperatorContext[];
	public suffixOperator(i: number): SuffixOperatorContext;
	public suffixOperator(i?: number): SuffixOperatorContext | SuffixOperatorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SuffixOperatorContext);
		} else {
			return this.getRuleContext(i, SuffixOperatorContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_leftHandSide; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitLeftHandSide) {
			return visitor.visitLeftHandSide(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrimaryAtomContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.Identifier, 0); }
	public NEW(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.NEW, 0); }
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.RPAREN, 0); }
	public arguments(): ArgumentsContext | undefined {
		return this.tryGetRuleContext(0, ArgumentsContext);
	}
	public THIS(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.THIS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_primaryAtom; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitPrimaryAtom) {
			return visitor.visitPrimaryAtom(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SuffixOperatorContext extends ParserRuleContext {
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.RPAREN, 0); }
	public arguments(): ArgumentsContext | undefined {
		return this.tryGetRuleContext(0, ArgumentsContext);
	}
	public LBRACKET(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.LBRACKET, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public RBRACKET(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.RBRACKET, 0); }
	public DOT(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.DOT, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_suffixOperator; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitSuffixOperator) {
			return visitor.visitSuffixOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentsContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.COMMA);
		} else {
			return this.getToken(CompiscriptParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_arguments; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitArguments) {
			return visitor.visitArguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrayLiteralContext extends ParserRuleContext {
	public LBRACKET(): TerminalNode { return this.getToken(CompiscriptParser.LBRACKET, 0); }
	public RBRACKET(): TerminalNode { return this.getToken(CompiscriptParser.RBRACKET, 0); }
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.COMMA);
		} else {
			return this.getToken(CompiscriptParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_arrayLiteral; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitArrayLiteral) {
			return visitor.visitArrayLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeContext extends ParserRuleContext {
	public baseType(): BaseTypeContext {
		return this.getRuleContext(0, BaseTypeContext);
	}
	public LBRACKET(): TerminalNode[];
	public LBRACKET(i: number): TerminalNode;
	public LBRACKET(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.LBRACKET);
		} else {
			return this.getToken(CompiscriptParser.LBRACKET, i);
		}
	}
	public RBRACKET(): TerminalNode[];
	public RBRACKET(i: number): TerminalNode;
	public RBRACKET(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CompiscriptParser.RBRACKET);
		} else {
			return this.getToken(CompiscriptParser.RBRACKET, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_type; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitType) {
			return visitor.visitType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BaseTypeContext extends ParserRuleContext {
	public BOOLEAN_TYPE(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.BOOLEAN_TYPE, 0); }
	public INTEGER_TYPE(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.INTEGER_TYPE, 0); }
	public FLOAT_TYPE(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.FLOAT_TYPE, 0); }
	public STRING_TYPE(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.STRING_TYPE, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CompiscriptParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CompiscriptParser.RULE_baseType; }
	// @Override
	public accept<Result>(visitor: CompiscriptVisitor<Result>): Result {
		if (visitor.visitBaseType) {
			return visitor.visitBaseType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


