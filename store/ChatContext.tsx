import { DocumentData } from 'firebase/firestore';
import { createContext, useContext, useReducer } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

interface Props {
  children?: React.ReactNode;
}

export const ChatContext = createContext<any>({
  chatId: 'null',
  user: {},
});

export const ChatContextProvider = ({ children }: Props) => {
  const [user] = useAuthState(auth);
  const currentUser: any = user;
  const INITIAL_STATE = {
    chatId: 'null',
    user: {},
  };

  const chatReducer = (
    state: any,
    action: { type: string; payload: { uid: string | number } }
  ) => {
    switch (action.type) {
      case 'CHANGE_USER':
        return {
          user: action.payload,
          chatId:
            currentUser?.uid > action?.payload?.uid
              ? currentUser?.uid + action?.payload?.uid
              : action?.payload?.uid + currentUser?.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
