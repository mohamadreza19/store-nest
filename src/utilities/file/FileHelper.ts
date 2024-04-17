import fs, { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { UUID } from 'mongodb';
import { join } from 'path';
import { FileTypeE } from 'src/files/file.interfaces';

const PUBLICPATH = join(__dirname, '..', '..', '..', 'asset', 'public');
const PRIVATEPATH = join(__dirname, '..', '..', '..', 'asset', 'private');
Buffer;

type where = 'public' | 'private';
type TFormatToSave = '.webp' | '.mp4';

export class FileHelper {
  private static basePath: string = null;

  static where(basePath: where) {
    switch (basePath) {
      case 'public':
        this.basePath = PUBLICPATH;
        break;
      case 'private':
        this.basePath = PRIVATEPATH;
        break;
    }
    return this;
  }

  /**
   * Reads a file from the specified path relative to the base path.
   * @param {string} fileName - The name of the file to read.
   * @returns {Buffer} The contents of the file.
   * @example
   * // first call .where
   * // Set base path
   * FileHelper.where('public');
   * // Read the file named 'foo.webp' from the base path
   * const fileContents = FileHelper.readFile('foo.webp');
   */
  static readFile(fileName: string) {
    const joinedPath = join(this.basePath, fileName);
    return readFileSync(joinedPath);
  }

  static craeteFile(formatToSave: TFormatToSave, buffer: Buffer) {
    const generatedId = new UUID().toString();
    const name = generatedId + '_' + formatToSave;
    const joinedPath = join(this.basePath, name);

    writeFileSync(joinedPath, buffer);

    return name;
  }

  /**
   * Delete the given fileName and replace with newFile and return newFileName
   * @param {string} fileName - The fileName that saved in document
   * @param {string} formatToSave - The format that file be saved with it
   */

  static updateFile(
    fileName: string,
    formatToSave: TFormatToSave,
    buffer: Buffer,
  ) {
    this.removeFile(fileName);
    return this.craeteFile(formatToSave, buffer);
  }
  static removeFile(fileName: string) {
    const joinedPath = join(this.basePath, fileName);
    return unlinkSync(joinedPath);
  }
  static convetMimetypeToFormat(mimetype: string) {
    if (mimetype.includes(FileTypeE.WEBP))
      return ('.' + FileTypeE.WEBP) as TFormatToSave;

    if (mimetype.includes(FileTypeE.MP4))
      return ('.' + FileTypeE.MP4) as TFormatToSave;
  }
}
