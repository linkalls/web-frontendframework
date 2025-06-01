import { VNode, patch } from './vdom';
import { h, jsx, jsxs, Fragment, FRAGMENT_TYPE } from './jsx-runtime'; // Import FRAGMENT_TYPE for direct use if needed
import { useState } from './hooks';
import type { JSX } from './jsx'; // For using JSX namespace types if needed explicitly

// Store the last rendered root VNode for potential re-renders from the root
let lastRootVNode: VNode | null = null;
let rootParentDomElement: HTMLElement | null = null;

/**
 * Renders a VNode into a parent DOM element.
 * @param vnodeToRender The root VNode (JSX.Element) to render. Can be null to unmount.
 * @param targetParentDomElement The HTML DOM element to mount the VNode into.
 */
export function render(
  vnodeToRender: JSX.Element | null, // Use JSX.Element for public API clarity
  targetParentDomElement: HTMLElement
): void {
  if (!targetParentDomElement) {
    throw new Error("Render target parent DOM element not found.");
  }

  // Clear content only if we are mounting a new root or changing target
  if (vnodeToRender !== null && (lastRootVNode === null || rootParentDomElement !== targetParentDomElement)) {
    targetParentDomElement.innerHTML = '';
  }

  patch(lastRootVNode, vnodeToRender, targetParentDomElement);

  lastRootVNode = vnodeToRender;
  rootParentDomElement = targetParentDomElement;
}

// Re-export core API elements
// The types for h, jsx, jsxs, Fragment, useState are inferred from their definitions.
export { h, jsx, jsxs, Fragment, useState, FRAGMENT_TYPE };

// Optional: A type for functional components for users of the framework
export type FunctionalComponent<P = {}> = (props: P & JSX.ElementChildrenAttribute & { key?: string | number }) => JSX.Element | null;

/* Example usage:
  const App: FunctionalComponent<{ message: string }> = (props) => {
    return <h1>{props.message} {props.children}</h1>;
  };
*/

// Potentially, a function to unmount the root could be added here:
export function unmountRoot(targetParentDomElement: HTMLElement): void {
  if (rootParentDomElement === targetParentDomElement && lastRootVNode !== null) {
    patch(lastRootVNode, null, targetParentDomElement);
    lastRootVNode = null;
    // rootParentDomElement = null; // Keep rootParentDomElement to know it was mounted here
    targetParentDomElement.innerHTML = ''; // Explicitly clear after unpatching
  }
}
