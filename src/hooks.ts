import { VNode, patch, FunctionVNode, ComponentFunction, Props as VNodeProps } from './vdom';

// --- Globals for Hook System ---
let currentlyRenderingComponent: FunctionComponentInstance<any> | null = null;
let hookIndex = 0;

// P represents the component's own props (excluding children, key, ref which are in VNodeProps)
export interface FunctionComponentInstance<P = {}> {
  id: string;
  componentFunction: ComponentFunction<P>;
  props: P & VNodeProps; // Combined props
  hooks: any[];
  renderedVNode?: VNode;
  parentDom?: HTMLElement | Text;
  oldVNodeRepresentation?: FunctionVNode<P>; // Typed with component's props
}

let componentInstanceCounter = 0;
const componentInstanceMap = new Map<string, FunctionComponentInstance<any>>();

export function getComponentInstance<P = {}>(
  componentFunction: ComponentFunction<P>,
  props: P & VNodeProps,
  parentDom: HTMLElement | Text,
  vNodeRepresentation: FunctionVNode<P>
): FunctionComponentInstance<P> {
  const key = props.key || componentFunction.name;
  // This ID generation needs to be more robust for stable instance identity
  const instanceId = parentDom ? `${parentDom.nodeName}_${key}_${componentInstanceCounter}` : `${key}_${componentInstanceCounter++}`;

  if (vNodeRepresentation.componentInstance) {
    const instance = vNodeRepresentation.componentInstance as FunctionComponentInstance<P>;
    instance.props = props;
    instance.parentDom = parentDom;
    instance.oldVNodeRepresentation = vNodeRepresentation;
    return instance;
  }

  let instance = componentInstanceMap.get(instanceId) as FunctionComponentInstance<P> | undefined;
  if (!instance) {
    instance = {
      id: instanceId,
      componentFunction,
      props,
      hooks: [],
      parentDom,
      oldVNodeRepresentation: vNodeRepresentation,
    };
    componentInstanceMap.set(instanceId, instance);
    vNodeRepresentation.componentInstance = instance;
  } else {
    instance.props = props;
    instance.parentDom = parentDom;
    instance.oldVNodeRepresentation = vNodeRepresentation;
    vNodeRepresentation.componentInstance = instance;
  }
  return instance;
}

export function removeComponentInstance(instance: FunctionComponentInstance<any> | undefined) {
  if (instance) {
    componentInstanceMap.delete(instance.id);
    console.log(`Removed component instance ${instance.id}`);
  }
}

export function setCurrentRenderingComponent(instance: FunctionComponentInstance<any> | null) {
  currentlyRenderingComponent = instance;
  hookIndex = 0;
}

export function useState<S>(
  initialState: S | (() => S)
): [S, (newState: S | ((prevState: S) => S)) => void] {
  if (!currentlyRenderingComponent) {
    throw new Error("useState can only be called outside a functional component.");
  }

  const currentInstance = currentlyRenderingComponent;
  const currentIndex = hookIndex;
  hookIndex++;

  if (currentInstance.hooks.length <= currentIndex) {
    // If initialState is a function, call it to get the actual initial state
    currentInstance.hooks[currentIndex] = typeof initialState === 'function'
        ? (initialState as () => S)()
        : initialState;
  }

  const setState = (newStateOrFn: S | ((prevState: S) => S)) => {
    const oldState = currentInstance.hooks[currentIndex] as S;
    const newState = typeof newStateOrFn === 'function'
      ? (newStateOrFn as (prevState: S) => S)(oldState)
      : newStateOrFn;

    if (oldState !== newState) {
      currentInstance.hooks[currentIndex] = newState;

      if (currentInstance.oldVNodeRepresentation && currentInstance.parentDom) {
        console.log(`Re-rendering component ${currentInstance.id} due to setState. Old state: ${oldState}, New state: ${newState}`);

        const currentComponentVNode = currentInstance.oldVNodeRepresentation;
        // Create a new VNode object for the re-render to ensure diffing occurs correctly.
        // Props are taken from the instance, as they might have been updated by a parent re-render
        // even if this setState is the trigger.
        const newComponentVNodeForRender: FunctionVNode<any> = {
            type: 'function',
            tag: currentComponentVNode.tag, // The component function
            props: currentInstance.props,   // Current props from the instance
            key: currentComponentVNode.key,
            // componentInstance and renderedVNode will be (re-)assigned by patch
        };
        patch(currentComponentVNode, newComponentVNodeForRender, currentInstance.parentDom);
      } else {
        console.error("Cannot re-render: missing oldVNodeRepresentation or parentDom on component instance.", currentInstance);
      }
    }
  };

  return [currentInstance.hooks[currentIndex] as S, setState];
}
