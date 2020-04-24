<template>
  <div class="mgr-container">
    <div class="books-table">
      <div class="books-table-header">
        <p class="table-title">图书目录 (共收录{{ booksCount }}本图书)</p>
        <el-input-number
          class="books-btn"
          v-model="currentShowPage"
          @change="onPageChanged"
          :min="1"
          :max="booksListPage">
        </el-input-number>
        <el-button
          type="success"
          class="books-btn"
          @click="onAddToRecommendClicked"
          plain>加入推荐</el-button>
      </div>
      <el-table
        :data="books"
        tooltip-effect="dark"
        @selection-change="onSelectedBooksChanged"
        ref="BooksTable">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="书名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          width="80">
        </el-table-column>
        <el-table-column
          label="状态"
          :formatter="formatBookState"
          width="80">
        </el-table-column>
        <el-table-column
          prop="total_chars"
          label="字数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="total_reads"
          label="阅读数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="total_searches"
          label="搜索数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="total_votes"
          label="投票数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="last_update_time"
          label="更新时间"
          width="160">
        </el-table-column>
        <el-table-column
          prop="score"
          label="评分"
          width="80">
        </el-table-column>
        <el-table-column
          label="性别"
          width="80"
          :formatter="formatBookGender">
        </el-table-column>
      </el-table>
    </div>
    <div class="books-side-table">
      <el-tabs
        v-model="activeRecommend"
        type="card"
        @tab-click="onRecommendTabClicked">
        <el-tab-pane
          v-for="recommend in recommends"
          :key="recommend.name"
          :label="recommend.label"
          :name="recommend.name">
          <el-table
            :data="recommend.books"
            tooltip-effect="dark"
            @selection-change="onRecommendBooksChanged"
            @row-click="onDirectorRecommendClicked">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="书名">
            </el-table-column>
            <el-table-column
              prop="author"
              label="作者"
              width="80">
            </el-table-column>
            <el-table-column
              v-if="activeRecommend == 'directorRecommend'"
              label="推荐人"
              width="120"
              :formatter="formatBookRecommender">
            </el-table-column>
            <el-table-column
              v-if="activeRecommend == 'directorRecommend'"
              label="推荐语"
              :formatter="formatBookRecommendWords">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="books-recommend-btn-container">
        <el-button type="primary"
          @click="onRecommendDelClicked"
          icon="el-icon-delete">删除推荐</el-button>
        <el-button type="primary"
          @click="onRecommendSubmmitClicked"
          icon="el-icon-upload">提交推荐</el-button>
      </div>
      <el-tabs
        v-model="activeBulletin"
        type="card"
        @tab-click="onBulletinTabClicked">
        <el-tab-pane
          v-for="bulletin in bulletins"
          :key="bulletin.name"
          :label="bulletin.label"
          :name="bulletin.name">
          <el-table
            :data="bulletin.books"
            tooltip-effect="dark">
            <el-table-column
              prop="name"
              label="书名">
            </el-table-column>
            <el-table-column
              prop="author"
              label="作者"
              width="80">
            </el-table-column>
            <el-table-column
              label="指数"
              width="120"
              :formatter="formatBulletinBookIndex">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      title="图书推荐文案编辑"
      :visible.sync="directorEditing"
      width="40%">
      <el-input
        type="textarea"
        :rows="10"
        placeholder="请输入推荐文字"
        v-model="recommendEditingText">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="directorEditing = false">取 消</el-button>
        <el-button type="primary" @click="onRecommendEditDoneClicked">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
module.exports = {
  data () {
    return {
      books: [],
      booksInfo: {
        count: 0,
        pages: 0
      },
      currentReqPage: 1,
      currentShowPage: 1,
      recommends: [
        {label: '首页推荐', name: 'firstPageRecommend', books: [], clazz: "fprecommend"},
        {label: '女生推荐', name: 'girlBookRecommend', books: [], clazz: "girlrecommend"},
        {label: '书架推荐', name: 'shelfRecommend', books: [], clazz: "shelfrecommend"},
        {label: '主编推荐', name: 'directorRecommend', books: [], clazz: "directorrecommend"},
        {label: '完本推荐', name: 'finishedRecommend', books: [], clazz: "finishedrecommend"}
      ],
      activeRecommend: 'firstPageRecommend',
      bulletins: [
        {label: '投票榜', name: 'voteBulletin', books: [], clazz: "votes"},
        {label: '阅读榜', name: 'readBulletin', books: [], clazz: "reads"},
        {label: '字数榜', name: 'charsBulletin', books: [], clazz: "chars"},
        {label: '搜索榜', name: 'searchBulletin', books: [], clazz: "searches"},
        {label: '评分榜', name: 'scoreBulletin', books: [], clazz: "score"},
        {label: '收藏榜', name: 'traceBulletin', books: [], clazz: "traces"}
      ],
      activeBulletin: 'voteBulletin',
      recommendCandidateBooks: [],
      recommendSelectedBooks: [],
      directorEditing: false,
      recommendEditingBook: {},
      recommendEditingText: '',
      recommender: ''
    }
  },
  methods: {
    onRecommendSubmmitClicked: function () {
      var booksObj = this.findActiveRecommend()
      if (this.activeRecommend === 'directorRecommend') {
        for (var i in booksObj.books) {
          if (booksObj.books[i].rwords === undefined || booksObj.books[i].rwords === null || booksObj.books[i].rwords === '') {
            this.$notify.error({
              title: '推荐文案缺失',
              message: '图书' + booksObj.books[i].name + '缺少推荐文案，请先填写推荐文案然后提交！'
            })
            return
          }
        }
      }
      if (booksObj != null) {
        api.recommendBooks(booksObj.clazz, booksObj.books)
        .then((res) => {
          if (0 != res.data.code) {
            console.log(res)
            this.$notify.error({
              title: '提交失败',
              message: '推荐图书提交失败(' + res.data.error + ')，请重新提交！'
            })
            return
          }
          this.$notify.success({
            title: '提交成功',
            message: '推荐图书提交完成！'
          })
        })
        .catch((e) => {
          this.$notify.error({
            title: '网络错误',
            message: '推荐图书提交失败，请重新提交！'
          })
        })
      }
    },
    onRecommendDelClicked: function () {
      var booksObj = this.findActiveRecommend()
      if (booksObj != null) {
        var books = booksObj.books
        for (var i in this.recommendSelectedBooks) {
          booksObj.books.splice(booksObj.books.indexOf(this.recommendSelectedBooks[i]))
        }
      }
      this.recommendSelectedBooks = []
    },
    onAddToRecommendClicked: function () {
      var booksObj = this.findActiveRecommend()
      if (booksObj != null) {
        for (var i in this.recommendCandidateBooks) {
          if (booksObj.books.indexOf(this.recommendCandidateBooks[i]) < 0) {
            booksObj.books.push(this.recommendCandidateBooks[i])
          }
        }
        this.recommendCandidateBooks = []
        this.$refs.BooksTable.clearSelection()
      }
    },
    onSelectedBooksChanged: function (val) {
      this.recommendCandidateBooks = val
    },
    onRecommendBooksChanged: function (val) {
      this.recommendSelectedBooks = val
    },
    processBooksResponse: function (obj, res) {
      if (res.data.code != 0) {
          console.log(res.data.error)
          return
        }
      obj.books = res.data.body.books.slice(0, 9)
    },
    getClazzRecommendBooks: function (obj) {
      api.booksByClazz(obj.clazz)
      .then((res) => {
        this.processBooksResponse(obj, res)
      })
      .catch((e) => {
        console.log(e)
      })
    },
    getClazzBulletinBooks: function (obj) {
      api.booksByClazzAndPage(obj.clazz, 1)
      .then((res) => {
        this.processBooksResponse(obj, res)
      })
      .catch((e) => {
        console.log(e)
      })
    },
    onRecommendTabClicked: function (tab, ev) {
      var booksObj = this.recommends[tab.index]
      this.getClazzRecommendBooks(booksObj)
      this.recommendSelectedBooks = []
    },
    onBulletinTabClicked: function (tab, ev) {
      var booksObj = this.bulletins[tab.index]
      this.getClazzBulletinBooks(booksObj)
    },
    onDirectorRecommendClicked: function (row, column, ev) {
      if (this.activeRecommend === 'directorRecommend') {
        this.directorEditing = true
        this.recommendEditingBook = row
        this.recommendEditingText = this.formatBookRecommendWords(row, column)
        // Here we should get current login user
        this.recommender = this.formatBookRecommender(row, column)
      }
    },
    onRecommendEditDoneClicked: function () {
      this.directorEditing = false

      this.recommendEditingBook.rwords = this.recommendEditingText
      this.recommendEditingBook.ruser = this.recommender

      var booksObj = this.findActiveRecommend()
      var books = []
      books = books.concat(booksObj.books)
      booksObj.books = books
    },
    onPageChanged: function (page) {
      this.currentReqPage = page
      this.$emit('get_books')
    },
    formatBulletinBookIndex: function (row, column) {
      switch (this.activeBulletin) {
      case 'voteBulletin':    return row.total_votes
      case 'readBulletin':    return row.total_reads
      case 'charsBulletin':   return row.total_chars
      case 'searchBulletin':  return row.total_searches
      case 'scoreBulletin':   return row.score
      case 'traceBulletin':   return 0
      }
    },
    formatBookState: function (row, column) {
      return row.finished ? '已完结' : '连载中'
    },
    formatBookGender: function (row, column) {
      return row.gender === 'girl' ? '女生' : '默认'
    },
    formatBookRecommendWords: function (row, column) {
      if (row.rwords === undefined || row.rwords === null) {
        return ''
      }
      return row.rwords
    },
    formatBookRecommender: function (row, column) {
      if (row.ruser === undefined || row.ruser === null) {
        return '风云一散人'
      }
      return row.ruser
    },
    getBooks: function () {
      api.books(this.currentReqPage)
      .then((res) => {
        if (0 != res.data.code) {
          console.error(res.data.error)
          return
        }
        this.books = res.data.body.books
        this.currentShowPage = this.currentReqPage
      })
      .catch ((e) => {
        console.error(e)
      })
    },
    getBooksInfo: function () {
      api.booksInfo()
      .then((res) => {
        if (0 != res.data.code) {
          console.error(res.data.error)
          return
        }
        this.booksInfo = res.data.body
        this.$emit('get_books')
      })
      .catch ((e) => {
        console.error(e)
        this.$emit('get_books_info')
      })
    },
    findActiveRecommend: function () {
      for (var i in this.recommends) {
        if (this.recommends[i].name === this.activeRecommend) {
          return this.recommends[i]
        }
      }
      return null
    },
    findActiveBulletin: function () {
      for (var i in this.bulletins) {
        if (this.bulletins[i].name === this.activeBulletin) {
          return this.bulletins[i]
        }
      }
      return null
    }
  },
  created () {
    this.$on('get_books', this.getBooks)
    this.$on('get_books_info', this.getBooksInfo)
  },
  mounted () {
    this.$emit('get_books_info')

    var booksObj = this.findActiveRecommend()
    if (booksObj != null) {
      this.getClazzRecommendBooks(booksObj)
    }

    booksObj = this.findActiveBulletin()
    if (booksObj != null) {
      this.getClazzBulletinBooks(booksObj)
    }
  },
  computed: {
    booksCount: function () {
      return this.booksInfo.count
    },
    booksListPage: function () {
      return this.booksInfo.pages
    }
  }
}
</script>
<style scoped>
.mgr-container {
  width: 100%;
  margin: 10px;
  display: flex;
}
.books-table {
  margin: 10px;
}
.table-title {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  width: 100%;
}
.books-table-header {
  display: flex;
}
.books-btn {
  margin: 8px;
}
.books-recommend-btn-container {
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
}
.books-side-table {
  margin-right: 10px;
}
</style>
