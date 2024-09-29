// app/page.tsx

import CommunityList from './components/CommunityList';

const HomePage = () => {
  return (
    <div className="container mx-auto">
      <p className="text-center text-xl font-semibold my-2">Select Your Community</p>
      <CommunityList />
    </div>
  );
};

export default HomePage;
