// export const BASE_URL = 'https://cdn.afrocamgist.com/';
// export const BASE_URL = 'https://storage.googleapis.com/cdn.afrocamgist.com/';
let BASE_URL;

// if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
// 	BASE_URL = 'https://cdn.staging.afrocamgist.com/';
// } else {
// 	BASE_URL = 'https://cdn.afrocamgist.com/';
// }

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	BASE_URL = 'http://localhost/';
} else {
	BASE_URL = 'http://localhost/';
}


export { BASE_URL };
