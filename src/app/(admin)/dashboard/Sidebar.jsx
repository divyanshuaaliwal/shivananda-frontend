import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-56 bg-gray-900 text-white p-5 flex flex-col gap-3 min-h-screen">
      <h2 className="text-xl font-bold mb-2">Admin</h2>
      <Link className="text-white no-underline px-3 py-2 rounded hover:bg-gray-700" href="/dashboard/home">Home</Link>
      <Link className="text-white no-underline px-3 py-2 rounded hover:bg-gray-700" href="/dashboard/about">About Us</Link>
      <Link className="text-white no-underline px-3 py-2 rounded hover:bg-gray-700" href="/dashboard/products">Products</Link>
      <Link className="text-white no-underline px-3 py-2 rounded hover:bg-gray-700" href="/dashboard/projects">Projects</Link>
      <Link className="text-white no-underline px-3 py-2 rounded hover:bg-gray-700" href="/dashboard/blogs">Blogs</Link>
      <Link className="text-white no-underline px-3 py-2 rounded hover:bg-gray-700" href="/dashboard/clients">Clients / Partners</Link>
      <Link className="text-white no-underline px-3 py-2 rounded hover:bg-gray-700" href="/dashboard/contact">Contact</Link>
      {/* <Link className="text-white no-underline px-3 py-2 rounded hover:bg-gray-700" href="/dashboard/pages">Other Pages</Link> */}
    </div>
  );
}
