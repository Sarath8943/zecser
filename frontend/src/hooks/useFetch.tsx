// import { useState, useEffect, useCallback } from "react";
// import { AxiosRequestConfig, AxiosResponse } from "axios";
// import { axiosInstance } from "../config/AxiosInstance";

// type FetchError = {
//   message: string;
//   response?: {
//     status: number;
//     data: any;
//   };
// };

// const useFetch = <T = any>(
//   url: string,
//   params: Record<string, any> = {},
//   config?: AxiosRequestConfig
// ): [T | null, boolean, FetchError | null, () => Promise<void>] => {
//   const [data, setData] = useState<T | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<FetchError | null>(null);

//   const fetchData = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response: AxiosResponse<T> = await axiosInstance({
//         url,
//         params,
//         ...config,
//       });
//       setData(response.data);
//     } catch (err: any) {
//       setError(err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [url, JSON.stringify(params), JSON.stringify(config)]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return [data, isLoading, error, fetchData];
// };

// export default useFetch;
