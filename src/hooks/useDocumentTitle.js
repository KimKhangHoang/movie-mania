import { useEffect } from 'react';

// Sets the browser tab title for the current page, e.g. "Inception | MovieMania"
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | MovieMania` : 'MovieMania';
  }, [title]);
}

export default useDocumentTitle;
