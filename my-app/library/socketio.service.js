import { io, Manager } from 'socket.io-client';

export let socket;
export let manager;
import { useBaseUrl } from './AxiosProvider';
export const initiateSocketConnection = () => {
	const { url } = useBaseUrl();
	socket = io(url, {
		secure: true,
	});
	manager = new Manager(url);

	console.log(`Connecting socket...`);
};

export const disconnectSocket = () => {
	console.log('Disconnecting socket...');
	if (socket) socket.disconnect();
};

// export const Manager = Manage;
