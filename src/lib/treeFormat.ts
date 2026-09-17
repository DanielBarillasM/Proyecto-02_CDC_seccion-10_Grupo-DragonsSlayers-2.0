import { ParserRuleContext } from "antlr4ts";
import type { ParseTree } from "antlr4ts/tree/ParseTree";
import type { TreeNode } from "./types";

/** Serializa los nodos visuales como texto indentado. */
export function stringifyTreeNodes(nodes: TreeNode[]): string {
  const lines: string[] = [];

  function visit(node: TreeNode, depth: number): void {
    lines.push(`${"  ".repeat(depth)}${node.label}`);
    node.children.forEach((child) => visit(child, depth + 1));
  }

  nodes.forEach((node) => visit(node, 0));
  return lines.join("\n");
}

/**
 * Convierte directamente el ParseTree de ANTLR a nodos visuales.
 * Esta ruta evita ambigüedades del formato Lisp cuando un token literal es "(" o ")".
 */
export function parseAntlrTreeToNodes(tree: ParseTree, ruleNames: string[]): TreeNode[] {
  function visit(node: ParseTree): TreeNode {
    const label = node instanceof ParserRuleContext
      ? (ruleNames[node.ruleIndex] ?? `rule_${node.ruleIndex}`)
      : (node.text || "ε");

    const children: TreeNode[] = [];
    for (let index = 0; index < node.childCount; index += 1) {
      children.push(visit(node.getChild(index)));
    }

    return { label, children };
  }

  return [visit(tree)];
}
