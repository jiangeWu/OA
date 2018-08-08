import {
	GETHOST
} from "./mutation-types.js"
export default {
	[GETHOST] (state) {
		console.log(state.host);
	}
}