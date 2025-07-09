import { useEffect, useState } from "react";

function useDebounce(value, delayTime) {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value);
        }, delayTime);

        return () => 
            {clearTimeout(handler)};
    }, [value, delayTime]);

    return debounceValue;
}

export default useDebounce;