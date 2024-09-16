import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="h-20 flex justify-between items-center max-w-6xl mx-auto p-3 text-slate-700 font-bold ">
        <Link to="/">
          <h1 className="text-3xl sm:text-4xl flex flex-wrap">
            <span className="text-slate-500">Kech</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-2 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="font-normal bg-transparent focus:outline-none h-6 w-20 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4 font-bold">
          <Link to="/">
            <li className="hidden sm:inline  hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline  hover:underline">About</li>
          </Link>
          <Link to="/sign-in">
            <li className="sm:inline  hover:underline">Sign in</li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
