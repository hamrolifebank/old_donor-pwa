import API from '../constants/api';
import axios from 'axios';
import qs from 'query-string';

axios.defaults.headers.common['access_token'] =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMGNjZmMyYzRkOGFmMTI2ZjZjOGZlZTc4ZThjYjg5Zjk6YTVjOTYxZDRiNDFlOGQzOTUxZDk5YWU2MzQ3NzdiZGVmNzE3M2UzNTlkYjgwNjQwZGFjZTRjZDBmODZlZjg1ZjE4ZGUxODM3NGRjNWJkYzA1YTViMDA1NWY2NGRhYzc3N2VkNTY3NTdhZDIzMzIxZTRhMDA5N2QyMTI1MDkxMDExMGQ5MzQ1ZWRkOTYzYTQ0ODk3ZTE3NWY0YjQyOTFkYTRjYjU0NGIxYzBlMDUwNjE0NzBlYTYxM2ZlNDlkMjc0NDE2N2IyZDk1NzUyMTRlMDhlZjk0NThjYmUzMjY5NzciLCJpYXQiOjE2MzQ3OTkzNTUsImV4cCI6MjQzNDc5OTM1NX0.lpTTbmWf3SJq26fTh9NMIvJULi57oyec_d9sVAIpwRk';

export function get(query) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.EVENTS}?${qs.stringify(query)}`)
			.then(res => resolve(res.data))
			.catch(err => {
				console.log(err);
				reject(err.response.data);
			});
	});
}
