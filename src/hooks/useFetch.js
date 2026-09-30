import { useState, useEffect } from "react";

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const optionsString = JSON.stringify(options);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, JSON.parse(optionsString));

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, optionsString]);

  const request = async (requestUrl, requestOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(requestUrl, requestOptions);

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const post = async (requestUrl, body, requestOptions = {}) =>
    request(requestUrl, {
      ...requestOptions,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(requestOptions.headers || {}),
      },
      body: JSON.stringify(body),
    });

  const patch = async (requestUrl, body, requestOptions = {}) =>
    request(requestUrl, {
      ...requestOptions,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(requestOptions.headers || {}),
      },
      body: JSON.stringify(body),
    });

  const put = async (requestUrl, body, requestOptions = {}) =>
    request(requestUrl, {
      ...requestOptions,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(requestOptions.headers || {}),
      },
      body: JSON.stringify(body),
    });

  const del = async (requestUrl, requestOptions = {}) =>
    request(requestUrl, {
      method: "DELETE",
      ...requestOptions,
    });

  return {
    data,
    loading,
    error,
    request,
    post,
    patch,
    put,
    del,
  };
};

export default useFetch;
