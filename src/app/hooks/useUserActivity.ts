import { useEffect } from "react";

export function useUserActivity(onActivity: () => void) {
    useEffect(() => {
        const handleActivity = () => {
            onActivity();
        };

        const events = ["mousemove", "mousedown", "click", "scroll", "keydown", "touchstart"];

        events.forEach((event) => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [onActivity]);
}
