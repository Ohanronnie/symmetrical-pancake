import { Link } from "react-router-dom";
export default function Example() {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <main className="grid h-[100vh] place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
        <div className="border-[1px] p-2 rounded-md border-solid border-gray-600 text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="home"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Link>
            {/*          <a href="#" className="text-sm font-semibold text-white">
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>*/}
          </div>
        </div>
      </main>
    </>
  );
}
