<template>
  <div id="app">
    <svg width=500 height=500 viewBox="-1 -1 2 2">
      <circle
        v-for="point in points"
        :cx="point.x"
        :cy="point.y"
        :fill="fun(point.x) > point.y ? 'red' : 'green'"
        :stroke="point.predicted ? 'black' : 'cyan'"
        stroke-width="0.0075"
        r="0.025"
      ></circle>
      <line
      stroke="blue"
      stroke-width="0.015"
      :x1="-1"
      :y1="fun(-1)"
      :x2="1"
      :y2="fun(1)"></line>
      <line
      stroke="black"
      stroke-width="0.015"
      :x1="-1"
      :y1="p.fun(-1)"
      :x2="1"
      :y2="p.fun(1)"></line>
    </svg>
  </div>
</template>

<script>
import { Perceptron } from './Perceptron'

function randInRange(start, end) {
  let dif = end - start
  return Math.random() * dif + start
}

export default {
  name: 'App',
  data: function() {
    return {
      points: [...Array(1000)].map(_ => { return {
        x: randInRange(-1, 1),
        y: randInRange(-1, 1),
        predicted: false
      }}),
      m: Math.tan(randInRange(-Math.PI/2, Math.PI/2)),
      b: randInRange(-1, 1),
      p: new Perceptron()
    }
  },
  methods: {
    fun(x) {
      return x * this.m + this.b
    },
    truth(x, y) {
      return this.fun(x) > y ? 1 : -1
    },
    train() {
      this.points.forEach(point =>
        point.predicted = this.p.train( point.x, point.y, this.truth(point.x, point.y) ) === 0)
      this.$forceUpdate()
      setTimeout(() => {
        if (this.points.filter(point => ! point.predicted).length > 0) {
          this.train()
        }
      }, 50)
    }
  },
  mounted: function () {
    this.train()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
