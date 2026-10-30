export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface PageNode extends Point3D {
  href: string;
  label: string;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Exactly one node per page, spread through a shallow, expanding 3D spiral. */
export function createPageCloud(pages: { href: string; label: string }[]) {
  const nodes: PageNode[] = pages.map(({ href, label }, index) => {
    const angle = index * GOLDEN_ANGLE + Math.PI / 2;
    const radius = 0.65 + Math.sqrt(index) * 0.22;
    return {
      href,
      label,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.8,
      z: Math.sin(angle * 1.3) * 0.28,
    };
  });

  // Keep new pages in view as the network expands.
  const extent = Math.max(1.1, 0.65 + Math.sqrt(Math.max(0, pages.length - 1)) * 0.22);
  const routes = new Map(nodes.map((node, index) => [node.href.replace(/\/$/, ""), index]));
  const connections: [number, number][] = [];

  nodes.forEach((node, index) => {
    if (index === 0) return;
    let parent = node.href.replace(/\/$/, "");
    let parentIndex = 0;
    while (parent.includes("/")) {
      parent = parent.slice(0, parent.lastIndexOf("/"));
      if (routes.has(parent)) {
        parentIndex = routes.get(parent)!;
        break;
      }
    }
    connections.push([parentIndex, index]);
  });

  return { nodes, connections, extent };
}

export function projectPoint(point: Point3D, yaw: number, pitch: number) {
  const x = point.x * Math.cos(yaw) + point.z * Math.sin(yaw);
  const depth = -point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
  const y = point.y * Math.cos(pitch) - depth * Math.sin(pitch);
  const z = point.y * Math.sin(pitch) + depth * Math.cos(pitch);
  const perspective = 3.8 / (3.8 - z);

  return { x: x * perspective, y: -y * perspective, z, perspective };
}

export function layoutPageCloud(nodes: PageNode[], extent: number, width: number, height: number, elapsed = 0) {
  const yaw = -0.12 + Math.sin(elapsed * 0.1) * 0.28;
  const pitch = 0.12 + Math.sin(elapsed * 0.08) * 0.1;

  return nodes.map((node, index) => {
    const drift = Math.sin(elapsed * 0.3 + index * 1.8) - Math.sin(index * 1.8);
    const projected = projectPoint({
      x: node.x / extent,
      y: (node.y + drift * 0.035) / extent,
      z: node.z / extent,
    }, yaw, pitch);
    return {
      x: width * 0.55 + projected.x * width * 0.37,
      y: height / 2 + projected.y * height * 0.42,
    };
  });
}
