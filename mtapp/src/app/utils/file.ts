
export class FileUtils {
    public static fromData(data: any, name: string): File {
        return new File([data], name);
    }

    public static hasExtension(filename: string, extensions: string[]): boolean {
        const lfn = (filename || '').toLowerCase();
        for (const ext of extensions) {
            if (lfn.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }
}
