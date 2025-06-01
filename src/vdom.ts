import {
  getComponentInstance,
  setCurrentRenderingComponent,
  FunctionComponentInstance,
  removeComponentInstance
} from './hooks';
import type { HTMLAttributes, ComponentProps as BaseComponentProps, Children } from './jsx'; // Import from jsx.d.ts

// Define a more specific Props type for internal VNode usage
// It combines HTMLAttributes (for DOM elements) and BaseComponentProps (for key, children, ref)
// and allows any other string-keyed properties for custom data-* attributes or other needs.
export type Props = HTMLAttributes & BaseComponentProps & {
  [key: string]: any; // Allow other props
  children?: Children; // Ensure children from jsx.d.ts is used
};

export type TextVNode = {
  type: 'text';
  value: string;
  dom?: Text;
  key?: string | number; // Text nodes can also have keys in some frameworks
};

export type ElementVNode = {
  type: 'element';
  tag: string; // For HTML elements or 'FRAGMENT'
  props: Props; // Use the refined Props type
  children: VNode[];
  key?: string | number;
  dom?: HTMLElement | Text; // Text for FRAGMENT's placeholder
};

export type ComponentFunction<P = {}> = (props: P & BaseComponentProps) => VNode;

export type FunctionVNode<P = {}> = {
  type: 'function';
  tag: ComponentFunction<P>; // The component function itself
  props: P & BaseComponentProps; // Props for the component
  key?: string | number;
  componentInstance?: FunctionComponentInstance;
  renderedVNode?: VNode; // The VNode tree this component function returned
  dom?: HTMLElement | Text; // The root DOM node of the renderedVNode
};

export type VNode = ElementVNode | TextVNode | FunctionVNode<any>;


function updateDomProperties(
  dom: HTMLElement,
  oldProps: Props,
  newProps: Props
) {
  // Remove old properties that are not in newProps
  for (const key in oldProps) {
    if (key === 'children' || key === 'key' || (key === 'ref' && typeof oldProps[key] === 'function')) continue;
    if (!(key in newProps)) {
      if (key.startsWith('on') && typeof oldProps[key] === 'function') {
        dom.removeEventListener(key.substring(2).toLowerCase(), oldProps[key] as EventListener);
      } else if (key === 'className' || key === 'class') { // handle 'class' as well
        dom.className = '';
      } else if (key === 'style' && typeof oldProps[key] === 'object') {
        for (const styleKey in (oldProps[key] as CSSStyleDeclaration)) {
          (dom.style as any)[styleKey] = '';
        }
      } else {
        dom.removeAttribute(key);
      }
    }
  }

  // Add/update new properties
  for (const key in newProps) {
    if (key === 'children' || key === 'key' || (key === 'ref' && typeof newProps[key] === 'function')) continue;

    const oldValue = oldProps[key];
    const newValue = newProps[key];

    if (oldValue === newValue) continue;

    if (key.startsWith('on') && typeof newValue === 'function') {
      const eventName = key.substring(2).toLowerCase();
      if (typeof oldValue === 'function') {
        dom.removeEventListener(eventName, oldValue as EventListener);
      }
      dom.addEventListener(eventName, newValue as EventListener);
    } else if (key === 'className' || key === 'class') {
      dom.className = newValue as string;
    } else if (key === 'style' && typeof newValue === 'object') {
      if (typeof oldValue === 'object') {
        for (const styleKey in (oldValue as CSSStyleDeclaration)) {
          if (!(newValue as any)[styleKey]) {
            (dom.style as any)[styleKey] = '';
          }
        }
      }
      for (const styleKey in (newValue as CSSStyleDeclaration)) {
        (dom.style as any)[styleKey] = (newValue as any)[styleKey];
      }
    } else if (key === 'value' && dom.nodeName === 'INPUT') { // Special handling for input value
        (dom as HTMLInputElement).value = newValue as string;
    } else if (key === 'checked' && dom.nodeName === 'INPUT') { // Special handling for input checked
        (dom as HTMLInputElement).checked = newValue as boolean;
    } else {
      if (newValue === null || newValue === undefined || newValue === false) {
        dom.removeAttribute(key);
      } else {
        dom.setAttribute(key, String(newValue));
      }
    }
  }
  // Handle ref: Call the new ref function if it exists, or old one with null if it changed/removed
  if (typeof oldProps.ref === 'function' && oldProps.ref !== newProps.ref) {
    oldProps.ref(null);
  }
  if (typeof newProps.ref === 'function') {
    newProps.ref(dom);
  }
}


export function patch(
  oldVNode: VNode | null,
  newVNode: VNode | null,
  parentDomElement: HTMLElement | Text | null
): HTMLElement | Text | undefined {

  // 1. Handle removal
  if (newVNode === null) {
    if (oldVNode) {
      if (typeof oldVNode.props?.ref === 'function') oldVNode.props.ref(null); // Call ref with null on removal

      if (oldVNode.type === 'function' && oldVNode.componentInstance) {
        patch(oldVNode.renderedVNode || null, null, null);
        removeComponentInstance(oldVNode.componentInstance);
      }
      if (oldVNode.dom && oldVNode.dom.parentNode) {
        oldVNode.dom.parentNode.removeChild(oldVNode.dom);
      }
    }
    return undefined;
  }

  // At this point, newVNode is not null.

  // 2. Handle initial render (oldVNode is null)
  if (oldVNode === null) {
    if (newVNode.type === 'text') {
      newVNode.dom = document.createTextNode(newVNode.value);
    } else if (newVNode.type === 'element') {
      if (newVNode.tag === 'FRAGMENT') {
        newVNode.dom = document.createTextNode(''); // Placeholder for fragment
      } else {
        newVNode.dom = document.createElement(newVNode.tag);
        updateDomProperties(newVNode.dom as HTMLElement, {} as Props, newVNode.props);
      }
      if (newVNode.tag !== 'FRAGMENT') {
        newVNode.children.forEach(child => patch(null, child, newVNode.dom as HTMLElement));
      } else {
         newVNode.children.forEach(child => patch(null, child, parentDomElement)); // Fragment children to actual parent
      }
    } else if (newVNode.type === 'function') {
      // Type assertion for newVNode as FunctionVNode is needed if not narrowed enough
      const funcVNode = newVNode as FunctionVNode<any>;
      const instance = getComponentInstance(funcVNode.tag, funcVNode.props, parentDomElement!, funcVNode);
      funcVNode.componentInstance = instance;
      instance.props = funcVNode.props;
      instance.parentDom = parentDomElement!;
      instance.oldVNodeRepresentation = funcVNode;

      setCurrentRenderingComponent(instance);
      const rendered = funcVNode.tag(funcVNode.props);
      setCurrentRenderingComponent(null);

      funcVNode.renderedVNode = rendered;
      instance.renderedVNode = rendered;

      const dom = patch(null, rendered, parentDomElement);
      funcVNode.dom = dom;
      if (typeof funcVNode.props.ref === 'function') funcVNode.props.ref(instance); // Call ref with component instance
    }

    if (newVNode.dom && newVNode.tag !== 'FRAGMENT' && parentDomElement) {
       parentDomElement.appendChild(newVNode.dom);
    }
    // If it's a fragment and has a placeholder, and needs explicit append (usually not)
    // else if (newVNode.tag === 'FRAGMENT' && parentDomElement && newVNode.dom && !parentDomElement.contains(newVNode.dom)) {
    //    parentDomElement.appendChild(newVNode.dom);
    // }
    if (newVNode.type !== 'function' && typeof newVNode.props?.ref === 'function') newVNode.props.ref(newVNode.dom);


    return newVNode.dom;
  }

  // At this point, both oldVNode and newVNode exist and are not null.
  let domElement = oldVNode.dom;

  // 3. Handle different types or tags (replacement)
  if (oldVNode.type !== newVNode.type ||
      (oldVNode.type === 'element' && newVNode.type === 'element' && oldVNode.tag !== newVNode.tag) ||
      (oldVNode.type === 'function' && newVNode.type === 'function' && oldVNode.tag !== newVNode.tag)) {
    patch(oldVNode, null, null); // Remove old node
    const newDom = patch(null, newVNode, parentDomElement); // Mount new node
    return newDom;
  }

  // 4. Handle same type updates
  newVNode.dom = domElement; // Carry over DOM reference

  if (newVNode.type === 'text' && oldVNode.type === 'text') {
    if (oldVNode.value !== newVNode.value) {
      domElement!.nodeValue = newVNode.value;
    }
  } else if (newVNode.type === 'element' && oldVNode.type === 'element' && newVNode.tag !== 'FRAGMENT') {
    const currentDom = domElement as HTMLElement;
    updateDomProperties(currentDom, oldVNode.props, newVNode.props);

    const oldChildren = oldVNode.children;
    const newChildren = newVNode.children; // These are VNodes from h()
    const commonLength = Math.min(oldChildren.length, newChildren.length);

    for (let i = 0; i < commonLength; i++) {
      patch(oldChildren[i], newChildren[i], currentDom);
    }
    if (newChildren.length > oldChildren.length) {
      for (let i = commonLength; i < newChildren.length; i++) {
        patch(null, newChildren[i], currentDom);
      }
    } else if (oldChildren.length > newChildren.length) {
      for (let i = commonLength; i < oldChildren.length; i++) {
        patch(oldChildren[i], null, currentDom);
      }
    }
  } else if (newVNode.type === 'element' && oldVNode.type === 'element' && newVNode.tag === 'FRAGMENT') {
    const oldChildren = oldVNode.children;
    const newChildren = newVNode.children;
    const commonLength = Math.min(oldChildren.length, newChildren.length);
    for (let i = 0; i < commonLength; i++) {
        patch(oldChildren[i], newChildren[i], parentDomElement); // Children of fragment go to actual parent
    }
    if (newChildren.length > oldChildren.length) {
        for (let i = commonLength; i < newChildren.length; i++) {
            patch(null, newChildren[i], parentDomElement);
        }
    } else if (oldChildren.length > newChildren.length) {
        for (let i = commonLength; i < oldChildren.length; i++) {
            patch(oldChildren[i], null, parentDomElement);
        }
    }
  } else if (newVNode.type === 'function' && oldVNode.type === 'function' && oldVNode.tag === newVNode.tag) {
    const funcVNode = newVNode as FunctionVNode<any>;
    const oldFuncVNode = oldVNode as FunctionVNode<any>;

    funcVNode.componentInstance = oldFuncVNode.componentInstance;
    funcVNode.componentInstance!.props = funcVNode.props;
    funcVNode.componentInstance!.parentDom = parentDomElement!;
    funcVNode.componentInstance!.oldVNodeRepresentation = funcVNode;

    // Handle ref update for component
    if (oldFuncVNode.props.ref !== funcVNode.props.ref) {
        if (typeof oldFuncVNode.props.ref === 'function') oldFuncVNode.props.ref(null);
        if (typeof funcVNode.props.ref === 'function') funcVNode.props.ref(funcVNode.componentInstance);
    }


    setCurrentRenderingComponent(funcVNode.componentInstance!);
    const newRenderedTree = funcVNode.tag(funcVNode.props);
    setCurrentRenderingComponent(null);

    const newDom = patch(oldFuncVNode.renderedVNode || null, newRenderedTree, parentDomElement);
    funcVNode.renderedVNode = newRenderedTree;
    funcVNode.dom = newDom;
    funcVNode.componentInstance!.renderedVNode = newRenderedTree;
  }

  return newVNode.dom;
}
