import {
	GETHOST
} from './mutation-types.js'
export default {
	getHost(context) {
		context.commit(GETHOST)
	}
}