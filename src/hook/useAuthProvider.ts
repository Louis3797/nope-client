import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { SERVER_URL } from "@/constant";
import { AuthContextType, User } from "@/types";
import { useSnackbar } from "notistack";
import { number } from "yup";

const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    async function checkUser() {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        if (router.pathname !== "/signup" ) {
          router.push("/signin");
        }
        return;
      }

      try {
        const res = await axios.post(SERVER_URL + "/api/verify-token", {
          token,
        });
        console.log(res);
        console.log(res.data.user);
        if (res.status === 200) {
          if (!user) {
            setUser(res.data.user);
          }

          setLoading(false);
        } else {
          router.push("/signin");
          setUser(null);
        }
      } catch (err: unknown | Error) {
        console.error(err);
        setUser(null);
        router.push("/signin");
      }
    }
    console.log(user);
    checkUser();
  }, [router]);

  const signUp = async (
    username: string,
    firstname: string,
    lastname: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await axios.post<
        { username: string; password: string },
        { token: string }
      >(SERVER_URL + "/api/auth/register", {
        username,
        firstname,
        lastname,
        password,
      });

      return true;
    } catch (e: Error | unknown) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
      console.log(e);
      return false;
    }
  };

  const signIn = async (
    username: string,
    password: string
  ): Promise<{ token: string }> => {
    const response = await axios.post<
      { username: string; password: string },
      any
    >(SERVER_URL + "/api/auth/login", {
      username,
      password,
    });

    sessionStorage.setItem("access_token", response?.data?.accessToken);
    console.log(response);
    setLoading(false);
    console.log(user, response?.data?.user);
    // setUser(response?.data?.user);
    return { token: response?.data?.accessToken };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
  };
};

export default useAuthProvider;
