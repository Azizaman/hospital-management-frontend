
import Register from './Register'; // Assuming you have a Register component
import Loginagequote from './Loginagequote';

const Registerpage = () => {
  return (
    <div className="flex min-h-screen flex-col sm:flex-row ">
      {/* Left side for Register Card */}
      <div className="w-full sm:w-1/2 flex justify-center items-center bg-gray-50 py-8 sm:py-0">
        <Register />
      </div>

      {/* Right side for Quote */}
      <div className="hidden sm:w-1/2 sm:flex justify-center items-center bg-gray-100">
        <Loginagequote />
      </div>
    </div>
  );
};

export default Registerpage;
