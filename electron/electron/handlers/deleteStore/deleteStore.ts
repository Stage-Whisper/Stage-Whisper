import { ipcMain } from 'electron';
import { DeleteStoreResponse } from '../../types/channels';

// File to import all data from the data folder
import { app } from 'electron';
import { rmdir } from 'fs/promises';
import { join } from 'path';
import { Channels } from '../../types/channels';

// Paths
const rootPath = app.getPath('userData'); // Path to the top level of the data folder
const storePath = join(rootPath, 'store'); // Path to the store folder

// Get all entries
export default ipcMain.handle(
  Channels.deleteStore, // BUG: #53 This will not work no matter what I do
  async (): Promise<DeleteStoreResponse> => {
    try {
      // Delete the store folder
      console.log('DeleteStore: Deleting store folder');
      rmdir(storePath, { recursive: true });
      console.log('DeleteStore: Store folder deleted');
      return {
        success: true,
        message: 'Store deleted successfully'
      };
    } catch (error) {
      console.log('DeleteStore: Error deleting store folder');
      if (error instanceof Error) {
        console.log(error.message);
        return {
          success: false,
          message: error.message
        };
      } else {
        console.log('DeleteStore: Unknown error');
        return {
          success: false,
          message: 'Unknown error'
        };
      }
    }
  }
);
