import { IconType } from 'react-icons';

interface Props {
  text: string;
  activeSearch: boolean;
  activeNotifications: boolean;
  Icon?: IconType;
  active?: boolean;
  img?: string;
}

const SidebarLink = ({
  Icon,
  text,
  active,
  img,
  activeSearch,
  activeNotifications,
}: Props) => {
  return (
    <div
      className={`flex group w-[90%] h-max items-center justify-center gap-4 text-xl text-gray-800 xl:justify-start px-2 py-2 iconHover ${
        active && 'font-bold '
      }`}
    >
      {Icon ? (
        <Icon
          className={
            active
              ? 'h-7 w-7 text-gray-900 '
              : 'h-7 w-7 group-hover:scale-105 transition-all '
          }
        />
      ) : (
        <img
          src={img}
          alt="user-profile"
          className={`
           h-7 w-7 rounded-full group-hover:scale-105 transition-all object-cover`}
        />
      )}
      <span
        className={`${
          (activeSearch || activeNotifications) && 'xl:hidden'
        } hidden xl:inline text-[1rem] `}
      >
        {text}
      </span>
    </div>
  );
};

export default SidebarLink;
