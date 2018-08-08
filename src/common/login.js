import login from '../common/nenglong.http'
import cookies from '../common/nenglong.cookies'
let user = {
	"account" : 'wujian',
	"password" : '8KyaODC7YqDo2kxYOwc5+A==',
	'systemId' : 'first'
},user2 = {'account':'luojian','password':'luojianluojian','systemId' : 'first'}
login.post('/api-user/api/loginBySystem',user2,function(response) {
	var token = response.data.result;
	cookies.setCookie('token',token);
})