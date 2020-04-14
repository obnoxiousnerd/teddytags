import { h } from "./h";
import { render } from "./render";
import { Component } from "./component";
/**
 * A function used in this library to pass attribues like `name`, `id`, etc. to an element.
 * @param element The object referring to the element, like a `querySelector`
 * @param attrs The atrributes to be passed. Must be of type NamedNodeMap
 */
const passAttrs = (element: any, attrs: NamedNodeMap): void => {
  Array.prototype.slice.call(attrs).forEach((attr: Attr) => {
    if (attr.name === "id") {
      /* Not passing ID ahead */
    } else {
      element.setAttribute(attr.name, attr.value);
    }
  });
};
/**
 * A function used in this library to parse the custom tag with a valid HTML5 tag.
 * @param element The object referring to the element, like a `querySelector`
 * @param tagName The valid HTML5 tag that will replace the element's custom tag name
 * @param newId The custom tag name. Must because to preserve the custom element's identity in an `ID` attribute
 */
const parseHTML = (
  element: HTMLElement,
  tagName: string,
  newId: string
): void => {
  const elementHTML: string = element.innerHTML;
  const newEl: Element = document.createElement(tagName);
  newEl.setAttribute("id", newId);
  newEl.innerHTML = elementHTML;
  element.parentElement.replaceChild(newEl, element);
};
/**
 * The class used for instantaniation of TeddyTags Custom Elements.
 */
export class Tag {
  /**
   * The `querySelectorAll` which will be mutated from the `constructor` of this class.
   */
  selector: NodeList;
  /**
   * The name of the custom element, acquired from the `constructor`.
   */
  elementName: string;
  /**
   * Initialize TeddyTags
   * @param selector The custom element's tag name
   *
   * Example:
   * ```javascript
   *    new Tag('customTag')
   * ```
   * Will refer to
   * ```html
   * <customTag></customTag>
   * ```
   */
  constructor(selector?: string) {
    this.selector = document.querySelectorAll(selector);
    this.elementName = selector;
  }
  /**
   * Magically change your custom element to the desired valid HTML5 one.
   * @param tagName The tag name of the custom element
   *
   * Example:
   *  * Your custom element
   * ```html
   * <customTag>Hello, World!</customTag>
   * ```
   *  * Using the function
   * ```javascript
   *    new Tag('customTag').set('h1');
   * ```
   *  * The result
   * ```html
   *    <h1 id="customTag">Hello, World!</h1>
   * ```
   */
  set = (tagName: string): void => {
    /**
     * The `index` variable is used to select the elements from the newly mutated elements.
     * It will stop brodcasting properties from one element to another.
     */
    let index = 0;
    this.selector.forEach((element: HTMLElement) => {
      const attributes: NamedNodeMap = element.attributes;
      parseHTML(element, tagName, this.elementName);
      this.selector = document.querySelectorAll(`#${this.elementName}`);
      const newElement: Node | HTMLElement = this.selector[index];
      passAttrs(newElement, attributes);
      index += 1;
    });
  };
  /**
   * A function that transpiles HTML elements into dynamic components on the go.
   * Example:
   * * A component
   *  ```javascript
   * class Greeter extends Component{
   *  constructor(props){
   *  super(props)
   *  }
   *  render(){
   *    return h("h1", null, "Hello, ", this.props.name)
   *  }
   * }
   * ```
   *
   * * The HTML tag
   *   ```html
   *   <Greeter name="Yoda"></Greeter>
   *   ```
   *
   * * Code to convert it into element
   *   ```javascript
   *    new Tag('Greeter').fromComponent(Greeter)
   *   ```
   *
   * * The rendered HTML
   *   ```html
   *   <div id="Greeter" name="Yoda">
   *    <p>Hello, Yoda</p>
   *   </div>
   *   ```
   */
  fromComponent = (component: typeof Component): void => {
    this.set("div");
    this.selector.forEach((e: HTMLElement) => {
      const props = {};
      Array.prototype.slice.call(e.attributes).forEach((a: Attr) => {
        props[a.name] = a.value;
      });
      const app = h(component, props);
      render(app, e);
    });
  };
}
