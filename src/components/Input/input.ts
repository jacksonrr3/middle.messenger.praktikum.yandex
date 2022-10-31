import Block, { Props } from '../../core/Block';
import './input.scss';
import inputTemplate from './input.template';
import { validationErrorMessage, isValidInput } from '../../utils/validation';
import Span from '../Span';

const focusBlurHandler = (spanElement = new Span({})) => ({ target } : Event) => {
  const spanText = isValidInput(target as HTMLInputElement) ? '' : validationErrorMessage[target.id];
  spanElement.setProps({
    spanText,
  });
};

export default class Input extends Block {
  constructor(props: Props) {
    const {
      type, id, title, disabled, spanElement,
    } = props;

    const attr = [
      ['type', type],
      ['id', id],
      ['name', id],
      ['placeholder', title],
    ];

    if (disabled) {
      attr.push(['disabled', disabled]);
    }

    super('input', {
      type,
      id,
      title,
      attr,
      events: {
        focus: focusBlurHandler(spanElement),
        blur: focusBlurHandler(spanElement),
      },
    });
  }

  render() {
    return this.compile(inputTemplate, this._props);
  }
}