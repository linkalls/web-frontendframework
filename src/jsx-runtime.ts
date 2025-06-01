import {
  VNode,
  ElementVNode,
  TextVNode,
  FunctionVNode,
  Props, // Using the refined Props from vdom.ts
  ComponentFunction
} from './vdom';
import type { JSX } from './jsx'; // Import the global JSX namespace for type checking

// FRAGMENT_TYPE can be a string or symbol. Using a string for 'tag' in VNode.
export const FRAGMENT_TYPE = 'FRAGMENT';

function createTextVNode(value: string | number, key?: string | number): TextVNode {
  return { type: 'text', value: String(value), key };
}

// Overload signatures for h
// 1. For Intrinsic Elements (HTML tags)
export function h<K extends keyof JSX.IntrinsicElements>(
  tag: K,
  props: JSX.IntrinsicElements[K] | null, // Props specific to the HTML tag
  ...children: (VNode | string | number | null | undefined)[]
): ElementVNode;

// 2. For Functional Components
export function h<P extends {}>(
  tag: ComponentFunction<P>,
  props: P & Props | null, // Component's own props + our base VNode props (key, children, ref)
  ...children: (VNode | string | number | null | undefined)[]
): FunctionVNode<P>;

// 3. For Fragments
export function h(
  tag: typeof FRAGMENT_TYPE,
  props: Props | null,
  ...children: (VNode | string | number | null | undefined)[]
): ElementVNode; // Fragments are treated as ElementVNode with tag 'FRAGMENT'


// Implementation of h
export function h(
  tag: keyof JSX.IntrinsicElements | ComponentFunction<any> | typeof FRAGMENT_TYPE,
  props: Props | null,
  ...childrenInput: any[] // Array of children arguments
): VNode {
  let currentProps: Props = props || {};

  // Handle 'class' prop and map it to 'className'
  if (currentProps.class) {
    currentProps.className = currentProps.class;
    delete currentProps.class;
  }

  const key = currentProps.key || undefined;

  // Children processing:
  // JSX transform might pass children as third argument or in props.children.
  // Prefer props.children if it exists (common for jsxs transform), otherwise use childrenInput.
  const childrenArgs = currentProps.children !== undefined ? currentProps.children : childrenInput;
  // Children from props should be deleted so they are not passed down if the component also uses rest children
  if (currentProps.children !== undefined) {
      delete currentProps.children;
  }

  const processedChildren: VNode[] = [];
  const processChild = (child: any, index: number) => {
    // If child is passed with key (e.g. from array map), use it. Otherwise, generate one.
    // This basic index key is only for non-explicitly keyed children.
    const childKey = (child && typeof child === 'object' && child.key !== undefined) ? child.key : `_child_${index}`;

    if (child === null || typeof child === 'boolean' || typeof child === 'undefined') {
      return; // Ignore these child types
    }
    if (typeof child === 'string' || typeof child === 'number') {
      processedChildren.push(createTextVNode(child, childKey));
    } else if (Array.isArray(child)) {
      child.forEach((c, i) => processChild(c, `${index}_${i}`)); // Flatten arrays, extend key
    } else if (typeof child === 'object' && child !== null && (child.type === 'element' || child.type === 'text' || child.type === 'function')) {
      // Already a VNode, ensure it has a key or assign one
      if(child.key === undefined) child.key = childKey;
      processedChildren.push(child as VNode);
    } else if (typeof child === 'object' && child !== null && typeof child.tag !== 'undefined') {
        // This case might be trying to normalize an old VNode-like structure.
        // It's better if JSX always produces calls to h.
        const normalizedChild = h(child.tag, child.props, ...(child.children || []));
        if(normalizedChild.key === undefined) normalizedChild.key = childKey;
        processedChildren.push(normalizedChild);
    } else {
      // Fallback for unknown child types, convert to string
      console.warn('Unknown child type in h, converting to string:', child);
      processedChildren.push(createTextVNode(String(child), childKey));
    }
  };

  if (Array.isArray(childrenArgs)) {
    childrenArgs.forEach(processChild);
  } else if (childrenArgs !== null && childrenArgs !== undefined) {
    processChild(childrenArgs, 0);
  }


  if (typeof tag === 'function') {
    // Functional Component
    currentProps.children = processedChildren; // Pass children as a prop
    return {
      type: 'function',
      tag: tag,
      props: currentProps as any, // Cast needed because P is generic
      key: key,
    } as FunctionVNode<any>;
  }

  if (tag === FRAGMENT_TYPE) {
    // Fragment
    return {
      type: 'element',
      tag: FRAGMENT_TYPE,
      props: currentProps,
      children: processedChildren,
      key: key,
    } as ElementVNode;
  }

  // Intrinsic Element (HTML tag)
  return {
    type: 'element',
    tag: tag as string, // Cast because K is constrained
    props: currentProps,
    children: processedChildren,
    key: key,
  } as ElementVNode;
}

// Aliases for JSX automatic runtime in tsconfig.json
export const jsx = h;
export const jsxs = h; // jsxs could be optimized later (e.g. for static children)
export const jsxDEV = h; // Development version, can add warnings or debug info

export const Fragment = FRAGMENT_TYPE;
