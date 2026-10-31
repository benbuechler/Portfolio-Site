// This file contains the map's data and geometry, with no browser/HTML access.
// Keeping the maths separate lets the component and Node tests use the same code.
// An interface describes an object's fields for TypeScript; it disappears in JS.
export interface Point3D {
  // Coordinates are measured relative to Home at (0, 0, 0), before pixel scaling.
  x: number;
  y: number;
  z: number;
}

// extends inherits x, y and z, then adds the information needed to make a link.
export interface PageNode extends Point3D {
  href: string;
  label: string;
}

// Angles use radians: Math.PI is a half-turn, Math.PI * 2 is a full turn.
// Yaw turns left/right around the vertical axis; pitch tips the view up/down.
export interface PageCloudRotation {
  yaw: number;
  pitch: number;
}

// A virtual camera sits this far from the origin. Normalized nodes fit within
// a unit sphere, so this distance keeps them safely in front of the camera.
const CAMERA_DISTANCE = 3.8;
// export makes this initial orientation available to the browser component.
// The annotation after : checks the object against PageCloudRotation.
export const DEFAULT_CLOUD_ROTATION: PageCloudRotation = { yaw: -0.12, pitch: 0.12 };

/** One node per page, with route branches growing outward from Home. */
// The inline object type describes each input item; [] makes it an array.
// The caller supplies Home first (site-pages.ts sorts its results that way).
export function createPageCloud(pages: { href: string; label: string }[]) {
  // map creates one NEW node object per input page. ({ href, label }) destructures
  // the current page; => ({ ... }) returns an object from the arrow function.
  const nodes: PageNode[] = pages.map(({ href, label }) => ({
    href,
    // Only show the last part of a hierarchical title on the small map label.
    // ?? falls back if at(-1) returns undefined; it preserves an empty string.
    label: label.split(" / ").at(-1) ?? label,
    // Start all nodes at the origin; the branch-placement step moves children.
    x: 0,
    y: 0,
    z: 0,
  }));

  // A Map quickly looks up a node's array index from its URL. The regexp removes
  // a trailing slash so "/experience" and "/experience/" use the same lookup key.
  const routes = new Map(nodes.map((node, index) => [node.href.replace(/\/$/, ""), index]));
  // [number, number] is a tuple: exactly two numbers, representing parent/child
  // indexes. The final [] means connections is an array of those pairs.
  const connections: [number, number][] = [];

  // forEach runs its callback once per node; index is that node's array position.
  nodes.forEach((node, index) => {
    // Home has no parent. return ends this callback, not createPageCloud itself.
    if (index === 0) return;
    // let allows reassignment while we walk back through the URL's ancestors.
    let parent = node.href.replace(/\/$/, "");
    // Fall back to Home when the page has no matching ancestor page.
    let parentIndex = 0;
    while (parent.includes("/")) {
      // slice(0, lastIndex) keeps the path before its final slash.
      // Repeating this finds the closest existing ancestor, including nested ones.
      parent = parent.slice(0, parent.lastIndexOf("/"));
      if (routes.has(parent)) {
        // ! is TypeScript's non-null assertion: the preceding .has() check tells
        // us this lookup exists. It adds no runtime check of its own.
        parentIndex = routes.get(parent)!;
        // break stops this while loop as soon as the nearest match is found.
        break;
      }
    }
    // push appends this edge to the connections array.
    connections.push([parentIndex, index]);
  });

  // One separate child-index array per node. "as number[]" tells TypeScript what
  // the initially empty array will hold; it does not convert any runtime value.
  const children = nodes.map(() => [] as number[]);
  // [parent, child] destructures each tuple to build an adjacency list:
  // children[parent] lists the nodes attached immediately below that parent.
  connections.forEach(([parent, child]) => children[parent].push(child));
  // Track the farthest branch radius for later normalization; keep a minimum of 1.
  let extent = 1;

  // A nested function can read nodes, children and extent from its outer scope.
  // depth is the distance from Home; angle and sector locate a branch in its
  // allotted wedge; tilt raises or lowers it out of the flat x/y plane.
  function placeBranch(index: number, depth: number, angle: number, sector: number, tilt: number) {
    // Radius increases with route depth; tilt gives every branch real 3D volume.
    // sin/cos convert angles into Cartesian x/y/z coordinates on a sphere.
    nodes[index].x = Math.cos(angle) * Math.cos(tilt) * depth;
    nodes[index].y = Math.sin(angle) * Math.cos(tilt) * depth;
    nodes[index].z = Math.sin(tilt) * depth;
    // Math.max keeps whichever value is larger.
    extent = Math.max(extent, depth);

    const descendants = children[index];
    // Divide this branch's available angle among its children. The minimum
    // denominator of 1 prevents division by zero for a leaf (no children).
    const step = sector / Math.max(1, descendants.length);
    descendants.forEach((child, offset) => {
      // Position siblings evenly around their parent's direction; adding 0.5
      // uses each allocated wedge's center instead of its starting edge.
      const spread = (offset + 0.5) / descendants.length - 0.5;
      // Recursion means calling the same function for the next level down.
      // A leaf ends the recursion naturally because its forEach has no items.
      placeBranch(child, depth + 1, angle + spread * sector, step, tilt + spread * 0.6);
    });
  }

  // An empty page list has no children[0]; ?? substitutes an empty array.
  const branches = children[0] ?? [];
  // Share a full circle among Home's direct children.
  const step = Math.PI * 2 / Math.max(1, branches.length);
  branches.forEach((child, index) => {
    // Keep descendants within their parent's wedge rather than circling Home again.
    // % is remainder. Even indexes tilt one way, odd indexes the other.
    // The ternary expression chooses one of the two tilt values.
    const tilt = index % 2 === 0 ? -0.25 : 0.3;
    // Begin at -PI/2; limit each branch wedge to avoid spreading it too widely.
    placeBranch(child, 1, -Math.PI / 2 + index * step, Math.min(step * 0.8, Math.PI * 0.7), tilt);
  });

  // Object shorthand packages the graph and its size into the function's result.
  return { nodes, connections, extent };
}

// Convert a rotated 3D point into a 2D camera view. The result type is inferred
// automatically from the object returned below.
export function projectPoint(point: Point3D, yaw: number, pitch: number) {
  // First rotate x/z for yaw, keeping the intermediate depth for the next step.
  const x = point.x * Math.cos(yaw) + point.z * Math.sin(yaw);
  const depth = -point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
  // Then rotate y/depth for pitch. Rotation changes direction, not distance
  // from the origin, so normalized nodes stay inside the same unit sphere.
  const y = point.y * Math.cos(pitch) - depth * Math.sin(pitch);
  const z = point.y * Math.sin(pitch) + depth * Math.cos(pitch);
  // Perspective makes nearer points (larger z) appear farther from the center.
  // At z = 0 this factor is 1, so the origin is unaffected by perspective.
  const perspective = CAMERA_DISTANCE / (CAMERA_DISTANCE - z);

  // Browser y coordinates increase downward; negating y flips the maths axis.
  // Keep z and perspective so the component can also style nodes by depth.
  return { x: x * perspective, y: -y * perspective, z, perspective };
}

// Convert graph coordinates into pixel positions inside a width/height viewport.
// A default parameter supplies the initial rotation if the caller omits it.
export function layoutPageCloud(
  nodes: PageNode[],
  extent: number,
  width: number,
  height: number,
  rotation: PageCloudRotation = DEFAULT_CLOUD_ROTATION,
) {
  // A unit sphere's largest perspective projection is d / sqrt(d² - 1).
  // Compensate once so every rotation fits within the same padded viewport.
  // Use the smaller viewport dimension to fit a circle inside the rectangle.
  // Reserve 32 pixels around its edge and never allow a negative radius.
  const radius = Math.max(0, Math.min(width, height) / 2 - 32);
  // ** means exponentiation; sqrt is square root. This shrinks the available
  // radius by the inverse of the maximum perspective enlargement above.
  const scale = radius * Math.sqrt(CAMERA_DISTANCE ** 2 - 1) / CAMERA_DISTANCE;
  // Divide by the largest branch radius to fit the graph in a unit sphere.
  // The minimum of 1 also keeps an empty or single-page graph well-defined.
  const divisor = Math.max(1, extent);

  // Return NEW position objects instead of overwriting the original nodes.
  // Repeated rotations therefore always start from the same graph geometry.
  return nodes.map((node) => {
    const projected = projectPoint({
      x: node.x / divisor,
      y: node.y / divisor,
      z: node.z / divisor,
    }, rotation.yaw, rotation.pitch);
    return {
      // Translate from an origin-centered view to the viewport's pixel center.
      x: width / 2 + projected.x * scale,
      y: height / 2 + projected.y * scale,
      z: projected.z,
      perspective: projected.perspective,
    };
  });
}
