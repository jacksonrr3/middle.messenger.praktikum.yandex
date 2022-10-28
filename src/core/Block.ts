import { v4 as uuidv4 } from 'uuid';
import Handlebars from 'handlebars';
import EventBus from './EventBus';

export type Children = Record<string, any>;
export type Props = {
  [key: string]: any;
  class?: string;
  children?: Children;
  events?: Record<string, (...args: any) => void>;
  attr?: string[][];
};
type Meta = {
  tagName: string,
  props: Props,
};

export default class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_RENDER: 'flow:render',
    FLOW_CDU: 'flow:component-did-update',
  };

  _props: Props;
  _eventBus: () => EventBus;
  _children: Children;
  _id: string;
  _element: HTMLElement;
  _meta: Meta;
  _setUpdate: boolean;

  constructor(tagName = 'div', propsAndChildren: Props = {}) {
    const { props, children } = this._getChildren(propsAndChildren);

    const eventBus = new EventBus();
    this._eventBus = () => eventBus;
    this._id = uuidv4();
    // this._children = children;
    this._children = this._makePropsProxy(children);
    this._props = this._makePropsProxy({ ...props, _id: this._id });
    this._meta = { tagName, props };

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
  }

  _createResources() {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  init() {
    this._createResources();
    this._eventBus().emit(Block.EVENTS.FLOW_RENDER);
    this._eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidMount() {
    this.componentDidMount();

    Object.values(this._children).forEach((child) => {
      child.dispatchComponentDidMount();
    });
  }

  // Может переопределять пользователь, необязательно трогать
  // componentDidMount(oldProps: Props) {}
  componentDidMount() {}

  dispatchComponentDidMount() {
    this._eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidUpdate(oldProps: Props, newProps: Props) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (response) {
      this._eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  // Может переопределять пользователь, необязательно трогать
  componentDidUpdate(oldProps: Props, newProps: Props): boolean {
    return true;
  }

  setProps = (nextProps: Props) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this._props, nextProps);
  };

  get element() {
    return this._element;
  }

  _render() {
    const block = this.render();
    // Этот небезопасный метод для упрощения логики
    // Используйте шаблонизатор из npm или напишите свой безопасный
    // Нужно не в строку компилировать (или делать это правильно),
    // либо сразу в DOM-элементы возвращать из compile DOM-ноду
    this._removeEvents();
    this._element.innerHTML = '';
    this._element.appendChild(block);
    this._addEvents();
    this._addAttributes();
  }

  // Может переопределять пользователь, необязательно трогать
  render() {}

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: Props) {
  // Можно и так передать this
  // Такой способ больше не применяется с приходом ES6+
    // const self = this;
    return new Proxy(props, {
      set: (target, prop, value) => {
        const oldProps = { ...target };
        if (oldProps[prop] !== value) {
          target[prop] = value;
          this._eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, target);
          return true;
        }
        return Reflect.set(target, prop, value);
      },
      deleteProperty: () => {
        throw new Error('нет доступа');
      },
    });
  }

  _createDocumentElement(tagName: string) {
    const element = document.createElement(tagName);
    element.setAttribute('data-id', this._id);
    return element;
  }

  _addEvents() {
    const { events = {} } = this._props;

    Object.keys(events).forEach((eventName) => {
      this._element.addEventListener(eventName, events[eventName]);
    });
  }

  _removeEvents() {
    const { events = {} } = this._props;

    Object.keys(events).forEach((eventName) => {
      this._element.removeEventListener(eventName, events[eventName]);
    });
  }

  _addAttributes() {
    const { attr = [] } = this._props;
    attr.forEach(([key, value]) => {
      this._element.setAttribute(key, value);
    });
  }

  _getChildren(propsAndChildren: Props) {
    const children = {};
    const props = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }

  compile(template: string, props: Props) {
    // const propsAndStubs = { ...props };

    // Object.entries(this._children).forEach(([key, child]) => {
    //   propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    // });

    // return Handlebars.compile(template)(propsAndStubs);
    const propsAndStubs = { ...props };

    Object.entries(this._children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child.id}"></div>`;
    });

    const fragment = this._createDocumentElement('template');

    fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

    Object.values(this._children).forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child.id}"]`);

      stub.replaceWith(child.getContent());
    });

    return fragment.content;
  }

  show() {
    this.getContent().style.display = 'block';
  }

  hide() {
    this.getContent().style.display = 'none';
  }
}
