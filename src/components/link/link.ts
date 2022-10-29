import Block, { Props } from '../../core/Block';
import linkTemplate from './link.template';

export default class Button extends Block {
  constructor(props: Props) {
    super('a', {
      ...props,
    });
  }

  render() {
    return this.compile(linkTemplate, this._props);
  }
}
