import { FileUtils } from './file';

describe('FileUtils', () => {

  it('should pass extension', () => {
    expect(FileUtils.hasExtension('olia.wav', ['.wav', '.mp3', '.mp4'])).toBeTruthy();
    expect(FileUtils.hasExtension('olia.mp3', ['.wav', '.mp3', '.mp4'])).toBeTruthy();
    expect(FileUtils.hasExtension('olia.mp4', ['.wav', '.mp3', '.mp4'])).toBeTruthy();
    expect(FileUtils.hasExtension('olia.WAV', ['.wav', '.mp3', '.mp4'])).toBeTruthy();
  });

  it('should reject extension', () => {
    expect(FileUtils.hasExtension('olia.txt', ['.wav', '.mp3', '.mp4'])).toBeFalsy();
    expect(FileUtils.hasExtension('olia.mp33', ['.wav', '.mp3', '.mp4'])).toBeFalsy();
    expect(FileUtils.hasExtension('oliamp4', ['.wav', '.mp3', '.mp4'])).toBeFalsy();
  });

  it('should create file', () => {
    const f = FileUtils.fromData('https://olia/', 'ttt');
    expect(f.name).toEqual('ttt');
  });
});
