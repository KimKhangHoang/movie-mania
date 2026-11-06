import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { countPageView } from '../utils/analytics';

// Counts a visit to the current page, once its title is known.
// It uses a title the page chooses and the path without the query string, so a search is never included.
function usePageView(title) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (title) countPageView(pathname, title);
  }, [pathname, title]);
}

export default usePageView;
