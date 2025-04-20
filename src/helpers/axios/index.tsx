import axios from "axios";
import { BASE_URL, CONFIG_API } from "src/configs/api";
import { getLocalUserData, getTemporaryToken, removeLocalUserData, removeTemporaryToken, setLocalUserData, setTemporaryToken } from "../storage";
import { jwtDecode } from "jwt-decode";
import { FC } from "react";
import { NextRouter, useRouter } from "next/router";
import { useAuth } from "src/hooks/useAuth";
import { UserDataType } from "src/contexts/types";
import toast from "react-hot-toast";
 
const instanceAxios = axios.create({ baseURL: BASE_URL });

type TAxiosInterceptor = {
    children: React.ReactNode
}

const handleRedirectLogin = (router: NextRouter, setUser: (data: UserDataType | null) => void) => {
    if (router.asPath !== "/") {
        router.replace({
            pathname: "/login",
            query: {returnUrl: router.asPath}
        })
    } else {
        router.replace("/login");
    }
    setUser(null);
    removeLocalUserData();
    removeTemporaryToken();
}

const AxiosInterceptor: FC<TAxiosInterceptor> = ({ children }) => {
    const router = useRouter();
    const { user, setUser } = useAuth();

    instanceAxios.interceptors.request.use(async config => {
        const { accessToken, refreshToken } = getLocalUserData();
        const { temporaryToken } = getTemporaryToken();
        
        if (accessToken || temporaryToken) {
            let decodedAccessToken: any = {};
            if (accessToken) {
                decodedAccessToken = jwtDecode(accessToken);
            } else if (temporaryToken) { 
                decodedAccessToken = jwtDecode(temporaryToken);
            }
            
            if (decodedAccessToken?.exp > Date.now() / 1000) {
                config.headers["Authorization"] = `Bearer ${accessToken ? accessToken : temporaryToken}`;
            } else {
                if (refreshToken) {
                    const decodedRefreshToken: any = jwtDecode(refreshToken);
                    if (decodedRefreshToken?.exp > Date.now() / 1000) {
                        await axios.post(`${CONFIG_API.AUTH.INDEX}/refresh-token`, {}, {
                            headers: {
                                Authorization: `Bearer ${refreshToken}`
                            }
                        }).then((res) => {
                            const newAccessToken = res?.data?.data.access_token;
                            if (newAccessToken) {
                                config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                                if (accessToken) {
                                    setLocalUserData(JSON.stringify(user), newAccessToken, refreshToken);
                                } else {
                                    setLocalUserData(JSON.stringify(user), "", refreshToken);
                                    setTemporaryToken(newAccessToken);
                                }
                            } else {
                                handleRedirectLogin(router, setUser);
                            }
                        }).catch(e => {
                            handleRedirectLogin(router, setUser);
                        }) 
                    } else {
                        handleRedirectLogin(router, setUser);
                    }
                } else {
                    handleRedirectLogin(router, setUser);
                }
            }
        } else {
            handleRedirectLogin(router, setUser);
        }
        return config;
    })
    
    instanceAxios.interceptors.response.use((response) => {
        return response;
    })
    
    return <>{children}</>
}


export default instanceAxios;
export { AxiosInterceptor };