export const baseToURL = (base64str: string, type: string) => {
	const binary = atob(base64str.replace(/\s/g, ''));
	const len = binary.length;
	const buffer = new ArrayBuffer(len);
	const view = new Uint8Array(buffer);
	for (let i = 0; i < len; i++) view[i] = binary.charCodeAt(i);
	const blob = new Blob([view], { type });
	return URL.createObjectURL(blob);
};

export const binaryToURL = (buffer: any, type: string) => {
	const binary = buffer.data.join(', ');
	const str = `data:${type};base64,${btoa(binary)}`
	console.log(str);
	return str;
}