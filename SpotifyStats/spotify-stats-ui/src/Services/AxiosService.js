//FROM https://gist.github.com/mariocesar/e96f6cf6cb2db213173a9c08b9a9867a
import axios from "axios";
var Config = require('../config')

const singleton = Symbol();
const singletonEnforcer = Symbol();

// function readCookie(name) {
//     const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
//     return (match ? decodeURIComponent(match[3]) : null);
// }


class AxiosService {
    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw new Error('Cannot construct singleton');
        }

        this.session = axios.create({
            baseURL: `${Config.baseBackendUrl}`,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Headers': '*'
            }
            // headers: {
            //     'X-Requested-With': 'XMLHttpRequest',
            //     'X-CSRFToken': readCookie('csrftoken'),
            // },
        });
    }

    static get instance() {
        // Try to get an efficient singleton
        if (!this[singleton]) {
            this[singleton] = new AxiosService(singletonEnforcer);
        }

        return this[singleton];
    }

    get = (...params) => this.session.get(...params);
    post = (...params) => this.session.post(...params);
    put = (...params) => this.session.put(...params);
    patch = (...params) => this.session.patch(...params);
    remove = (...params) => this.session.delete(...params);
}

export default AxiosService.instance;