import React, { createContext, useMemo, useContext } from 'react';
import Axios from 'axios';
import getConfig from 'next/config';
const AxiosContext = createContext();

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
const serverUrl = serverRuntimeConfig.uri;
const publicUrl = publicRuntimeConfig.uri;

// const url = 'http://localhost:5000/socket';
const url = 'https://bbshohoz.com/socket';

const devBaseUrl = url;
// process.env.NODE_ENV === 'development'
// 	? process.env.API_URI
// 	: process.env.API_URI;
const productionBaseUrl = url;
// process.env.NODE_ENV === 'development'
// 	? process.env.API_URI
// 	: process.env.API_URI;

export function AxiosProvider({ children }) {
	const axios = useMemo(() => {
		const axios = Axios.create({
			headers: {
				'Content-Type': 'application/json',
			},
		});

		axios.interceptors.request.use((config) => {
			// Read token for anywhere, in this case directly from localStorage
			if (String(window.location.href).indexOf('localhost') > -1) {
				config.baseURL = devBaseUrl;
			} else {
				config.baseURL = productionBaseUrl;
			}
			const token = localStorage.getItem('accessToken');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		return axios;
	}, []);

	return (
		<AxiosContext.Provider value={axios}>{children}</AxiosContext.Provider>
	);
}

export function useAxios() {
	return useContext(AxiosContext);
}

export function useBaseUrl() {
	var url = devBaseUrl;
	return {
		url,
	};
}
