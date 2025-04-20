/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useRouter } from 'next/router';
import { ReactNode, ReactElement, useEffect, use } from 'react'
import { ACCESS_TOKEN, USER_DATA } from 'src/configs/auth';
import { getTemporaryToken, removeLocalUserData, removeTemporaryToken } from 'src/helpers/storage';
import { useAuth } from 'src/hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props;
  const authContext = useAuth();
  const router = useRouter();

  useEffect(() => {
    const {temporaryToken} = getTemporaryToken();
    if (!router.isReady) {
      return
    }
    if (authContext.user === null && !window.localStorage.getItem(ACCESS_TOKEN) && !window.localStorage.getItem(USER_DATA) && !temporaryToken) {
      if (router.asPath !== "/" && router.asPath !== "/login") {
        router.replace({
          pathname: "/login",
          query: {returnUrl: router.asPath}
        })
      } else {
        router.replace("/login");
      }
      authContext.setUser(null);
      removeLocalUserData();
    }
  }, [router.route]);

  useEffect(() => {
    const handleUnLoad = () => {
      removeTemporaryToken();
    }
    window.addEventListener("beforeunload", handleUnLoad);
    
    return () => {
      window.addEventListener("beforeunload", handleUnLoad);
    }
  }, []);

  if (authContext.loading || authContext.user === null) {
    return fallback;
  }

  return <>{children}</>
}

export default AuthGuard
