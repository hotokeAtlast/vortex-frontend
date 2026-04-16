import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  // useLocation gives us the current URL path
  const { pathname } = useLocation();

  useEffect(() => {
    // Whenever the pathname changes, instantly scroll to the top-left corner
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't render any actual HTML, it just runs the logic
  return null;
}