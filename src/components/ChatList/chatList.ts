import Block, { Props } from '../../core/Block';
import chatListTemplate from './chatList.template';
import './chatList.scss';
import { store, StoreEvents } from '../../core/Store';
import { ChatController, ChatItem } from '../../controllers/ChatController';
import round4747 from '../../../static/pictures/round_47_47.svg';
import { baseFilesUrl } from '../../constants/urls';

const mapChats = (chats: ChatItem[]) => chats.map((chat: ChatItem) => {
  const newChat = chat;
  newChat.avatar = chat.avatar ? `${baseFilesUrl}${chat.avatar}` : round4747;
  if (chat.last_message) {
    const time = new Date(chat.last_message.time);
    newChat.last_message.time = `${time.getHours()}:${time.getMinutes()}`;
  }
  return newChat;
});

export class ChatList extends Block {
  constructor(props: Props) {
    ChatController.getChats();
    const { chats } = store.getState();

    store.on(StoreEvents.Updated, () => {
      const { chats: newChats } = store.getState();
      if (this._props.chats?.length !== newChats?.length) {
        this.setProps({
          chats: mapChats(newChats),
        });
      }
    });

    super('div', {
      attr: {
        class: 'chat-list',
      },
      ...props,
      chats: mapChats(chats ?? []),
      events: {
        click: (event) => {
          const { dataset } = event.target.closest('div.chat-item');
          store.set('chatId', Number(dataset.id));
        },
      },
    });
  }

  render(): DocumentFragment {
    return this.compile(chatListTemplate, this._props);
  }
}
