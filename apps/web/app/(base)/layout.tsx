import { PropsWithChildren } from 'react';
import Header from '../../components/Header';

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full h-screen">
      <Header />
      {children}
    </div>
  );
};

export default layout;
