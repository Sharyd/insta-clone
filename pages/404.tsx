import Link from 'next/link';
import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
      <Link href="/" legacyBehavior>
        <a className="textMainColor p-6">Go back home</a>
      </Link>
    </div>
  );
};

export default NotFound;
