<template>
  <div id="app">
    <HelloWorld msg="GraphQl Demo" />
    <input type="text" v-model="username" placeholder="input the username" @keydown.enter="getUser">
    <div class="buttons">
      <button @click="getUser">获取用户信息</button>
      <button @click="getFollowers">获取该用户追随者</button>
      <button @click="getRepos">获取该用户仓库</button>
      <button @click="getByGraphQl">使用graphQl获取以上三者的信息</button>
      <button @click="clear">clear</button>
    </div>
    <div v-if="user">
      <h2>Profile</h2>
      <img class="avatar" :src="user.avatar_url || user.avatarUrl" alt="avatar">
      <p>Id: {{user.id}}</p>
      <p>Name: {{user.name}}</p>
      <p>Location: {{user.location}}</p>
      <p>Followers: {{followersCount}}</p>
    </div>
    <div class="followers" v-if="followers">
      <h2>Followers</h2>
      <p v-for="(item, index) in followers" :key="index">
        <img :src="item.avatar_url || item.avatarUrl">
        <span>{{item.login}}</span>
      </p>
    </div>
    <div class="repos" v-if="repos">
      <h2>Repos</h2>
      <p v-for="(item, index) in repos" :key="index">
        <span>{{item.id}}</span>
        <span>{{item.name}}</span>
      </p>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'
import { token } from '../sc'
axios.defaults.headers.common['Authorization'] = `token ${token}`
const restUrl = 'https://api.github.com'
export default {
  name: 'app',
  data() {
    return {
      username: 'yyx990803',
      user: null,
      followers: null,
      repos: null,
      followersCount: 0
    }
  },
  components: {
    HelloWorld
  },
  methods: {
    // 获取用户信息
    async getUser() {
      const { data } = await axios.get(`${restUrl}/users/${this.username}`)
      this.user = data
      this.followersCount = data.followers
    },
    // 获取追随者信息
    async getFollowers() {
      const { data } = await axios.get(
        `${restUrl}/users/${this.username}/followers`
      )
      this.followers = data
    },
    // 获取仓库信息
    async getRepos() {
      const { data } = await axios.get(
        `${restUrl}/users/${this.username}/repos`
      )
      this.repos = data
    },
    // 通过graphQl获取以上三条信息
    async getByGraphQl() {
      const query = `
      {
        user(login: ${this.username}) {
          id
          name
          location
          avatarUrl
          followers(first: 25) {
            totalCount
            nodes {
              avatarUrl
              login
            }
          }
          repositories(first: 25) {
            nodes {
              id
              name
            }
          }
        }
      }

      `
      const { data } = await axios.post('https://api.github.com/graphql', {
        query
      })
      const { user } = data.data
      const { followers, repositories } = user
      this.user = user
      this.followersCount = followers.totalCount
      this.followers = followers.nodes
      this.repos = repositories.nodes
    },
    clear() {
      this.user = null
      this.followers = null
      this.repos = null
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 800px;
  margin: 0 auto;
}

.buttons {
  margin: 20px 0;
}

button {
  border: 1px solid #2c3e50;
  margin: 10px;
  font-size: small;
  padding: 10px;
  border-radius: 3px;
  cursor: pointer;
  background: #fff;
}

h2 {
  margin: 50px 0 10px;
  text-align: left;
}

.avatar {
  display: inline-block;
  height: 200px;
  width: 200px;
}
input {
  outline: none;
  border: 1px solid #2c3e50;
  padding: 5px 10px;
  font-size: 18px;
  border-radius: 3px;
  width: 200px;
}

p {
  width: 600px;
}
.followers {
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
.repos {
  p {
    text-align: left;
  }
  span {
    margin: 0 20px;
  }
}
</style>
