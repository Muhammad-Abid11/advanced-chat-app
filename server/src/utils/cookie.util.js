export const setTokenCookies = (res, accessToken, refreshToken) => {
    const accessTokenMaxAge = (Number(process.env.ACCESS_TOKEN_EXPIRE) || 7) * 24 * 60 * 60 * 1000; // 7 days
    const refreshTokenMaxAge = (Number(process.env.REFRESH_TOKEN_EXPIRE) || 30) * 24 * 60 * 60 * 1000; // 30 days

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: accessTokenMaxAge
    });

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: refreshTokenMaxAge
    });
};

export const clearTokenCookies = (res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
};