import { diff } from "./diff";
import { HConstructorElement, HElement } from "./component";
/**
 * The runtime condition of a Constructor Element
 */
interface HElementRuntime {
  (component: HConstructorElement);
  (component: any);
}
/* istanbul ignore next */
//Ignoring this cause this does not need testing anyway
export const renderComponent: HElementRuntime = (
  component: HConstructorElement
): void => {
  //only proceed if the component has mounted, else return
  if (component.base && component.dom) {
    const rerendered: HElement = component.render();
    const base: string[] = [];
    base.push(component.base.innerHTML);
    const oldDom = component.dom;
    component.base = diff(component.base, rerendered, "UPDATE", false);
    base.push(component.base.innerHTML);
    if (base[0] !== base[1]) {
      component.componentDidUpdate(oldDom, component.dom);
    }
  } else return;
};
export const cleanRender = (
  node: HElement,
  target: Element | DocumentFragment
) => {
  diff(target, node, "PLACEMENT", true);
};
/**
 * Another version of render, but will only be used in the process of updating.
 * @param node Your virtual Element
 * @param target The target to append to
 */
const updateRender = (node: HElement, target: Element | DocumentFragment) => {
  diff(target, node, "PLACEMENT", false);
};
export const renderEl = (node: any, target?: any, isDirty?: boolean) => {
  const isValidMethod = (key: string) => {
    const validMethods = ["innerHTML", "className"];
    return validMethods.indexOf(key) > -1;
  };
  const isEvent = (key: string) => {
    return key.indexOf("on") === 0;
  };
  const textTypes = ["string", "number", "boolean"];
  /* istanbul ignore if*/ if (textTypes.indexOf(typeof node) > -1) {
    return document.createTextNode(node);
  }
  if (Array.isArray(node)) {
    if (node[0] === "__FRAGMENT__") {
      const fragDom: DocumentFragment = document.createDocumentFragment();
      node.shift();
      node.forEach(child => {
        if (isDirty) {
          cleanRender(child, fragDom);
        } else {
          updateRender(child, fragDom);
        }
      });
      return fragDom;
    } else {
      const app = node[0],
        props: object = node[1];
      const component: HConstructorElement = new app(props);
      component.node = component.render();
      component.base = target;
      const dom = renderEl(component.node, undefined, true);
      component.dom = dom;
      return [dom, component];
    }
  } else {
    const dom: Element = document.createElement(node.type);
    const isProp = (key: string) => {
      return key !== "children" && !isEvent(key) && !isValidMethod(key);
    };
    Object.keys(node.props)
      .filter(isEvent)
      .forEach(event => {
        const type = event.substring(2).toLowerCase();
        dom.addEventListener(type, node.props[event]);
      });
    Object.keys(node.props)
      .filter(isProp)
      .map(prop => {
        dom.setAttribute(prop, node.props[prop].toString());
      });
    Object.keys(node.props)
      .filter(isValidMethod)
      .map(prop => {
        dom[prop] = node.props[prop];
      });
    node.props.children.forEach(child => {
      if (textTypes.indexOf(typeof child) > -1)
        dom.appendChild(document.createTextNode(child));
      else {
        /*istanbul ignore next: probably not picked up by istanbul */ if (
          isDirty
        )
          cleanRender(child, dom);
        /*istanbul ignore next: probably not picked up by istanbul */ else
          updateRender(child, dom);
      }
    });
    //set dom for future reference
    node.dom = dom;
    return dom;
  }
};
/**
 * The function that links your Virtual Elements to the real DOM.
 * Appends the virtual element to the target
 * Usage:
 * ```js
 * //App is a Component
 * //If JSX
 * render(<App />, document.querySelector("#app"))
 * //If no JSX
 * render(h(App, null), document.querySelector("#app"))
 * ```
 * @param node Your virtual Element
 * @param target The target to append to
 */
export const render = (node: HElement, target: Element) => {
  /*istanbul ignore next */
  if (target["__tdNode__"]) {
    diff(target, node, "UPDATE", true);
  } else diff(target, node, "PLACEMENT", true);
};
