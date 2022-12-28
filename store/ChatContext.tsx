import { DocumentData } from 'firebase/firestore';
import { createContext, Dispatch, useContext, useReducer } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

interface Props {
  children?: React.ReactNode;
}

type dataType = {
  dispatch: Dispatch<{ type: string; payload: { uid: string | number } }>;
  data: {
    chatId: string;
    user: any;
  };
};

export const ChatContext = createContext({} as dataType);

export const ChatContextProvider = ({ children }: Props) => {
  const [user] = useAuthState(auth);
  const currentUser: any = user;

  const INITIAL_STATE = {
    chatId: 'null',
    user: {},
  };

  const chatReducer = (
    state: { chatId: string; user: object },
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
