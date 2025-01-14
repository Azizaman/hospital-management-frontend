import Login from './Login';
import Loginagequote from './Loginagequote';

const Loginpage = () => {
  return (
    <div className="flex min-h-screen overflow-hidden flex-col sm:flex-row items-center justify-center py-8">
      {/* Left side for Login */}
      <div className="w-full sm:w-1/2 flex justify-center items-center sm:bg-gray-50">
        <Login />
      </div>

      {/* Right side for Quote */}
      <div className="hidden sm:block sm:w-1/2 flex justify-center items-center bg-gray-100">
        <Loginagequote />
      </div>
    </div>
  );
};

export default Loginpage;
