// Generated from src/grammars/Compiscript.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { ProgramContext } from "./CompiscriptParser";
import { StatementContext } from "./CompiscriptParser";
import { BlockContext } from "./CompiscriptParser";
import { VariableDeclarationContext } from "./CompiscriptParser";
import { ConstantDeclarationContext } from "./CompiscriptParser";
import { TypeAnnotationContext } from "./CompiscriptParser";
import { InitializerContext } from "./CompiscriptParser";
import { ExpressionStatementContext } from "./CompiscriptParser";
import { PrintStatementContext } from "./CompiscriptParser";
import { IfStatementContext } from "./CompiscriptParser";
import { WhileStatementContext } from "./CompiscriptParser";
import { DoWhileStatementContext } from "./CompiscriptParser";
import { ForStatementContext } from "./CompiscriptParser";
import { ForInitializerContext } from "./CompiscriptParser";
import { ForeachStatementContext } from "./CompiscriptParser";
import { BreakStatementContext } from "./CompiscriptParser";
import { ContinueStatementContext } from "./CompiscriptParser";
import { ReturnStatementContext } from "./CompiscriptParser";
import { TryCatchStatementContext } from "./CompiscriptParser";
import { SwitchStatementContext } from "./CompiscriptParser";
import { SwitchCaseContext } from "./CompiscriptParser";
import { DefaultCaseContext } from "./CompiscriptParser";
import { FunctionDeclarationContext } from "./CompiscriptParser";
import { ParametersContext } from "./CompiscriptParser";
import { ParameterContext } from "./CompiscriptParser";
import { ClassDeclarationContext } from "./CompiscriptParser";
import { ClassMemberContext } from "./CompiscriptParser";
import { ExpressionContext } from "./CompiscriptParser";
import { AssignmentExpressionContext } from "./CompiscriptParser";
import { ConditionalExpressionContext } from "./CompiscriptParser";
import { LogicalOrExpressionContext } from "./CompiscriptParser";
import { LogicalAndExpressionContext } from "./CompiscriptParser";
import { EqualityExpressionContext } from "./CompiscriptParser";
import { RelationalExpressionContext } from "./CompiscriptParser";
import { AdditiveExpressionContext } from "./CompiscriptParser";
import { MultiplicativeExpressionContext } from "./CompiscriptParser";
import { UnaryExpressionContext } from "./CompiscriptParser";
import { PrimaryExpressionContext } from "./CompiscriptParser";
import { LiteralExpressionContext } from "./CompiscriptParser";
import { LeftHandSideContext } from "./CompiscriptParser";
import { PrimaryAtomContext } from "./CompiscriptParser";
import { SuffixOperatorContext } from "./CompiscriptParser";
import { ArgumentsContext } from "./CompiscriptParser";
import { ArrayLiteralContext } from "./CompiscriptParser";
import { TypeContext } from "./CompiscriptParser";
import { BaseTypeContext } from "./CompiscriptParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `CompiscriptParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface CompiscriptVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `CompiscriptParser.program`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgram?: (ctx: ProgramContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatement?: (ctx: StatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.block`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlock?: (ctx: BlockContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.variableDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableDeclaration?: (ctx: VariableDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.constantDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstantDeclaration?: (ctx: ConstantDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.typeAnnotation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeAnnotation?: (ctx: TypeAnnotationContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.initializer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInitializer?: (ctx: InitializerContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.expressionStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpressionStatement?: (ctx: ExpressionStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.printStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrintStatement?: (ctx: PrintStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.ifStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIfStatement?: (ctx: IfStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.whileStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWhileStatement?: (ctx: WhileStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.doWhileStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDoWhileStatement?: (ctx: DoWhileStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.forStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForStatement?: (ctx: ForStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.forInitializer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForInitializer?: (ctx: ForInitializerContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.foreachStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForeachStatement?: (ctx: ForeachStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.breakStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBreakStatement?: (ctx: BreakStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.continueStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitContinueStatement?: (ctx: ContinueStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.returnStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturnStatement?: (ctx: ReturnStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.tryCatchStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTryCatchStatement?: (ctx: TryCatchStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.switchStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSwitchStatement?: (ctx: SwitchStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.switchCase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSwitchCase?: (ctx: SwitchCaseContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.defaultCase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDefaultCase?: (ctx: DefaultCaseContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.functionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.parameters`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameters?: (ctx: ParametersContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.parameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameter?: (ctx: ParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.classDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassDeclaration?: (ctx: ClassDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.classMember`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassMember?: (ctx: ClassMemberContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.assignmentExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignmentExpression?: (ctx: AssignmentExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.conditionalExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConditionalExpression?: (ctx: ConditionalExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.logicalOrExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicalOrExpression?: (ctx: LogicalOrExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.logicalAndExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicalAndExpression?: (ctx: LogicalAndExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.equalityExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEqualityExpression?: (ctx: EqualityExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.relationalExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRelationalExpression?: (ctx: RelationalExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.additiveExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAdditiveExpression?: (ctx: AdditiveExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.multiplicativeExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.unaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryExpression?: (ctx: UnaryExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimaryExpression?: (ctx: PrimaryExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.literalExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLiteralExpression?: (ctx: LiteralExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.leftHandSide`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLeftHandSide?: (ctx: LeftHandSideContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.primaryAtom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimaryAtom?: (ctx: PrimaryAtomContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.suffixOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSuffixOperator?: (ctx: SuffixOperatorContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.arguments`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArguments?: (ctx: ArgumentsContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.arrayLiteral`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayLiteral?: (ctx: ArrayLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitType?: (ctx: TypeContext) => Result;

	/**
	 * Visit a parse tree produced by `CompiscriptParser.baseType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBaseType?: (ctx: BaseTypeContext) => Result;
}

