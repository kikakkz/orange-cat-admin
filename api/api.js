const axiosInstance = axios.create({
  baseURL: 'http://118.31.3.109',
  timeout: 10000
})

const api = new Object({
  booksInfo: function () {
    return axiosInstance.get('/books?a=c')
  },
  books: function (page) {
    return axiosInstance.get('/books?a=l&p=' + page)
  },
  booksByClazz: function (clazz) {
    return axiosInstance.get('/books?a=l&c=' + clazz)
  },
  booksByClazzAndPage: function (clazz, page) {
    return axiosInstance.get('/books?a=l&c=' + clazz + '&p=' + page)
  },
  recommendBooks: function (clazz, books) {
    return axiosInstance.post('/books', {
      action: 'set',
      key: 'recommend',
      body: {
        clazz: clazz,
        books: books
      }
    })
  }
})