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
    <p>create <input type="number" v-model.lazy.number="numberOfPoints" :placeholder="points.length" min="0">new points</p>
    delay: <input type="number" v-model.number="delay" placeholder="delay" min="0" max="1000">ms
    <p>step: <input type="number" v-model.number="p.step" placeholder="step" min="0" max="10"></p>
    <p>slope: <input type="range" v-model.number="slope" :min="-90" :max="90" step="0.1"></p>
    <p>b: <input type="range" v-model.number="b" :min="-1 - m" :max="1 + m" step="0.001"></p>
    <p>f(x) = x * {{m}} + {{b}}</p>
    <p>f(x) = x * {{-p.weights[0]/p.weights[1]}} + {{-p.weights[2]/p.weights[1]}}</p>
    <p>Weights:</p>
    <p>{{p.weights}}</p><button @click="randomizeWeights">randomize</button><br>
    <button @click="train">retrain</button>
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
      numberOfPoints: 1000,
      slope: randInRange(-Math.PI/2, Math.PI/2),
      b: randInRange(-1, 1),
      p: new Perceptron(),
      delay: 50
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
      }, this.delay)
    },
    randomizeWeights() {
      this.p.weights = this.p.weights.map(weight => weight = weight * randInRange(-2, 2))
    }
  },
  computed: {
    points() {
      return [...Array(this.numberOfPoints)].map(_ => { return {
        x: randInRange(-1, 1),
        y: randInRange(-1, 1),
        predicted: false
      }})
    },
    m() { return Math.tan(this.slope * (Math.PI /180)) }
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
