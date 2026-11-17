require('react-app-polyfill/stable');

// CRA's core-js 3.0 baseline can remove newer bare polyfill imports.
// Keep these explicit calls for query-string 10 in older browsers.
void require('core-js/actual/array/to-sorted');
void require('core-js/actual/string/replace-all');
