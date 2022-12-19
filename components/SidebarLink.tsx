import { useRouter } from 'next/router';

interface Props {
  text: string;
  activeSearch: boolean;
  activeNotifications: boolean;
  Icon?: any;
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
  const router = useRouter();

  return (
    <div
      className={`flex group h-max items-center justify-center  gap-4 text-xl text-gray-800 xl:justify-start px-3 py-3 iconHover ${
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
           h-7 w-7 rounded-full group-hover:scale-105 transition-all`}
        />
      )}
      <span
        className={`${
          (activeSearch || activeNotifications) && 'xl:hidden'
        } hidden xl:inline text-[1rem]`}
      >
        {text}
      </span>
    </div>
  );
};

export default SidebarLink;
