import { ipcRenderer } from 'electron';
import { NodeList } from 'subtitle';
const vttFromFile = async (path: string, exampleData?: boolean) => {
  if (exampleData === true) {
    const result = (await ipcRenderer.invoke('load-vtt-from-file', path, exampleData)) as NodeList;
    return result;
  } else {
    const result = (await ipcRenderer.invoke('load-vtt-from-file', path)) as NodeList;
    return result;
  }
};

export default vttFromFile;
