export class Log {
    public group(action: string): void {
        console.group(`ACTION > ${action}`);
    }

    public prev(message: unknown): void {
        console.group('PREV STATE');
        console.log(message);
        console.groupEnd();
    }

    public next(message: unknown): void {
        console.group('NEXT STATE');
        console.log(message);
        console.groupEnd();
        console.groupEnd();
    }
}
