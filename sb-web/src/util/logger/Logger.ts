export class Log {
    prod: boolean = process.env.NODE_ENV === 'production';

    public group(action: string): void {
        if (this.prod) {
            console.group(`ACTION > ${action}`);
        }
    }

    public prev(message: unknown): void {
        if (this.prod) {
            console.group('PREV STATE');
            console.log(message);
            console.groupEnd();
        }
    }

    public next(message: unknown): void {
        if (this.prod) {
            console.group('NEXT STATE');
            console.log(message);
            console.groupEnd();
            console.groupEnd();
        }
    }
}
