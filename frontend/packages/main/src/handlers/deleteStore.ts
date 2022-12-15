// Packages
import {app, ipcMain} from 'electron';

// Packages
import {rmdir} from 'fs/promises';
import {join} from 'path';

// Types
import {Channels} from '../../../../types/channels';

// Response type
export interface DeleteStoreResponse {
  success?: boolean;
  message?: string;
}

// Get all entries
export default ipcMain.handle(
  Channels.DELETE_STORE, // BUG: #53 This will not work no matter what I do
  async (): Promise<DeleteStoreResponse> => {
    // Paths
    const rootPath = app.getPath('userData'); // Path to the top level of the data folder
    const storePath = join(rootPath, 'store'); // Path to the store folder

    try {
      // Delete the store folder
      console.log('DeleteStore: Deleting store folder');
      rmdir(storePath, {recursive: true});
      console.log('DeleteStore: Store folder deleted');
      return {
        success: true,
        message: 'Store deleted successfully',
      };
    } catch (error) {
      console.log('DeleteStore: Error deleting store folder');
      if (error instanceof Error) {
        console.log(error.message);
        return {
          success: false,
          message: error.message,
        };
      } else {
        console.log('DeleteStore: Unknown error');
        return {
          success: false,
          message: 'Unknown error',
        };
      }
    }
  },
);
