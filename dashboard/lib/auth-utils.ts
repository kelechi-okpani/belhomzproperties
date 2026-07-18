export function isTokenExpired(
    token: string | null | undefined
): boolean {
    if (!token) return true;

    try {
        const payload = token.split(".")[1];

        if (!payload) {
            return true;
        }

        let base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        while (base64.length % 4) {
            base64 += "=";
        }

        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((char) =>
                    "%" +
                    ("00" + char.charCodeAt(0).toString(16)).slice(-2)
                )
                .join("")
        );

        const { exp } = JSON.parse(json);

        if (typeof exp !== "number") {
            return true;
        }

        const CLOCK_SKEW = 30 * 1000;

        return Date.now() >= exp * 1000 - CLOCK_SKEW;
    } catch {
        return true;
    }
}

//
// export function isTokenExpired(token: string | undefined | null): boolean {
//     if (!token) return true;
//
//     try {
//         const base64Url = token.split(".")[1];
//         if (!base64Url) return true;
//         const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//         const jsonPayload = decodeURIComponent(
//             atob(base64)
//                 .split("")
//                 .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//                 .join("")
//         );
//         const { exp } = JSON.parse(jsonPayload);
//         if (!exp) return false;
//
//         // Returns true if current time (in seconds) >= token exp
//         return Date.now() >= exp * 1000;
//     } catch {
//         return true; // Treat invalid tokens as expired
//     }
// }