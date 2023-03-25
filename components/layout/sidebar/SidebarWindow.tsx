import React from 'react';

import { motion } from 'framer-motion';
import SidebarNotifications from './SidebarNotifications';
import SidebarSearch from './SidebarSearch';

interface Props {
  type: string;
}

const SidebarWindow = ({ type }: Props) => {
  return (
    <motion.div
      initial={{ x: '-100%', opacity: 0.5 }}
      animate={{ x: '85px', opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-[350px] left-[0px] top-0 h-screen absolute overflow-x-auto bg-white rounded-r-xl -z-20"
      exit={{ x: '-100%', opacity: 0.5 }}
    >
      {type === 'search' ? <SidebarSearch /> : <SidebarNotifications />}
    </motion.div>
  );
};

export default SidebarWindow;
