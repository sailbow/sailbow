import { useState, useEffect } from 'react';

const DEBOUNCE_TIME = 500;

export const useDebounce = (): [(inputValue: number | string, callback: (value: any) => void) => void] => {
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const debounce = (inputValue: number | string, callback: (value: any) => void): void => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            setDebounceTimer(null);
        }

        setDebounceTimer(
            setTimeout(() => {
                return callback(inputValue);
            }, DEBOUNCE_TIME),
        );
    };

    return [debounce];
};

export const usePagination = (callback: () => any): void => {
    useEffect(() => {
        const handleScroll = () => {
            const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

            if (bottom) {
                callback();
            }
        };

        window.addEventListener('scroll', handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [callback]);
};

export const useLongPress = (callback: () => void, ms = 300): any => {
    const [startLongPress, setStartLongPress] = useState(false);

    useEffect(() => {
        let timerId: any;
        if (startLongPress) {
            timerId = setTimeout(callback, ms);
        } else {
            clearTimeout(timerId);
        }

        return () => {
            clearTimeout(timerId);
        };
    }, [callback, ms, startLongPress]);

    return {
        onMouseDown: () => setStartLongPress(true),
        onMouseUp: () => setStartLongPress(false),
        onMouseLeave: () => setStartLongPress(false),
        onTouchStart: () => setStartLongPress(true),
        onTouchEnd: () => setStartLongPress(false),
    };
};
