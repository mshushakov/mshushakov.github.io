const url = 'https://jsonplaceholder.typicode.com';

const api = {
    posts: {
        get() {
            return new Promise((resolve, reject) => {
                fetch(`${url}/posts`)
                    .then(response => response.json())
                    .then(json => resolve(json))
                    .catch(e => reject(e))
            })
        }
    },

    users: {
        get() {
            return new Promise((resolve, reject) => {
                fetch(`${url}/users`)
                    .then(response => response.json())
                    .then(json => resolve(json))
                    .catch(e => reject(e))
            })
        }
    }
}

export default api;