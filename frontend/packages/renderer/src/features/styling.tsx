import {Global} from '@mantine/core';
import * as React from 'react';

// Woff2 -- Should be all we need as electron supports it
// electron/src/assets/fonts/asap/asap-v24-latin-ext_latin-500.woff2

import asap_500 from '../../assets/fonts/asap/asap-v24-latin-ext_latin-500.woff2';
// electron/src/assets/fonts/asap/asap-v24-latin-ext_latin-500italic.woff2
import asap_500_italic from '../../assets/fonts/asap/asap-v24-latin-ext_latin-500italic.woff2';
// electron/src/assets/fonts/asap/asap-v24-latin-ext_latin-600.woff2
import asap_600 from '../../assets/fonts/asap/asap-v24-latin-ext_latin-600.woff2';
// electron/src/assets/fonts/asap/asap-v24-latin-ext_latin-600italic.woff2
import asap_600_italic from '../../assets/fonts/asap/asap-v24-latin-ext_latin-600italic.woff2';
// electron/src/assets/fonts/asap/asap-v24-latin-ext_latin-700.woff2
import asap_700 from '../../assets/fonts/asap/asap-v24-latin-ext_latin-700.woff2';
// electron/src/assets/fonts/asap/asap-v24-latin-ext_latin-700italic.woff2
import asap_700_italic from '../../assets/fonts/asap/asap-v24-latin-ext_latin-700italic.woff2';
// electron/src/assets/fonts/asap/asap-v24-latin-ext_latin-italic.woff2
import asap_italic from '../../assets/fonts/asap/asap-v24-latin-ext_latin-italic.woff2';
// electron/src/assets/fonts/asap/asap-v24-latin-ext_latin-regular.woff2
import asap from '../../assets/fonts/asap/asap-v24-latin-ext_latin-regular.woff2';

function Styling() {
  return (
    <Global
      styles={[
        {
          '@font-face': {
            fontFamily: 'Asap',
            src: `url('${asap_700}') format("woff2")`,
            fontWeight: 700,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Asap',
            src: `url('${asap_700_italic}') format("woff2")`,
            fontWeight: 700,
            fontStyle: 'italic',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Asap',
            src: `url('${asap_600}') format("woff2")`,
            fontWeight: 600,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Asap',
            src: `url('${asap_600_italic}') format("woff2")`,
            fontWeight: 600,
            fontStyle: 'italic',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Asap',
            src: `url('${asap_500}') format("woff2")`,
            fontWeight: 500,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Asap',
            src: `url('${asap_500_italic}') format("woff2")`,
            fontWeight: 500,
            fontStyle: 'italic',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Asap',
            src: `url('${asap}') format("woff2")`,
            fontWeight: 400,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Asap',
            src: `url('${asap_italic}') format("woff2")`,
            fontWeight: 400,
            fontStyle: 'italic',
          },
        },
      ]}
    />
  );
}

export default Styling;
