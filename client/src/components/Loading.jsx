import { useState, useEffect } from "react";

/*export function useLoading() {
  const [isLoading, setLoading] = useState(false);
  const handlePopState = () => {
    if (isLoading) {
      document.body.style.overflow = "scroll";
      setLoading(false);
      history.back()
    } else {
      document.body.style.overflow = "scroll";
      
    }
  };
  const load = (loading) => {
    setLoading(loading);
    if (loading) {
      window.addEventListener("popstate", handlePopState);
      window.history.pushState(null, document.title, window.location.href);
      document.body.style.overflow = "hidden";
    }
    if (!loading) {
      if(getComputedStyle(document.body).overflow !== "scroll"){ document.body.style.overflow = "scroll";
        history.back()
      }
    }
  };
  return [isLoading, load];
}*/
export function useLoading() {
  const [isLoading, setLoading] = useState(false);
  const [ctx, setCtx] = useState(false);
  const handlePopState = ($) => {
    if (isLoading) {
      document.body.style.overflow = "scroll";
      history.back();
    }
  };
  const __setLoad = (value) => {
    if (!ctx) setCtx(true);
    setLoading(value);
  };
  useEffect(
    function () {
      if (ctx) {
        console.log(Date.now());
        if (isLoading) {
          window.addEventListener("popstate", handlePopState);
          window.history.pushState(null, document.title, window.location.href);
        }
        if (!isLoading) {
          window.removeEventListener("popstate", handlePopState);
          history.back();
        }
      }
      return () => {
        if (ctx) {
          window.removeEventListener("popstate", handlePopState);
          document.body.style.overflow = "scroll";
        }
      };
    },
    [isLoading],
  );
  return [isLoading, __setLoad];
}
export function Loading({ svg, div }) {
  return (
    <div className={`loader ${div}`}>
      <svg viewBox="25 25 50 50" {...svg}>
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="3"
          strokeMiterLimit="10"
        />
      </svg>
    </div>
  );
}
