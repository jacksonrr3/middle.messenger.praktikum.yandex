import Block from '../../core/Block';
import { InputBlock } from '../../components/InputBlock/index';
import './userProfilePage.scss';
import userProfileTemplate from './userProfilePage.template';
import { Button } from '../../components/Button';
import { AuthController } from '../../controllers/AuthController';
import { Link } from '../../components/Link';
import { Router } from '../../core/Router';
import { Avatar } from '../../components/Avatar';
import { store, StoreEvents } from '../../core/Store';
import { ROUTES } from '../../constants/routs';

export default class userProfilePage extends Block {
  constructor() {
    const { user } = store.getState();

    store.on(StoreEvents.Updated, () => {
      // TODO split users page into one page
    });

    const messengerLink = new Link({
      events: {
        click: (e) => {
          e.preventDefault();
          Router.getInstanse().go(ROUTES.MESSENGER);
        },
      },
    });

    const userAvatar = new Avatar({
      src: user.avatar,
      events: {
        click: () => {
          console.log('go to avatar');
          Router.getInstanse().go(ROUTES.CHANGE_AVATAR);
        },
      },
    });

    const userSettingsLink = new Link({
      text: 'Изменить данные',
      events: {
        click: (e) => {
          e.preventDefault();
          Router.getInstanse().go(ROUTES.USER_SETTINGS);
        },
      },
    });

    const changePasswordLink = new Link({
      text: 'Изменить пароль',
      events: {
        click: (e) => {
          e.preventDefault();
          Router.getInstanse().go(ROUTES.CHANGE_PASSWORD);
        },
      },
    });

    const userSettings = new Link({
      events: {
        click: (e) => {
          e.preventDefault();
          Router.getInstanse().go(ROUTES.USER_SETTINGS);
        },
      },
    });

    const email = new InputBlock({
      title: 'Почта',
      id: 'email',
      type: 'email',
      label: true,
      middleSpan: true,
      disabled: 'disabled',
      valueProp: 'email',
    });

    const login = new InputBlock({
      title: 'Логин',
      id: 'login',
      type: 'text',
      label: true,
      middleSpan: true,
      disabled: 'disabled',
      valueProp: 'login',
    });

    const firstName = new InputBlock({
      title: 'Имя',
      id: 'first_name',
      type: 'text',
      label: true,
      middleSpan: true,
      disabled: 'disabled',
      valueProp: 'first_name',
    });

    const secondName = new InputBlock({
      title: 'Фамилия',
      id: 'second_name',
      type: 'text',
      label: true,
      middleSpan: true,
      disabled: 'disabled',
      valueProp: 'second_name',
    });

    const displayName = new InputBlock({
      title: 'Имя в чате',
      id: 'display_name',
      type: 'text',
      label: true,
      middleSpan: true,
      disabled: 'disabled',
      valueProp: 'display_name',
    });

    const phone = new InputBlock({
      title: 'Телефон',
      id: 'phone',
      type: 'tel',
      label: true,
      middleSpan: true,
      disabled: 'disabled',
      valueProp: 'phone',
    });

    const exitButton = new Button({
      text: 'Выйти',
      events: {
        click: async () => {
          await AuthController.logout();
        },
      },
    });

    super('div', {
      attr: { class: 'user-profile-container' },
      userAvatar,
      email,
      login,
      firstName,
      secondName,
      displayName,
      phone,
      messengerLink,
      userSettings,
      userSettingsLink,
      changePasswordLink,
      exitButton,
    });
  }

  render() {
    return this.compile(userProfileTemplate, this._props);
  }
}
