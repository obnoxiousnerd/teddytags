import { renderComponent } from "./render";
/**
 * The class used for the instantaniation of TeddyTags virtual elements
 *
 * Declaration:
 * ```js
 * class MyComponent extends Component{
 *  constructor(props){
 *    super(props)
 *  }
 *  render(){
 *    //return your markup
 *  }
 * }
 * ```
 */
/*istanbul ignore next */
export class Component {
  /**
   * The general properties of the Component. Cannot be changed once set.
   * Should contain some unique or permanent information.
   * Only accessible if passed through the constructor as `super(props)`.
   */
  readonly props: PropsOrState;
  /**
   * The attributes of the Component which can be changed as per user's basis.
   * Should contain some temporary information.
   */
  state: PropsOrState;
  /**
   * The constructor of the Component. It is a **must to pass `super(props)`** before other things.
   * @param {PropsOrState} props The properties of the Component
   */
  constructor(props: PropsOrState) {
    this.props = props;
  }
  /**
   * The function which will return the general markup of the Component.
   * For Component to appear in the DOM, this function is necessary.
   */
  /* istanbul ignore next */
  render() {}
  /**
   * The function which will alter with the `state` property of the Component.
   * @param state
   */
  /* istanbul ignore next */
  setState(state: object) {
    this.state = Object.assign({}, state);
    renderComponent(this);
  }
  /**
   * The function which will invoke when the component is about to mount.
   * @param dom The DOM element that will be mounted
   */
  componentWillMount(dom?: Element) {}
  /**
   * The function which will invoke immediately after mounting the component.
   * @param dom The DOM element that will is mounted
   */
  componentDidMount(dom?: Element) {}
  /**
   * The function which will invoke immediately if the DOM of component updates.
   * @param oldDOM The old DOM element
   * @param newDOM The updated DOM element
   */
  componentDidUpdate(oldDOM?: Element, newDOM?: Element) {}
}
Component.prototype["isClassComponent"] = true;
/**
 * The standard interface of an non-component virtual element
 */
export interface HElement {
  type: string;
  readonly props: PropsOrState;
  [children: string]: any;
}
export type PropsOrState = { [propOrState: string]: any };
/**
 * The standard interface of a component virtual element
 */
export interface HConstructorElement {
  readonly props: PropsOrState;
  state: PropsOrState;
  constructor(props: PropsOrState): void;
  render(): HElement;
  node?: HElement;
  base?: Element;
  dom?: Element;
  componentWillMount(dom?: Element): void;
  componentDidMount(dom?: Element): void;
  componentDidUpdate(oldDOM?: Element, newDOM?: Element): void;
}
