// Node's built-in modules use the node: prefix and need no extra test library.
// Strict assertions throw an error when an expected condition/value is wrong.
import assert from "node:assert/strict";
// test registers a named test and the callback that runs its checks.
import test from "node:test";
// Named imports select the exported functions being tested. These tests run in
// Node, so the geometry module must work without document or other browser APIs.
import { createPageCloud, layoutPageCloud } from "./page-cloud.ts";

// This fixture (sample input reused by tests) covers Home, top-level pages, and
// nested experience pages. Array positions become the graph's node indexes.
const pages = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
  { href: "/experience", label: "Experience" },
  { href: "/experience/building-this-portfolio", label: "Experience / Building This Portfolio" },
  { href: "/experience/business-degree", label: "Experience / Business Degree" },
  { href: "/experience/engineering-studies", label: "Experience / Engineering Studies" },
  { href: "/projects", label: "Projects" },
];

// Each arrow-function callback is an independent test. If an assertion throws,
// the runner reports this test's name to help locate the broken behavior.
test("route hierarchy keeps Home at the origin and children beyond Experience", () => {
  const cloud = createPageCloud(pages);
  // deepEqual compares nested array/object contents. equal compares single
  // values with Object.is, without converting their types.
  assert.deepEqual(cloud.connections, [[0, 1], [0, 2], [2, 3], [2, 4], [2, 5], [0, 6]]);
  // ...pages[0] spreads Home's fields into a new object with expected coordinates.
  assert.deepEqual(cloud.nodes[0], { ...pages[0], x: 0, y: 0, z: 0 });
  assert.equal(cloud.nodes[4].label, "Business Degree");
  // Calling assert(condition) requires a truthy result. some() checks that at
  // least one node is in front of and one behind the origin: the graph is 3D.
  assert(cloud.nodes.some((node) => node.z > 0));
  assert(cloud.nodes.some((node) => node.z < 0));
  const parent = cloud.nodes[2];
  // slice(3, 6) copies indexes 3, 4 and 5 (the end index is excluded).
  for (const child of cloud.nodes.slice(3, 6)) {
    // hypot(x,y,z) gives distance from the origin: sqrt(x² + y² + z²).
    assert(Math.hypot(child.x, child.y, child.z) > Math.hypot(parent.x, parent.y, parent.z));
    // The optional assertion message explains the intended rule on a failure.
    assert(child.x > 0, "Experience children remain on the same side as Experience");
  }
});

test("projection stays centred and inside the viewport through full rotations", () => {
  const cloud = createPageCloud(pages);
  // Destructure each [width, height] pair; cover narrow phones through desktops.
  for (const [width, height] of [[288, 400], [375, 480], [768, 600], [1440, 600]]) {
    // These nested loops sample many yaw/pitch combinations in radians.
    // += updates the loop angle by a fixed increment after every iteration.
    for (let yaw = -Math.PI * 2; yaw <= Math.PI * 2; yaw += Math.PI / 8) {
      for (let pitch = -Math.PI; pitch <= Math.PI; pitch += Math.PI / 6) {
        const points = layoutPageCloud(cloud.nodes, cloud.extent, width, height, { yaw, pitch });
        // The Home node must remain at the exact viewport center at every angle.
        assert.equal(points[0].x, width / 2);
        assert.equal(points[0].y, height / 2);
        for (const point of points) {
          // Object.values reads every numeric field. every() requires ALL values
          // to pass Number.isFinite (rejecting NaN and either Infinity).
          assert(Object.values(point).every(Number.isFinite));
          // && means "and": both bounds must hold, preserving the 32px padding.
          assert(point.x >= 32 && point.x <= width - 32);
          assert(point.y >= 32 && point.y <= height - 32);
        }
      }
    }
  }
});

test("turning the map reveals depth without mutating the graph", () => {
  const cloud = createPageCloud(pages);
  // A deep copy preserves the starting values, including nested objects.
  // A plain assignment would point to the same array and hide mutations.
  const original = structuredClone(cloud.nodes);
  const front = layoutPageCloud(cloud.nodes, cloud.extent, 600, 600, { yaw: 0, pitch: 0 });
  const side = layoutPageCloud(cloud.nodes, cloud.extent, 600, 600, { yaw: Math.PI / 2, pitch: 0 });
  // A quarter-turn should change a child's screen position and apparent depth.
  assert.notEqual(front[4].x, side[4].x);
  assert.notEqual(front[4].z, side[4].z);
  // The graph's original coordinates must remain untouched after projection.
  assert.deepEqual(cloud.nodes, original);
});

test("empty, single-page, and zero-sized maps have finite output", () => {
  // Edge cases catch invalid division and assumptions that children always exist.
  const empty = createPageCloud([]);
  assert.deepEqual(layoutPageCloud(empty.nodes, empty.extent, 0, 0), []);
  const single = createPageCloud([pages[0]]);
  // Home alone has no edges; even a zero-sized viewport keeps its output finite.
  assert.deepEqual(single.connections, []);
  assert.deepEqual(layoutPageCloud(single.nodes, single.extent, 0, 0), [
    { x: 0, y: 0, z: 0, perspective: 1 },
  ]);
});
