export const setTokenCookie = (res, token) => {
    const cookieExpireDays = Number(process.env.COOKIE_EXPIRES) || 7;
    const maxAge = cookieExpireDays * 24 * 60 * 60 * 1000;
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge
    });
};

export const clearTokenCookie = (res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
};