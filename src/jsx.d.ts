import { VNode, Props as VNodeProps } from './vdom'; // Assuming VNodeProps will be defined in vdom.ts
import { FunctionComponentInstance } from './hooks'; // For component props

// Define a base Props type for HTML elements
// Loosely based on React's HTMLAttributes and CSSProperties
type DOMEvents = {
  // Clipboard Events
  onCopy?: (event: ClipboardEvent) => void;
  onCut?: (event: ClipboardEvent) => void;
  onPaste?: (event: ClipboardEvent) => void;

  // Composition Events
  onCompositionEnd?: (event: CompositionEvent) => void;
  onCompositionStart?: (event: CompositionEvent) => void;
  onCompositionUpdate?: (event: CompositionEvent) => void;

  // Focus Events
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;

  // Form Events
  onChange?: (event: Event) => void; // More specific types can be used per element (e.g. InputChangeEvent)
  onInput?: (event: Event) => void;
  onReset?: (event: Event) => void;
  onSubmit?: (event: Event) => void;
  onInvalid?: (event: Event) => void;

  // Image Events
  onLoad?: (event: Event) => void;
  onError?: (event: Event) => void; // also a media event

  // Keyboard Events
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyPress?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;

  // Media Events
  onAbort?: (event: Event) => void;
  onCanPlay?: (event: Event) => void;
  onCanPlayThrough?: (event: Event) => void;
  onDurationChange?: (event: Event) => void;
  onEmptied?: (event: Event) => void;
  onEncrypted?: (event: Event) => void;
  onEnded?: (event: Event) => void;
  onLoadedData?: (event: Event) => void;
  onLoadedMetadata?: (event: Event) => void;
  onLoadStart?: (event: Event) => void;
  onPause?: (event: Event) => void;
  onPlay?: (event: Event) => void;
  onPlaying?: (event: Event) => void;
  onProgress?: (event: Event) => void;
  onRateChange?: (event: Event) => void;
  onSeeked?: (event: Event) => void;
  onSeeking?: (event: Event) => void;
  onStalled?: (event: Event) => void;
  onSuspend?: (event: Event) => void;
  onTimeUpdate?: (event: Event) => void;
  onVolumeChange?: (event: Event) => void;
  onWaiting?: (event: Event) => void;

  // MouseEvents
  onClick?: (event: MouseEvent) => void;
  onContextMenu?: (event: MouseEvent) => void;
  onDoubleClick?: (event: MouseEvent) => void;
  onDrag?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
  onDragEnter?: (event: DragEvent) => void;
  onDragExit?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragStart?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseOut?: (event: MouseEvent) => void;
  onMouseOver?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;

  // Touch Events
  onTouchCancel?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;

  // UI Events
  onScroll?: (event: UIEvent) => void;

  // Wheel Events
  onWheel?: (event: WheelEvent) => void;
};

type CSSProperties = Partial<CSSStyleDeclaration>;

export type HTMLAttributes<T extends EventTarget = HTMLElement> = DOMEvents & {
  // Standard HTML Attributes
  accept?: string;
  acceptCharset?: string;
  accessKey?: string;
  action?: string;
  allowFullScreen?: boolean;
  allowTransparency?: boolean;
  alt?: string;
  as?: string;
  async?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  autoPlay?: boolean;
  capture?: boolean | string;
  cellPadding?: number | string;
  cellSpacing?: number | string;
  charSet?: string;
  challenge?: string;
  checked?: boolean;
  cite?: string;
  class?: string; // Use 'class' for JSX, will be mapped to 'className' by h() or props handling
  className?: string; // Allow 'className' as well
  cols?: number;
  colSpan?: number;
  content?: string;
  contentEditable?: boolean | "inherit";
  contextMenu?: string;
  controls?: boolean;
  coords?: string;
  crossOrigin?: string;
  data?: string;
  dateTime?: string;
  default?: boolean;
  defer?: boolean;
  dir?: 'auto' | 'rtl' | 'ltr';
  disabled?: boolean;
  download?: any;
  draggable?: boolean | "true" | "false";
  encType?: string;
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  frameBorder?: number | string;
  headers?: string;
  height?: number | string;
  hidden?: boolean;
  high?: number;
  href?: string;
  hrefLang?: string;
  htmlFor?: string;
  httpEquiv?: string;
  id?: string;
  inputMode?: string;
  integrity?: string;
  is?: string;
  key?: string | number; // Our VNode key
  keyParams?: string;
  keyType?: string;
  kind?: string;
  label?: string;
  lang?: string;
  list?: string;
  loop?: boolean;
  low?: number;
  manifest?: string;
  marginHeight?: number;
  marginWidth?: number;
  max?: number | string;
  maxLength?: number;
  media?: string;
  mediaGroup?: string;
  method?: string;
  min?: number | string;
  minLength?: number;
  multiple?: boolean;
  muted?: boolean;
  name?: string;
  nonce?: string;
  noValidate?: boolean;
  open?: boolean;
  optimum?: number;
  pattern?: string;
  placeholder?: string;
  playsInline?: boolean;
  poster?: string;
  preload?: string;
  radioGroup?: string;
  readOnly?: boolean;
  rel?: string;
  required?: boolean;
  reversed?: boolean;
  role?: string;
  rows?: number;
  rowSpan?: number;
  sandbox?: string;
  scope?: string;
  scoped?: boolean;
  scrolling?: string;
  seamless?: boolean;
  selected?: boolean;
  shape?: string;
  size?: number;
  sizes?: string;
  slot?: string;
  span?: number;
  spellCheck?: boolean | "true" | "false";
  src?: string;
  srcDoc?: string;
  srcLang?: string;
  srcSet?: string;
  start?: number;
  step?: number | string;
  style?: CSSProperties | string; // Allow string for direct CSS text
  summary?: string;
  tabIndex?: number;
  target?: string;
  title?: string;
  type?: string;
  useMap?: string;
  value?: string | string[] | number;
  width?: number | string;
  wmode?: string;
  wrap?: string;

  // RDFa Attributes
  about?: string;
  datatype?: string;
  inlist?: any;
  prefix?: string;
  property?: string;
  resource?: string;
  typeof?: string;
  vocab?: string;

  // Non-standard Attributes
  autoCapitalize?: string;
  autoCorrect?: string;
  autoSave?: string;
  color?: string;
  itemProp?: string;
  itemScope?: boolean;
  itemType?: string;
  itemID?: string;
  itemRef?: string;
  results?: number;
  security?: string;
  unselectable?: 'on' | 'off';
};

// Type for children
type Children = VNode | string | number | null | undefined | Array<VNode | string | number | null | undefined>;

// Props for our components should include children, and optionally key
export interface ComponentProps {
  children?: Children;
  key?: string | number;
  ref?: (element: HTMLElement | Text | FunctionComponentInstance | undefined) => void; // Basic ref support
}

// This is the core of JSX typing
declare global {
  namespace JSX {
    // JSX expressions resolve to this type
    type Element = VNode;

    // Specifies the children prop name
    interface ElementChildrenAttribute {
      children: {}; // children prop is named 'children'
    }

    // Props for components that are functions
    // P are the component's own props. Our ComponentProps adds 'children' and 'key'.
    // type Component<P = {}> = (props: P & ComponentProps) => Element | null;


    // Intrinsic elements (HTML tags)
    // Tries to map HTML tag names to their specific element type and props
    interface IntrinsicElements {
      // HTML
      a: HTMLAttributes<HTMLAnchorElement> & { children?: Children };
      abbr: HTMLAttributes<HTMLElement> & { children?: Children };
      address: HTMLAttributes<HTMLElement> & { children?: Children };
      area: HTMLAttributes<HTMLAreaElement> & { children?: Children };
      article: HTMLAttributes<HTMLElement> & { children?: Children };
      aside: HTMLAttributes<HTMLElement> & { children?: Children };
      audio: HTMLAttributes<HTMLAudioElement> & { children?: Children };
      b: HTMLAttributes<HTMLElement> & { children?: Children };
      base: HTMLAttributes<HTMLBaseElement> & { children?: Children };
      bdi: HTMLAttributes<HTMLElement> & { children?: Children };
      bdo: HTMLAttributes<HTMLElement> & { children?: Children };
      big: HTMLAttributes<HTMLElement> & { children?: Children };
      blockquote: HTMLAttributes<HTMLQuoteElement> & { children?: Children }; // Corrected
      body: HTMLAttributes<HTMLBodyElement> & { children?: Children };
      br: HTMLAttributes<HTMLBRElement> & { children?: Children };
      button: HTMLAttributes<HTMLButtonElement> & { children?: Children };
      canvas: HTMLAttributes<HTMLCanvasElement> & { children?: Children };
      caption: HTMLAttributes<HTMLTableCaptionElement> & { children?: Children }; // Corrected
      cite: HTMLAttributes<HTMLElement> & { children?: Children };
      code: HTMLAttributes<HTMLElement> & { children?: Children };
      col: HTMLAttributes<HTMLTableColElement> & { children?: Children }; // Corrected
      colgroup: HTMLAttributes<HTMLTableColElement> & { children?: Children }; // Corrected
      data: HTMLAttributes<HTMLDataElement> & { children?: Children }; // Corrected
      datalist: HTMLAttributes<HTMLDataListElement> & { children?: Children };
      dd: HTMLAttributes<HTMLElement> & { children?: Children };
      del: HTMLAttributes<HTMLModElement> & { children?: Children }; // Corrected (for <del>)
      details: HTMLAttributes<HTMLDetailsElement> & { children?: Children }; // Corrected
      dfn: HTMLAttributes<HTMLElement> & { children?: Children };
      dialog: HTMLAttributes<HTMLDialogElement> & { children?: Children };
      div: HTMLAttributes<HTMLDivElement> & { children?: Children };
      dl: HTMLAttributes<HTMLDListElement> & { children?: Children };
      dt: HTMLAttributes<HTMLElement> & { children?: Children };
      em: HTMLAttributes<HTMLElement> & { children?: Children };
      embed: HTMLAttributes<HTMLEmbedElement> & { children?: Children };
      fieldset: HTMLAttributes<HTMLFieldSetElement> & { children?: Children };
      figcaption: HTMLAttributes<HTMLElement> & { children?: Children };
      figure: HTMLAttributes<HTMLElement> & { children?: Children };
      footer: HTMLAttributes<HTMLElement> & { children?: Children };
      form: HTMLAttributes<HTMLFormElement> & { children?: Children };
      h1: HTMLAttributes<HTMLHeadingElement> & { children?: Children };
      h2: HTMLAttributes<HTMLHeadingElement> & { children?: Children };
      h3: HTMLAttributes<HTMLHeadingElement> & { children?: Children };
      h4: HTMLAttributes<HTMLHeadingElement> & { children?: Children };
      h5: HTMLAttributes<HTMLHeadingElement> & { children?: Children };
      h6: HTMLAttributes<HTMLHeadingElement> & { children?: Children };
      head: HTMLAttributes<HTMLHeadElement> & { children?: Children };
      header: HTMLAttributes<HTMLElement> & { children?: Children };
      hgroup: HTMLAttributes<HTMLElement> & { children?: Children };
      hr: HTMLAttributes<HTMLHRElement> & { children?: Children };
      html: HTMLAttributes<HTMLHtmlElement> & { children?: Children };
      i: HTMLAttributes<HTMLElement> & { children?: Children };
      iframe: HTMLAttributes<HTMLIFrameElement> & { children?: Children };
      img: HTMLAttributes<HTMLImageElement> & { children?: Children };
      input: HTMLAttributes<HTMLInputElement> & { children?: Children; onChange?: (event: InputEvent) => void; };
      ins: HTMLAttributes<HTMLModElement> & { children?: Children }; // Corrected (for <ins>)
      kbd: HTMLAttributes<HTMLElement> & { children?: Children };
      keygen: HTMLAttributes<HTMLElement> & { children?: Children }; // Deprecated but for completeness
      label: HTMLAttributes<HTMLLabelElement> & { children?: Children };
      legend: HTMLAttributes<HTMLLegendElement> & { children?: Children };
      li: HTMLAttributes<HTMLLIElement> & { children?: Children };
      link: HTMLAttributes<HTMLLinkElement> & { children?: Children };
      main: HTMLAttributes<HTMLElement> & { children?: Children };
      map: HTMLAttributes<HTMLMapElement> & { children?: Children };
      mark: HTMLAttributes<HTMLElement> & { children?: Children };
      menu: HTMLAttributes<HTMLMenuElement> & { children?: Children };
      menuitem: HTMLAttributes<HTMLElement> & { children?: Children }; // For context menus
      meta: HTMLAttributes<HTMLMetaElement> & { children?: Children };
      meter: HTMLAttributes<HTMLMeterElement> & { children?: Children }; // Corrected
      nav: HTMLAttributes<HTMLElement> & { children?: Children };
      noindex: HTMLAttributes<HTMLElement> & { children?: Children }; // Non-standard
      noscript: HTMLAttributes<HTMLElement> & { children?: Children };
      object: HTMLAttributes<HTMLObjectElement> & { children?: Children };
      ol: HTMLAttributes<HTMLOListElement> & { children?: Children };
      optgroup: HTMLAttributes<HTMLOptGroupElement> & { children?: Children };
      option: HTMLAttributes<HTMLOptionElement> & { children?: Children };
      output: HTMLAttributes<HTMLOutputElement> & { children?: Children }; // Corrected
      p: HTMLAttributes<HTMLParagraphElement> & { children?: Children };
      param: HTMLAttributes<HTMLParamElement> & { children?: Children };
      picture: HTMLAttributes<HTMLPictureElement> & { children?: Children }; // Corrected
      pre: HTMLAttributes<HTMLPreElement> & { children?: Children };
      progress: HTMLAttributes<HTMLProgressElement> & { children?: Children };
      q: HTMLAttributes<HTMLQuoteElement> & { children?: Children };
      rp: HTMLAttributes<HTMLElement> & { children?: Children };
      rt: HTMLAttributes<HTMLElement> & { children?: Children };
      ruby: HTMLAttributes<HTMLElement> & { children?: Children };
      s: HTMLAttributes<HTMLElement> & { children?: Children };
      samp: HTMLAttributes<HTMLElement> & { children?: Children };
      script: HTMLAttributes<HTMLScriptElement> & { children?: Children };
      section: HTMLAttributes<HTMLElement> & { children?: Children };
      select: HTMLAttributes<HTMLSelectElement> & { children?: Children; onChange?: (event: Event & { target: HTMLSelectElement }) => void; };
      small: HTMLAttributes<HTMLElement> & { children?: Children };
      source: HTMLAttributes<HTMLSourceElement> & { children?: Children };
      span: HTMLAttributes<HTMLSpanElement> & { children?: Children };
      strong: HTMLAttributes<HTMLElement> & { children?: Children };
      style: HTMLAttributes<HTMLStyleElement> & { children?: Children }; // Content via children or dangerouslySetInnerHTML
      sub: HTMLAttributes<HTMLElement> & { children?: Children };
      summary: HTMLAttributes<HTMLElement> & { children?: Children }; // Inside <details>
      sup: HTMLAttributes<HTMLElement> & { children?: Children };
      table: HTMLAttributes<HTMLTableElement> & { children?: Children };
      template: HTMLAttributes<HTMLTemplateElement> & { children?: Children }; // Corrected
      tbody: HTMLAttributes<HTMLTableSectionElement> & { children?: Children }; // Corrected
      td: HTMLAttributes<HTMLTableCellElement> & { children?: Children }; // Corrected
      textarea: HTMLAttributes<HTMLTextAreaElement> & { children?: Children; onChange?: (event: Event & { target: HTMLTextAreaElement }) => void; };
      tfoot: HTMLAttributes<HTMLTableSectionElement> & { children?: Children }; // Corrected
      th: HTMLAttributes<HTMLTableCellElement> & { children?: Children }; // Corrected
      thead: HTMLAttributes<HTMLTableSectionElement> & { children?: Children }; // Corrected
      time: HTMLAttributes<HTMLTimeElement> & { children?: Children }; // Corrected
      title: HTMLAttributes<HTMLTitleElement> & { children?: Children };
      tr: HTMLAttributes<HTMLTableRowElement> & { children?: Children };
      track: HTMLAttributes<HTMLTrackElement> & { children?: Children };
      u: HTMLAttributes<HTMLElement> & { children?: Children };
      ul: HTMLAttributes<HTMLUListElement> & { children?: Children };
      var: HTMLAttributes<HTMLElement> & { children?: Children };
      video: HTMLAttributes<HTMLVideoElement> & { children?: Children };
      wbr: HTMLAttributes<HTMLElement> & { children?: Children };

      // SVG Elements (basic outline)
      svg: SVGAttributes & { children?: Children };
      // ... other SVG elements like path, circle, rect, etc.
    }

    // Basic SVG attributes (can be expanded)
    interface SVGAttributes extends HTMLAttributes<SVGElement> {
        cx?: number | string;
        cy?: number | string;
        d?: string;
        fill?: string;
        fx?: number | string;
        fy?: number | string;
        gradientTransform?: string;
        gradientUnits?: string;
        height?: number | string;
        points?: string;
        preserveAspectRatio?: string;
        r?: number | string;
        rx?: number | string;
        ry?: number | string;
        spreadMethod?: string;
        stopColor?: string;
        stopOpacity?: number | string;
        stroke?: string;
        strokeDasharray?: string | number;
        strokeDashoffset?: string | number;
        strokeLinecap?: "butt" | "round" | "square" | "inherit";
        strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
        strokeMiterlimit?: string | number;
        strokeOpacity?: number | string;
        strokeWidth?: number | string;
        transform?: string;
        viewBox?: string;
        width?: number | string;
        x1?: number | string;
        x2?: number | string;
        x?: number | string;
        y1?: number | string;
        y2?: number | string;
        y?: number | string;
    }
  }
}

// Make VNodeProps available for import in jsx.d.ts if needed, though global JSX should use its own types
export {};
