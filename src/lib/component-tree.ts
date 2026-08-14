import { promises as fs } from "fs";
import path from "path";

export type ComponentNode = {
  path: string;
  name: string;
  kind: "page" | "component" | "route";
  usedBy: string[];
};

const rootDir = path.join(process.cwd(), "src");

const walk = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
};

const readTree = async (): Promise<ComponentNode[]> => {
  const files = await walk(rootDir);
  const nodes: ComponentNode[] = [];

  for (const file of files) {
    const relative = path.relative(rootDir, file).replace(/\\/g, "/");
    const content = await fs.readFile(file, "utf-8");

    const isPage = /\/page\.(tsx|ts)$/.test(file) || /\[.*\]\/page\.tsx$/.test(file);
    const isRoute =
      /\/route\.(ts|tsx)$/.test(file) ||
      /\/layout\.(tsx)$/.test(file) ||
      /\/default\.(tsx)$/.test(file);

    const nameMatch = content.match(
      /(?:const|function)\s+([A-Z][A-Za-z0-9]*)/g
    );
    const names = nameMatch
      ? [...new Set(nameMatch.map((m) => m.split(/\s+/)[1]))]
      : [];

    nodes.push({
      path: relative,
      name: names[0] ?? path.basename(file, path.extname(file)),
      kind: isPage ? "page" : isRoute ? "route" : "component",
      usedBy: [],
    });
  }

  // Populate usage relationships.
  const nodeMap = new Map(nodes.map((n) => [n.path, n]));
  for (const node of nodes) {
    const content = await fs.readFile(path.join(rootDir, node.path), "utf-8");
    for (const other of nodes) {
      const importName = other.name;
      if (
        node.path !== other.path &&
        new RegExp(`import[^;]*${importName}`).test(content)
      ) {
        nodeMap.get(other.path)?.usedBy.push(node.path);
      }
    }
  }

  return nodes;
};

export const getComponentTree = async () => {
  try {
    return await readTree();
  } catch {
    return [];
  }
};

export const componentTreeSummary = (tree: ComponentNode[]) => {
  const pages = tree.filter((n) => n.kind === "page");
  const components = tree.filter((n) => n.kind === "component");
  const routes = tree.filter((n) => n.kind === "route");

  return [
    `${pages.length} pages: ${pages.map((p) => p.path).join(", ") || "none"}`,
    `${components.length} components: ${
      components.map((c) => c.name).join(", ") || "none"
    }`,
    `${routes.length} routes: ${routes.map((r) => r.path).join(", ") || "none"}`,
  ].join("\n");
};
