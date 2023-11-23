import axios from 'axios';

export function createAxiosInstance(authToken: string) {
	return axios.create({
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	});
}
