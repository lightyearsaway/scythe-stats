import { styled } from 'baseui';
import { StatefulInput } from 'baseui/input';
import { NextPage } from 'next';

import { SiteHeader } from '../components';

const HomePage: NextPage = () => {
  return (
    <div>
      <SiteHeader />
    </div>
  );
};

export default HomePage;
