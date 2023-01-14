import { DocumentData } from 'firebase/firestore';
import React, { useContext, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { ChatContext } from '../../store/ChatContext';

interface Props {
  message: DocumentData;
}

const Message = ({ message }: Props) => {
  const [currentUser] = useAuthState(auth);
  const { data } = useContext(ChatContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  return (
    <div className="flex flex-col" ref={ref}>
      <span className="text-center p-4 text-gray-400"></span>
      <div
        className={`flex  gap-2 p-4 ${
          message.senderId === currentUser?.uid
            ? 'flex-row-reverse'
            : ' flex-col'
        }`}
      >
        <div className="flex flex-col gap-3 flex-wrap">
          {message.img && (
            <img
              src={message.img}
              alt=""
              className="h-[225px] w-[150px] md:h-[300px] md:w-[200px] object-contain bg-black rounded-lg ml-4 "
            />
          )}
          <div
            className={`flex items-center gap-2 flex-wrap  ${
              message.senderId === currentUser?.uid ? 'flex-row-reverse' : ''
            }`}
          >
            <img
              src={
                message.senderId === currentUser?.uid
                  ? currentUser?.photoURL
                  : data.user?.photoURL
              }
              alt=""
              className="w-8 h-8 rounded-full object-cover mt-auto"
            />
          </div>
          {message.text && (
            <div
              className={`${
                message.senderId === currentUser?.uid ? 'ml-auto' : 'mr-auto'
              } border rounded-full p-6 break-all w-max `}
            >
              <p>{message.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
